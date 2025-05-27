// import React, { useEffect, useState, useRef } from 'react';
// import '../Styles/Group.css';
// import enteteImg from "../../../Assets/Images/entete.png";
// import { Link, useParams } from 'react-router-dom';
// import axios from 'axios';
// import '../../Partials/Components/i18n';
// import jsPDF from 'jspdf';
// import html2canvas from 'html2canvas';
// import { nodeAxios } from '../../../axios';
// import { axiosInstance } from '../../../axios';

// function GroupeAdmin() {
//     const { id } = useParams();
//     const [group, setGroup] = useState({});
//     const [showModal, setShowModal] = useState(false);
//     const [availableUsers, setAvailableUsers] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [selectedUsers, setSelectedUsers] = useState([]);
//     const [assigning, setAssigning] = useState(false);
//     const [successMessage, setSuccessMessage] = useState(null);
//     const [errorMessage, setErrorMessage] = useState(null);
//     const [loadingAssignment, setLoadingAssignment] = useState(false);
//     const [assignment, setAssignment] = useState(null);


//     const fetchGroupData = async () => {
//         try {
//             const response = await nodeAxios.get(`/groups/${id}`);
//             setGroup(response.data);
//         } catch (error) {
//             console.error("Erreur lors de la récupération du groupe:", error);
//         }
//     };
//     const fetchAssignmentData = async (id) => {
//         try {
//             setLoadingAssignment(true);
//             const response = await axiosInstance.get(`http://127.0.0.1:8003/assignments/${id}`);
//             setAssignment(response.data);
//         } catch (error) {
//             console.error("Erreur lors de la récupération de l'affectation:", error);
//             setAssignment(null);
//         } finally {
//             setLoadingAssignment(false);
//         }
//     };
//                 console.log("Affectation récupérée:", assignment.id);

// const formatThemeChoices = (choices) => {
//         if (!choices || choices.length === 0) return "Aucun choix enregistré";
        
//         return choices.map(choice => {
//             const memberName = `${choice.user_id}`; // Vous pourriez utiliser le nom réel ici
//             return (
//                 <div key={choice.user_id}>
//                     <strong>{memberName}:</strong> 
//                     {choice.choices.p1 ? ` 1er: ${choice.choices.p1}` : ''}
//                     {choice.choices.p2 ? `, 2ème: ${choice.choices.p2}` : ''}
//                     {choice.choices.p3 ? `, 3ème: ${choice.choices.p3}` : ''}
//                 </div>
//             );
//         });
//     };
//      // Fonction pour formater les membres du groupe
//     const formatGroupMembers = (members) => {
//         if (!members || members.length === 0) return "Aucun membre";
        
//         return members.map((member, index) => (
//             <div key={index}>
//                 {index + 1}. {member.prenom} {member.nom}
//             </div>
//         ));
//     };


//     useEffect(() => {
//         fetchGroupData();
//          fetchAssignmentData();
//     }, [id]);

//     useEffect(() => {
//         fetchGroupData();
//     }, [id]);

//     const fetchUsersWithoutGroup = async () => {
//         try {
//             setLoading(true);
//             const response = await nodeAxios.get(`/groups/without-group/${group.group.annee_etude}`);
//             setAvailableUsers(response.data.data || []);
//         } catch (error) {
//             console.error("Erreur lors de la récupération des utilisateurs:", error);
//             setErrorMessage("Erreur lors de la récupération des utilisateurs");
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleOpenModal = () => {
//         setSelectedUsers([]);
//         setSuccessMessage(null);
//         setErrorMessage(null);
//         fetchUsersWithoutGroup();
//         setShowModal(true);
//     };

//     const handleCloseModal = () => {
//         setShowModal(false);
//     };

//     const handleSelectUser = (userId) => {
//         setSelectedUsers(prev => 
//             prev.includes(userId) 
//                 ? prev.filter(id => id !== userId) 
//                 : [...prev, userId]
//         );
//     };

//     const handleAssignUsers = async () => {
//         if (selectedUsers.length === 0) {
//             setErrorMessage("Veuillez sélectionner au moins un utilisateur");
//             return;
//         }

//         try {
//             setAssigning(true);
//             setErrorMessage(null);
            
//             // Assigner chaque utilisateur sélectionné
//             const results = await Promise.all(
//                 selectedUsers.map(userId => 
//                     nodeAxios.post(`/groups/${id}/assign/${userId}`)
//                 )
//             );

//             // Vérifier si toutes les assignations ont réussi
//             const allSuccess = results.every(res => res.data.success);
            
//             if (allSuccess) {
//                 setSuccessMessage(`${selectedUsers.length} utilisateur(s) assigné(s) avec succès`);
//                 fetchGroupData(); // Rafraîchir les données du groupe
//                 fetchUsersWithoutGroup(); // Rafraîchir la liste des utilisateurs disponibles
//                 setSelectedUsers([]);
//             } else {
//                 setErrorMessage("Certaines assignations ont échoué");
//             }
//         } catch (error) {
//             console.error("Erreur lors de l'assignation:", error);
//             setErrorMessage(error.response?.data?.error || "Erreur lors de l'assignation");
//         } finally {
//             setAssigning(false);
//         }
//     };

//     // Fonctions pour le formatage du texte (conservées)
//     const textWithLineBreaks = (text) => {
//         return text.split('\n').map((line, index) => (
//             <React.Fragment key={index}>
//                 {line}
//                 <br />
//             </React.Fragment>
//         ));
//     };

//     const textWithLineCommas = (text) => {
//         return text.split(',').map((line, index) => (
//             <React.Fragment key={index}>
//                 {index + 1}. {line.trim().split(' ').map(word =>
//                     word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
//                 ).join(' ')}
//                 <br />
//             </React.Fragment>
//         ));
//     };

//     const pdfRef = useRef();
//     const handleDownloadPDF = async () => {
//         // ... (conservé de votre code original)
//     };

//     return (
//         <div className='Group-display-container' id='dynamic-list'>
//             <div className="Group-display-wrapper">
//                 <div className="title-display-Group" style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "0.5rem" }}>
//                     <h1 style={{ fontSize: "1.2rem", fontWeight: "500", color: "#4F4F4F", userSelect: "none" }}>
//                         <Link className='return-to-Groups' to={'/admin/groupes'}>Tous Les Groupes</Link> &gt; <span style={{ color: "#925FE2" }}> {group.group?.name} </span>
//                     </h1>
//                     <button
//                         className="assign-users-button"
//                         onClick={handleOpenModal}
//                     >
//                        Affecté des utilisateurs to group
//                     </button>
//                 </div>

//                 {/* Modal pour afficher et assigner les utilisateurs */}
//                 {showModal && (
//                     <div className="modal-overlay">
//                         <div className="modal-content">
//                             <div className="modal-header">
//                                 <h3>Utilisateurs sans groupe </h3>
//                                 <button onClick={handleCloseModal}>&times;</button>
//                             </div>
//                             <div className="modal-body">
//                                 {successMessage && (
//                                     <div className="alert alert-success">
//                                         {successMessage}
//                                     </div>
//                                 )}
//                                 {errorMessage && (
//                                     <div className="alert alert-error">
//                                         {errorMessage}
//                                     </div>
//                                 )}
                                
//                                 {loading ? (
//                                     <p>Chargement en cours...</p>
//                                 ) : availableUsers.length === 0 ? (
//                                     <p>Aucun utilisateur disponible sans groupe</p>
//                                 ) : (
//                                     <div className="user-list-container">
//                                         <table className="users-table">
//                                             <thead>
//                                                 <tr>
//                                                     <th>Sélection</th>
//                                                     <th>Nom complet</th>
//                                                     <th>Email</th>
//                                                     <th>Moyenne</th>
//                                                 </tr>
//                                             </thead>
//                                             <tbody>
//                                                 {availableUsers.map(user => (
//                                                     <tr key={user.id}>
//                                                         <td>
//                                                             <input
//                                                                 type="checkbox"
//                                                                 checked={selectedUsers.includes(user.id)}
//                                                                 onChange={() => handleSelectUser(user.id)}
//                                                             />
//                                                         </td>
//                                                         <td>{user.nom_complet}</td>
//                                                         <td>{user.email}</td>
//                                                         <td>{user.moyenne_etudiant ?? 'N/A'}</td>
//                                                     </tr>
//                                                 ))}
//                                             </tbody>
//                                         </table>
//                                     </div>
//                                 )}
//                             </div>
//                             <div className="modal-footer">
//                                 <button 
//                                     onClick={handleAssignUsers}
//                                     disabled={selectedUsers.length === 0 || assigning}
//                                 >
//                                     {assigning ? 'Assignation en cours...' : `Assigner (${selectedUsers.length})`}
//                                 </button>
//                                 <button onClick={handleCloseModal}>
//                                     Fermer
//                                 </button>
//                             </div>
//                         </div>
//                     </div>
//                 )}

               
//                  <div className="Group-pdf-container" ref={pdfRef}>
//                     <div className="pdf-form">
//                         <img src={enteteImg} alt="symbole esi-sba" />
//                         <div className="fiche-title">
//                             Fiche du Groupe
//                         </div>
//                         <div className="pdf-table-container">
//                             <div className="pdf-table">
//                                 <div className="pdf-line">
//                                     <span style={{ width: "200px", textAlign: "center", fontSize: "1.05rem" }}>Nom du Groupe</span>
//                                     <span style={{ width: "100%", paddingLeft: "10px", borderLeft: "1px solid #000" }}>
//                                      {group.group?.name || "Non spécifié"}
//                                     </span>
//                                 </div>
//                                 <div className="pdf-line">
//                                     <span style={{ width: "200px", textAlign: "center", fontSize: "1.05rem" }}>
//                                         Année Académique
//                                     </span>
//                                     <span style={{ width: "100%", paddingLeft: "10px", borderLeft: "1px solid #000" }}>
                                        
//                                     </span>
//                                 </div>
//                                 <div className="pdf-line">
//                                     <span style={{ width: "200px", textAlign: "center", fontSize: "1.05rem" }}>
//                                         Membres
//                                     </span>
//                                     <span style={{ width: "100%", paddingLeft: "10px", borderLeft: "1px solid #000" }}>
                                       
//                                     </span>
//                                 </div>
//                                 <div className="pdf-line">
//                                     <span style={{ width: "200px", textAlign: "center", fontSize: "1.05rem" }}>
//                                         Fiche des vœux
//                                     </span>
//                                     <span style={{ width: "100%", paddingLeft: "10px", borderLeft: "1px solid #000" }}>
//                                         {textWithLineBreaks("" || "")}
//                                     </span>
//                                 </div>
//                                 <div className="pdf-line">
//                                     <span style={{ width: "200px", textAlign: "center", fontSize: "1.05rem" }}>
//                                         Encadrant
//                                     </span>
//                                     <span style={{ width: "100%", paddingLeft: "10px", borderLeft: "1px solid #000" }}>
//                                         {textWithLineCommas("" || "")}
//                                     </span>
//                                 </div>
//                                 <div className="pdf-line">
//                                     <span style={{ width: "200px", textAlign: "center", fontSize: "1.05rem" }}>
//                                         Thème Assigné
//                                     </span>
//                                     <span style={{ width: "100%", paddingLeft: "10px", borderLeft: "1px solid #000" }}>
//                                         {textWithLineBreaks("" || "")}                                    </span>
//                                 </div>
//                             </div>
//                         </div>
//                         <div className="pdf-footer">
//                             <div className="pdf-footer-content">
//                                 <span>
//                                     École Supérieure en Informatique, BP 73, Bureau de Poste EL WIAM, 22000, Sidi Bel Abbes, Algerie
//                                 </span>
//                                 <div className="infos-footer">
//                                     <span>
//                                         Tel:  (213 ) 48 74 94 52
//                                     </span>
//                                     <span>
//                                         Fax:  (213 ) 48 74 94 50
//                                     </span>
//                                     <span>
//                                         www.esi-sba.dz
//                                     </span>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>

//             </div>
//         </div>
//     )
// }

// export default GroupeAdmin;
import React, { useEffect, useState, useRef } from 'react';
import '../Styles/Group.css';
import enteteImg from "../../../Assets/Images/entete.png";
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import '../../Partials/Components/i18n';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { nodeAxios } from '../../../axios';

// Configuration Axios pour le service Django
const djangoAxios = axios.create({
  baseURL: 'http://localhost:8003',
  timeout: 60000,
  headers: {
    Authorization: localStorage.getItem('access_token')
      ? 'JWT ' + localStorage.getItem('access_token')
      : null,
    'Content-Type': 'application/json',
    Accept: 'application/json'
  }
});

function GroupeAdmin() {
    const { id } = useParams();
    const [group, setGroup] = useState({});
    const [assignment, setAssignment] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [availableUsers, setAvailableUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [assigning, setAssigning] = useState(false);
    const [successMessage, setSuccessMessage] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);
    const [loadingAssignment, setLoadingAssignment] = useState(false);

    const fetchGroupData = async () => {
        try {
            const response = await nodeAxios.get(`/groups/${id}`);
            setGroup(response.data);
            fetchAssignmentData(response.data.group._id);
        } catch (error) {
            console.error("Erreur lors de la récupération du groupe:", error);
        }
    };

    const fetchAssignmentData = async (groupId) => {
        try {
            setLoadingAssignment(true);
            const response = await djangoAxios.get(`/assignments/${groupId}`);
            setAssignment(response.data);
        } catch (error) {
            console.error("Erreur lors de la récupération de l'affectation:", error);
            setAssignment(null);
        } finally {
            setLoadingAssignment(false);
        }
    };

    useEffect(() => {
        fetchGroupData();
    }, [id]);

        const fetchUsersWithoutGroup = async () => {
        try {
            setLoading(true);
            const response = await nodeAxios.get(`/groups/without-group/${group.group.annee_etude}`);
            setAvailableUsers(response.data.data || []);
        } catch (error) {
            console.error("Erreur lors de la récupération des utilisateurs:", error);
            setErrorMessage("Erreur lors de la récupération des utilisateurs");
        } finally {
            setLoading(false);
        }
    };
     const handleOpenModal = () => {
        setSelectedUsers([]);
        setSuccessMessage(null);
        setErrorMessage(null);
        fetchUsersWithoutGroup();
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleSelectUser = (userId) => {
        setSelectedUsers(prev => 
            prev.includes(userId) 
                ? prev.filter(id => id !== userId) 
                : [...prev, userId]
        );
    };

    const handleAssignUsers = async () => {
        if (selectedUsers.length === 0) {
            setErrorMessage("Veuillez sélectionner au moins un utilisateur");
            return;
        }

        try {
            setAssigning(true);
            setErrorMessage(null);
            
            // Assigner chaque utilisateur sélectionné
            const results = await Promise.all(
                selectedUsers.map(userId => 
                    nodeAxios.post(`/groups/${id}/assign/${userId}`)
                )
            );

            // Vérifier si toutes les assignations ont réussi
            const allSuccess = results.every(res => res.data.success);
            
            if (allSuccess) {
                setSuccessMessage(`${selectedUsers.length} utilisateur(s) assigné(s) avec succès`);
                fetchGroupData(); // Rafraîchir les données du groupe
                fetchUsersWithoutGroup(); // Rafraîchir la liste des utilisateurs disponibles
                setSelectedUsers([]);
            } else {
                setErrorMessage("Certaines assignations ont échoué");
            }
        } catch (error) {
            console.error("Erreur lors de l'assignation:", error);
            setErrorMessage(error.response?.data?.error || "Erreur lors de l'assignation");
        } finally {
            setAssigning(false);
        }
    };

    // Fonctions pour le formatage du texte (conservées)
    const textWithLineBreaks = (text) => {
        return text.split('\n').map((line, index) => (
            <React.Fragment key={index}>
                {line}
                <br />
            </React.Fragment>
        ));
    };

    const textWithLineCommas = (text) => {
        return text.split(',').map((line, index) => (
            <React.Fragment key={index}>
                {index + 1}. {line.trim().split(' ').map(word =>
                    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                ).join(' ')}
                <br />
            </React.Fragment>
        ));
    };

    const pdfRef = useRef();

    // Nouvelle fonction pour formater les choix de thèmes
    const formatThemeChoices = (choices) => {
        if (!choices || choices.length === 0) return "Aucun choix enregistré";
        
        return choices.map(choice => {
            const memberName = `${choice.user_id}`; // Vous pourriez utiliser le nom réel ici
            return (
                <div key={choice.user_id}>
                    <strong>{memberName}:</strong> 
                    {choice.choices.p1 ? ` 1er: ${choice.choices.p1}` : ''}
                    {choice.choices.p2 ? `, 2ème: ${choice.choices.p2}` : ''}
                    {choice.choices.p3 ? `, 3ème: ${choice.choices.p3}` : ''}
                </div>
            );
        });
    };

    // Fonction pour formater les membres du groupe
    const formatGroupMembers = (members) => {
        if (!members || members.length === 0) return "Aucun membre";
        
        return members.map((member, index) => (
            <div key={index}>
                {index + 1}. {member.prenom} {member.nom}
            </div>
        ));
    };

    return (
        <div className='Group-display-container' id='dynamic-list'>
            <div className="Group-display-wrapper">
                   <div className="title-display-Group" style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "0.5rem" }}>
                    <h1 style={{ fontSize: "1.2rem", fontWeight: "500", color: "#4F4F4F", userSelect: "none" }}>                         <Link className='return-to-Groups' to={'/admin/groupes'}>Tous Les Groupes</Link> &gt; <span style={{ color: "#925FE2" }}> {group.group?.name} </span>                    </h1>
                 <button
                        className="assign-users-button"
                        onClick={handleOpenModal}
                    >
                       Affecté des utilisateurs to group
                    </button>
                </div>

                {/* Modal pour afficher et assigner les utilisateurs */}
                {showModal && (
                    <div className="modal-overlay">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h3>Utilisateurs sans groupe </h3>
                                <button onClick={handleCloseModal}>&times;</button>
                            </div>
                            <div className="modal-body">
                                {successMessage && (
                                    <div className="alert alert-success">
                                        {successMessage}
                                    </div>
                                )}
                                {errorMessage && (
                                    <div className="alert alert-error">
                                        {errorMessage}
                                    </div>
                                )}
                                
                                {loading ? (
                                    <p>Chargement en cours...</p>
                                ) : availableUsers.length === 0 ? (
                                    <p>Aucun utilisateur disponible sans groupe</p>
                                ) : (
                                    <div className="user-list-container">
                                        <table className="users-table">
                                            <thead>
                                                <tr>
                                                    <th>Sélection</th>
                                                    <th>Nom complet</th>
                                                    <th>Email</th>
                                                    <th>Moyenne</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {availableUsers.map(user => (
                                                    <tr key={user.id}>
                                                        <td>
                                                            <input
                                                                type="checkbox"
                                                                checked={selectedUsers.includes(user.id)}
                                                                onChange={() => handleSelectUser(user.id)}
                                                            />
                                                        </td>
                                                        <td>{user.nom_complet}</td>
                                                        <td>{user.email}</td>
                                                        <td>{user.moyenne_etudiant ?? 'N/A'}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                            <div className="modal-footer">
                                <button 
                                    onClick={handleAssignUsers}
                                    disabled={selectedUsers.length === 0 || assigning}
                                >
                                    {assigning ? 'Assignation en cours...' : `Assigner (${selectedUsers.length})`}
                                </button>
                                <button onClick={handleCloseModal}>
                                    Fermer
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                <div className="Group-pdf-container" >
                    <div className="pdf-form">
                        <img src={enteteImg} alt="symbole esi-sba" />
                        <div className="fiche-title">
                            Fiche du Groupe
                        </div>
                        <div className="pdf-table-container">
                            <div className="pdf-table">
                                <div className="pdf-line">
                                    <span style={{ width: "200px", textAlign: "center", fontSize: "1.05rem" }}>Nom du Groupe</span>
                                    <span style={{ width: "100%", paddingLeft: "10px", borderLeft: "1px solid #000" }}>
                                        {group.group?.name || "Non spécifié"}
                                    </span>
                                </div>
                                <div className="pdf-line">
                                    <span style={{ width: "200px", textAlign: "center", fontSize: "1.05rem" }}>
                                        Année Académique
                                    </span>
                                    <span style={{ width: "100%", paddingLeft: "10px", borderLeft: "1px solid #000" }}>
                                        {group.group?.annee_academique_id || "Non spécifié"}
                                    </span>
                                </div>
                                <div className="pdf-line">
                                    <span style={{ width: "200px", textAlign: "center", fontSize: "1.05rem" }}>
                                        Membres
                                    </span>
                                    <span style={{ width: "100%", paddingLeft: "10px", borderLeft: "1px solid #000" }}>
                                        {assignment ? formatGroupMembers(assignment.group_members) : "Chargement..."}
                                    </span>
                                </div>
                                <div className="pdf-line">
                                    <span style={{ width: "200px", textAlign: "center", fontSize: "1.05rem" }}>
                                        Fiche des vœux
                                    </span>
                                    <span style={{ width: "100%", paddingLeft: "10px", borderLeft: "1px solid #000" }}>
                                        {assignment ? formatThemeChoices(assignment.theme_choices) : "Chargement..."}
                                    </span>
                                </div>
                                <div className="pdf-line">
                                    <span style={{ width: "200px", textAlign: "center", fontSize: "1.05rem" }}>
                                        Encadrant
                                    </span>
                                    <span style={{ width: "100%", paddingLeft: "10px", borderLeft: "1px solid #000" }}>
                                        {assignment ? `${assignment.encadrant_prenom} ${assignment.encadrant_nom}` : "Non assigné"}
                                    </span>
                                </div>
                                <div className="pdf-line">
                                    <span style={{ width: "200px", textAlign: "center", fontSize: "1.05rem" }}>
                                        Thème Assigné
                                    </span>
                                    <span style={{ width: "100%", paddingLeft: "10px", borderLeft: "1px solid #000" }}>
                                        {assignment?.theme_title || "Aucun thème assigné"}
                                    </span>
                                </div>
                                <div className="pdf-line">
                                    <span style={{ width: "200px", textAlign: "center", fontSize: "1.05rem" }}>
                                        Date de soumission
                                    </span>
                                    <span style={{ width: "100%", paddingLeft: "10px", borderLeft: "1px solid #000" }}>
                                        {assignment?.date_soumission || "Non spécifiée"}
                                    </span>
                                </div>
                                <div className="pdf-line">
                                    <span style={{ width: "200px", textAlign: "center", fontSize: "1.05rem" }}>
                                        Soutenance validée
                                    </span>
                                    <span style={{ width: "100%", paddingLeft: "10px", borderLeft: "1px solid #000" }}>
                                        {assignment ? (assignment.soutenance_valide ? "Oui" : "Non") : "Inconnu"}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="pdf-footer">
                            <div className="pdf-footer-content">
                                <span>
                                    École Supérieure en Informatique, BP 73, Bureau de Poste EL WIAM, 22000, Sidi Bel Abbes, Algerie
                                </span>
                                <div className="infos-footer">
                                    <span>
                                        Tel:  (213 ) 48 74 94 52
                                    </span>
                                    <span>
                                        Fax:  (213 ) 48 74 94 50
                                    </span>
                                    <span>
                                        www.esi-sba.dz
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default GroupeAdmin;