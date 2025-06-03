import React, { useEffect, useState, useContext, useRef, createContext } from 'react'
import '../Styles/Theme.css'
import enteteImg from "../../../Assets/Images/entete.png"
import { Link, useParams } from 'react-router-dom'
import axios from 'axios';
import { AppContext } from '../../../App';
import '../../Partials/Components/i18n'
import sleepImage from '../../../Assets/Images/sleeping.png'
import doneImg from '../../../Assets/Images/Done.png'
import { ReactComponent as EmptyIcon } from '../../../Assets/Icons/EmptyState.svg';
import { 
  ChevronDownIcon, 
  XMarkIcon, 
  SparklesIcon, 
  HandRaisedIcon, 
  CheckCircleIcon, 
  PlusCircleIcon 
} from '@heroicons/react/24/outline';

export const ThemeAdminContext = createContext();


function ThemeAdmin() {

    const { id } = useParams();
    const [theme, setTheme] = useState({})
    const [autoAssignmentMessage, setAutoAssignmentMessage] = useState(null);
  
    const [groupes, setGroupes] = useState([])
const [modeAffichage, setModeAffichage] = useState(null); // 'manual' ou 'auto' ou null
 const handleAutoAssignment = async () => {
  setModeAffichage('auto');
  try {
    const response = await axios.post(
      `http://localhost:8003/assignment-random/${theme.id}/`,
      {}, 
      {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    setNotification({
      visible: true,
      message: response.data?.message || 'Affectation automatique effectuée',
      type: 'success'
    });
  } catch (error) {
    setNotification({
      visible: true,
      message: error.response?.data?.error || 
             error.response?.data?.message || 
             'Erreur réseau ou serveur indisponible',
      type: 'error'
    });
  }
};
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

    useEffect(() => {

        axios.get(`${process.env.REACT_APP_API_URL_SERVICE4}/assignments/`, {
            headers: {
                authorization: `Bearer ${localStorage.getItem('access_token')}`
            }
        })
            .then((res) => {
                const groupesAffectes = res.data;
                const idsAffectes = new Set(groupesAffectes.map(g => g.group_id));

                axios.get(`${process.env.REACT_APP_API_URL_SERVICE3}/api/groups/by-study-year?annee_etude=${theme.annee_id}`, {
                    headers: {
                        authorization: `Bearer ${localStorage.getItem('access_token')}`
                    }
                })
                    .then((response) => {
                        const anneeData = response.data.data.find(item => item.annee_etude === theme.annee_id);

                        if (anneeData) {
                            const groupesAvecAffectation = anneeData.groupes.map(groupe => {
                                const isAffecte = idsAffectes.has(groupe.id);
                                const themeAssocie = isAffecte
                                    ? groupesAffectes.find(g => g.group_id === groupe.id)?.theme_id
                                    : null;

                                return {
                                    ...groupe,
                                    affecte: isAffecte,
                                    theme_id: themeAssocie 
                                };
                            });

                            setGroupes(groupesAvecAffectation)
                            console.log(groupesAvecAffectation);
                        } else {
                            setGroupes([]);
                        }
                    })
                    .catch((err) => {
                        console.error(err.response?.data || err.message);
                        setGroupes([]);
                    });
            })
            .catch(err => {
                console.error("Erreur lors du chargement des groupes affectés :", err);
            });

    }, [theme.annee_id])

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

    const { isRtl } = useContext(AppContext);
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

    const motifRef = useRef('')

    const handleMotifText = () => {

        if (motifRef.current) {
            motifRef.current.style.height = 'auto';
            motifRef.current.style.height = `${motifRef.current.scrollHeight}px`;
        }
    };

    const [motif, setMotif] = useState('')

    const [acceptClicked, setAcceptClicked] = useState(false)

    const cancelAccepter = () => {
        setAcceptClicked(false)
    }

    const [acceptSuccess, setAcceptSuccess] = useState(false)

    const successAccept = () => {
        setAcceptSuccess(true)
        setAcceptClicked(false)
    }

    const [optionsClicked, setOptionsClicked] = useState(false)
        const [optionsClickedv2, setOptionsClickedv2] = useState(false)


    const [refuseClicked, setRefuseClicked] = useState(false)
    const [confirmRefuseClicked, setConfirmRefuseClicked] = useState(false)

    const cancelRefuser = () => {
        setConfirmRefuseClicked(false)
    }

    const [refuserSuccess, setRefuseSuccess] = useState(false)

    const refuseAccept = () => {
        setRefuseSuccess(true)
        setConfirmRefuseClicked(false)
    }

    const [reserveClicked, setReserveClicked] = useState(false)

    const cancelReserve = () => {
        setReserveClicked(false)
    }

    const [reserveSuccess, setReserveSuccess] = useState(false)

    const reserveAccept = () => {
        setReserveSuccess(true)
        setReserveClicked(false)
    }

    const [error, setError] = useState(false)

    const [submitted, setSubmitted] = useState(false);

    const envoyerMotif = (e) => {
        e.preventDefault();
        setSubmitted(true);
    };

    useEffect(() => {
        if (submitted) {
            if (!motif.trim()) {
                setError(true);
            } else {
                setError(false);
                setConfirmRefuseClicked(true);
                console.log('Formulaire valide. Motif:', motif);
            }
            setSubmitted(false);
        }
    }, [submitted, motif]);

    const [loading, setLoading] = useState(false)
    const [notification, setNotification] = useState({
  visible: false,
  message: '',
  type: 'info' // 'info' | 'success' | 'error'
});

    const [confirmAffecter, setConfirmAffecter] = useState(false)
    const [affecterInfos, setAffecterInfos] = useState({
        theme_id: 0,
        groupe: 0
    })

    const affectationManuel = (e, themeId, groupe) => {

        e.preventDefault();
        setLoading(true)

        axios.post(`${process.env.REACT_APP_API_URL_SERVICE4}/assign-manual/`, {
            theme_id: themeId,
            group_id: groupe
        }, {
            headers: {
                authorization: `Bearer ${localStorage.getItem('access_token')}`,
                "Content-Type": "application/json",
            }
        })
            .then(() => {
                setConfirmAffecter(false)
                setGroupes(prevGroupes =>
                    prevGroupes.map(grp =>
                        grp.id === groupe ? { ...grp, affecte: true } : grp
                    )
                )
            })
            .catch((err) => alert(err.response.data))
            .finally(() => setLoading(false))

    }

    return (
        <ThemeAdminContext.Provider value={{ setLoading, motif, setTheme, theme }} >
            <div className='theme-display-container' id='dynamic-list'>
                <div className="theme-display-wrapper">
                    <div className="title-display-theme" style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "0.5rem" }}>
                        <h1 style={{ fontSize: "1.2rem", fontWeight: "500", color: "#4F4F4F", userSelect: "none" }}>
                            <Link className='return-to-themes' to={'/admin/themes'}>Tous Les Thèmes</Link> &gt; <span style={{ color: "#925FE2" }}> {theme.titre} </span>
                        </h1>
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
                                                <div style={{ width: "100%", padding: "12px 0", paddingLeft: "10px", borderLeft: "1px solid #000" }}>
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
                    acceptClicked && <AccepterAlert annulerAccept={cancelAccepter} id={id} acceptSuccess={successAccept} />
                }
                {
                    acceptSuccess && <AccepterSuccess acceptSuccess={() => setAcceptSuccess(false)} />
                }
                {
                    refuserSuccess && <RefuserSuccess acceptSuccess={() => setRefuseSuccess(false)} />
                }
                {
                    confirmRefuseClicked && <RefuserAlert annulerRefuser={cancelRefuser} id={id} refuserSuccess={refuseAccept} />
                }
                {
                    reserveClicked && <ReserveAlert annulerRefuser={cancelReserve} id={id} refuserSuccess={reserveAccept} />
                }
                {
                    reserveSuccess && <ReserveSuccess acceptSuccess={() => setRefuseSuccess(false)} />
                }
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
                                                Ce thème est en attente de votre approbation.
                                            </p>
                                        </div>
                                        <div className="theme-attent-btns" style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                            <button
                                                style={{ background: "#925FE2", color: "#fff" }}
                                                onClick={() => setAcceptClicked(true)}
                                            >Accepter
                                            </button>
                                            <button
                                                style={{ background: "#D9534F", color: "#fff" }}
                                                onClick={() => setRefuseClicked(true)}
                                            >
                                                Refuser
                                            </button>
                                            <button
                                                style={{ background: "#D9EAFD", color: "#5F5F5F" }}
                                                onClick={() => setReserveClicked(true)}
                                            >
                                                Reserver
                                            </button>
                                        </div>
                                        {
                                            refuseClicked &&
                                            <form action="">
                                                <div className="field-flex">
                                                    <label style={{ fontFamily: "Kumbh Sans, sans-serif", fontWeight: "500", fontSize: "1.05rem", color: "#00000080" }}>
                                                        Motif
                                                    </label>
                                                    <textarea
                                                        placeholder='Entrez votre motif'
                                                        ref={motifRef}
                                                        value={motif}
                                                        onChange={(e) => { handleMotifText(); setMotif(e.target.value) }}
                                                    />
                                                    {
                                                        error && <p style={{ fontSize: "0.8rem", marginLeft: "10px", color: "red" }}> Veuillez rédiger un motif de refus clair</p>
                                                    }
                                                </div>
                                                <div className="btns-form-flex" style={{ display: "flex", alignSelf: "flex-end", marginTop: "1rem", gap: "6px" }}>
                                                    <button
                                                        style={{ background: "#E2E4E5", color: "#00000080" }}
                                                        onClick={() => { setMotif(''); setRefuseClicked(false) }}
                                                    >
                                                        Annuler
                                                    </button>
                                                    <button style={{ background: "#925FE2", color: "#fff" }} onClick={(e) => envoyerMotif(e)}>Envoyer</button>
                                                </div>
                                            </form>
                                        }
                                    </div>
                                    : statut === "Refusé" ?
                                        <div className="flex-column" style={{ display: 'flex', flexDirection: "column", gap: "1rem" }}>
                                            <div className="pas-encore-accepter" style={{ paddingTop: "1rem", gap: "1rem" }}>
                                                <svg width="50" height="50" viewBox="0 0 70 70" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M35 4.375C18.0879 4.375 4.375 18.0879 4.375 35C4.375 51.9121 18.0879 65.625 35 65.625C51.9121 65.625 65.625 51.9121 65.625 35C65.625 18.0879 51.9121 4.375 35 4.375ZM54.7217 51.0508L18.9834 15.3125C17.6367 16.4062 16.4062 17.6367 15.3125 18.9834L51.0508 54.7217C46.6758 58.29 41.084 60.4297 35 60.4297C20.959 60.4297 9.57031 49.041 9.57031 35C9.57031 20.959 20.959 9.57031 35 9.57031C49.041 9.57031 60.4297 20.959 60.4297 35C60.4297 41.084 58.29 46.6758 54.7217 51.0508Z" fill="#A52A2A" />
                                                    <path d="M35 9.57031C20.959 9.57031 9.57031 20.959 9.57031 35C9.57031 49.041 20.959 60.4297 35 60.4297C41.084 60.4297 46.6758 58.29 51.0508 54.7217L15.3125 18.9834C16.4062 17.6367 17.6367 16.4062 18.9834 15.3125L54.7217 51.0508C58.29 46.6758 60.4297 41.084 60.4297 35C60.4297 20.959 49.041 9.57031 35 9.57031Z" fill="black" fill-opacity="0.15" />
                                                </svg>

                                                <p style={{ textAlign: "center" }}>
                                                    Vous avez refusé ce thème. Il ne sera pas disponible pour les étudiants.
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
                             <div className="space-y-4">
  {/* Main Button */}
  <button 
    onClick={() => setOptionsClickedv2(!optionsClickedv2)}
    className="px-4 py-2 bg-purple-700 text-white rounded-lg hover:bg-purple-800 transition-colors shadow-md hover:shadow-lg"
  >
    Mode d'affectation thème
    <ChevronDownIcon className={`w-4 h-4 ml-2 inline transition-transform ${optionsClickedv2 ? 'rotate-180' : ''}`} />
  </button>
  
  {/* Options Panel */}
  {optionsClickedv2 && (
    <div className="p-4 bg-purple-50 rounded-lg border border-purple-100">
      <div className="flex space-x-3">
        <button 
          onClick={async () => handleAutoAssignment()}
          className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-500 text-white rounded-lg hover:from-purple-700 hover:to-purple-600 transition-all shadow hover:shadow-md flex items-center justify-center"
        >
          <SparklesIcon className="w-5 h-5 mr-2" />
          Automatique
        </button>
        
        <button 
          onClick={() => setModeAffichage('manual')}
          className="flex-1 px-4 py-2 bg-white text-purple-700 border border-purple-300 rounded-lg hover:bg-purple-50 transition-colors shadow hover:shadow-md flex items-center justify-center"
        >
          <HandRaisedIcon className="w-5 h-5 mr-2" />
          Manuel
        </button>
      </div>
    </div>
  )}
  
  {/* Notification Toast */}
  {notification.visible && (
    <div className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 flex items-start max-w-md ${
      notification.type === 'error' ? 'bg-red-50 text-red-800 border-l-4 border-red-500' :
      notification.type === 'success' ? 'bg-green-50 text-green-800 border-l-4 border-green-500' :
      'bg-purple-50 text-purple-800 border-l-4 border-purple-500'
    }`}>
      <div className="flex-1">
        <p className="font-medium">
          {notification.type === 'error' ? 'Erreur' : 
           notification.type === 'success' ? 'Succès' : 'Information'}
        </p>
        <p>{notification.message}</p>
      </div>
      <button 
        onClick={() => setNotification({...notification, visible: false})}
        className="ml-4 text-gray-500 hover:text-gray-700"
      >
        <XMarkIcon className="w-5 h-5" />
      </button>
    </div>
  )}
  
  {/* Manual Assignment Table */}
  {modeAffichage === 'manual' && (
    <div className="overflow-hidden rounded-lg border border-purple-100 shadow-sm">
      <table className="min-w-full divide-y divide-purple-200">
        <thead className="bg-purple-50">
          <tr>
            <th className={`px-6 py-3 text-left text-xs font-medium text-purple-800 uppercase tracking-wider ${isRtl ? 'text-right' : 'text-left'}`}>
              Groupe
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-purple-800 uppercase tracking-wider">
              Année
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-purple-800 uppercase tracking-wider">
              
            </th>
            <th className={`px-6 py-3 text-center text-xs font-medium text-purple-800 uppercase tracking-wider ${isRtl ? 'text-right' : 'text-left'}`}>
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-purple-200">
          {groupes.map((groupe) => (
            <tr key={groupe.id} className="hover:bg-purple-50 transition-colors">
              <td className={`px-6 py-4 whitespace-nowrap ${isRtl ? 'text-right' : 'text-left'}`}>
                <div className="text-sm font-medium text-purple-900">{groupe.nom}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-purple-700">{theme.annee_titre}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-purple-700">
                  {groupe.specialite || ""}
                </div>
              </td>
              <td className={`px-6 py-4 whitespace-nowrap ${isRtl ? 'text-right' : 'text-left'}`}>
                {
                    groupe.affecte ? 
                    <button
                  className={`px-4 py-1 rounded-full text-sm font-medium transition-all ${
                    groupe.affecte 
                      ? 'bg-purple-100 text-purple-800 hover:bg-purple-200' 
                      : 'bg-purple-600 text-white hover:bg-purple-700 shadow-md hover:shadow-lg'
                  }`}
                >
                 
                      <CheckCircleIcon className="w-4 h-4 inline mr-1" />
                      Affecté
                </button> :
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    setAffecterInfos({ ...affecterInfos, theme_id: theme.id, groupe: groupe.id });
                    setConfirmAffecter(true);
                  }}
                  className={`px-4 py-1 rounded-full text-sm font-medium transition-all ${
                    groupe.affecte 
                      ? 'bg-purple-100 text-purple-800 hover:bg-purple-200' 
                      : 'bg-purple-600 text-white hover:bg-purple-700 shadow-md hover:shadow-lg'
                  }`}
                >
                      <PlusCircleIcon className="w-4 h-4 inline mr-1" />
                      Affecter
                </button>
                }
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )}
</div>
                                         
                            }
                        </div>
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
                                <p className="loader-text">Opération en cours...</p>
                            </div>
                        </div>
                    )
                }
                {
                    confirmAffecter &&
                    <AffecterAlert handleAffecter={(e) => affectationManuel(e, affecterInfos.theme_id, affecterInfos.groupe)} annulerAffecter={() => setConfirmAffecter(false)} />
                }
            </div>
        </ThemeAdminContext.Provider>
    )
}

export default ThemeAdmin

const AccepterAlert = ({ annulerAccept, id, acceptSuccess }) => {

    const { setLoading, setTheme, theme } = useContext(ThemeAdminContext)

    const handleAccept = (e) => {

        e.preventDefault()
        setLoading(true)

        axios.patch(`${process.env.REACT_APP_API_URL_SERVICE2}/themes/${id}/valider/`, {}, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('access_token')}`,
                'Content-Type': 'application/json'
            }
        })
            .then(() => {
                setTheme({ ...theme, valide: true })
                annulerAccept();
                acceptSuccess();
            })
            .catch((err) => console.error("Erreur PATCH :", err))
            .finally(() => setLoading(false))

    }

    return (
        <div className="add-theme-success">
            <div className="img-container" style={{ height: "90px" }}>
                <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="30" cy="30" r="30" fill="#FFD21E" />
                    <path d="M29.5001 15.75V34.0833M29.6147 43.25V43.4792H29.3855V43.25H29.6147Z" stroke="white" stroke-width="5.5" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
            </div>
            <span style={{ width: "95%", fontFamily: "Kumbh Sans, sans-serif", textAlign: "center", fontSize: "1.1rem", fontWeight: "500" }}>
                ✅ Accepter ce thème ?
                Cette action le rendra disponible pour attribution aux groupes d'étudiants.
            </span>
            <div className="btns-line">
                <button
                    style={{
                        alignSelf: "flex-end",
                        marginTop: "auto",
                        padding: "5px 0",
                        background: "#E2E4E5",
                        width: "90px",
                        borderRadius: "20px",
                        color: "#000000",
                        fontWeight: "500"
                    }}
                    onClick={(e) => { e.preventDefault(); annulerAccept() }}
                >
                    Annuler
                </button>
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
                    onClick={(e) => handleAccept(e)}
                >
                    OK
                </button>
            </div>
        </div>
    )
}

const AccepterSuccess = ({ acceptSuccess }) => {
    return (
        <div className="add-theme-success">
            <div className="img-container" style={{ height: "90px", width: "100px" }}>
                <img src={doneImg} alt="done" style={{ height: "100%", width: "100%", objectFit: "cover", transform: "scale(1.2)" }} />
            </div>
            <span style={{ width: "95%", fontFamily: "Kumbh Sans, sans-serif", textAlign: "center", fontSize: "1.1rem", fontWeight: "500" }}>
                ✨Le thème a été accepté avec succès. Il est désormais disponible pour attribution aux groupes d'étudiants.✨
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

const RefuserSuccess = ({ acceptSuccess }) => {
    return (
        <div className="add-theme-success">
            <div className="img-container" style={{ height: "90px", width: "100px" }}>
                <img src={doneImg} alt="done" style={{ height: "100%", width: "100%", objectFit: "cover", transform: "scale(1.2)" }} />
            </div>
            <span style={{ width: "95%", fontFamily: "Kumbh Sans, sans-serif", textAlign: "center", fontSize: "1.1rem", fontWeight: "500" }}>
                ❌ Le thème a été refusé avec succès. Il ne sera pas disponible pour les groupes d'étudiants. Un motif de refus a été enregistré pour référence.
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

const RefuserAlert = ({ annulerRefuser, refuserSuccess, id }) => {

    const { setLoading, motif, setTheme, theme } = useContext(ThemeAdminContext)

    const handleRefuser = (e) => {

        e.preventDefault()
        setLoading(true)

        axios.patch(`${process.env.REACT_APP_API_URL_SERVICE2}/themes/${id}/refuser/`, {
            motif: motif
        }, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('access_token')}`,
                'Content-Type': 'application/json'
            }
        })
            .then(() => {
                setTheme({ ...theme, motif: motif })
                annulerRefuser();
                refuserSuccess();
            })
            .catch((err) => console.error("Erreur PATCH :", err))
            .finally(() => setLoading(false))

    }


    return (
        <div className="add-theme-success">
            <div className="img-container" style={{ height: "90px" }}>
                <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="30" cy="30" r="30" fill="#FFD21E" />
                    <path d="M29.5001 15.75V34.0833M29.6147 43.25V43.4792H29.3855V43.25H29.6147Z" stroke="white" stroke-width="5.5" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
            </div>
            <span style={{ width: "95%", fontFamily: "Kumbh Sans, sans-serif", textAlign: "center", fontSize: "1.1rem", fontWeight: "500" }}>
                ❌ Refuser ce thème ?
                Cette action empêchera les étudiants de le sélectionner ou de l'attribuer à un groupe.
            </span>
            <div className="btns-line">
                <button
                    style={{
                        alignSelf: "flex-end",
                        marginTop: "auto",
                        padding: "5px 0",
                        background: "#E2E4E5",
                        width: "90px",
                        borderRadius: "20px",
                        color: "#000000",
                        fontWeight: "500"
                    }}
                    onClick={(e) => { e.preventDefault(); annulerRefuser() }}
                >
                    Annuler
                </button>
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
                    onClick={(e) => handleRefuser(e)}
                >
                    OK
                </button>
            </div>
        </div>
    )
}

const ReserveSuccess = ({ acceptSuccess }) => {
    return (
        <div className="add-theme-success">
            <div className="img-container" style={{ height: "90px", width: "100px" }}>
                <img src={doneImg} alt="done" style={{ height: "100%", width: "100%", objectFit: "cover", transform: "scale(1.2)" }} />
            </div>
            <span style={{ width: "95%", fontFamily: "Kumbh Sans, sans-serif", textAlign: "center", fontSize: "1.1rem", fontWeight: "500" }}>
                ✅ Le thème a été accepté et réservé avec succès.
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

const ReserveAlert = ({ annulerRefuser, refuserSuccess, id }) => {

    const { setLoading, setTheme, theme } = useContext(ThemeAdminContext)

    const handleRefuser = (e) => {

        e.preventDefault()
        setLoading(true)

        axios.patch(`${process.env.REACT_APP_API_URL_SERVICE2}/themes/${id}/reserver/`, {}, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('access_token')}`,
                'Content-Type': 'application/json'
            }
        })
            .then(() => {
                setTheme({ ...theme, reserve: true })
                annulerRefuser();
                refuserSuccess();
            })
            .catch((err) => console.error("Erreur PATCH :", err))
            .finally(() => setLoading(false))

    }


    return (
        <div className="add-theme-success">
            <div className="img-container" style={{ height: "90px" }}>
                <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="30" cy="30" r="30" fill="#FFD21E" />
                    <path d="M29.5001 15.75V34.0833M29.6147 43.25V43.4792H29.3855V43.25H29.6147Z" stroke="white" stroke-width="5.5" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
            </div>
            <span style={{ width: "95%", fontFamily: "Kumbh Sans, sans-serif", textAlign: "center", fontSize: "1.1rem", fontWeight: "500" }}>
                🔒 Réserver ce thème ?
                Cette action rendra ce thème indisponible à la sélection ou à l'attribution par les groupes d'étudiants.
            </span>
            <div className="btns-line">
                <button
                    style={{
                        alignSelf: "flex-end",
                        marginTop: "auto",
                        padding: "5px 0",
                        background: "#E2E4E5",
                        width: "90px",
                        borderRadius: "20px",
                        color: "#000000",
                        fontWeight: "500"
                    }}
                    onClick={(e) => { e.preventDefault(); annulerRefuser() }}
                >
                    Annuler
                </button>
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
                    onClick={(e) => handleRefuser(e)}
                >
                    OK
                </button>
            </div>
        </div>
    )
}

const AffecterAlert = ({ annulerAffecter, handleAffecter }) => {
    return (
        <div className="add-departement-success">
            <div className="img-container" style={{ height: "90px", width: "150px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="30" cy="30" r="30" fill="#FFD21E" />
                    <path d="M29.5001 15.75V34.0833M29.6147 43.25V43.4792H29.3855V43.25H29.6147Z" stroke="white" stroke-width="5.5" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
            </div>
            <span style={{ width: "95%", fontFamily: "Kumbh Sans, sans-serif", textAlign: "center", fontSize: "1.1rem", fontWeight: "500" }}>
                Êtes-vous certain(e) de vouloir affecter le thème a ce groupe ?
            </span>
            <div
                className="btns-line"
            >
                <button
                    style={{
                        color: "#000",
                        background: "#E2E4E5"
                    }}
                    onClick={(e) => { annulerAffecter(e) }}
                >
                    Annuler
                </button>
                <button
                    style={{

                    }}
                    onClick={(e) => { handleAffecter(e); }}
                >
                    Affecter
                </button>
            </div>
        </div>
    )
}
