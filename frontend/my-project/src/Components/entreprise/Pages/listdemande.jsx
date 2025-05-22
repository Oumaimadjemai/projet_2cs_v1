import React, { useState, useContext, useRef, useEffect, createContext } from 'react';
import { FiMoreVertical } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import AjouterEntreprise from '../Components/AjouterEntreprise';
import '../Styles/ListEntreprise.css'
import { AppContext } from '../../../App';
import '../../Partials/Components/i18n'
import { useTranslation } from 'react-i18next';
import { ReactComponent as SearchIcon } from '../../../Assets/Icons/Search.svg';
import { ReactComponent as CloseIcon } from '../../../Assets/Icons/close-rounded.svg';
import { ReactComponent as CheckIcon } from '../../../Assets/Icons/check-rounded.svg';
import { ReactComponent as CircleArrowIcon } from '../../../Assets/Icons/circle-left-arrow.svg';
import defaultAccountPicture from '../../../Assets/Images/default_picture.jpeg';
import { ReactComponent as EmptyIcon } from '../../../Assets/Icons/EmptyState.svg';
import axios from 'axios';

const ListDemandesContext = createContext();

const DemandeEntreprise = () => {
  const navigate = useNavigate();
  const [openMenu, setOpenMenu] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  const [showAddModal, setShowAddModal] = useState(false);
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

  const [cards, setCards] = useState([]);

  const { isRtl } = useContext(AppContext)

  const { t } = useTranslation();

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

  const [entreprises, setEntreprises] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {

    axios.get(`${process.env.REACT_APP_API_URL_SERVICE1}/entreprises/`)
      .then((res) => setEntreprises(res.data))
      .catch((err) => console.error('Axios Error', err))

  }, [])

  const filterdEntreprises = entreprises.filter((e) => e.statut === "pending")

  const [acceptClicked, setAcceptClicked] = useState(false)
  const [deleteClicked, setDeleteClicked] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  const [acceptEntreprise, setAcceptEntreprise] = useState(null);
  const [deleteEntreprise, setDeleteEntreprise] = useState(null)

  const handleAccepter = (e) => {
    e.preventDefault();

    setLoading(true)

    axios.patch(`${process.env.REACT_APP_API_URL_SERVICE1}/entreprises/${acceptEntreprise}/valider/`, {
      action: "approve"
    })
      .then(() => {
        setEntreprises(prevEntreprises =>
          prevEntreprises.filter(e => e.id !== acceptEntreprise)
        )
        setAcceptEntreprise(null)
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false))

    setAcceptClicked(false)
  }

  const [motif, setMotif] = useState("");

  const handleRefuse = (e) => {
    e.preventDefault();

    setLoading(true)
    axios.patch(`${process.env.REACT_APP_API_URL_SERVICE1}/entreprises/${deleteEntreprise}/valider/`, {
      action: "reject",
      motif_refus: motif
    })
      .then(() => {
        setEntreprises(prevEntreprises =>
          prevEntreprises.filter(e => e.id !== deleteEntreprise)
        )
        setAcceptEntreprise(null)
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false))

    setConfirmDelete(false)
    setMotif("")
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


  return (
    <ListDemandesContext.Provider value={{ motif, setMotif }}>
      <div style={styles.page}>
        <div style={styles.header}>
          <h2 style={styles.title}>
            Les Demandes d'entreprises <span style={{ color: '#888' }}>{filterdEntreprises.length}</span>
          </h2>
          <div style={styles.btnGroup}>
            <button className="precedent-btn" onClick={() => navigate('/admin/entreprises')}>
              <CircleArrowIcon className={`${isRtl ? "rtl-icon" : ""}`} />
              {t('parametresPage.precedent')}
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

        <div className="recherche-entreprises-line" style={{ minHeight: "43px" }}>
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

        {filterEntreprises.length === 0 ? (
          <div style={styles.noResult}>Aucun résultat trouvé</div>
        ) : (
          <div style={styles.grid}>
            {filterEntreprises.map((d) => (
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
                  <img src={d.photo_profil ? d.photo_profil : defaultAccountPicture} alt="company" style={styles.image} />
                </div>

                <div style={styles.cardTitle}>
                  {d.nom}
                  <span style={styles.nouveauBadge}>Nvl</span>
                </div>

                <div style={styles.cardsect}>
                  <div style={styles.field}>
                    Secteur<br />
                    <span style={{ color: d.secteurColor, fontWeight: '600' }}>{d.secteur_activite}</span>
                  </div>
                  <div style={styles.field}>
                    Représentant<br />
                    <span style={{ color: "#4F4F4F" }}>
                      {d.representant_nom} {d.representant_prenom}
                    </span>

                  </div>
                </div>

                {d.statut === 'pending' ? (
                  <div className='btns-card-line' style={styles.actionButtons}>
                    <button className='supprimer-btn' onClick={() => { setDeleteClicked(true); setDeleteEntreprise(d.id) }}>
                      <CloseIcon style={{ marginRight: "5px" }} />
                      <span style={{ fontFamily: 'Nunito, sans-serif', fontSize: "1.1rem", fontWeight: "650" }}>
                        Refuser
                      </span>
                    </button>
                    <div style={{ height: "100%", width: "2px", backgroundColor: "#E4E4E4" }} />
                    <button className='accept-btn' onClick={() => { setAcceptClicked(true); setAcceptEntreprise(d.id) }}>
                      <CheckIcon style={{ marginRight: "5px" }} />
                      <span style={{ fontFamily: 'Nunito, sans-serif', fontSize: "1.1rem", fontWeight: "650" }}>
                        Accepter
                      </span>
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
            {showAddModal && (
              <AjouterEntreprise onClose={() => setShowAddModal(false)} onAdd={handleAddEntreprise} />
            )}
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
                  onClick={(e) => handleRefuse(e)}
                >
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        )}

        {
          acceptClicked && (
            <div style={styles.confirmOverlay}>
              <div className="add-departement-success">
                <div className="img-container" style={{ height: "90px", width: "150px" }}>
                  <EmptyIcon style={{ height: "100%", width: "100%" }} />
                </div>
                <span style={{ width: "95%", fontFamily: "Kumbh Sans, sans-serif", textAlign: "center", fontSize: "1.1rem", fontWeight: "500" }}>
                  Êtes-vous certain(e) de vouloir accepter cette entreprise ?
                </span>
                <div
                  className="btns-line"
                >
                  <button
                    style={{
                      color: "#000",
                      background: "#E2E4E5"
                    }}
                    onClick={() => { setAcceptClicked(false) }}
                  >
                    Annuler
                  </button>
                  <button
                    style={{

                    }}
                    onClick={(e) => { handleAccepter(e); }}
                  >
                    Confirmer
                  </button>
                </div>
              </div>
            </div>
          )
        }

        {
          confirmDelete &&
          <div style={styles.confirmOverlay}>
            <div className="add-departement-success">
              <div className="img-container" style={{ height: "90px", width: "150px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="30" cy="30" r="30" fill="#FFD21E" />
                  <path d="M29.5001 15.75V34.0833M29.6147 43.25V43.4792H29.3855V43.25H29.6147Z" stroke="white" stroke-width="5.5" stroke-linecap="round" stroke-linejoin="round" />
                </svg>

              </div>
              <span style={{ width: "95%", fontFamily: "Kumbh Sans, sans-serif", textAlign: "center", fontSize: "1.1rem", fontWeight: "500" }}>
                Êtes-vous sûr(e) de vouloir refuser cette entreprise ? Cette action est irréversible.
              </span>
              <div
                className="btns-line"
              >
                <button
                  style={{
                    color: "#000",
                    background: "#E2E4E5"
                  }}
                  onClick={(e) => { setConfirmDelete(false); setMotif("") }}
                >
                  Annuler
                </button>
                <button
                  style={{
                    background: "#D9534F"
                  }}
                  onClick={(e) => handleRefuse(e)}
                >
                  Refusé
                </button>
              </div>
            </div>
          </div>
        }
        {
          deleteClicked && <RefuserForm annulerRefuser={() => { setDeleteClicked(false); setMotif("") }} refuseAlert={() => { setDeleteClicked(false); setConfirmDelete(true) }} />
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

      </div>
    </ListDemandesContext.Provider>
  );
};

const RefuserForm = ({ annulerRefuser, refuseAlert }) => {

  const { motif, setMotif } = useContext(ListDemandesContext)

  const motifRef = useRef('')

  const handleMotifText = () => {

    if (motifRef.current) {
      motifRef.current.style.height = 'auto';
      motifRef.current.style.height = `${motifRef.current.scrollHeight}px`;
    }
  };

  const passMotif = (e) => {
    e.preventDefault();
    refuseAlert();
  }

  return (
    <div className="refuse-theme-form">
      <h1 style={{ fontSize: "1.2rem", fontFamily: "Kumbh Sans, sans-serif", color: "#4F4F4F", fontWeight: "550" }}>
        Refuser Thème
      </h1>
      <form action="" onSubmit={passMotif}>
        <div className="input-flex-refuseTheme">
          <label style={{ fontFamily: "Kumbh Sans, sans-serif", fontWeight: "500", fontSize: "1.05rem", color: "#00000080" }}>
            Motif
          </label>
          <textarea
            placeholder='Entrez votre motif'
            ref={motifRef}
            value={motif}
            onChange={(e) => { handleMotifText(); setMotif(e.target.value) }}
            required
          />
        </div>
        <div className="btns-line-form" style={{ display: 'flex', gap: "0.5rem", marginTop: "20px" }}>
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
            type='submit'
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
          >
            OK
          </button>
        </div>
      </form>
    </div>
  )
}

const styles = {
  page: { fontFamily: "'Poppins', sans-serif", backgroundColor: '#fff', paddingRight: "12px", paddingLeft: "1rem" },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
  title: { fontSize: "1.6rem", fontWeight: "600", color: "#4F4F4F" },
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
  btnGroup: { display: 'flex', gap: '10px' },
  demandeLink: {
    color: "#925FE2",
    background: "transparent",
    fontSize: "1rem",
    fontWeight: "600"
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
    width: '270px',
    backgroundColor: '#fff',
    borderRadius: '15px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
    padding: '20px 10px',
    position: 'relative',
    minHeight: '300px',
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-evenly"
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
    fontWeight: '800',
    fontSize: '1.2rem',
    marginTop: '10px',
    fontFamily: 'Nunito, sans-serif',
    textTransform: "capitalize",
    display: "flex",
    alignItems: "center",
    gap: "5px"
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
    width: "90%",
    justifyContent: 'space-between',
    fontFamily: 'Nunito, sans-serif',
    fontWeight: "700",
    color: "#A7A7A7",
    fontSize: "18px",
    marginTop: "0.6rem"
  },
  field: { fontSize: '14px', textAlign: 'center' },
  actionButtons: {
    display: 'flex',
    justifyContent: 'center',
    gap: '10px',
    marginTop: '40px',
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
  dropdownMenu: { position: 'absolute', top: '30px', left: '60%', backgroundColor: '#fff', boxShadow: '0 0 8px rgba(0,0,0,0.1)', borderRadius: '8px', zIndex: 5 },
  dropdownItem: { padding: '8px 12px', cursor: 'pointer', fontSize: '14px', borderBottom: '1px solid #eee', textAlign: "center" },
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