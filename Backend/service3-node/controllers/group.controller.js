const Group = require('../models/Group');
const axios = require('axios');
const groupService = require('../services/group.service');
const { calculateGroupAverage, getMembersDetails, calculateGroupAverage2 } = require('../services/group.service');
const { discoverDjangoService } = require('../services/discovery.service');

exports.createGroup = async (req, res) => {
  try {
    const { name } = req.body;
    const creatorId = req.user.id;

    const currentYear = new Date().getFullYear();
    const nextYear = currentYear + 1;
    const month = new Date().getMonth();
    const anneeAcademique = month >= 8 ? `${currentYear}-${nextYear}` : `${currentYear-1}-${currentYear}`;

    const existingGroup = await Group.findOne({ 
      chef_id: creatorId, 
      annee_academique_id: anneeAcademique 
    });

    if (existingGroup) {
      return res.status(400).json({
        error: `Vous avez déjà créé un groupe pour ${anneeAcademique}`,
      });
    }

    const group = await Group.create({
      name,
      chef_id: creatorId,
      members: [creatorId],
      annee_academique_id: anneeAcademique,
      moyenne_groupe: null
    });

    const djangoUrl = await discoverDjangoService();
    await axios.patch(
      `${djangoUrl}/etudiants/${creatorId}/`,
      { chef_equipe: true },
      { headers: { Authorization: req.headers.authorization } }
    );

    const moyenne = await groupService.calculateGroupAverage(group._id, req.headers.authorization);
    const updatedGroup = await Group.findByIdAndUpdate(
      group._id,
      { moyenne_groupe: moyenne },
      { new: true }
    );

    res.status(201).json({
      success: true,
      group: updatedGroup,
      message: `Groupe créé pour ${anneeAcademique}`
    });
  } catch (error) {
    console.error("Erreur création groupe:", error.message);
    res.status(500).json({
      error: "Erreur lors de la création du groupe",
      details: process.env.NODE_ENV === 'development' ? error.message : null,
    });
  }
};
exports.getGroupMembers=async (req, res) => {
    try {
      const group = await Group.findById(req.params.id);
      if (!group) return res.status(404).json({ error: "Groupe non trouvé" });

      const djangoUrl = await discoverDjangoService();
      const membersDetails = await Promise.all(
        group.members.map(async (id) => {
          try {
            const response = await axios.get(`${djangoUrl}/etudiants/${id}/`, {
              headers: { Authorization: req.headers.authorization },
            });
            return response.data;
          } catch (error) {
            console.error(`[ERROR] Membre ${id}:`, error.message);
            return null;
          }
        })
      );
      res.json({
        success: true,
        members: membersDetails.filter((m) => m !== null),
        chef_id: group.chef_id,
      });
    } catch (error) {
      console.error("[ERROR]", error);
      res.status(500).json({ error: "Erreur serveur" });
    }
  };
exports. getUserGroups= async (req, res) => {
    try {
      const userId = parseInt(req.user.id);
      const joinedGroups = await Group.find({
        $or: [{ members: userId }, { chef_id: userId }],
      }).select("name chef_id members created_at");

      res.json(joinedGroups);
    } catch (error) {
      console.error("Error fetching joined groups:", error);
      res.status(500).json({
        error: "Error fetching your groups",
        details: error.message,
      });
    }
  };
  exports.inviteUser= async (req, res) => {
    try {
      const { groupId, userId } = req.params;
      const inviterId = req.user.id;
      const djangoUrl = await discoverDjangoService();

      const group = await Group.findById(groupId);
      if (!group) return res.status(404).json({ error: "Groupe non trouvé" });

      if (group.chef_id !== inviterId) {
        return res
          .status(403)
          .json({ error: "Seul le chef peut inviter des membres" });
      }
      const userResponse = await axios.get(`${djangoUrl}/etudiants/${userId}/`, {
        headers: { Authorization: req.headers.authorization },
      });

      if (group.members.includes(parseInt(userId))) {
        return res
          .status(400)
          .json({ error: "L'utilisateur est déjà membre du groupe" });
      }
      if (group.invitations.includes(parseInt(userId))) {
        return res.status(400).json({ error: "L'utilisateur a déjà été invité" });
      }
      group.invitations.push(parseInt(userId));
      await group.save();

      res.json({
        success: true,
        message: "Invitation envoyée avec succès",
        invited_user: {
          id: userId,
          name: `${userResponse.data.prenom} ${userResponse.data.nom}`,
        },
      });
    } catch (error) {
      console.error("Erreur invitation:", error);
      if (error.response?.status === 404) {
        return res.status(404).json({ error: "Utilisateur non trouvé" });
      }
      res.status(500).json({ error: "Erreur lors de l'envoi de l'invitation" });
    }
  };

exports.acceptInvitation=async (req, res) => {
    try {
      const { groupId } = req.params;
      const userId = req.user.id;

      const group = await Group.findById(groupId);
      if (!group) return res.status(404).json({ error: "Groupe non trouvé" });

      if (!group.invitations.includes(parseInt(userId))) {
        return res
          .status(400)
          .json({ error: "Vous n'avez pas d'invitation pour ce groupe" });
      }

      if (group.members.length >= 5) {
        return res.status(400).json({ error: "Le groupe est déjà complet" });
      }

      group.members.push(parseInt(userId));
      group.invitations = group.invitations.filter(
        (id) => id !== parseInt(userId)
      );
      await group.save();

      // Recalculate group average
      const moyenne = await calculateGroupAverage(group._id, req);
      await Group.findByIdAndUpdate(group._id, { moyenne_groupe: moyenne });

      res.json({
        success: true,
        message: "Vous avez rejoint le groupe avec succès",
        group: {
          id: group._id,
          name: group.name,
          members: group.members,
        },
      });
    } catch (error) {
      console.error("Erreur acceptation:", error);
      res
        .status(500)
        .json({ error: "Erreur lors de l'acceptation de l'invitation" });
    }
  };
exports.declineInvitation=async (req, res) => {
    try {
      const { groupId } = req.params;
      const userId = req.user.id;

      const group = await Group.findById(groupId);
      if (!group) return res.status(404).json({ error: "Groupe non trouvé" });

      if (!group.invitations.includes(parseInt(userId))) {
        return res
          .status(400)
          .json({ error: "Vous n'avez pas d'invitation pour ce groupe" });
      }

      group.invitations = group.invitations.filter(
        (id) => id !== parseInt(userId)
      );
      await group.save();

      res.json({
        success: true,
        message: "Invitation refusée avec succès",
      });
    } catch (error) {
      console.error("Erreur refus:", error);
      res.status(500).json({ error: "Erreur lors du refus de l'invitation" });
    }
  };
exports.getChefThemeChoices=async (req, res) => {
    try {
      const groups = await Group.find();
      const chefIds = groups.map(group => group.chef_id);

      const chefsSelections = await ThemeSelection.find({
        user_id: { $in: chefIds },
      });

      const groupsWithChefChoices = groups.map((group) => {
        const chefSelection = chefsSelections.find(sel => sel.user_id === group.chef_id);

        return {
          group_id: group._id,
          group_name: group.name,
          chef_id: group.chef_id,
          chef_choices: chefSelection?.choices || null,
        };
      });

      res.json(groupsWithChefChoices);
    } catch (error) {
      console.error("Erreur récupération choix des chefs:", error);
      res.status(500).json({ error: "Erreur serveur", details: error.message });
    }
  };
exports.recalculateAverage=async (req, res) => {
    try {
      const groupId = req.params.id;
      const moyenne = await calculateGroupAverage(groupId, req);
      
      const updatedGroup = await Group.findByIdAndUpdate(
        groupId,
        { moyenne_groupe: moyenne },
        { new: true }
      );

      res.json({
        success: true,
        group_id: groupId,
        nouvelle_moyenne: moyenne,
        group: updatedGroup
      });
    } catch (error) {
      console.error("Erreur recalcul moyenne:", error);
      res.status(500).json({ 
        error: "Erreur de calcul",
        details: error.message 
      });
    }
  };
  exports.getGroupsAverages=async (req, res) => {
    try {
      const allGroups = await Group.find({});
      
      const groupsWithAverages = await Promise.all(
        allGroups.map(async (group) => {
          const moyenne = await calculateGroupAverage(group._id, req);
          
          return {
            group_id: group._id,
            group_name: group.name,
            chef_id: group.chef_id,
            annee_academique: group.annee_academique_id || 'Non spécifiée',
            member_count: group.members?.length || 0,
            moyenne_groupe: moyenne,
            last_updated: group.updatedAt
          };
        })
      );

      res.json({
        success: true,
        count: groupsWithAverages.length,
        data: groupsWithAverages
      });
    } catch (error) {
      console.error("Erreur récupération moyennes:", error);
      res.status(500).json({
        success: false,
        error: "Erreur serveur",
        details: process.env.NODE_ENV === 'development' ? error.message : null
      });
    }
  };
  exports.getGroupsByStudyYear=async (req, res) => {
    try {
      const requestedYear = req.query.annee_etude ? Number(req.query.annee_etude) : null;
      const allGroups = await Group.find({}).lean();
      
      if (!allGroups.length) return res.json({ success: true, data: [] });

      const djangoUrl = await discoverDjangoService();
      if (!djangoUrl) throw new Error("Django service unavailable");

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

          if (requestedYear !== null && year !== requestedYear) continue;

          const moyenne = await calculateGroupAverage2(
            group.members,
            djangoUrl,
            req.headers.authorization
          );

          if (!result[year]) {
            result[year] = {
              annee_etude: year,
              groupes: []
            };
          }

          result[year].groupes.push({
            id: group._id,
            nom: group.name,
            chef: {
              id: chef.id,
              nom_complet: `${chef.prenom} ${chef.nom}`,
              email: chef.email
            },
            specialite: chef.specialite || null,
            nombre_membres: membersDetails.length,
            moyenne_groupe: moyenne,
            date_creation: group.created_at
          });

        } catch (error) {
          console.error(`Error processing group ${group._id}:`, error.message);
        }
      }

      const formattedResult = Object.values(result)
        .filter(yearData => yearData.groupes.length > 0)
        .sort((a, b) => {
          if (a.annee_etude === null) return 1;
          if (b.annee_etude === null) return -1;
          return a.annee_etude - b.annee_etude;
        });

      res.json({ 
        success: true, 
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
exports.getGroupsByYearAndSpecialty=async (req, res) => {
    try {
      const requestedYear = req.query.annee_etude ? Number(req.query.annee_etude) : null;
      const requestedSpecialty = req.query.specialite ? Number(req.query.specialite) : null;
      
      const allGroups = await Group.find({}).lean();
      if (!allGroups.length) {
        return res.json({ 
          success: true, 
          data: [],
          message: "No groups found" 
        });
      }

      const djangoUrl = await discoverDjangoService();
      if (!djangoUrl) throw new Error("Django service unavailable");

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

          const average = await calculateGroupAverage2(
            group.members,
            djangoUrl,
            req.headers.authorization
          );

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
            id: group._id,
            nom: group.name,
            chef: {
              id: chef.id,
              nom_complet: `${chef.prenom} ${chef.nom}`,
              email: chef.email
            },
            nombre_membres: membersDetails.length,
            moyenne_groupe: average,
            date_creation: group.created_at
          });

        } catch (error) {
          console.error(`Error processing group ${group._id}:`, error.message);
        }
      }

      const formattedResult = Object.values(result).map(yearData => ({
        annee_etude: yearData.annee_etude,
        specialites: Object.values(yearData.specialites)
      })).filter(year => year.specialites.length > 0);

      res.json({
        success: true,
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






// Add other group controller functions here...