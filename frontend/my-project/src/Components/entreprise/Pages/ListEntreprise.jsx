import React, { useState, useContext, useRef, useEffect, createContext } from 'react';
import { FiMail, FiPhone, FiMoreVertical } from 'react-icons/fi';
import { HiOutlineLocationMarker } from 'react-icons/hi';

import AjouterEntreprise from '../Components/AjouterEntreprise';
import { Outlet, useNavigate } from 'react-router-dom';
import '../Styles/ListEntreprise.css'
import { AppContext } from '../../../App';
import { ReactComponent as SearchIcon } from '../../../Assets/Icons/Search.svg';
import '../../Partials/Components/i18n'
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import defaultAccountPicture from '../../../Assets/Images/default_picture.jpeg';

export const EntrepriseListLayout = () => {
  return (
    <div className='entreprises-container'>
      <Outlet />
    </div>
  )
}

export const EntrepriseContext = createContext();

const EntrepriseList = () => {

  const { isRtl } = useContext(AppContext)

  const { t } = useTranslation();

  const [entreprises, setEntreprises] = useState([])

  useEffect(() => {

    axios.get(`${process.env.REACT_APP_API_URL_SERVICE1}/entreprises/`)
      .then((res) => setEntreprises(res.data))
      .catch((err) => console.error('Axios Error', err))

  }, [])

  const filterdEntreprises = entreprises.filter((e) => e.statut === "approved")

  const initialCards = [
    { name: 'Algeria DZ', secteur: 'Informatique', secteurColor: '#2997FF', representant: ' Bensalem', email: 'techdz@example.com', phone: '+213550000001', address: 'Alger Centre', image: 'https://i.pravatar.cc/80?img=11' },
    { name: 'univer', secteur: 'Santé', secteurColor: '#2ECC71', representant: 'Amin', email: 'techsante@example.com', phone: '+213550000002', address: 'Bab Ezzouar', image: 'https://i.pravatar.cc/80?img=12' },
    { name: 'TechInnov DZ', secteur: 'Informatique', secteurColor: '#2997FF', representant: 'Narin', email: 'techdz@example.com', phone: '+213550000001', address: 'Alger Centre', image: 'https://i.pravatar.cc/80?img=11' },
    { name: 'TechInnov', secteur: 'Santé', secteurColor: '#2ECC71', representant: 'narimane taibi', email: 'techsante@example.com', phone: '+213550000002', address: 'Bab Ezzouar', image: 'https://i.pravatar.cc/80?img=12' }
  ];

  const [showAddModal, setShowAddModal] = useState(false);
  const [cards, setCards] = useState(initialCards);
  const [openMenu, setOpenMenu] = useState(null);
  const [confirmDeleteIdx, setConfirmDeleteIdx] = useState(null);
  const navigate = useNavigate();

  const handleAddEntreprise = newEntreprise => setCards([...cards, {
    name: newEntreprise.nomEntreprise || 'Nouvelle Entreprise',
    secteur: newEntreprise.secteurActivite || 'Non spécifié',
    secteurColor: '#2997FF',
    representant: `${newEntreprise.nomRepresentant || ''} ${newEntreprise.prenomRepresentant || ''}`.trim() || 'Non spécifié',
    email: newEntreprise.emailRepresentant || 'Aucun email',
    phone: newEntreprise.telephoneRepresentant || 'Aucun téléphone',
    address: `${newEntreprise.ville || ''}, ${newEntreprise.wilaya || ''}`.trim() || 'Adresse non spécifiée',
    image: 'https://i.pravatar.cc/80?img=15'
  }], setShowAddModal(false));

  const dropRef = useRef('');

  useEffect(() => {

    const handleSwitchDrop = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) {
        setOpenMenu(null)
      }
    }

    document.addEventListener('mousedown', handleSwitchDrop);
    return () => {
      document.removeEventListener('mousedown', handleSwitchDrop)
    }

  }, [])

  const [loading, setLoading] = useState(false)

  const handleRefuse = (e) => {
    e.preventDefault();

    setLoading(true)
    axios.delete(`${process.env.REACT_APP_API_URL_SERVICE1}/entreprises/${confirmDeleteIdx}/delete/`, {
      action: "refuse"
    })
      .then(() => {
        setEntreprises(prevEntreprises =>
          prevEntreprises.filter(e => e.id !== confirmDeleteIdx)
        )
        setConfirmDeleteIdx(null)
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false))

    setConfirmDeleteIdx(null)
  }

  const [searchTerm, setSearchTerm] = useState('');

  const filterEntreprises = filterdEntreprises.filter(e => {
    const search = searchTerm.toLowerCase();
    return (
      e.nom.toLowerCase().startsWith(search) ||
      e.secteur_activite.toLowerCase().startsWith(search) ||
      e.representant_nom.toLowerCase().startsWith(search) ||
      e.representant_prenom.toLowerCase().startsWith(search)
    );
  });

  const exportToExcel = (e) => {
    e.preventDefault();
    axios({
      url: `${process.env.REACT_APP_API_URL_SERVICE1}/export/entreprises/excel/`,
      method: 'GET',
      responseType: 'blob',
    })
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'entreprises.xlsx');
        document.body.appendChild(link);
        link.click();

        window.URL.revokeObjectURL(url);
        document.body.removeChild(link);
      })
      .catch((err) => {
        console.error('Erreur de téléchargement:', err);
        if (err.response) {
          console.error('Détails:', err.response.data);
        }
      });
  };


  return (
    <EntrepriseContext.Provider value={{ setEntreprises }}>
      <div style={styles.page}>
        <div style={styles.content}>
          <div style={styles.header}>
            <div style={styles.title}>Tous les Entreprises <span style={{ color: "#A7A7A7", marginLeft: "5px" }}>{entreprises.length}</span></div>

            <div style={styles.btnGroup}>
              <button
                style={{ color: "#FFF", fontWeight: "500", fontFamily: "Kumbh Sans, sans-serif", background: "#925FE2", padding: "1px 15px", borderRadius: "40px", fontSize: "0.9rem" }}
                onClick={(e) => exportToExcel(e)}
              >
                Export to Excel
              </button>
              <button
                style={{ ...styles.button, ...styles.demandeLink }}
                onClick={() => navigate('/admin/entreprises/demandes')}
              >
                Demande Entreprise
                <svg width="8" height="14" viewBox="0 0 8 14" fill="none" style={{ marginLeft: "8px" }} xmlns="http://www.w3.org/2000/svg">
                  <path d="M5.47225 6.92554L0.28125 1.69653C0.0963424 1.51049 -0.00744629 1.25889 -0.00744629 0.996582C-0.00744629 0.734277 0.0963424 0.482554 0.28125 0.296509C0.372001 0.204867 0.48001 0.132166 0.599045 0.0825195C0.718079 0.0328729 0.845774 0.00732422 0.974747 0.00732422C1.10372 0.00732422 1.23141 0.0328729 1.35045 0.0825195C1.46948 0.132166 1.5775 0.204867 1.66825 0.296509L7.55325 6.22461C7.73815 6.41065 7.84194 6.66226 7.84194 6.92456C7.84194 7.18687 7.73815 7.43847 7.55325 7.62451L1.66825 13.5526C1.5775 13.6443 1.46948 13.717 1.35045 13.7666C1.23141 13.8162 1.10372 13.8418 0.974747 13.8418C0.845774 13.8418 0.718079 13.8162 0.599045 13.7666C0.48001 13.717 0.372001 13.6443 0.28125 13.5526C0.0965847 13.3664 -0.0070343 13.1148 -0.0070343 12.8525C-0.0070343 12.5903 0.0965847 12.3388 0.28125 12.1526L5.47225 6.92554Z" fill="#925FE2" />
                </svg>
              </button>
              <button
                style={styles.button}
                onClick={() => setShowAddModal(true)}
              >
                <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M11 13.5H6C5.71667 13.5 5.47934 13.404 5.288 13.212C5.09667 13.02 5.00067 12.7827 5 12.5C4.99934 12.2173 5.09534 11.98 5.288 11.788C5.48067 11.596 5.718 11.5 6 11.5H11V6.5C11 6.21667 11.096 5.97934 11.288 5.788C11.48 5.59667 11.7173 5.50067 12 5.5C12.2827 5.49934 12.5203 5.59534 12.713 5.788C12.9057 5.98067 13.0013 6.218 13 6.5V11.5H18C18.2833 11.5 18.521 11.596 18.713 11.788C18.905 11.98 19.0007 12.2173 19 12.5C18.9993 12.7827 18.9033 13.0203 18.712 13.213C18.5207 13.4057 18.2833 13.5013 18 13.5H13V18.5C13 18.7833 12.904 19.021 12.712 19.213C12.52 19.405 12.2827 19.5007 12 19.5C11.7173 19.4993 11.48 19.4033 11.288 19.212C11.096 19.0207 11 18.7833 11 18.5V13.5Z" fill="white" />
                </svg>
                Ajouter Entreprise
              </button>
            </div>
          </div>
          <div className="recherche-entreprises-line">
            <div className="recherche-entreprises-input">
              <button
                style={{
                  borderRight: isRtl ? "none" : "2px solid #D9E1E7",
                  borderLeft: isRtl ? "2px solid #D9E1E7" : "none",
                }}
              >
                {t('enseignantsPage.filterBtn')}
                <svg width="0.9rem" height="0.5rem" viewBox="0 0 15 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7.742 6.05489L12.971 0.863892C13.1571 0.678984 13.4087 0.575195 13.671 0.575195C13.9333 0.575195 14.185 0.678984 14.371 0.863892C14.4627 0.954642 14.5354 1.06265 14.585 1.18169C14.6347 1.30072 14.6602 1.42842 14.6602 1.55739C14.6602 1.68636 14.6347 1.81406 14.585 1.93309C14.5354 2.05212 14.4627 2.16014 14.371 2.25089L8.44293 8.13589C8.25689 8.32079 8.00529 8.42458 7.74298 8.42458C7.48068 8.42458 7.22908 8.32079 7.04303 8.13589L1.11493 2.25089C1.02329 2.16014 0.950587 2.05212 0.90094 1.93309C0.851293 1.81406 0.825745 1.68636 0.825745 1.55739C0.825745 1.42842 0.851293 1.30072 0.90094 1.18169C0.950587 1.06265 1.02329 0.954642 1.11493 0.863892C1.3011 0.679226 1.55278 0.575607 1.815 0.575607C2.07723 0.575607 2.32878 0.679226 2.51495 0.863892L7.742 6.05489Z" fill="#925FE2" />
                </svg>
              </button>
              <div className="input-line">
                <SearchIcon />
                <input
                  type="text"
                  placeholder={t('etudiantsPage.searchPlaceholder')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div style={styles.grid}>
            {filterEntreprises.map((card, idx) => (
              <div key={idx} style={styles.card}>
                <div style={styles.menuDots} onClick={() => setOpenMenu(openMenu === idx ? null : idx)}>
                  <FiMoreVertical />
                  {openMenu === idx && (
                    <div style={styles.dropdownMenu} ref={dropRef}>
                      <div style={styles.dropdownItem}>Modifier</div>
                      <div style={{ ...styles.dropdownItem, color: 'red' }} onClick={() => setConfirmDeleteIdx(card.id)}>Supprimer</div>
                    </div>
                  )}
                </div>
                <img src={card.photo_profil ? card.photo_profil : defaultAccountPicture} alt="company" style={styles.image} />
                <div style={styles.cardTitle}>{card.nom}</div>
                <div style={styles.cardsect}>
                  <div style={styles.field}>Secteur<br /><span style={{ ...styles.secteur, color: card.secteurColor }}>{card.secteur_activite}</span></div>
                  <div style={styles.field}>Représentant<br /> <span style={{ color: "#4F4F4F" }}>{card.representant_nom} {card.representant_prenom}</span></div>
                </div>
                <div style={styles.iconRow}>
                  <a href={`mailto:${card.email}`} style={styles.iconBtn}><FiMail /> Email</a>
                  <a href={`tel:${card.phone}`} style={{ ...styles.iconBtn, backgroundColor: "#D9EAFD" }}><FiPhone /> Appel</a>
                </div>
                <a style={styles.addressLink} href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(card.addresse)}`} target="_blank" rel="noopener noreferrer">
                  <HiOutlineLocationMarker style={{ marginRight: '5px' }} />{card.adresse}
                </a>
                {confirmDeleteIdx === card.id && (
                  <div style={styles.confirmOverlay}>
                    <div style={styles.confirmBox}>
                      <p>Voulez-vous vraiment supprimer cette entreprise ?</p>
                      <div style={styles.confirmActions}>
                        <button style={styles.cancelBtn} onClick={() => setConfirmDeleteIdx(null)}>Annuler</button>
                        <button style={styles.deleteBtn} onClick={(e) => handleRefuse(e)}>Supprimer</button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        {showAddModal && (
          <div style={styles.modalOverlay}>
            <div style={styles.modalWindow}>
              <AjouterEntreprise onClose={() => setShowAddModal(false)} onAdd={handleAddEntreprise} />
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
                <p className="loader-text">Opération en cours...</p>
              </div>
            </div>
          )
        }
      </div>
    </EntrepriseContext.Provider>
  );
};

const styles = {
  page: { fontFamily: "'Poppins', sans-serif", backgroundColor: '#fff', display: 'flex' },
  content: { flex: 1, paddingRight: "12px", paddingLeft: "1rem" },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
  title: { fontSize: "1.6rem", fontWeight: "600", color: "#4F4F4F" },
  btnGroup: { display: 'flex', gap: '10px' },
  button: {
    padding: '10px 12px',
    borderRadius: '22px',
    border: 'none',
    background: 'linear-gradient(to right, #925FE2, #8F5DE2)',
    color: '#fff',
    fontWeight: '500',
    fontSize: "0.9rem",
    cursor: 'pointer',
    fontFamily: "Kumbh Sans, sans-serif",
    display: "flex",
    alignItems: "center",
    gap: "5px"
  },
  demandeLink: {
    color: "#925FE2",
    background: "transparent",
    fontSize: "1rem",
    fontWeight: "600"
  },
  searchFilter: { display: 'flex', alignItems: 'center', marginBottom: '30px', gap: '10px' },
  filter: { padding: '8px 15px', borderRadius: '20px', border: '1px solid #ccc', background: '#f9f9f9', cursor: 'pointer' },
  select: { padding: '10px 15px', borderRadius: '20px', border: '1px solid #ccc', fontSize: '14px' },
  search: { flex: 1, padding: '10px 15px', borderRadius: '20px', border: '1px solid #ccc', fontSize: '14px' },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, 280px)',
    gap: '20px',
    justifyContent: 'center',
  },
  card: {
    width: '270px',
    backgroundColor: '#fff',
    borderRadius: '15px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
    padding: '10px 10px',
    position: 'relative',
    minHeight: '300px',
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center"
  }
  , image: { width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', display: 'block', margin: '0 auto' },
  cardTitle: { textAlign: 'center', fontWeight: '800', fontSize: '1.2rem', marginTop: '10px', fontFamily: 'Nunito, sans-serif', textTransform: "capitalize" },
  cardsect: { display: 'flex', width: "90%", justifyContent: 'space-between', fontFamily: 'Nunito, sans-serif', fontWeight: "700", color: "#A7A7A7", fontSize: "18px" },
  field: { marginTop: '10px', fontSize: '14px', textAlign: 'center' },
  secteur: { fontWeight: '500', textDecoration: 'underline' },
  iconRow: { marginTop: '15px', display: 'flex', justifyContent: 'center', gap: '20px' },
  iconBtn: { display: 'flex', alignItems: 'center', padding: '6px 10px', borderRadius: '10px', border: '1px solid #ccc', background: '#f8f8f8', fontSize: '14px', cursor: 'pointer', gap: '6px', textDecoration: 'none', color: '#000' },
  addressLink: { textAlign: 'center', marginTop: '10px', fontSize: '13px', color: '#444', textDecoration: 'none', display: 'flex', justifyContent: 'center', alignItems: 'center' },
  menuDots: { position: 'absolute', top: '15px', right: '15px', cursor: 'pointer', fontWeight: 'bold', fontSize: '18px' },
  dropdownMenu: { position: 'absolute', top: '30px', left: '60%', backgroundColor: '#fff', boxShadow: '0 0 8px rgba(0,0,0,0.1)', borderRadius: '8px', zIndex: 5 },
  dropdownItem: { padding: '8px 12px', cursor: 'pointer', fontSize: '14px', borderBottom: '1px solid #eee', textAlign: "center" },
  confirmOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.4)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 10 },
  confirmBox: { backgroundColor: '#fff', padding: '20px 30px', borderRadius: '12px', textAlign: 'center', maxWidth: '300px', boxShadow: '0 4px 15px rgba(0,0,0,0.2)' },
  confirmActions: { marginTop: '15px', display: 'flex', justifyContent: 'space-around' },
  cancelBtn: { padding: '8px 16px', borderRadius: '8px', border: '1px solid #ccc', backgroundColor: '#fff', cursor: 'pointer' },
  deleteBtn: { padding: '8px 16px', borderRadius: '8px', border: 'none', backgroundColor: '#e74c3c', color: '#fff', cursor: 'pointer' },
  modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.3)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 },
  modalWindow: { background: '#fff', borderRadius: '12px', padding: '20px', width: '800px', maxHeight: '90vh', overflowY: 'auto' }
};

export default EntrepriseList;
