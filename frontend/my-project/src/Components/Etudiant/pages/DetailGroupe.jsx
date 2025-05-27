import React, { useState, useEffect, useRef, useContext } from 'react'
import '../Styles/GroupDetail.css';
import { ReactComponent as SearchIcon } from '../../../Assets/Icons/Search.svg';
import { ReactComponent as ArrowIcon } from '../../../Assets/Icons/Arrow.svg';
import { ReactComponent as EmptyIcon } from '../../../Assets/Icons/notFound.svg';
import { AppContext } from '../../../App';
import '../../Partials/Components/i18n'
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { nodeAxios,nodeAxios2} from '../../../axios';
import { AjouterDocument } from './AjouterDocument';
import { NavLink } from 'react-router-dom';
function DetailGroupe() {
    // const documents = [
    //     { id: 1, name: "Cahier de chargev1.pdf", date: " Feb 21, 2022 12:45 PM", chef: "Djamel Bensaber", status: "Validé" },
    //     { id: 2, name: "Cahier de chargev1.pdf", date: " Feb 21, 2022 12:45 PM", chef: "Djamel Bensaber", status: "Refuser" },
    //     { id: 3, name: "Cahier de chargev1.pdf", date: " Feb 21, 2022 12:45 PM", chef: "Djamel Bensaber", status: "Validé" },
    //     { id: 1, name: "Cahier de chargev1.pdf", date: " Feb 21, 2022 12:45 PM", chef: "Djamel Bensaber", status: "En Attente" },
     
    // ];
     const { id: groupId } = useParams();
    const [groupName, setGroupName] = useState(''); // Déclaration du state
    const [members, setMembers] = useState([]);
    const [chefId, setChefId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
 
    const [documents, setDocuments] = useState([]);

    const [loadingDocuments, setLoadingDocuments] = useState(false);

    const handleDownload = async (fileUrl, fileName) => {
  try {
    const response = await fetch(`http://localhost:5005${fileUrl}`);
    if (!response.ok) throw new Error('Download failed');
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Download error:', error);
    // Add user notification here
  }
};
    useEffect(() => {
        const fetchGroupMembers = async () => {
            try {
                setLoading(true);
                const response = await nodeAxios.get(`/groups/${groupId}/members`);
                
                setGroupName(response.data.group_name); // Utilisation correcte
                setMembers(response.data.members);
                setChefId(response.data.chef_id);
                
            } catch (err) {
                setError(err.response?.data?.message || err.message || 'Erreur serveur');
            } finally {
                setLoading(false);
            }
        };

        if (groupId) {
            fetchGroupMembers();
        }
    }, [groupId]);
     const fetchGroupDocuments = async () => {
        try {
            setLoadingDocuments(true);
            const response = await nodeAxios2.get(`/groups/${groupId}/documents`);
            setDocuments(response.data.documents);
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Erreur serveur');
        } finally {
            setLoadingDocuments(false);
        }
    };

useEffect(() => {
   
    if (groupId) {
        fetchGroupDocuments();
    }
}, [groupId]);
    const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "validé":
      case "accepté":
        return "#6FCF97";
      case "en attente":
      case "pending":
        return "#925FE2";
      case "refusé":
      case "refuser":
      case "rejeté":
        return "#D42803";
      default:
        return "black";
    }
  };

    const [isVisible, setIsVisible] = useState(false);
    const dynamicListRef = useRef(null);

    const toggleVisibility = () => {
        if (dynamicListRef.current) {
            const scrollY = dynamicListRef.current.scrollTop;
            setIsVisible(scrollY > 5);
        }
    };

    useEffect(() => {
        const currentRef = dynamicListRef.current; // li9 nzidou hadi bach ma y5arjch warning w nidrouha fi variable bach nafss variable tji fi la phase ta3 setup and cleanup *useEffect y5dm bel les variables*

        if (currentRef) {
            currentRef.addEventListener("scroll", toggleVisibility);
        }

        return () => {
            if (currentRef) {
                currentRef.removeEventListener("scroll", toggleVisibility);
            }
        };
    }, []);

    const scrollToTop = () => {
        if (dynamicListRef.current) {
            dynamicListRef.current.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        }
    };

    //-----------AppContext-------//

    const { isRtl } = useContext(AppContext);

    const { t } = useTranslation();

    const [groupeDetailClicked, setGroupeClicked] = useState(false)

    const [ajouterDocument, setAjouterDocument] = useState(false)

    return (
        <div className='groupes-liste-container' id='dynamic-liste' ref={dynamicListRef}>
            <div className="groupes-liste-wrapper" style={{ paddingRight: isRtl ? "0" : "12px", paddingLeft: isRtl ? "12px" : "0" }}>
                <div className="title-detail-line">
                    <h1 style={{ fontSize: "1.2rem", fontWeight: "500", color: "#4F4F4F" }}>
                        Mes Groupes  &gt; <span style={{ color: "#925FE2" }}>{groupName}</span>
                    </h1>
                    <div style={{ display: "flex", gap: "1.1rem", alignItems: "center", marginRight: "1rem" }}>
                        <button onClick={() => setAjouterDocument(true)} className='ajout-btn'>
                            <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M11 13.5H6C5.71667 13.5 5.47934 13.404 5.288 13.212C5.09667 13.02 5.00067 12.7827 5 12.5C4.99934 12.2173 5.09534 11.98 5.288 11.788C5.48067 11.596 5.718 11.5 6 11.5H11V6.5C11 6.21667 11.096 5.97934 11.288 5.788C11.48 5.59667 11.7173 5.50067 12 5.5C12.2827 5.49934 12.5203 5.59534 12.713 5.788C12.9057 5.98067 13.0013 6.218 13 6.5V11.5H18C18.2833 11.5 18.521 11.596 18.713 11.788C18.905 11.98 19.0007 12.2173 19 12.5C18.9993 12.7827 18.9033 13.0203 18.712 13.213C18.5207 13.4057 18.2833 13.5013 18 13.5H13V18.5C13 18.7833 12.904 19.021 12.712 19.213C12.52 19.405 12.2827 19.5007 12 19.5C11.7173 19.4993 11.48 19.4033 11.288 19.212C11.096 19.0207 11 18.7833 11 18.5V13.5Z" fill="white" />
                            </svg>
                            Déposer un Document
                        </button>
                        


{/* <NavLink 
  to={`/etudiant/groupes/${groupId}/rendezvous`}
  className={({ isActive }) => isActive ? "active-link" : ""}
>
  <button className='ajout-btn'>
    <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M11 13.5H6C5.71667 13.5 5.47934 13.404 5.288 13.212C5.09667 13.02 5.00067 12.7827 5 12.5C4.99934 12.2173 5.09534 11.98 5.288 11.788C5.48067 11.596 5.718 11.5 6 11.5H11V6.5C11 6.21667 11.096 5.97934 11.288 5.788C11.48 5.59667 11.7173 5.50067 12 5.5C12.2827 5.49934 12.5203 5.59534 12.713 5.788C12.9057 5.98067 13.0013 6.218 13 6.5V11.5H18C18.2833 11.5 18.521 11.596 18.713 11.788C18.905 11.98 19.0007 12.2173 19 12.5C18.9993 12.7827 18.9033 13.0203 18.712 13.213C18.5207 13.4057 18.2833 13.5013 18 13.5H13V18.5C13 18.7833 12.904 19.021 12.712 19.213C12.52 19.405 12.2827 19.5007 12 19.5C11.7173 19.4993 11.48 19.4033 11.288 19.212C11.096 19.0207 11 18.7833 11 18.5V13.5Z" fill="white" />
    </svg>
    Rendezvous
  </button>
</NavLink> */}
                        <span style={{ display: "flex", gap: "10px", alignItems: "center", fontFamily: "Kumbh Sans, sans-serif", fontWeight: "600", color: "#925FE2", cursor: "pointer" }} onClick={() => setGroupeClicked(true)}>
                            Sur le Groupe
                            <svg width="8" height="12" viewBox="0 0 10 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M1.5 1L8.5 8L1.5 15" stroke="#925FE2" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                        </span>
                    </div>
                </div>
                <div className="recherche-groupes-line">
                    <div className="recherche-groupes-input">
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
                            <input type="text" placeholder="Rechercher un document par nom" />
                        </div>
                    </div>
                </div>

  <div className="groupes-table">
      <table>
        <thead>
          <tr>
            <th style={{
              borderTopLeftRadius: isRtl ? "0" : "8px",
              borderTopRightRadius: isRtl ? "8px" : "0",
              borderBottomLeftRadius: isRtl ? "0" : "8px",
              borderBottomRightRadius: isRtl ? "8px" : "0",
              borderLeft: isRtl ? undefined : "1px solid #E4E4E4",
              borderRight: isRtl ? "1px solid #E4E4E4" : undefined,
              width: "20%",
              paddingLeft: isRtl ? undefined : "1rem",
              paddingRight: isRtl ? "0.5rem" : undefined,
              textAlign: isRtl ? "right" : "left"
            }}>
              Document
            </th>
            <th style={{ width: "16%" }}>Date</th>
            <th style={{ width: "25%" }}>Déposé Par</th>
            <th style={{ width: "100% !important" }}>Statut</th>
            <th style={{
              width: "15%",
              borderTopRightRadius: isRtl ? "0" : "8px",
              borderTopLeftRadius: isRtl ? "8px" : "0",
              borderBottomRightRadius: isRtl ? "0" : "8px",
              borderBottomLeftRadius: isRtl ? "8px" : "0",
              borderRight: isRtl ? "none" : "1px solid #E4E4E4",
              borderLeft: isRtl ? "1px solid #E4E4E4" : "none",
              textAlign: "center"
            }}>
              Options
            </th>
          </tr>
        </thead>
        
        {documents.length > 0 ? (
          <tbody>
            {documents.map((document) => (
              <tr key={document._id}>
                <td style={{
                  borderTopLeftRadius: isRtl ? "0" : "8px",
                  borderTopRightRadius: isRtl ? "8px" : "0",
                  borderBottomLeftRadius: isRtl ? "0" : "8px",
                  borderBottomRightRadius: isRtl ? "8px" : "0",
                  borderLeft: isRtl ? undefined : "1px solid #E4E4E4",
                  borderRight: isRtl ? "1px solid #E4E4E4" : undefined,
                  width: "20%",
                  paddingLeft: "1rem",
                  textAlign: isRtl ? "right" : "left",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis"
                }}>
                  <span style={{ display: "flex", alignItems: "flex-end", gap: "0" }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginLeft: "1rem" }}>
                      <path d="M19.5 10.3711V19.5C19.5 20.0967 19.2629 20.669 18.841 21.091C18.419 21.5129 17.8467 21.75 17.25 21.75H6.75C6.15326 21.75 5.58097 21.5129 5.15901 21.091C4.73705 20.669 4.5 20.0967 4.5 19.5V4.5C4.5 3.90326 4.73705 3.33097 5.15901 2.90901C5.58097 2.48705 6.15326 2.25 6.75 2.25H11.3789C11.7766 2.25006 12.158 2.40804 12.4392 2.68922L19.0608 9.31078C19.342 9.59202 19.4999 9.97341 19.5 10.3711Z" stroke="black" strokeLinejoin="round" />
                      <path d="M12 2.625V8.25C12 8.64782 12.158 9.02936 12.4393 9.31066C12.7206 9.59196 13.1022 9.75 13.5 9.75H19.125" stroke="black" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    {document.title}
                  </span>
                </td>
                
                <td style={{ width: "23%", color: "#3A3541", fontSize: "0.7rem", paddingTop: "10px" }}>
                  {document.createdAt}
                </td>
                
                <td style={{ width: "30%" }}>
                  {document.etudiantNom || "N/A"}
                </td>
                
                <td className='grade-td' style={{ width: "100%" }}>
                  <div style={{
                    color: getStatusColor(document.status),
                    fontSize: "1.1rem",
                    fontWeight: "650",
                    fontFamily: "Nunito, sans-serif"
                  }}>
                    {document.status}
                  </div>
                </td>
                
                <td className='last-td' style={{
                  borderTopRightRadius: isRtl ? "0" : "8px",
                  borderTopLeftRadius: isRtl ? "8px" : "0",
                  borderBottomRightRadius: isRtl ? "0" : "8px",
                  borderBottomLeftRadius: isRtl ? "8px" : "0",
                  borderRight: isRtl ? "none" : "1px solid #E4E4E4",
                  borderLeft: isRtl ? "1px solid #E4E4E4" : "none",
                }}>
                  <div className="line-btns" style={{
                    marginLeft: isRtl ? "1rem" : "auto",
                    marginRight: isRtl ? "auto" : "1rem"
                  }}>
                    {/* <a 
                      href={`http://localhost:5005${document.fileUrl}`} 
                      download 
                      style={{ display: "flex", flexDirection: "column" }} 
                      className='download-btn'
                    >
                      <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" clipRule="evenodd" d="M12.1069 4.50353C14.076 4.55028 15.7042 5.92388 16.1525 7.75088C16.2422 8.11622 16.537 8.39455 16.9054 8.46414C18.6978 8.8028 20.0338 10.3997 19.989 12.283C19.9557 13.6861 19.1654 14.8946 18.0133 15.525C17.5536 15.7765 17.3849 16.3531 17.6364 16.8127C17.8879 17.2724 18.4645 17.4411 18.9242 17.1896C20.6461 16.2474 21.836 14.4357 21.8861 12.328C21.9484 9.70505 20.227 7.4558 17.8293 6.73865C17.0068 4.38406 14.7941 2.66924 12.152 2.60651C8.77349 2.5263 5.9652 5.17857 5.84263 8.5459C4.15033 9.23777 2.93956 10.8804 2.89335 12.8262C2.84606 14.8179 4.03321 16.5499 5.75281 17.294C6.23373 17.502 6.79226 17.2809 7.00035 16.8C7.20843 16.3191 6.98727 15.7605 6.50637 15.5525C5.47184 15.1048 4.76205 14.0638 4.79037 12.8712C4.82199 11.54 5.76358 10.4419 7.00763 10.1617C7.4719 10.0572 7.7933 9.62531 7.7519 9.14461C7.53745 6.65458 9.59463 4.44388 12.1069 4.50353ZM12.4235 11.1543C12.9474 11.1668 13.3619 11.6015 13.3495 12.1254L13.2012 18.3701L14.4571 17.1743C14.8366 16.813 15.4371 16.8277 15.7985 17.2072C16.1598 17.5867 16.1451 18.1872 15.7656 18.5486L13.0241 21.1588C12.7784 21.3928 12.5399 21.5966 12.1757 21.5879C11.8116 21.5793 11.5831 21.3644 11.3487 21.119L8.73419 18.3817C8.37228 18.0027 8.38606 17.4022 8.765 17.0402C9.14393 16.6783 9.74449 16.6921 10.1064 17.071L11.3042 18.3251L11.4525 12.0803C11.4649 11.5565 11.8996 11.1419 12.4235 11.1543Z" fill="black" />
                      </svg>
                      Télécharger
                    </a> */}
                                                    <button 
                                                        onClick={() => handleDownload(document.fileUrl, document.title)}
                                                        style={{ display: "flex", flexDirection: "column" }} 
                                                        className='download-btn'
                                                        >
                                                        <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                                <path fillRule="evenodd" clipRule="evenodd" d="M12.1069 4.50353C14.076 4.55028 15.7042 5.92388 16.1525 7.75088C16.2422 8.11622 16.537 8.39455 16.9054 8.46414C18.6978 8.8028 20.0338 10.3997 19.989 12.283C19.9557 13.6861 19.1654 14.8946 18.0133 15.525C17.5536 15.7765 17.3849 16.3531 17.6364 16.8127C17.8879 17.2724 18.4645 17.4411 18.9242 17.1896C20.6461 16.2474 21.836 14.4357 21.8861 12.328C21.9484 9.70505 20.227 7.4558 17.8293 6.73865C17.0068 4.38406 14.7941 2.66924 12.152 2.60651C8.77349 2.5263 5.9652 5.17857 5.84263 8.5459C4.15033 9.23777 2.93956 10.8804 2.89335 12.8262C2.84606 14.8179 4.03321 16.5499 5.75281 17.294C6.23373 17.502 6.79226 17.2809 7.00035 16.8C7.20843 16.3191 6.98727 15.7605 6.50637 15.5525C5.47184 15.1048 4.76205 14.0638 4.79037 12.8712C4.82199 11.54 5.76358 10.4419 7.00763 10.1617C7.4719 10.0572 7.7933 9.62531 7.7519 9.14461C7.53745 6.65458 9.59463 4.44388 12.1069 4.50353ZM12.4235 11.1543C12.9474 11.1668 13.3619 11.6015 13.3495 12.1254L13.2012 18.3701L14.4571 17.1743C14.8366 16.813 15.4371 16.8277 15.7985 17.2072C16.1598 17.5867 16.1451 18.1872 15.7656 18.5486L13.0241 21.1588C12.7784 21.3928 12.5399 21.5966 12.1757 21.5879C11.8116 21.5793 11.5831 21.3644 11.3487 21.119L8.73419 18.3817C8.37228 18.0027 8.38606 17.4022 8.765 17.0402C9.14393 16.6783 9.74449 16.6921 10.1064 17.071L11.3042 18.3251L11.4525 12.0803C11.4649 11.5565 11.8996 11.1419 12.4235 11.1543Z" fill="black" />
                                                                            </svg>
                                Télécharger
                                </button>
                    <span style={{ display: "flex", gap: "8px", alignItems: "center", color: "#884DFF", marginRight: "1rem" }}>
                      <svg width="10" height="16" viewBox="0 0 10 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1.5 1L8.5 8L1.5 15" stroke="#925FE2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        ) : (
          <tbody>
            <tr>
              <td colSpan="5">
                <div className="no-enseignants-available">
                  <EmptyIcon className='empty-icon' />
                  <div className="lines-box">
                    <h1 style={{ fontSize: "1.45rem", fontWeight: "650" }}>
                      Aucun document disponible
                    </h1>
                    <span style={{ width: "600px", textAlign: "center", color: "#4F4F4F", fontWeight: "500" }}>
                      Aucun document n'a été déposé pour le moment
                    </span>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        )}
      </table>
    </div>
                {
                    isVisible && (
                        <button
                            onClick={scrollToTop}
                            className='to-top'
                            style={{
                                position: "fixed",
                                bottom: "20px",
                                right: isRtl ? undefined : "20px",
                                left: isRtl ? "20px" : undefined,
                                backgroundColor: "#925FE2",
                                color: "white",
                                cursor: "pointer",
                                fontSize: "20px",
                                width: "50px",
                                height: "50px",
                                borderRadius: "50%",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                boxShadow: "8px 4px 52px rgba(0, 0, 0, 0.2)"
                            }}
                        >
                            <ArrowIcon className='arrow-top' />
                        </button>
                    )
                }
            </div>
           
           
{groupeDetailClicked && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30 backdrop-blur-sm">
    <div className="relative w-full max-w-4xl mx-4 bg-white rounded-2xl shadow-2xl overflow-hidden animate-fadeIn">
      {/* Header */}
      <div className="sticky top-0 z-10 flex items-center justify-between p-6 bg-white border-b border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800">
          Membres du groupe: {groupName || `Groupe ${groupId}`}
        </h2>
        <button 
          onClick={() => setGroupeClicked(false)}
          className="p-2 text-gray-500 rounded-full hover:bg-gray-100 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Content */}
      <div className="max-h-[70vh] overflow-y-auto">
        {loading ? (
          <div className="flex flex-col items-center justify-center p-12 space-y-4">
            <div className="w-12 h-12 border-4 border-purple-100 border-t-purple-600 rounded-full animate-spin"></div>
            <p className="text-lg text-gray-600">Chargement des membres...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center p-12 space-y-4 text-red-500">
            <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <p className="text-lg font-medium">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 mt-4 text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors"
            >
              Réessayer
            </button>
          </div>
        ) : members.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 space-y-4">
            <svg className="w-16 h-16 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0z" clipRule="evenodd" />
            </svg>
            <p className="text-lg text-gray-600">Aucun membre dans ce groupe</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="sticky top-0 bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom & Prénom</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Matricule</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rôle</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {members.map(member => (
                  <tr 
                    key={member.id} 
                    className={`transition-colors ${member.id === chefId ? 'bg-purple-50' : 'hover:bg-gray-50'}`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {member.chef_equipe && (
                          <span className="mr-2 text-purple-500">👑</span>
                        )}
                        <div>
                          <div className="font-medium text-gray-900">{member.prenom} {member.nom}</div>
                          {/* {member.id === chefId && (
                            <span className="inline-block px-2 py-1 mt-1 text-xs font-semibold text-purple-800 bg-purple-100 rounded-full">
                              Chef Principal
                            </span>
                          )} */}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">{member.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">{member.matricule || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                        member.id === chefId 
                          ? 'text-purple-800 bg-purple-100' 
                          : member.chef_equipe 
                            ? 'text-indigo-800 bg-indigo-100' 
                            : 'text-gray-800 bg-gray-100'
                      }`}>
                        {member.id === chefId ? 'Chef de groupe' : 'Membre'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="sticky bottom-0 flex justify-end p-4 bg-white border-t border-gray-200">
        <button
          onClick={() => setGroupeClicked(false)}
          className="px-6 py-2 text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors"
        >
          Fermer
        </button>
      </div>
    </div>
  </div>
)}
{
    ajouterDocument && (
      <AjouterDocument
       groupId={groupId}
        annulerAjouter={() => setAjouterDocument(false)}
        onSuccess={() => {
            fetchGroupDocuments();     // refresh list
            setAjouterDocument(false); // close modal
        }}
    />
    )
}
 
        </div >
    )
}

export default DetailGroupe
