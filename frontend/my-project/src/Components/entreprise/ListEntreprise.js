import React, { useState } from 'react';
import { FiMail, FiPhone, FiMoreVertical } from 'react-icons/fi';
import { HiOutlineLocationMarker } from 'react-icons/hi';

import AjouterEntreprise from './AjouterEntreprise';
import { useNavigate } from 'react-router-dom';

const EntrepriseList = () => {
  const initialCards = [
    {name:'Algeria DZ',secteur:'Informatique',secteurColor:'#2997FF',representant:' Bensalem',email:'techdz@example.com',phone:'+213550000001',address:'Alger Centre',image:'https://i.pravatar.cc/80?img=11'},
    {name:'univer',secteur:'Santé',secteurColor:'#2ECC71',representant:'Amin',email:'techsante@example.com',phone:'+213550000002',address:'Bab Ezzouar',image:'https://i.pravatar.cc/80?img=12'},
    {name:'TechInnov DZ',secteur:'Informatique',secteurColor:'#2997FF',representant:'Narin',email:'techdz@example.com',phone:'+213550000001',address:'Alger Centre',image:'https://i.pravatar.cc/80?img=11'},
    {name:'TechInnov',secteur:'Santé',secteurColor:'#2ECC71',representant:'narimane taibi',email:'techsante@example.com',phone:'+213550000002',address:'Bab Ezzouar',image:'https://i.pravatar.cc/80?img=12'}
  ];

  const [showAddModal, setShowAddModal] = useState(false);
  const [cards, setCards] = useState(initialCards);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBy, setFilterBy] = useState('all');
  const [openMenu, setOpenMenu] = useState(null);
  const [confirmDeleteIdx, setConfirmDeleteIdx] = useState(null);
  const navigate = useNavigate();

  const handleSearch = e => setSearchTerm(e.target.value);
  const handleFilterChange = e => setFilterBy(e.target.value);

  const filteredCards = cards.filter(card => {
    const nomEntreprise = (card.name || '').toLowerCase();
    const nomRepresentant = (card.representant || '').toLowerCase();
    const term = searchTerm.toLowerCase();

    if (filterBy === 'nom') {
      return nomEntreprise.includes(term);
    } else if (filterBy === 'representant') {
      return nomRepresentant.includes(term);
    } else {
      return nomEntreprise.includes(term) || nomRepresentant.includes(term);
    }
  });

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

  const handleDelete = idx => {
    setCards(cards.filter((_, i) => i !== idx));
    setConfirmDeleteIdx(null);
  };

  return (
    <div style={styles.page}>
      <div style={styles.content}>
        <div style={styles.header}>
          <div style={styles.title}>Tous les entreprises <span style={{color:'#888'}}>{cards.length}</span></div>
          <div style={styles.btnGroup}>
            <button style={styles.button} onClick={() => navigate('/demandeEntreprise')}>Demande Entreprise</button>
            <button style={styles.button} onClick={() => setShowAddModal(true)}>+ Ajouter Entreprise</button>
          </div>
        </div>

        <div style={styles.searchFilter}>
          <select onChange={handleFilterChange} value={filterBy} style={styles.select}>
            <option value="all">Tous</option>
            <option value="nom">Nom Entreprise</option>
            <option value="representant">Nom Représentant</option>
          </select>
          <input type="text" placeholder="Rechercher..." value={searchTerm} onChange={handleSearch} style={styles.search}/>
        </div>

        <div style={styles.grid}>
          {filteredCards.map((card, idx) => (
            <div key={idx} style={styles.card}>
              <div style={styles.menuDots} onClick={() => setOpenMenu(openMenu === idx ? null : idx)}>
                <FiMoreVertical />
                {openMenu === idx && (
                  <div style={styles.dropdownMenu}>
                    <div style={styles.dropdownItem}>Modifier</div>
                    <div style={{...styles.dropdownItem,color:'red'}} onClick={() => setConfirmDeleteIdx(idx)}>Supprimer</div>
                  </div>
                )}
              </div>
              <img src={card.image} alt="company" style={styles.image}/>
              <div style={styles.cardTitle}>{card.name}</div>
              <div style={styles.cardsect}>
                <div style={styles.field}>Secteur<br/><span style={{...styles.secteur,color:card.secteurColor}}>{card.secteur}</span></div>
                <div style={styles.field}>Représentant<br/>{card.representant}</div>
              </div>
              <div style={styles.iconRow}>
                <a href={`mailto:${card.email}`} style={styles.iconBtn}><FiMail/> Email</a>
                <a href={`tel:${card.phone}`} style={styles.iconBtn}><FiPhone/> Appel</a>
              </div>
              <a style={styles.addressLink} href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(card.address)}`} target="_blank" rel="noopener noreferrer">
                <HiOutlineLocationMarker style={{marginRight:'5px'}}/>{card.address}
              </a>
              {confirmDeleteIdx === idx && (
                <div style={styles.confirmOverlay}>
                  <div style={styles.confirmBox}>
                    <p>Voulez-vous vraiment supprimer cette entreprise ?</p>
                    <div style={styles.confirmActions}>
                      <button style={styles.cancelBtn} onClick={() => setConfirmDeleteIdx(null)}>Annuler</button>
                      <button style={styles.deleteBtn} onClick={() => handleDelete(idx)}>Supprimer</button>
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
            <AjouterEntreprise onClose={() => setShowAddModal(false)} onAdd={handleAddEntreprise}/>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  page: {fontFamily:"'Poppins', sans-serif",backgroundColor:'#fff',padding:'30px',display:'flex'},
  content: {flex:1,padding:'30px'},
  header: {display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'20px'},
  title: {fontSize:'24px',fontWeight:'600'},
  btnGroup: {display:'flex',gap:'10px'},
  button: {padding:'10px 20px',borderRadius:'20px',border:'none',background:'linear-gradient(to right, #925FE2, #8F5DE2)',color:'#fff',fontWeight:'500',cursor:'pointer'},
  searchFilter: {display:'flex',alignItems:'center',marginBottom:'30px',gap:'10px'},
  filter: {padding:'8px 15px',borderRadius:'20px',border:'1px solid #ccc',background:'#f9f9f9',cursor:'pointer'},
  select: {padding:'10px 15px',borderRadius:'20px',border:'1px solid #ccc',fontSize:'14px'},
  search: {flex:1,padding:'10px 15px',borderRadius:'20px',border:'1px solid #ccc',fontSize:'14px'},
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
  }
,    image: {width:'80px',height:'80px',borderRadius:'50%',objectFit:'cover',display:'block',margin:'0 auto'},
  cardTitle: {textAlign:'center',fontWeight:'600',fontSize:'16px',marginTop:'10px'},
  cardsect: {display:'flex',justifyContent:'space-around'},
  field: {marginTop:'10px',fontSize:'14px',textAlign:'center'},
  secteur: {fontWeight:'500',textDecoration:'underline'},
  iconRow: {marginTop:'15px',display:'flex',justifyContent:'center',gap:'10px'},
  iconBtn: {display:'flex',alignItems:'center',padding:'6px 10px',borderRadius:'10px',border:'1px solid #ccc',background:'#f8f8f8',fontSize:'14px',cursor:'pointer',gap:'6px',textDecoration:'none',color:'#000'},
  addressLink: {textAlign:'center',marginTop:'10px',fontSize:'13px',color:'#444',textDecoration:'none',display:'flex',justifyContent:'center',alignItems:'center'},
  menuDots: {position:'absolute',top:'15px',right:'15px',cursor:'pointer',fontWeight:'bold',fontSize:'18px'},
  dropdownMenu: {position:'absolute',top:'30px',right:'10px',backgroundColor:'#fff',boxShadow:'0 0 8px rgba(0,0,0,0.1)',borderRadius:'8px',zIndex:5},
  dropdownItem: {padding:'8px 12px',cursor:'pointer',fontSize:'14px',borderBottom:'1px solid #eee'},
  confirmOverlay: {position:'fixed',top:0,left:0,right:0,bottom:0,backgroundColor:'rgba(0,0,0,0.4)',display:'flex',justifyContent:'center',alignItems:'center',zIndex:10},
  confirmBox: {backgroundColor:'#fff',padding:'20px 30px',borderRadius:'12px',textAlign:'center',maxWidth:'300px',boxShadow:'0 4px 15px rgba(0,0,0,0.2)'},
  confirmActions: {marginTop:'15px',display:'flex',justifyContent:'space-around'},
  cancelBtn: {padding:'8px 16px',borderRadius:'8px',border:'1px solid #ccc',backgroundColor:'#fff',cursor:'pointer'},
  deleteBtn: {padding:'8px 16px',borderRadius:'8px',border:'none',backgroundColor:'#e74c3c',color:'#fff',cursor:'pointer'},
  modalOverlay: {position:'fixed',top:0,left:0,right:0,bottom:0,backgroundColor:'rgba(0,0,0,0.3)',display:'flex',justifyContent:'center',alignItems:'center',zIndex:1000},
  modalWindow: {background:'#fff',borderRadius:'12px',padding:'20px',width:'800px',maxHeight:'90vh',overflowY:'auto'}
};

export default EntrepriseList;
