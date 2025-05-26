import React, { useState, useContext, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import '../Styles/Parametres.css'
import { ReactComponent as EditIcon } from '../../../Assets/Icons/edit.svg';
import { ReactComponent as DeleteIcon } from '../../../Assets/Icons/Delete.svg';
import { ReactComponent as CircleArrowIcon } from '../../../Assets/Icons/circle-left-arrow.svg';
import { AppContext } from '../../../App';
import '../../Partials/Components/i18n'
import { useTranslation, Trans } from 'react-i18next';
import axios from 'axios';
import doneImg from '../../../Assets/Images/Done.png'
import { ReactComponent as EmptyIcon } from '../../../Assets/Icons/EmptyState.svg';

export const Departements = () => {

    const { isRtl } = useContext(AppContext);

    const navigate = useNavigate();

    const [selectedDepartement, setSelectedDepartement] = useState(null);
    const [index2, setIndex2] = useState(null)

    const toggleDepartement = (index) => {
        setIndex2(null)
        setSelectedDepartement(selectedDepartement === index ? null : index);
    }

    const { t } = useTranslation();

    const [departements, setDepartements] = useState([]);
    const [newDepartments, setNewDepartments] = useState([]);

    useEffect(() => {

        axios.get(`${process.env.REACT_APP_API_URL_SERVICE1}/departements/`)
            .then((res) => setDepartements(res.data))
            .catch((err) => {
                console.error("Erreur Axios :", err);
            })

    }, [])

    const [newDepartement, setDepartement] = useState({
        title: ""
    });

    const AddDepartement = (e) => {
        e.preventDefault();
        if (!newDepartement.title.trim()) {
            alert("Title cannot be empty");
            return;
        }
        setNewDepartments(prev => [...prev, newDepartement]);
        setDepartement({ title: "" });
    }

    const [addSuccess, setAddSuccess] = useState(false)

    const AddDepartements = (e) => {
        e.preventDefault();
        axios.post(`${process.env.REACT_APP_API_URL_SERVICE1}/departements/`, newDepartments)
            .then((res) => {
                console.log(res.data)
                setDepartements(prev => [...prev, ...res.data]);
                setNewDepartments([])
                setAddSuccess(true)
            })
            .catch((err) => {
                console.error("Erreur Axios :", err);
            });
    }

    const [modifiedDepartement, setModifyDepartement] = useState({
        id: null,
        title: "",
        type: "unknown",
        index: 0
    });

    const handlemodifie = (e) => {
        e.preventDefault()
        if (modifiedDepartement.type === "exist") {
            axios.put(`${process.env.REACT_APP_API_URL_SERVICE1}/departements/${modifiedDepartement.id}/`, {
                id: modifiedDepartement.id,
                title: modifiedDepartement.title
            })
                .then(() => {
                    setDepartements(prevDepartements =>
                        prevDepartements.map(dept =>
                            dept.id === modifiedDepartement.id ? { ...dept, title: modifiedDepartement.title } : dept
                        )
                    );
                    alert("modifie avec succes")
                })
        } else {
            setNewDepartments(prevDepartements =>
                prevDepartements.map((dept, idx) =>
                    idx === modifiedDepartement.index ? { ...dept, title: modifiedDepartement.title } : dept
                )
            );
        }

        annulerModifier(e);
    }

    const [modifieClicked, setModifieClicked] = useState(false);
    const [confirmModifie, setConfirmModifie] = useState(false);

    const annulerModifier = (e) => {
        e.preventDefault()
        setModifieClicked(false);
        setModifyDepartement({
            id: null,
            title: "",
            type: "unknown",
            index: 0
        });
        setDepartement({ title: "" })
        setConfirmModifie(false)
    }

    const [deletedDepartment, setDeletedDepartement] = useState({
        id: null,
        index: 0,
        type: ""
    })

    const [confirmDelete, setConfirmDelete] = useState(false);

    const handleDelete = (e) => {

        e.preventDefault();
        if (deletedDepartment.type === "exist") {
            axios.delete(`${process.env.REACT_APP_API_URL_SERVICE1}/departements/${deletedDepartment.id}/`)
                .then((res) => {
                    setDepartements(prevDepartements =>
                        prevDepartements.filter(dep => dep.id !== deletedDepartment.id)
                    )
                    alert("departement supprimé!")
                })
        } else {
            setNewDepartments(prevDepartements =>
                prevDepartements.filter((department, idx) => idx !== deletedDepartment.index)
            )
        }

        annulerDelete(e);

    }

    const annulerDelete = (e) => {
        e.preventDefault()
        setDeletedDepartement({
            id: null,
            type: "unknown",
            index: 0
        });
        setDepartement({ title: "" })
        setConfirmDelete(false)
    }

    const handleLinkClick = (e) => {
        e.preventDefault();

        if (newDepartments.length !== 0) {
            const confirmLeave = window.confirm("Vous devez sauvegarder vos modifications. Voulez-vous vraiment quitter sans sauvegarder ?");
            if (confirmLeave) {
                navigate('/admin/scolarite');
            }
        } else {
            navigate('/admin/scolarite');
        }
    };

    return (
        <div className='departements-container'>
            <div className="departements-wrapper">
                <div className="title-line">
                    <h3 style={{ fontSize: "1.05rem", fontWeight: "400", color: "#727272", userSelect: "none" }}>
                        <Trans i18nKey={"parametresPage.departementLink"}>
                            Paramètres &gt; <Link to={'/admin/scolarite'} className='return-to-scolarite' onClick={handleLinkClick}> Paramètres Scolarité </Link>
                        </Trans>
                        <span style={{ color: "#925FE2" }}>{t('parametresPage.departements')}</span>
                    </h3>
                    <button className="precedent-btn" onClick={handleLinkClick}>
                        <CircleArrowIcon className={`${isRtl ? "rtl-icon" : ""}`} />
                        {t('parametresPage.precedent')}
                    </button>
                </div>
                <div
                    className="formDep-container"
                    style={{
                        paddingLeft: isRtl ? "" : "1.5rem",
                        paddingRight: isRtl ? "1.5rem" : ""
                    }}
                >
                    <h1 style={{ fontSize: "1.85rem", color: "#000", fontWeight: "500" }}>
                        {t('parametresPage.departementTitle')}
                    </h1>
                    <p style={{ color: "#5F5F5F", fontSize: "1.1rem", fontFamily: "Nunito, sans serif", width: "630px" }}>
                        {t('parametresPage.departementRemark')}
                    </p>
                    <div
                        className="form-table-container"
                    >
                        <form action="">
                            <input
                                type="text"
                                className='common-input'
                                style={{
                                    flex: "0 0 64%"
                                }}
                                value={modifiedDepartement.id !== null ? modifiedDepartement.title : newDepartement.title}
                                placeholder={t('parametresPage.inputDepPlaceholder')}
                                onChange={(e) => {
                                    if (modifiedDepartement?.id !== null) {
                                        setModifyDepartement({ ...modifiedDepartement, title: e.target.value });
                                    } else {
                                        setDepartement({ ...newDepartement, title: e.target.value });
                                    }
                                }}
                                required
                            />
                            <button
                                className='annuler-button'
                                style={{
                                    flex: 1,
                                    minWidth: "110px"
                                }}
                                onClick={(e) => { annulerModifier(e); setNewDepartments({ title: "" }) }}
                            >
                                {t('parametresPage.annuler')}
                            </button>
                            {
                                !modifieClicked ?
                                    <button
                                        className='ajouter-btn'
                                        style={{
                                            flex: 1,
                                            minWidth: "110px"
                                        }}
                                        onClick={(e) => AddDepartement(e)}
                                    >
                                        {t('parametresPage.ajouter')}
                                    </button>
                                    :
                                    <button
                                        className='ajouter-btn'
                                        style={{
                                            flex: 1,
                                            minWidth: "110px"
                                        }}
                                        onClick={(e) => { e.preventDefault(); setConfirmModifie(true) }}
                                    >
                                        Modifier
                                    </button>
                            }

                        </form>
                        <div className="departements-table">
                            {
                                departements.map((dep, index) => (
                                    <div
                                        className={`departement-line ${selectedDepartement === index ? "selected" : ""}`}
                                        onClick={() => toggleDepartement(index)}
                                    >
                                        <span style={{ fontSize: "0.9rem" }}>
                                            Département {dep.title}
                                        </span>
                                        <div className="line-btns">
                                            <button
                                                onClick={() => {
                                                    setDepartement({ title: "" })
                                                    setModifyDepartement({ ...modifiedDepartement, id: dep.id, title: dep.title, type: "exist", index: index });
                                                    setModifieClicked(true);
                                                }
                                                }
                                            >
                                                <EditIcon />
                                                {t('enseignantsPage.modifieBtn')}
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setDeletedDepartement({ ...deletedDepartment, id: dep.id, type: "exist", index: index })
                                                    setConfirmDelete(true)
                                                }}
                                            >
                                                <DeleteIcon />
                                                {t('enseignantsPage.deleteBtn')}
                                            </button>
                                        </div>
                                    </div>
                                ))
                            }
                            {
                                newDepartments.map((dep, index) => (
                                    <div
                                        className={`departement-line ${index2 === index ? "selected" : ""}`}
                                        onClick={() => { setSelectedDepartement(null); setIndex2(index2 === index ? null : index) }}
                                    >
                                        <span style={{ fontSize: "0.9rem" }}>
                                            Département {dep.title}
                                        </span>
                                        <div className="line-btns">
                                            <button
                                                onClick={() => {
                                                    setDepartement({ title: "" })
                                                    setModifyDepartement({ ...modifiedDepartement, id: "modify", title: dep.title, type: "no-exist" })
                                                    setModifieClicked(true)
                                                }}
                                            >
                                                <EditIcon />
                                                {t('enseignantsPage.modifieBtn')}
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setDeletedDepartement({ ...deletedDepartment, id: "modify", type: "no-exist", index: index })
                                                    setConfirmDelete(true)
                                                }}
                                            >
                                                <DeleteIcon />
                                                {t('enseignantsPage.deleteBtn')}
                                            </button>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                </div>

            </div>
            <button
                className="enregistre-btn"
                style={{
                    right: isRtl ? "" : "20px",
                    left: isRtl ? "20px" : ""
                }}
                onClick={(e) => AddDepartements(e)}
            >
                {t('parametresPage.enregistrer')}
            </button>
            {
                addSuccess &&
                <AddAlert addSuccess={() => setAddSuccess(false)} />
            }
            {
                confirmModifie &&
                <ModifierAlert annulerModifier={annulerModifier} handlemodifie={handlemodifie} />
            }
            {
                confirmDelete &&
                <DeleteAlert annulerDelete={annulerDelete} handleDelete={handleDelete} />
            }
        </div>
    )
}

export const Salles = () => {

    const { isRtl } = useContext(AppContext);

    const navigate = useNavigate();

    const [selectedSalle, setSelectedSalle] = useState(null);

    const toggleSalle = (index) => {
        setSeelctedNewSalle(null);
        setSelectedSalle(selectedSalle === index ? null : index)
    }

    const [focusedInput, setFocusedInput] = useState(null);

    const { t } = useTranslation();

    const [salles, setSalles] = useState([]);
    const [newSalles, setNewSalles] = useState([]);
    const [departements, setDepartements] = useState([])

    useEffect(() => {

        axios.get(`${process.env.REACT_APP_API_URL_SERVICE1}/salles/`)
            .then((res) => setSalles(res.data))
            .catch((err) => {
                console.error("Erreur Axios :", err);
            })

        axios.get(`${process.env.REACT_APP_API_URL_SERVICE1}/departements/`)
            .then((res) => setDepartements(res.data))
            .catch((err) => {
                console.error("Erreur Axios :", err);
            })

    }, [])

    const [newSalle, setNewSalle] = useState({
        type: "",
        num: "",
        disponible: true,
        departement: "",
        nom_salle: ""
    });

    const AddDepartement = (e) => {
        e.preventDefault();
        if (!newSalle.nom_salle.trim()) {
            alert("nom de salle cannot be empty");
            return;
        }
        setNewSalles(prev => [...prev, newSalle]);
        setNewSalle({
            type: "",
            num: "",
            disponible: true,
            departement: "",
            nom_salle: ""
        });
    }

    const [addSuccess, setAddSuccess] = useState(false)

    const AddSalles = (e) => {
        e.preventDefault();
        axios.post(`${process.env.REACT_APP_API_URL_SERVICE1}/salles/`, newSalles)
            .then((res) => {
                console.log(res.data)
                setSalles(prev => [...prev, ...res.data]);
                setAddSuccess(true)
                setNewSalles([])
            })
            .catch((err) => {
                console.error("Erreur Axios :", err);
                if (err.response) {
                    // Print detailed error from Django REST Framework
                    console.error("Server responded with error:", err.response.data);
                    alert("Erreur serveur : " + JSON.stringify(err.response.data, null, 2));
                } else if (err.request) {
                    console.error("No response received from server:", err.request);
                } else {
                    console.error("Error setting up request:", err.message);
                }
            });
    }

    const [modifiedSalle, setModifySalle] = useState({
        id: null,
        nom_salle: "",
        type: "",
        num: "",
        disponible: true,
        departement: "",
        type1: "unknown",
        index: 0
    });

    const handlemodifie = (e) => {
        e.preventDefault()
        if (modifiedSalle.type1 === "exist") {
            axios.put(`${process.env.REACT_APP_API_URL_SERVICE1}/salles/${modifiedSalle.id}/`, {
                id: modifiedSalle.id,
                type: modifiedSalle.type,
                num: modifiedSalle.num,
                disponible: modifiedSalle.disponible,
                departement: modifiedSalle.departement,
                nom_salle: modifiedSalle.nom_salle
            })
                .then(() => {
                    setSalles(prevSalles =>
                        prevSalles.map(salle =>
                            salle.id === modifiedSalle.id
                                ? {
                                    ...salle,
                                    type: modifiedSalle.type,
                                    num: modifiedSalle.num,
                                    disponible: modifiedSalle.disponible,
                                    departement: modifiedSalle.departement,
                                    nom_salle: modifiedSalle.nom_salle
                                }
                                : salle
                        )
                    );

                    alert("modifie avec succes")
                })
        } else {
            setNewSalles(prevDepartements =>
                prevDepartements.map((dept, idx) =>
                    idx === modifiedSalle.index ? {
                        ...dept,
                        type: modifiedSalle.type,
                        num: modifiedSalle.num,
                        departement: modifiedSalle.departement,
                        nom_salle: modifiedSalle.nom_salle,
                    } : dept
                )
            );
        }

        annulerModifier(e);
    }

    const [modifieClicked, setModifieClicked] = useState(false);
    const [confirmModifie, setConfirmModifie] = useState(false);

    const annulerModifier = (e) => {
        e.preventDefault()
        setModifieClicked(false);
        setModifySalle({
            id: null,
            title: "",
            type: "unknown",
            index: 0
        });
        setNewSalle({
            type: "",
            num: "",
            disponible: true,
            departement: "",
            nom_salle: ""
        })
        setConfirmModifie(false)
    }

    const [deletedSalle, setDeletedSalle] = useState({
        id: null,
        index: 0,
        type: ""
    })

    const [confirmDelete, setConfirmDelete] = useState(false);

    const handleDelete = (e) => {

        e.preventDefault();
        if (deletedSalle.type === "exist") {
            axios.delete(`${process.env.REACT_APP_API_URL_SERVICE1}/salles/${deletedSalle.id}/`)
                .then((res) => {
                    setSalles(prevSalles =>
                        prevSalles.filter(salle => salle.id !== deletedSalle.id)
                    )
                    alert("departement supprimé!")
                })
        } else {
            setNewSalles(prevSalles =>
                prevSalles.filter((salle, idx) => idx !== deletedSalle.index)
            )
        }

        annulerDelete(e);

    }

    const annulerDelete = (e) => {
        e.preventDefault()
        setDeletedSalle({
            id: null,
            type: "unknown",
            index: 0
        });
        setNewSalle({ title: "" })
        setConfirmDelete(false)
    }

    const modifieSalle = (salle, type, id, index) => {
        setModifySalle({
            id: id,
            nom_salle: salle.nom_salle,
            type: salle.type,
            num: salle.num,
            disponible: salle.disponible,
            departement: salle.departement,
            type1: type,
            index: index
        })
    }

    const handleAnnuler = (e) => {
        annulerModifier(e);
        setNewSalle({
            type: "",
            num: "",
            disponible: true,
            departement: "",
            nom_salle: ""
        })
    }

    const [selectedNewSalle, setSeelctedNewSalle] = useState(null)

    const toggleNewSalle = (index) => {
        setSelectedSalle(null)
        setSeelctedNewSalle(selectedNewSalle === index ? null : index)
    }

    const handleLinkClick = (e) => {
        e.preventDefault();

        if (newSalles.length !== 0) {
            const confirmLeave = window.confirm("Vous devez sauvegarder vos modifications. Voulez-vous vraiment quitter sans sauvegarder ?");
            if (confirmLeave) {
                navigate('/admin/scolarite');
            }
        } else {
            navigate('/admin/scolarite');
        }
    };

    return (
        <div className="salles-container">
            <div className="salles-wrapper">
                <div className="title-line">
                    <h3 style={{ fontSize: "1.05rem", fontWeight: "400", color: "#727272", }}>
                        <Trans i18nKey={"parametresPage.departementLink"}>
                            Paramètres &gt; <Link to={'/admin/scolarite'} className='return-to-scolarite' onClick={handleLinkClick}> Paramètres Scolarité </Link>
                        </Trans>
                        <span style={{ color: "#925FE2" }}>{t('parametresPage.salles')}</span>
                    </h3>
                    <button className="precedent-btn" onClick={handleLinkClick}>
                        <CircleArrowIcon className={`${isRtl ? "rtl-icon" : ""}`} />
                        {t('parametresPage.precedent')}
                    </button>
                </div>
                <div
                    className="formSall-container"
                    style={{
                        paddingLeft: isRtl ? "" : "1.5rem",
                        paddingRight: isRtl ? "1.5rem" : ""
                    }}
                >
                    <h1 style={{ fontSize: "1.85rem", color: "#000", fontWeight: "500" }}>
                        {t('parametresPage.sallesTitle')}
                    </h1>
                    <p style={{ color: "#5F5F5F", fontSize: "1.1rem", fontFamily: "Nunito, sans serif", width: "600px" }}>
                        {t('parametresPage.sallesRemark')}
                    </p>
                    <div
                        className="form-table-container"
                        style={{
                            paddingRight: isRtl ? "" : "1.5rem",
                            paddingLeft: isRtl ? "1.5rem" : ""
                        }}
                    >
                        <form action="" style={{ flexWrap: "nowrap" }}>
                            <input
                                type="text"
                                className='common-input'
                                style={{ flex: "0 0 25%" }}
                                placeholder={t('parametresPage.inputSalPlaceholder')}
                                onFocus={() => setFocusedInput("nom")}
                                onBlur={() => setFocusedInput(null)}
                                value={modifiedSalle.id !== null ? modifiedSalle.nom_salle : newSalle.nom_salle}
                                onChange={(e) => {
                                    if (modifiedSalle?.id !== null) {
                                        setModifySalle({ ...modifiedSalle, nom_salle: e.target.value });
                                    } else {
                                        setNewSalle({ ...newSalle, nom_salle: e.target.value });
                                    }
                                }}
                            />
                            <div
                                className="select-scolarite-line common-input"
                                style={{
                                    flex: 1,
                                    border: focusedInput === "departement" ? "2px solid #A277F0" : "2px solid #D9E1E7"
                                }}

                            >
                                <select
                                    type="text"
                                    className='select-input'
                                    onFocus={() => setFocusedInput("departement")}
                                    onBlur={() => setFocusedInput(null)}
                                    value={modifiedSalle.id !== null ? modifiedSalle.departement : newSalle.departement}
                                    onChange={(e) => {
                                        if (modifiedSalle?.id !== null) {
                                            setModifySalle({ ...modifiedSalle, departement: parseInt(e.target.value) });
                                        } else {
                                            setNewSalle({ ...newSalle, departement: parseInt(e.target.value) });
                                        }
                                    }}
                                >
                                    <option value="default">Département</option>
                                    {
                                        departements.map((dep) => (
                                            <option value={dep.id}>{dep.title}</option>
                                        ))
                                    }
                                </select>
                                <svg
                                    width="10"
                                    height="6"
                                    viewBox="0 0 10 6"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"

                                >
                                    <path d="M4.99929 4.18863L8.77899 0.220677C8.91347 0.0793351 9.09533 0 9.28493 0C9.47453 0 9.65649 0.0793351 9.79097 0.220677C9.85721 0.290046 9.90976 0.372607 9.94565 0.463596C9.98153 0.554585 10 0.652194 10 0.750779C10 0.849365 9.98153 0.946974 9.94565 1.03796C9.90976 1.12895 9.85721 1.21152 9.79097 1.28089L5.50595 5.77932C5.37147 5.92066 5.1896 6 5 6C4.8104 6 4.62853 5.92066 4.49405 5.77932L0.209032 1.28089C0.14279 1.21152 0.0902398 1.12895 0.0543536 1.03796C0.0184674 0.946974 0 0.849365 0 0.750779C0 0.652194 0.0184674 0.554585 0.0543536 0.463596C0.0902398 0.372607 0.14279 0.290046 0.209032 0.220677C0.343604 0.0795203 0.525523 0.000314919 0.715067 0.000314919C0.904612 0.000314919 1.08644 0.0795203 1.22101 0.220677L4.99929 4.18863Z" fill="#8A8A8A" />
                                </svg>
                            </div>
                            <input
                                type="number"
                                className='common-input'
                                style={{ flex: 1 }}
                                placeholder={t('parametresPage.capacite')}
                                min={1}
                                onFocus={() => setFocusedInput("nom")}
                                onBlur={() => setFocusedInput(null)}
                                value={modifiedSalle.id !== null ? modifiedSalle.num : newSalle.num}
                                onChange={(e) => {
                                    if (modifiedSalle?.id !== null) {
                                        setModifySalle({ ...modifiedSalle, num: parseInt(e.target.value) });
                                    } else {
                                        setNewSalle({ ...newSalle, num: parseInt(e.target.value) });
                                    }
                                }}
                            />
                            <div
                                className="select-scolarite-line common-input"
                                style={{
                                    flex: 1,
                                    border: focusedInput === "type" ? "2px solid #A277F0" : "2px solid #D9E1E7"
                                }}>
                                <select
                                    type="text"
                                    className='select-input'
                                    onFocus={() => setFocusedInput("type")}
                                    onBlur={() => setFocusedInput(null)}
                                    value={modifiedSalle.id !== null ? modifiedSalle.type : newSalle.type}
                                    onChange={(e) => {
                                        if (modifiedSalle?.id !== null) {
                                            setModifySalle({ ...modifiedSalle, type: e.target.value });
                                        } else {
                                            setNewSalle({ ...newSalle, type: e.target.value });
                                        }
                                    }}
                                >
                                    <option value="default">Type Salle</option>
                                    <option value="Salle TP">Salle TP</option>
                                    <option value="Salle TD">Salle TD</option>
                                    <option value="Amphi">Amphi</option>
                                </select>
                                <svg
                                    width="10"
                                    height="6"
                                    viewBox="0 0 10 6"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"

                                >
                                    <path d="M4.99929 4.18863L8.77899 0.220677C8.91347 0.0793351 9.09533 0 9.28493 0C9.47453 0 9.65649 0.0793351 9.79097 0.220677C9.85721 0.290046 9.90976 0.372607 9.94565 0.463596C9.98153 0.554585 10 0.652194 10 0.750779C10 0.849365 9.98153 0.946974 9.94565 1.03796C9.90976 1.12895 9.85721 1.21152 9.79097 1.28089L5.50595 5.77932C5.37147 5.92066 5.1896 6 5 6C4.8104 6 4.62853 5.92066 4.49405 5.77932L0.209032 1.28089C0.14279 1.21152 0.0902398 1.12895 0.0543536 1.03796C0.0184674 0.946974 0 0.849365 0 0.750779C0 0.652194 0.0184674 0.554585 0.0543536 0.463596C0.0902398 0.372607 0.14279 0.290046 0.209032 0.220677C0.343604 0.0795203 0.525523 0.000314919 0.715067 0.000314919C0.904612 0.000314919 1.08644 0.0795203 1.22101 0.220677L4.99929 4.18863Z" fill="#8A8A8A" />
                                </svg>
                            </div>
                            <button
                                className='annuler-button'
                                style={{ flex: "0 0 12%", minWidth: "100px" }}
                                onClick={(e) => handleAnnuler(e)}
                            >
                                {t('parametresPage.annuler')}
                            </button>
                            {
                                !modifieClicked ?
                                    <button
                                        className='ajouter-btn'
                                        style={{
                                            flex: 1,
                                            minWidth: "110px"
                                        }}
                                        onClick={(e) => AddDepartement(e)}
                                    >
                                        {t('parametresPage.ajouter')}
                                    </button>
                                    :
                                    <button
                                        className='ajouter-btn'
                                        style={{
                                            flex: 1,
                                            minWidth: "110px"
                                        }}
                                        onClick={(e) => { e.preventDefault(); setConfirmModifie(true) }}
                                    >
                                        Modifier
                                    </button>
                            }
                        </form>
                        <div className="salles-table">
                            {
                                salles.map((salle, index) => (
                                    <div
                                        className={`salle-line ${selectedSalle === index ? "selected" : ""}`}
                                        onClick={() => toggleSalle(index)}

                                    >
                                        <span
                                            style={{ flex: "0 0 24%", fontSize: "0.9rem" }}
                                        >
                                            {salle.nom_salle}
                                        </span>
                                        <span style={{ fontSize: "0.9rem", flex: 1, textIndent: "1.5rem", }}>
                                            {
                                                departements.find(dep => dep.id === salle.departement)?.title || "Département inconnu"
                                            }
                                        </span>
                                        <span style={{ fontSize: "0.9rem", flex: 1, textIndent: "1.5rem", }}>
                                            {salle.num}
                                        </span>
                                        <span style={{ fontSize: "0.9rem", flex: 1, textIndent: "1.5rem", }}>
                                            {salle.type}
                                        </span>
                                        <div className="line-btns">
                                            <button
                                                onClick={() => {
                                                    setNewSalle({
                                                        nom_salle: "",
                                                        type: "",
                                                        num: "",
                                                        disponible: true,
                                                        departement: ""
                                                    })
                                                    modifieSalle(salle, "exist", salle.id, index)
                                                    setModifieClicked(true);
                                                }
                                                }
                                            >
                                                <EditIcon />
                                                {t('enseignantsPage.modifieBtn')}
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setDeletedSalle({ ...deletedSalle, id: salle.id, type: "exist", index: index })
                                                    setConfirmDelete(true)
                                                }}
                                            >
                                                <DeleteIcon />
                                                {t('enseignantsPage.deleteBtn')}
                                            </button>
                                        </div>
                                    </div>
                                ))
                            }
                            {
                                newSalles.map((salle, index) => (
                                    <div
                                        className={`salle-line ${selectedNewSalle === index ? "selected" : ""}`}
                                        onClick={() => toggleNewSalle(index)}

                                    >
                                        <span
                                            style={{ flex: "0 0 24%", fontSize: "0.9rem" }}
                                        >
                                            {salle.nom_salle}
                                        </span>
                                        <span style={{ fontSize: "0.9rem", flex: 1, textIndent: "1.5rem", }}>
                                            {
                                                departements.find(dep => dep.id === salle.departement)?.title || "Département inconnu"
                                            }
                                        </span>
                                        <span style={{ fontSize: "0.9rem", flex: 1, textIndent: "1.5rem", }}>
                                            {salle.num}
                                        </span>
                                        <span style={{ fontSize: "0.9rem", flex: 1, textIndent: "1.5rem", }}>
                                            {salle.type}
                                        </span>
                                        <div className="line-btns">
                                            <button
                                                onClick={() => {
                                                    setNewSalle({
                                                        nom_salle: "",
                                                        type: "",
                                                        num: "",
                                                        disponible: true,
                                                        departement: ""
                                                    })
                                                    modifieSalle(salle, "no-exist", "modify", index)
                                                    setModifieClicked(true);
                                                }
                                                }
                                            >
                                                <EditIcon />
                                                {t('enseignantsPage.modifieBtn')}
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setDeletedSalle({ ...deletedSalle, id: "modify", type: "no-exist", index: index })
                                                    setConfirmDelete(true)
                                                }}>
                                                <DeleteIcon />
                                                {t('enseignantsPage.deleteBtn')}
                                            </button>
                                        </div>
                                    </div>
                                ))
                            }

                        </div>
                    </div>
                </div>
            </div>
            <button
                className="enregistre-btn"
                style={{
                    right: isRtl ? "" : "20px",
                    left: isRtl ? "20px" : ""
                }}
                onClick={(e) => AddSalles(e)}
            >
                {t('parametresPage.enregistrer')}
            </button>
            {
                addSuccess &&
                <AddAlert addSuccess={() => setAddSuccess(false)} />
            }
            {
                confirmModifie &&
                <ModifierAlert annulerModifier={annulerModifier} handlemodifie={handlemodifie} />
            }
            {
                confirmDelete &&
                <DeleteAlert annulerDelete={annulerDelete} handleDelete={handleDelete} />
            }
        </div>
    )
}

export const Specialites = () => {

    const { isRtl } = useContext(AppContext);

    const navigate = useNavigate();

    const [selectedSpecialite, setSelectedSpecialite] = useState(null);

    const toggleSpecialite = (index) => {
        setSelectedNewSpecialite(null)
        setSelectedSpecialite(selectedSpecialite === index ? null : index)
    }

    const [selectedNewSpecialite, setSelectedNewSpecialite] = useState(null);

    const toggleNewSpecialite = (index) => {
        setSelectedSpecialite(null)
        setSelectedNewSpecialite(selectedNewSpecialite === index ? null : index)
    }

    const { t } = useTranslation();

    const [specialites, setSpecialites] = useState([]);
    const [newSpecialites, setNewSpecialites] = useState([]);

    useEffect(() => {

        axios.get(`${process.env.REACT_APP_API_URL_SERVICE1}/specialites/`)
            .then((res) => setSpecialites(res.data))
            .catch((err) => {
                console.error("Erreur Axios :", err);
            })

    }, [])

    const [newSpecialite, setSpecialite] = useState({
        title: ""
    });

    const AddSpecialite = (e) => {
        e.preventDefault();
        if (!newSpecialite.title.trim()) {
            alert("Title cannot be empty");
            return;
        }
        setNewSpecialites(prev => [...prev, newSpecialite]);

        setSpecialite({ title: "" });
    }

    const [addSuccess, setAddSuccess] = useState(false)

    const AddSpecialites = (e) => {
        e.preventDefault();
        axios.post(`${process.env.REACT_APP_API_URL_SERVICE1}/specialites/`, newSpecialites)
            .then((res) => {
                console.log(res.data)
                setSpecialites(prev => [...prev, ...res.data]);
                setNewSpecialites([])
                setAddSuccess(true)
            })
            .catch((err) => {
                console.error("Erreur Axios :", err);
            });
    }

    const [modifiedSpecialite, setModifySpecialite] = useState({
        id: null,
        title: "",
        type: "unknown",
        index: 0
    });

    const handlemodifie = (e) => {
        e.preventDefault()
        if (modifiedSpecialite.type === "exist") {
            axios.put(`${process.env.REACT_APP_API_URL_SERVICE1}/specialites/${modifiedSpecialite.id}/`, {
                id: modifiedSpecialite.id,
                title: modifiedSpecialite.title
            })
                .then(() => {
                    setSpecialites(prevDepartements =>
                        prevDepartements.map(dept =>
                            dept.id === modifiedSpecialite.id ? { ...dept, title: modifiedSpecialite.title } : dept
                        )
                    );
                    alert("modifie avec succes")
                })
        } else {
            setNewSpecialites(prevDepartements =>
                prevDepartements.map((dept, idx) =>
                    idx === modifiedSpecialite.index ? { ...dept, title: modifiedSpecialite.title } : dept
                )
            );
        }

        annulerModifier(e);
    }

    const [modifieClicked, setModifieClicked] = useState(false);
    const [confirmModifie, setConfirmModifie] = useState(false);

    const annulerModifier = (e) => {
        e.preventDefault()
        setModifieClicked(false);
        setModifySpecialite({
            id: null,
            title: "",
            type: "unknown",
            index: 0
        });
        setSpecialite({ title: "" })
        setConfirmModifie(false)
    }

    const [deletedSpecialite, setDeletedSpecialite] = useState({
        id: null,
        index: 0,
        type: ""
    })

    const [confirmDelete, setConfirmDelete] = useState(false);

    const handleDelete = (e) => {

        e.preventDefault();
        if (deletedSpecialite.type === "exist") {
            axios.delete(`${process.env.REACT_APP_API_URL_SERVICE1}/specialites/${deletedSpecialite.id}/`)
                .then((res) => {
                    setSpecialites(prevDepartements =>
                        prevDepartements.filter(dep => dep.id !== deletedSpecialite.id)
                    )
                    alert("departement supprimé!")
                })
        } else {
            setNewSpecialites(prevDepartements =>
                prevDepartements.filter((department, idx) => idx !== deletedSpecialite.index)
            )
        }

        annulerDelete(e);

    }

    const annulerDelete = (e) => {
        e.preventDefault()
        setDeletedSpecialite({
            id: null,
            type: "unknown",
            index: 0
        });
        setSpecialite({ title: "" })
        setConfirmDelete(false)
    }

    const handleLinkClick = (e) => {
        e.preventDefault();

        if (newSpecialites.length !== 0) {
            const confirmLeave = window.confirm("Vous devez sauvegarder vos modifications. Voulez-vous vraiment quitter sans sauvegarder ?");
            if (confirmLeave) {
                navigate('/admin/scolarite');
            }
        } else {
            navigate('/admin/scolarite');
        }
    };

    return (
        <div className='specialites-container'>
            <div className="specialites-wrapper">
                <div className="title-line">
                    <h3 style={{ fontSize: "1.05rem", fontWeight: "400", color: "#727272", }}>
                        <Trans i18nKey={"parametresPage.departementLink"}>
                            Paramètres &gt; <Link to={'/admin/scolarite'} className='return-to-scolarite' onClick={handleLinkClick}> Paramètres Scolarité </Link>
                        </Trans>
                        <span style={{ color: "#925FE2" }}>{t('parametresPage.specialites')}</span>
                    </h3>
                    <button className="precedent-btn" onClick={handleLinkClick}>
                        <CircleArrowIcon className={`${isRtl ? "rtl-icon" : ""}`} />
                        {t('parametresPage.precedent')}
                    </button>
                </div>
                <div
                    className="formSpec-container"
                    style={{
                        paddingLeft: isRtl ? "" : "1.5rem",
                        paddingRight: isRtl ? "1.5rem" : ""
                    }}
                >
                    <h1 style={{ fontSize: "1.85rem", color: "#000", fontWeight: "500" }}>
                        {t('parametresPage.specialitesTitle')}
                    </h1>
                    <p style={{ color: "#5F5F5F", fontSize: "1.1rem", fontFamily: "Nunito, sans serif", width: "630px" }}>
                        {t('parametresPage.specialiteRemark')}
                    </p>
                    <div className="form-table-container">
                        <form action="">
                            <input
                                type="text"
                                className='common-input'
                                style={{
                                    flex: "0 0 64%"
                                }}
                                placeholder={t('parametresPage.specInputPlaceholder')}
                                value={modifiedSpecialite.id !== null ? modifiedSpecialite.title : newSpecialite.title}
                                onChange={(e) => {
                                    if (modifiedSpecialite?.id !== null) {
                                        setModifySpecialite({ ...modifiedSpecialite, title: e.target.value });
                                    } else {
                                        setSpecialite({ ...newSpecialite, title: e.target.value });
                                    }
                                }}
                            />
                            <button
                                className='annuler-button'
                                style={{
                                    flex: 1,
                                    minWidth: "110px"
                                }}
                                onClick={(e) => { annulerModifier(e); setSpecialite({ title: "" }) }}
                            >
                                {t('parametresPage.annuler')}
                            </button>
                            {
                                !modifieClicked ?
                                    <button
                                        className='ajouter-btn'
                                        style={{
                                            flex: 1,
                                            minWidth: "110px"
                                        }}
                                        onClick={(e) => AddSpecialite(e)}
                                    >
                                        {t('parametresPage.ajouter')}
                                    </button>
                                    :
                                    <button
                                        className='ajouter-btn'
                                        style={{
                                            flex: 1,
                                            minWidth: "110px"
                                        }}
                                        onClick={(e) => { e.preventDefault(); setConfirmModifie(true) }}
                                    >
                                        Modifier
                                    </button>
                            }
                        </form>
                        <div className="specialites-table">
                            {
                                specialites.map((spec, index) => (
                                    <div
                                        className={`specilaite-line ${selectedSpecialite === index ? "selected" : ""}`}
                                        onClick={() => toggleSpecialite(index)}
                                    >
                                        <span style={{ fontSize: "0.9rem" }}>
                                            {spec.title}
                                        </span>
                                        <div className="line-btns">
                                            <button>
                                                <EditIcon
                                                    onClick={() => {
                                                        setSpecialite({ title: "" })
                                                        setModifySpecialite({ ...modifiedSpecialite, id: spec.id, title: spec.title, type: "exist", index: index });
                                                        setModifieClicked(true);
                                                    }
                                                    }
                                                />
                                                {t('enseignantsPage.modifieBtn')}
                                            </button>
                                            <button>
                                                <DeleteIcon
                                                    onClick={() => {
                                                        setDeletedSpecialite({ ...deletedSpecialite, id: spec.id, type: "exist", index: index })
                                                        setConfirmDelete(true)
                                                    }}
                                                />
                                                {t('enseignantsPage.deleteBtn')}
                                            </button>
                                        </div>
                                    </div>
                                ))
                            }
                            {
                                newSpecialites.map((spec, index) => (
                                    <div
                                        className={`specilaite-line ${selectedNewSpecialite === index ? "selected" : ""}`}
                                        onClick={() => toggleNewSpecialite(index)}
                                    >
                                        <span style={{ fontSize: "0.9rem" }}>
                                            {spec.title}
                                        </span>
                                        <div className="line-btns">
                                            <button>
                                                <EditIcon
                                                    onClick={() => {
                                                        setSpecialite({ title: "" })
                                                        setModifySpecialite({ ...modifiedSpecialite, id: "modify", title: spec.title, type: "no-exist" })
                                                        setModifieClicked(true)
                                                    }}
                                                />
                                                {t('enseignantsPage.modifieBtn')}
                                            </button>
                                            <button>
                                                <DeleteIcon
                                                    onClick={() => {
                                                        setDeletedSpecialite({ ...deletedSpecialite, id: "modify", type: "no-exist", index: index })
                                                        setConfirmDelete(true)
                                                    }}
                                                />
                                                {t('enseignantsPage.deleteBtn')}
                                            </button>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                </div>

            </div>
            <button
                className="enregistre-btn"
                style={{
                    right: isRtl ? "" : "20px",
                    left: isRtl ? "20px" : ""
                }}
                onClick={(e) => AddSpecialites(e)}
            >
                {t('parametresPage.enregistrer')}
            </button>
            {
                addSuccess &&
                <AddAlert addSuccess={() => setAddSuccess(false)} />
            }
            {
                confirmModifie &&
                <ModifierAlert annulerModifier={annulerModifier} handlemodifie={handlemodifie} />
            }
            {
                confirmDelete &&
                <DeleteAlert annulerDelete={annulerDelete} handleDelete={handleDelete} />
            }
        </div>
    )
}

export const Annees = () => {

    const { isRtl } = useContext(AppContext);

    const navigate = useNavigate();

    const [selectedAnnee, setSelectedAnnee] = useState(null);

    const toggleAnnee = (index) => {
        setSelectedNewAnnee(null)
        setSelectedAnnee(selectedAnnee === index ? null : index)
    }

    const [selectedNewAnnee, setSelectedNewAnnee] = useState(null);

    const toggleNewAnnee = (index) => {
        setSelectedAnnee(null)
        setSelectedNewAnnee(selectedNewAnnee === index ? null : index)
    }

    const { t } = useTranslation();

    const [annees, setAnnees] = useState([]);
    const [newAnnees, setNewAnnees] = useState([]);
    const [departements, setDepartements] = useState([])

    useEffect(() => {

        axios.get(`${process.env.REACT_APP_API_URL_SERVICE1}/annees/`)
            .then((res) => setAnnees(res.data))
            .catch((err) => {
                console.error("Erreur Axios :", err);
            })

        axios.get(`${process.env.REACT_APP_API_URL_SERVICE1}/departements/`)
            .then((res) => setDepartements(res.data))
            .catch((err) => {
                console.error("Erreur Axios :", err);
            })

    }, [])

    const [newAnne, setNewAnne] = useState({
        title: "",
        departement: 0,
        has_specialite: false
    });

    const AddAnnee = (e) => {
        e.preventDefault();
        if (!newAnne.title.trim()) {
            alert("Title cannot be empty");
            return;
        }
        console.log(newAnne.has_specialite)
        setNewAnnees(prev => [...prev, newAnne]);
        console.log(newAnnees)
        setNewAnne({ title: "", departement: 0 });
    }

    const [addSuccess, setAddSuccess] = useState(false)

    const [focusedInput, setFocusedInput] = useState(null)

    const AddAnnees = (e) => {
        e.preventDefault();
        axios.post(`${process.env.REACT_APP_API_URL_SERVICE1}/annees/`, newAnnees)
            .then((res) => {
                console.log(res.data)
                setAnnees(prev => [...prev, ...res.data]);
                setAddSuccess(true)
                setNewAnnees([])
            })
            .catch((err) => {
                console.error("Erreur Axios :", err);
            });
    }

    const [modifieddAnnee, setModifyAnnee] = useState({
        id: null,
        title: "",
        type: "unknown",
        departement: 0,
        index: 0,
        has_specialite: false
    });

    const handlemodifie = (e) => {
        e.preventDefault()
        if (modifieddAnnee.type === "exist") {
            axios.put(`${process.env.REACT_APP_API_URL_SERVICE1}/annees/${modifieddAnnee.id}/`, {
                id: modifieddAnnee.id,
                title: modifieddAnnee.title,
                departement: modifieddAnnee.departement,
                has_specialite: modifieddAnnee.has_specialite
            })
                .then(() => {
                    setAnnees(prevAnnees =>
                        prevAnnees.map(annee =>
                            annee.id === modifieddAnnee.id ? { ...annee, title: modifieddAnnee.title } : annee
                        )
                    );
                    alert("modifie avec succes")
                })
        } else {
            setNewAnnees(prevAnnees =>
                prevAnnees.map((annee, idx) =>
                    idx === modifieddAnnee.index ? { ...annee, title: modifieddAnnee.title, departement: modifieddAnnee } : annee
                )
            );
        }

        annulerModifier(e);
    }

    const [modifieClicked, setModifieClicked] = useState(false);
    const [confirmModifie, setConfirmModifie] = useState(false);

    const annulerModifier = (e) => {
        e.preventDefault();
        setModifieClicked(false);

        setModifyAnnee({
            id: null,
            title: "",
            type: "unknown",
            departement: 0,
            index: 0,
            has_specialite: false
        });

        setNewAnne({
            title: "",
            departement: 0,
            has_specialite: false
        });

        setConfirmModifie(false);
    };


    const [deletedAnnee, setDeletedAnnee] = useState({
        id: null,
        index: 0,
        type: ""
    })

    const [confirmDelete, setConfirmDelete] = useState(false);

    const handleDelete = (e) => {

        e.preventDefault();
        if (deletedAnnee.type === "exist") {
            axios.delete(`${process.env.REACT_APP_API_URL_SERVICE1}/annees/${deletedAnnee.id}/`)
                .then((res) => {
                    setAnnees(prevAnnees =>
                        prevAnnees.filter(dep => dep.id !== deletedAnnee.id)
                    )
                    alert("Année supprimé!")
                })
        } else {
            setNewAnnees(prevAnnees =>
                prevAnnees.filter((department, idx) => idx !== deletedAnnee.index)
            )
        }

        annulerDelete(e);

    }

    const annulerDelete = (e) => {
        e.preventDefault()
        setDeletedAnnee({
            id: null,
            type: "unknown",
            index: 0
        });
        setNewAnne({ title: "", departement: 0 })
        setConfirmDelete(false)
    }

     const handleLinkClick = (e) => {
        e.preventDefault();

        if (newAnnees.length !== 0) {
            const confirmLeave = window.confirm("Vous devez sauvegarder vos modifications. Voulez-vous vraiment quitter sans sauvegarder ?");
            if (confirmLeave) {
                navigate('/admin/scolarite');
            }
        } else {
            navigate('/admin/scolarite');
        }
    };

    return (
        <div className='annees-container'>
            <div className="annees-wrapper">
                <div className="title-line">
                    <h3 style={{ fontSize: "1.05rem", fontWeight: "400", color: "#727272", }}>
                        <Trans i18nKey={"parametresPage.departementLink"}>
                            Paramètres &gt; <Link to={'/admin/scolarite'} className='return-to-scolarite' onClick={handleLinkClick}> Paramètres Scolarité </Link>
                        </Trans>
                        <span style={{ color: "#925FE2" }}>{t('parametresPage.annees')}</span>
                    </h3>
                    <button className="precedent-btn" onClick={handleLinkClick}>
                        <CircleArrowIcon className={`${isRtl ? "rtl-icon" : ""}`} />
                        {t('parametresPage.precedent')}
                    </button>
                </div>
                <div
                    className="formAnne-container"
                    style={{
                        paddingLeft: isRtl ? "" : "1.5rem",
                        paddingRight: isRtl ? "1.5rem" : ""
                    }}
                >
                    <h1 style={{ fontSize: "1.85rem", color: "#000", fontWeight: "500" }}>
                        {t('parametresPage.anneesTitle')}
                    </h1>
                    <p style={{ color: "#5F5F5F", fontSize: "1.1rem", fontFamily: "Nunito, sans serif", width: "630px" }}>
                        {t('parametresPage.anneesRemark')}
                    </p>
                    <div className="form-table-container">
                        <form action="">
                            <input
                                type="text"
                                className='common-input'
                                style={{
                                    flex: "0 0 29%"
                                }}
                                placeholder={t('parametresPage.anneeInputPlaceholder')}
                                value={modifieddAnnee.id !== null ? modifieddAnnee.title : newAnne.title}
                                onChange={(e) => {
                                    if (modifieddAnnee?.id !== null) {
                                        setModifyAnnee({ ...modifieddAnnee, title: e.target.value });
                                    } else {
                                        setNewAnne({ ...newAnne, title: e.target.value });
                                    }
                                }}
                                required
                            />
                            <div
                                className="select-scolarite-line common-input"
                                style={{
                                    flex: 1,
                                    border: focusedInput === "departement" ? "2px solid #A277F0" : "2px solid #D9E1E7"
                                }}

                            >
                                <select
                                    type="text"
                                    className='select-input'
                                    onFocus={() => setFocusedInput("departement")}
                                    onBlur={() => setFocusedInput(null)}
                                    value={modifieddAnnee.id !== null ? modifieddAnnee.departement : newAnne.departement}
                                    onChange={(e) => {
                                        if (modifieddAnnee?.id !== null) {
                                            setModifyAnnee({ ...modifieddAnnee, departement: parseInt(e.target.value) });
                                        } else {
                                            setNewAnne({ ...newAnne, departement: parseInt(e.target.value) });
                                        }
                                    }}
                                >
                                    <option value="default">Département</option>
                                    {
                                        departements.map((dep) => (
                                            <option value={dep.id}>{dep.title}</option>
                                        ))
                                    }
                                </select>
                                <svg
                                    width="10"
                                    height="6"
                                    viewBox="0 0 10 6"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"

                                >
                                    <path d="M4.99929 4.18863L8.77899 0.220677C8.91347 0.0793351 9.09533 0 9.28493 0C9.47453 0 9.65649 0.0793351 9.79097 0.220677C9.85721 0.290046 9.90976 0.372607 9.94565 0.463596C9.98153 0.554585 10 0.652194 10 0.750779C10 0.849365 9.98153 0.946974 9.94565 1.03796C9.90976 1.12895 9.85721 1.21152 9.79097 1.28089L5.50595 5.77932C5.37147 5.92066 5.1896 6 5 6C4.8104 6 4.62853 5.92066 4.49405 5.77932L0.209032 1.28089C0.14279 1.21152 0.0902398 1.12895 0.0543536 1.03796C0.0184674 0.946974 0 0.849365 0 0.750779C0 0.652194 0.0184674 0.554585 0.0543536 0.463596C0.0902398 0.372607 0.14279 0.290046 0.209032 0.220677C0.343604 0.0795203 0.525523 0.000314919 0.715067 0.000314919C0.904612 0.000314919 1.08644 0.0795203 1.22101 0.220677L4.99929 4.18863Z" fill="#8A8A8A" />
                                </svg>
                            </div>
                            <div
                                type="text"
                                className='common-input'
                                style={{
                                    flex: "0 0 25%",
                                    display: "flex",
                                    alignItems: 'center',
                                    gap: "9px"
                                }}
                            >
                                <input
                                    type="checkbox"
                                    key={modifieddAnnee.id !== null ? modifieddAnnee.has_specialite : newAnne.has_specialite}  // Utiliser `key` pour forcer un rerender
                                    checked={modifieddAnnee.id !== null ? modifieddAnnee.has_specialite : newAnne.has_specialite}
                                    onChange={(e) => {
                                        if (modifieddAnnee?.id !== null) {
                                            setModifyAnnee({ ...modifieddAnnee, has_specialite: e.target.checked });
                                        } else {
                                            setNewAnne({ ...newAnne, has_specialite: e.target.checked });
                                        }
                                    }}
                                    style={{
                                        width: "20px",
                                        height: "20px"
                                    }}
                                    required
                                />

                                <label style={{ fontSize: "0.9rem", fontFamily: "Kumbh Sans, sans-serif", color: "#8A8A8A" }}>Année avec spécialités ?</label>
                            </div>
                            <button
                                className='annuler-button'
                                style={{
                                    flex: 1,
                                    minWidth: "110px"
                                }}
                                onClick={(e) => { annulerModifier(e); setNewAnne({ title: "", departement: 0 }) }}
                            >
                                {t('parametresPage.annuler')}
                            </button>
                            {
                                !modifieClicked ?
                                    <button
                                        className='ajouter-btn'
                                        style={{
                                            flex: 1,
                                            minWidth: "110px"
                                        }}
                                        onClick={(e) => AddAnnee(e)}
                                    >
                                        {t('parametresPage.ajouter')}
                                    </button>
                                    :
                                    <button
                                        className='ajouter-btn'
                                        style={{
                                            flex: 1,
                                            minWidth: "110px"
                                        }}
                                        onClick={(e) => { e.preventDefault(); setConfirmModifie(true) }}
                                    >
                                        Modifier
                                    </button>
                            }
                        </form>
                        <div className="annees-table">
                            {
                                annees.map((annee, index) => (
                                    <div
                                        className={`annee-line ${selectedAnnee === index ? "selected" : ""}`}
                                        onClick={() => toggleAnnee(index)}
                                    >
                                        <span style={{ fontSize: "0.9rem", flex: "0 0 28%" }}>
                                            {annee.title}
                                        </span>
                                        <span style={{ fontSize: "0.9rem", textIndent: "0.5rem", flex: "0 0 20%" }}>
                                            {
                                                departements.find(dep => dep.id === annee.departement)?.title || "Département inconnu"
                                            }
                                        </span>
                                        <span style={{ fontSize: "0.9rem", flex: 1, textIndent: "0.5rem" }}>
                                            {
                                                annee.has_specialite ? "Oui" : "Non"
                                            }
                                        </span>
                                        <div className="line-btns">
                                            <button
                                                onClick={() => {
                                                    setNewAnne({ title: "", departement: 0 })
                                                    setModifyAnnee({ ...modifieddAnnee, id: annee.id, title: annee.title, type: "exist", index: index, departement: annee.departement, has_specialite: annee.has_specialite });
                                                    setModifieClicked(true);
                                                }}
                                            >
                                                <EditIcon />
                                                {t('enseignantsPage.modifieBtn')}
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setDeletedAnnee({ ...deletedAnnee, id: annee.id, type: "exist", index: index })
                                                    setConfirmDelete(true)
                                                }}
                                            >
                                                <DeleteIcon />
                                                {t('enseignantsPage.deleteBtn')}
                                            </button>
                                        </div>
                                    </div>
                                ))
                            }
                            {
                                newAnnees.map((annee, index) => (
                                    <div
                                        className={`annee-line ${selectedNewAnnee === index ? "selected" : ""}`}
                                        onClick={() => toggleNewAnnee(index)}
                                    >
                                        <span style={{ fontSize: "0.9rem", flex: "0 0 28%" }}>
                                            {annee.title}
                                        </span>
                                        <span style={{ fontSize: "0.9rem", textIndent: "0.5rem", flex: "0 0 20%" }}>
                                            {
                                                departements.find(dep => dep.id === annee.departement)?.title || "Département inconnu"
                                            }
                                        </span>
                                        <span style={{ fontSize: "0.9rem", flex: 1, textIndent: "0.5rem" }}>
                                            {
                                                annee.has_specialite ? "Oui" : "Non"
                                            }
                                        </span>
                                        <div className="line-btns">
                                            <button
                                                onClick={() => {
                                                    setNewAnne({ title: "", departement: 0 })
                                                    setModifyAnnee({ ...modifieddAnnee, id: "modify", title: annee.title, type: "no-exist", index: index, departement: annee.departement, has_specialite: annee.has_specialite });
                                                    setModifieClicked(true);
                                                }}
                                            >
                                                <EditIcon />
                                                {t('enseignantsPage.modifieBtn')}
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setDeletedAnnee({ ...deletedAnnee, id: "delete", type: "no-exist", index: index })
                                                    setConfirmDelete(true)
                                                }}
                                            >
                                                <DeleteIcon />
                                                {t('enseignantsPage.deleteBtn')}
                                            </button>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                </div>

            </div>
            <button
                className="enregistre-btn"
                style={{
                    right: isRtl ? "" : "20px",
                    left: isRtl ? "20px" : ""
                }}
                onClick={(e) => AddAnnees(e)}
            >
                {t('parametresPage.enregistrer')}
            </button>
            {
                addSuccess &&
                <AddAlert addSuccess={() => setAddSuccess(false)} />
            }
            {
                confirmModifie &&
                <ModifierAlert annulerModifier={annulerModifier} handlemodifie={handlemodifie} />
            }
            {
                confirmDelete &&
                <DeleteAlert annulerDelete={annulerDelete} handleDelete={handleDelete} />
            }
        </div>
    )
}

export const ParametresGroupe = () => {

    const { isRtl } = useContext(AppContext);

    const navigate = useNavigate();

    const [selectedSalle, setSelectedSalle] = useState(null);

    const toggleSalle = (index) => {
        setSelectedNewParametre(null)
        setSelectedSalle(selectedSalle === index ? null : index)
    }

    const [selectedNewParametre, setSelectedNewParametre] = useState(null);

    const toggleNewParametre = (index) => {
        setSelectedSalle(null)
        setSelectedNewParametre(selectedNewParametre === index ? null : index)
    }

    const [focusedInput, setFocusedInput] = useState(null);

    const { t } = useTranslation();

    const [parametres, setParametres] = useState([]);
    const [newParametres, setNewParametres] = useState([]);
    const [annees, setAnnees] = useState([])

    useEffect(() => {

        axios.get(`${process.env.REACT_APP_API_URL_SERVICE1}/parametre_groups/`)
            .then((res) => setParametres(res.data))
            .catch((err) => {
                console.error("Erreur Axios :", err);
            })

        axios.get(`${process.env.REACT_APP_API_URL_SERVICE1}/annees/`)
            .then((res) => setAnnees(res.data))
            .catch((err) => {
                console.error("Erreur Axios :", err);
            })

    }, [])

    const [newParametre, setNewParametre] = useState({
        annee: 0,
        type: null,
        nbr_min: "",
        nbr_max: "",
    });

    const AddParametre = (e) => {
        e.preventDefault();
        setNewParametres(prev => [...prev, newParametre]);
        setNewParametre({
            annee: 0,
            type: null,
            nbr_min: "",
            nbr_max: "",
        });
    }

    const [addSuccess, setAddSuccess] = useState(false)

    const AddParametres = (e) => {
        e.preventDefault();
        axios.post(`${process.env.REACT_APP_API_URL_SERVICE1}/parametre_groups/`, newParametres)
            .then((res) => {
                console.log(res.data)
                setParametres(prev => [...prev, ...res.data]);
                setAddSuccess(true)
                setNewParametres([])
            })
            .catch((err) => {
                console.error("Erreur Axios :", err);
                if (err.response) {
                    // Print detailed error from Django REST Framework
                    console.error("Server responded with error:", err.response.data);
                    alert("Erreur serveur : " + JSON.stringify(err.response.data, null, 2));
                } else if (err.request) {
                    console.error("No response received from server:", err.request);
                } else {
                    console.error("Error setting up request:", err.message);
                }
            });
    }

    const [modifiedParametre, setModifyParametre] = useState({
        id: null,
        annee: 0,
        type: null,
        nbr_min: "",
        nbr_max: "",
        type1: "unknown",
        index: 0
    });

    const handlemodifie = (e) => {
        e.preventDefault()
        if (modifiedParametre.type1 === "exist") {
            axios.put(`${process.env.REACT_APP_API_URL_SERVICE1}/parametre_groups/${modifiedParametre.id}/`, {
                id: modifiedParametre.id,
                type: modifiedParametre.type,
                nbr_min: modifiedParametre.nbr_min,
                nbr_max: modifiedParametre.nbr_max,
                annee: modifiedParametre.annee,
                nom_salle: modifiedParametre.nom_salle
            })
                .then(() => {
                    setParametres(prevParams =>
                        prevParams.map(par =>
                            par.id === modifiedParametre.id
                                ? {
                                    ...par,
                                    type: modifiedParametre.type,
                                    annee: modifiedParametre.annee,
                                    nbr_min: modifiedParametre.nbr_min,
                                    nbr_min: modifiedParametre.nbr_min,
                                }
                                : par
                        )
                    );

                    alert("modifie avec succes")
                })
        } else {
            setNewParametres(prevParams =>
                prevParams.map((param, idx) =>
                    idx === modifiedParametre.index ? {
                        ...param,
                        annee: modifiedParametre.annee,
                        type: modifiedParametre.type,
                        nbr_min: modifiedParametre.nbr_min,
                        nbr_max: modifiedParametre.nbr_max
                    } : param
                )
            );
        }

        annulerModifier(e);
    }

    const [modifieClicked, setModifieClicked] = useState(false);
    const [confirmModifie, setConfirmModifie] = useState(false);

    const annulerModifier = (e) => {
        e.preventDefault()
        setModifieClicked(false);
        setModifyParametre({
            id: null,
            annee: 0,
            type: null,
            nbr_min: "",
            nbr_max: "",
            type1: "unknown",
            index: 0
        });
        setNewParametre({
            annee: 0,
            type: null,
            nbr_min: "",
            nbr_max: "",
        })
        setConfirmModifie(false)
    }

    const [deletedSalle, setDeletedSalle] = useState({
        id: null,
        index: 0,
        type: ""
    })

    const [confirmDelete, setConfirmDelete] = useState(false);

    const handleDelete = (e) => {

        e.preventDefault();
        if (deletedSalle.type === "exist") {
            axios.delete(`${process.env.REACT_APP_API_URL_SERVICE1}/parametre_groups/${deletedSalle.id}/`)
                .then((res) => {
                    setParametres(prevSalles =>
                        prevSalles.filter(salle => salle.id !== deletedSalle.id)
                    )
                    alert("departement supprimé!")
                })
        } else {
            setNewParametres(prevSalles =>
                prevSalles.filter((salle, idx) => idx !== deletedSalle.index)
            )
        }

        annulerDelete(e);

    }

    const annulerDelete = (e) => {
        e.preventDefault()
        setDeletedSalle({
            id: null,
            type: "unknown",
            index: 0
        });
        setNewParametre({
            annee: "",
            type: null,
            nbr_min: "",
            nbr_max: "",
        })
        setConfirmDelete(false)
    }

    const modifieSalle = (salle, type, id, index) => {
        setModifyParametre({
            id: id,
            annee: salle.annee,
            type: salle.type,
            nbr_min: salle.nbr_min,
            nbr_max: salle.nbr_max,
            type1: type,
            index: index
        })
    }

    const handleAnnuler = (e) => {
        annulerModifier(e);
        setNewParametre({
            annee: 0,
            type: null,
            nbr_min: "",
            nbr_max: "",
        })
    }

    const [disabeledSelect, setDisabeled] = useState(true)

    const handleDisable = (annee) => {
        const target = `${annees.find(an => an.id === annee)?.title} ${annees.find(an => an.id === annee)?.departement_title.toLowerCase() === "préparatoire" ? "CPI" : "CS"}`
        setDisabeled(target === "3 CS" ? false : true)
    }

     const handleLinkClick = (e) => {
        e.preventDefault();

        if (newParametres.length !== 0) {
            const confirmLeave = window.confirm("Vous devez sauvegarder vos modifications. Voulez-vous vraiment quitter sans sauvegarder ?");
            if (confirmLeave) {
                navigate('/admin/scolarite');
            }
        } else {
            navigate('/admin/scolarite');
        }
    };

    return (
        <div className="salles-container">
            <div className="salles-wrapper">
                <div className="title-line">
                    <h3 style={{ fontSize: "1.05rem", fontWeight: "400", color: "#727272", }}>
                        <Trans i18nKey={"parametresPage.departementLink"}>
                            Paramètres &gt; <Link to={'/admin/scolarite'} className='return-to-scolarite' onClick={handleLinkClick}> Paramètres Scolarité </Link>
                        </Trans>
                        <span style={{ color: "#925FE2" }}>Paramètres Groupe</span>
                    </h3>
                    <button className="precedent-btn" onClick={handleLinkClick}>
                        <CircleArrowIcon className={`${isRtl ? "rtl-icon" : ""}`} />
                        {t('parametresPage.precedent')}
                    </button>
                </div>
                <div
                    className="formSall-container"
                    style={{
                        paddingLeft: isRtl ? "" : "1.5rem",
                        paddingRight: isRtl ? "1.5rem" : ""
                    }}
                >
                    <h1 style={{ fontSize: "1.85rem", color: "#000", fontWeight: "500" }}>
                        Les Paramètres des Groupes
                    </h1>
                    <p style={{ color: "#5F5F5F", fontSize: "1.1rem", fontFamily: "Nunito, sans serif", width: "600px" }}>
                        Ajoutez, supprimez ou modifiez les paramètres des groupes en toute simplicité.
                    </p>
                    <div
                        className="form-table-container"
                        style={{
                            paddingRight: isRtl ? "" : "1.5rem",
                            paddingLeft: isRtl ? "1.5rem" : ""
                        }}
                    >
                        <form action="" style={{ flexWrap: "nowrap" }}>
                            <div
                                className="select-scolarite-line common-input"
                                style={{
                                    flex: 1,
                                    border: focusedInput === "departement" ? "2px solid #A277F0" : "2px solid #D9E1E7"
                                }}

                            >
                                <select
                                    type="text"
                                    className='select-input'
                                    onFocus={() => setFocusedInput("departement")}
                                    onBlur={() => setFocusedInput(null)}
                                    value={modifiedParametre.id !== null ? modifiedParametre.annee : newParametre.annee}
                                    onChange={(e) => {
                                        if (modifiedParametre?.id !== null) {
                                            setModifyParametre({ ...modifiedParametre, annee: parseInt(e.target.value) });
                                        } else {
                                            setNewParametre({ ...newParametre, annee: parseInt(e.target.value) });
                                        }
                                        handleDisable(parseInt(e.target.value))
                                    }}
                                >
                                    <option value="default">Année</option>
                                    {
                                        annees.map((annee) => (
                                            <option value={annee.id} style={{ padding: "0 6px" }}>
                                                {`${annee.title} ${annee.departement_title.toLowerCase() === "préparatoire" ? "CPI" : "CS"}`}
                                            </option>
                                        ))
                                    }
                                </select>
                                <svg
                                    width="10"
                                    height="6"
                                    viewBox="0 0 10 6"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"

                                >
                                    <path d="M4.99929 4.18863L8.77899 0.220677C8.91347 0.0793351 9.09533 0 9.28493 0C9.47453 0 9.65649 0.0793351 9.79097 0.220677C9.85721 0.290046 9.90976 0.372607 9.94565 0.463596C9.98153 0.554585 10 0.652194 10 0.750779C10 0.849365 9.98153 0.946974 9.94565 1.03796C9.90976 1.12895 9.85721 1.21152 9.79097 1.28089L5.50595 5.77932C5.37147 5.92066 5.1896 6 5 6C4.8104 6 4.62853 5.92066 4.49405 5.77932L0.209032 1.28089C0.14279 1.21152 0.0902398 1.12895 0.0543536 1.03796C0.0184674 0.946974 0 0.849365 0 0.750779C0 0.652194 0.0184674 0.554585 0.0543536 0.463596C0.0902398 0.372607 0.14279 0.290046 0.209032 0.220677C0.343604 0.0795203 0.525523 0.000314919 0.715067 0.000314919C0.904612 0.000314919 1.08644 0.0795203 1.22101 0.220677L4.99929 4.18863Z" fill="#8A8A8A" />
                                </svg>
                            </div>
                            <div
                                className="select-scolarite-line common-input"
                                style={{
                                    flex: 1,
                                    border: focusedInput === "type" ? "2px solid #A277F0" : "2px solid #D9E1E7"
                                }}

                            >
                                <select
                                    type="text"
                                    className='select-input'
                                    disabled={disabeledSelect}
                                    onFocus={() => setFocusedInput("type")}
                                    onBlur={() => setFocusedInput(null)}
                                    value={modifiedParametre.id !== null ? modifiedParametre.type : newParametre.type}
                                    onChange={(e) => {
                                        if (modifiedParametre?.id !== null) {
                                            setModifyParametre({ ...modifiedParametre, type: e.target.value });
                                        } else {
                                            setNewParametre({ ...newParametre, type: e.target.value });
                                        }
                                    }}

                                >
                                    <option value="default">Type</option>
                                    <option value="startup">Startup</option>
                                    <option value="binome">Binôme</option>
                                    <option value="monome">Monôme</option>
                                </select>
                                <svg
                                    width="10"
                                    height="6"
                                    viewBox="0 0 10 6"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"

                                >
                                    <path d="M4.99929 4.18863L8.77899 0.220677C8.91347 0.0793351 9.09533 0 9.28493 0C9.47453 0 9.65649 0.0793351 9.79097 0.220677C9.85721 0.290046 9.90976 0.372607 9.94565 0.463596C9.98153 0.554585 10 0.652194 10 0.750779C10 0.849365 9.98153 0.946974 9.94565 1.03796C9.90976 1.12895 9.85721 1.21152 9.79097 1.28089L5.50595 5.77932C5.37147 5.92066 5.1896 6 5 6C4.8104 6 4.62853 5.92066 4.49405 5.77932L0.209032 1.28089C0.14279 1.21152 0.0902398 1.12895 0.0543536 1.03796C0.0184674 0.946974 0 0.849365 0 0.750779C0 0.652194 0.0184674 0.554585 0.0543536 0.463596C0.0902398 0.372607 0.14279 0.290046 0.209032 0.220677C0.343604 0.0795203 0.525523 0.000314919 0.715067 0.000314919C0.904612 0.000314919 1.08644 0.0795203 1.22101 0.220677L4.99929 4.18863Z" fill="#8A8A8A" />
                                </svg>
                            </div>
                            <input
                                type="number"
                                className='common-input'
                                style={{ flex: 1, boxSizing: "border-box" }}
                                placeholder="Nombre minimum de membres du groupe"
                                min={1}
                                onFocus={() => setFocusedInput("nom")}
                                onBlur={() => setFocusedInput(null)}
                                value={modifiedParametre.id !== null ? modifiedParametre.nbr_min : newParametre.nbr_min}
                                onChange={(e) => {
                                    if (modifiedParametre?.id !== null) {
                                        setModifyParametre({ ...modifiedParametre, nbr_min: parseInt(e.target.value) });
                                    } else {
                                        setNewParametre({ ...newParametre, nbr_min: parseInt(e.target.value) });
                                    }
                                }}
                            />
                            <input
                                type="number"
                                className='common-input'
                                style={{ flex: 1, boxSizing: "border-box" }}
                                placeholder="Nombre maximum de membres du groupe"
                                min={1}
                                onFocus={() => setFocusedInput("max")}
                                onBlur={() => setFocusedInput(null)}
                                value={modifiedParametre.id !== null ? modifiedParametre.nbr_max : newParametre.nbr_max}
                                onChange={(e) => {
                                    if (modifiedParametre?.id !== null) {
                                        setModifyParametre({ ...modifiedParametre, nbr_max: parseInt(e.target.value) });
                                    } else {
                                        setNewParametre({ ...newParametre, nbr_max: parseInt(e.target.value) });
                                    }
                                }}
                            />
                            <button
                                className='annuler-button'
                                style={{ flex: "0 0 12%", minWidth: "100px" }}
                                onClick={(e) => handleAnnuler(e)}
                            >
                                {t('parametresPage.annuler')}
                            </button>
                            {
                                !modifieClicked ?
                                    <button
                                        className='ajouter-btn'
                                        style={{
                                            flex: 1,
                                            minWidth: "110px"
                                        }}
                                        onClick={(e) => AddParametre(e)}
                                    >
                                        {t('parametresPage.ajouter')}
                                    </button>
                                    :
                                    <button
                                        className='ajouter-btn'
                                        style={{
                                            flex: 1,
                                            minWidth: "110px"
                                        }}
                                        onClick={(e) => { e.preventDefault(); setConfirmModifie(true) }}
                                    >
                                        Modifier
                                    </button>
                            }
                        </form>
                        <div className="salles-table">
                            {
                                parametres.map((salle, index) => (
                                    <div
                                        className={`salle-line ${selectedSalle === index ? "selected" : ""}`}
                                        onClick={() => toggleSalle(index)}

                                    >
                                        <span
                                            style={{ flex: "0 0 16%", fontSize: "0.9rem" }}
                                        >
                                            {
                                                `${annees.find(dep => dep.id === salle.annee)?.title} ${annees.find(dep => dep.id === salle.annee)?.departement_title.toLowerCase() === "préparatoire" ? "CPI" : "CS"}` || "Annee inconnu"}
                                        </span>
                                        <span style={{ fontSize: "0.9rem", flex: 1, textIndent: "1.5rem", }}>
                                            {salle.type ? salle.type : "Aucun"}
                                        </span>
                                        <span style={{ fontSize: "0.9rem", flex: 1, textIndent: "1.5rem", }}>
                                            {salle.nbr_min}
                                        </span>
                                        <span style={{ fontSize: "0.9rem", flex: 1, textIndent: "1.5rem", }}>
                                            {salle.nbr_max}
                                        </span>
                                        <div className="line-btns">
                                            <button
                                                onClick={() => {
                                                    setModifyParametre({
                                                        annee: 0,
                                                        type: null,
                                                        nbr_min: 0,
                                                        nbr_max: 0,
                                                    })
                                                    modifieSalle(salle, "exist", salle.id, index)
                                                    setModifieClicked(true);
                                                }
                                                }
                                            >
                                                <EditIcon />
                                                {t('enseignantsPage.modifieBtn')}
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setDeletedSalle({ ...deletedSalle, id: salle.id, type: "exist", index: index })
                                                    setConfirmDelete(true)
                                                }}
                                            >
                                                <DeleteIcon />
                                                {t('enseignantsPage.deleteBtn')}
                                            </button>
                                        </div>
                                    </div>
                                ))
                            }
                            {
                                newParametres.map((salle, index) => (
                                    <div
                                        className={`salle-line ${selectedNewParametre === index ? "selected" : ""}`}
                                        onClick={() => toggleNewParametre(index)}

                                    >
                                        <span
                                            style={{ flex: "0 0 16%", fontSize: "0.9rem" }}
                                        >
                                            {
                                                `${annees.find(dep => dep.id === salle.annee)?.title} ${annees.find(dep => dep.id === salle.annee)?.departement_title.toLowerCase() === "préparatoire" ? "CPI" : "CS"}` || "Annee inconnu"
                                            }
                                        </span>
                                        <span style={{ fontSize: "0.9rem", flex: 1, textIndent: "1.5rem", }}>
                                            {salle.type ? salle.type : "Aucun"}
                                        </span>
                                        <span style={{ fontSize: "0.9rem", flex: 1, textIndent: "1.5rem", }}>
                                            {salle.nbr_min}
                                        </span>
                                        <span style={{ fontSize: "0.9rem", flex: 1, textIndent: "1.5rem", }}>
                                            {salle.nbr_max}
                                        </span>
                                        <div className="line-btns">
                                            <button
                                                onClick={() => {
                                                    setNewParametre({
                                                        annee: 0,
                                                        type: null,
                                                        nbr_min: 0,
                                                        nbr_max: 0,
                                                    })
                                                    modifieSalle(salle, "no-exist", "modify", index)
                                                    setModifieClicked(true);
                                                }
                                                }
                                            >
                                                <EditIcon />
                                                {t('enseignantsPage.modifieBtn')}
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setDeletedSalle({ ...deletedSalle, id: "modify", type: "no-exist", index: index })
                                                    setConfirmDelete(true)
                                                }}>
                                                <DeleteIcon />
                                                {t('enseignantsPage.deleteBtn')}
                                            </button>
                                        </div>
                                    </div>
                                ))
                            }

                        </div>
                    </div>
                </div>
            </div>
            <button
                className="enregistre-btn"
                style={{
                    right: isRtl ? "" : "20px",
                    left: isRtl ? "20px" : ""
                }}
                onClick={(e) => AddParametres(e)}
            >
                {t('parametresPage.enregistrer')}
            </button>
            {
                addSuccess &&
                <AddAlert addSuccess={() => setAddSuccess(false)} />
            }
            {
                confirmModifie &&
                <ModifierAlert annulerModifier={annulerModifier} handlemodifie={handlemodifie} />
            }
            {
                confirmDelete &&
                <DeleteAlert annulerDelete={annulerDelete} handleDelete={handleDelete} />
            }
        </div>
    )
}

export const Periodes = () => {

    const { isRtl } = useContext(AppContext);

    const navigate = useNavigate();

    const [selectedAnnee, setSelectedAnnee] = useState(null);

    const toggleAnnee = (index) => {
        setSelectedNewPeriode(null)
        setSelectedAnnee(selectedAnnee === index ? null : index)
    }

    const [selectedNewPeriode, setSelectedNewPeriode] = useState(null);

    const toggleNewPeriode = (index) => {
        setSelectedAnnee(null)
        setSelectedNewPeriode(selectedNewPeriode === index ? null : index)
    }

    const { t } = useTranslation();

    const [periodes, setPeriodes] = useState([]);
    const [newPeriodes, setNewPeriodes] = useState([]);

    useEffect(() => {

        axios.get(`${process.env.REACT_APP_API_URL_SERVICE1}/periodes/`)
            .then((res) => setPeriodes(res.data))
            .catch((err) => {
                console.error("Erreur Axios :", err);
            })

    }, [])

    const [newPeriode, setNewPeriode] = useState({
        type: "",
        date_debut: "",
        date_fin: ""
    });

    const AddPeriode = (e) => {
        e.preventDefault();
        setNewPeriodes(prev => [...prev, newPeriode]);
        setNewPeriode({
            type: "",
            date_debut: "",
            date_fin: ""
        });
    }

    const [addSuccess, setAddSuccess] = useState(false)

    const [focusedInput, setFocusedInput] = useState(null)

    const AddPeriodes = (e) => {
        e.preventDefault();
        axios.post(`${process.env.REACT_APP_API_URL_SERVICE1}/periodes/`, newPeriodes)
            .then((res) => {
                setPeriodes(prev => [...prev, ...res.data]);
                setAddSuccess(true)
                setNewPeriodes([])
            })
            .catch((err) => {
                console.error("Erreur Axios :", err);
            });
    }

    const [modifiedPeriode, setModifyPeriode] = useState({
        id: null,
        index: 0,
        type1: "unknown",
        type: "",
        date_debut: "",
        date_fin: ""
    });

    const handlemodifie = (e) => {
        e.preventDefault()
        if (modifiedPeriode.type1 === "exist") {
            axios.put(`${process.env.REACT_APP_API_URL_SERVICE1}/periodes/${modifiedPeriode.id}/`, {
                id: modifiedPeriode.id,
                type: modifiedPeriode.type,
                date_debut: modifiedPeriode.date_debut,
                date_fin: modifiedPeriode.date_fin
            })
                .then(() => {
                    setPeriodes(prevAnnees =>
                        prevAnnees.map(per =>
                            per.id === modifiedPeriode.id ? {
                                ...per,
                                type: modifiedPeriode.type,
                                date_debut: modifiedPeriode.date_debut,
                                date_fin: modifiedPeriode.date_fin
                            } : per
                        )
                    );
                    alert("modifie avec succes")
                })
        } else {
            setNewPeriodes(prevPeriodes =>
                prevPeriodes.map((per, idx) =>
                    idx === modifiedPeriode.index ? {
                        ...per,
                        type: modifiedPeriode.type,
                        date_debut: modifiedPeriode.date_debut,
                        date_fin: modifiedPeriode.date_fin
                    } : per
                )
            );
        }

        annulerModifier(e);
    }

    const [modifieClicked, setModifieClicked] = useState(false);
    const [confirmModifie, setConfirmModifie] = useState(false);

    const annulerModifier = (e) => {
        e.preventDefault();
        setModifieClicked(false);

        setModifyPeriode({
            id: null,
            index: 0,
            type1: "unknown",
            type: "",
            date_debut: "",
            date_fin: ""
        });

        setNewPeriode({
            type: "",
            date_debut: "",
            date_fin: ""
        });

        setConfirmModifie(false);
    };


    const [deletedAnnee, setDeletedAnnee] = useState({
        id: null,
        index: 0,
        type: ""
    })

    const [confirmDelete, setConfirmDelete] = useState(false);

    const handleDelete = (e) => {

        e.preventDefault();
        if (deletedAnnee.type === "exist") {
            axios.delete(`${process.env.REACT_APP_API_URL_SERVICE1}/periodes/${deletedAnnee.id}/`)
                .then((res) => {
                    setPeriodes(prevAnnees =>
                        prevAnnees.filter(dep => dep.id !== deletedAnnee.id)
                    )
                    alert("Année supprimé!")
                })
        } else {
            setNewPeriodes(prevAnnees =>
                prevAnnees.filter((department, idx) => idx !== deletedAnnee.index)
            )
        }

        annulerDelete(e);

    }

    const annulerDelete = (e) => {
        e.preventDefault()
        setDeletedAnnee({
            id: null,
            type: "unknown",
            index: 0
        });
        setNewPeriode({
            type: "",
            date_debut: "",
            date_fin: ""
        })
        setConfirmDelete(false)
    }

    const [showPlaceholder, setShowPlaceholder] = useState(true);
    const [showPlaceholder1, setShowPlaceholder1] = useState(true);

    return (
        <div className='annees-container'>
            <div className="annees-wrapper">
                <div className="title-line">
                    <h3 style={{ fontSize: "1.05rem", fontWeight: "400", color: "#727272", }}>
                        <Trans i18nKey={"parametresPage.departementLink"}>
                            Paramètres &gt; <Link to={'/admin/scolarite'} className='return-to-scolarite'> Paramètres Scolarité </Link>
                        </Trans>
                        <span style={{ color: "#925FE2" }}>Périodes</span>
                    </h3>
                    <button className="precedent-btn" onClick={() => navigate('/admin/scolarite')}>
                        <CircleArrowIcon className={`${isRtl ? "rtl-icon" : ""}`} />
                        {t('parametresPage.precedent')}
                    </button>
                </div>
                <div
                    className="formAnne-container"
                    style={{
                        paddingLeft: isRtl ? "" : "1.5rem",
                        paddingRight: isRtl ? "1.5rem" : ""
                    }}
                >
                    <h1 style={{ fontSize: "1.85rem", color: "#000", fontWeight: "500" }}>
                        Les Périodes
                    </h1>
                    <p style={{ color: "#5F5F5F", fontSize: "1.1rem", fontFamily: "Nunito, sans serif", width: "630px" }}>
                        Ajoutez, supprimez ou modifiez les périodes de Dépôt des Thèmes et Soutenances en toute simplicité.
                    </p>
                    <div className="form-table-container">
                        <form action="">
                            <div
                                className="select-scolarite-line common-input"
                                style={{
                                    flex: 1,
                                    border: focusedInput === "departement" ? "2px solid #A277F0" : "2px solid #D9E1E7"
                                }}

                            >
                                <select
                                    type="text"
                                    className='select-input'
                                    onFocus={() => setFocusedInput("departement")}
                                    onBlur={() => setFocusedInput(null)}
                                    value={modifiedPeriode.id !== null ? modifiedPeriode.type : newPeriode.type}
                                    onChange={(e) => {
                                        if (modifiedPeriode?.id !== null) {
                                            setModifyPeriode({ ...modifiedPeriode, type: e.target.value });
                                        } else {
                                            setNewPeriode({ ...newPeriode, type: e.target.value });
                                        }
                                    }}
                                >
                                    <option value="default">Type</option>
                                    <option value="depot_theme">Dépôt des Thèmes</option>
                                    <option value="soutenance">Soutenance</option>
                                </select>
                                <svg
                                    width="10"
                                    height="6"
                                    viewBox="0 0 10 6"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"

                                >
                                    <path d="M4.99929 4.18863L8.77899 0.220677C8.91347 0.0793351 9.09533 0 9.28493 0C9.47453 0 9.65649 0.0793351 9.79097 0.220677C9.85721 0.290046 9.90976 0.372607 9.94565 0.463596C9.98153 0.554585 10 0.652194 10 0.750779C10 0.849365 9.98153 0.946974 9.94565 1.03796C9.90976 1.12895 9.85721 1.21152 9.79097 1.28089L5.50595 5.77932C5.37147 5.92066 5.1896 6 5 6C4.8104 6 4.62853 5.92066 4.49405 5.77932L0.209032 1.28089C0.14279 1.21152 0.0902398 1.12895 0.0543536 1.03796C0.0184674 0.946974 0 0.849365 0 0.750779C0 0.652194 0.0184674 0.554585 0.0543536 0.463596C0.0902398 0.372607 0.14279 0.290046 0.209032 0.220677C0.343604 0.0795203 0.525523 0.000314919 0.715067 0.000314919C0.904612 0.000314919 1.08644 0.0795203 1.22101 0.220677L4.99929 4.18863Z" fill="#8A8A8A" />
                                </svg>
                            </div>
                            <div style={{ position: "relative", flex: "0 0 25%" }}>
                                <input
                                    type="date"
                                    className="common-input"
                                    style={{
                                        width: "100%",
                                        color: showPlaceholder ? "transparent" : "inherit",
                                    }}
                                    value={modifiedPeriode.id !== null ? modifiedPeriode.date_debut : newPeriode.date_debut}
                                    onChange={(e) => {
                                        if (modifiedPeriode?.id !== null) {
                                            setModifyPeriode({ ...modifiedPeriode, date_debut: e.target.value });
                                        } else {
                                            setNewPeriode({ ...newPeriode, date_debut: e.target.value });
                                        }
                                        if (e.target.value) setShowPlaceholder(false);
                                    }}
                                    onFocus={() => setShowPlaceholder(false)}
                                    onBlur={() => {
                                        if (!(modifiedPeriode.id !== null ? modifiedPeriode.date_debut : newPeriode.date_debut)) {
                                            setShowPlaceholder(true);
                                        }
                                    }}
                                    required
                                />
                                {showPlaceholder && (
                                    <div
                                        style={{
                                            position: "absolute",
                                            top: "50%",
                                            left: "12px",
                                            transform: "translateY(-50%)",
                                            color: "#8A8A8A",
                                            fontFamily: "Kumbh Sans, sans-serif",
                                            fontSize: "0.9rem",
                                            fontWeight: "400",
                                        }}
                                    >
                                        Entrer la Date Debut
                                    </div>
                                )}
                            </div>
                            <div style={{ position: "relative", flex: "0 0 25%" }}>
                                <input
                                    type="date"
                                    className="common-input"
                                    style={{
                                        width: "100%",
                                        color: showPlaceholder1 ? "transparent" : "inherit",
                                    }}
                                    value={modifiedPeriode.id !== null ? modifiedPeriode.date_fin : newPeriode.date_fin}
                                    onChange={(e) => {
                                        if (modifiedPeriode?.id !== null) {
                                            setModifyPeriode({ ...modifiedPeriode, date_fin: e.target.value });
                                        } else {
                                            setNewPeriode({ ...newPeriode, date_fin: e.target.value });
                                        }
                                        if (e.target.value) setShowPlaceholder1(false);
                                    }}
                                    onFocus={() => setShowPlaceholder1(false)}
                                    onBlur={() => {
                                        if (!(modifiedPeriode.id !== null ? modifiedPeriode.date_fin : newPeriode.date_fin)) {
                                            setShowPlaceholder1(true);
                                        }
                                    }}
                                    required
                                />
                                {showPlaceholder1 && (
                                    <div
                                        style={{
                                            position: "absolute",
                                            top: "50%",
                                            left: "12px",
                                            transform: "translateY(-50%)",
                                            color: "#8A8A8A",
                                            fontFamily: "Kumbh Sans, sans-serif",
                                            fontSize: "0.9rem",
                                            fontWeight: "400",
                                        }}
                                    >
                                        Entrer la Date Fin
                                    </div>
                                )}
                            </div>
                            <button
                                className='annuler-button'
                                style={{
                                    flex: 1,
                                    minWidth: "110px"
                                }}
                                onClick={(e) => {
                                    annulerModifier(e);
                                    setNewPeriode({
                                        type: "",
                                        date_debut: "",
                                        date_fin: ""
                                    })
                                }}
                            >
                                {t('parametresPage.annuler')}
                            </button>
                            {
                                !modifieClicked ?
                                    <button
                                        className='ajouter-btn'
                                        style={{
                                            flex: 1,
                                            minWidth: "110px"
                                        }}
                                        onClick={(e) => AddPeriode(e)}
                                    >
                                        {t('parametresPage.ajouter')}
                                    </button>
                                    :
                                    <button
                                        className='ajouter-btn'
                                        style={{
                                            flex: 1,
                                            minWidth: "110px"
                                        }}
                                        onClick={(e) => { e.preventDefault(); setConfirmModifie(true) }}
                                    >
                                        Modifier
                                    </button>
                            }
                        </form>
                        <div className="annees-table">
                            {
                                periodes.map((annee, index) => (
                                    <div
                                        className={`annee-line ${selectedAnnee === index ? "selected" : ""}`}
                                        onClick={() => toggleAnnee(index)}
                                    >
                                        <span style={{ fontSize: "0.9rem", flex: "0 0 18%" }}>
                                            {annee.type}
                                        </span>
                                        <span style={{ fontSize: "0.9rem", textIndent: "0.5rem", flex: "0 0 28%" }}>
                                            {
                                                annee.date_debut
                                            }
                                        </span>
                                        <span style={{ fontSize: "0.9rem", flex: 1, textIndent: "0.5rem" }}>
                                            {
                                                annee.date_fin
                                            }
                                        </span>
                                        <div className="line-btns">
                                            <button
                                                onClick={() => {
                                                    setNewPeriode({
                                                        type: "",
                                                        date_debut: "",
                                                        date_fin: ""
                                                    })
                                                    setModifyPeriode({ ...modifiedPeriode, id: annee.id, type: annee.type, type1: "exist", index: index, date_debut: annee.date_debut, date_fin: annee.date_fin });
                                                    setModifieClicked(true);
                                                }}
                                            >
                                                <EditIcon />
                                                {t('enseignantsPage.modifieBtn')}
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setDeletedAnnee({ ...deletedAnnee, id: annee.id, type: "exist", index: index })
                                                    setConfirmDelete(true)
                                                }}
                                            >
                                                <DeleteIcon />
                                                {t('enseignantsPage.deleteBtn')}
                                            </button>
                                        </div>
                                    </div>
                                ))
                            }
                            {
                                newPeriodes.map((annee, index) => (
                                    <div
                                        className={`annee-line ${selectedNewPeriode === index ? "selected" : ""}`}
                                        onClick={() => toggleNewPeriode(index)}
                                    >
                                        <span style={{ fontSize: "0.9rem", flex: "0 0 28%" }}>
                                            {annee.type}
                                        </span>
                                        <span style={{ fontSize: "0.9rem", textIndent: "0.5rem", flex: "0 0 20%" }}>
                                            {annee.date_debut}
                                        </span>
                                        <span style={{ fontSize: "0.9rem", flex: 1, textIndent: "0.5rem" }}>
                                            {
                                                annee.date_fin
                                            }
                                        </span>
                                        <div className="line-btns">
                                            <button
                                                onClick={() => {
                                                    setNewPeriode({
                                                        type: "",
                                                        date_debut: "",
                                                        date_fin: ""
                                                    })
                                                    setModifyPeriode({ ...modifiedPeriode, id: annee.id, type: annee.type, type1: "no-exist", index: index, date_debut: annee.date_debut, date_fin: annee.date_fin });
                                                    setModifieClicked(true);
                                                }}
                                            >
                                                <EditIcon />
                                                {t('enseignantsPage.modifieBtn')}
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setDeletedAnnee({ ...deletedAnnee, id: "delete", type: "no-exist", index: index })
                                                    setConfirmDelete(true)
                                                }}
                                            >
                                                <DeleteIcon />
                                                {t('enseignantsPage.deleteBtn')}
                                            </button>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                </div>

            </div >
            <button
                className="enregistre-btn"
                style={{
                    right: isRtl ? "" : "20px",
                    left: isRtl ? "20px" : ""
                }}
                onClick={(e) => AddPeriodes(e)}
            >
                {t('parametresPage.enregistrer')}
            </button>
            {
                addSuccess &&
                <AddAlert addSuccess={() => setAddSuccess(false)} />
            }
            {
                confirmModifie &&
                <ModifierAlert annulerModifier={annulerModifier} handlemodifie={handlemodifie} />
            }
            {
                confirmDelete &&
                <DeleteAlert annulerDelete={annulerDelete} handleDelete={handleDelete} />
            }
        </div >
    )
}

export const AnneesAcademiques = () => {

    const { isRtl } = useContext(AppContext);

    const navigate = useNavigate();

    const [selectedAnnee, setSelectedAnnee] = useState(null);

    const toggleAnnee = (index) => {
        setSelectedAnnee(selectedAnnee === index ? null : index)
    }

    const { t } = useTranslation();

    const [annees, setAnnees] = useState([]);
    const [newAnnees, setNewAnnees] = useState([]);

    useEffect(() => {

        axios.get(`${process.env.REACT_APP_API_URL_SERVICE1}/annees-academiques/`)
            .then((res) => setAnnees(res.data))
            .catch((err) => {
                console.error("Erreur Axios :", err);
            })

    }, [])

    const [newAnne, setNewAnne] = useState({
        date_debut: "",
        date_fin: ""
    });

    const [addSuccess, setAddSuccess] = useState(false)


    const AddAnnee = (e) => {
        e.preventDefault();
        axios.post(`${process.env.REACT_APP_API_URL_SERVICE1}/annees-academiques/`, newAnne)
            .then((res) => {
                console.log(res.data)
                setAnnees(prev => [...prev, res.data]);
                setAddSuccess(true)
                setNewAnnees([])
            })
            .catch((err) => {
                console.error("Erreur Axios :", err);
            });
    }

    const [modifieddAnnee, setModifyAnnee] = useState({
        id: null,
        date_debut: "",
        date_fin: ""
    });

    const handlemodifie = (e) => {
        e.preventDefault()
        axios.put(`${process.env.REACT_APP_API_URL_SERVICE1}/annees-academiques/${modifieddAnnee.id}/`, {
            id: modifieddAnnee.id,
            date_debut: modifieddAnnee.date_debut,
            date_fin: modifieddAnnee.date_fin,
        })
            .then(() => {
                setAnnees(prevAnnees =>
                    prevAnnees.map(annee =>
                        annee.id === modifieddAnnee.id ? { ...annee, date_debut: modifieddAnnee.date_debut, date_fin: modifieddAnnee.date_fin } : annee
                    )
                );
                alert("modifie avec succes")
            })
            .catch((err) => alert(err.response.data))

        annulerModifier(e);
    }

    const [modifieClicked, setModifieClicked] = useState(false);
    const [confirmModifie, setConfirmModifie] = useState(false);

    const annulerModifier = (e) => {
        e.preventDefault();
        setModifieClicked(false);

        setModifyAnnee({
            id: null,
            date_debut: "",
            date_fin: ""
        });

        setNewAnne({
            date_debut: "",
            date_fin: ""
        });

        setConfirmModifie(false);
    };


    const [deletedAnnee, setDeletedAnnee] = useState({
        id: null,
    })

    const [confirmDelete, setConfirmDelete] = useState(false);

    const handleDelete = (e) => {

        e.preventDefault();
        axios.delete(`${process.env.REACT_APP_API_URL_SERVICE1}/annees-academiques/${deletedAnnee.id}/`)
            .then(() => {
                setAnnees(prevAnnees =>
                    prevAnnees.filter(dep => dep.id !== deletedAnnee.id)
                )
                alert("Année supprimé!")
            })

        annulerDelete(e);

    }

    const annulerDelete = (e) => {
        e.preventDefault()
        setDeletedAnnee({
            id: null,
            type: "unknown",
            index: 0
        });
        setNewAnne({
            date_debut: "",
            date_fin: ""
        })
        setConfirmDelete(false)
    }

    const [showPlaceholder, setShowPlaceholder] = useState(true);
    const [showPlaceholder1, setShowPlaceholder1] = useState(true);

    return (
        <div className='departements-container'>
            <div className="departements-wrapper">
                <div className="title-line">
                    <h3 style={{ fontSize: "1.05rem", fontWeight: "400", color: "#727272", }}>
                        <Trans i18nKey={"parametresPage.departementLink"}>
                            Paramètres &gt; <Link to={'/admin/scolarite'} className='return-to-scolarite'> Paramètres Scolarité </Link>
                        </Trans>
                        <span style={{ color: "#925FE2" }}>{t('parametresPage.annees')}</span>
                    </h3>
                    <button className="precedent-btn" onClick={() => navigate('/admin/scolarite')}>
                        <CircleArrowIcon className={`${isRtl ? "rtl-icon" : ""}`} />
                        {t('parametresPage.precedent')}
                    </button>
                </div>
                <div
                    className="formDep-container"
                    style={{
                        paddingLeft: isRtl ? "" : "1.5rem",
                        paddingRight: isRtl ? "1.5rem" : ""
                    }}
                >
                    <h1 style={{ fontSize: "1.85rem", color: "#000", fontWeight: "500" }}>
                        {t('parametresPage.anneesTitle')}
                    </h1>
                    <p style={{ color: "#5F5F5F", fontSize: "1.1rem", fontFamily: "Nunito, sans serif", width: "630px" }}>
                        {t('parametresPage.anneesRemark')}
                    </p>
                    <div className="form-table-container">
                        <form action="">
                            <div style={{ position: "relative", flex: "0 0 32%" }}>
                                <input
                                    type="date"
                                    className="common-input"
                                    style={{
                                        width: "100%",
                                        color: showPlaceholder ? "transparent" : "inherit",
                                    }}
                                    value={modifieddAnnee.id !== null ? modifieddAnnee.date_debut : newAnne.date_debut}
                                    onChange={(e) => {
                                        if (modifieddAnnee?.id !== null) {
                                            setModifyAnnee({ ...modifieddAnnee, date_debut: e.target.value });
                                        } else {
                                            setNewAnne({ ...newAnne, date_debut: e.target.value });
                                        }
                                        if (e.target.value) setShowPlaceholder(false);
                                    }}
                                    onFocus={() => setShowPlaceholder(false)}
                                    onBlur={() => {
                                        if (!(modifieddAnnee.id !== null ? modifieddAnnee.date_debut : newAnne.date_debut)) {
                                            setShowPlaceholder(true);
                                        }
                                    }}
                                    required
                                />
                                {showPlaceholder && (
                                    <div
                                        style={{
                                            position: "absolute",
                                            top: "50%",
                                            left: "12px",
                                            transform: "translateY(-50%)",
                                            color: "#8A8A8A",
                                            fontFamily: "Kumbh Sans, sans-serif",
                                            fontSize: "0.9rem",
                                            fontWeight: "400",
                                        }}
                                    >
                                        Entrer la Date Debut
                                    </div>
                                )}
                            </div>
                            <div style={{ position: "relative", flex: "0 0 32%" }}>
                                <input
                                    type="date"
                                    className="common-input"
                                    style={{
                                        width: "100%",
                                        color: showPlaceholder1 ? "transparent" : "inherit",
                                    }}
                                    value={modifieddAnnee.id !== null ? modifieddAnnee.date_fin : newAnne.date_fin}
                                    onChange={(e) => {
                                        if (modifieddAnnee?.id !== null) {
                                            setModifyAnnee({ ...modifieddAnnee, date_fin: e.target.value });
                                        } else {
                                            setNewAnne({ ...newAnne, date_fin: e.target.value });
                                        }
                                        if (e.target.value) setShowPlaceholder1(false);
                                    }}
                                    onFocus={() => setShowPlaceholder1(false)}
                                    onBlur={() => {
                                        if (!(modifieddAnnee.id !== null ? modifieddAnnee.date_fin : newAnne.date_fin)) {
                                            setShowPlaceholder1(true);
                                        }
                                    }}
                                    required
                                />
                                {showPlaceholder1 && (
                                    <div
                                        style={{
                                            position: "absolute",
                                            top: "50%",
                                            left: "12px",
                                            transform: "translateY(-50%)",
                                            color: "#8A8A8A",
                                            fontFamily: "Kumbh Sans, sans-serif",
                                            fontSize: "0.9rem",
                                            fontWeight: "400",
                                        }}
                                    >
                                        Entrer la Date Fin
                                    </div>
                                )}
                            </div>
                            <button
                                className='annuler-button'
                                style={{
                                    flex: 1,
                                    minWidth: "110px"
                                }}
                                onClick={(e) => {
                                    annulerModifier(e); setNewAnne({
                                        date_debut: "",
                                        date_fin: ""
                                    })
                                }}
                            >
                                {t('parametresPage.annuler')}
                            </button>
                            {
                                !modifieClicked ?
                                    <button
                                        className='ajouter-btn'
                                        style={{
                                            flex: 1,
                                            minWidth: "110px"
                                        }}
                                        onClick={(e) => AddAnnee(e)}
                                    >
                                        {t('parametresPage.ajouter')}
                                    </button>
                                    :
                                    <button
                                        className='ajouter-btn'
                                        style={{
                                            flex: 1,
                                            minWidth: "110px"
                                        }}
                                        onClick={(e) => { e.preventDefault(); setConfirmModifie(true) }}
                                    >
                                        Modifier
                                    </button>
                            }
                        </form>
                        <div className="annees-table">
                            {
                                annees.map((annee, index) => (
                                    <div
                                        className={`annee-line ${selectedAnnee === index ? "selected" : ""}`}
                                        onClick={() => toggleAnnee(index)}
                                    >
                                        <span style={{ fontSize: "0.9rem", flex: "0 0 13%" }}>
                                            {annee.date_debut}
                                        </span>
                                        <span style={{ fontSize: "0.9rem", flex: "0 0 15%" }}>
                                            {
                                                annee.date_fin
                                            }
                                        </span>
                                        <div className="line-btns">
                                            <button
                                                onClick={() => {
                                                    setNewAnne({
                                                        date_debut: "",
                                                        date_fin: ""
                                                    })
                                                    setModifyAnnee({ ...modifieddAnnee, id: annee.id, date_debut: annee.date_debut, date_fin: annee.date_fin });
                                                    setModifieClicked(true);
                                                }}
                                            >
                                                <EditIcon />
                                                {t('enseignantsPage.modifieBtn')}
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setDeletedAnnee({ ...deletedAnnee, id: annee.id })
                                                    setConfirmDelete(true)
                                                }}
                                            >
                                                <DeleteIcon />
                                                {t('enseignantsPage.deleteBtn')}
                                            </button>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                </div>

            </div>
            {
                addSuccess &&
                <AddAlert addSuccess={() => setAddSuccess(false)} />
            }
            {
                confirmModifie &&
                <ModifierAlert annulerModifier={annulerModifier} handlemodifie={handlemodifie} />
            }
            {
                confirmDelete &&
                <DeleteAlert annulerDelete={annulerDelete} handleDelete={handleDelete} />
            }
        </div>
    )
}

const AddAlert = ({ addSuccess }) => {
    return (
        <div className="add-departement-success">
            <div className="img-container" style={{ height: "90px", width: "100px" }}>
                <img src={doneImg} alt="done" style={{ height: "100%", width: "100%", objectFit: "cover", transform: "scale(1.2)" }} />
            </div>
            <span style={{ width: "95%", fontFamily: "Kumbh Sans, sans-serif", textAlign: "center", fontSize: "1.1rem", fontWeight: "500" }}>
                ✨Sauvegarde effectuée ! Les nouveaux départements sont en place.✨
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
                onClick={(e) => { e.preventDefault(); addSuccess() }}
            >
                OK
            </button>
        </div>
    )
}

const ModifierAlert = ({ annulerModifier, handlemodifie }) => {
    return (
        <div className="add-departement-success">
            <div className="img-container" style={{ height: "90px", width: "150px" }}>
                <EmptyIcon style={{ height: "100%", width: "100%" }} />
            </div>
            <span style={{ width: "95%", fontFamily: "Kumbh Sans, sans-serif", textAlign: "center", fontSize: "1.1rem", fontWeight: "500" }}>
                Êtes-vous certain(e) de vouloir apporter des modifications à ce département ?
            </span>
            <div
                className="btns-line"
            >
                <button
                    style={{
                        color: "#000",
                        background: "#E2E4E5"
                    }}
                    onClick={(e) => { annulerModifier(e) }}
                >
                    Annuler
                </button>
                <button
                    style={{

                    }}
                    onClick={(e) => { handlemodifie(e); }}
                >
                    Modifier
                </button>
            </div>
        </div>
    )
}

const DeleteAlert = ({ handleDelete, annulerDelete }) => {
    return (
        <div className="add-departement-success">
            <div className="img-container" style={{ height: "90px", width: "150px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="30" cy="30" r="30" fill="#FFD21E" />
                    <path d="M29.5001 15.75V34.0833M29.6147 43.25V43.4792H29.3855V43.25H29.6147Z" stroke="white" stroke-width="5.5" stroke-linecap="round" stroke-linejoin="round" />
                </svg>

            </div>
            <span style={{ width: "95%", fontFamily: "Kumbh Sans, sans-serif", textAlign: "center", fontSize: "1.1rem", fontWeight: "500" }}>
                Êtes-vous sûr(e) de vouloir supprimer ce département ? Cette action est irréversible.
            </span>
            <div
                className="btns-line"
            >
                <button
                    style={{
                        color: "#000",
                        background: "#E2E4E5"
                    }}
                    onClick={(e) => annulerDelete(e)}
                >
                    Annuler
                </button>
                <button
                    style={{
                        background: "#D9534F"
                    }}
                    onClick={(e) => handleDelete(e)}
                >
                    Supprimer
                </button>
            </div>
        </div>
    )
}

const SaveAlert = ({ handleSave, annulerSave }) => {
    return (
        <div className="add-departement-success">
            <div className="img-container" style={{ height: "90px", width: "150px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="30" cy="30" r="30" fill="#FFD21E" />
                    <path d="M29.5001 15.75V34.0833M29.6147 43.25V43.4792H29.3855V43.25H29.6147Z" stroke="white" stroke-width="5.5" stroke-linecap="round" stroke-linejoin="round" />
                </svg>

            </div>
            <span style={{ width: "95%", fontFamily: "Kumbh Sans, sans-serif", textAlign: "center", fontSize: "1.1rem", fontWeight: "500" }}>
                ⚠️ Vous avez des modifications non enregistrées. Êtes-vous sûr de vouloir quitter sans enregistrer ?
            </span>
            <div
                className="btns-line"
            >
                <button
                    style={{
                        color: "#000",
                        background: "#E2E4E5"
                    }}
                    onClick={(e) => annulerSave(e)}
                >
                    Annuler
                </button>
                <button
                    style={{
                        background: "#925FE2"
                    }}
                    onClick={(e) => handleSave(e)}
                >
                    Sauvegarder
                </button>
            </div>
        </div>
    )
}
