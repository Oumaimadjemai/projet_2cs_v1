import React, { useContext, useEffect, useState } from 'react'
import '../../enseignante/Styles/Theme.css'
import enteteImg from "../../../Assets/Images/entete.png"
import { useParams } from 'react-router-dom'
import axios from 'axios';
import { Link } from 'react-router-dom';
import AppContext from 'antd/es/app/context';


function ThemeEtudiant({link}) {

    const { id } = useParams();
    const [theme, setTheme] = useState({})

    useEffect(() => {
        const fetchThemeWithExtraInfo = async () => {
            try {
                const themeResponse = await axios.get(`${process.env.REACT_APP_API_URL_SERVICE2}/themes/${id}/`);
                const themeData = themeResponse.data;

                let updatedTheme = { ...themeData };

                if (themeData.annee_id) {
                    const anneeResponse = await axios.get(`${process.env.REACT_APP_API_URL_SERVICE1}/annees/${themeData.annee_id}/`);
                    updatedTheme.annee_titre = `${anneeResponse.data.title} ${anneeResponse.data.departement_title.toLowerCase() === "préparatoire" ? "CPI" : "CS"}`;
                }

                if (themeData.priorities && themeData.priorities.length > 0) {
                    const prioritiesWithTitles = await Promise.all(
                        themeData.priorities.map(async (priority) => {
                            const specResponse = await axios.get(`${process.env.REACT_APP_API_URL_SERVICE1}/specialites/${priority.specialite_id}/`);
                            return {
                                priorite: priority.priorite,
                                specialite_titre: specResponse.data.title
                            };
                        })
                    );
                    updatedTheme.priorities_with_titles = prioritiesWithTitles;
                }

                if (themeData.enseignant_id) {
                    const enseignantResponse = await axios.get(`${process.env.REACT_APP_API_URL_SERVICE1}/enseignants/${themeData.enseignant_id}/`);
                    updatedTheme.enseignant_nom = `${enseignantResponse.data.nom} ${enseignantResponse.data.prenom}`;
                } else if (themeData.entreprise_id) {
                    const entrepriseResponse = await axios.get(`${process.env.REACT_APP_API_URL_SERVICE1}/entreprises/${themeData.entreprise_id}/`);
                    updatedTheme.entreprise_nom = entrepriseResponse.data.nom;
                }

                setTheme(updatedTheme);

            } catch (error) {
                console.error(error);
            }
        };

        fetchThemeWithExtraInfo();
    }, [id, theme]);


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

    const [optionsClicked, setOptionsClicked] = useState(false)

    const [statut, setStatut] = useState('')

    const getStatut = (valide, reserve, motif) => {
        if (valide) {
            return "Validé"
        } else if (motif) {
            return "Refusé"
        } else if (reserve) {
            return "Reservé"
        } else {
            return "En Attente"
        }
    }

    useEffect(() => {

        setStatut(getStatut(theme.valide, theme.reserve, theme.motif))

    }, [theme])

    const { isRtl } = useContext(AppContext)

    const [modifierTheme, setModifierTheme] = useState(false)

    const [loading, setLoading] = useState(false)

    return (
            <div className='theme-display-container' id='dynamic-list'>
                <div className="theme-display-wrapper">
                    <div className="title-display-theme" style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "0.5rem" }}>
                        <h1 style={{ fontSize: "1.2rem", fontWeight: "500", color: "#4F4F4F", userSelect: "none" }}>
                            <Link className='return-to-themes' to={`/${link}`}>Tous Les Thèmes</Link> &gt; <span style={{ color: "#925FE2" }}> {theme.titre} </span>
                        </h1>
                    </div>
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
                                            Année Concernée
                                        </span>
                                        <span style={{ width: "100%", paddingLeft: "10px", borderLeft: "1px solid #000" }}>
                                            {theme.annee_titre}
                                        </span>
                                    </div>
                                    {
                                        theme.priorities_with_titles && theme.priorities_with_titles.length > 0 && (
                                            <div className="pdf-line">
                                                <span style={{ width: "200px", textAlign: "center", fontSize: "1.05rem" }}>
                                                    Spécialités
                                                </span>
                                                <div style={{ width: "100%", paddingLeft: "10px", borderLeft: "1px solid #000" }}>
                                                    {
                                                        theme.priorities_with_titles.map((p, index) => (
                                                            <div key={index} style={{ marginBottom: "4px" }}>
                                                                Priorité {p.priorite} : {p.specialite_titre}
                                                            </div>
                                                        ))
                                                    }
                                                </div>
                                            </div>
                                        )
                                    }

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

export default ThemeEtudiant
