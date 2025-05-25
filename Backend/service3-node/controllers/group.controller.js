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
        group_name: group.name,
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
  // exports.inviteUser= async (req, res) => {
  //   try {
  //     const { groupId, userId } = req.params;
  //     const inviterId = req.user.id;
  //     const djangoUrl = await discoverDjangoService();

  //     const group = await Group.findById(groupId);
  //     if (!group) return res.status(404).json({ error: "Groupe non trouvé" });

  //     if (group.chef_id !== inviterId) {
  //       return res
  //         .status(403)
  //         .json({ error: "Seul le chef peut inviter des membres" });
  //     }
  //     const userResponse = await axios.get(`${djangoUrl}/etudiants/${userId}/`, {
  //       headers: { Authorization: req.headers.authorization },
  //     });

  //     if (group.members.includes(parseInt(userId))) {
  //       return res
  //         .status(400)
  //         .json({ error: "L'utilisateur est déjà membre du groupe" });
  //     }
  //     if (group.invitations.includes(parseInt(userId))) {
  //       return res.status(400).json({ error: "L'utilisateur a déjà été invité" });
  //     }
  //     group.invitations.push(parseInt(userId));
  //     await group.save();

  //     res.json({
  //       success: true,
  //       message: "Invitation envoyée avec succès",
  //       invited_user: {
  //         id: userId,
  //         name: `${userResponse.data.prenom} ${userResponse.data.nom}`,
  //       },
  //     });
  //   } catch (error) {
  //     console.error("Erreur invitation:", error);
  //     if (error.response?.status === 404) {
  //       return res.status(404).json({ error: "Utilisateur non trouvé" });
  //     }
  //     res.status(500).json({ error: "Erreur lors de l'envoi de l'invitation" });
  //   }
  // };

// exports.acceptInvitation=async (req, res) => {
//     try {
//       const { groupId } = req.params;
//       const userId = req.user.id;

//       const group = await Group.findById(groupId);
//       if (!group) return res.status(404).json({ error: "Groupe non trouvé" });

//       if (!group.invitations.includes(parseInt(userId))) {
//         return res
//           .status(400)
//           .json({ error: "Vous n'avez pas d'invitation pour ce groupe" });
//       }

//       if (group.members.length >= 5) {
//         return res.status(400).json({ error: "Le groupe est déjà complet" });
//       }

//       group.members.push(parseInt(userId));
//       group.invitations = group.invitations.filter(
//         (id) => id !== parseInt(userId)
//       );
//       await group.save();

//       // Recalculate group average
//       const moyenne = await calculateGroupAverage(group._id, req);
//       await Group.findByIdAndUpdate(group._id, { moyenne_groupe: moyenne });

//       res.json({
//         success: true,
//         message: "Vous avez rejoint le groupe avec succès",
//         group: {
//           id: group._id,
//           name: group.name,
//           members: group.members,
//         },
//       });
//     } catch (error) {
//       console.error("Erreur acceptation:", error);
//       res
//         .status(500)
//         .json({ error: "Erreur lors de l'acceptation de l'invitation" });
//     }
//   };
exports.acceptInvitation = async (req, res) => {
    try {
        const { groupId } = req.params;
        const userId = req.user.id;

        // 1. Récupérer le groupe
        const group = await Group.findById(groupId);
        if (!group) return res.status(404).json({ error: "Groupe non trouvé" });

        // 2. Vérifier l'invitation
        if (!group.invitations.includes(parseInt(userId))) {
            return res.status(400).json({ error: "Vous n'avez pas d'invitation pour ce groupe" });
        }

        // 3. Récupérer les infos de l'étudiant
        const djangoUrl = await discoverDjangoService();
        const userResponse = await axios.get(`${djangoUrl}/etudiants/${userId}/`, {
            headers: { Authorization: req.headers.authorization }
        });
        
        const userAnneeEtude = userResponse.data.annee_etude;
        if (!userAnneeEtude) {
            return res.status(400).json({ error: "Votre année d'étude n'est pas définie" });
        }

        // 4. Récupérer les paramètres de groupe pour l'année
        const parametresResponse = await axios.get(`${djangoUrl}/parametre-groups/by-annee/?annee=${userAnneeEtude}`, {
            headers: { Authorization: req.headers.authorization }
        });

        if (!parametresResponse.data || parametresResponse.data.length === 0) {
            return res.status(400).json({ 
                error: "Configuration des groupes non définie pour cette année",
                annee: userAnneeEtude
            });
        }

        const parametres = parametresResponse.data[0];
        const maxMembres = parseInt(parametres.nbr_max);
        const minMembres = parseInt(parametres.nbr_min);

        // 5. Vérifier la capacité du groupe
        if (group.members.length >= maxMembres) {
            return res.status(400).json({ 
                error: `Le groupe a atteint sa capacité maximale (${maxMembres} membres)`,
                max_members: maxMembres,
                current_members: group.members.length
            });
        }

        // 6. Vérifier la cohérence de l'année
        if (group.annee_etude && group.annee_etude !== userAnneeEtude) {
            return res.status(400).json({ 
                error: "Incompatibilité d'année d'étude",
                details: `Le groupe est pour l'année ${group.annee_etude} et vous êtes en année ${userAnneeEtude}`
            });
        }

        // 7. Ajouter le membre
        group.members.push(parseInt(userId));
        group.invitations = group.invitations.filter(id => id !== parseInt(userId));
        
        // Si c'est le premier membre, définir l'année du groupe
        if (group.members.length === 1) {
            group.annee_etude = userAnneeEtude;
        }
        
        await group.save();

        // 8. Calculer la nouvelle moyenne
        const moyenne = await calculateGroupAverage(group._id, req);
        await Group.findByIdAndUpdate(group._id, { moyenne_groupe: moyenne });

        // 9. Vérifier si le groupe est complet
        const isComplete = group.members.length >= minMembres && group.members.length <= maxMembres;

        res.json({
            success: true,
            message: "Vous avez rejoint le groupe avec succès",
            group: {
                id: group._id,
                name: group.name,
                members: group.members,
                annee_etude: group.annee_etude,
                is_complete: isComplete
            },
            constraints: {
                min_members: minMembres,
                max_members: maxMembres,
                current_members: group.members.length
            }
        });

    } catch (error) {
        console.error("Erreur acceptation:", error);
        
        if (error.response?.status === 404) {
            return res.status(404).json({ 
                error: "Ressource non trouvée",
                details: error.response.data
            });
        }

        res.status(500).json({ 
            error: "Erreur lors de l'acceptation de l'invitation",
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};
// Accept an invitation to join a group
// exports.inviteUser = async (req, res) => {
//     try {
//         const { groupId, userId } = req.params;
//         const inviterId = req.user.id;

//         // 1. Récupérer le groupe
//         const group = await Group.findById(groupId);
//         if (!group) {
//             return res.status(404).json({ error: "Groupe non trouvé" });
//         }

//         // 2. Vérifier les droits du chef
//         if (group.chef_id !== inviterId) {
//             return res.status(403).json({ 
//                 error: "Action réservée au chef de groupe",
//                 required_role: "chef",
//                 current_user: inviterId
//             });
//         }

//         // 3. Vérifier si l'utilisateur est déjà membre
//         if (group.members.includes(parseInt(userId))) {
//             return res.status(400).json({
//                 error: "L'utilisateur est déjà membre du groupe",
//                 user_id: userId,
//                 group_id: groupId
//             });
//         }

//         // 4. Récupérer les infos de l'étudiant depuis Django
//         const djangoUrl = await discoverDjangoService();
//         const userResponse = await axios.get(`${djangoUrl}/etudiants/${userId}/`, {
//             headers: { Authorization: req.headers.authorization }
//         });

//         // 5. Ajouter l'invitation (sans vérifier les doublons)
//         await Group.findByIdAndUpdate(
//             groupId,
//             { $addToSet: { invitations: parseInt(userId) } },
//             { new: true }
//         );

//         // 6. Réponse
//         res.json({
//             success: true,
//             message: "Invitation envoyée avec succès",
//             invitation: {
//                 group: {
//                     id: group._id,
//                     name: group.name
//                 },
//                 user: {
//                     id: userId,
//                     full_name: `${userResponse.data.prenom} ${userResponse.data.nom}`,
//                     email: userResponse.data.email // Optionnel
//                 },
//                 timestamp: new Date().toISOString()
//             }
//         });

//     } catch (error) {
//         console.error("Erreur invitation:", error);
        
//         // Gestion spécifique des erreurs API Django
//         if (error.response?.status === 404) {
//             return res.status(404).json({ 
//                 error: "Utilisateur non trouvé",
//                 user_id: userId
//             });
//         }

//         res.status(500).json({ 
//             error: "Erreur lors du traitement de l'invitation",
//             details: process.env.NODE_ENV === 'development' ? error.message : undefined
//         });
//     }
// };
exports.inviteUser = async (req, res) => {
    try {
        const { groupId, userId } = req.params;
        const inviterId = req.user.id;

        // 1. Récupérer le groupe
        const group = await Group.findById(groupId);
        if (!group) {
            return res.status(404).json({ error: "Groupe non trouvé" });
        }

        // 2. Vérifier les droits du chef
        if (group.chef_id !== inviterId) {
            return res.status(403).json({ 
                error: "Action réservée au chef de groupe",
                required_role: "chef",
                current_user: inviterId
            });
        }

        // 3. Vérifier si l'utilisateur est déjà membre ou invité
        if (group.members.includes(parseInt(userId))) {
            return res.status(400).json({
                error: "L'utilisateur est déjà membre du groupe",
                user_id: userId,
                group_id: groupId
            });
        }

        // 4. Vérifier si l'utilisateur a déjà rejoint un autre groupe
        const existingGroup = await Group.findOne({ 
            members: { $in: [parseInt(userId)] } 
        });
        
        if (existingGroup) {
            return res.status(400).json({
                error: "L'utilisateur a déjà rejoint un autre groupe",
                user_id: userId,
                existing_group_id: existingGroup._id,
                existing_group_name: existingGroup.name
            });
        }

        // 5. Récupérer les infos de l'étudiant
        const djangoUrl = await discoverDjangoService();
        const userResponse = await axios.get(`${djangoUrl}/etudiants/${userId}/`, {
            headers: { Authorization: req.headers.authorization }
        });
        
        const userAnneeEtude = userResponse.data.annee_etude;
        if (!userAnneeEtude) {
            return res.status(400).json({ 
                error: "L'année d'étude de l'utilisateur n'est pas définie",
                user_id: userId
            });
        }

        // 6. Récupérer les paramètres de groupe
        const parametresResponse = await axios.get(`${djangoUrl}/parametre-groups/by-annee/?annee=${userAnneeEtude}`, {
            headers: { Authorization: req.headers.authorization }
        });

        if (!parametresResponse.data || parametresResponse.data.length === 0) {
            return res.status(400).json({ 
                error: "Configuration des groupes non définie pour cette année",
                annee: userAnneeEtude
            });
        }

        const parametres = parametresResponse.data[0];
        const maxMembres = parseInt(parametres.nbr_max);
        const minMembres = parseInt(parametres.nbr_min);

        // 7. Vérifier la capacité du groupe
        if (group.members.length >= maxMembres) {
            return res.status(400).json({ 
                error: `Le groupe a atteint sa capacité maximale (${maxMembres} membres)`,
                max_members: maxMembres,
                current_members: group.members.length
            });
        }

        // 8. Vérifier la cohérence de l'année
        if (group.annee_etude && group.annee_etude !== userAnneeEtude) {
            return res.status(400).json({ 
                error: "Incompatibilité d'année d'étude",
                details: `Le groupe est pour l'année ${group.annee_etude} et l'utilisateur est en année ${userAnneeEtude}`
            });
        }

        // 9. Envoyer l'invitation
        await Group.findByIdAndUpdate(
            groupId,
            { $addToSet: { invitations: parseInt(userId) } },
            { new: true }
        );

        res.json({
            success: true,
            message: "Invitation envoyée avec succès",
            invitation: {
                group: {
                    id: group._id,
                    name: group.name,
                    annee_etude: group.annee_etude
                },
                user: {
                    id: userId,
                    full_name: `${userResponse.data.prenom} ${userResponse.data.nom}`,
                    email: userResponse.data.email,
                    annee_etude: userAnneeEtude
                },
                constraints: {
                    min_members: minMembres,
                    max_members: maxMembres,
                    current_members: group.members.length
                },
                timestamp: new Date().toISOString()
            }
        });

    } catch (error) {
        console.error("Erreur invitation:", error);
        
        if (error.response?.status === 404) {
            return res.status(404).json({ 
                error: "Utilisateur non trouvé",
                user_id: userId
            });
        }

        res.status(500).json({ 
            error: "Erreur lors du traitement de l'invitation",
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
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
  exports.getUserInvitations = async (req, res) => {
  try {
    const userId = req.user.id;
    const djangoUrl = await discoverDjangoService();

    const groups = await Group.find({ invitations: parseInt(userId) });

    const invitations = await Promise.all(
      groups.map(async (group) => {
        const chefResponse = await axios.get(
          `${djangoUrl}/etudiants/${group.chef_id}/`,
          {
            headers: { Authorization: req.headers.authorization },
          }
        );
        return {
          group_id: group._id,
          group_name: group.name,
          chef_name: `${chefResponse.data.prenom} ${chefResponse.data.nom}`,
          created_at: group.created_at,
        };
      })
    );

    res.json({
      success: true,
      invitations,
    });
  } catch (error) {
    console.error("Erreur liste invitations:", error);
    res
      .status(500)
      .json({ error: "Erreur lors de la récupération des invitations" });
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
              email: chef.email,
              annee_etude: chef.annee_etude || null
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

// exports.getAllGroups = async (req, res) => {
//     try {
//         // Récupérer tous les groupes avec les informations de base
//         const groups = await Group.find({})
//             .select('name chef_id members created_at moyenne_groupe annee_academique_id')
//             .lean();

//         res.json({
//             success: true,
//             count: groups.length,
//             groups
//         });
//     } catch (error) {
//         console.error("[ERROR] Getting all groups:", error);
//         res.status(500).json({ 
//             success: false,
//             error: "Erreur serveur lors de la récupération des groupes"
//         });
//     }
// };
exports.assignUserToGroup = async (req, res) => {
    try {
        const { groupId, userId } = req.params;
        const adminId = req.user.id;

        // 1. Vérifier que l'utilisateur est admin
        const djangoUrl = await discoverDjangoService();
        const adminCheck = await axios.get(`${djangoUrl}/admins/${adminId}/`, {
            headers: { Authorization: req.headers.authorization }
        });

        if (!adminCheck.data.isAdmin) {
            return res.status(403).json({ 
                error: "Action réservée aux administrateurs",
                required_role: "admin"
            });
        }

        // 2. Récupérer le groupe
        const group = await Group.findById(groupId);
        if (!group) {
            return res.status(404).json({ error: "Groupe non trouvé" });
        }

        // 3. Vérifier si l'utilisateur est déjà membre
        if (group.members.includes(parseInt(userId))) {
            return res.status(400).json({
                error: "L'utilisateur est déjà membre du groupe",
                user_id: userId,
                group_id: groupId
            });
        }

        // 4. Vérifier si l'utilisateur a déjà rejoint un autre groupe
        const existingGroup = await Group.findOne({ 
            members: { $in: [parseInt(userId)] },
            _id: { $ne: groupId } // Exclure le groupe actuel
        });
        
        if (existingGroup) {
            return res.status(400).json({
                error: "L'utilisateur a déjà rejoint un autre groupe",
                user_id: userId,
                existing_group_id: existingGroup._id,
                existing_group_name: existingGroup.name
            });
        }

        // 5. Récupérer les infos de l'étudiant
        const userResponse = await axios.get(`${djangoUrl}/etudiants/${userId}/`, {
            headers: { Authorization: req.headers.authorization }
        });
        
        const userAnneeEtude = userResponse.data.annee_etude;
        if (!userAnneeEtude) {
            return res.status(400).json({ 
                error: "L'année d'étude de l'utilisateur n'est pas définie",
                user_id: userId
            });
        }

        // 6. Récupérer les paramètres de groupe
        const parametresResponse = await axios.get(`${djangoUrl}/parametre-groups/by-annee/?annee=${userAnneeEtude}`, {
            headers: { Authorization: req.headers.authorization }
        });

        if (!parametresResponse.data || parametresResponse.data.length === 0) {
            return res.status(400).json({ 
                error: "Configuration des groupes non définie pour cette année",
                annee: userAnneeEtude
            });
        }

        const parametres = parametresResponse.data[0];
        const maxMembres = parseInt(parametres.nbr_max);
        const minMembres = parseInt(parametres.nbr_min);

        // 7. Vérifier la capacité du groupe
        if (group.members.length >= maxMembres) {
            return res.status(400).json({ 
                error: `Le groupe a atteint sa capacité maximale (${maxMembres} membres)`,
                max_members: maxMembres,
                current_members: group.members.length
            });
        }

        // 8. Vérifier la cohérence de l'année
        if (group.annee_etude && group.annee_etude !== userAnneeEtude) {
            return res.status(400).json({ 
                error: "Incompatibilité d'année d'étude",
                details: `Le groupe est pour l'année ${group.annee_etude} et l'utilisateur est en année ${userAnneeEtude}`
            });
        }

        // 9. Assigner l'utilisateur au groupe
        group.members.push(parseInt(userId));
        await group.save();

        // 10. Calculer la nouvelle moyenne du groupe
        const moyenne = await calculateGroupAverage(group._id, req);
        await Group.findByIdAndUpdate(group._id, { moyenne_groupe: moyenne });

        res.json({
            success: true,
            message: "Utilisateur assigné au groupe avec succès",
            assignment: {
                group: {
                    id: group._id,
                    name: group.name,
                    annee_etude: group.annee_etude || userAnneeEtude
                },
                user: {
                    id: userId,
                    full_name: `${userResponse.data.prenom} ${userResponse.data.nom}`,
                    email: userResponse.data.email,
                    annee_etude: userAnneeEtude
                },
                constraints: {
                    min_members: minMembres,
                    max_members: maxMembres,
                    current_members: group.members.length
                },
                assigned_by: adminId,
                timestamp: new Date().toISOString()
            }
        });

    } catch (error) {
        console.error("Erreur assignation:", error);
        
        if (error.response?.status === 404) {
            return res.status(404).json({ 
                error: "Utilisateur ou groupe non trouvé",
                details: error.response.data
            });
        }

        res.status(500).json({ 
            error: "Erreur lors de l'assignation de l'utilisateur au groupe",
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// const Group = require('../models/group.model'); // adapte selon ton chemin

exports.getGroupById = async (req, res) => {
    const groupId = req.params.id;

    try {
        const group = await Group.findById(groupId);
        if (!group) {
            return res.status(404).json({ error: 'Groupe non trouvé' });
        }

        return res.json(group);
    } catch (err) {
        return res.status(500).json({ error: 'Erreur serveur', details: err.message });
    }
};

exports.getAllGroups = async (req, res) => {
  try {
    const allGroups = await Group.find({}).lean();

    if (!allGroups.length) return res.json({ success: true, data: [] });

    const djangoUrl = await discoverDjangoService();
    if (!djangoUrl) throw new Error("Django service unavailable");

    const result = [];

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

        const moyenne = await calculateGroupAverage2(
          group.members,
          djangoUrl,
          req.headers.authorization
        );

        result.push({
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
          annee_etude: year,
          date_creation: group.created_at
        });

      } catch (error) {
        console.error(`Error processing group ${group._id}:`, error.message);
      }
    }

    res.json({
      success: true,
      data: result
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