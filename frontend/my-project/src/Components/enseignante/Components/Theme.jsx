import React, { useEffect, useState } from 'react'
import '../Styles/Theme.css'
import enteteImg from "../../../Assets/Images/entete.png"
import { useParams } from 'react-router-dom'
import axios from 'axios';

function ThemeEnseignant() {

    const { id } = useParams();
    const [theme, setTheme] = useState({})

    useEffect(() => {
        const fetchThemeWithExtraInfo = async () => {
            try {

                const themeResponse = await axios.get(`http://localhost:8001/themes/${id}/`);
                const themeData = themeResponse.data;

                if (themeData.enseignant_id) {

                    const enseignantResponse = await axios.get(`http://localhost:8000/enseignants/${themeData.enseignant_id}/`);
                    const enseignantData = enseignantResponse.data;

                    setTheme({
                        ...themeData,
                        enseignant_nom: `${enseignantData.nom} ${enseignantData.prenom}`
                    });
                } else if (themeData.entreprise_id) {

                    const representantResponse = await axios.get(`http://localhost:8000/entreprises/${themeData.entreprise_id}/`);
                    const representantData = representantResponse.data;

                    setTheme({
                        ...themeData,
                        entreprise_nom: representantData.nom
                    });
                } else {
                    setTheme(themeData);
                }
            } catch (error) {
                console.error(error);
            }
        };

        fetchThemeWithExtraInfo();
    }, [id]);

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
    return (
        <div className='theme-display-container' id='dynamic-list'>
            <div className="theme-display-wrapper">
                <h1 style={{ fontSize: "1.2rem", fontWeight: "500", color: "#4F4F4F" }}>
                    Tous Les Thèmes &gt; <span style={{ color: "#925FE2" }}> {theme.titre} </span>
                </h1>
                <div className="theme-pdf-container">
                    <div className="pdf-form">
                        <img src={enteteImg} alt="symbole esi-sba" />
                        <div className="fiche-title">
                            Fiche de présentation du projet
                        </div>
                        <div className="pdf-table-container">
                            <div className="pdf-table">
                                <div className="pdf-line">
                                    <span style={{ width: "200px", textAlign: "center", fontSize: "1.05rem" }}>Titre Complet</span>
                                    <span style={{ width: "100%", paddingLeft: "10px", borderLeft: "1px solid #000" }}>
                                        {theme.titre}
                                    </span>
                                </div>
                                <div className="pdf-line">
                                    <span style={{ width: "200px", textAlign: "center", fontSize: "1.05rem" }}>
                                        Encadreur
                                    </span>
                                    <span style={{ width: "100%", paddingLeft: "10px", borderLeft: "1px solid #000" }}>
                                        {theme.enseignant_nom}
                                    </span>
                                </div>
                                <div className="pdf-line">
                                    <span style={{ width: "200px", textAlign: "center", fontSize: "1.05rem" }}>
                                        Résumé
                                    </span>
                                    <span style={{ width: "100%", paddingLeft: "10px", borderLeft: "1px solid #000" }}>
                                        {textWithLineBreaks(theme.resume || "")}
                                    </span>
                                </div>
                                <div className="pdf-line">
                                    <span style={{ width: "200px", textAlign: "center", fontSize: "1.05rem" }}>
                                        Outils & Languages
                                    </span>
                                    <span style={{ width: "100%", paddingLeft: "10px", borderLeft: "1px solid #000" }}>
                                        {textWithLineCommas(theme.outils_et_language || "")}
                                    </span>
                                </div>
                                <div className="pdf-line">
                                    <span style={{ width: "200px", textAlign: "center", fontSize: "1.05rem" }}>
                                        Plan de Travail
                                    </span>
                                    <span style={{ width: "100%", paddingLeft: "10px", borderLeft: "1px solid #000" }}>
                                        {textWithLineBreaks(theme.plan_travail || "")}                                    </span>
                                </div>
                                <div className="pdf-line">
                                    <span style={{ width: "200px", textAlign: "center", fontSize: "1.05rem" }}>
                                        Livrables
                                    </span>
                                    <span style={{ width: "100%", paddingLeft: "10px", borderLeft: "1px solid #000" }}>
                                        {textWithLineCommas(theme.livrable || "")}
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

export default ThemeEnseignant
