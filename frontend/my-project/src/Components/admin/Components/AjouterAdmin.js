import React, { useState, useEffect, useContext } from 'react'
import { ReactComponent as DraftIcon } from '../../../Assets/Icons/draft.svg';
import '../../Partials/Components/i18n'
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { AdminListContext } from './AdminsListe';

export const AjouterAdmin = ({ annulerAjouter, handleDraftSave }) => {

    const { t } = useTranslation();

    const { setAdmins, setLoading } = useContext(AdminListContext)

    const [newAdmin, setNewAdmin] = useState({
        email: "",
        nom: "",
        prenom: "",
    })

    useEffect(() => {
        const savedDraft = localStorage.getItem("brouillonAdmin");
        if (savedDraft) {
            setNewAdmin(JSON.parse(savedDraft));
        }
    }, []);


    const AddAdmin = (e) => {

        e.preventDefault();

        setLoading(true);

        axios.post(`${process.env.REACT_APP_API_URL_SERVICE1}/admins/`, newAdmin)
            .then((res) => {
                setAdmins(prev => [...prev, res.data])
                annulerAjouter();
                localStorage.removeItem("brouillonAdmin");
            })
            .catch((err) => {
                console.error("Erreur Axios :", err);
                if (err.response) {
                    console.error("Détails de l'erreur :", err.response.data);
                }
            })
            .finally(() => setLoading(false))
    }

    return (
        <div className='ajouter-admin-container'>
            <div className="ajouter-admin-wrapper">
                <div className="title-line">
                    <h1>Ajouter Un Admin</h1>
                    <svg width="36" height="36" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ cursor: "pointer" }} onClick={() => annulerAjouter()}>
                        <path d="M25 27.9168L14.7917 38.1252C14.4098 38.5071 13.9237 38.6981 13.3334 38.6981C12.7431 38.6981 12.257 38.5071 11.875 38.1252C11.4931 37.7432 11.3021 37.2571 11.3021 36.6668C11.3021 36.0766 11.4931 35.5904 11.875 35.2085L22.0834 25.0002L11.875 14.7918C11.4931 14.4099 11.3021 13.9238 11.3021 13.3335C11.3021 12.7432 11.4931 12.2571 11.875 11.8752C12.257 11.4932 12.7431 11.3022 13.3334 11.3022C13.9237 11.3022 14.4098 11.4932 14.7917 11.8752L25 22.0835L35.2084 11.8752C35.5903 11.4932 36.0764 11.3022 36.6667 11.3022C37.257 11.3022 37.7431 11.4932 38.125 11.8752C38.507 12.2571 38.698 12.7432 38.698 13.3335C38.698 13.9238 38.507 14.4099 38.125 14.7918L27.9167 25.0002L38.125 35.2085C38.507 35.5904 38.698 36.0766 38.698 36.6668C38.698 37.2571 38.507 37.7432 38.125 38.1252C37.7431 38.5071 37.257 38.6981 36.6667 38.6981C36.0764 38.6981 35.5903 38.5071 35.2084 38.1252L25 27.9168Z" fill="#000000" fill-opacity="0.8" />
                    </svg>
                </div>
                <form id='ajouterFormAdmin' onSubmit={AddAdmin}>
                    <div className="ajouter-input-line">
                        <div className="input-flex">
                            <label style={{ fontSize: "0.9rem", color: "#00000070", fontWeight: "430" }}>{t('enseignantsPage.nameInput')}</label>
                            <input
                                type="text"
                                name="nom"
                                id="nom"
                                required
                                value={newAdmin.nom}
                                onChange={(e) => setNewAdmin({ ...newAdmin, nom: e.target.value })}
                            />
                        </div>
                        <div className="input-flex">
                            <label style={{ fontSize: "0.9rem", color: "#00000070", fontWeight: "430" }}>{t('enseignantsPage.prenomInput')}</label>
                            <input
                                type="text"
                                name="prenom"
                                id="prenom"
                                required
                                value={newAdmin.prenom}
                                onChange={(e) => setNewAdmin({ ...newAdmin, prenom: e.target.value })}
                            />
                        </div>
                    </div>
                    <div className="ajouter-input-line select-line">
                        <div className="input-flex">
                            <label style={{ fontSize: "0.9rem", color: "#00000070", fontWeight: "430" }}>{t('enseignantsPage.emailInput')}</label>
                            <input
                                type="email"
                                name="adresse"
                                id="adresse"
                                required
                                value={newAdmin.email}
                                onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
                            />
                        </div>
                        <div className="select-flex">
                            <div className="select-flex-line">
                                <div style={{ position: "relative", display: "inline-block" }}>
                                    <select className="custom-select">
                                        <option>{t('enseignantsPage.sexSelect')}</option>
                                        <option>Male</option>
                                        <option>Female</option>
                                    </select>
                                    <svg
                                        width="10"
                                        height="6"
                                        viewBox="0 0 10 6"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                        style={{
                                            position: "absolute",
                                            right: "60px",
                                            top: "50%",
                                            transform: "translateY(-50%)",
                                            pointerEvents: "none"
                                        }}
                                    >
                                        <path d="M4.99929 4.18863L8.77899 0.220677C8.91347 0.0793351 9.09533 0 9.28493 0C9.47453 0 9.65649 0.0793351 9.79097 0.220677C9.85721 0.290046 9.90976 0.372607 9.94565 0.463596C9.98153 0.554585 10 0.652194 10 0.750779C10 0.849365 9.98153 0.946974 9.94565 1.03796C9.90976 1.12895 9.85721 1.21152 9.79097 1.28089L5.50595 5.77932C5.37147 5.92066 5.1896 6 5 6C4.8104 6 4.62853 5.92066 4.49405 5.77932L0.209032 1.28089C0.14279 1.21152 0.0902398 1.12895 0.0543536 1.03796C0.0184674 0.946974 0 0.849365 0 0.750779C0 0.652194 0.0184674 0.554585 0.0543536 0.463596C0.0902398 0.372607 0.14279 0.290046 0.209032 0.220677C0.343604 0.0795203 0.525523 0.000314919 0.715067 0.000314919C0.904612 0.000314919 1.08644 0.0795203 1.22101 0.220677L4.99929 4.18863Z" fill="#8A8A8A" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
                <div className="btns-form-line">
                    <button
                        className='brouillon-btn'
                        style={{ backgroundColor: "#E2E4E5", color: "#060606" }}
                        onClick={() => {
                            localStorage.setItem("brouillonEtudiant", JSON.stringify(newAdmin));
                            handleDraftSave();
                        }}
                    >
                        <DraftIcon />
                        {t('enseignantsPage.brouillonBtn')}
                    </button>
                    <button
                        type='submit'
                        className='ajout-btn'
                        form='ajouterFormAdmin'
                    >
                        Ajouter Admin
                    </button>

                </div>
            </div>
        </div>
    )
}
