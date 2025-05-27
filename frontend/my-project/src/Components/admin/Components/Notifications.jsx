import React, { useEffect, useState } from 'react'
import '../Styles/Notifications.css'
import axios from 'axios'
import { Link } from 'react-router-dom'

function Notifications() {

    const [notifications, setNotifications] = useState([])

    useEffect(() => {

        axios.get(`${process.env.REACT_APP_API_URL_SERVICE7}/get_unread_notifications`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('access_token')}`
            }
        })
            .then((res) => setNotifications(res.data.notifications))
            .catch((err) => console.error(err.response.data))

    }, [])

    function truncateWithMore(text, maxLength = 100) {
        if (!text) return '';
        return text.length > maxLength ? text.slice(0, maxLength) + '...more' : text;
    }

    const getDecision = (decision) => {
        if (decision === "accepté") {
            return `🎉 Félicitations ! Votre thème a été accepté.
Il est désormais prêt à être développé dans le cadre de votre projet.`
        } else if (decision === "refusé") {
            return `⚠️ Votre thème a été refusé.
Veuillez en proposer un autre en tenant compte des remarques éventuelles.`
        } else {
            return "📌 Votre thème a été réservé avec succès."
        }
    }

    const getType = (type) => {
        switch (type) {
            case "CREATION_THEME": return "creation"
            case "THEME_DECISION": return "decision"
            case "ENTREPRISE_DEMANDE": return "demande"
            case "STUDENT_INVITATION": return "invitation"
            default: return "inconnu"
        }
    }

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${process.env.REACT_APP_API_URL_SERVICE7}/delete-notification/${id}`, {
                headers: `Bearer ${localStorage.getItem('access_token')}`
            });
            setNotifications(prev => prev.filter(notif => notif._id !== id));
        } catch (err) {
            console.error("Erreur lors de la suppression :", err.response?.data || err.message);
        }
    };

    const [adminNotifications, setAdminNotifications] = useState([])

    useEffect(() => {

        if (localStorage.getItem('role') === "admin") {
            axios.get(`${process.env.REACT_APP_API_URL_SERVICE7}/get_notifications_without_receiver`)
                .then((res) => setAdminNotifications(res.data.notifications))
                .catch((err) => console.error(err.response.data))
        }

    }, [])

    return (
        <div className='notifications-container' id='dynamic-list'>
            <div className="notifications-wrapper">
                <h1 style={{ fontSize: "1.6rem", fontWeight: "600", color: "#4F4F4F" }}>
                    Notifications Non Lus   <span style={{ color: "#A7A7A7", marginLeft: "5px" }}> {notifications.length} </span>
                </h1>
                <div className="notification-cards-container">
                    {
                        notifications.map((notification) => (
                            <div className="notification-card">
                                <svg className='more' width="27" height="27" viewBox="0 0 27 27" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M11.8125 6.75C11.8125 6.51375 11.8125 6.39731 11.826 6.29944C11.869 5.99013 12.0117 5.70329 12.2325 5.48248C12.4533 5.26167 12.7401 5.11895 13.0494 5.076C13.1456 5.0625 13.2637 5.0625 13.5 5.0625C13.7363 5.0625 13.8527 5.0625 13.9506 5.076C14.2599 5.11895 14.5467 5.26167 14.7675 5.48248C14.9883 5.70329 15.131 5.99013 15.174 6.29944C15.1875 6.39563 15.1875 6.51375 15.1875 6.75C15.1875 6.98625 15.1875 7.10269 15.174 7.20056C15.131 7.50987 14.9883 7.79671 14.7675 8.01752C14.5467 8.23833 14.2599 8.38105 13.9506 8.424C13.8544 8.4375 13.7363 8.4375 13.5 8.4375C13.2637 8.4375 13.1473 8.4375 13.0494 8.424C12.7401 8.38105 12.4533 8.23833 12.2325 8.01752C12.0117 7.79671 11.869 7.50987 11.826 7.20056C11.8125 7.10438 11.8125 6.98625 11.8125 6.75ZM11.8125 13.5C11.8125 13.2638 11.8125 13.1473 11.826 13.0494C11.869 12.7401 12.0117 12.4533 12.2325 12.2325C12.4533 12.0117 12.7401 11.869 13.0494 11.826C13.1456 11.8125 13.2637 11.8125 13.5 11.8125C13.7363 11.8125 13.8527 11.8125 13.9506 11.826C14.2599 11.869 14.5467 12.0117 14.7675 12.2325C14.9883 12.4533 15.131 12.7401 15.174 13.0494C15.1875 13.1456 15.1875 13.2638 15.1875 13.5C15.1875 13.7362 15.1875 13.8527 15.174 13.9506C15.131 14.2599 14.9883 14.5467 14.7675 14.7675C14.5467 14.9883 14.2599 15.131 13.9506 15.174C13.8544 15.1875 13.7363 15.1875 13.5 15.1875C13.2637 15.1875 13.1473 15.1875 13.0494 15.174C12.7401 15.131 12.4533 14.9883 12.2325 14.7675C12.0117 14.5467 11.869 14.2599 11.826 13.9506C11.8125 13.8544 11.8125 13.7362 11.8125 13.5ZM11.8125 20.25C11.8125 20.0154 11.8125 19.8973 11.826 19.7994C11.8692 19.4907 12.0118 19.2044 12.2323 18.984C12.4527 18.7635 12.739 18.6209 13.0477 18.5777C13.1473 18.5642 13.2638 18.5642 13.4983 18.5642C13.7329 18.5642 13.8527 18.5642 13.9489 18.5777C14.2576 18.6209 14.5439 18.7635 14.7643 18.984C14.9848 19.2044 15.1274 19.4907 15.1706 19.7994C15.1841 19.8973 15.1841 20.0154 15.1841 20.25C15.1841 20.4846 15.1841 20.6027 15.1706 20.7006C15.1274 21.0093 14.9848 21.2956 14.7643 21.516C14.5439 21.7365 14.2576 21.8791 13.9489 21.9223C13.851 21.9358 13.7329 21.9358 13.4983 21.9358C13.2638 21.9358 13.1456 21.9358 13.0477 21.9223C12.739 21.8791 12.4527 21.7365 12.2323 21.516C12.0118 21.2956 11.8692 21.0093 11.826 20.7006C11.8125 20.6027 11.8125 20.4846 11.8125 20.25Z" fill="black" />
                                </svg>

                                <div className="user-line">
                                    <h3 style={{ fontFamily: 'Nunito, sans-serif', fontSize: "1rem", fontWeight: "700", color: "#323232" }}>
                                        Utilisateur
                                    </h3>
                                    {
                                        notification.type === "CREATION_THEME" ?
                                            <div className="user-role">
                                                Enseignant
                                            </div>
                                            : notification.type === "ENTREPRISE_DEMANDE" ?
                                                <div className="user-role" style={{ color: "#FF8F0D", backgroundColor: "#FF8F0D25", border: "1px solid #FF8F0D" }}>
                                                    Entreprise
                                                </div>
                                                : notification.type === "THEME_DECISION" ?
                                                    <div className="user-role" style={{ color: "#166534", backgroundColor: "#16653425", border: "1px solid #166534" }}>
                                                        Admin
                                                    </div>
                                                    : notification.type === "STUDENT_INVITATION" ?
                                                        <div className="user-role" style={{ color: "#FF4FA3", backgroundColor: "#FF4FA325", border: "1px solid #FF4FA3" }}>
                                                            Etudiant
                                                        </div>
                                                        : ""

                                    }
                                </div>
                                <div className="notification-title">
                                    <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path fill-rule="evenodd" clip-rule="evenodd" d="M19.5086 3.23612C20.9516 2.41062 22.7499 3.45278 22.7499 5.11678V18.7169C22.7499 20.3799 20.9527 21.4231 19.5086 20.5976L15.1666 18.1168V5.71695L19.5086 3.23612ZM12.9999 6.5002H7.58326C6.23997 6.49885 4.94411 6.99667 3.94723 7.89702C2.95035 8.79737 2.32357 10.036 2.18857 11.3725C2.05357 12.709 2.41998 14.0479 3.21668 15.1295C4.01337 16.211 5.18351 16.9579 6.49992 17.2252V21.1252C6.49992 21.8435 6.78526 22.5324 7.29317 23.0403C7.80109 23.5482 8.48996 23.8335 9.20826 23.8335C9.92655 23.8335 10.6154 23.5482 11.1233 23.0403C11.6312 22.5324 11.9166 21.8435 11.9166 21.1252V17.3335H12.9999V6.5002Z" fill="#E63946" />
                                    </svg>

                                    <h2 style={{ fontFamily: 'Nunito, sans-serif', fontSize: "1.3rem", fontWeight: "700", color: "#000" }}>
                                        {
                                            notification.type === "CREATION_THEME" ?
                                                " Nouveau Projet Créé !"
                                                :
                                                notification.type === "ENTREPRISE_DEMANDE" ?
                                                    "Nouveau Demande d'Inscription Entrprise"
                                                    :
                                                    notification.type === "THEME_DECISION" ?
                                                        `Votre Thème a ète ${notification.metadata.decision}`
                                                        : notification.type === "STUDENT_INVITATION" ?
                                                            `Invitation pour joindre groupe ${notification.metadata.groupName}`
                                                            : ""
                                        }
                                    </h2>
                                </div>
                                <div className="notification-content" style={{ fontSize: "1.03rem", fontWeight: "500", color: "#00000070", fontFamily: "Kumbh Sans, sans-serif" }}>
                                    {
                                        notification.type === "CREATION_THEME" ?
                                            truncateWithMore(notification.metadata.resume, 150)
                                            :
                                            notification.type === "ENTREPRISE_DEMANDE" ?
                                                `l'Entreprise ${notification.metadata.entrepriseNom} souhaite rejoindre notre plateforme !
                                                Elle a soumis une demande d’inscription en attente de validation.`
                                                :
                                                notification.type === "THEME_DECISION" ?
                                                    getDecision(notification.metadata.decision)
                                                    : notification.type === "STUDENT_INVITATION" ?
                                                        `Vous êtes cordialement invité(e) à rejoindre notre groupe.
                                                           Rejoignez-nous pour collaborer, échanger et avancer ensemble !
                                                           Nous serions ravis de vous compter parmi nous.`
                                                        : ""
                                    }
                                </div>
                                <span className="time">
                                    {notification.createdAt.slice(0, 10)}
                                </span>
                                <div className="div" style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                                    <span style={{ color: "#00000090", fontSize: "0.9rem", cursor: "pointer" }} onClick={() => handleDelete(notification._id)}>
                                        Marquer Lus
                                    </span>
                                    <span className="voir-plus" style={{ color: "#925FE2", fontSize: "1.1rem" }}>
                                        <Link
                                            to={getType(notification.type) === "creation" ? `/admin/themes/${notification.metadata.themeId}` : getType(notification.type) === "demande" ? `/admin/entreprises/demandes` : getType(notification.type) === "decision" ? `/enseignant/themes/${notification.metadata.themeId}` : '/etudiant/invitations'}
                                            onClick={() => handleDelete(notification._id)}
                                        >
                                            Voir plus
                                        </Link>
                                    </span>
                                </div>
                            </div>

                        ))
                    }
                    {
                        adminNotifications.map((notification) => (
                            <div className="notification-card">
                                <svg className='more' width="27" height="27" viewBox="0 0 27 27" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M11.8125 6.75C11.8125 6.51375 11.8125 6.39731 11.826 6.29944C11.869 5.99013 12.0117 5.70329 12.2325 5.48248C12.4533 5.26167 12.7401 5.11895 13.0494 5.076C13.1456 5.0625 13.2637 5.0625 13.5 5.0625C13.7363 5.0625 13.8527 5.0625 13.9506 5.076C14.2599 5.11895 14.5467 5.26167 14.7675 5.48248C14.9883 5.70329 15.131 5.99013 15.174 6.29944C15.1875 6.39563 15.1875 6.51375 15.1875 6.75C15.1875 6.98625 15.1875 7.10269 15.174 7.20056C15.131 7.50987 14.9883 7.79671 14.7675 8.01752C14.5467 8.23833 14.2599 8.38105 13.9506 8.424C13.8544 8.4375 13.7363 8.4375 13.5 8.4375C13.2637 8.4375 13.1473 8.4375 13.0494 8.424C12.7401 8.38105 12.4533 8.23833 12.2325 8.01752C12.0117 7.79671 11.869 7.50987 11.826 7.20056C11.8125 7.10438 11.8125 6.98625 11.8125 6.75ZM11.8125 13.5C11.8125 13.2638 11.8125 13.1473 11.826 13.0494C11.869 12.7401 12.0117 12.4533 12.2325 12.2325C12.4533 12.0117 12.7401 11.869 13.0494 11.826C13.1456 11.8125 13.2637 11.8125 13.5 11.8125C13.7363 11.8125 13.8527 11.8125 13.9506 11.826C14.2599 11.869 14.5467 12.0117 14.7675 12.2325C14.9883 12.4533 15.131 12.7401 15.174 13.0494C15.1875 13.1456 15.1875 13.2638 15.1875 13.5C15.1875 13.7362 15.1875 13.8527 15.174 13.9506C15.131 14.2599 14.9883 14.5467 14.7675 14.7675C14.5467 14.9883 14.2599 15.131 13.9506 15.174C13.8544 15.1875 13.7363 15.1875 13.5 15.1875C13.2637 15.1875 13.1473 15.1875 13.0494 15.174C12.7401 15.131 12.4533 14.9883 12.2325 14.7675C12.0117 14.5467 11.869 14.2599 11.826 13.9506C11.8125 13.8544 11.8125 13.7362 11.8125 13.5ZM11.8125 20.25C11.8125 20.0154 11.8125 19.8973 11.826 19.7994C11.8692 19.4907 12.0118 19.2044 12.2323 18.984C12.4527 18.7635 12.739 18.6209 13.0477 18.5777C13.1473 18.5642 13.2638 18.5642 13.4983 18.5642C13.7329 18.5642 13.8527 18.5642 13.9489 18.5777C14.2576 18.6209 14.5439 18.7635 14.7643 18.984C14.9848 19.2044 15.1274 19.4907 15.1706 19.7994C15.1841 19.8973 15.1841 20.0154 15.1841 20.25C15.1841 20.4846 15.1841 20.6027 15.1706 20.7006C15.1274 21.0093 14.9848 21.2956 14.7643 21.516C14.5439 21.7365 14.2576 21.8791 13.9489 21.9223C13.851 21.9358 13.7329 21.9358 13.4983 21.9358C13.2638 21.9358 13.1456 21.9358 13.0477 21.9223C12.739 21.8791 12.4527 21.7365 12.2323 21.516C12.0118 21.2956 11.8692 21.0093 11.826 20.7006C11.8125 20.6027 11.8125 20.4846 11.8125 20.25Z" fill="black" />
                                </svg>

                                <div className="user-line">
                                    <h3 style={{ fontFamily: 'Nunito, sans-serif', fontSize: "1rem", fontWeight: "700", color: "#323232" }}>
                                        Utilisateur
                                    </h3>
                                    <div className="user-role" style={{ color: "#FF8F0D", backgroundColor: "#FF8F0D25", border: "1px solid #FF8F0D" }}>
                                        Entreprise
                                    </div>
                                </div>
                                <div className="notification-title">
                                    <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path fill-rule="evenodd" clip-rule="evenodd" d="M19.5086 3.23612C20.9516 2.41062 22.7499 3.45278 22.7499 5.11678V18.7169C22.7499 20.3799 20.9527 21.4231 19.5086 20.5976L15.1666 18.1168V5.71695L19.5086 3.23612ZM12.9999 6.5002H7.58326C6.23997 6.49885 4.94411 6.99667 3.94723 7.89702C2.95035 8.79737 2.32357 10.036 2.18857 11.3725C2.05357 12.709 2.41998 14.0479 3.21668 15.1295C4.01337 16.211 5.18351 16.9579 6.49992 17.2252V21.1252C6.49992 21.8435 6.78526 22.5324 7.29317 23.0403C7.80109 23.5482 8.48996 23.8335 9.20826 23.8335C9.92655 23.8335 10.6154 23.5482 11.1233 23.0403C11.6312 22.5324 11.9166 21.8435 11.9166 21.1252V17.3335H12.9999V6.5002Z" fill="#E63946" />
                                    </svg>

                                    <h2 style={{ fontFamily: 'Nunito, sans-serif', fontSize: "1.3rem", fontWeight: "700", color: "#000" }}>
                                        Nouveau Demande d'Inscription Entrprise
                                    </h2>
                                </div>
                                <div className="notification-content" style={{ fontSize: "1.03rem", fontWeight: "500", color: "#00000070", fontFamily: "Kumbh Sans, sans-serif" }}>
                                    {

                                        `l'Entreprise ${notification.metadata.entrepriseNom} souhaite rejoindre notre plateforme !
                                                Elle a soumis une demande d’inscription en attente de validation.`
                                    }
                                </div>
                                <span className="time">
                                    {notification.createdAt.slice(0, 10)}
                                </span>
                                <div className="div" style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                                    <span style={{ color: "#00000090", fontSize: "0.9rem", cursor: "pointer" }} onClick={() => handleDelete(notification._id)}>
                                        Marquer Lus
                                    </span>
                                    <span className="voir-plus" style={{ color: "#925FE2", fontSize: "1.1rem" }}>
                                        <Link
                                            to={`/admin/entreprises/demandes`}
                                            onClick={() => handleDelete(notification._id)}
                                        >
                                            Voir plus
                                        </Link>
                                    </span>
                                </div>
                            </div>

                        ))
                    }
                    {
                        notifications.length === 0 && adminNotifications.length === 0 && (
                            <div
                                style={{
                                    padding: "1rem",
                                    margin: "1rem auto",
                                    maxWidth: "400px",
                                    borderRadius: "10px",
                                    backgroundColor: "#f9f9f9",
                                    border: "1px solid #e0e0e0",
                                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
                                    textAlign: "center",
                                    color: "#888",
                                    fontSize: "1rem",
                                    fontStyle: "italic"
                                }}
                            >
                                🔔 Aucune notification pour le moment
                            </div>
                        )
                    }

                </div>
            </div>
        </div>
    )
}

export default Notifications
