import React, { useRef, useState, useEffect } from 'react'
import '../Styles/Themes.css'
import { ReactComponent as SearchIcon } from '../../../Assets/Icons/Search.svg';
import { ReactComponent as CloseIcon } from '../../../Assets/Icons/close-rounded.svg';
import { ReactComponent as CheckIcon } from '../../../Assets/Icons/check-rounded.svg';
import { ReactComponent as ArrowIcon } from '../../../Assets/Icons/Arrow.svg';
import pdfImage from '../../../Assets/Images/projet-pdf-example.png'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Themes() {


    const [themes, setThemes] = useState([]);
    const [annees, setAnnees] = useState([])
    const [specialites, setSpecialites] = useState([])

    useEffect(() => {

        axios.get('http://127.0.0.1:8000/annees/')
            .then((res) => setAnnees(res.data))
            .catch((err) => console.error("Erreur Axios :", err))

        axios.get('http://127.0.0.1:8000/specialites/')
            .then((res) => setSpecialites(res.data))
            .catch((err) => console.error("Erreur Axios :", err))

    }, [])

    useEffect(() => {
        axios.get(`http://127.0.0.1:8001/themes/`)
            .then(async (res) => {
                const themesData = res.data;

                const themesWithAdditionalInfo = await Promise.all(
                    themesData.map(async (theme) => {
                        try {

                            const anneeResponse = await axios.get(`http://127.0.0.1:8000/annees/${theme.annee_id}/`);

                            let enseignantInfo = null;
                            if (theme.enseignant_id) {

                                const enseignantResponse = await axios.get(`http://127.0.0.1:8000/enseignants/${theme.enseignant_id}`);
                                enseignantInfo = `${enseignantResponse.data.prenom} ${enseignantResponse.data.nom}`;

                            } else if (theme.entreprise_id) {

                                const representantResponse = await axios.get(`http://127.0.0.1:8000/entreprises/${theme.entreprise_id}`);
                                enseignantInfo = representantResponse.data.nom;
                            }

                            return {
                                ...theme,
                                annee_titre: `${anneeResponse.data.title} ${anneeResponse.data.departement_title.toLowerCase() === "préparatoire" ? "CPI" : "CS"}`,
                                enseignant_nom: enseignantInfo,
                            };
                        } catch (error) {
                            console.error(`Erreur récupération des informations pour le thème ${theme.id}`, error);
                            return {
                                ...theme,
                                annee_titre: null,
                                enseignant_nom: null,
                            };
                        }
                    })
                );

                setThemes(themesWithAdditionalInfo);
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

    const [selectedAnnee, setSelectedAnnee] = useState({
        id: null,
        title: "",
        has_specialite: false
    });
    const [selectedSpecialite, setSelectedSpecialite] = useState(null);
    const [selectedEtat, setSelectedEtat] = useState(null)
    const [filteredThemes, setFilteredThemes] = useState([]);

    useEffect(() => {
        const result = themes.filter(theme => {
            // Si aucun filtre n'est sélectionné, retourner tous les thèmes
            if (filterSelected === "none") return true;

            // Filtre par année
            const isAnneeMatch = !selectedAnnee.id || theme.annee_id === selectedAnnee.id;

            // Filtre par spécialité
            const isSpecialiteMatch = !selectedSpecialite || (
                theme.priorities && theme.priorities.some(priority =>
                    priority.specialite_id === selectedSpecialite && priority.priorite === 1
                )
            );

            let isEtatMatch = true;
            if (selectedEtat === "accepted") {
                isEtatMatch = theme.valide === true;
            } else if (selectedEtat === "refused") {
                isEtatMatch = theme.motif !== null && theme.motif !== "";
            } else if (selectedEtat === "reserved") {
                isEtatMatch = theme.reserve === true;
            }

            return isAnneeMatch && isSpecialiteMatch && isEtatMatch;
        });

        setFilteredThemes(result);
    }, [themes, selectedAnnee, selectedSpecialite, selectedEtat, filterSelected]);

    useEffect(() => {
        if (filterSelected === 'none') {
            setFilteredThemes([...themes]);
        }
    }, [filterSelected, themes]);

    return (
        <div className='themes-container' id='dynamic-liste'>
            <div className="themes-wrapper">
                <div className="btns-title-container">
                    <div className="link">
                        <h1 style={{ fontSize: "1.6rem", fontWeight: "600", color: "#4F4F4F" }}>
                            Tous les Thèmes  <span style={{ color: "#A7A7A7", marginLeft: "5px" }}> {themes.length} </span>
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
                                                {annees.map((annee) => (
                                                    <li style={{ minWidth: "250px !important" }} onClick={() => setSelectedAnnee({ ...selectedAnnee, id: annee.id, title: annee.title, has_specialite: annee.has_specialite })}>
                                                        {annee.title} {annee.departement_title.toLowerCase() === "préparatoire" ? "CPI" : "CS"}
                                                    </li>
                                                ))}
                                            </ul>
                                        }
                                    </li>
                                    <li
                                        id={!selectedAnnee.has_specialite ? 'disabled-filter' : ''}
                                        onClick={() => toggleFilter("specialite")}
                                    >
                                        Spécialité
                                        <ArrowIcon />
                                        {
                                            filterSelected === "specialite" && (selectedAnnee.has_specialite) &&
                                            <ul className='sub-filter-ul'>
                                                {specialites.map((specialite) => (
                                                    <li onClick={() => setSelectedSpecialite(specialite.id)}>{specialite.title}</li>
                                                ))}
                                            </ul>
                                        }
                                    </li>
                                    <li onClick={() => toggleFilter("etat")}>
                                        État
                                        <ArrowIcon />
                                        {
                                            filterSelected === "etat" &&
                                            <ul className='sub-filter-ul'>
                                                <li onClick={() => setSelectedEtat('accepted')}>Accepté</li>
                                                <li onClick={() => setSelectedEtat('refused')}>Refusé</li>
                                                <li onClick={() => setSelectedEtat('reserved')}>Réservé</li>
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
                            <ThemeCard
                                id={theme.id}
                                title={theme.titre}
                                teacher={theme.enseignant_nom}
                                annee={theme.annee_titre}
                                valid={theme.valide}
                                motif={theme.motif}
                            />
                        ))
                    }
                </div>

                {filterSelected !== "none" && (
                    <div className="sticky-clear-btn">
                        <button
                            className="clear-btn"
                            onClick={() => {
                                setSelectedAnnee({
                                    id: null,
                                    title: "",
                                    has_specialite: false
                                });
                                setSelectedSpecialite(null);
                                setSelectedEtat(null);
                                setFilterSelected('none');
                            }}
                        >
                            Annuler les filtres
                        </button>
                    </div>
                )}
            </div>
            
        </div >
    )
}

export default Themes

const ThemeCard = ({ title, teacher, annee, valid, motif, id }) => {

    const navigate = useNavigate();

    return (
        <div className="theme-card" onClick={() => navigate(`/admin/themes/${id}`)}>
            <img src={pdfImage} alt="theme pdf" />
            <h2 style={{ fontFamily: 'Nunito, sans-serif', fontWeight: "800", fontSize: "1.1rem", marginTop: "0.5rem", width: "90%", textAlign: "center" }}>
                {title}
                <span style={{ fontSize: "1rem", fontWeight: "600", color: "#C79F3A" }}>
                    ({annee})
                </span>
                {/* <span style={{ fontSize: "1rem", fontWeight: "600", color: "#C79F3A" }}>
                    {specialite ? ` (${annee} ${specialite})` : ` (${annee})`}
                </span> */}
            </h2>
            <span style={{ fontFamily: 'Nunito, sans-serif', color: "#A7A7A7", fontWeight: "600", marginBottom: "1rem", fontSize: "0.9rem" }}>
                {teacher}
            </span>
            <div className="btns-card-line">
                {
                    !(valid) && !(motif) ?
                        <>
                            <button className='supprimer-btn'>
                                <CloseIcon style={{ marginRight: "5px" }} />
                                <span style={{ fontFamily: 'Nunito, sans-serif', fontSize: "1.1rem", fontWeight: "650" }}>
                                    Refuser
                                </span>
                            </button>
                            <div style={{ height: "100%", width: "2px", backgroundColor: "#E4E4E4" }} />
                            <button className='accept-btn'>
                                <CheckIcon style={{ marginRight: "5px" }} />
                                <span style={{ fontFamily: 'Nunito, sans-serif', fontSize: "1.1rem", fontWeight: "650" }}>
                                    Accepter
                                </span>
                            </button>
                        </>
                        : valid ?
                            <div className='accpeted-div'>
                                <svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M1.6665 10.5744L6.0415 14.741L8.229 12.241M6.6665 10.5744L11.0415 14.741L18.3332 6.40771M13.3332 6.40771L10.4165 9.74105" stroke="#5F5F5F" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                </svg>

                                Accepté
                            </div>
                            : motif ?
                                <div className='refused-div'>
                                    <CloseIcon style={{ marginRight: "5px" }} />
                                    Refusé
                                </div>
                                : null
                }
            </div>
        </div>
    )
}
