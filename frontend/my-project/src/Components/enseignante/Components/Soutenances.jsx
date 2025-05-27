import React, { useState, useEffect, useRef, useContext, createContext } from 'react'
import '../../admin/Styles/EnseignantsListe.css';
import { ReactComponent as SearchIcon } from '../../../Assets/Icons/Search.svg';
import { ReactComponent as ArrowIcon } from '../../../Assets/Icons/Arrow.svg';
import { ReactComponent as EmptyIcon } from '../../../Assets/Icons/notFound.svg';
import { AppContext } from '../../../App';
import '../../Partials/Components/i18n'
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import '../../admin/Styles/Soutenances.css'


function SoutenancesEnseignant() {

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

    const { isRtl } = useContext(AppContext);

    const { t } = useTranslation();

    const [soutenances, setSoutenances] = useState([])
    const [loading1, setLoading1] = useState(false)

    useEffect(() => {

        setLoading1(true)

        axios.get(`${process.env.REACT_APP_API_URL_SERVICE6}/soutenances/encadrant/${localStorage.getItem('user_id')}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('access_token')}`
            }
        })
            .then((res) => setSoutenances(res.data))
            .catch((err) => console.error(err.response.data))
            .finally(() => setLoading1(false))

    }, [])


  

    const [searchTerm, setSearchTerm] = useState('');

    const [selectedSoutenance, setSelectedSoutenance] = useState(null)

    return (
            <div className='enseignants-liste-container soutenances-container' id='dynamic-liste' ref={dynamicListRef}>
                <div className="enseignants-liste-wrapper" style={{ paddingRight: isRtl ? "0" : "12px", paddingLeft: isRtl ? "12px" : "0" }}>
                    <div className="btns-container">

                        <h1 style={{ fontSize: "1.6rem", fontWeight: "600", color: "#4F4F4F", marginBottom: "1rem" }}>
                            Tous Les Soutenances
                        </h1>
                    </div>
                    <div className="recherche-enseignants-line">
                        <div className="recherche-enseignants-input">
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
                                <input
                                    type="text"
                                    placeholder={t('enseignantsPage.searchPlaceholder')}
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="enseignants-table">
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
                                            width: "16%",
                                            paddingLeft: isRtl ? undefined : "1rem",
                                            paddingRight: isRtl ? "0.5rem" : undefined,
                                            textAlign: isRtl ? "right" : "left"
                                        }}
                                    >
                                        Date
                                    </th>
                                    <th style={{ width: "12.5%" }}>Heure Debut</th>
                                    <th>Heure Fin</th>
                                    <th style={{width: "15%"}}>Salle</th>
                                    <th style={{width: "15%"}}>
                                        Année Universitaire
                                    </th>
                                    <th
                                        style={{
                                            width: "100%",
                                            borderTopRightRadius: isRtl ? "0" : "8px",
                                            borderTopLeftRadius: isRtl ? "8px" : "0",
                                            borderBottomRightRadius: isRtl ? "0" : "8px",
                                            borderBottomLeftRadius: isRtl ? "8px" : "0",
                                            borderRight: isRtl ? "none" : "1px solid #E4E4E4",
                                            borderLeft: isRtl ? "1px solid #E4E4E4" : "none",
                                            textAlign: "center",
                                            textIndent: "1.8rem"
                                        }}
                                    >
                                        Options
                                    </th>
                                </tr>
                            </thead>
                            {
                                soutenances.length !== 0 && (
                                    <tbody>
                                        {
                                            soutenances.map((soutenance) => (
                                                <tr>
                                                    <td
                                                        style={{
                                                            borderTopLeftRadius: isRtl ? "0" : "8px",
                                                            borderTopRightRadius: isRtl ? "8px" : "0",
                                                            borderBottomLeftRadius: isRtl ? "0" : "8px",
                                                            borderBottomRightRadius: isRtl ? "8px" : "0",
                                                            borderLeft: isRtl ? undefined : "1px solid #E4E4E4",
                                                            borderRight: isRtl ? "1px solid #E4E4E4" : undefined,
                                                            width: "16%",
                                                            paddingLeft: "1rem",
                                                            textAlign: isRtl ? "right" : "left",
                                                            textIndent: "1rem",
                                                            whiteSpace: "nowrap",
                                                            overflow: "hidden",
                                                            textOverflow: "ellipsis"
                                                        }}
                                                    >
                                                        {soutenance.date}
                                                    </td>
                                                    <td style={{ width: "12.5%" }}>
                                                        {soutenance.heure_debut}
                                                    </td>
                                                    <td>
                                                        {soutenance.heure_fin}
                                                    </td>
                                                    <td style={{width: "15%"}}>
                                                        <span
                                                        >
                                                            {soutenance.nom_salle}
                                                        </span>
                                                    </td>
                                                    <td style={{width: "15%"}}>
                                                        {soutenance.annee}
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
                                                            <span
                                                                style={{
                                                                    display: "flex",
                                                                    gap: "8px",
                                                                    alignItems: "center",
                                                                    color: "#884DFF",
                                                                    marginLeft: "8px",
                                                                    fontWeight: "500",
                                                                    cursor: "pointer"
                                                                }}
                                                                onClick={() => setSelectedSoutenance(soutenance)}
                                                            >
                                                                Plus
                                                                <svg width="7" height="12" viewBox="0 0 5 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                    <path d="M0 8.825L3.09042 5L0 1.175L0.951417 0L5 5L0.951417 10L0 8.825Z" fill="#884DFF" fill-opacity="0.8" />
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
                            soutenances.length === 0 && (
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
                    loading1 && (
                        <div className="loader-overlay">
                            <div className="loader-container" style={{ alignItems: "center" }}>
                                <div className="loader-dots">
                                    <div className="loader-dot"></div>
                                    <div className="loader-dot"></div>
                                    <div className="loader-dot"></div>
                                </div>
                                <p className="loader-text">🔄 Chargement des données en cours...</p>
                            </div>
                        </div>
                    )
                }
                {
                    selectedSoutenance && (
                        <div className="detail-soutenance">
                            <div className="about-title">
                                <svg width="36" height="36" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ cursor: "pointer" }} onClick={() => setSelectedSoutenance(null)}>
                                    <path d="M25 27.9168L14.7917 38.1252C14.4098 38.5071 13.9237 38.6981 13.3334 38.6981C12.7431 38.6981 12.257 38.5071 11.875 38.1252C11.4931 37.7432 11.3021 37.2571 11.3021 36.6668C11.3021 36.0766 11.4931 35.5904 11.875 35.2085L22.0834 25.0002L11.875 14.7918C11.4931 14.4099 11.3021 13.9238 11.3021 13.3335C11.3021 12.7432 11.4931 12.2571 11.875 11.8752C12.257 11.4932 12.7431 11.3022 13.3334 11.3022C13.9237 11.3022 14.4098 11.4932 14.7917 11.8752L25 22.0835L35.2084 11.8752C35.5903 11.4932 36.0764 11.3022 36.6667 11.3022C37.257 11.3022 37.7431 11.4932 38.125 11.8752C38.507 12.2571 38.698 12.7432 38.698 13.3335C38.698 13.9238 38.507 14.4099 38.125 14.7918L27.9167 25.0002L38.125 35.2085C38.507 35.5904 38.698 36.0766 38.698 36.6668C38.698 37.2571 38.507 37.7432 38.125 38.1252C37.7431 38.5071 37.257 38.6981 36.6667 38.6981C36.0764 38.6981 35.5903 38.5071 35.2084 38.1252L25 27.9168Z" fill="#000000" fill-opacity="0.8" />
                                </svg>
                                <div style={{ display: "flex", gap: "0.5rem", alignSelf: "center" }}>
                                    <h1 style={{ fontSize: "1.2rem", fontWeight: "600", color: "#000", paddingTop: "6px", fontFamily: "Kumbh Sans, sans-serif" }}>
                                        Sur Soutenance
                                    </h1>
                                </div>
                            </div>
                            <div className="about-soutenance">
                                <div className="detail-felx-column">
                                    <span style={{ fontFamily: "Nunito, sans-serif", fontSize: "1.1rem", fontWeight: "600" }}>
                                        Date
                                    </span>
                                    <div className="value">
                                        {selectedSoutenance.date}
                                    </div>
                                </div>
                                <div className="detail-flew-row" style={{ display: "flex", justifyContent: "space-between" }}>
                                    <div className="detail-felx-column" style={{ width: "48%" }}>
                                        <span style={{ fontFamily: "Nunito, sans-serif", fontSize: "1.1rem", fontWeight: "600" }}>
                                            Heure Debut
                                        </span>
                                        <div className="value">
                                            {selectedSoutenance.heure_debut}
                                        </div>
                                    </div>
                                    <div className="detail-felx-column" style={{ width: "48%" }}>
                                        <span style={{ fontFamily: "Nunito, sans-serif", fontSize: "1.1rem", fontWeight: "600" }}>
                                            Heure Fin
                                        </span>
                                        <div className="value">
                                            {selectedSoutenance.heure_fin}
                                        </div>
                                    </div>
                                </div>
                                <div className="detail-felx-column">
                                    <span style={{ fontFamily: "Nunito, sans-serif", fontSize: "1.1rem", fontWeight: "600" }}>
                                        Salle
                                    </span>
                                    <div className="value">
                                        {selectedSoutenance.nom_salle}
                                    </div>
                                </div>
                                <div className="detail-flew-row" style={{ display: "flex", justifyContent: "space-between" }}>
                                    <div className="detail-felx-column" style={{ width: "48%" }}>
                                        <span style={{ fontFamily: "Nunito, sans-serif", fontSize: "1.1rem", fontWeight: "600" }}>
                                            Année
                                        </span>
                                        <div className="value">
                                            {selectedSoutenance.annee}
                                        </div>
                                    </div>
                                    <div className="detail-felx-column" style={{ width: "48%" }}>
                                        <span style={{ fontFamily: "Nunito, sans-serif", fontSize: "1.1rem", fontWeight: "600" }}>
                                            Spécialité
                                        </span>
                                        <div className="value">
                                            {selectedSoutenance.specialite}
                                        </div>
                                    </div>
                                </div>
                                <div className="detail-felx-column">
                                    <span style={{ fontFamily: "Nunito, sans-serif", fontSize: "1.1rem", fontWeight: "600" }}>
                                        Jury
                                    </span>
                                    <div className="jury-display-table">
                                        <table>
                                            <thead>
                                                <tr style={{ margin: "5px 0" }}>
                                                    <th className={isRtl ? "th-ltr" : "th-rtl"} style={{ textIndent: "7px" }}>
                                                        Nom
                                                    </th>
                                                    <th>
                                                        Prénom
                                                    </th>
                                                    <th className={`${isRtl ? "th-rtl" : "th-ltr"}`} style={{ textAlign: "center" }}>
                                                        Matricule
                                                    </th>
                                                </tr>

                                            </thead>
                                            <tbody>
                                                {
                                                    selectedSoutenance.jury_details.map((jury) => (
                                                        <tr style={{ margin: "5px 0" }}>
                                                            <td
                                                                style={{ textAlign: "start", textIndent: "5px" }}
                                                                className={isRtl ? "th-ltr" : "th-rtl"}
                                                            >
                                                                {jury.nom}
                                                            </td>
                                                            <td >
                                                                {jury.prenom}
                                                            </td>
                                                            <td className={isRtl ? "th-lrt" : "th-ltr"} style={{ textAlign: "center" }}>
                                                                12345
                                                            </td>
                                                        </tr>
                                                    ))
                                                }
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                }
            </div >
    )
}

export default SoutenancesEnseignant

