import React, { createContext, useEffect, useState } from 'react';
import { FaPlus, FaTrash, FaEdit, FaFilter, FaTimes, FaCalendarAlt, FaSearch } from 'react-icons/fa';
import { IoTimeOutline } from "react-icons/io5";
import { MdCalendarMonth } from "react-icons/md";
import RendezVousForm from './AjouterRendezVous';
import '../Styles/RendezVous.css'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import ModifireRendezVous from './ModifierRendezVous';

export const RendezVousContexte = createContext();

const RendezVousPage = () => {

  const { id } = useParams();

  const [rendezVous, setRendezVous] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [groupe, setGroupe] = useState('');
  const [salle, setSalle] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBy, setFilterBy] = useState('all');
  const [errors, setErrors] = useState({});
  const [confirmDeleteIndex, setConfirmDeleteIndex] = useState(null);

  const handleSearch = e => setSearchTerm(e.target.value);
  const handleFilterChange = e => setFilterBy(e.target.value);

  const resetForm = () => {
    setShowModal(false);
    setGroupe('');
    setSalle('');
    setDate('');
    setTime('');
    setErrors({});
  };


  const confirmDelete = () => {
    setRendezVous(rendezVous.filter((_, i) => i !== confirmDeleteIndex));
    setConfirmDeleteIndex(null);
  };

  const getTodayDate = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  const [loading, setLoading] = useState(false)

  const [rendez, setRendez] = useState([])

  useEffect(() => {
    const fetchRendezVousEtSalles = async () => {
      try {
        const token = localStorage.getItem('access_token');

        // 1. Récupère tous les rendez-vous
        const rendezRes = await axios.get(`${process.env.REACT_APP_API_URL_SERVICE5}/api/enseignant/rendez-vous/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const rendezvous = rendezRes.data.rendezvous;

        // 2. Pour chaque rendez-vous, récupérer la salle correspondante
        const rendezvousAvecSalles = await Promise.all(
          rendezvous.map(async (rdv) => {
            try {
              const salleRes = await axios.get(`${process.env.REACT_APP_API_URL_SERVICE1}/salles/${rdv.salle}/`, {
                headers: { Authorization: `Bearer ${token}` }
              });

              const salle = salleRes.data;
              return {
                ...rdv,
                salle_nom_type: `${salle.nom_salle} - ${salle.type}`
              };
            } catch (err) {
              console.error(`Erreur pour la salle ID ${rdv.salle}`, err.response?.data || err.message);
              return {
                ...rdv,
                salle_nom_type: 'Salle inconnue'
              };
            }
          })
        );

        setRendez(rendezvousAvecSalles);
      } catch (err) {
        console.error('Erreur lors de la récupération des rendez-vous:', err.response?.data || err.message);
      }
    };

    fetchRendezVousEtSalles();

  }, [id]);

  const [confirmModifier, setConfirmerModifier] = useState(null)

  const handleDelete = (e) => {

    e.preventDefault();

    axios.delete(`${process.env.REACT_APP_API_URL_SERVICE5}/api/enseignant/rendez-vous/${confirmDeleteIndex}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`
      }
    })
      .then(() => {
        setRendez(prev =>
          prev.filter(re => re._id !== confirmDeleteIndex)
        )
        setConfirmDeleteIndex(null)
      })
      .catch((err) => console.error(err.response.data))
  }


  return (
    <RendezVousContexte.Provider value={{ setLoading, setRendez }}>
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={{ fontSize: "1.2rem", fontWeight: "600", color: "#4F4F4F", marginBottom: "1rem" }}>
            Tous Les Groupes &gt; Rendez-vous &gt; <span style={{ color: "#A7A7A7", marginLeft: "5px" }}>{rendez.length}</span>
          </h1>
          <button style={styles.addBtn} onClick={() => { setShowModal(true); setEditingIndex(null); }}>
            <FaPlus /> Ajouter Rendez-vous
          </button>
        </div>

        <div style={styles.searchFilter}>
          <select onChange={handleFilterChange} value={filterBy} style={styles.select}>
            <option value="all">Tous</option>
            <option value="groupe">Groupe</option>
            <option value="salle">Salle</option>
          </select>
          <div style={styles.searchInputWrapper}>
            <FaSearch style={styles.searchIcon} />
            <input
              type="text"
              placeholder="Rechercher..."
              style={styles.searchInput}
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
        </div>

        <div className="grid-rendez-vous">
          {rendez.length > 0 ? (
            rendez.map((item, index) => (
              <div key={index} style={styles.card}>
                <div style={styles.cardHeader}>
                  <div style={styles.iconText}>
                    <MdCalendarMonth style={styles.icon} />
                    <span>{new Date(item.date).toLocaleDateString('fr-FR', {
                      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
                    })}</span>
                  </div>
                  <div style={styles.iconText}>
                    <IoTimeOutline style={styles.icon} />
                    <span>{item.heure}</span>
                  </div>
                </div>
                <div style={styles.cardBody}>
                  <div style={styles.cardRow}>
                    <div><strong>Salle:</strong> {item.salle_nom_type}</div>
                  </div>
                </div>
                <div style={styles.cardFooter}>
                  <span onClick={() => setConfirmDeleteIndex(item._id)} style={styles.iconBtnRed}><FaTrash /> Supprimer</span>
                  <span onClick={() => setConfirmerModifier(item)} style={styles.iconBtn}><FaEdit /> Modifier</span>
                </div>
              </div>
            ))
          ) : (
            <div style={styles.emptyState}>
              <FaCalendarAlt style={styles.emptyIcon} />
              <p style={styles.emptyText}>Aucun rendez-vous programmé</p>

            </div>
          )}
        </div>


        {showModal && (
          <RendezVousForm
            onClose={resetForm}
            getTodayDate={getTodayDate}
            id={id}
          />
        )}

        {
          confirmModifier && (
            <ModifireRendezVous
              onClose={() => setConfirmerModifier(null)}
              getTodayDate={getTodayDate}
              rendez={confirmModifier}
              id={id}
            />
          )
        }

        {confirmDeleteIndex !== null && (
          <div style={styles.modalOverlay}>
            <div style={styles.modal}>
              <div style={styles.modalHeader}>
                <h4>Confirmer la suppression</h4>
                <span style={styles.closeBtn} onClick={() => setConfirmDeleteIndex(null)}><FaTimes /></span>
              </div>
              <p>Êtes-vous sûr de vouloir supprimer ce rendez-vous ?</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 20 }}>
                <button onClick={() => setConfirmDeleteIndex(null)} style={{ ...styles.submitBtn, backgroundColor: '#ccc' }}>Annuler</button>
                <button onClick={(e) => handleDelete(e)} style={{ ...styles.submitBtn, backgroundColor: 'red' }}>Supprimer</button>
              </div>
            </div>
          </div>
        )}
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
    </RendezVousContexte.Provider>
  );
};

const styles = {
  error: { color: 'red', fontSize: '12px', marginBottom: 5 },
  container: {
    padding: 20,
    fontFamily: "'Poppins', sans-serif",
    backgroundColor: '#fff'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20
  },
  title: {
    fontSize: '24px',
    fontWeight: '600'
  },
  addBtn: {
    backgroundColor: '#925FE2',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: 20,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    fontWeight: '500'
  },
  searchFilter: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '30px',
    gap: '10px'
  },
  select: {
    padding: '10px 15px',
    borderRadius: '20px',
    border: '1px solid #ccc',
    fontSize: '14px',
    background: '#fff'
  },
  searchInputWrapper: {
    display: 'flex',
    alignItems: 'center',
    flex: 1,
    backgroundColor: 'white',
    borderRadius: '20px',
    border: '1px solid #ccc',
    padding: '0 15px'
  },
  searchIcon: {
    color: '#925FE2',
    marginRight: 10,
    fontSize: '14px'
  },
  searchInput: {
    border: 'none',
    outline: 'none',
    padding: '10px 0',
    flex: 1,
    background: 'transparent',
    fontSize: '14px'
  },
  card: {
    backgroundColor: '#fefefe',
    boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
    borderRadius: 15,
    marginBottom: 20,
    padding: '20px'
  },
  cardHeader: {
    backgroundColor: '#E5D9F6',
    padding: 12,
    fontWeight: 'bold',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: '12px',
    marginBottom: '10px'
  },
  cardBody: { padding: 10 },
  cardRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '14px'
  },
  cardFooter: {
    padding: '0 10px 10px 10px',
    display: 'flex',
    justifyContent: 'flex-end',
    fontSize: 14,
    marginTop: 20
  },
  iconText: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px'
  },
  icon: {
    color: '#925FE2',
    fontSize: '18px'
  },
  iconBtn: {
    color: '#555',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: 5,
    padding: '6px 10px',
    borderRadius: '10px',
    border: '1px solid #ccc',
    background: '#f8f8f8',
    fontSize: '14px'
  },
  iconBtnRed: {
    color: 'red',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    marginRight: '20px',
    gap: 5,
    padding: '6px 10px',
    borderRadius: '10px',
    border: '1px solid #ccc',
    background: '#f8f8f8',
    fontSize: '14px'
  },
  modalOverlay: {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(0,0,0,0.2)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: '500px'
  },
  modal: {
    backgroundColor: 'white',
    padding: 30,
    borderRadius: 16,
    width: '400px',
    boxShadow: '0 4px 16px rgba(0,0,0,0.1)',


  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20
  },
  closeBtn: {
    cursor: 'pointer',
    fontSize: 18
  },
  input: {
    padding: 10,
    borderRadius: 8,
    border: '1px solid #ccc'
  },
  submitBtn: {
    backgroundColor: '#925FE2',
    color: 'white',
    border: 'none',
    borderRadius: 20,
    padding: '10px 20px',
    cursor: 'pointer',
    width: '100%'
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '70px 20px',
    textAlign: 'center',
    boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
    borderRadius: '20px',
    marginTop: '20px'
  },
  emptyIcon: {
    fontSize: '48px',
    color: '#925FE2',
    marginBottom: '20px'
  },
  emptyText: {
    fontSize: '18px',
    color: '#555',
    marginBottom: '20px'
  },
  emptyButton: {
    backgroundColor: '#925FE2',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '20px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  }
};

export default RendezVousPage;