import React, { useState } from 'react'; 
import { FiMoreVertical } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const DemandeEntreprise = () => {
  const navigate = useNavigate();
  const [openMenu, setOpenMenu] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBy, setFilterBy] = useState('all');
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [demandes, setDemandes] = useState([
    {
      id: 1,
      name: 'TechInnov DZ',
      secteur: 'Énergie',
      secteurColor: 'red',
      representant: 'Amine Bensalem',
      image: 'https://i.pravatar.cc/80?img=20',
      status: 'pending',
    },
    {
      id: 2,
      name: 'NextCode',
      secteur: 'Informatique',
      secteurColor: '#2997FF',
      representant: 'Sofia Bouzid',
      image: 'https://i.pravatar.cc/80?img=21',
      status: 'pending',
    },
    {
      id: 3,
      name: 'GreenTech',
      secteur: 'Énergie',
      secteurColor: 'red',
      representant: 'Karim Meziane',
      image: 'https://i.pravatar.cc/80?img=22',
      status: 'pending',
    },
    {
      id: 4,
      name: 'SmartCom',
      secteur: 'Communication',
      secteurColor: '#F5A623',
      representant: 'Lina Aït Yahia',
      image: 'https://i.pravatar.cc/80?img=23',
      status: 'pending',
    },
  ]);

  const filteredDemandes = demandes.filter((demande) => {
    const nomEntreprise = (demande.name || '').toLowerCase();
    const nomRepresentant = (demande.representant || '').toLowerCase();
    const term = searchTerm.toLowerCase();

    if (filterBy === 'nom') {
      return nomEntreprise.includes(term);
    } else if (filterBy === 'representant') {
      return nomRepresentant.includes(term);
    } else {
      return nomEntreprise.includes(term) || nomRepresentant.includes(term) || 
             demande.secteur.toLowerCase().includes(term);
    }
  });

  const handleAction = (id, action) => {
    setDemandes(demandes.map(demande =>
      demande.id === id ? { ...demande, status: action } : demande
    ));
  };

  const handleDelete = (id) => {
    setDemandes(demandes.filter(demande => demande.id !== id));
    setConfirmDeleteId(null);
  };

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h2 style={styles.title}>
          Les Demandes d'entreprises <span style={{ color: '#888' }}>{filteredDemandes.length}</span>
        </h2>
        <button style={styles.button} onClick={() => navigate('/ajouterEntreprise')}>
          + Ajouter Entreprise
        </button>
      </div>

      <div style={styles.searchFilter}>
        <select onChange={(e) => setFilterBy(e.target.value)} value={filterBy} style={styles.select}>
          <option value="all">Tous</option>
          <option value="nom">Nom Entreprise</option>
          <option value="representant">Nom Représentant</option>
        </select>
        <input
          type="text"
          placeholder="Rechercher..."
          style={styles.search}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {filteredDemandes.length === 0 ? (
        <div style={styles.noResult}>Aucun résultat trouvé</div>
      ) : (
        <div style={styles.grid}>
          {filteredDemandes.map((d) => (
            <div key={d.id} style={styles.card}>
              <div style={styles.menuDots} onClick={() => setOpenMenu(openMenu === d.id ? null : d.id)}>
                <FiMoreVertical />
                {openMenu === d.id && (
                  <div style={styles.dropdownMenu}>
                    <div style={styles.dropdownItem}>Modifier</div>
                    <div 
                      style={{ ...styles.dropdownItem, color: 'red' }}
                      onClick={() => setConfirmDeleteId(d.id)}
                    >
                      Supprimer
                    </div>
                  </div>
                )}
              </div>

              <div style={styles.imageContainer}>
                <img src={d.image} alt="company" style={styles.image} />
              </div>
              
              <div style={styles.cardTitle}>
                {d.name}
                <span style={styles.nouveauBadge}>Nvl</span>
              </div>

              <div style={styles.cardsect}>
                <div style={styles.field}>
                  Secteur<br />
                  <span style={{ color: d.secteurColor, fontWeight: '600' }}>{d.secteur}</span>
                </div>
                <div style={styles.field}>
                  Représentant<br />
                  {d.representant}
                </div>
              </div>

              {d.status === 'pending' ? (
                <div style={styles.actionButtons}>
                  <button 
                    style={styles.refuserBtn}
                    onClick={() => handleAction(d.id, 'rejected')}
                  >
                    ✖ Refuser
                  </button>
                  <button 
                    style={styles.accepterBtn}
                    onClick={() => handleAction(d.id, 'accepted')}
                  >
                    ✔ Accepter
                  </button>
                </div>
              ) : (
                <div style={{
                  ...styles.statusBadge,
                  backgroundColor: d.status === 'accepted' ? '#E6FAEB' : '#FBEAEA',
                  color: d.status === 'accepted' ? '#239D49' : '#D30000'
                }}>
                  {d.status === 'accepted' ? 'Accepté' : 'Rejeté'}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {confirmDeleteId && (
        <div style={styles.confirmOverlay}>
          <div style={styles.confirmBox}>
            <p>Voulez-vous vraiment supprimer cette demande ?</p>
            <div style={styles.confirmActions}>
              <button 
                style={styles.cancelBtn} 
                onClick={() => setConfirmDeleteId(null)}
              >
                Annuler
              </button>
              <button 
                style={styles.deleteBtn} 
                onClick={() => handleDelete(confirmDeleteId)}
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  page: { padding: '30px', fontFamily: "'Poppins', sans-serif", backgroundColor: '#fff' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
  title: { fontSize: '24px', fontWeight: '600' },
  button: {
    padding: '10px 20px',
    borderRadius: '20px',
    border: 'none',
    background: 'linear-gradient(to right, #925FE2, #8F5DE2)',
    color: '#fff',
    fontWeight: '500',
    cursor: 'pointer'
  },
  searchFilter: { display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '30px' },
  select: { padding: '10px 15px', borderRadius: '20px', border: '1px solid #ccc', fontSize: '14px' },
  search: { flex: 1, padding: '10px 15px', borderRadius: '20px', border: '1px solid #ccc', fontSize: '14px' },
  noResult: {
    textAlign: 'center',
    fontSize: '16px',
    color: '#888',
    marginTop: '40px'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, 280px)',
    gap: '20px',
    justifyContent: 'center',
  },
  card: {
    width: '250px',
    backgroundColor: '#fff',
    borderRadius: '15px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
    padding: '20px',
    position: 'relative',
    minHeight: '300px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  imageContainer: { 
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginBottom: '10px'
  },
  image: { 
    width: '80px', 
    height: '80px', 
    borderRadius: '50%', 
    objectFit: 'cover',
    display: 'block'
  },
  cardTitle: {
    textAlign: 'center',
    fontWeight: '600',
    fontSize: '16px',
    margin: '10px 0',
    display: 'flex',
    alignItems: 'center',
    gap: '6px'
  },
  nouveauBadge: {
    fontSize: '10px',
    backgroundColor: '#2997FF',
    color: '#fff',
    borderRadius: '5px',
    padding: '2px 5px',
    fontWeight: '500'
  },
  cardsect: { 
    display: 'flex', 
    justifyContent: 'space-around', 
    width: '100%',
    margin: '10px 0'
  },
  field: { fontSize: '14px', textAlign: 'center' },
  actionButtons: { 
    display: 'flex', 
    justifyContent: 'center', 
    gap: '10px', 
    marginTop: '15px',
    width: '100%'
  },
  refuserBtn: {
    padding: '6px 12px',
    backgroundColor: '#FBEAEA',
    color: '#D30000',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    flex: 1
  },
  accepterBtn: {
    padding: '6px 12px',
    backgroundColor: '#E6FAEB',
    color: '#239D49',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    flex: 1
  },
  statusBadge: {
    padding: '6px 12px',
    borderRadius: '10px',
    marginTop: '15px',
    width: '100%',
    textAlign: 'center',
    fontWeight: '500'
  },
  menuDots: { 
    position: 'absolute', 
    top: '15px', 
    right: '15px', 
    cursor: 'pointer' 
  },
  dropdownMenu: {
    position: 'absolute',
    top: '30px',
    right: '10px',
    backgroundColor: '#fff',
    boxShadow: '0 0 8px rgba(0,0,0,0.1)',
    borderRadius: '8px',
    zIndex: 5,
    overflow: 'hidden'
  },
  dropdownItem: {
    padding: '8px 12px',
    cursor: 'pointer',
    fontSize: '14px',
    borderBottom: '1px solid #eee'
  },
  confirmOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10
  },
  confirmBox: {
    backgroundColor: '#fff',
    padding: '20px 30px',
    borderRadius: '12px',
    textAlign: 'center',
    maxWidth: '300px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
  },
  confirmActions: {
    marginTop: '15px',
    display: 'flex',
    justifyContent: 'space-around'
  },
  cancelBtn: {
    padding: '8px 16px',
    borderRadius: '8px',
    border: '1px solid #ccc',
    backgroundColor: '#fff',
    cursor: 'pointer'
  },
  deleteBtn: {
    padding: '8px 16px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: '#e74c3c',
    color: '#fff',
    cursor: 'pointer'
  }
};

export default DemandeEntreprise;