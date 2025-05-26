import React, { useEffect, useState } from 'react'
import '../Styles/Profile.css'
import defaulImg from '../../../Assets/Images/default_picture.jpeg'
import axios from 'axios'
import { ReactComponent as EditIcon } from '../../../Assets/Icons/edit.svg';
import doneImg from '../../../Assets/Images/Done.png'

function ProfileEtudiant() {

    const userId = localStorage.getItem('user_id')
    const [etudiant, setEtudiant] = useState({})
    const [initialEtudiant, setInitialEtudiant] = useState({})
    const [isModified, setIsModified] = useState(false)
    const [annees, setAnnees] = useState([])

    useEffect(() => {

        axios.get(`${process.env.REACT_APP_API_URL_SERVICE1}/etudiants/${userId}/`)
            .then((res) => {
                setEtudiant(res.data)
                setInitialEtudiant(res.data)
            })
            .catch((err) => console.error(err.response.data))

        axios.get(`${process.env.REACT_APP_API_URL_SERVICE1}/annees/`)
            .then((res) => {
                setAnnees(res.data)
            })
            .catch((err) => console.error(err.response.data))

    }, [])

    const [imageSelected, setImageSelected] = useState(null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setEtudiant({ ...etudiant, photo_profil: file });
            const reader = new FileReader();
            reader.onloadend = () => {
                setImageSelected(reader.result)
            };
            reader.readAsDataURL(file);
        }
    };

    useEffect(() => {
        if (initialEtudiant.nom) {
            const photoChanged = imageSelected !== null;
            const dataChanged =
                etudiant.nom !== initialEtudiant.nom ||
                etudiant.prenom !== initialEtudiant.prenom;

            setIsModified(photoChanged || dataChanged);
        }
    }, [etudiant, imageSelected, initialEtudiant]);

    const [loading, setLoading] = useState(false)
    const [successChange, setSuccessChange] = useState(false)

    const handleModifie = (e) => {
        e.preventDefault();

        setLoading(true)
        const formData = new FormData();

        if (etudiant.photo_profil instanceof File) {
            formData.append('photo_profil', etudiant.photo_profil);
        }
        if (etudiant.nom) formData.append('nom', etudiant.nom);
        if (etudiant.prenom) formData.append('prenom', etudiant.prenom);
        formData.append('email', etudiant.email)
        formData.append('matricule', etudiant.matricule)
        formData.append('annee_etude', etudiant.annee_etude)
        formData.append('specialite', etudiant.specialite)
        formData.append('moyenne_etudiant', etudiant.moyenne_etudiant)

        axios.put(`${process.env.REACT_APP_API_URL_SERVICE1}/etudiants/${etudiant.id}/`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
            .then((res) => {
                setEtudiant(res.data)
                setInitialEtudiant(res.data)
                setSuccessChange(true)
                setImageSelected(null)
            })
            .catch((err) => {
                console.error(err.response.data)
            })
            .finally(() => setLoading(false))
    }

    const getAnnee = (id) => {
        const annee = `${annees.find(an => an.id === id)?.title} ${annees.find(an => an.id === id)?.departement_title.toLowerCase() === "préparatoire" ? "CPI" : "CS"}`
        return annee
    }

    return (
        <div className='profile-container'>
            <div className="profile-wrapper">
                <div className="photo-profile-line">
                    <div className="flex-line">
                        <div className="circle">
                            <img src={imageSelected || (etudiant.photo_profil ? etudiant.photo_profil : defaulImg)} alt="profile" />
                        </div>
                        <div className="user-infos">
                            <span style={{ fontSize: "1.15rem", fontWeight: "600", fontFamily: "Nunito, sans-serif" }}>
                                {`${etudiant.nom} ${etudiant.prenom}`}
                            </span>
                            <p style={{ fontSize: "0.9rem", color: "#4F4F4F" }}>
                                {etudiant.email}
                            </p>
                        </div>
                    </div>
                    <div className="input-line">
                        <input
                            type="file"
                            id="img-input"
                            onChange={handleImageChange}
                        />
                        <label htmlFor="img-input">Changer photo</label>
                    </div>
                </div>
                <div className="detailed-infos">
                    <div className="inputs-flex-row">
                        <div className="input-flex-column">
                            <label style={{
                                fontFamily: "Nunito, sans-serif",
                                fontSize: "1.1rem",
                                fontWeight: "600"
                            }}
                            >
                                Nom
                            </label>

                            <div className="value-box">
                                <input
                                    type="text"
                                    name="" id=""
                                    className='value-box'
                                    value={etudiant.nom}
                                    onChange={(e) => setEtudiant({ ...etudiant, nom: e.target.value })}
                                    required
                                />
                                <EditIcon style={{ height: "22px", width: "22px" }} />
                            </div>
                        </div>
                        <div className="input-flex-column">
                            <label style={{
                                fontFamily: "Nunito, sans-serif",
                                fontSize: "1.1rem",
                                fontWeight: "600"
                            }}
                            >
                                Prénom
                            </label>

                            <div className="value-box">
                                <input
                                    type="text"
                                    name="" id=""
                                    className='value-box'
                                    value={etudiant.prenom}
                                    onChange={(e) => setEtudiant({ ...etudiant, prenom: e.target.value })}
                                    required
                                />
                                <EditIcon style={{ height: "22px", width: "22px" }} />
                            </div>
                        </div>
                    </div>
                    <div className="inputs-flex-row">
                        <div className="input-flex-column">
                            <label style={{
                                fontFamily: "Nunito, sans-serif",
                                fontSize: "1.1rem",
                                fontWeight: "600"
                            }}
                            >
                                Matricule
                            </label>
                            <div className="role-box">
                                <span style={{ color: "#4F4F4F" }}>
                                    {etudiant.matricule}
                                </span>
                            </div>
                        </div>
                        <div className="input-flex-column">
                            <label style={{
                                fontFamily: "Nunito, sans-serif",
                                fontSize: "1.1rem",
                                fontWeight: "600"
                            }}
                            >
                                Année Universitaire
                            </label>
                            <div className="role-box">
                                <span style={{ color: "#4F4F4F" }}>
                                    {getAnnee(etudiant.annee_etude)}
                                </span>
                            </div>
                        </div>
                        <div className="input-flex-column"></div>
                    </div>
                    <div className="inputs-flex-row">
                        <div className="input-flex-column">
                            <label style={{
                                fontFamily: "Nunito, sans-serif",
                                fontSize: "1.1rem",
                                fontWeight: "600",
                                color: "#925FE2"
                            }}
                            >
                                Role
                            </label>
                            <div className="role-box">
                                <span style={{ color: "#4F4F4F" }}>
                                    {localStorage.getItem('role')}
                                </span>
                            </div>
                        </div>
                        <div className="input-flex-column"></div>
                    </div>
                </div>
                <div className="email-box">
                    <label style={{
                        fontFamily: "Nunito, sans-serif",
                        fontSize: "1.1rem",
                        fontWeight: "600"
                    }}
                    >
                        Mon Adresse Email
                    </label>
                    <div className="email-box-line">
                        <div className="circle-icon">
                            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M17 3.5H7C4 3.5 2 5 2 8.5V15.5C2 19 4 20.5 7 20.5H17C20 20.5 22 19 22 15.5V8.5C22 5 20 3.5 17 3.5ZM17.47 9.59L14.34 12.09C13.68 12.62 12.84 12.88 12 12.88C11.16 12.88 10.31 12.62 9.66 12.09L6.53 9.59C6.21 9.33 6.16 8.85 6.41 8.53C6.67 8.21 7.14 8.15 7.46 8.41L10.59 10.91C11.35 11.52 12.64 11.52 13.4 10.91L16.53 8.41C16.85 8.15 17.33 8.2 17.58 8.53C17.84 8.85 17.79 9.33 17.47 9.59Z" fill="#925FE2" />
                            </svg>
                        </div>
                        <p style={{ fontSize: "1rem", color: "#4F4F4F" }}>
                            {etudiant.email}
                        </p>
                    </div>
                    {
                        isModified && (
                            <button
                                className='change-profile'
                                onClick={(e) => handleModifie(e)}
                            >
                                Sauvegarder
                            </button>
                        )
                    }
                </div>
            </div>
            {
                successChange &&
                <AccepterSuccess acceptSuccess={() => setSuccessChange(false)} />
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
        </div>
    )
}

export default ProfileEtudiant

const AccepterSuccess = ({ acceptSuccess }) => {
    return (
        <div className="add-theme-success">
            <div className="img-container" style={{ height: "90px", width: "100px" }}>
                <img src={doneImg} alt="done" style={{ height: "100%", width: "100%", objectFit: "cover", transform: "scale(1.2)" }} />
            </div>
            <span style={{ width: "95%", fontFamily: "Kumbh Sans, sans-serif", textAlign: "center", fontSize: "1.1rem", fontWeight: "500" }}>
                ✨Les modifications apportées à votre profil ont été enregistrées avec succès.✨
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
