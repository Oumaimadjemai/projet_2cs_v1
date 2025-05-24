
import React, { useState } from 'react';
import { FaPlus, FaTrash, FaEdit, FaFilter, FaTimes } from 'react-icons/fa';
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
  const [errors, setErrors] = useState({});
  const [confirmDeleteIndex, setConfirmDeleteIndex] = useState(null);

  const groupesOptions = ['10 ', '19 ', '10'];
  const sallesOptions = [' A1', 'A2', 'TP14'];

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

  const filteredRendezVous = rendezVous.filter(item =>
    item.groupe.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.salle.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        <button style={styles.btn}>Rendez-vous</button>
        <button style={styles.addBtn} onClick={() => { setShowModal(true); setEditingIndex(null); }}>
          <FaPlus /> Ajouter Rendez-vous
        </button>
      </div>

      <div style={styles.searchContainer}>
        <button style={styles.filterBtn}><FaFilter /> Filtres</button>
        <input
          type="text"
          placeholder="Rechercher un Rendez-vous"
          style={styles.searchInput}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {filteredRendezVous.map((item, index) => (
        <div key={index} style={styles.card}>
          <div style={styles.cardHeader}>
            <span><MdCalendarMonth />  {new Date(item.date).toLocaleDateString('fr-FR', {
              weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
            })}</span>
            <span><IoTimeOutline /> {item.time}</span>
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
      ))}

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
  container: { padding: 20, fontFamily: 'Arial, sans-serif' },
  header: { display: 'flex', justifyContent: 'space-between', marginBottom: 20 },
  btn: { backgroundColor: '#925FE2', color: 'white', border: 'none', padding: '8px 16px', borderRadius: 20 },
  addBtn: { backgroundColor: '#925FE2', color: 'white', border: 'none', padding: '8px 20px', borderRadius: 20, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 },
  searchContainer: { display: 'flex', gap: 10, marginBottom: 20 },
  filterBtn: { backgroundColor: '#F3F3F3', border: 'none', padding: '8px 12px', borderRadius: 10, display: 'flex', alignItems: 'center', gap: 6 },
  searchInput: { flex: 1, padding: '8px 12px', borderRadius: 20, border: '1px solid #ccc' },
  card: { backgroundColor: '#fefefe', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', borderRadius: 20, marginBottom: 20 },
  cardHeader: { backgroundColor: '#E5D9F6', padding: 12, fontWeight: 'bold', display: 'flex', justifyContent: 'space-between' },
  cardBody: { padding: 10 },
  cardRow: { display: 'flex', justifyContent: 'space-between' },
  cardFooter: { padding: '0 10px 10px 10px', display: 'flex', justifyContent: 'flex-end', fontSize: 14 ,marginTop:20},
  iconBtn: { color: '#555', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5 },
  iconBtnRed: { color: 'red', cursor: 'pointer', display: 'flex', alignItems: 'center', marginRight: '20px', gap: 5 },
  modalOverlay: { position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.2)', display: 'flex', justifyContent: 'center', alignItems: 'center' },
  modal: { backgroundColor: 'white', padding: 30, borderRadius: 16, width: '400px', boxShadow: '0 4px 16px rgba(0,0,0,0.1)' },
  modalHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  closeBtn: { cursor: 'pointer', fontSize: 18 },
  input: { padding: 10, borderRadius: 8, border: '1px solid #ccc' },
  submitBtn: { backgroundColor: '#925FE2', color: 'white', border: 'none', borderRadius: 20, padding: '10px 20px', cursor: 'pointer', width: '100%' },
};

export default RendezVousPage;
