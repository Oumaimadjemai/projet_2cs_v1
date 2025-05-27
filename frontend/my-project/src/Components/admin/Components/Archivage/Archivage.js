import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUsers, FaCalendarAlt, FaBook, FaGraduationCap} from 'react-icons/fa';
//data
const statsData = {
  1: {
    groups: 24,
    periods: {
      depot: '01/10/2020 - 15/11/2020',
      soutenance: '15/06/2021 - 30/06/2021'
    },
    themes: 45,
    defenses: 90
  },
  2: {
    groups: 22,
    periods: {
      depot: '01/10/2021 - 15/11/2021',
      soutenance: '15/06/2022 - 30/06/2022'
    },
    themes: 41,
    defenses: 85
  }
};

const statsIcons = {
  groups: <FaUsers />,
  periods: <FaCalendarAlt />,
  themes: <FaBook />,
  defenses: <FaGraduationCap />
};

const labels = {
  groups: 'Groupes',
  periods: 'Périodes',
  themes: 'Thèmes',
  defenses: 'Soutenances'
};

const ArchivagePage = () => {
  const [selectedYear, setSelectedYear] = useState(1);
  const [isHovered, setIsHovered] = useState({});
  const navigate = useNavigate();

  const handleMouseEnter = (index) => {
    setIsHovered(prev => ({ ...prev, [index]: true }));
  };

  const handleMouseLeave = (index) => {
    setIsHovered(prev => ({ ...prev, [index]: false }));
  };

  const handleCardClick = (key) => {
    switch(key) {
      case 'groups':
        navigate('/admin/groupes');
        break;
      case 'themes':
        navigate('/admin/themes');
        break;
      case 'defenses':
        navigate('/admin/soutenances');
        break;
      default:
        break;
    }
  };

  const styles = {
    container: {
      padding: '40px',
      fontFamily: 'Segoe UI, system-ui, -apple-system, sans-serif',
      backgroundColor: '#f7f9fc',
      minHeight: '100vh',
      maxWidth: '1200px',
      margin: '0 auto'
    },
    title: {
      fontSize: '2rem',
      fontWeight: '600',
      color: '#2d3748',
      marginBottom: '30px',
      position: 'relative'
    },
    titleUnderline: {
      display: 'block',
      width: '60px',
      height: '4px',
      background: '#925FE2',
      marginTop: '8px',
      borderRadius: '2px'
    },
    yearSelector: {
      display: 'flex',
      gap: '15px',
      marginBottom: '30px'
    },
    yearButton: {
      padding: '12px 24px',
      backgroundColor: '#ffffff',
      color: '#4a5568',
      border: '2px solid #e2e8f0',
      borderRadius: '10px',
      cursor: 'pointer',
      fontWeight: '600',
      transition: 'all 0.3s ease',
      fontSize: '1rem'
    },
    yearButtonHover: {
      borderColor: '#cbd5e0',
      transform: 'translateY(-2px)'
    },
    yearButtonSelected: {
      backgroundColor: '#925FE2',
      color: '#ffffff',
      border: 'none',
      boxShadow: '0 4px 12px rgba(146, 95, 226, 0.3)'
    },
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
      gap: '24px'
    },
    statCard: {
      backgroundColor: '#fff',
      borderRadius: '12px',
      padding: '20px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
      display: 'flex',
      gap: '16px',
      alignItems: 'flex-start',
      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
      borderLeft: '4px solid #925FE2'
    },
    clickableCard: {
      cursor: 'pointer'
    },
    statCardHover: {
      transform: 'translateY(-5px)',
      boxShadow: '0 10px 15px rgba(0, 0, 0, 0.1)'
    },
    statIconContainer: {
      fontSize: '2rem',
      color: '#925FE2',
      flexShrink: 0,
      padding: '8px',
      background: 'rgba(146, 95, 226, 0.1)',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '50px',
      height: '50px'
    },
    statLabel: {
      fontSize: '1.1rem',
      fontWeight: '600',
      color: '#4a5568',
      marginBottom: '8px'
    },
    statValue: {
      fontSize: '1.75rem',
      fontWeight: '700',
      color: '#2d3748'
    },
    periodsText: {
      fontSize: '0.95rem',
      color: '#4a5568',
      lineHeight: '1.5'
    },
    periodsItem: {
      marginBottom: '4px'
    },
    mobileStyles: {
      '@media (max-width: 768px)': {
        container: {
          padding: '24px'
        },
        statsGrid: {
          gridTemplateColumns: '1fr'
        },
        yearSelector: {
          flexDirection: 'column'
        }
      }
    }
  };

  const getCardStyle = (index, isClickable = false) => ({
    ...styles.statCard,
    ...(isClickable && styles.clickableCard),
    ...(isHovered[index] && styles.statCardHover)
  });

  const getButtonStyle = (isSelected) => ({
    ...styles.yearButton,
    ...(isSelected && styles.yearButtonSelected),
    ':hover': styles.yearButtonHover
  });

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>
      Gestion des Archives
        <span style={styles.titleUnderline}></span>
      </h1>

      <div style={styles.yearSelector}>
        <button
          onClick={() => setSelectedYear(1)}
          style={getButtonStyle(selectedYear === 1)}
        >
          2020-2021
        </button>
        <button
          onClick={() => setSelectedYear(2)}
          style={getButtonStyle(selectedYear === 2)}
        >
          2021-2022
        </button>
      </div>

      <div style={styles.statsGrid}>
        {Object.entries(statsData[selectedYear]).map(([key, value], index) => {
          if (key === 'periods') {
            return (
              <div 
                key={index} 
                style={getCardStyle(index)}
                onMouseEnter={() => handleMouseEnter(index)}
                onMouseLeave={() => handleMouseLeave(index)}
              >
                <div style={styles.statIconContainer}>{statsIcons[key]}</div>
                <div>
                  <h3 style={styles.statLabel}>{labels.periods}</h3>
                  <div style={styles.periodsText}>
                    <div style={styles.periodsItem}><strong>Dépôt :</strong> {value.depot}</div>
                    <div style={styles.periodsItem}><strong>Soutenance :</strong> {value.soutenance}</div>
                  </div>
                </div>
              </div>
            );
          } else {
            return (
              <div 
                key={index} 
                style={getCardStyle(index, true)}
                onMouseEnter={() => handleMouseEnter(index)}
                onMouseLeave={() => handleMouseLeave(index)}
                onClick={() => handleCardClick(key)}
              >
                <div style={styles.statIconContainer}>{statsIcons[key]}</div>
                <div>
                  <h3 style={styles.statLabel}>{labels[key]}</h3>
                  <div style={styles.statValue}>{value}</div>
                </div>
              </div>
            );
          }
        })}
      </div>
    </div>
  );
};

export default ArchivagePage;