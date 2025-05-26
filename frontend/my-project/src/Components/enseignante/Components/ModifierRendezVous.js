import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios'
import { RendezVousContexte } from './RendezVous';

const ModifireRendezVous = ({ onClose, getTodayDate, rendez, id }) => {
    const styles = {
        modalOverlay: {
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
        },
        modal: {
            backgroundColor: '#fff',
            borderRadius: '20px',
            padding: '30px',
            width: '700px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
            position: 'relative',
            display: "flex",
            flexDirection: "column"
        },
        modalHeader: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px',
        },
        closeBtn: {
            cursor: 'pointer',
            fontSize: '18px',
            color: '#555',
        },
        modalContent: {
            display: 'flex',
            flexDirection: 'column',
            gap: '15px',
        },
        input: {
            marginTop: '10px',
            width: '300px',
            padding: '10px',
            fontSize: '14px',
            borderRadius: '20px',
            border: '1px solid #ccc',
        },
        error: {
            color: 'red',
            fontSize: '12px',
            marginTop: '-10px',
            marginBottom: '5px',
        },
        submitBtn: {
            marginTop: '25px',
            backgroundColor: '#9B5DE5',
            color: '#fff',
            border: 'none',
            padding: '8px 12px',
            borderRadius: '25px',
            fontSize: '15px',
            cursor: 'pointer',
            alignSelf: "flex-end",
            fontWeight: "500",
            fontFamily: "Kumbh Sans, sans-serif",
            fontSize: "1.01rem",
            width: "140px"
        },
        row: {
            display: 'flex',
            gap: '30px',
        },
        halfInput: {
            flex: 1,
        },
        label: {
            marginBottom: '50px',
            fontSize: '13px',
            color: '#444',
        },
    };

    const { setLoading, setRendez } = useContext(RendezVousContexte);

    const [salles, setSalles] = useState([])

    useEffect(() => {

        axios.get(`${process.env.REACT_APP_API_URL_SERVICE1}/salles/`)
            .then((res) => setSalles(res.data))
            .catch((err) => console.error(err.response.data))

    }, [])

    const [newRendez, setNewRendez] = useState({
        _id: rendez._id,
        salle: rendez.salle,
        heure: rendez.heure,
        date: rendez.date,
        groupeId: rendez.groupeId
    })

    const handleRendezVous = (e) => {

        e.preventDefault();

        setLoading(true);

        axios.put(`${process.env.REACT_APP_API_URL_SERVICE5}/api/enseignant/rendez-vous/${id}`, newRendez, {
            headers: {
                authorization: `Bearer ${localStorage.getItem("access_token")}`,
                "Content-Type": "application/json",
            }
        })
            .then((res) => {
                setRendez(prev =>
                    prev.map(rendez =>
                        rendez._id === res.data.rendezvous._id
                            ? { ...res.data.rendezvous, salle_nom_type: rendez.salle_nom_type }
                            : rendez
                    )
                );
                onClose();
            })
            .catch((err) => console.error(err))
            .finally(() => setLoading(false))

    }

    return (
        <div style={styles.modalOverlay}>
            <div style={styles.modal}>
                <div style={styles.modalHeader}>
                    <h2 style={{ fontSize: "1.4rem", fontWeight: "550", color: "#4F4F4F" }}>Ajouter Rendez–Vous</h2>
                    <svg
                        width="36"
                        height="36"
                        viewBox="0 0 50 50"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        style={{ cursor: "pointer" }}
                        onClick={onClose}
                    >
                        <path
                            d="M25 27.9168L14.7917 38.1252C14.4098 38.5071 13.9237 38.6981 13.3334 38.6981C12.7431 38.6981 12.257 38.5071 11.875 38.1252C11.4931 37.7432 11.3021 37.2571 11.3021 36.6668C11.3021 36.0766 11.4931 35.5904 11.875 35.2085L22.0834 25.0002L11.875 14.7918C11.4931 14.4099 11.3021 13.9238 11.3021 13.3335C11.3021 12.7432 11.4931 12.2571 11.875 11.8752C12.257 11.4932 12.7431 11.3022 13.3334 11.3022C13.9237 11.3022 14.4098 11.4932 14.7917 11.8752L25 22.0835L35.2084 11.8752C35.5903 11.4932 36.0764 11.3022 36.6667 11.3022C37.257 11.3022 37.7431 11.4932 38.125 11.8752C38.507 12.2571 38.698 12.7432 38.698 13.3335C38.698 13.9238 38.507 14.4099 38.125 14.7918L27.9167 25.0002L38.125 35.2085C38.507 35.5904 38.698 36.0766 38.698 36.6668C38.698 37.2571 38.507 37.7432 38.125 38.1252C37.7431 38.5071 37.257 38.6981 36.6667 38.6981C36.0764 38.6981 35.5903 38.5071 35.2084 38.1252L25 27.9168Z"
                            fill="#000000"
                            fill-opacity="0.8"
                        />
                    </svg>
                </div>

                <div style={styles.modalContent}>

                    <div style={styles.row}>
                        <div style={styles.halfInput}>
                            <select
                                style={styles.input}
                                value={newRendez.salle}
                                onChange={(e) => setNewRendez({ newRendez, salle: parseInt(e.target.value) })}
                                required
                            >
                                <option value="">Salle</option>
                                {salles.map(salle => (
                                    <option key={salle.id} value={salle.id}>{salle.nom_salle}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div style={styles.row}>
                        <div style={styles.halfInput}>
                            <label style={styles.label}>Date</label>
                            <input
                                style={styles.input}
                                type="date"
                                value={newRendez.date}
                                onChange={(e) => setNewRendez({ ...newRendez, date: e.target.value })}
                                min={getTodayDate()}
                                required
                            />
                        </div>

                        <div style={styles.halfInput}>
                            <label style={styles.label}>Heure</label>
                            <input
                                style={styles.input}
                                type="time"
                                value={newRendez.heure}
                                onChange={(e) => setNewRendez({ ...newRendez, heure: e.target.value })}
                                required
                            />
                        </div>
                    </div>
                </div>
                <div className="btns-line" style={{ alignSelf: "flex-end", display: "flex", gap: "0.6rem" }}>
                    <button style={{ ...styles.submitBtn, color: "#00000090", background: "#E2E4E5" }} onClick={onClose}>
                        Annuler
                    </button>
                    <button style={styles.submitBtn} onClick={(e) => handleRendezVous(e)}>
                        Modifier
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ModifireRendezVous;
