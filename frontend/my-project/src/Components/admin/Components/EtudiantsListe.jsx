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
    const [annees, setAnnees] = useState([])
    const [specialites, setSpecialites] = useState([])

    useEffect(() => {

        axios.get('http://127.0.0.1:8000/etudiants/')
            .then((res) => setEtudiants(res.data))
            .catch((err) => {
                console.error("Erreur Axios :", err);
            })

        axios.get('http://127.0.0.1:8000/annees/')
            .then((res) => setAnnees(res.data))
            .catch((err) => {
                console.error("Erreur Axios :", err);
            })

        axios.get('http://127.0.0.1:8000/specialites/')
            .then((res) => setSpecialites(res.data))
            .catch((err) => {
                console.error("Erreur Axios :", err);
            })

    }, [])

    const getAnneeColor = (annee, specialite) => {
        let color = "black";
        let backgroundColor = "transparent";
        let anneeUniversitaire = ""

        if (!annees.length) return { color, backgroundColor };

        const anneeTrouve = annees.find(a => a.id === annee);
        const specialiteTrouve = specialite
            ? specialites.find(s => s.id === specialite)
            : null;

        // Concatène annee + spécialité si disponible
        const key = specialiteTrouve ? `${anneeTrouve?.title}-${specialiteTrouve.title}` : anneeTrouve?.title;

        switch (true) {
            case key?.includes("2"):
                color = "#FF8F0D";
                backgroundColor = "#FF8F0D20";
                anneeUniversitaire = "2ème"
                break;
            case key?.includes("3"):
                color = "#884DFF";
                backgroundColor = "#884DFF20";
                anneeUniversitaire = "3ème"
                break;
            case key?.includes("4") && key?.includes("SIW"):
                color = "#E66AA8";
                backgroundColor = "#E66AA820";
                anneeUniversitaire = "4ème - SIW"
                break;
            case key?.includes("5") && key?.includes("SIW"):
                color = "#D43F8D";
                backgroundColor = "#D43F8D20";
                anneeUniversitaire = "5ème - ISI"
                break;
            case key?.includes("4") && key?.includes("ISI"):
                color = "#00E096";
                backgroundColor = "#00E09620";
                anneeUniversitaire = "4ème - ISI"
                break;
            case key?.includes("5") && key?.includes("ISI"):
                color = "#00B87C";
                backgroundColor = "#00B87C20";
                anneeUniversitaire = "5ème - ISI"
                break;
            case key?.includes("4") && key?.includes("IASD"):
                color = "#33A9FF";
                backgroundColor = "#33A9FF20";
                anneeUniversitaire = "4ème - IASD"
                break;
            case key?.includes("5") && key?.includes("IASD"):
                color = "#006FCC";
                backgroundColor = "#006FCC20";
                anneeUniversitaire = "5ème - IASD"
                break;
            default:
                color = "black";
                backgroundColor = "transparent";
        }

        return { color, backgroundColor, anneeUniversitaire };
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

    return (
        <EtudiantsContext.Provider value={{ setEtudiants }}>
            <div className='etudiants-liste-container' id='dynamic-liste' ref={dynamicListRef}>
                <div className="etudiants-liste-wrapper" style={{ paddingRight: isRtl ? "0" : "12px", paddingLeft: isRtl ? "12px" : "0" }}>
                    <div className="btns-container">
                        <div className="ajouter-etudiants-btns">
                            <button>
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
                                <input type="text" placeholder={t('etudiantsPage.searchPlaceholder')} />
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
                                            etudiants.map((etudiant) => (
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
                                                                color: getAnneeColor(etudiant.annee_etude, etudiant.specialite).color,
                                                                backgroundColor: getAnneeColor(etudiant.annee_etude, etudiant.specialite).backgroundColor,
                                                                border: `1px solid ${getAnneeColor(etudiant.annee_etude, etudiant.specialite).color}`
                                                            }}
                                                        >
                                                            {getAnneeColor(etudiant.annee_etude, etudiant.specialite).anneeUniversitaire}
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
                                                            <button>
                                                                <EditIcon />
                                                                {t('enseignantsPage.modifieBtn')}
                                                            </button>
                                                            <button>
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
            </div >
        </EtudiantsContext.Provider>
    )
}

export default EtudiantsListe

