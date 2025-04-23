import React, { useRef, useState, useEffect } from 'react'
import '../Styles/Themes.css'
import { ReactComponent as SearchIcon } from '../../../Assets/Icons/Search.svg';
import { ReactComponent as CloseIcon } from '../../../Assets/Icons/close-rounded.svg';
import { ReactComponent as CheckIcon } from '../../../Assets/Icons/check-rounded.svg';
import { ReactComponent as ArrowIcon } from '../../../Assets/Icons/Arrow.svg';
import pdfImage from '../../../Assets/Images/projet-pdf-example.png'

function Themes() {

    const themes = [
        {
            title: "Développement d'une application de gestion des stocks",
            teacher: "M. Bensalem",
            annee: "2ème",
            specialite: null
        },
        {
            title: "Application mobile de santé intelligente",
            teacher: "Mme. Kheira",
            annee: "4ème",
            specialite: "SIW"
        },
        {
            title: "Détection d’intrusions dans les réseaux",
            teacher: "M. Lyes",
            annee: "5ème",
            specialite: "IASD"
        },
        {
            title: "Système de recommandation pour une plateforme e-learning",
            teacher: "Mme. Samira",
            annee: "4ème",
            specialite: "ISI"
        },
        {
            title: "Conception d'une base de données pour une bibliothèque",
            teacher: "M. Nacer",
            annee: "3ème",
            specialite: null
        },
        {
            title: "Analyse des sentiments sur les réseaux sociaux",
            teacher: "Mme. Amel",
            annee: "5ème",
            specialite: "SIW"
        },
        {
            title: "Automatisation de la gestion des candidatures",
            teacher: "M. Mourad",
            annee: "4ème",
            specialite: "ISI"
        },
        {
            title: "Simulation de réseaux informatiques",
            teacher: "Mme. Hana",
            annee: "3ème",
            specialite: null
        }
    ];

    const [filterSelected, setFilterSelected] = useState("none")

    const filterRef = useRef('');

    useEffect(() => {

        const handleShowFilter = (e) => {
            if (filterRef.current && !filterRef.current.contains(e.target)) {
                setFilterSelected("none");
            }
        }

        document.addEventListener('mousedown', handleShowFilter);
        return () => {
            document.removeEventListener('mousedown', handleShowFilter)
        }

    }, [])

    const toggleFilter = (filter) => {
        setFilterSelected(filterSelected === filter ? "clicked" : filter)
    }

    const [selectedAnnee, setSelectedAnnee] = useState(null);
    const [selectedSpecialite, setSelectedSpecialite] = useState(null);

    const filteredThemes = themes.filter(theme => {
        return (!selectedAnnee || theme.annee === selectedAnnee) &&
            (!selectedSpecialite || theme.specialite === selectedSpecialite)
    });


    return (
        <div className='themes-container' id='dynamic-liste'>
            <div className="themes-wrapper">
                <div className="btns-title-container">
                    <div className="link">
                        <h1 style={{ fontSize: "1.6rem", fontWeight: "600", color: "#4F4F4F" }}>
                            Tous les Thèmes  <span style={{ color: "#A7A7A7", marginLeft: "5px" }}>9</span>
                        </h1>
                    </div>
                    <div className="themes-btns">
                        <div className="filter-btn-div" style={{ position: "relative" }}>
                            <button className="filtre-btn" onClick={() => setFilterSelected("clicked")}>
                                Filtre
                                <svg width="0.9rem" height="0.5rem" viewBox="0 0 15 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M7.742 6.05489L12.971 0.863892C13.1571 0.678984 13.4087 0.575195 13.671 0.575195C13.9333 0.575195 14.185 0.678984 14.371 0.863892C14.4627 0.954642 14.5354 1.06265 14.585 1.18169C14.6347 1.30072 14.6602 1.42842 14.6602 1.55739C14.6602 1.68636 14.6347 1.81406 14.585 1.93309C14.5354 2.05212 14.4627 2.16014 14.371 2.25089L8.44293 8.13589C8.25689 8.32079 8.00529 8.42458 7.74298 8.42458C7.48068 8.42458 7.22908 8.32079 7.04303 8.13589L1.11493 2.25089C1.02329 2.16014 0.950587 2.05212 0.90094 1.93309C0.851293 1.81406 0.825745 1.68636 0.825745 1.55739C0.825745 1.42842 0.851293 1.30072 0.90094 1.18169C0.950587 1.06265 1.02329 0.954642 1.11493 0.863892C1.3011 0.679226 1.55278 0.575607 1.815 0.575607C2.07723 0.575607 2.32878 0.679226 2.51495 0.863892L7.742 6.05489Z" fill="#fff" />
                                </svg>
                            </button>
                            {
                                filterSelected !== "none" &&
                                <ul className='filtre-ul' ref={filterRef}>
                                    <li onClick={() => toggleFilter("annee")}>
                                        Année
                                        <ArrowIcon />
                                        {
                                            filterSelected === "annee" &&
                                            <ul className='sub-filter-ul'>
                                                <li onClick={() => setSelectedAnnee("2ème")}>2 ème</li>
                                                <li onClick={() => setSelectedAnnee("3ème")}>3 ème</li>
                                                <li onClick={() => setSelectedAnnee("4ème")}>4 ème</li>
                                                <li onClick={() => setSelectedAnnee("5ème")}>5 ème</li>
                                            </ul>
                                        }
                                    </li>
                                    <li
                                        id={!["4ème", "5ème"].includes(selectedAnnee) ? 'disabled-filter' : ''}
                                        onClick={() => toggleFilter("specialite")}
                                    >
                                        Spécialité
                                        <ArrowIcon />
                                        {
                                            filterSelected === "specialite" && ["4ème", "5ème"].includes(selectedAnnee) &&
                                            <ul className='sub-filter-ul'>
                                                <li onClick={() => setSelectedSpecialite("SIW")}>SIW</li>
                                                <li onClick={() => setSelectedSpecialite("ISI")}>ISI</li>
                                                <li onClick={() => setSelectedSpecialite("IASD")}>IASD</li>
                                            </ul>
                                        }
                                    </li>
                                    <li onClick={() => toggleFilter("etat")}>
                                        État
                                        <ArrowIcon />
                                        {
                                            filterSelected === "etat" &&
                                            <ul className='sub-filter-ul'>
                                                <li>Accepté</li>
                                                <li>Refusé</li>
                                                <li>Réservé</li>
                                            </ul>
                                        }
                                    </li>
                                </ul>
                            }
                        </div>
                        <div className="input-theme-line">
                            <SearchIcon />
                            <input type="text" placeholder='Rechercher un thème par nom ou encadrant..' />
                        </div>
                    </div>
                </div>

                <div className="themes-cards-container">
                    {
                        filteredThemes.map((theme) => (
                            <ThemeCard title={theme.title} teacher={theme.teacher} annee={theme.annee} specialite={theme.specialite} />
                        ))
                    }
                </div>

                {filterSelected !== "none" && (
                    <div className="sticky-clear-btn">
                        <button
                            className="clear-btn"
                            onClick={() => {
                                setSelectedAnnee(null);
                                setSelectedSpecialite(null);
                                setFilterSelected('none');
                            }}
                        >
                            Annuler les filtres
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Themes

const ThemeCard = ({ title, teacher, annee, specialite }) => {

    const [accepted, setAccepted] = useState("wait")

    return (
        <div className="theme-card">
            <img src={pdfImage} alt="theme pdf" />
            <h2 style={{ fontFamily: 'Nunito, sans-serif', fontWeight: "800", fontSize: "1.3rem", marginTop: "0.5rem", width: "90%", textAlign: "center" }}>
                {title}
                <span style={{ fontSize: "1rem", fontWeight: "600", color: "#C79F3A" }}>
                    {specialite ? ` (${annee} ${specialite})` : ` (${annee})`}
                </span>
            </h2>
            <span style={{ fontFamily: 'Nunito, sans-serif', color: "#A7A7A7", fontWeight: "600", marginBottom: "1rem" }}>
                {teacher}
            </span>
            <div className="btns-card-line">
                {
                    accepted === "wait" ?
                        <>
                            <button className='supprimer-btn' onClick={() => setAccepted("refused")}>
                                <CloseIcon style={{ marginRight: "5px" }} />
                                <span style={{ fontFamily: 'Nunito, sans-serif', fontSize: "1.1rem", fontWeight: "650" }}>
                                    Refuser
                                </span>
                            </button>
                            <div style={{ height: "100%", width: "2px", backgroundColor: "#E4E4E4" }} />
                            <button className='accept-btn' onClick={() => setAccepted("accepted")}>
                                <CheckIcon style={{ marginRight: "5px" }} />
                                <span style={{ fontFamily: 'Nunito, sans-serif', fontSize: "1.1rem", fontWeight: "650" }}>
                                    Accepter
                                </span>
                            </button>
                        </>
                        : accepted === "accepted" ?
                            <div className='accpeted-div'>
                                <svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M1.6665 10.5744L6.0415 14.741L8.229 12.241M6.6665 10.5744L11.0415 14.741L18.3332 6.40771M13.3332 6.40771L10.4165 9.74105" stroke="#5F5F5F" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                </svg>

                                Accepté
                            </div>
                            :
                            <div className='refused-div'>
                                <CloseIcon style={{ marginRight: "5px" }} />
                                Refusé
                            </div>
                }
            </div>
        </div>
    )
}
