import React, { useState, useEffect, useRef, useContext, createContext } from 'react'
import '../Styles/EtudiantsListe.css';
import { ReactComponent as SearchIcon } from '../../../Assets/Icons/Search.svg';
import { ReactComponent as EditIcon } from '../../../Assets/Icons/edit.svg';
import { ReactComponent as DeleteIcon } from '../../../Assets/Icons/Delete.svg';
import { ReactComponent as ArrowIcon } from '../../../Assets/Icons/Arrow.svg';
import { ReactComponent as EmptyIcon } from '../../../Assets/Icons/notFound.svg';
import { AjouterEtudiant } from './AjouterEtudiant';
import { AppContext } from '../../../App';
import '../../Partials/Components/i18n'
import { useTranslation } from 'react-i18next';
import axios from 'axios';

export const EtudiantsContext = createContext();

function EtudiantsListe() {

    const { isRtl } = useContext(AppContext);
    const [etudiants, setEtudiants] = useState([])

    useEffect(() => {

        axios
            .get(`${process.env.REACT_APP_API_URL_SERVICE1}/etudiants/`)
            .then(async (res) => {
                const etudiantsData = res.data;

                const etudiantWithData = await Promise.all(
                    etudiantsData.map(async (etudiant) => {
                        let annee_titre = null;
                        let specialite_title = null;

                        try {
                            const anneeResponse = await axios.get(`${process.env.REACT_APP_API_URL_SERVICE1}/annees/${etudiant.annee_etude}/`);
                            const anneeData = anneeResponse.data;
                            annee_titre = `${anneeData.title} ${anneeData.departement_title.toLowerCase() === "préparatoire" ? "CPI" : "CS"}`;
                        } catch (error) {
                            console.error(`Erreur récupération année pour le thème ${etudiant.id}`, error);
                        }

                        try {
                            if (etudiant.specialite) {
                                const specialiteRes = await axios.get(`${process.env.REACT_APP_API_URL_SERVICE1}/specialites/${etudiant.specialite}/`);
                                specialite_title = specialiteRes.data.title;
                            }
                        } catch (error) {
                            console.error(`Erreur récupération spécialité pour le thème ${etudiant.id}`, error);
                        }

                        return {
                            ...etudiant,
                            annee_titre,
                            specialite_title,
                        };
                    })
                );

                setEtudiants(etudiantWithData);
            })
            .catch((err) => console.error(err));
    }, [])

    const getAnneeColor = (annee, specialite) => {
        let color = "black";
        let backgroundColor = "transparent";

        const rawKey = `${annee}-${specialite ? specialite : ""}`;
        const key = rawKey.toLowerCase();

        switch (key) {
            case "2 cpi-":
                color = "#FF8F0D";
                backgroundColor = "#FF8F0D20";
                break;
            case "1 cs-":
                color = "#884DFF";
                backgroundColor = "#884DFF20";
                break;
            case "2 cs-siw":
                color = "#E66AA8";
                backgroundColor = "#E66AA820";
                break;
            case "3 cs-siw":
                color = "#D43F8D";
                backgroundColor = "#D43F8D20";
                break;
            case "2 cs-isi":
                color = "#00E096";
                backgroundColor = "#00E09620";
                break;
            case "3 cs-isi":
                color = "#00B87C";
                backgroundColor = "#00B87C20";
                break;
            case "2 cs-iasd":
                color = "#33A9FF";
                backgroundColor = "#33A9FF20";
                break;
            case "3 cs-iasd":
                color = "#006FCC";
                backgroundColor = "#006FCC20";
                break;
            default:
                color = "black";
                backgroundColor = "transparent";
        }

        return { color, backgroundColor };
    };


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

    const [ajouterEtudiantClicked, setAjouterEtudiantClicked] = useState(false);

    const cancelAjouter = () => setAjouterEtudiantClicked(false)

    const { t } = useTranslation();

    const [showSuccessDraft, setShowSuccessDraft] = useState(false);

    const handleDraftSave = () => {
        setAjouterEtudiantClicked(false);
        setShowSuccessDraft(true);
        setTimeout(() => setShowSuccessDraft(false), 3000);
    };

    console.log(etudiants)
    const [loading, setLoading] = useState(false)
    const [modifierEtudiantState, setModifierEtudiantState] = useState({
        clicked: false,
        etudiant: null
    })

    const cancelModifier = () => {
        setModifierEtudiantState({
            clicked: false,
            etudiant: null
        })
    }

    const [deleteEtudiantState, setDeleteEtudiantState] = useState({
        clicked: false,
        id: null
    })

    const [searchTerm, setSearchTerm] = useState('');
    const filteredEtudiants = etudiants.filter(etudiant => {
        const search = searchTerm.toLowerCase();
        return (
            etudiant.nom.toLowerCase().startsWith(search) ||
            etudiant.prenom.toLowerCase().startsWith(search)
        );
    });

    const exportToExcel = (e) => {
        e.preventDefault();
        axios({
            url: `${process.env.REACT_APP_API_URL_SERVICE1}/export/etudiants/excel/`,
            method: 'GET',
            responseType: 'blob',
        })
            .then((response) => {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'etudiants.xlsx');
                document.body.appendChild(link);
                link.click();

                window.URL.revokeObjectURL(url);
                document.body.removeChild(link);
            })
            .catch((err) => {
                console.error('Erreur de téléchargement:', err);
                if (err.response) {
                    console.error('Détails:', err.response.data);
                }
            });
    };

    return (
        <EtudiantsContext.Provider value={{ setEtudiants, setLoading }}>
            <div className='etudiants-liste-container' id='dynamic-liste' ref={dynamicListRef}>
                <div className="etudiants-liste-wrapper" style={{ paddingRight: isRtl ? "0" : "12px", paddingLeft: isRtl ? "12px" : "0" }}>
                    <div className="btns-container">
                        <div className="ajouter-etudiants-btns">
                            <button onClick={(e) => exportToExcel(e)}>
                                {t('enseignantsPage.exportBtn')}
                            </button>
                            <button
                                style={{ color: "#fff", backgroundColor: "#925FE2" }}
                                onClick={() => setAjouterEtudiantClicked(true)}
                            >
                                {t('etudiantsPage.addBtn')}
                            </button>
                        </div>
                        <div className="supprimer-btn" style={{ marginRight: "0.5rem" }}>
                            <button>
                                {t('enseignantsPage.desactivateBtn')}
                            </button>
                        </div>
                    </div>
                    <div className="recherche-etudiants-line">
                        <div className="recherche-etudiants-input">
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
                                    placeholder={t('etudiantsPage.searchPlaceholder')}
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="etudiants-table">
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
                                        }}                                    >
                                        {t('enseignantsPage.tableNom')}
                                    </th>
                                    <th>{t('enseignantsPage.tableMat')}</th>
                                    <th style={{ width: "25%" }}>{t('enseignantsPage.tableEmail')}</th>
                                    <th>{t('etudiantsPage.tableAnnee')}</th>
                                    <th
                                        style={{
                                            width: "100%",
                                            borderTopRightRadius: isRtl ? "0" : "8px",
                                            borderTopLeftRadius: isRtl ? "8px" : "0",
                                            borderBottomRightRadius: isRtl ? "0" : "8px",
                                            borderBottomLeftRadius: isRtl ? "8px" : "0",
                                            borderRight: isRtl ? "none" : "1px solid #E4E4E4",
                                            borderLeft: isRtl ? "1px solid #E4E4E4" : "none",
                                            textAlign: isRtl ? "right" : "left"
                                        }}                                >
                                        {t('etudiantsPage.tableMoyen')}
                                    </th>
                                </tr>
                            </thead>
                            {
                                etudiants.length !== 0 && (
                                    <tbody>
                                        {
                                            filteredEtudiants.map((etudiant) => (
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
                                                        {etudiant.nom} {etudiant.prenom}
                                                    </td>
                                                    <td>
                                                        {etudiant.matricule}
                                                    </td>
                                                    <td style={{ width: "25%" }}>
                                                        {etudiant.email}
                                                    </td>
                                                    <td className='grade-td'>
                                                        <span
                                                            style={{
                                                                color: getAnneeColor(etudiant.annee_titre, etudiant.specialite_title).color,
                                                                backgroundColor: getAnneeColor(etudiant.annee_titre, etudiant.specialite_title).backgroundColor,
                                                                border: `1px solid ${getAnneeColor(etudiant.annee_titre, etudiant.specialite_title).color}`
                                                            }}
                                                        >
                                                            {`${etudiant.annee_titre}${etudiant.specialite_title ? "-" + etudiant.specialite_title : ""}`}
                                                        </span>
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
                                                        <span className="number">{etudiant.moyenne_etudiant}</span>
                                                        <div
                                                            className="line-btns"
                                                            style={{
                                                                marginLeft: isRtl ? "1rem" : "auto",
                                                                marginRight: isRtl ? "auto" : "1rem"
                                                            }}
                                                        >
                                                            <button onClick={() => setModifierEtudiantState({ ...modifierEtudiantState, clicked: true, etudiant: etudiant })}>
                                                                <EditIcon />
                                                                {t('enseignantsPage.modifieBtn')}
                                                            </button>
                                                            <button onClick={() => setDeleteEtudiantState({ ...deleteEtudiantState, clicked: true, id: etudiant.id })}>
                                                                <DeleteIcon />
                                                                {t('enseignantsPage.deleteBtn')}
                                                            </button>
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
                            etudiants.length === 0 && (
                                <div className="no-etudiants-available">
                                    <EmptyIcon className='empty-icon' />
                                    <div className="lines-box">
                                        <h1 style={{ fontSize: "1.45rem", fontWeight: "650" }}>
                                            {t('etudiantsPage.noEtudiants')}
                                        </h1>
                                        <span style={{ width: "600px", textAlign: "center", color: "#4F4F4F", fontWeight: "500" }}>
                                            {t('etudiantsPage.startAdd')}
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
                    ajouterEtudiantClicked && (
                        <AjouterEtudiant annulerAjouter={cancelAjouter} handleDraftSave={handleDraftSave} />
                    )
                }
                {
                    modifierEtudiantState.clicked && (
                        <ModifierEtudiant annulerModifier={cancelModifier} etudiant={modifierEtudiantState.etudiant} />
                    )
                }
                {
                    deleteEtudiantState.clicked && (
                        <DeleteEtudiant annulerDelete={() => setDeleteEtudiantState({ clicked: false, id: null })} id={deleteEtudiantState.id} />
                    )
                }
                {
                    showSuccessDraft &&
                    <div className="saved-success animated">
                        <span style={{ fontFamily: 'Kumbh Sans', fontSize: "0.85rem", fontWeight: "500" }}>
                            Metre en brouillon avec success
                        </span>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M10.6 13.8L8.45 11.65C8.26667 11.4667 8.03333 11.375 7.75 11.375C7.46667 11.375 7.23333 11.4667 7.05 11.65C6.86667 11.8333 6.775 12.0667 6.775 12.35C6.775 12.6333 6.86667 12.8667 7.05 13.05L9.9 15.9C10.1 16.1 10.3333 16.2 10.6 16.2C10.8667 16.2 11.1 16.1 11.3 15.9L16.95 10.25C17.1333 10.0667 17.225 9.83333 17.225 9.55C17.225 9.26667 17.1333 9.03333 16.95 8.85C16.7667 8.66667 16.5333 8.575 16.25 8.575C15.9667 8.575 15.7333 8.66667 15.55 8.85L10.6 13.8ZM12 22C10.6167 22 9.31667 21.7373 8.1 21.212C6.88334 20.6867 5.825 19.9743 4.925 19.075C4.025 18.1757 3.31267 17.1173 2.788 15.9C2.26333 14.6827 2.00067 13.3827 2 12C1.99933 10.6173 2.262 9.31733 2.788 8.1C3.314 6.88267 4.02633 5.82433 4.925 4.925C5.82367 4.02567 6.882 3.31333 8.1 2.788C9.318 2.26267 10.618 2 12 2C13.382 2 14.682 2.26267 15.9 2.788C17.118 3.31333 18.1763 4.02567 19.075 4.925C19.9737 5.82433 20.6863 6.88267 21.213 8.1C21.7397 9.31733 22.002 10.6173 22 12C21.998 13.3827 21.7353 14.6827 21.212 15.9C20.6887 17.1173 19.9763 18.1757 19.075 19.075C18.1737 19.9743 17.1153 20.687 15.9 21.213C14.6847 21.739 13.3847 22.0013 12 22ZM12 20C14.2333 20 16.125 19.225 17.675 17.675C19.225 16.125 20 14.2333 20 12C20 9.76667 19.225 7.875 17.675 6.325C16.125 4.775 14.2333 4 12 4C9.76667 4 7.875 4.775 6.325 6.325C4.775 7.875 4 9.76667 4 12C4 14.2333 4.775 16.125 6.325 17.675C7.875 19.225 9.76667 20 12 20Z" fill="#925FE2" />
                        </svg>
                    </div>
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
                                <p className="loader-text">Enregistrement en cours...</p>
                            </div>
                        </div>
                    )
                }
            </div >
        </EtudiantsContext.Provider>
    )
}

export default EtudiantsListe

const ModifierEtudiant = ({ annulerModifier, etudiant }) => {

    const [annees, setAnnees] = useState([])
    const [specialites, setSpecialites] = useState([])

    useEffect(() => {

        axios.get(`${process.env.REACT_APP_API_URL_SERVICE1}/annees/`)
            .then((res) => setAnnees(res.data))
            .catch((err) => console.error("Erreur Axios :", err))

        axios.get(`${process.env.REACT_APP_API_URL_SERVICE1}/specialites/`)
            .then((res) => setSpecialites(res.data))
            .catch((err) => console.error("Erreur Axios :", err))

    }, [])

    const { t } = useTranslation();

    const { setEtudiants } = useContext(EtudiantsContext);

    const [newStudent, setNewStudent] = useState({
        email: etudiant.email,
        nom: etudiant.nom,
        prenom: etudiant.prenom,
        annee_etude: etudiant.annee_etude,
        moyenne_etudiant: etudiant.moyenne_etudiant,
        matricule: etudiant.matricule,
        specialite: etudiant.specialite
    })

    const [isHasSpcialite, setIsHasSpecialilte] = useState(false)

    useEffect(() => {
        const selectedAnnee = annees.find(a => a.id === newStudent.annee_etude);

        const isValid = selectedAnnee?.has_specialite
        setIsHasSpecialilte(isValid);
        console.log("Selected annee:", selectedAnnee?.title, "| isValid:", isValid);
    }, [newStudent.annee_etude, annees]);

    const modifyStudent = (e) => {

        e.preventDefault();

        axios.put(`${process.env.REACT_APP_API_URL_SERVICE1}/etudiants/${etudiant.id}/`, newStudent)
            .then((res) => {
                const updatedStudent = res.data;
                // Remplacer l'ancien étudiant par le nouveau
                setEtudiants(prev =>
                    prev.map(e => e.id === updatedStudent.id ? updatedStudent : e)
                );
                annulerModifier();
            })
            .catch((err) => {
                console.error("Erreur Axios :", err);
                if (err.response) {
                    console.error("Détails de l'erreur :", err.response.data);
                }
            })


    }

    return (
        <div className='ajouter-etudiant-container' style={{ height: "400px" }}>
            <div className="ajouter-etudiant-wrapper">
                <div className="title-line" style={{ marginBottom: "1rem" }}>
                    <h1>{t('etudiantsPage.addBtn')}</h1>
                    <svg width="36" height="36" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ cursor: "pointer" }} onClick={() => annulerModifier()}>
                        <path d="M25 27.9168L14.7917 38.1252C14.4098 38.5071 13.9237 38.6981 13.3334 38.6981C12.7431 38.6981 12.257 38.5071 11.875 38.1252C11.4931 37.7432 11.3021 37.2571 11.3021 36.6668C11.3021 36.0766 11.4931 35.5904 11.875 35.2085L22.0834 25.0002L11.875 14.7918C11.4931 14.4099 11.3021 13.9238 11.3021 13.3335C11.3021 12.7432 11.4931 12.2571 11.875 11.8752C12.257 11.4932 12.7431 11.3022 13.3334 11.3022C13.9237 11.3022 14.4098 11.4932 14.7917 11.8752L25 22.0835L35.2084 11.8752C35.5903 11.4932 36.0764 11.3022 36.6667 11.3022C37.257 11.3022 37.7431 11.4932 38.125 11.8752C38.507 12.2571 38.698 12.7432 38.698 13.3335C38.698 13.9238 38.507 14.4099 38.125 14.7918L27.9167 25.0002L38.125 35.2085C38.507 35.5904 38.698 36.0766 38.698 36.6668C38.698 37.2571 38.507 37.7432 38.125 38.1252C37.7431 38.5071 37.257 38.6981 36.6667 38.6981C36.0764 38.6981 35.5903 38.5071 35.2084 38.1252L25 27.9168Z" fill="#000000" fill-opacity="0.8" />
                    </svg>

                </div>
                <form id='ajouterFormEtudiant'>
                    <div className='ajouter-etudiant-inner-container'>
                        <div className="ajouter-input-line">
                            <div className="input-flex">
                                <label style={{ fontSize: "0.9rem", color: "#00000070", fontWeight: "430" }}>{t('enseignantsPage.nameInput')}</label>
                                <input
                                    type="text"
                                    name="nom"
                                    id="nom"
                                    value={newStudent.nom}
                                    onChange={(e) => setNewStudent({ ...newStudent, nom: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="input-flex">
                                <label style={{ fontSize: "0.9rem", color: "#00000070", fontWeight: "430" }}>{t('enseignantsPage.prenomInput')}</label>
                                <input
                                    type="text"
                                    name="prenom"
                                    id="prenom"
                                    value={newStudent.prenom}
                                    onChange={(e) => setNewStudent({ ...newStudent, prenom: e.target.value })}
                                    required
                                />
                            </div>
                        </div>
                        <div className="ajouter-input-line select-line">
                            <div className="input-flex">
                                <label style={{ fontSize: "0.9rem", color: "#00000070", fontWeight: "430" }}>{t('enseignantsPage.emailInput')}</label>
                                <input
                                    type="text"
                                    name="adresse"
                                    id="adresse"
                                    value={newStudent.email}
                                    onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="select-flex">
                                <div className="select-flex-line">
                                    <div style={{ position: "relative", display: "inline-block" }}>
                                        <select
                                            className="custom-select"
                                            value={newStudent.annee_etude}
                                            onChange={(e) => setNewStudent({ ...newStudent, annee_etude: parseInt(e.target.value) })}
                                            required
                                        >
                                            <option>{t('etudiantsPage.anneeInput')}</option>
                                            {
                                                annees.map((annee) => (
                                                    <option value={annee.id}>{annee.title} {annee.departement_title.toLowerCase() === "préparatoire" ? "CPI" : "CS"}</option>
                                                ))
                                            }
                                        </select>
                                        <svg
                                            width="10"
                                            height="6"
                                            viewBox="0 0 10 6"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                            style={{
                                                position: "absolute",
                                                right: "60px",
                                                top: "50%",
                                                transform: "translateY(-50%)",
                                                pointerEvents: "none"
                                            }}
                                        >
                                            <path d="M4.99929 4.18863L8.77899 0.220677C8.91347 0.0793351 9.09533 0 9.28493 0C9.47453 0 9.65649 0.0793351 9.79097 0.220677C9.85721 0.290046 9.90976 0.372607 9.94565 0.463596C9.98153 0.554585 10 0.652194 10 0.750779C10 0.849365 9.98153 0.946974 9.94565 1.03796C9.90976 1.12895 9.85721 1.21152 9.79097 1.28089L5.50595 5.77932C5.37147 5.92066 5.1896 6 5 6C4.8104 6 4.62853 5.92066 4.49405 5.77932L0.209032 1.28089C0.14279 1.21152 0.0902398 1.12895 0.0543536 1.03796C0.0184674 0.946974 0 0.849365 0 0.750779C0 0.652194 0.0184674 0.554585 0.0543536 0.463596C0.0902398 0.372607 0.14279 0.290046 0.209032 0.220677C0.343604 0.0795203 0.525523 0.000314919 0.715067 0.000314919C0.904612 0.000314919 1.08644 0.0795203 1.22101 0.220677L4.99929 4.18863Z" fill="#8A8A8A" />
                                        </svg>
                                    </div>
                                    {
                                        isHasSpcialite &&
                                        <div style={{ position: "relative", display: "inline-block" }}>
                                            <select
                                                className="custom-select"
                                                value={newStudent.specialite}
                                                onChange={(e) => setNewStudent({ ...newStudent, specialite: parseInt(e.target.value) })}
                                            >
                                                <option>Spécialité</option>
                                                {
                                                    specialites.map((spec) => (
                                                        <option value={spec.id}> {spec.title} </option>
                                                    ))
                                                }
                                            </select>
                                            <svg
                                                width="10"
                                                height="6"
                                                viewBox="0 0 10 6"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                                style={{
                                                    position: "absolute",
                                                    right: "60px",
                                                    top: "50%",
                                                    transform: "translateY(-50%)",
                                                    pointerEvents: "none"
                                                }}
                                            >
                                                <path d="M4.99929 4.18863L8.77899 0.220677C8.91347 0.0793351 9.09533 0 9.28493 0C9.47453 0 9.65649 0.0793351 9.79097 0.220677C9.85721 0.290046 9.90976 0.372607 9.94565 0.463596C9.98153 0.554585 10 0.652194 10 0.750779C10 0.849365 9.98153 0.946974 9.94565 1.03796C9.90976 1.12895 9.85721 1.21152 9.79097 1.28089L5.50595 5.77932C5.37147 5.92066 5.1896 6 5 6C4.8104 6 4.62853 5.92066 4.49405 5.77932L0.209032 1.28089C0.14279 1.21152 0.0902398 1.12895 0.0543536 1.03796C0.0184674 0.946974 0 0.849365 0 0.750779C0 0.652194 0.0184674 0.554585 0.0543536 0.463596C0.0902398 0.372607 0.14279 0.290046 0.209032 0.220677C0.343604 0.0795203 0.525523 0.000314919 0.715067 0.000314919C0.904612 0.000314919 1.08644 0.0795203 1.22101 0.220677L4.99929 4.18863Z" fill="#8A8A8A" />
                                            </svg>
                                        </div>
                                    }


                                </div>
                            </div>
                        </div>
                        <div className="ajouter-input-line">
                            <div className="input-flex">
                                <label style={{ fontSize: "0.9rem", color: "#00000070", fontWeight: "430" }}>{t('enseignantsPage.MatInput')}</label>
                                <input
                                    type="text"
                                    name="nom"
                                    id="nom"
                                    value={newStudent.matricule}
                                    onChange={(e) => setNewStudent({ ...newStudent, matricule: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="input-flex">
                                <label style={{ fontSize: "0.9rem", color: "#00000070", fontWeight: "430" }}>{t('etudiantsPage.tableMoyen')}</label>
                                <input
                                    type="text"
                                    name="prenom"
                                    id="prenom"
                                    value={newStudent.moyenne_etudiant}
                                    onChange={(e) => setNewStudent({ ...newStudent, moyenne_etudiant: e.target.value })}
                                    required
                                />
                            </div>
                        </div>
                    </div>


                </form>
                <div className="btns-form-line">

                    <button
                        className='brouillon-btn'
                        style={{ backgroundColor: "#E2E4E5", color: "#060606" }}
                        onClick={() => annulerModifier()}
                    >
                        Annuler
                    </button>
                    <button type='submit' className='ajout-btn' form='ajouterFormEtudiant' onClick={(e) => modifyStudent(e)}>
                        {t('etudiantsPage.addBtn')}
                    </button>


                </div>
            </div>
        </div>
    )
}

const DeleteEtudiant = ({ annulerDelete, id }) => {

    const { setEtudiants } = useContext(EtudiantsContext)

    const deleteStudent = (e) => {

        e.preventDefault();

        axios.delete(`${process.env.REACT_APP_API_URL_SERVICE1}/etudiants/${id}/`)
            .then(() => {
                setEtudiants(prev =>
                    prev.filter(e => e.id !== id)
                );
                annulerDelete();
            })
            .catch((err) => {
                console.error("Erreur Axios :", err);
                if (err.response) {
                    console.error("Détails de l'erreur :", err.response.data);
                }
            })


    }

    return (
        <div className="delete-etudiant-alret">
            <div className="img-container" style={{ height: "90px", width: "150px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="30" cy="30" r="30" fill="#FFD21E" />
                    <path d="M29.5001 15.75V34.0833M29.6147 43.25V43.4792H29.3855V43.25H29.6147Z" stroke="white" stroke-width="5.5" stroke-linecap="round" stroke-linejoin="round" />
                </svg>

            </div>
            <span style={{ width: "95%", fontFamily: "Kumbh Sans, sans-serif", textAlign: "center", fontSize: "1.1rem", fontWeight: "500" }}>
                Êtes-vous sûr(e) de vouloir supprimer ce étudiant ? Cette action est irréversible.
            </span>
            <div
                className="btns-line"
            >
                <button
                    style={{
                        color: "#000",
                        background: "#E2E4E5"
                    }}
                    onClick={(e) => annulerDelete(e)}
                >
                    Annuler
                </button>
                <button
                    style={{
                        background: "#D9534F"
                    }}
                    onClick={(e) => deleteStudent(e)}
                >
                    Supprimer
                </button>
            </div>
        </div>
    )
}

