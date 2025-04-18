import React, { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom';
import '../Styles/Parametres.css'
import { ReactComponent as EditIcon } from '../../../Assets/Icons/edit.svg';
import { ReactComponent as DeleteIcon } from '../../../Assets/Icons/Delete.svg';
import { ReactComponent as CircleArrowIcon } from '../../../Assets/Icons/circle-left-arrow.svg';
import { AppContext } from '../../../App';
import '../../Partials/Components/i18n'
import { useTranslation, Trans } from 'react-i18next';

export const Departements = () => {

    const { isRtl } = useContext(AppContext);

    const navigate = useNavigate();

    const departements = ["Département Préparatoire", "Département Supérieur "];

    const [selectedDepartement, setSelectedDepartement] = useState(null);

    const toggleDepartement = (index) => {
        setSelectedDepartement(selectedDepartement === index ? null : index);
    }

    const { t } = useTranslation();

    return (
        <div className='departements-container'>
            <div className="departements-wrapper">
                <div className="title-line">
                    <h3 style={{ fontSize: "1.05rem", fontWeight: "400", color: "#727272", }}>
                        <Trans i18nKey={"parametresPage.departementLink"}>
                            Paramètres &gt; Paramètres Scolarité &gt; <span style={{ color: "#925FE2" }}>Départements</span>
                        </Trans>
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
                                placeholder={t('parametresPage.inputDepPlaceholder')}
                            />
                            <button
                                className='annuler-button'
                                style={{
                                    flex: 1,
                                    minWidth: "110px"
                                }}
                            >
                                {t('parametresPage.annuler')}
                            </button>
                            <button
                                className='ajouter-btn'
                                style={{
                                    flex: 1,
                                    minWidth: "110px"
                                }}
                            >
                                {t('parametresPage.ajouter')}
                            </button>
                        </form>
                        <div className="departements-table">
                            {
                                departements.map((dep, index) => (
                                    <div
                                        className={`departement-line ${selectedDepartement === index ? "selected" : ""}`}
                                        onClick={() => toggleDepartement(index)}
                                    >
                                        <span style={{ fontSize: "0.9rem" }}>
                                            {dep}
                                        </span>
                                        <div className="line-btns">
                                            <button>
                                                <EditIcon />
                                                {t('enseignantsPage.modifieBtn')}
                                            </button>
                                            <button>
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
            >
                {t('parametresPage.enregistrer')}
            </button>
        </div>
    )
}

export const Salles = () => {

    const { isRtl } = useContext(AppContext);

    const navigate = useNavigate();

    const salles = [
        { nom: "Amphi C", departement: "Préparatoire", capacite: 40, categorie: "Amphi" },
        { nom: "Amphi C", departement: "Préparatoire", capacite: 40, categorie: "Amphi" },
        { nom: "Amphi C", departement: "Préparatoire", capacite: 40, categorie: "Amphi" },
    ];

    const [selectedSalle, setSelectedSalle] = useState(null);

    const toggleSalle = (index) => {
        setSelectedSalle(selectedSalle === index ? null : index)
    }

    const [focusedInput, setFocusedInput] = useState(null);

    const { t } = useTranslation();

    return (
        <div className="salles-container">
            <div className="salles-wrapper">
                <div className="title-line">
                    <h3 style={{ fontSize: "1.05rem", fontWeight: "400", color: "#727272", }}>
                        <Trans i18nKey={"parametresPage.sallesLink"}>
                            Paramètres &gt; Paramètres Scolarité &gt; <span style={{ color: "#925FE2" }}>Salles</span>
                        </Trans>
                    </h3>
                    <button className="precedent-btn" onClick={() => navigate('/admin/scolarite')}>
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
                                >
                                    <option value="Préparatoire">Préparatoire</option>
                                    <option value="">Superieure</option>
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
                                >
                                    <option value="Préparatoire">Salle TP</option>
                                    <option value="">Salle TD</option>
                                    <option value="">Amphi</option>
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
                            >
                                {t('parametresPage.annuler')}
                            </button>
                            <button
                                className='ajouter-btn'
                                style={{ flex: "0 0 12%", minWidth: "100px" }}
                            >
                                {t('parametresPage.ajouter')}
                            </button>
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
                                            {salle.nom}
                                        </span>
                                        <span style={{ fontSize: "0.9rem", flex: 1, textIndent: "1.5rem", }}>
                                            {salle.departement}
                                        </span>
                                        <span style={{ fontSize: "0.9rem", flex: 1, textIndent: "1.5rem", }}>
                                            {salle.capacite}
                                        </span>
                                        <span style={{ fontSize: "0.9rem", flex: 1, textIndent: "1.5rem", }}>
                                            {salle.categorie}
                                        </span>
                                        <div className="line-btns">
                                            <button>
                                                <EditIcon />
                                                {t('enseignantsPage.modifieBtn')}
                                            </button>
                                            <button>
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
            >
                {t('parametresPage.enregistrer')}
            </button>
        </div>
    )
}

export const Specialites = () => {

    const { isRtl } = useContext(AppContext);

    const navigate = useNavigate();

    const specialites = [
        "Système D’information & Web",
        "ISI",
        "IASD"
    ]

    const [selectedSpecialite, setSelectedSpecialite] = useState(null);

    const toggleSpecialite = (index) => {
        setSelectedSpecialite(selectedSpecialite === index ? null : index)
    }

    const { t } = useTranslation();

    return (
        <div className='specialites-container'>
            <div className="specialites-wrapper">
                <div className="title-line">
                    <h3 style={{ fontSize: "1.05rem", fontWeight: "400", color: "#727272", }}>
                        <Trans i18nKey={"parametresPage.specialteLink"}>
                            Paramètres &gt; Paramètres Scolarité &gt; <span style={{ color: "#925FE2" }}>Spécialitiés </span>
                        </Trans>
                    </h3>
                    <button className="precedent-btn" onClick={() => navigate('/admin/scolarite')}>
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
                            />
                            <button
                                className='annuler-button'
                                style={{
                                    flex: 1,
                                    minWidth: "110px"
                                }}
                            >
                                {t('parametresPage.annuler')}
                            </button>
                            <button
                                className='ajouter-btn'
                                style={{
                                    flex: 1,
                                    minWidth: "110px"
                                }}
                            >
                                {t('parametresPage.ajouter')}
                            </button>
                        </form>
                        <div className="specialites-table">
                            {
                                specialites.map((spec, index) => (
                                    <div
                                        className={`specilaite-line ${selectedSpecialite === index ? "selected" : ""}`}
                                        onClick={() => toggleSpecialite(index)}
                                    >
                                        <span style={{ fontSize: "0.9rem" }}>
                                            {spec}
                                        </span>
                                        <div className="line-btns">
                                            <button>
                                                <EditIcon />
                                                {t('enseignantsPage.modifieBtn')}
                                            </button>
                                            <button>
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
            >
                {t('parametresPage.enregistrer')}
            </button>
        </div>
    )
}

export const Annees = () => {

    const { isRtl } = useContext(AppContext);

    const navigate = useNavigate();

    const annees = [
        "2021 - 2022",
        "2022 - 2023",
        "2023 - 2024"
    ]

    const [selectedAnnee, setSelectedAnnee] = useState(null);

    const toggleAnnee = (index) => {
        setSelectedAnnee(selectedAnnee === index ? null : index)
    }

    const { t } = useTranslation();

    return (
        <div className='annees-container'>
            <div className="annees-wrapper">
                <div className="title-line">
                    <h3 style={{ fontSize: "1.05rem", fontWeight: "400", color: "#727272", }}>
                        <Trans i18nKey={"parametresPage.anneeLink"}>
                            Paramètres &gt; Paramètres Scolarité &gt; <span style={{ color: "#925FE2" }}>Années</span>
                        </Trans>
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
                                    flex: "0 0 64%"
                                }}
                                placeholder={t('parametresPage.anneeInputPlaceholder')}
                            />
                            <button
                                className='annuler-button'
                                style={{
                                    flex: 1,
                                    minWidth: "110px"
                                }}
                            >
                                {t('parametresPage.annuler')}
                            </button>
                            <button
                                className='ajouter-btn'
                                style={{
                                    flex: 1,
                                    minWidth: "110px"
                                }}
                            >
                                {t('parametresPage.ajouter')}
                            </button>
                        </form>
                        <div className="annees-table">
                            {
                                annees.map((annee, index) => (
                                    <div
                                        className={`annee-line ${selectedAnnee === index ? "selected" : ""}`}
                                        onClick={() => toggleAnnee(index)}
                                    >
                                        <span style={{ fontSize: "0.9rem" }}>
                                            {annee}
                                        </span>
                                        <div className="line-btns">
                                            <button>
                                                <EditIcon />
                                                {t('enseignantsPage.modifieBtn')}
                                            </button>
                                            <button>
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
            >
                {t('parametresPage.enregistrer')}
            </button>
        </div>
    )
}
