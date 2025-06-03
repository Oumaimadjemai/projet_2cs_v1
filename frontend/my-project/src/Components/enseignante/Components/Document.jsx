import React, { useEffect, useState, useRef, createContext, useContext } from 'react'
import { useParams } from 'react-router-dom';
import '../Styles/Document.css'
import axios from 'axios';
import sleepImage from '../../../Assets/Images/sleeping.png'
import doneImg from '../../../Assets/Images/Done.png'
import { Link } from 'react-router-dom'

const DocumentContext = createContext();

function DocumentEtudiant() {

    const { idD } = useParams();
    const { id } = useParams();

    const [nomGroup, setNomGroup] = useState("")
    const [document, setDocument] = useState({
        title: "",
        status: "",
        reason: "",
        note: ""
    })
    const [moreOptions, setMoreOptions] = useState(false)
    const [thereIsNote, setThereIsNote] = useState(false);
    const [note, setNote] = useState("")

    useEffect(() => {

        axios.get(`${process.env.REACT_APP_API_URL_SERVICE3}/api/groups/${id}/members`, {
            headers: {
                authorization: `Bearer ${localStorage.getItem('access_token')}`
            }
        })
            .then((res) => setNomGroup(res.data.group_name))
            .catch((err) => console.error(err.response.data))

        axios.get(`${process.env.REACT_APP_API_URL_SERVICE5}/api/document/${idD}`, {
            headers: {
                authorization: `Bearer ${localStorage.getItem('access_token')}`
            }
        })
            .then((res) => {
                setDocument({
                    ...document,
                    title: res.data.title,
                    status: res.data.status,
                    reason: res.data.reason || "aucun",
                    note: res.data.note
                })
                setThereIsNote(res.data.note === "" ? false : true)
                setNote(res.data.note)
            })
            .catch((err) => console.error(err.response.data))

    }, [])

    const pdfUrl = `http://localhost:5005/api/document/${idD}/pdf`;

    const [refuseClicked, setRefuseClicked] = useState(false)

    const motifRef = useRef('')

    const handleMotifText = () => {

        if (motifRef.current) {
            motifRef.current.style.height = 'auto';
            motifRef.current.style.height = `${motifRef.current.scrollHeight}px`;
        }
    };

    const motifRef1 = useRef('')

    const handleMotifText1 = () => {

        if (motifRef1.current) {
            motifRef1.current.style.height = 'auto';
            motifRef1.current.style.height = `${motifRef1.current.scrollHeight}px`;
        }
    };

    const motifRef2 = useRef('')

    const handleMotifText2 = () => {

        if (motifRef2.current) {
            motifRef2.current.style.height = 'auto';
            motifRef2.current.style.height = `${motifRef2.current.scrollHeight}px`;
        }
    };

    const [motif, setMotif] = useState('')

    const [error, setError] = useState(false)

    const [submitted, setSubmitted] = useState(false);

    const envoyerMotif = (e) => {
        e.preventDefault();
        setSubmitted(true);
    };

    const [ajouterNoteSuccess, setAjouterNoteSuccess] = useState(false)
    const [modifierNoteSuccess, setModifierrNoteSuccess] = useState(false)

    const [acceptAlert, setAcceptAlertClicked] = useState(false)
    const [accpetSuccess, setaccpetSuccess] = useState(false)

    const [refuseAlert, setRefuseAlertClicked] = useState(false)
    const [refuseSuccess, setRefuseSuccess] = useState(false)

    useEffect(() => {
        if (submitted) {
            if (!motif.trim()) {
                setError(true);
            } else {
                setError(false);
                setRefuseAlertClicked(true)
                console.log('Formulaire valide. Motif:', motif);
            }
            setSubmitted(false);
        }
    }, [submitted, motif]);

    const [ajouterNote, setAjouteNote] = useState(false)
    const [modifieNote, setModifieNote] = useState(false)
    const [loading, setLoading] = useState(false)

    const handleAjouterNote = (e) => {

        e.preventDefault();

        setLoading(true)

        axios.post(`${process.env.REACT_APP_API_URL_SERVICE5}/api/enseignant/document/${idD}/note`, {
            note: note
        }, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('access_token')}`,
                'Content-Type': 'application/json'
            }
        })
            .then((res) => {
                setDocument({ ...document, note: note })
                setAjouterNoteSuccess(true)
            })
            .catch((err) => console.log(err.response.data))
            .finally(() => setLoading(false))

    }

    const handleModifierNote = (e) => {

        e.preventDefault();

        setLoading(true)

        axios.post(`${process.env.REACT_APP_API_URL_SERVICE5}/api/enseignant/document/${idD}/note`, {
            note: note
        }, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('access_token')}`,
                'Content-Type': 'application/json'
            }
        })
            .then((res) => {
                setDocument({ ...document, note: note })
                setModifierrNoteSuccess(true)
            })
            .catch((err) => console.log(err.response.data))
            .finally(() => setLoading(false))

    }

    useEffect(() => {

        setThereIsNote(document.note === "" ? false : true)

    }, [document.note])


    return (
        <DocumentContext.Provider value={{ document, setDocument, motif, setLoading }}>
            <div className='document-container' >
                <div className="document-wrapper">
                    <div className="document-header">
                        <h1 style={{ fontSize: "1.1rem", fontWeight: "500", color: "#4F4F4F" }}>
                            <Link className='return-to-documents' to={`/enseignant/groupes`}>Les Groupes</Link> &gt; <span style={{ color: "#925FE2" }}>{nomGroup}</span> &gt; <Link className='return-to-documents' to={`/enseignant/groupes/${id}`}>Documents</Link> &gt; <span style={{ color: "#925FE2" }}>{document.title}</span>
                        </h1>
                        <div style={{ display: "flex", gap: "1.1rem", alignItems: "center", marginRight: "1rem" }} onClick={() => setMoreOptions(true)}>
                            <span style={{ display: "flex", gap: "10px", alignItems: "center", fontFamily: "Kumbh Sans, sans-serif", fontWeight: "600", color: "#925FE2", cursor: "pointer" }}>
                                Plus d'Options
                                <svg width="8" height="12" viewBox="0 0 10 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M1.5 1L8.5 8L1.5 15" stroke="#925FE2" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
                                </svg>
                            </span>
                        </div>
                    </div>
                    <iframe
                        src={pdfUrl}
                        title="PDF Viewer"
                        width="100%"
                        height="100%"
                        style={{ border: 'none' }}
                    >
                        <p>Votre navigateur ne supporte pas les iframes. Voici le <a href={pdfUrl}>lien vers le PDF</a>.</p>
                    </iframe>
                </div>
                {
                    moreOptions &&
                    <div className={`about-document`}>
                        <div className="about-title">
                            <svg width="36" height="36" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ cursor: "pointer" }} onClick={() => setMoreOptions(false)}>
                                <path d="M25 27.9168L14.7917 38.1252C14.4098 38.5071 13.9237 38.6981 13.3334 38.6981C12.7431 38.6981 12.257 38.5071 11.875 38.1252C11.4931 37.7432 11.3021 37.2571 11.3021 36.6668C11.3021 36.0766 11.4931 35.5904 11.875 35.2085L22.0834 25.0002L11.875 14.7918C11.4931 14.4099 11.3021 13.9238 11.3021 13.3335C11.3021 12.7432 11.4931 12.2571 11.875 11.8752C12.257 11.4932 12.7431 11.3022 13.3334 11.3022C13.9237 11.3022 14.4098 11.4932 14.7917 11.8752L25 22.0835L35.2084 11.8752C35.5903 11.4932 36.0764 11.3022 36.6667 11.3022C37.257 11.3022 37.7431 11.4932 38.125 11.8752C38.507 12.2571 38.698 12.7432 38.698 13.3335C38.698 13.9238 38.507 14.4099 38.125 14.7918L27.9167 25.0002L38.125 35.2085C38.507 35.5904 38.698 36.0766 38.698 36.6668C38.698 37.2571 38.507 37.7432 38.125 38.1252C37.7431 38.5071 37.257 38.6981 36.6667 38.6981C36.0764 38.6981 35.5903 38.5071 35.2084 38.1252L25 27.9168Z" fill="#000000" fill-opacity="0.8" />
                            </svg>
                            <div style={{ display: "flex", gap: "0.5rem", alignSelf: "center" }}>
                                <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M15.75 13C15.75 12.8011 15.671 12.6103 15.5303 12.4697C15.3897 12.329 15.1989 12.25 15 12.25H9C8.80109 12.25 8.61032 12.329 8.46967 12.4697C8.32902 12.6103 8.25 12.8011 8.25 13C8.25 13.1989 8.32902 13.3897 8.46967 13.5303C8.61032 13.671 8.80109 13.75 9 13.75H15C15.1989 13.75 15.3897 13.671 15.5303 13.5303C15.671 13.3897 15.75 13.1989 15.75 13ZM15.75 17C15.75 16.8011 15.671 16.6103 15.5303 16.4697C15.3897 16.329 15.1989 16.25 15 16.25H9C8.80109 16.25 8.61032 16.329 8.46967 16.4697C8.32902 16.6103 8.25 16.8011 8.25 17C8.25 17.1989 8.32902 17.3897 8.46967 17.5303C8.61032 17.671 8.80109 17.75 9 17.75H15C15.1989 17.75 15.3897 17.671 15.5303 17.5303C15.671 17.3897 15.75 17.1989 15.75 17Z" fill="black" />
                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M7 2.25C6.27065 2.25 5.57118 2.53973 5.05546 3.05546C4.53973 3.57118 4.25 4.27065 4.25 5V19C4.25 19.7293 4.53973 20.4288 5.05546 20.9445C5.57118 21.4603 6.27065 21.75 7 21.75H17C17.7293 21.75 18.4288 21.4603 18.9445 20.9445C19.4603 20.4288 19.75 19.7293 19.75 19V7.968C19.75 7.587 19.626 7.217 19.396 6.913L16.398 2.945C16.2349 2.72912 16.0239 2.554 15.7817 2.43341C15.5395 2.31282 15.2726 2.25004 15.002 2.25H7ZM5.75 5C5.75 4.31 6.31 3.75 7 3.75H14.25V8.147C14.25 8.561 14.586 8.897 15 8.897H18.25V19C18.25 19.69 17.69 20.25 17 20.25H7C6.31 20.25 5.75 19.69 5.75 19V5Z" fill="black" />
                                </svg>

                                <h1 style={{ fontSize: "1.2rem", fontWeight: "600", color: "#000", paddingTop: "6px", fontFamily: "Kumbh Sans, sans-serif" }}>
                                    {document.title}
                                </h1>
                            </div>
                        </div>
                        {
                            document.status === "en attente" ?
                                <div className="flex-column" style={{ display: 'flex', flexDirection: "column", gap: "1rem" }}>
                                    <div className="pas-encore-accepter">
                                        <img src={sleepImage} alt="sleeping" style={{ height: "90px" }} />
                                        <p style={{ textAlign: "center" }}>
                                            Ce document est en attente de votre approbation.
                                        </p>
                                    </div>
                                    <div className="theme-attent-btns" style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                        <button
                                            style={{ background: "#925FE2", color: "#fff" }}
                                            onClick={() => setAcceptAlertClicked(true)}
                                        >
                                            Accepter
                                        </button>
                                        <button
                                            style={{ background: "#D9534F", color: "#fff" }}
                                            onClick={() => {
                                                setModifieNote(false)
                                                setAjouteNote(false)
                                                setRefuseClicked(true)
                                            }}
                                        >
                                            Refuser
                                        </button>
                                        {
                                            thereIsNote ?
                                                <button
                                                    style={{ background: "#D9EAFD", color: "#5F5F5F" }}
                                                    onClick={() => {
                                                        setRefuseClicked(false);
                                                        setModifieNote(true)
                                                    }}
                                                >
                                                    Modifier Note
                                                </button>
                                                :
                                                <button
                                                    style={{ background: "#D9EAFD", color: "#5F5F5F" }}
                                                    onClick={() => {
                                                        setRefuseClicked(false);
                                                        setAjouteNote(true)
                                                    }}
                                                >
                                                    Ajouter Note
                                                </button>
                                        }
                                    </div>
                                    {
                                        !(ajouterNote || modifieNote) && thereIsNote &&
                                        <div className="note-flex" style={{ display: "flex", flexDirection: "column", gap: "6px", marginTop: "6px" }}>
                                            <span style={{ display: 'flex', alignItems: "center", gap: "4px", fontFamily: "Nunito, sans-serif", fontSize: "1.1rem", fontWeight: "600", color: "#925FE2" }}>
                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M4.29998 16.6998C3.15382 14.8197 2.7367 12.5846 3.12757 10.4176C3.51844 8.25056 4.69018 6.30205 6.42101 4.94083C8.15183 3.57962 10.3216 2.90016 12.5197 3.03107C14.7178 3.16197 16.7916 4.09416 18.3486 5.65119C19.9056 7.20821 20.8378 9.28202 20.9687 11.4801C21.0996 13.6782 20.4202 15.848 19.059 17.5788C17.6977 19.3096 15.7492 20.4813 13.5822 20.8722C11.4152 21.2631 9.18013 20.846 7.29998 19.6998L2.99998 20.9998L4.29998 16.6998Z" stroke="#925FE2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                                </svg>

                                                Votre Note
                                            </span>
                                            <div className="pas-encore-accepter" style={{ paddingTop: "10px", justifyContent: "flex-start", alignItems: "flex-start" }}>
                                                <p style={{ fontWeight: "500", fontSize: "0.98rem" }}>
                                                    {document.note}
                                                </p>
                                            </div>
                                        </div>
                                    }
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
                                                    onChange={(e) => { handleMotifText(); setMotif(e.target.value); }}
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
                                    {
                                        ajouterNote &&
                                        <form action="">
                                            <div className="field-flex">
                                                <label style={{ fontFamily: "Kumbh Sans, sans-serif", fontWeight: "500", fontSize: "1.05rem", color: "#00000080" }}>
                                                    Remark
                                                </label>
                                                <textarea
                                                    placeholder='Entrez votre remark ici'
                                                    ref={motifRef1}
                                                    value={note}
                                                    onChange={(e) => { handleMotifText1(); setNote(e.target.value) }}
                                                />
                                            </div>
                                            <div className="btns-form-flex" style={{ display: "flex", alignSelf: "flex-end", marginTop: "1rem", gap: "6px" }}>
                                                <button
                                                    style={{ background: "#E2E4E5", color: "#00000080" }}
                                                    onClick={() => { setNote(""); setAjouteNote(false) }}
                                                >
                                                    Annuler
                                                </button>
                                                <button style={{ background: "#925FE2", color: "#fff" }} onClick={(e) => handleAjouterNote(e)}>Ajouter Note</button>
                                            </div>
                                        </form>
                                    }
                                    {
                                        modifieNote &&
                                        <form action="">
                                            <div className="field-flex">
                                                <label style={{ fontFamily: "Kumbh Sans, sans-serif", fontWeight: "500", fontSize: "1.05rem", color: "#00000080" }}>
                                                    Remark
                                                </label>
                                                <textarea
                                                    placeholder='Entrez votre remark ici'
                                                    ref={motifRef2}
                                                    value={note}
                                                    onChange={(e) => { handleMotifText2(); setNote(e.target.value) }}
                                                />
                                            </div>
                                            <div className="btns-form-flex" style={{ display: "flex", alignSelf: "flex-end", marginTop: "1rem", gap: "6px" }}>
                                                <button
                                                    style={{ background: "#E2E4E5", color: "#00000080" }}
                                                    onClick={() => { setNote(document.note); setModifieNote(false) }}
                                                >
                                                    Annuler
                                                </button>
                                                <button style={{ background: "#925FE2", color: "#fff" }} onClick={(e) => handleModifierNote(e)}>Modifier Note</button>
                                            </div>
                                        </form>
                                    }
                                </div> :
                                document.status === "refuse" ?
                                    <div className="flex-column" style={{ display: 'flex', flexDirection: "column", gap: "1rem" }}>
                                        <div className="pas-encore-accepter" style={{ paddingTop: "1rem", gap: "1rem" }}>
                                            <svg width="50" height="50" viewBox="0 0 70 70" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M35 4.375C18.0879 4.375 4.375 18.0879 4.375 35C4.375 51.9121 18.0879 65.625 35 65.625C51.9121 65.625 65.625 51.9121 65.625 35C65.625 18.0879 51.9121 4.375 35 4.375ZM54.7217 51.0508L18.9834 15.3125C17.6367 16.4062 16.4062 17.6367 15.3125 18.9834L51.0508 54.7217C46.6758 58.29 41.084 60.4297 35 60.4297C20.959 60.4297 9.57031 49.041 9.57031 35C9.57031 20.959 20.959 9.57031 35 9.57031C49.041 9.57031 60.4297 20.959 60.4297 35C60.4297 41.084 58.29 46.6758 54.7217 51.0508Z" fill="#A52A2A" />
                                                <path d="M35 9.57031C20.959 9.57031 9.57031 20.959 9.57031 35C9.57031 49.041 20.959 60.4297 35 60.4297C41.084 60.4297 46.6758 58.29 51.0508 54.7217L15.3125 18.9834C16.4062 17.6367 17.6367 16.4062 18.9834 15.3125L54.7217 51.0508C58.29 46.6758 60.4297 41.084 60.4297 35C60.4297 20.959 49.041 9.57031 35 9.57031Z" fill="black" fill-opacity="0.15" />
                                            </svg>

                                            <p style={{ textAlign: "center" }}>
                                                Vous avez refusé ce document.
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
                                                {document.reason}
                                            </span>
                                        </div>
                                    </div>
                                    :
                                    <div className="flex-column" style={{ display: 'flex', flexDirection: "column", gap: "1rem" }}>
                                        <div className="pas-encore-accepter">
                                            <img src={doneImg} alt="sleeping" style={{ height: "90px" }} />
                                            <p style={{ textAlign: "center" }}>
                                                Vous avez accepté de Document.
                                            </p>
                                        </div>
                                        <div className="theme-attent-btns" style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
                                            {
                                                thereIsNote ?
                                                    <button
                                                        style={{ background: "#D9EAFD", color: "#5F5F5F" }}
                                                        onClick={() => {
                                                            setModifieNote(true)
                                                        }}
                                                    >
                                                        Modifier Note
                                                    </button>
                                                    :
                                                    <button
                                                        style={{ background: "#D9EAFD", color: "#5F5F5F" }}
                                                        onClick={() => {
                                                            setAjouteNote(true)
                                                        }}
                                                    >
                                                        Ajouter Note
                                                    </button>
                                            }
                                        </div>
                                        {
                                            !(ajouterNote || modifieNote) && thereIsNote &&
                                            <div className="note-flex" style={{ display: "flex", flexDirection: "column", gap: "6px", marginTop: "6px" }}>
                                                <span style={{ display: 'flex', alignItems: "center", gap: "4px", fontFamily: "Nunito, sans-serif", fontSize: "1.1rem", fontWeight: "600", color: "#925FE2" }}>
                                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M4.29998 16.6998C3.15382 14.8197 2.7367 12.5846 3.12757 10.4176C3.51844 8.25056 4.69018 6.30205 6.42101 4.94083C8.15183 3.57962 10.3216 2.90016 12.5197 3.03107C14.7178 3.16197 16.7916 4.09416 18.3486 5.65119C19.9056 7.20821 20.8378 9.28202 20.9687 11.4801C21.0996 13.6782 20.4202 15.848 19.059 17.5788C17.6977 19.3096 15.7492 20.4813 13.5822 20.8722C11.4152 21.2631 9.18013 20.846 7.29998 19.6998L2.99998 20.9998L4.29998 16.6998Z" stroke="#925FE2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                                    </svg>

                                                    Votre Note
                                                </span>
                                                <div className="pas-encore-accepter" style={{ paddingTop: "10px", justifyContent: "flex-start", alignItems: "flex-start" }}>
                                                    <p style={{ fontWeight: "500", fontSize: "0.98rem", textAlign: "start" }}>
                                                        {document.note}
                                                    </p>
                                                </div>
                                            </div>
                                        }
                                        {
                                            ajouterNote &&
                                            <form action="">
                                                <div className="field-flex">
                                                    <label style={{ fontFamily: "Kumbh Sans, sans-serif", fontWeight: "500", fontSize: "1.05rem", color: "#00000080" }}>
                                                        Remark
                                                    </label>
                                                    <textarea
                                                        placeholder='Entrez votre remark ici'
                                                        ref={motifRef1}
                                                        value={note}
                                                        onChange={(e) => { handleMotifText1(); setNote(e.target.value) }}
                                                    />
                                                </div>
                                                <div className="btns-form-flex" style={{ display: "flex", alignSelf: "flex-end", marginTop: "1rem", gap: "6px" }}>
                                                    <button
                                                        style={{ background: "#E2E4E5", color: "#00000080" }}
                                                        onClick={() => { setNote(""); setAjouteNote(false) }}
                                                    >
                                                        Annuler
                                                    </button>
                                                    <button style={{ background: "#925FE2", color: "#fff" }} onClick={(e) => handleAjouterNote(e)}>Ajouter Note</button>
                                                </div>
                                            </form>
                                        }
                                        {
                                            modifieNote &&
                                            <form action="">
                                                <div className="field-flex">
                                                    <label style={{ fontFamily: "Kumbh Sans, sans-serif", fontWeight: "500", fontSize: "1.05rem", color: "#00000080" }}>
                                                        Remark
                                                    </label>
                                                    <textarea
                                                        placeholder='Entrez votre remark ici'
                                                        ref={motifRef2}
                                                        value={note}
                                                        onChange={(e) => { handleMotifText2(); setNote(e.target.value) }}
                                                    />
                                                </div>
                                                <div className="btns-form-flex" style={{ display: "flex", alignSelf: "flex-end", marginTop: "1rem", gap: "6px" }}>
                                                    <button
                                                        style={{ background: "#E2E4E5", color: "#00000080" }}
                                                        onClick={() => { setNote(document.note); setModifieNote(false) }}
                                                    >
                                                        Annuler
                                                    </button>
                                                    <button style={{ background: "#925FE2", color: "#fff" }} onClick={(e) => handleModifierNote(e)}>Modifier Note</button>
                                                </div>
                                            </form>
                                        }
                                    </div>
                        }
                    </div>
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
                    acceptAlert &&
                    <AccepterAlert annulerAccept={() => setAcceptAlertClicked(false)} id={idD} acceptSuccess={() => setaccpetSuccess(true)} />
                }
                {
                    accpetSuccess &&
                    <AccepterSuccess acceptSuccess={() => setaccpetSuccess(false)} />
                }
                {
                    refuseAlert &&
                    <RefuserAlert annulerRefuser={() => setRefuseAlertClicked(false)} id={idD} refuserSuccess={() => setRefuseSuccess(true)} />
                }
                {
                    refuseSuccess &&
                    <RefuserSuccess acceptSuccess={() => setRefuseSuccess(false)} />
                }
                {
                    ajouterNoteSuccess &&
                    <AjouterNoteSuccess acceptSuccess={() => {setAjouterNoteSuccess(false); setAjouteNote(false)}} />
                }
                {
                    modifierNoteSuccess &&
                    <ModifierNoteSuccess acceptSuccess={() => {setModifierrNoteSuccess(false); setModifieNote(false)}} />
                }
            </div>
        </DocumentContext.Provider>
    )
}

export default DocumentEtudiant

const AccepterAlert = ({ annulerAccept, id, acceptSuccess }) => {

    const { document, setDocument, setLoading } = useContext(DocumentContext);

    const handleAccept = (e) => {

        e.preventDefault()
        setLoading(true)

        axios.post(`${process.env.REACT_APP_API_URL_SERVICE5}/api/enseignant/document/${id}/status`, {
            status: "valide"
        }, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('access_token')}`,
                'Content-Type': 'application/json'
            }
        })
            .then(() => {
                setDocument({ ...document, status: "valide" })
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
                ✅ Accepter ce document ?
                Cette action confirme la validation du document soumis par le groupe de projet.
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
                ✨Le document a bien été accepté.✨
                Il est maintenant enregistré comme validé.
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
                ❌ Le document a été refusé avec succès. Il ne sera pas pris en compte dans le cadre du projet.
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

    const { motif, setDocument, document, setLoading } = useContext(DocumentContext)

    const handleRefuser = (e) => {

        e.preventDefault()
        setLoading(true)

        axios.post(`${process.env.REACT_APP_API_URL_SERVICE5}/api/enseignant/document/${id}/status`, {
            status: "refuse",
            reason: motif
        }, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('access_token')}`,
                'Content-Type': 'application/json'
            }
        })
            .then(() => {
                setDocument({ ...document, status: "refuse", reason: motif })
                annulerRefuser();
                refuserSuccess();
            })
            .catch((err) => console.error(err.response.data))
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
                ❌ Êtes-vous sûr de vouloir refuser ce document ?
                Cette action est irréversible et le document sera marqué comme refusé.
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

const AjouterNoteSuccess = ({ acceptSuccess }) => {
    return (
        <div className="add-theme-success">
            <div className="img-container" style={{ height: "90px", width: "100px" }}>
                <img src={doneImg} alt="done" style={{ height: "100%", width: "100%", objectFit: "cover", transform: "scale(1.2)" }} />
            </div>
            <span style={{ width: "95%", fontFamily: "Kumbh Sans, sans-serif", textAlign: "center", fontSize: "1.1rem", fontWeight: "500" }}>
                📝 La remarque a été ajoutée au document avec succès.
                Elle est désormais visible pour les étudiants.
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

const ModifierNoteSuccess = ({ acceptSuccess }) => {
    return (
        <div className="add-theme-success">
            <div className="img-container" style={{ height: "90px", width: "100px" }}>
                <img src={doneImg} alt="done" style={{ height: "100%", width: "100%", objectFit: "cover", transform: "scale(1.2)" }} />
            </div>
            <span style={{ width: "95%", fontFamily: "Kumbh Sans, sans-serif", textAlign: "center", fontSize: "1.1rem", fontWeight: "500" }}>
                📝 La remarque a été modifiée avec succès.
                Les changements ont bien été enregistrés.
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


