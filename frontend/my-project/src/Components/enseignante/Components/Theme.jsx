import React, { createContext, useContext, useEffect, useState } from 'react'
import '../Styles/Theme.css'
import enteteImg from "../../../Assets/Images/entete.png"
import { useParams } from 'react-router-dom'
import axios from 'axios';
import { Link } from 'react-router-dom';
import AppContext from 'antd/es/app/context';
import sleepImage from '../../../Assets/Images/sleeping.png'
import { ModifierTheme } from './ModifierTheme';

export const ThemeEnseignantContext = createContext();

function ThemeEnseignant() {

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
        <ThemeEnseignantContext.Provider value={{setTheme}}>
            <div className='theme-display-container' id='dynamic-list'>
                <div className="theme-display-wrapper">
                    <div className="title-display-theme" style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "0.5rem" }}>
                        <h1 style={{ fontSize: "1.2rem", fontWeight: "500", color: "#4F4F4F", userSelect: "none" }}>
                            <Link className='return-to-themes' to={'/enseignant'}>Tous Les Thèmes</Link> &gt; <span style={{ color: "#925FE2" }}> {theme.titre} </span>
                        </h1>
                        <div className="options-enseignnat-btns" style={{ display: 'flex', gap: "1.6rem", alignItems: 'center' }}>
                            <button onClick={() => setModifierTheme(true)}>
                                Modifier Thème
                            </button>
                            <span
                                style={{ display: "flex", gap: "10px", alignItems: "center", fontFamily: "Kumbh Sans, sans-serif", fontWeight: "600", color: "#925FE2", cursor: "pointer" }}
                                onClick={() => setOptionsClicked(true)}
                            >
                                Plus d'Options
                                <svg width="8" height="12" viewBox="0 0 10 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M1.5 1L8.5 8L1.5 15" stroke="#925FE2" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
                                </svg>
                            </span>
                        </div>
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
                {
                    optionsClicked && (
                        <div className={`other-options`}>
                            <div className="about-title">
                                <svg width="36" height="36" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ cursor: "pointer" }} onClick={() => setOptionsClicked(false)}>
                                    <path d="M25 27.9168L14.7917 38.1252C14.4098 38.5071 13.9237 38.6981 13.3334 38.6981C12.7431 38.6981 12.257 38.5071 11.875 38.1252C11.4931 37.7432 11.3021 37.2571 11.3021 36.6668C11.3021 36.0766 11.4931 35.5904 11.875 35.2085L22.0834 25.0002L11.875 14.7918C11.4931 14.4099 11.3021 13.9238 11.3021 13.3335C11.3021 12.7432 11.4931 12.2571 11.875 11.8752C12.257 11.4932 12.7431 11.3022 13.3334 11.3022C13.9237 11.3022 14.4098 11.4932 14.7917 11.8752L25 22.0835L35.2084 11.8752C35.5903 11.4932 36.0764 11.3022 36.6667 11.3022C37.257 11.3022 37.7431 11.4932 38.125 11.8752C38.507 12.2571 38.698 12.7432 38.698 13.3335C38.698 13.9238 38.507 14.4099 38.125 14.7918L27.9167 25.0002L38.125 35.2085C38.507 35.5904 38.698 36.0766 38.698 36.6668C38.698 37.2571 38.507 37.7432 38.125 38.1252C37.7431 38.5071 37.257 38.6981 36.6667 38.6981C36.0764 38.6981 35.5903 38.5071 35.2084 38.1252L25 27.9168Z" fill="#000000" fill-opacity="0.8" />
                                </svg>
                                <div style={{ display: "flex", gap: "0.5rem", alignSelf: "center" }}>
                                    <svg width="30" height="30" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <g clip-path="url(#clip0_579_2186)">
                                            <path d="M19.9998 36.6673C21.8332 36.6673 23.3332 35.1673 23.3332 33.334H16.6665C16.6665 35.1673 18.1665 36.6673 19.9998 36.6673Z" fill="black" />
                                            <path d="M15.0002 31.6673H25.0002C25.9168 31.6673 26.6668 30.9173 26.6668 30.0007C26.6668 29.084 25.9168 28.334 25.0002 28.334H15.0002C14.0835 28.334 13.3335 29.084 13.3335 30.0007C13.3335 30.9173 14.0835 31.6673 15.0002 31.6673Z" fill="black" />
                                            <path d="M20 3.33398C13.1 3.33398 7.5 8.93398 7.5 15.834C7.5 22.2007 11.9333 25.6007 13.7833 26.6673H26.2167C28.0667 25.6007 32.5 22.2007 32.5 15.834C32.5 8.93398 26.9 3.33398 20 3.33398Z" fill="black" />
                                        </g>
                                        <defs>
                                            <clipPath id="clip0_579_2186">
                                                <rect width="40" height="40" fill="white" />
                                            </clipPath>
                                        </defs>
                                    </svg>

                                    <h1 style={{ fontSize: "1.2rem", fontWeight: "600", color: "#000", paddingTop: "6px", fontFamily: "Kumbh Sans, sans-serif" }}>
                                        Sur le Thème
                                    </h1>
                                </div>
                            </div>
                            {
                                statut === "En Attente" ?
                                    <div className="flex-column" style={{ display: 'flex', flexDirection: "column", gap: "1rem" }}>
                                        <div className="pas-encore-accepter">
                                            <img src={sleepImage} alt="sleeping" style={{ height: "90px" }} />
                                            <p style={{ textAlign: "center" }}>
                                                🔒 Votre thème est en attente de validation. Il doit d'abord être approuvé par un administrateur avant d'être attribué aux étudiants.
                                            </p>
                                        </div>
                                    </div>
                                    : statut === "Refusé" ?
                                        <div className="flex-column" style={{ display: 'flex', flexDirection: "column", gap: "1rem" }}>
                                            <div className="pas-encore-accepter" style={{ paddingTop: "1rem", gap: "1rem" }}>
                                                <svg width="50" height="50" viewBox="0 0 70 70" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M35 4.375C18.0879 4.375 4.375 18.0879 4.375 35C4.375 51.9121 18.0879 65.625 35 65.625C51.9121 65.625 65.625 51.9121 65.625 35C65.625 18.0879 51.9121 4.375 35 4.375ZM54.7217 51.0508L18.9834 15.3125C17.6367 16.4062 16.4062 17.6367 15.3125 18.9834L51.0508 54.7217C46.6758 58.29 41.084 60.4297 35 60.4297C20.959 60.4297 9.57031 49.041 9.57031 35C9.57031 20.959 20.959 9.57031 35 9.57031C49.041 9.57031 60.4297 20.959 60.4297 35C60.4297 41.084 58.29 46.6758 54.7217 51.0508Z" fill="#A52A2A" />
                                                    <path d="M35 9.57031C20.959 9.57031 9.57031 20.959 9.57031 35C9.57031 49.041 20.959 60.4297 35 60.4297C41.084 60.4297 46.6758 58.29 51.0508 54.7217L15.3125 18.9834C16.4062 17.6367 17.6367 16.4062 18.9834 15.3125L54.7217 51.0508C58.29 46.6758 60.4297 41.084 60.4297 35C60.4297 20.959 49.041 9.57031 35 9.57031Z" fill="black" fill-opacity="0.15" />
                                                </svg>

                                                <p style={{ textAlign: "center" }}>
                                                    Votre proposition de thème a été examinée et rejetée.
                                                </p>
                                            </div>
                                            <div className="motif-div">
                                                <span style={{ display: 'flex', gap: "8px", fontFamily: "Nunito, sans-serif", fontSize: "1.1rem", fontWeight: "600", color: "#D42803", alignItems: "flex-end" }}>
                                                    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M12 20C14.1217 20 16.1566 19.1571 17.6569 17.6569C19.1571 16.1566 20 14.1217 20 12C20 9.87827 19.1571 7.84344 17.6569 6.34315C16.1566 4.84285 14.1217 4 12 4C9.87827 4 7.84344 4.84285 6.34315 6.34315C4.84285 7.84344 4 9.87827 4 12C4 14.1217 4.84285 16.1566 6.34315 17.6569C7.84344 19.1571 9.87827 20 12 20ZM12 8.75C11.31 8.75 10.75 9.31 10.75 10V10.107C10.75 10.3059 10.671 10.4967 10.5303 10.6373C10.3897 10.778 10.1989 10.857 10 10.857C9.80109 10.857 9.61032 10.778 9.46967 10.6373C9.32902 10.4967 9.25 10.3059 9.25 10.107V10C9.25 9.27065 9.53973 8.57118 10.0555 8.05546C10.5712 7.53973 11.2707 7.25 12 7.25H12.116C12.654 7.25025 13.179 7.41522 13.6204 7.72272C14.0618 8.03023 14.3985 8.46553 14.5852 8.97008C14.7718 9.47463 14.7995 10.0242 14.6645 10.545C14.5295 11.0657 14.2383 11.5327 13.83 11.883L13.06 12.543C12.9634 12.6269 12.8858 12.7304 12.8323 12.8466C12.7789 12.9628 12.7508 13.0891 12.75 13.217V13.75C12.75 13.9489 12.671 14.1397 12.5303 14.2803C12.3897 14.421 12.1989 14.5 12 14.5C11.8011 14.5 11.6103 14.421 11.4697 14.2803C11.329 14.1397 11.25 13.9489 11.25 13.75V13.217C11.25 12.52 11.554 11.858 12.083 11.405L12.854 10.745C13.0299 10.5942 13.1554 10.3931 13.2136 10.1689C13.2718 9.9446 13.26 9.70787 13.1796 9.49056C13.0992 9.27325 12.9541 9.08578 12.764 8.95338C12.5739 8.82098 12.3477 8.75 12.116 8.75H12ZM13 16C13 16.2652 12.8946 16.5196 12.7071 16.7071C12.5196 16.8946 12.2652 17 12 17C11.7348 17 11.4804 16.8946 11.2929 16.7071C11.1054 16.5196 11 16.2652 11 16C11 15.7348 11.1054 15.4804 11.2929 15.2929C11.4804 15.1054 11.7348 15 12 15C12.2652 15 12.5196 15.1054 12.7071 15.2929C12.8946 15.4804 13 15.7348 13 16Z" fill="#D42803" />
                                                    </svg>
                                                    MOTIF DE REFUS
                                                </span>
                                                <span style={{ textTransform: "capitalize", fontSize: "1.05rem", marginLeft: "10px" }}>
                                                    {theme.motif}
                                                </span>
                                            </div>
                                        </div>
                                        :
                                        <div className="themes-display-table">
                                            <table>
                                                <thead>
                                                    <tr style={{ margin: "5px 0" }}>
                                                        <th className={isRtl ? "th-ltr" : "th-rtl"} style={{ textIndent: "7px", width: "25%" }}>
                                                            Groupe
                                                        </th>
                                                        <th style={{ width: "25%" }}>Année</th>
                                                        <th style={{ width: "25%" }}>
                                                            Priorité
                                                        </th>
                                                        <th className={`${isRtl ? "th-rtl" : "th-ltr"} text-center`} style={{ width: "100%", paddingLeft: "10px" }}>
                                                            Options
                                                        </th>
                                                    </tr>

                                                </thead>
                                                <tbody>
                                                    <tr style={{ margin: "5px 0" }}>
                                                        <td
                                                            style={{ width: "25%" }}
                                                            className={isRtl ? "th-ltr" : "th-rtl"}
                                                        >
                                                            Groupe 01
                                                        </td>
                                                        <td style={{ width: "25%" }}>
                                                            2 CS
                                                        </td>
                                                        <td style={{ width: "25%" }}>
                                                            1
                                                        </td>
                                                        <td className={isRtl ? "th-lrt" : "th-ltr"}>
                                                            <button style={{
                                                                padding: "4px 12px",
                                                                borderRadius: "15px",
                                                                background: "#925FE2",
                                                                color: "#fff"
                                                            }}>
                                                                Affecter
                                                            </button>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                            }
                        </div>
                    )
                }
                {
                    modifierTheme &&
                    <ModifierTheme
                        theme={theme}
                        annulerAjouter={() => setModifierTheme(false)}
                        startLoading={() => setLoading(true)}
                        stopLoading={() => setLoading(false)}
                    />
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
            </div>
        </ThemeEnseignantContext.Provider>
    )
}

export default ThemeEnseignant
