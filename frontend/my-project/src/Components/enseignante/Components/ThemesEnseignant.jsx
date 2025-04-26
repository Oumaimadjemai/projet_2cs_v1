import React, { useRef, useState, useEffect, useContext } from 'react'
import '../Styles/Themes.css'
import { ReactComponent as SearchIcon } from '../../../Assets/Icons/Search.svg';
import { ReactComponent as CloseIcon } from '../../../Assets/Icons/close-rounded.svg';
import { ReactComponent as MenuIcon } from '../../../Assets/Icons/menu.svg';
import { ReactComponent as ArrowIcon } from '../../../Assets/Icons/Arrow.svg';
import pdfImage from '../../../Assets/Images/projet-pdf-example.png'
import { AjouterTheme } from './AjouterTheme';
import { AppContext } from '../../../App';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

function ThemesEnseignant() {

    const { isRtl } = useContext(AppContext)

    const { t } = useTranslation();

    const [themes, setThemes] = useState([]);

    useEffect(() => {
        axios.get(`http://127.0.0.1:8001/themes/enseignant/${localStorage.getItem('user_id')}/`)
            .then(async (res) => {
                const themesData = res.data;

                // Pour chaque thème, récupérer l'année et ajouter un champ annee_titre
                const themesWithAnneeTitre = await Promise.all(
                    themesData.map(async (theme) => {
                        try {
                            const anneeResponse = await axios.get(`http://127.0.0.1:8000/annees/${theme.annee_id}/`);

                            return {
                                ...theme,
                                annee_titre: anneeResponse.data.title,
                            };
                        } catch (error) {
                            console.error(`Erreur récupération année pour le thème ${theme.id}`, error);
                            return {
                                ...theme,
                                annee_titre: null, 
                            };
                        }
                    })
                );

                setThemes(themesWithAnneeTitre);
            })
            .catch((err) => console.error(err));
    }, []);



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


    const [ajouterThemeClicked, setAjouterThemeClicked] = useState(false);

    const cancelAjouter = () => setAjouterThemeClicked(false)


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
                        <button onClick={() => setAjouterThemeClicked(true)}>
                            Ajouter Thème
                        </button>
                    </div>
                </div>
                <div className="recherche-themes-line">
                    <div className="recherche-themes-input">
                        <div className="filter-btn-div" style={{ position: "relative" }}>
                            <button
                                className="filtre-btn"
                                style={{
                                    borderRight: isRtl ? "none" : "2px solid #D9E1E7",
                                    borderLeft: isRtl ? "2px solid #D9E1E7" : "none",
                                    position: "relative"
                                }}
                                onClick={() => setFilterSelected("clicked")}
                            >
                                {t('enseignantsPage.filterBtn')}
                                <svg width="0.9rem" height="0.5rem" viewBox="0 0 15 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M7.742 6.05489L12.971 0.863892C13.1571 0.678984 13.4087 0.575195 13.671 0.575195C13.9333 0.575195 14.185 0.678984 14.371 0.863892C14.4627 0.954642 14.5354 1.06265 14.585 1.18169C14.6347 1.30072 14.6602 1.42842 14.6602 1.55739C14.6602 1.68636 14.6347 1.81406 14.585 1.93309C14.5354 2.05212 14.4627 2.16014 14.371 2.25089L8.44293 8.13589C8.25689 8.32079 8.00529 8.42458 7.74298 8.42458C7.48068 8.42458 7.22908 8.32079 7.04303 8.13589L1.11493 2.25089C1.02329 2.16014 0.950587 2.05212 0.90094 1.93309C0.851293 1.81406 0.825745 1.68636 0.825745 1.55739C0.825745 1.42842 0.851293 1.30072 0.90094 1.18169C0.950587 1.06265 1.02329 0.954642 1.11493 0.863892C1.3011 0.679226 1.55278 0.575607 1.815 0.575607C2.07723 0.575607 2.32878 0.679226 2.51495 0.863892L7.742 6.05489Z" fill="#925FE2" />
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
                        <div className="input-line">
                            <SearchIcon />
                            <input type="text" placeholder={t('etudiantsPage.searchPlaceholder')} />
                        </div>
                    </div>
                </div>

                <div className="themes-cards-container">
                    {
                        filteredThemes.map((theme) => (
                            <ThemeCard title={theme.titre} annee={theme.annee_titre} specialite={theme.specialite} valide={theme.valide} refus={theme.reserve} />
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

                {
                    ajouterThemeClicked &&
                    <AjouterTheme annulerAjouter={cancelAjouter} />
                }
            </div>
        </div>
    )
}

export default ThemesEnseignant

const ThemeCard = ({ title, annee, specialite, valide, refus}) => {

    const [dropClicked, setDropClicked] = useState(false)
    const dropRef = useRef('')

    useEffect(() => {

        const handleSwitchDrop = (e) => {
            if (dropRef.current && !dropRef.current.contains(e.target)) {
                setDropClicked(false)
            }
        }

        document.addEventListener('mousedown', handleSwitchDrop)
        return () => {
            document.removeEventListener('mousedown', handleSwitchDrop)
        }

    }, [])

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
            </span>
            <div className="btns-card-line">
                <span style={{ fontSize: "0.8rem", fontFamily: 'Nunito, sans-serif', fontWeight: "bolder" }}>
                    Mercredi 13 Mars
                </span>
                {

                    valide ?
                        <div className='accpeted-div'>
                            <svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M1.6665 10.5744L6.0415 14.741L8.229 12.241M6.6665 10.5744L11.0415 14.741L18.3332 6.40771M13.3332 6.40771L10.4165 9.74105" stroke="#5F5F5F" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>

                            Accepté
                        </div>
                        : refus ?
                            <div className='refused-div'>
                                <CloseIcon style={{ marginRight: "5px" }} />
                                Refusé
                            </div>
                            :
                            <div className='refused-div' style={{ backgroundColor: "#C4C4C4", color: "#5F5F5F" }}>
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M2.5 10C2.5 10.9849 2.69399 11.9602 3.0709 12.8701C3.44781 13.7801 4.00026 14.6069 4.6967 15.3033C5.39314 15.9997 6.21993 16.5522 7.12987 16.9291C8.03982 17.306 9.01509 17.5 10 17.5C10.9849 17.5 11.9602 17.306 12.8701 16.9291C13.7801 16.5522 14.6069 15.9997 15.3033 15.3033C15.9997 14.6069 16.5522 13.7801 16.9291 12.8701C17.306 11.9602 17.5 10.9849 17.5 10C17.5 8.01088 16.7098 6.10322 15.3033 4.6967C13.8968 3.29018 11.9891 2.5 10 2.5C8.01088 2.5 6.10322 3.29018 4.6967 4.6967C3.29018 6.10322 2.5 8.01088 2.5 10Z" stroke="#5F5F5F" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                    <path d="M10 5.83398V10.0007L12.5 12.5007" stroke="#5F5F5F" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                </svg>
                                En attente
                            </div>
                }
            </div>
            <MenuIcon className="menu-icon" onClick={() => setDropClicked(!dropClicked)} />
            {
                dropClicked &&
                <ul className="drop-menu" ref={dropRef}>
                    <li style={{ borderBottom: "1.5px solid #D6D6D6" }}>Voir plus</li>
                    <li style={{ color: "#D9534F" }}>Supprimer</li>
                </ul>
            }
        </div>
    )
}
