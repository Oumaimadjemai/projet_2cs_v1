import React, { useState } from 'react';
import { FaCalendarAlt, FaSearch } from 'react-icons/fa';
import { IoTimeOutline } from "react-icons/io5";
import { MdCalendarMonth } from "react-icons/md";

const RendezVousPage = () => {
  const [rendezVous] = useState([
  ]);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBy, setFilterBy] = useState('all');

  const handleSearch = e => setSearchTerm(e.target.value);
  const handleFilterChange = e => setFilterBy(e.target.value);

  const filteredRendezVous = rendezVous.filter(item => {
    const searchTermLower = searchTerm.toLowerCase();
     if (filterBy === 'salle') {
      return item.salle.toLowerCase().includes(searchTermLower);
    } else {
      return (
        item.salle.toLowerCase().includes(searchTermLower)
      )}
  });

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.title}>Rendez-vous <span style={{color:'#888'}}>{rendezVous.length}</span></div>
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
          </div>
        ))
      ) : (
        <div style={styles.emptyState}>
          <FaCalendarAlt style={styles.emptyIcon} />
          <p style={styles.emptyText}>Aucun rendez-vous programmé</p>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: { 
    padding: 20, 
    fontFamily: "'Poppins', sans-serif",
    backgroundColor: '#fff'
  },
  header: { 
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: '20px' 
  },
  title: {
    fontSize: '24px',
    fontWeight: '600'
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
    fontSize: '14px'
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
    marginRight: 10
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
    padding: '20px',
    position: 'relative'
  },
  cardHeader: { 
    backgroundColor: '#E5D9F6', 
    padding: 12, 
    fontWeight: 'bold', 
    display: 'flex', 
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: '12px'
  },
  cardBody: { padding: 10 },
  cardRow: { display: 'flex', justifyContent: 'space-between' },
  iconText: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  icon: {
    color: '#925FE2',
    fontSize: '18px'
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '70px 20px',
    textAlign: 'center',
    boxShadow: '0 4px 16px rgba(0,0,0,0.1)' ,
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
  }
};

export default RendezVousPage;