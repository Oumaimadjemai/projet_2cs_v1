import React, { useEffect, useState, useRef } from 'react'
import '../Styles/Theme.css'
import enteteImg from "../../../Assets/Images/entete.png"
import { Link, useParams } from 'react-router-dom'
import axios from 'axios';
import '../../Partials/Components/i18n'
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';


function GroupeAdmin() {

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

    const pdfRef = useRef();

    const handleDownloadPDF = async () => {
        const input = document.querySelector('.theme-pdf-container'); // classe du bloc à capturer

        if (!input) return;

        const canvas = await html2canvas(input, { scale: 2 });
        const imgData = canvas.toDataURL('image/png');

        const pdf = new jsPDF('p', 'mm', 'a4');
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();

        const imgWidth = pageWidth;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        let position = 0;

        if (imgHeight <= pageHeight) {
            // Une seule page
            pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
        } else {
            // Multiples pages
            let heightLeft = imgHeight;
            while (heightLeft > 0) {
                pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;
                position -= pageHeight;

                if (heightLeft > 0) {
                    pdf.addPage();
                }
            }
        }

        pdf.save(`Fiche_Groupe_${theme.titre || 'theme'}.pdf`);
    };

    return (

        <div className='theme-display-container' id='dynamic-list'>
            <div className="theme-display-wrapper">
                <div className="title-display-theme" style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "0.5rem" }}>
                    <h1 style={{ fontSize: "1.2rem", fontWeight: "500", color: "#4F4F4F", userSelect: "none" }}>
                        <Link className='return-to-themes' to={'/admin/themes'}>Tous Les Groupes</Link> &gt; <span style={{ color: "#925FE2" }}> {theme.titre} </span>
                    </h1>
                    <span
                        style={{
                            fontFamily: "Kumbh Sans, sans-serif",
                            fontWeight: "500",
                            color: "#FFF",
                            background: "#925FE2",
                            cursor: "pointer",
                            padding: "7px 15px",
                            borderRadius: "20px"
                        }}
                        onClick={handleDownloadPDF}
                    >
                        Télécharger la Fiche
                    </span>
                </div>
                <div className="theme-pdf-container" ref={pdfRef}>
                    <div className="pdf-form">
                        <img src={enteteImg} alt="symbole esi-sba" />
                        <div className="fiche-title">
                            Fiche du Groupe
                        </div>
                        <div className="pdf-table-container">
                            <div className="pdf-table">
                                <div className="pdf-line">
                                    <span style={{ width: "200px", textAlign: "center", fontSize: "1.05rem" }}>Nom du Groupe</span>
                                    <span style={{ width: "100%", paddingLeft: "10px", borderLeft: "1px solid #000" }}>
                                        {theme.titre}
                                    </span>
                                </div>
                                <div className="pdf-line">
                                    <span style={{ width: "200px", textAlign: "center", fontSize: "1.05rem" }}>
                                        Année Académique
                                    </span>
                                    <span style={{ width: "100%", paddingLeft: "10px", borderLeft: "1px solid #000" }}>
                                        {theme.enseignant_nom}
                                    </span>
                                </div>
                                <div className="pdf-line">
                                    <span style={{ width: "200px", textAlign: "center", fontSize: "1.05rem" }}>
                                        Membres
                                    </span>
                                    <span style={{ width: "100%", paddingLeft: "10px", borderLeft: "1px solid #000" }}>
                                        {theme.annee_titre}
                                    </span>
                                </div>
                                <div className="pdf-line">
                                    <span style={{ width: "200px", textAlign: "center", fontSize: "1.05rem" }}>
                                        Fiche des vœux
                                    </span>
                                    <span style={{ width: "100%", paddingLeft: "10px", borderLeft: "1px solid #000" }}>
                                        {textWithLineBreaks(theme.resume || "")}
                                    </span>
                                </div>
                                <div className="pdf-line">
                                    <span style={{ width: "200px", textAlign: "center", fontSize: "1.05rem" }}>
                                        Encadrant
                                    </span>
                                    <span style={{ width: "100%", paddingLeft: "10px", borderLeft: "1px solid #000" }}>
                                        {textWithLineCommas(theme.outils_et_language || "")}
                                    </span>
                                </div>
                                <div className="pdf-line">
                                    <span style={{ width: "200px", textAlign: "center", fontSize: "1.05rem" }}>
                                        Thème Assigné
                                    </span>
                                    <span style={{ width: "100%", paddingLeft: "10px", borderLeft: "1px solid #000" }}>
                                        {textWithLineBreaks(theme.plan_travail || "")}                                    </span>
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

export default GroupeAdmin

