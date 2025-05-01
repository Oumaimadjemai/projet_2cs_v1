import React, { useState, useEffect, useRef, useContext } from 'react'
import { Outlet } from 'react-router-dom';
import '../Styles/Groupes.css';
import { ReactComponent as SearchIcon } from '../../../Assets/Icons/Search.svg';
import { ReactComponent as ArrowIcon } from '../../../Assets/Icons/Arrow.svg';
import { ReactComponent as EmptyIcon } from '../../../Assets/Icons/notFound.svg';
import { AppContext } from '../../../App';
import '../../Partials/Components/i18n'
import { useTranslation } from 'react-i18next';

export const GroupeLayout = () => {
  return (
    <>
      <Outlet />
    </>
  )
}

function GroupesEnseignant() {
    const enseignants = [
        { id: 1, name: "Djamel Bensaber", matricule: "000E123", email: "a.bencaber@esi-sba.dz", grade: "Professeur", sujetsEncadres: 3 },
        { id: 2, name: "Amine Boukhalfa", matricule: "000E456", email: "a.boukhalfa@esi-sba.dz", grade: "MCF", sujetsEncadres: 5 },
        { id: 3, name: "Nadia Yousfi", matricule: "000E789", email: "n.yousfi@esi-sba.dz", grade: "Professeur", sujetsEncadres: 2 },
        { id: 1, name: "Djamel Bensaber", matricule: "000E123", email: "a.bencaber@esi-sba.dz", grade: "Chercheur", sujetsEncadres: 3 },
        { id: 2, name: "Amine Boukhalfa", matricule: "000E456", email: "a.boukhalfa@esi-sba.dz", grade: "Doctorant", sujetsEncadres: 5 },
        { id: 3, name: "Nadia Yousfi", matricule: "000E789", email: "n.yousfi@esi-sba.dz", grade: "Professeur", sujetsEncadres: 2 },
        { id: 1, name: "Djamel Bensaber", matricule: "000E123", email: "a.bencaber@esi-sba.dz", grade: "MCF", sujetsEncadres: 3 },
        { id: 2, name: "Amine Boukhalfa", matricule: "000E456", email: "a.boukhalfa@esi-sba.dz", grade: "MCF", sujetsEncadres: 5 },
        { id: 3, name: "Nadia Yousfi", matricule: "000E789", email: "n.yousfi@esi-sba.dz", grade: "Doctorant", sujetsEncadres: 2 },
        { id: 1, name: "Djamel Bensaber", matricule: "000E123", email: "a.bencaber@esi-sba.dz", grade: "Professeur", sujetsEncadres: 3 },
        { id: 2, name: "Amine Boukhalfa", matricule: "000E456", email: "a.boukhalfa@esi-sba.dz", grade: "Chercheur", sujetsEncadres: 5 },
        { id: 3, name: "Nadia Yousfi", matricule: "000E789", email: "n.yousfi@esi-sba.dz", grade: "Professeur", sujetsEncadres: 2 },
        { id: 1, name: "Djamel Bensaber", matricule: "000E123", email: "a.bencaber@esi-sba.dz", grade: "Doctorant", sujetsEncadres: 3 },
        { id: 2, name: "Amine Boukhalfa", matricule: "000E456", email: "a.boukhalfa@esi-sba.dz", grade: "MCF", sujetsEncadres: 5 },
        { id: 3, name: "Nadia Yousfi", matricule: "000E789", email: "n.yousfi@esi-sba.dz", grade: "Chercheur", sujetsEncadres: 2 }
    ];

    const getGradeColor = (grade) => {
        switch (grade) {
            case "Professeur":
                return { color: "#D43F8D", backgroundColor: "#D43F8D20" };
            case "MCF":
                return { color: "#E63946", backgroundColor: "#E6394620" };
            case "Chercheur":
                return { color: "#0095FF", backgroundColor: "#0095FF20" };
            case "Doctorant":
                return { color: "#17BEBB", backgroundColor: "#17BEBB20" };
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

    const [ajouterEnseignantClicked, setAjouterEnseignantClicked] = useState(false);

    const cancelAjouter = () => setAjouterEnseignantClicked(false)

    //-----------AppContext-------//

    const { isRtl } = useContext(AppContext);

    const { t } = useTranslation();

    return (
        <div className='groupes-liste-container' id='dynamic-liste' ref={dynamicListRef}>
            <div className="groupes-liste-wrapper" style={{ paddingRight: isRtl ? "0" : "12px", paddingLeft: isRtl ? "12px" : "0" }}>
                <h1 style={{ fontSize: "1.6rem", fontWeight: "600", color: "#4F4F4F", marginBottom: "1rem" }}>
                    Tous Les Groupes <span style={{ color: "#A7A7A7", marginLeft: "5px" }}>10</span>
                </h1>
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
                                        width: "16%",
                                        paddingLeft: isRtl ? undefined : "1rem",
                                        paddingRight: isRtl ? "0.5rem" : undefined,
                                        textAlign: isRtl ? "right" : "left"
                                    }}
                                >
                                    Groupe
                                </th>
                                <th style={{ width: "16%" }}>Chef d'Equipe</th>
                                <th style={{ width: "20% !important" }}>Themes</th>
                                <th>Année Universitaire</th>
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
                                    }}
                                >
                                    Nombre de Documents
                                </th>
                            </tr>
                        </thead>
                        {
                            enseignants.length !== 0 && (
                                <tbody>
                                    {
                                        enseignants.map((enseignant) => (
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
                                                    {enseignant.name}
                                                </td>
                                                <td>
                                                    {enseignant.matricule}
                                                </td>
                                                <td style={{ width: "25%" }}>
                                                    {enseignant.email}
                                                </td>
                                                <td className='grade-td'>
                                                    <span
                                                        style={{
                                                            color: getGradeColor(enseignant.grade).color,
                                                            backgroundColor: getGradeColor(enseignant.grade).backgroundColor,
                                                            border: `1px solid ${getGradeColor(enseignant.grade).color}`
                                                        }}
                                                    >
                                                        {enseignant.grade}
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
                                                    <span className="number">{enseignant.sujetsEncadres}</span>
                                                    <div
                                                        className="line-btns"
                                                        style={{
                                                            marginLeft: isRtl ? "1rem" : "auto",
                                                            marginRight: isRtl ? "auto" : "1rem"
                                                        }}
                                                    >
                                                        <button>
                                                            Rendez-vous
                                                        </button>
                                                        <span style={{ display: "flex", gap: "8px", alignItems: "center", color: "#884DFF" }}>
                                                            Voir plus
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
                        enseignants.length === 0 && (
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
        </div >
    )
}

export default GroupesEnseignant
