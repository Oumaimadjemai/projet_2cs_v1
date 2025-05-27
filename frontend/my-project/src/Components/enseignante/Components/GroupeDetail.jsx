import React, { useState, useEffect, useRef, useContext } from 'react'
import '../Styles/Groupes.css';
import { ReactComponent as SearchIcon } from '../../../Assets/Icons/Search.svg';
import { ReactComponent as ArrowIcon } from '../../../Assets/Icons/Arrow.svg';
import { ReactComponent as EmptyIcon } from '../../../Assets/Icons/notFound.svg';
import doneImg from '../../../Assets/Images/Done.png'
import { AppContext } from '../../../App';
import '../../Partials/Components/i18n'
import { useTranslation } from 'react-i18next';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function GroupeDetail() {

    const { id } = useParams();
    const [groupe, setGroupe] = useState({})

    useEffect(() => {

        axios.get(`${process.env.REACT_APP_API_URL_SERVICE3}/api/groups/${id}/members`, {
            headers: {
                authorization: `Bearer ${localStorage.getItem('access_token')}`
            }
        })
            .then((res) => setGroupe(res.data))
            .catch((err) => console.error(err.response.data))

    }, [id])

    const [documents, setDocuments] = useState([]);

    useEffect(() => {

        axios.get(`${process.env.REACT_APP_API_URL_SERVICE5}/api/groups/${id}/documents`, {
            headers: {
                authorization: `Bearer ${localStorage.getItem('access_token')}`
            }
        })
            .then((res) => {
                setDocuments(res.data.documents)
            })
            .catch((err) => console.error(err.response.data))

    }, [])

    const getStatusColor = (status) => {

        switch (status) {
            case "valide":
                return "#6FCF97"
            case "en attente":
                return "#00000080"
            case "refuse":
                return "#D42803"
            default:
                return "black";

        }
    }

    const [isVisible, setIsVisible] = useState(false);
    const dynamicListRef = useRef(null);

    const toggleVisibility = () => {
        if (dynamicListRef.current) {
            const scrollY = dynamicListRef.current.scrollTop;
            setIsVisible(scrollY > 5);
        }
    };

    useEffect(() => {
        const currentRef = dynamicListRef.current; // li9 nzidou hadi bach ma y5arjch warning w nidrouha fi variable bach nafss variable tji fi la phase ta3 setup and cleanup *useEffect y5dm bel les variables*

        if (currentRef) {
            currentRef.addEventListener("scroll", toggleVisibility);
        }

        return () => {
            if (currentRef) {
                currentRef.removeEventListener("scroll", toggleVisibility);
            }
        };
    }, []);

    const scrollToTop = () => {
        if (dynamicListRef.current) {
            dynamicListRef.current.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        }
    };

    //-----------AppContext-------//

    const { isRtl } = useContext(AppContext);

    const { t } = useTranslation();

    const [groupeDetailClicked, setGroupeClicked] = useState(false)

    const [confirmValider, setConfirmerValider] = useState(false)
    const [loading, setLoading] = useState(false)
    const [validerSuccess, setValiderSuccess] = useState(false)

    const handleValider = (e) => {

        e.preventDefault()
        setLoading(true)

        axios.post(`${process.env.REACT_APP_API_URL_SERVICE6}/soutenances/valider/${id}/`, {} , {
            headers: {
                authorization: `Bearer ${localStorage.getItem('access_token')}`,
                "Content-Type": "application/json",
            }
        })
            .then(() => {
                setConfirmerValider(false)
                setValiderSuccess(true)
            })
            .catch((err) => console.error(err.response.data))
            .finally(() => setLoading(false))

    }

    const navigate = useNavigate();

    return (
        <div className='groupes-liste-container' id='dynamic-liste' ref={dynamicListRef}>
            <div className="groupes-liste-wrapper" style={{ paddingRight: isRtl ? "0" : "12px", paddingLeft: isRtl ? "12px" : "0" }}>
                <div className="title-detail-line">
                    <h1 style={{ fontSize: "1.2rem", fontWeight: "500", color: "#4F4F4F" }}>
                        <Link to={'/enseignant/groupes'} className='return-to-groupes'> Tous Les Groupes </Link>  &gt; <span style={{ color: "#925FE2" }}>{groupe.group_name}</span>
                    </h1>
                    <div style={{ display: "flex", gap: "1.1rem", alignItems: "center", marginRight: "1rem" }}>
                        <span style={{ display: "flex", gap: "10px", alignItems: "center", fontFamily: "Kumbh Sans, sans-serif", fontWeight: "600", color: "#925FE2", cursor: "pointer" }} onClick={() => setGroupeClicked(true)}>
                            Sur le Groupe
                            <svg width="8" height="12" viewBox="0 0 10 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M1.5 1L8.5 8L1.5 15" stroke="#925FE2" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                        </span>
                    </div>
                </div>
                <div className="recherche-groupes-line">
                    <div className="recherche-groupes-input">
                        <button
                            style={{
                                borderRight: isRtl ? "none" : "2px solid #D9E1E7",
                                borderLeft: isRtl ? "2px solid #D9E1E7" : "none",
                            }}
                        >
                            {t('enseignantsPage.filterBtn')}
                            <svg width="0.9rem" height="0.5rem" viewBox="0 0 15 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M7.742 6.05489L12.971 0.863892C13.1571 0.678984 13.4087 0.575195 13.671 0.575195C13.9333 0.575195 14.185 0.678984 14.371 0.863892C14.4627 0.954642 14.5354 1.06265 14.585 1.18169C14.6347 1.30072 14.6602 1.42842 14.6602 1.55739C14.6602 1.68636 14.6347 1.81406 14.585 1.93309C14.5354 2.05212 14.4627 2.16014 14.371 2.25089L8.44293 8.13589C8.25689 8.32079 8.00529 8.42458 7.74298 8.42458C7.48068 8.42458 7.22908 8.32079 7.04303 8.13589L1.11493 2.25089C1.02329 2.16014 0.950587 2.05212 0.90094 1.93309C0.851293 1.81406 0.825745 1.68636 0.825745 1.55739C0.825745 1.42842 0.851293 1.30072 0.90094 1.18169C0.950587 1.06265 1.02329 0.954642 1.11493 0.863892C1.3011 0.679226 1.55278 0.575607 1.815 0.575607C2.07723 0.575607 2.32878 0.679226 2.51495 0.863892L7.742 6.05489Z" fill="#925FE2" />
                            </svg>
                        </button>
                        <div className="input-line">
                            <SearchIcon />
                            <input type="text" placeholder="Rechercher un groupe par N° groupe ou nom" />
                        </div>
                    </div>
                </div>

                <div className="groupes-table">
                    <table>
                        <thead>
                            <tr>
                                <th
                                    style={{
                                        borderTopLeftRadius: isRtl ? "0" : "8px",
                                        borderTopRightRadius: isRtl ? "8px" : "0",
                                        borderBottomLeftRadius: isRtl ? "0" : "8px",
                                        borderBottomRightRadius: isRtl ? "8px" : "0",
                                        borderLeft: isRtl ? undefined : "1px solid #E4E4E4",
                                        borderRight: isRtl ? "1px solid #E4E4E4" : undefined,
                                        width: "20%",
                                        paddingLeft: isRtl ? undefined : "1rem",
                                        paddingRight: isRtl ? "0.5rem" : undefined,
                                        textAlign: isRtl ? "right" : "left"
                                    }}
                                >
                                    Document
                                </th>
                                <th style={{ width: "16%" }}>Date</th>
                                <th style={{ width: "25%" }}>Déposer Par</th>
                                <th style={{ width: "100% !important" }}>Status</th>
                                <th
                                    style={{
                                        width: "15%",
                                        borderTopRightRadius: isRtl ? "0" : "8px",
                                        borderTopLeftRadius: isRtl ? "8px" : "0",
                                        borderBottomRightRadius: isRtl ? "0" : "8px",
                                        borderBottomLeftRadius: isRtl ? "8px" : "0",
                                        borderRight: isRtl ? "none" : "1px solid #E4E4E4",
                                        borderLeft: isRtl ? "1px solid #E4E4E4" : "none",
                                        textAlign: "center"
                                    }}
                                >
                                    Options
                                </th>
                            </tr>
                        </thead>
                        {
                            documents.length !== 0 && (
                                <tbody>
                                    {
                                        documents.map((document) => (
                                            <tr>
                                                <td
                                                    style={{
                                                        borderTopLeftRadius: isRtl ? "0" : "8px",
                                                        borderTopRightRadius: isRtl ? "8px" : "0",
                                                        borderBottomLeftRadius: isRtl ? "0" : "8px",
                                                        borderBottomRightRadius: isRtl ? "8px" : "0",
                                                        borderLeft: isRtl ? undefined : "1px solid #E4E4E4",
                                                        borderRight: isRtl ? "1px solid #E4E4E4" : undefined,
                                                        width: "20%",
                                                        paddingLeft: "1rem",
                                                        textAlign: isRtl ? "right" : "left",
                                                        whiteSpace: "nowrap",
                                                        overflow: "hidden",
                                                        textOverflow: "ellipsis"
                                                    }}
                                                >
                                                    <span style={{ display: "flex", alignItems: "flex-end", gap: "0" }}>
                                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginLeft: "1rem" }}>
                                                            <path d="M19.5 10.3711V19.5C19.5 20.0967 19.2629 20.669 18.841 21.091C18.419 21.5129 17.8467 21.75 17.25 21.75H6.75C6.15326 21.75 5.58097 21.5129 5.15901 21.091C4.73705 20.669 4.5 20.0967 4.5 19.5V4.5C4.5 3.90326 4.73705 3.33097 5.15901 2.90901C5.58097 2.48705 6.15326 2.25 6.75 2.25H11.3789C11.7766 2.25006 12.158 2.40804 12.4392 2.68922L19.0608 9.31078C19.342 9.59202 19.4999 9.97341 19.5 10.3711Z" stroke="black" stroke-linejoin="round" />
                                                            <path d="M12 2.625V8.25C12 8.64782 12.158 9.02936 12.4393 9.31066C12.7206 9.59196 13.1022 9.75 13.5 9.75H19.125" stroke="black" stroke-linecap="round" stroke-linejoin="round" />
                                                        </svg>
                                                        {document.title}
                                                    </span>
                                                </td>
                                                <td style={{ width: "23%", color: "#3A3541", fontSize: "0.7rem", paddingTop: "10px" }}>
                                                    {document.createdAt}
                                                </td>
                                                <td style={{ width: "30%" }}>
                                                    {document.etudiantNom || "N/A"}
                                                </td>
                                                <td className='grade-td' style={{ width: "100%" }}>
                                                    <div
                                                        style={{
                                                            color: getStatusColor(document.status),
                                                            fontSize: "1.1rem",
                                                            fontWeight: "650",
                                                            fontFamily: "Nunito, sans-serif"
                                                        }}
                                                    >
                                                        {document.status}
                                                    </div>
                                                </td>
                                                <td
                                                    className='last-td'
                                                    style={{
                                                        borderTopRightRadius: isRtl ? "0" : "8px",
                                                        borderTopLeftRadius: isRtl ? "8px" : "0",
                                                        borderBottomRightRadius: isRtl ? "0" : "8px",
                                                        borderBottomLeftRadius: isRtl ? "8px" : "0",
                                                        borderRight: isRtl ? "none" : "1px solid #E4E4E4",
                                                        borderLeft: isRtl ? "1px solid #E4E4E4" : "none",

                                                    }}
                                                >
                                                    <div
                                                        className="line-btns"
                                                        style={{
                                                            marginLeft: isRtl ? "1rem" : "auto",
                                                            marginRight: isRtl ? "auto" : "1rem"
                                                        }}
                                                    >
                                                        <button style={{ display: "flex", flexDirection: "column" }} className='download-btn'>
                                                            <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <path fill-rule="evenodd" clip-rule="evenodd" d="M12.1069 4.50353C14.076 4.55028 15.7042 5.92388 16.1525 7.75088C16.2422 8.11622 16.537 8.39455 16.9054 8.46414C18.6978 8.8028 20.0338 10.3997 19.989 12.283C19.9557 13.6861 19.1654 14.8946 18.0133 15.525C17.5536 15.7765 17.3849 16.3531 17.6364 16.8127C17.8879 17.2724 18.4645 17.4411 18.9242 17.1896C20.6461 16.2474 21.836 14.4357 21.8861 12.328C21.9484 9.70505 20.227 7.4558 17.8293 6.73865C17.0068 4.38406 14.7941 2.66924 12.152 2.60651C8.77349 2.5263 5.9652 5.17857 5.84263 8.5459C4.15033 9.23777 2.93956 10.8804 2.89335 12.8262C2.84606 14.8179 4.03321 16.5499 5.75281 17.294C6.23373 17.502 6.79226 17.2809 7.00035 16.8C7.20843 16.3191 6.98727 15.7605 6.50637 15.5525C5.47184 15.1048 4.76205 14.0638 4.79037 12.8712C4.82199 11.54 5.76358 10.4419 7.00763 10.1617C7.4719 10.0572 7.7933 9.62531 7.7519 9.14461C7.53745 6.65458 9.59463 4.44388 12.1069 4.50353ZM12.4235 11.1543C12.9474 11.1668 13.3619 11.6015 13.3495 12.1254L13.2012 18.3701L14.4571 17.1743C14.8366 16.813 15.4371 16.8277 15.7985 17.2072C16.1598 17.5867 16.1451 18.1872 15.7656 18.5486L13.0241 21.1588C12.7784 21.3928 12.5399 21.5966 12.1757 21.5879C11.8116 21.5793 11.5831 21.3644 11.3487 21.119L8.73419 18.3817C8.37228 18.0027 8.38606 17.4022 8.765 17.0402C9.14393 16.6783 9.74449 16.6921 10.1064 17.071L11.3042 18.3251L11.4525 12.0803C11.4649 11.5565 11.8996 11.1419 12.4235 11.1543Z" fill="black" />
                                                            </svg>
                                                            Télécharger
                                                        </button>
                                                        <span style={{ display: "flex", gap: "8px", alignItems: "center", color: "#884DFF", marginRight: "1rem" }} onClick={() => navigate(`/enseignant/groupes/${id}/documents/${document._id}`)} >
                                                            <svg width="10" height="16" viewBox="0 0 10 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <path d="M1.5 1L8.5 8L1.5 15" stroke="#925FE2" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                                            </svg>
                                                        </span>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            )
                        }
                    </table>
                    {
                        documents.length === 0 && (
                            <div className="no-enseignants-available">
                                <EmptyIcon className='empty-icon' />
                                <div className="lines-box">
                                    <h1 style={{ fontSize: "1.45rem", fontWeight: "650" }}>
                                        {t('enseignantsPage.noEnseignants')}
                                    </h1>
                                    <span style={{ width: "600px", textAlign: "center", color: "#4F4F4F", fontWeight: "500" }}>
                                        {t('enseignantsPage.startAdd')}
                                    </span>
                                </div>
                            </div>
                        )
                    }
                </div>
                {
                    isVisible && (
                        <button
                            onClick={scrollToTop}
                            className='to-top'
                            style={{
                                position: "fixed",
                                bottom: "20px",
                                right: isRtl ? undefined : "20px",
                                left: isRtl ? "20px" : undefined,
                                backgroundColor: "#925FE2",
                                color: "white",
                                cursor: "pointer",
                                fontSize: "20px",
                                width: "50px",
                                height: "50px",
                                borderRadius: "50%",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                boxShadow: "8px 4px 52px rgba(0, 0, 0, 0.2)"
                            }}
                        >
                            <ArrowIcon className='arrow-top' />
                        </button>
                    )
                }
            </div>
            {
                groupeDetailClicked && (
                    <div className={`about-groupe ${groupeDetailClicked ? "open" : ""}`}>
                        <div className="about-title">
                            <svg width="36" height="36" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ cursor: "pointer" }} onClick={() => setGroupeClicked(false)}>
                                <path d="M25 27.9168L14.7917 38.1252C14.4098 38.5071 13.9237 38.6981 13.3334 38.6981C12.7431 38.6981 12.257 38.5071 11.875 38.1252C11.4931 37.7432 11.3021 37.2571 11.3021 36.6668C11.3021 36.0766 11.4931 35.5904 11.875 35.2085L22.0834 25.0002L11.875 14.7918C11.4931 14.4099 11.3021 13.9238 11.3021 13.3335C11.3021 12.7432 11.4931 12.2571 11.875 11.8752C12.257 11.4932 12.7431 11.3022 13.3334 11.3022C13.9237 11.3022 14.4098 11.4932 14.7917 11.8752L25 22.0835L35.2084 11.8752C35.5903 11.4932 36.0764 11.3022 36.6667 11.3022C37.257 11.3022 37.7431 11.4932 38.125 11.8752C38.507 12.2571 38.698 12.7432 38.698 13.3335C38.698 13.9238 38.507 14.4099 38.125 14.7918L27.9167 25.0002L38.125 35.2085C38.507 35.5904 38.698 36.0766 38.698 36.6668C38.698 37.2571 38.507 37.7432 38.125 38.1252C37.7431 38.5071 37.257 38.6981 36.6667 38.6981C36.0764 38.6981 35.5903 38.5071 35.2084 38.1252L25 27.9168Z" fill="#000000" fill-opacity="0.8" />
                            </svg>
                            <div style={{ display: "flex", gap: "0.5rem", alignSelf: "center" }}>
                                <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <g clip-path="url(#clip0_633_1297)">
                                        <path d="M20 21.25C22.7167 21.25 25.1167 21.9 27.0667 22.75C28.8667 23.55 30 25.35 30 27.3V30H10V27.3167C10 25.35 11.1333 23.55 12.9333 22.7667C14.8833 21.9 17.2833 21.25 20 21.25ZM6.66667 21.6667C8.5 21.6667 10 20.1667 10 18.3333C10 16.5 8.5 15 6.66667 15C4.83333 15 3.33333 16.5 3.33333 18.3333C3.33333 20.1667 4.83333 21.6667 6.66667 21.6667ZM8.55 23.5C7.93333 23.4 7.31667 23.3333 6.66667 23.3333C5.01667 23.3333 3.45 23.6833 2.03333 24.3C0.8 24.8333 0 26.0333 0 27.3833V30H7.5V27.3167C7.5 25.9333 7.88333 24.6333 8.55 23.5ZM33.3333 21.6667C35.1667 21.6667 36.6667 20.1667 36.6667 18.3333C36.6667 16.5 35.1667 15 33.3333 15C31.5 15 30 16.5 30 18.3333C30 20.1667 31.5 21.6667 33.3333 21.6667ZM40 27.3833C40 26.0333 39.2 24.8333 37.9667 24.3C36.55 23.6833 34.9833 23.3333 33.3333 23.3333C32.6833 23.3333 32.0667 23.4 31.45 23.5C32.1167 24.6333 32.5 25.9333 32.5 27.3167V30H40V27.3833ZM20 10C22.7667 10 25 12.2333 25 15C25 17.7667 22.7667 20 20 20C17.2333 20 15 17.7667 15 15C15 12.2333 17.2333 10 20 10Z" fill="black" />
                                    </g>
                                    <defs>
                                        <clipPath id="clip0_633_1297">
                                            <rect width="40" height="40" fill="white" />
                                        </clipPath>
                                    </defs>
                                </svg>
                                <h1 style={{ fontSize: "1.2rem", fontWeight: "600", color: "#000", paddingTop: "6px", fontFamily: "Kumbh Sans, sans-serif" }}>
                                    Membre du {groupe.group_name}
                                </h1>
                            </div>

                        </div>
                        <div className="groupes-table">
                            <table>
                                <thead>
                                    <tr style={{ margin: "5px 0" }}>
                                        <th className={isRtl ? "th-ltr" : "th-rtl"} style={{ textIndent: "7px" }}>
                                            Nom &Prénom
                                        </th>
                                        <th style={{ width: "40%" }}>Email</th>
                                        <th className={`${isRtl ? "th-rtl" : "th-ltr"} text-center`} style={{ width: "100%", paddingLeft: "10px" }}>
                                            Matricule
                                        </th>
                                    </tr>

                                </thead>
                                <tbody>
                                    {
                                        groupe.members.map((member) => (
                                            <tr style={{ margin: "5px 0" }}>
                                                <td
                                                    style={{ width: "33.33%" }}
                                                    className={isRtl ? "th-ltr" : "th-rtl"}
                                                >
                                                    {member.nom} {member.prenom}
                                                </td>
                                                <td style={{ width: "40%" }}>
                                                    {member.email}
                                                </td>
                                                <td className={isRtl ? "th-lrt" : "th-ltr"} style={{ textAlign: "center" }}>
                                                    {
                                                        member.id === groupe.chef_id ?
                                                            <span
                                                                style={{
                                                                    width: "70px",
                                                                    padding: "6px 15px",
                                                                    background: "#1E90FF25",
                                                                    borderRadius: "20px",
                                                                    border: "1px solid #1E90FF",
                                                                    color: "#1E90FF",
                                                                    fontWeight: "500"
                                                                }}
                                                            >
                                                                Chef
                                                            </span>
                                                            :
                                                            <span
                                                                style={{
                                                                    width: "70px",
                                                                    padding: "6px 10px",
                                                                    background: "#A9A9A925",
                                                                    borderRadius: "20px",
                                                                    border: "1px solid #A9A9A9",
                                                                    color: "#A9A9A9",
                                                                    fontWeight: "500"
                                                                }}
                                                            >
                                                                Membre
                                                            </span>
                                                    }
                                                </td>
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            </table>
                        </div>
                        <button
                            className="valider-groupe"
                            style={{
                                padding: "6px 15px",
                                background: "#925FE2",
                                color: "#FFF",
                                fontFamily: "Kumbh Sans, sans-serif",
                                marginTop: "auto",
                                marginBottom: "2rem",
                                width: "auto",
                                alignSelf: "flex-end",
                                borderRadius: "20px",
                                fontWeight: "500"
                            }}
                            onClick={(e) => { e.preventDefault(); setConfirmerValider(true) }}
                        >
                            Valider pour Soutenance
                        </button>
                    </div>
                )
            }
            {
                loading && (
                    <div className="loader-overlay">
                        <div className="loader-container">
                            <div className="loader-dots">
                                <div className="loader-dot"></div>
                                <div className="loader-dot"></div>
                                <div className="loader-dot"></div>
                            </div>
                            <p className="loader-text">Opération en cours...</p>
                        </div>
                    </div>
                )
            }
            {
                confirmValider &&
                <ValiderAlert annulerAffecter={() => setConfirmerValider(false)} handleAffecter={handleValider} />
            }
            {
                validerSuccess &&
                <AddAlert addSuccess={() => setValiderSuccess(false)} />
            }
        </div >
    )
}

export default GroupeDetail

const ValiderAlert = ({ annulerAffecter, handleAffecter }) => {
    return (
        <div className="add-departement-success" style={{ zIndex: "3000" }}>
            <div className="img-container" style={{ height: "90px", width: "150px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="30" cy="30" r="30" fill="#FFD21E" />
                    <path d="M29.5001 15.75V34.0833M29.6147 43.25V43.4792H29.3855V43.25H29.6147Z" stroke="white" stroke-width="5.5" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
            </div>
            <span style={{ width: "95%", fontFamily: "Kumbh Sans, sans-serif", textAlign: "center", fontSize: "1.1rem", fontWeight: "500" }}>
                Êtes-vous certain(e) de vouloir valider ce groupe pour le soutenance ?
            </span>
            <div
                className="btns-line"
            >
                <button
                    style={{
                        color: "#000",
                        background: "#E2E4E5"
                    }}
                    onClick={(e) => { annulerAffecter(e) }}
                >
                    Annuler
                </button>
                <button
                    style={{

                    }}
                    onClick={(e) => { handleAffecter(e); }}
                >
                    Affecter
                </button>
            </div>
        </div>
    )
}

const AddAlert = ({ addSuccess }) => {
    return (
        <div className="add-departement-success" style={{ zIndex: "3000" }}>
            <div className="img-container" style={{ height: "90px", width: "100px" }}>
                <img src={doneImg} alt="done" style={{ height: "100%", width: "100%", objectFit: "cover", transform: "scale(1.2)" }} />
            </div>
            <span style={{ width: "95%", fontFamily: "Kumbh Sans, sans-serif", textAlign: "center", fontSize: "1.1rem", fontWeight: "500" }}>
                ✨Le groupe est officiellement validé pour passer la soutenance..✨
            </span>
            <button
                style={{
                    alignSelf: "flex-end",
                    marginTop: "auto",
                    padding: "5px 0",
                    background: "#A67EF2",
                    width: "80px",
                    borderRadius: "20px",
                    color: "#fff",
                    fontWeight: "500"
                }}
                onClick={(e) => { e.preventDefault(); addSuccess() }}
            >
                OK
            </button>
        </div>
    )
}

