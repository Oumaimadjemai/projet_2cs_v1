import React, { useRef, useState, useEffect, useContext, createContext } from 'react'
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
import { useNavigate } from 'react-router-dom';
import { ReactComponent as ListeIcon } from '../../../Assets/Icons/mode-list.svg'
import { ReactComponent as GridIcon } from '../../../Assets/Icons/mode-grid.svg'
import { ReactComponent as EmptyIcon } from '../../../Assets/Icons/notFound.svg';
import doneImg from '../../../Assets/Images/Done.png'
export const EnseignantThemesContext = createContext();

function ThemesEnseignant() {

    const { isRtl } = useContext(AppContext)

    const { t } = useTranslation();

    const [themes, setThemes] = useState([]);
    const [annees, setAnnees] = useState([])
    const [specialites, setSpecialites] = useState([])

    useEffect(() => {

        axios.get(`${process.env.REACT_APP_API_URL_SERVICE1}/annees/`)
            .then((res) => setAnnees(res.data))
            .catch((err) => console.error("Erreur Axios :", err))

        axios.get(`${process.env.REACT_APP_API_URL_SERVICE1}/specialites/`)
            .then((res) => setSpecialites(res.data))
            .catch((err) => console.error("Erreur Axios :", err))

    }, [])

    useEffect(() => {
        axios
            .get(`${process.env.REACT_APP_API_URL_SERVICE2}/themes/enseignant/${localStorage.getItem('user_id')}/`)
            .then(async (res) => {
                const themesData = res.data;

                const themesWithDetails = await Promise.all(
                    themesData.map(async (theme) => {
                        let annee_titre = null;
                        let specialite_title = null;

                        try {
                            const anneeResponse = await axios.get(`${process.env.REACT_APP_API_URL_SERVICE1}/annees/${theme.annee_id}/`);
                            const anneeData = anneeResponse.data;
                            annee_titre = `${anneeData.title} ${anneeData.departement_title.toLowerCase() === "préparatoire" ? "CPI" : "CS"}`;
                        } catch (error) {
                            console.error(`Erreur récupération année pour le thème ${theme.id}`, error);
                        }

                        try {
                            const priorityOne = theme.priorities?.find(p => p.priorite === 1);
                            if (priorityOne) {
                                const specialiteRes = await axios.get(`${process.env.REACT_APP_API_URL_SERVICE1}/specialites/${priorityOne.specialite_id}/`);
                                specialite_title = specialiteRes.data.title;
                            }
                        } catch (error) {
                            console.error(`Erreur récupération spécialité pour le thème ${theme.id}`, error);
                        }

                        return {
                            ...theme,
                            annee_titre,
                            specialite_title,
                        };
                    })
                );

                setThemes(themesWithDetails);
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

    const [ajouterThemeClicked, setAjouterThemeClicked] = useState(false);

    const cancelAjouter = () => setAjouterThemeClicked(false)

    const [modeAffichage, setModeAffichage] = useState(false)
    const [affichage, setAffichage] = useState('list')
    const affichageRef = useRef('')

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

    useEffect(() => {

        const handleShowAffichage = (e) => {
            if (affichageRef.current && !affichageRef.current.contains(e.target)) {
                setModeAffichage(false)
            }
        }

        document.addEventListener('mousedown', handleShowAffichage)
        return () => {
            document.removeEventListener('mousedown', handleShowAffichage)
        }

    }, [])

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

    const getStatutColor = (status) => {
        switch (status) {
            case "Validé":
                return "#6FCF97"
            case "En Attente":
                return "#00000080"
            case "Refusé":
                return "#D42803"
            case "Reservé":
                return "#925FE2"
            default:
                return "black";
        }
    }

    const getAnneeColor = (annee) => {
        switch (annee) {
            case "2 CPI":
                return { color: "#E63946", backgroundColor: "#E6394630" }
            case "1 CS":
                return { color: "#17BEBB", backgroundColor: "#17BEBB30" }
            case "2 CS":
                return { color: "#884DFF", backgroundColor: "#884DFF30" }
            case "3 CS":
                return { color: "#B8860B", backgroundColor: "#FFD70030" }
            default:
                return "black";
        }
    }

    const getSpecialiteColor = (spec) => {
        switch (spec) {
            case "siw":
                return { color: "#D43F8D", backgroundColor: "#D43F8D30" }
            case "isi":
                return { color: "#00E096", backgroundColor: "#00E09630" }
            case "iasd":
                return { color: "#0095FF", backgroundColor: "#0095FF30" }
            default:
                return { color: "#000000", backgroundColor: "#00000030" };
        }
    }

    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [ajouterSuccess, setAjouterSuccess] = useState(false);

    return (
        <EnseignantThemesContext.Provider value={{ setThemes, setLoading }}>
            <div className='themes-container' id='dynamic-liste' ref={dynamicListRef}>
                <div className="themes-wrapper">
                    <div className="btns-title-container">
                        <div className="link">
                            <h1 style={{ fontSize: "1.6rem", fontWeight: "600", color: "#4F4F4F" }}>
                                Tous les Thèmes  <span style={{ color: "#A7A7A7", marginLeft: "5px" }}>{themes.length}</span>
                            </h1>
                        </div>
                        <div className="themes-btns">
                            <div className="mode-afficher-div" style={{ position: "relative" }}>
                                <button onClick={() => setModeAffichage(true)} style={{ width: "auto", background: "#7042C0" }}>
                                    {
                                        affichage === 'list' ? <ListeIcon /> : <GridIcon />
                                    }
                                    Mode d'Affichage
                                </button>
                                {
                                    modeAffichage && (
                                        <ul className='mode-afficher-ul' ref={affichageRef}>
                                            <li onClick={() => { setAffichage('list'); setModeAffichage(false) }}> <ListeIcon /> Liste </li>
                                            <li onClick={() => { setAffichage('grid'); setModeAffichage(false) }}> <GridIcon /> Cartes </li>
                                        </ul>
                                    )
                                }
                            </div>
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
                            <div className="input-line">
                                <SearchIcon />
                                <input type="text" placeholder={t('etudiantsPage.searchPlaceholder')} />
                            </div>
                        </div>
                    </div>

                    {
                        affichage === 'list' && (
                            <div className="themes-table">
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
                                                    width: "25%",
                                                    paddingLeft: isRtl ? undefined : "1rem",
                                                    paddingRight: isRtl ? "0.5rem" : undefined,
                                                    textAlign: isRtl ? "right" : "left"
                                                }}
                                            >
                                                Titre
                                            </th>
                                            <th>Année Universtaire</th>
                                            <th>Spécialité</th>
                                            <th style={{ width: "12.5%" }}>Nombre de Groupes</th>
                                            <th style={{ width: "17.5%" }}>Statut</th>
                                            <th
                                                style={{
                                                    width: "100%",
                                                    borderTopRightRadius: isRtl ? "0" : "8px",
                                                    borderTopLeftRadius: isRtl ? "8px" : "0",
                                                    borderBottomRightRadius: isRtl ? "0" : "8px",
                                                    borderBottomLeftRadius: isRtl ? "8px" : "0",
                                                    borderRight: isRtl ? "none" : "1px solid #E4E4E4",
                                                    borderLeft: isRtl ? "1px solid #E4E4E4" : "none",
                                                    textAlign: "center"
                                                }}
                                            >
                                                Options
                                            </th>
                                        </tr>
                                    </thead>
                                    {
                                        themes.length !== 0 && (
                                            <tbody>
                                                {
                                                    filteredThemes.map((theme) => (
                                                        <tr>
                                                            <td
                                                                style={{
                                                                    borderTopLeftRadius: isRtl ? "0" : "8px",
                                                                    borderTopRightRadius: isRtl ? "8px" : "0",
                                                                    borderBottomLeftRadius: isRtl ? "0" : "8px",
                                                                    borderBottomRightRadius: isRtl ? "8px" : "0",
                                                                    borderLeft: isRtl ? undefined : "1px solid #E4E4E4",
                                                                    borderRight: isRtl ? "1px solid #E4E4E4" : undefined,
                                                                    width: "25%",
                                                                    paddingLeft: "1rem",
                                                                    textAlign: isRtl ? "right" : "left",
                                                                    textIndent: "1rem",
                                                                    whiteSpace: "nowrap",
                                                                    overflow: "hidden",
                                                                    textOverflow: "ellipsis"
                                                                }}
                                                            >
                                                                {theme.titre}
                                                            </td>
                                                            <td className='annee-td'>
                                                                <span style={{
                                                                    color: getAnneeColor(theme.annee_titre).color,
                                                                    backgroundColor: getAnneeColor(theme.annee_titre).backgroundColor,
                                                                    border: `1px solid ${getAnneeColor(theme.annee_titre).color}`
                                                                }}>
                                                                    {theme.annee_titre}
                                                                </span>
                                                            </td>

                                                            <td className='annee-td'>
                                                                <span style={{
                                                                    color: getSpecialiteColor(theme.specialite_title?.toLowerCase()).color,
                                                                    backgroundColor: getSpecialiteColor(theme.specialite_title?.toLowerCase()).backgroundColor,
                                                                    border: `1px solid ${getSpecialiteColor(theme.specialite_title?.toLowerCase()).color}`
                                                                }}>
                                                                    {theme.specialite_title ? theme.specialite_title : "Aucun"}
                                                                </span>
                                                            </td>
                                                            <td style={{ width: "12.5%" }}>
                                                                {theme.numberOfGrp}
                                                            </td>
                                                            <td className='statut-td' style={{ width: "17.5%" }}>
                                                                <span
                                                                    style={{
                                                                        color: getStatutColor(getStatut(theme.valide, theme.reserve, theme.motif)),
                                                                        fontSize: "1.1rem",
                                                                        fontWeight: "650",
                                                                        fontFamily: "Nunito, sans-serif",
                                                                        textDecoration: 'underline'
                                                                    }}
                                                                >
                                                                    {getStatut(theme.valide, theme.reserve, theme.motif)}
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
                                                                <span className="number">{theme.sujetsEncadres}</span>
                                                                <div
                                                                    className="line-btns"
                                                                    style={{
                                                                        marginLeft: isRtl ? "1rem" : "auto",
                                                                        marginRight: isRtl ? "auto" : "1rem"
                                                                    }}
                                                                >
                                                                    <span style={{ display: "flex", flexDirection: "column", alignItems: "center" }} className='download-btn'>
                                                                        <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                            <path fill-rule="evenodd" clip-rule="evenodd" d="M12.1069 4.50353C14.076 4.55028 15.7042 5.92388 16.1525 7.75088C16.2422 8.11622 16.537 8.39455 16.9054 8.46414C18.6978 8.8028 20.0338 10.3997 19.989 12.283C19.9557 13.6861 19.1654 14.8946 18.0133 15.525C17.5536 15.7765 17.3849 16.3531 17.6364 16.8127C17.8879 17.2724 18.4645 17.4411 18.9242 17.1896C20.6461 16.2474 21.836 14.4357 21.8861 12.328C21.9484 9.70505 20.227 7.4558 17.8293 6.73865C17.0068 4.38406 14.7941 2.66924 12.152 2.60651C8.77349 2.5263 5.9652 5.17857 5.84263 8.5459C4.15033 9.23777 2.93956 10.8804 2.89335 12.8262C2.84606 14.8179 4.03321 16.5499 5.75281 17.294C6.23373 17.502 6.79226 17.2809 7.00035 16.8C7.20843 16.3191 6.98727 15.7605 6.50637 15.5525C5.47184 15.1048 4.76205 14.0638 4.79037 12.8712C4.82199 11.54 5.76358 10.4419 7.00763 10.1617C7.4719 10.0572 7.7933 9.62531 7.7519 9.14461C7.53745 6.65458 9.59463 4.44388 12.1069 4.50353ZM12.4235 11.1543C12.9474 11.1668 13.3619 11.6015 13.3495 12.1254L13.2012 18.3701L14.4571 17.1743C14.8366 16.813 15.4371 16.8277 15.7985 17.2072C16.1598 17.5867 16.1451 18.1872 15.7656 18.5486L13.0241 21.1588C12.7784 21.3928 12.5399 21.5966 12.1757 21.5879C11.8116 21.5793 11.5831 21.3644 11.3487 21.119L8.73419 18.3817C8.37228 18.0027 8.38606 17.4022 8.765 17.0402C9.14393 16.6783 9.74449 16.6921 10.1064 17.071L11.3042 18.3251L11.4525 12.0803C11.4649 11.5565 11.8996 11.1419 12.4235 11.1543Z" fill="black" />
                                                                        </svg>
                                                                        Télécharger
                                                                    </span>
                                                                    <span style={{
                                                                        display: "flex",
                                                                        gap: "6px",
                                                                        alignItems: "center",
                                                                        color: "#884DFF",
                                                                        marginRight: "1rem",
                                                                        fontFamily: "Kumbh Sans, sans-serif",
                                                                        fontWeight: "600",
                                                                        cursor: "pointer"
                                                                    }}
                                                                        onClick={() => navigate(`/enseignant/themes/${theme.id}`)}
                                                                    >
                                                                        Voir Plus
                                                                        <svg width="10" height="12" viewBox="0 0 10 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                            <path d="M1.5 1L8.5 8L1.5 15" stroke="#925FE2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
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
                            </div>
                        )
                    }

                    {
                        affichage === 'grid' && (
                            <div className="themes-cards-container">
                                {
                                    filteredThemes.map((theme) => (
                                        <ThemeCard id={theme.id} title={theme.titre} annee={theme.annee_titre} specialite={theme.specialite} statut={getStatut(theme.valide, theme.reserve, theme.motif)} />
                                    ))
                                }
                            </div>
                        )
                    }

                    {
                        themes.length === 0 && (
                            <div className="no-themes-available">
                                <EmptyIcon className='empty-icon' />
                                <div className="lines-box">
                                    <h1 style={{ fontSize: "1.45rem", fontWeight: "650" }}>
                                        🎓 Aucun thème créé pour le moment
                                    </h1>
                                    <span style={{ width: "600px", textAlign: "center", color: "#4F4F4F", fontWeight: "500" }}>
                                    Commencez à ajouter des thèmes en cliquant sur le bouton ci-dessous. Ajoutez leurs informations pour pouvoir les gérer plus facilement dans votre système.
                                    </span>
                                </div>
                            </div>
                        )
                    }

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
                        <AjouterTheme annulerAjouter={cancelAjouter} addWithSuccess={() => setAjouterSuccess(true)} />
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
                {
                    loading && (
                        <div className="loader-overlay">
                            <div className="loader-container">
                                <div className="loader-dots">
                                    <div className="loader-dot"></div>
                                    <div className="loader-dot"></div>
                                    <div className="loader-dot"></div>
                                </div>
                                <p className="loader-text">Enregistrement en cours...</p>
                            </div>
                        </div>
                    )
                }
                {
                    ajouterSuccess && <AjouterSuccess acceptSuccess={() => setAjouterSuccess(false)} />
                }
            </div>
        </EnseignantThemesContext.Provider>
    )
}

export default ThemesEnseignant

const ThemeCard = ({ id, title, annee, specialite, statut }) => {

    const [dropClicked, setDropClicked] = useState(false)
    const dropRef = useRef('')
    const navigate = useNavigate();

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
        <div className="theme-card" onClick={() => navigate(`/enseignant/themes/${id}`)}>
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

                    statut === "Validé" ?
                        <div className='accpeted-div'>
                            <svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M1.6665 10.5744L6.0415 14.741L8.229 12.241M6.6665 10.5744L11.0415 14.741L18.3332 6.40771M13.3332 6.40771L10.4165 9.74105" stroke="#5F5F5F" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>

                            Accepté
                        </div>
                        : statut === "Refusé" ?
                            <div className='refused-div'>
                                <CloseIcon style={{ marginRight: "5px" }} />
                                Refusé
                            </div>
                            : statut === "En Attente" ?
                                <div className='refused-div' style={{ backgroundColor: "#C4C4C4", color: "#5F5F5F" }}>
                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M2.5 10C2.5 10.9849 2.69399 11.9602 3.0709 12.8701C3.44781 13.7801 4.00026 14.6069 4.6967 15.3033C5.39314 15.9997 6.21993 16.5522 7.12987 16.9291C8.03982 17.306 9.01509 17.5 10 17.5C10.9849 17.5 11.9602 17.306 12.8701 16.9291C13.7801 16.5522 14.6069 15.9997 15.3033 15.3033C15.9997 14.6069 16.5522 13.7801 16.9291 12.8701C17.306 11.9602 17.5 10.9849 17.5 10C17.5 8.01088 16.7098 6.10322 15.3033 4.6967C13.8968 3.29018 11.9891 2.5 10 2.5C8.01088 2.5 6.10322 3.29018 4.6967 4.6967C3.29018 6.10322 2.5 8.01088 2.5 10Z" stroke="#5F5F5F" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                        <path d="M10 5.83398V10.0007L12.5 12.5007" stroke="#5F5F5F" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                    </svg>
                                    En attente
                                </div> : null
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

const AjouterSuccess = ({ acceptSuccess }) => {

    return (
        <div className="add-theme-success">
            <div className="img-container" style={{ height: "90px", width: "100px" }}>
                <img src={doneImg} alt="done" style={{ height: "100%", width: "100%", objectFit: "cover", transform: "scale(1.2)" }} />
            </div>
            <span style={{ width: "95%", fontFamily: "Kumbh Sans, sans-serif", textAlign: "center", fontSize: "1.1rem", fontWeight: "500" }}>
                ✨Le thème a été créé avec succès. Il sera désormais visible dans votre liste et prêt pour validation.✨
            </span>
            <button
                style={{
                    alignSelf: "flex-end",
                    marginTop: "auto",
                    padding: "5px 0",
                    background: "#A67EF2",
                    width: "80px",
                    borderRadius: "20px",
                    color: "#fff",
                    fontWeight: "500"
                }}
                onClick={(e) => { e.preventDefault(); acceptSuccess() }}
            >
                OK
            </button>
        </div>
    )
}
