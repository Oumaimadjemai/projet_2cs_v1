import React, { useState, useEffect, useRef, useContext } from 'react'
import '../Styles/EtudiantsListe.css';
import { ReactComponent as SearchIcon } from '../../../Assets/Icons/Search.svg';
import { ReactComponent as EditIcon } from '../../../Assets/Icons/edit.svg';
import { ReactComponent as DeleteIcon } from '../../../Assets/Icons/Delete.svg';
import { ReactComponent as ArrowIcon } from '../../../Assets/Icons/Arrow.svg';
import { ReactComponent as EmptyIcon } from '../../../Assets/Icons/EmptyState.svg';
import { AjouterEtudiant } from './AjouterEtudiant';
import { AppContext } from '../../../App';
import '../../Partials/Components/i18n'
import { useTranslation } from 'react-i18next';

function EtudiantsListe() {

    const { isRtl } = useContext(AppContext);

    const etudiants = [
        { id: 1, name: "Derki Ayet Halima", matricule: "000E123", email: "ah.derki@esi-sba.dz", annee: "4ème-SIW", moyen: 14.98 },
        { id: 2, name: "Rachid Benhammou ", matricule: "000E456", email: "r.benhamou@esi-sba.dz", annee: "2ème", moyen: 12.11 },
        { id: 3, name: "Yasmine Boudjemaa", matricule: "000E789", email: "y.boudjemaa@esi-sba.dz", annee: "4ème-SIW", moyen: 16.15 },
        { id: 1, name: "Derki Ayet Halima", matricule: "000E123", email: "ah.derki@esi-sba.dz", annee: "5ème-IASD", moyen: 14.98 },
        { id: 2, name: "Rachid Benhammou ", matricule: "000E456", email: "r.benhamou@esi-sba.dz", annee: "3ème", moyen: 12.11 },
        { id: 3, name: "Yasmine Boudjemaa", matricule: "000E789", email: "y.boudjemaa@esi-sba.dz", annee: "4ème-IASD", moyen: 16.15 },
        { id: 1, name: "Derki Ayet Halima", matricule: "000E123", email: "ah.derki@esi-sba.dz", annee: "2ème", moyen: 14.98 },
        { id: 2, name: "Rachid Benhammou ", matricule: "000E456", email: "r.benhamou@esi-sba.dz", annee: "5ème-SIW", moyen: 12.11 },
        { id: 3, name: "Yasmine Boudjemaa", matricule: "000E789", email: "y.boudjemaa@esi-sba.dz", annee: "3ème", moyen: 16.15 },
        { id: 1, name: "Derki Ayet Halima", matricule: "000E123", email: "ah.derki@esi-sba.dz", annee: "4ème-SIW", moyen: 14.98 },
        { id: 2, name: "Rachid Benhammou ", matricule: "000E456", email: "r.benhamou@esi-sba.dz", annee: "3ème", moyen: 12.11 },
        { id: 3, name: "Yasmine Boudjemaa", matricule: "000E789", email: "y.boudjemaa@esi-sba.dz", annee: "5ème-ISI", moyen: 16.15 },
        { id: 1, name: "Derki Ayet Halima", matricule: "000E123", email: "ah.derki@esi-sba.dz", annee: "4ème-ISI", moyen: 14.98 },
        { id: 2, name: "Rachid Benhammou ", matricule: "000E456", email: "r.benhamou@esi-sba.dz", annee: "2ème", moyen: 12.11 },
        { id: 3, name: "Yasmine Boudjemaa", matricule: "000E789", email: "y.boudjemaa@esi-sba.dz", annee: "2ème", moyen: 16.15 }
    ];

    const getAnneeColor = (annee) => {
        switch (annee) {
            case "2ème":
                return { color: "#FF8F0D", backgroundColor: "#FF8F0D20" };
            case "3ème":
                return { color: "#884DFF", backgroundColor: "#884DFF20" };
            case "4ème-SIW":
                return { color: "#E66AA8", backgroundColor: "#E66AA820" };
            case "5ème-SIW":
                return { color: "#D43F8D", backgroundColor: "#D43F8D20" };
            case "4ème-ISI":
                return { color: "#00E096", backgroundColor: "#00E09620" };
            case "5ème-ISI":
                return { color: "#00B87C", backgroundColor: "#00B87C20" };
            case "4ème-IASD":
                return { color: "#33A9FF", backgroundColor: "#33A9FF20" };
            case "5ème-IASD":
                return { color: "#006FCC", backgroundColor: "#006FCC20" };
            default:
                return "black";
        }
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

    return (
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
                                                    {etudiant.name}
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
                                                            color: getAnneeColor(etudiant.annee).color,
                                                            backgroundColor: getAnneeColor(etudiant.annee).backgroundColor,
                                                            border: `1px solid ${getAnneeColor(etudiant.annee).color}`
                                                        }}
                                                    >
                                                        {etudiant.annee}
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
                                                    <span className="number">{etudiant.moyen}</span>
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
                    <AjouterEtudiant annulerAjouter={cancelAjouter} />
                )
            }
        </div >
    )
}

export default EtudiantsListe

