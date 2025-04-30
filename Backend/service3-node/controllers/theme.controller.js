const ThemeSelection = require('../models/ThemeSelection');
const Group = require('../models/Group');
const { discoverService2, discoverDjangoService } = require('../services/discovery.service');
const axios = require('axios');

exports.getAvailableThemes = async (req, res) => {
  try {
    const { annee_etude, specialite } = req.query;
    const service2Url = await discoverService2();
    
    let apiUrl;
    if (annee_etude && specialite) {
      apiUrl = `${service2Url}/themes/by-annee-specialite/${annee_etude}/${specialite}/`;
    } else if (annee_etude) {
      apiUrl = `${service2Url}/themes/by-annee/${annee_etude}/`;
    } else {
      apiUrl = `${service2Url}/themes/`;
    }

    const response = await axios.get(apiUrl, {
      headers: { 
        Authorization: req.headers.authorization,
        'Content-Type': 'application/json'
      },
    });

    res.json({
      success: true,
      count: response.data.length,
      data: response.data,
      filters: {
        annee_etude: annee_etude || 'all',
        specialite: specialite || 'all'
      }
    });
  } catch (error) {
    console.error("Error fetching themes:", error);
    const statusCode = error.response?.status || 500;
    res.status(statusCode).json({
      success: false,
      error: "Error fetching themes",
      details: error.response?.data || error.message,
    });
  }
};

exports.getUserThemeChoices = async (req, res) => {
  try {
    const userId = req.user.id;
    const { groupId } = req.query;

    if (!groupId) {
      return res.status(400).json({ error: "GroupId is required" });
    }

    const selection = await ThemeSelection.findOne({ 
      user_id: userId, 
      group_id: groupId 
    });

    if (!selection) {
      return res.json({
        status: "not_started",
        choices: { p1: null, p2: null, p3: null },
      });
    }

    res.json(selection);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

exports.saveThemeChoices = async (req, res) => {
  try {
    const userId = req.user.id;
    const { p1, p2, p3, submit = false } = req.body;

    if (![p1, p2, p3].every((choice) => typeof choice === "number")) {
      return res.status(400).json({
        success: false,
        error: "All theme IDs must be numbers",
        invalid: {
          p1: typeof p1 !== "number",
          p2: typeof p2 !== "number",
          p3: typeof p3 !== "number",
        },
      });
    }

    const choices = [p1, p2, p3];
    if (new Set(choices).size !== 3) {
      const duplicates = choices.filter(
        (id, index) => choices.indexOf(id) !== index
      );
      return res.status(400).json({
        success: false,
        error: "All choices must be unique",
        duplicates,
      });
    }

    const service2Url = await discoverService2();
    const themeValidation = await Promise.all(
      choices.map(async (themeId) => {
        try {
          const response = await axios.get(`${service2Url}/themes/${themeId}`, {
            headers: { Authorization: req.headers.authorization },
            timeout: 3000,
          });
          return { valid: true, data: response.data };
        } catch (error) {
          return {
            valid: false,
            themeId,
            error:
              error.response?.status === 404
                ? "Theme not found"
                : "Validation failed",
          };
        }
      })
    );

    const invalidThemes = themeValidation.filter((result) => !result.valid);
    if (invalidThemes.length > 0) {
      return res.status(400).json({
        success: false,
        error: "Invalid theme selections",
        invalidThemes,
      });
    }

    const updateData = {
      choices: { p1, p2, p3 },
      status: submit ? "submitted" : "draft",
    };

    if (submit) {
      updateData.submitted_at = new Date();
    }

    const selection = await ThemeSelection.findOneAndUpdate(
      { user_id: userId },
      updateData,
      {
        upsert: true,
        new: true,
        runValidators: true,
      }
    );

    res.json({
      success: true,
      message: submit ? "Theme selections submitted" : "Draft saved",
      data: {
        selection,
        validatedThemes: themeValidation.map((t) => ({
          id: t.valid ? t.data.id : t.themeId,
          valid: t.valid,
        })),
      },
    });
  } catch (error) {
    console.error("Theme selection error:", {
      userId: req.user.id,
      error: error.message,
      stack: error.stack,
    });

    res.status(500).json({
      success: false,
      error: "Internal server error",
      ...(process.env.NODE_ENV === "development" && {
        details: error.message,
      }),
    });
  }
};

exports.getAllGroupsChoices = async (req, res) => {
  try {
    const requestedYear = req.query.annee_etude ? Number(req.query.annee_etude) : null;
    const requestedSpecialty = req.query.specialite ? Number(req.query.specialite) : null;

    const allGroups = await Group.find({}).lean();
    const djangoUrl = await discoverDjangoService();

    const result = {};
    
    for (const group of allGroups) {
      try {
        const membersDetails = await getMembersDetails(
          group.members,
          djangoUrl,
          req.headers.authorization
        );

        if (!membersDetails.length) continue;

        const chef = membersDetails.find(m => m.id === group.chef_id) || membersDetails[0];
        const year = typeof chef.annee_etude === 'number' ? chef.annee_etude : null;
        const specialty = typeof chef.specialite === 'number' ? chef.specialite : null;

        if (requestedYear !== null && year !== requestedYear) continue;
        if (requestedSpecialty !== null && specialty !== requestedSpecialty) continue;

        const selections = await ThemeSelection.find({ group_id: group._id }).lean();

        if (!result[year]) {
          result[year] = {
            annee_etude: year,
            specialites: {}
          };
        }

        if (!result[year].specialites[specialty]) {
          result[year].specialites[specialty] = {
            specialite: specialty,
            groupes: []
          };
        }

        result[year].specialites[specialty].groupes.push({
          group_id: group._id,
          group_name: group.name,
          chef: {
            id: chef.id,
            nom_complet: `${chef.prenom} ${chef.nom}`,
            email: chef.email
          },
          members: membersDetails.map(m => ({
            id: m.id,
            nom_complet: `${m.prenom} ${m.nom}`
          })),
          theme_selections: selections.map(sel => ({
            user_id: sel.user_id,
            choices: sel.choices,
            status: sel.status,
            submitted_at: sel.submitted_at
          }))
        });

      } catch (error) {
        console.error(`Error processing group ${group._id}:`, error.message);
      }
    }

    const formattedResult = Object.values(result).map(yearData => ({
      annee_etude: yearData.annee_etude,
      specialites: Object.values(yearData.specialites)
    }));

    res.json({
      success: true,
      count: formattedResult.reduce((total, year) => 
        total + year.specialites.reduce((sum, spec) => sum + spec.groupes.length, 0), 0),
      data: formattedResult
    });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

async function getMembersDetails(memberIds, djangoUrl, authHeader) {
  try {
    const results = await Promise.all(
      memberIds.map(async id => {
        try {
          const { data } = await axios.get(`${djangoUrl}/etudiants/${id}/`, {
            headers: { Authorization: authHeader },
            timeout: 3000
          });
          return data;
        } catch (error) {
          console.error(`Failed to fetch member ${id}:`, error.message);
          return null;
        }
      })
    );
    return results.filter(Boolean);
  } catch (error) {
    console.error("Error in getMembersDetails:", error);
    return [];
  }
}
exports.submitsheThemeChoices=   async (req, res) => {
    try {
      const userId = req.user.id;
      const { groupId, p1, p2, p3 } = req.body;
  
      if (!groupId) {
        return res.status(400).json({
          success: false,
          error: "Group ID is required",
        });
      }
  
      // Vérifier si l'utilisateur est chef du groupe
      const userGroup = await Group.findById(groupId);
  
      if (!userGroup) {
        return res.status(404).json({
          success: false,
          error: "Groupe introuvable",
        });
      }
  
      if (userGroup.chef_id !== userId) {
        return res.status(403).json({
          success: false,
          error: "Seul le chef de groupe peut soumettre la sélection",
        });
      }
  
      // Vérifier que p1, p2, p3 sont présents
      if (![p1, p2, p3].every((choice) => typeof choice === "number")) {
        return res.status(400).json({
          success: false,
          error: "Toutes les sélections doivent être des numéros",
        });
      }
  
      // Vérifier unicité des choix
      const choices = [p1, p2, p3];
      if (new Set(choices).size !== 3) {
        return res.status(400).json({
          success: false,
          error: "Les sélections doivent être uniques",
        });
      }
  
      // Créer ou mettre à jour la sélection
      const selection = await ThemeSelection.findOneAndUpdate(
        { user_id: userId },
        {
          user_id: userId,
          group_id: groupId,
          choices: { p1, p2, p3 },
          status: "submitted",
          submitted_at: new Date(),
        },
        { upsert: true, new: true, runValidators: true }
      );
  
      res.json({
        success: true,
        message: "Sélections soumises avec succès",
        data: selection,
      });
  
    } catch (error) {
      console.error("Erreur de soumission:", error);
      res.status(500).json({
        success: false,
        error: "Erreur serveur",
        details:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  };