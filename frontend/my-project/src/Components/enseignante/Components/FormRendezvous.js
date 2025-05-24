import React from 'react';
import { FaTimes } from 'react-icons/fa';

const RendezVousForm = ({
  editingIndex,
  groupe,
  salle,
  date,
  time,
  groupesOptions,
  sallesOptions,
  errors,
  onChange,
  onSubmit,
  onClose,
  getTodayDate,
}) => {
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
      padding: '12px',
      borderRadius: '25px',
      fontSize: '15px',
      cursor: 'pointer',
      width: '100%',
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

  return (
    <div style={styles.modalOverlay}>
      <div style={styles.modal}>
        <div style={styles.modalHeader}>
          <h3>{editingIndex !== null ? 'Modifier' : 'Ajouter'} Rendez–Vous</h3>
          <span style={styles.closeBtn} onClick={onClose}><FaTimes /></span>
        </div>

        <div style={styles.modalContent}>
        
          <div style={styles.row}>
          <div style={styles.halfInput}>
  <select
    style={styles.input}
    value={groupe}
    onChange={(e) => onChange('groupe', e.target.value)}
    disabled={editingIndex !== null}
  >
    <option value="">Groupe</option>
    {groupesOptions.map(opt => (
      <option key={opt} value={opt}>{opt}</option>
    ))}
  </select>
  {errors.groupe && <small style={styles.error}>{errors.groupe}</small>}
</div>


            <div style={styles.halfInput}>
              <select
                style={styles.input}
                value={salle}
                onChange={(e) => onChange('salle', e.target.value)}
              >
                <option value="">Salle</option>
                {sallesOptions.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
              {errors.salle && <small style={styles.error}>{errors.salle}</small>}
            </div>
          </div>

      
          <div style={styles.row}>
            <div style={styles.halfInput}>
              <label style={styles.label}>Date</label>
              <input
                style={styles.input}
                type="date"
                value={date}
                onChange={(e) => onChange('date', e.target.value)}
                min={getTodayDate()}
              />
              {errors.date && <small style={styles.error}>{errors.date}</small>}
            </div>

            <div style={styles.halfInput}>
              <label style={styles.label}>Heure</label>
              <input
                style={styles.input}
                type="time"
                value={time}
                onChange={(e) => onChange('time', e.target.value)}
              />
              {errors.time && <small style={styles.error}>{errors.time}</small>}
            </div>
          </div>
        </div>

        <button style={styles.submitBtn} onClick={onSubmit}>
          {editingIndex !== null ? 'Modifier' : 'Rendez-vous'}
        </button>
      </div>
    </div>
  );
};

export default RendezVousForm;
