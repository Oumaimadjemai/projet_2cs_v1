import React, { useState } from 'react';
import { FaPlus, FaTrash, FaEdit, FaFilter, FaTimes, FaCalendarAlt, FaSearch } from 'react-icons/fa';
import { IoTimeOutline } from "react-icons/io5";
import { MdCalendarMonth } from "react-icons/md";
import RendezVousForm from './FormRendezvous';

const RendezVousPage = () => {
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

  const groupesOptions = ['10', '19', '10'];
  const sallesOptions = ['A1', 'A2', 'TP14'];

  const handleSearch = e => setSearchTerm(e.target.value);
  const handleFilterChange = e => setFilterBy(e.target.value);

  const filteredRendezVous = rendezVous.filter(item => {
    const searchTermLower = searchTerm.toLowerCase();
    if (filterBy === 'groupe') {
      return item.groupe.toLowerCase().includes(searchTermLower);
    } else if (filterBy === 'salle') {
      return item.salle.toLowerCase().includes(searchTermLower);
    } else {
      return (
        item.groupe.toLowerCase().includes(searchTermLower) ||
        item.salle.toLowerCase().includes(searchTermLower)
      );
    }
  });

  const validateForm = () => {
    const newErrors = {};
    if (!groupe && editingIndex === null) newErrors.groupe = 'Champ requis';
    if (!salle) newErrors.salle = 'Champ requis';
    if (!date) newErrors.date = 'Champ requis';
    if (!time) newErrors.time = 'Champ requis';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddOrEdit = () => {
    if (!validateForm()) return;
    const newItem = { groupe, salle, date, time };
    if (editingIndex !== null) {
      const updatedList = [...rendezVous];
      updatedList[editingIndex] = { ...updatedList[editingIndex], salle, date, time };
      setRendezVous(updatedList);
      setEditingIndex(null);
    } else {
      setRendezVous([...rendezVous, newItem]);
    }
    resetForm();
  };

  const resetForm = () => {
    setShowModal(false);
    setGroupe('');
    setSalle('');
    setDate('');
    setTime('');
    setErrors({});
  };

  const handleEdit = (index) => {
    const item = rendezVous[index];
    setGroupe(item.groupe);
    setSalle(item.salle);
    setDate(item.date);
    setTime(item.time);
    setEditingIndex(index);
    setShowModal(true);
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

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.title}>Rendez-vous <span style={{color:'#888'}}>{rendezVous.length}</span></div>
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

      {filteredRendezVous.length > 0 ? (
        filteredRendezVous.map((item, index) => (
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
                <span>{item.time}</span>
              </div>
            </div>
            <div style={styles.cardBody}>
              <div style={styles.cardRow}>
                <div><strong>Groupe:</strong> {item.groupe}</div>
                <div><strong>Salle:</strong> {item.salle}</div>
              </div>
            </div>
            <div style={styles.cardFooter}>
              <span onClick={() => setConfirmDeleteIndex(index)} style={styles.iconBtnRed}><FaTrash /> Supprimer</span>
              <span onClick={() => handleEdit(index)} style={styles.iconBtn}><FaEdit /> Modifier</span>
            </div>
          </div>
        ))
      ) : (
        <div style={styles.emptyState}>
          <FaCalendarAlt style={styles.emptyIcon} />
          <p style={styles.emptyText}>Aucun rendez-vous programmé</p>
          <button 
            style={styles.emptyButton}
            onClick={() => setShowModal(true)}
          >
            <FaPlus /> Créer un rendez-vous
          </button>
        </div>
      )}

      {showModal && (
        <RendezVousForm
          editingIndex={editingIndex}
          groupe={groupe}
          salle={salle}
          date={date}
          time={time}
          groupesOptions={groupesOptions}
          sallesOptions={sallesOptions}
          errors={errors}
          onChange={(field, value) => {
            if (field === 'groupe') setGroupe(value);
            else if (field === 'salle') setSalle(value);
            else if (field === 'date') setDate(value);
            else if (field === 'time') setTime(value);
          }}
          onSubmit={handleAddOrEdit}
          onClose={resetForm}
          getTodayDate={getTodayDate}
          styles={styles}
        />
      )}

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
              <button onClick={confirmDelete} style={{ ...styles.submitBtn, backgroundColor: 'red' }}>Supprimer</button>
            </div>
          </div>
        </div>
      )}
    </div>
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
    boxShadow: '0 4px 16px rgba(0,0,0,0.1)' ,
 
    
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
    padding: '40px 20px',
    textAlign: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: '10px',
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