import React, { useState, useEffect, useRef } from 'react'
import '../Styles/EnseignantsListe.css';
import { ReactComponent as SearchIcon } from '../../../Assets/Icons/Search.svg';
import { ReactComponent as EditIcon } from '../../../Assets/Icons/edit.svg';
import { ReactComponent as DeleteIcon } from '../../../Assets/Icons/Delete.svg';
import { ReactComponent as ArrowIcon } from '../../../Assets/Icons/Arrow.svg';


function EnseignantsListe() {

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
                return {color: "#D43F8D", backgroundColor: "#D43F8D20"};
            case "MCF":
                return {color:"#E63946", backgroundColor:"#E6394620"};
            case "Chercheur":
                return {color:"#0095FF", backgroundColor:"#0095FF20"};
            case "Doctorant":
                return {color:"#17BEBB", backgroundColor:"#17BEBB20"};
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
        if (dynamicListRef.current) {
            dynamicListRef.current.addEventListener("scroll", toggleVisibility);
            return () => {
                dynamicListRef.current.removeEventListener("scroll", toggleVisibility);
            };
        }
    }, []);


    const scrollToTop = () => {
        if (dynamicListRef.current) {
            dynamicListRef.current.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        }
    };

    return (
        <div className='enseignants-liste-container' id='dynamic-liste' ref={dynamicListRef}>
            <div className="enseignants-liste-wrapper">
                <div className="btns-container">
                    <div className="ajouter-enseignants-btns">
                        <button>
                            Exporter En Excel
                        </button>
                        <button style={{ color: "#fff", backgroundColor: "#925FE2" }}>
                            Ajouter Enseignants
                        </button>
                    </div>
                    <div className="supprimer-btn" style={{ marginRight: "0.5rem" }}>
                        <button>
                            Désactiver Tous
                        </button>
                    </div>
                </div>
                <div className="recherche-enseignants-line">
                    <div className="recherche-enseignants-input">
                        <button>
                            Filtre
                            <svg width="0.9rem" height="0.5rem" viewBox="0 0 15 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M7.742 6.05489L12.971 0.863892C13.1571 0.678984 13.4087 0.575195 13.671 0.575195C13.9333 0.575195 14.185 0.678984 14.371 0.863892C14.4627 0.954642 14.5354 1.06265 14.585 1.18169C14.6347 1.30072 14.6602 1.42842 14.6602 1.55739C14.6602 1.68636 14.6347 1.81406 14.585 1.93309C14.5354 2.05212 14.4627 2.16014 14.371 2.25089L8.44293 8.13589C8.25689 8.32079 8.00529 8.42458 7.74298 8.42458C7.48068 8.42458 7.22908 8.32079 7.04303 8.13589L1.11493 2.25089C1.02329 2.16014 0.950587 2.05212 0.90094 1.93309C0.851293 1.81406 0.825745 1.68636 0.825745 1.55739C0.825745 1.42842 0.851293 1.30072 0.90094 1.18169C0.950587 1.06265 1.02329 0.954642 1.11493 0.863892C1.3011 0.679226 1.55278 0.575607 1.815 0.575607C2.07723 0.575607 2.32878 0.679226 2.51495 0.863892L7.742 6.05489Z" fill="#925FE2" />
                            </svg>
                        </button>
                        <div className="input-line">
                            <SearchIcon />
                            <input type="text" placeholder='Rechercher un enseignant par nom ou e-mail' />
                        </div>
                    </div>
                </div>

                <div className="enseignants-table">
                    <table>
                        <thead>
                            <tr>
                                <th style={{ borderTopLeftRadius: "8px", borderBottomLeftRadius: "8px", borderLeft: "1px solid #E4E4E4", width: "16%", paddingLeft: "1rem" }}>Nom & Prénom</th>
                                <th>Matricule</th>
                                <th style={{ width: "25%" }}>Adresse Email</th>
                                <th>Grade</th>
                                <th style={{ width: "100%", borderTopRightRadius: "8px", borderBottomRightRadius: "8px", borderRight: "1px solid #E4E4E4" }}>Nombre De Sujets Encadrés</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                enseignants.map((enseignant) => (
                                    <tr>
                                        <td style={{ borderTopLeftRadius: "8px", borderBottomLeftRadius: "8px", borderLeft: "1px solid #E4E4E4", width: "16%", paddingLeft: "1rem", textAlign: "left", textIndent: "1rem" }}>
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
                                                border: `1px solid ${getGradeColor(enseignant.grade).color}` }}
                                            >
                                                {enseignant.grade}
                                            </span>
                                        </td>
                                        <td className='last-td' style={{ borderTopRightRadius: "8px", borderBottomRightRadius: "8px", borderRight: "1px solid #E4E4E4" }}>
                                            <span className="number">{enseignant.sujetsEncadres}</span>
                                            <div className="line-btns">
                                                <button>
                                                    <EditIcon />
                                                    Modifier
                                                </button>
                                                <button>
                                                    <DeleteIcon />
                                                    Supprimer
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>
                {
                    isVisible && (
                        <button
                            onClick={scrollToTop}
                            className='to-top'
                            style={{
                                position: "fixed",
                                bottom: "20px",
                                right: "20px",
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

export default EnseignantsListe
