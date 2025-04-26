import React, { useState, useEffect, useContext } from "react";
import wilayas from '../../inscriEntreprise/Willaya';
import axios from "axios";
import { EntrepriseContext } from "../Pages/ListEntreprise";
const styles = {
  container: {
    width: '70%',
    margin: '0 auto',
    marginTop: '60px',
    background: 'white',
    borderRadius: '20px',
    boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
    padding: '30px',
    position: 'relative',
  },
  tabs: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '20px',
    borderBottom: '2px solid #eee',
  },
  tab: (activeTab, tab) => ({
    padding: '10px 20px',
    cursor: 'pointer',
    borderBottom: activeTab === tab ? '3px solid #925FE2' : 'none',
    fontWeight: 'bold',
    color: activeTab === tab ? '#925FE2' : '#888',
  }),
  inputRow: {
    display: 'flex',
    gap: '15px',
    marginBottom: '15px',
  },
  input: {
    flex: 1,
    padding: '10px',
    borderRadius: '20px',
    border: '1px solid #ccc',
    width: '300px'
  },
  buttonRow: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: '20px',
  },
  button: {
    padding: '10px 20px',
    borderRadius: '20px',
    border: 'none',
    cursor: 'pointer',
  },
  error: {
    color: "red",
    fontSize: "0.8rem",
    marginTop: "5px",
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalForm: {
    background: 'white',
    borderRadius: '20px',
    padding: '30px',
    width: '800px',
    position: 'relative',
  },
  closeBtn: {
    position: 'absolute',
    top: '10px',
    right: '15px',
    background: 'transparent',
    border: 'none',
    fontSize: '1.2rem',
    cursor: 'pointer',
  },
  disabledTab: {
    cursor: 'not-allowed',
    opacity: 0.5
  }
};

const AjouterEntreprise = ({ onClose, onAdd }) => {
  const [step, setStep] = useState(1);
  const [isEntrepriseValid, setIsEntrepriseValid] = useState(false);
  const [isRepresentantValid, setIsRepresentantValid] = useState(false);


  const [entrepriseData, setEntrepriseData] = useState({
    nom: "",
    secteur: "",
    wilaya: "",
    ville: "",
    adresse: "",
    siteWeb: "",
    representant_nom: "",
    representant_prenom: "",
    representant_poste: "",
    representant_email: "",
    representant_telephone: "",
  });


  const [representantData, setRepresentantData] = useState({
    nom: "", prenom: "", poste: "", email: "", telephone: ""
  });

  const [errors, setErrors] = useState({
    entreprise: {}, representant: {}
  });

  const validateText = (value) => {
    return /^[a-zA-ZÀ-ÿ\s'-]+$/.test(value);
  };
  const validateWebsite = (value) => {
    return /^(https?:\/\/)?(www\.)?[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(\.[a-zA-Z]{2,})?(\/\S*)?$/.test(value);
  };

  const handleEntrepriseChange = (e) => {
    const { name, value } = e.target;
    setEntrepriseData(prev => ({ ...prev, [name]: value }));

    let errorMsg = "";

    if (value.trim() === "") {
      errorMsg = "";
    } else {
      switch (name) {
        case "nom":
          if (!validateText(value)) {
            errorMsg = "Le nom ne doit contenir que des lettres";
          }
          break;
        case "secteur":
          if (!validateText(value)) {
            errorMsg = "Le secteur ne doit contenir que des lettres";
          }
          break;
        case "siteWeb":
          if (!validateWebsite(value)) {
            errorMsg = "Format de site web invalide (doit commencer par http:// ou https://)";
          }
          break;
      }
    }

    setErrors(prev => ({
      ...prev,
      entreprise: { ...prev.entreprise, [name]: errorMsg }
    }));
  };

  // Handle representant 
  const handleRepresentantChange = (e) => {
    const { name, value } = e.target;
    setRepresentantData(prev => ({ ...prev, [name]: value }));

    let errorMsg = "";

    if (value.trim() === "") {
      errorMsg = "";
    } else {
      switch (name) {
        case "nom":
        case "prenom":
          if (!validateText(value)) {
            errorMsg = "Ne doit contenir que des lettres";
          }
          break;
        case "email":
          if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)) {
            errorMsg = "Adresse e-mail invalide";
          }
          break;
        case "telephone":
          if (!/^0[567][0-9]{8}$/.test(value)) {
            errorMsg = "Numéro de téléphone invalide (ex: 0550123456)";
          }
          break;
      }
    }

    setErrors(prev => ({
      ...prev,
      representant: { ...prev.representant, [name]: errorMsg }
    }));
  };

  useEffect(() => {
    const isValid =
      entrepriseData.nom.trim() !== "" && !errors.entreprise.nom &&
      entrepriseData.secteur.trim() !== "" && !errors.entreprise.secteur &&
      entrepriseData.wilaya !== "" &&
      entrepriseData.ville !== "" &&
      entrepriseData.adresse.trim() !== "" &&
      (entrepriseData.siteWeb.trim() === "" || !errors.entreprise.siteWeb);

    setIsEntrepriseValid(isValid);
  }, [entrepriseData, errors.entreprise]);

  useEffect(() => {
    const isValid =
      representantData.nom.trim() !== "" && !errors.representant.nom &&
      representantData.prenom.trim() !== "" && !errors.representant.prenom &&
      representantData.poste !== "" &&
      representantData.email.trim() !== "" && !errors.representant.email &&
      representantData.telephone.trim() !== "" && !errors.representant.telephone;

    setIsRepresentantValid(isValid);
  }, [representantData, errors.representant]);

  const handleNext = () => {
    const requiredFields = ['nom', 'secteur', 'wilaya', 'ville', 'adresse'];
    const newErrors = {};
    let hasErrors = false;

    requiredFields.forEach(field => {
      if (entrepriseData[field].trim() === "") {
        newErrors[field] = "Ce champ est obligatoire";
        hasErrors = true;
      }
    });

    setErrors(prev => ({
      ...prev,
      entreprise: { ...prev.entreprise, ...newErrors }
    }));

    if (!hasErrors && isEntrepriseValid) {
      setStep(2);
    }
  };

  const { setEntreprises } = useContext(EntrepriseContext);

  const handleValider = () => {
    const requiredFields = ['nom', 'prenom', 'poste', 'email', 'telephone'];
    const newErrors = {};
    let hasErrors = false;

    requiredFields.forEach(field => {
      if (representantData[field].trim() === "") {
        newErrors[field] = "Ce champ est obligatoire";
        hasErrors = true;
      }
    });

    setErrors(prev => ({
      ...prev,
      representant: { ...prev.representant, ...newErrors }
    }));

    if (!hasErrors && isRepresentantValid) {
      const newEntreprise = {
        nom: entrepriseData.nom,
        secteur_activite: entrepriseData.secteur,
        wilaya: entrepriseData.wilaya,
        ville: entrepriseData.ville,
        adresse: entrepriseData.adresse,
        site_web: entrepriseData.siteWeb,
        representant_nom: representantData.nom,
        representant_prenom: representantData.prenom,
        representant_poste: representantData.poste,
        representant_email: representantData.email,
        representant_telephone: representantData.telephone
      };
      onAdd(newEntreprise);

      axios.post('http://127.0.0.1:8000/entreprises/create-manual/', newEntreprise)
        .then((res) => {
          const data = Array.isArray(res.data) ? res.data : [res.data];
          setEntreprises(prev => [...prev, ...data]);
          onClose();
        })
        .catch(error => {
          console.error('Erreur lors de l\'ajout de l\'entreprise:', error);
          alert('Erreur lors de l\'ajout de l\'entreprise');
        });
    }
  };


  return (
    <div style={styles.modalOverlay}>
      <div style={styles.modalForm}>
        <button style={styles.closeBtn} onClick={onClose}>×</button>
        <h2 style={{ textAlign: 'center', marginBottom: '10px' }}>Ajouter Entreprise</h2>

        <div style={styles.tabs}>
          <div
            style={{
              ...styles.tab('entreprise', step === 1 ? 'entreprise' : 'representant'),
              ...(!isEntrepriseValid && step === 2 ? styles.disabledTab : {})
            }}
            onClick={() => isEntrepriseValid && setStep(1)}
          >
            Entreprise
          </div>
          <div
            style={{
              ...styles.tab('representant', step === 2 ? 'representant' : 'entreprise'),
              ...(!isEntrepriseValid ? styles.disabledTab : {})
            }}
            onClick={() => isEntrepriseValid && setStep(2)}
          >
            Représentant
          </div>
        </div>

        {step === 1 && (
          <form>
            <div style={styles.inputRow}>
              <div style={{ flex: 1 }}>
                <input type="text" name="nom" value={entrepriseData.nom} onChange={handleEntrepriseChange}
                  onBlur={(e) => {
                    if (e.target.value.trim() === "") {
                      setErrors(prev => ({
                        ...prev,
                        entreprise: { ...prev.entreprise, nom: "Ce champ est obligatoire" }
                      }));
                    }
                  }}
                  style={styles.input}
                  placeholder="Nom de l'entreprise"
                />
                {errors.entreprise.nom && <span style={styles.error}>{errors.entreprise.nom}</span>}
              </div>
              <div style={{ flex: 1 }}>
                <input type="text" name="secteur" value={entrepriseData.secteur} onChange={handleEntrepriseChange}
                  onBlur={(e) => {
                    if (e.target.value.trim() === "") {
                      setErrors(prev => ({
                        ...prev,
                        entreprise: { ...prev.entreprise, secteur: "Ce champ est obligatoire" }
                      }));
                    }
                  }}
                  style={styles.input}
                  placeholder="Secteur d'activité"
                />
                {errors.entreprise.secteur && <span style={styles.error}>{errors.entreprise.secteur}</span>}
              </div>
            </div>

            <div style={styles.inputRow}>
              <div style={{ flex: 1 }}>
                <select
                  name="wilaya"
                  value={entrepriseData.wilaya}
                  onChange={(e) => {
                    handleEntrepriseChange(e);
                    setEntrepriseData(prev => ({ ...prev, ville: "" }));
                  }}
                  onBlur={(e) => {
                    if (e.target.value === "") {
                      setErrors(prev => ({
                        ...prev,
                        entreprise: { ...prev.entreprise, wilaya: "Ce champ est obligatoire" }
                      }));
                    }
                  }}
                  style={styles.input}
                >
                  <option value="">Sélectionner une wilaya</option>
                  {Object.entries(wilayas).map(([code, wilaya]) => (
                    <option key={code} value={code}>{wilaya.name}</option>
                  ))}
                </select>
                {errors.entreprise.wilaya && <span style={styles.error}>{errors.entreprise.wilaya}</span>}
              </div>
              <div style={{ flex: 1 }}>
                <select
                  name="ville"
                  value={entrepriseData.ville}
                  onChange={handleEntrepriseChange}
                  onBlur={(e) => {
                    if (e.target.value === "") {
                      setErrors(prev => ({
                        ...prev,
                        entreprise: { ...prev.entreprise, ville: "Ce champ est obligatoire" }
                      }));
                    }
                  }}
                  style={styles.input}
                  disabled={!entrepriseData.wilaya}
                >
                  <option value="">Sélectionner une ville</option>
                  {entrepriseData.wilaya && wilayas[entrepriseData.wilaya].cities.map((city, i) => (
                    <option key={i} value={city}>{city}</option>
                  ))}
                </select>
                {errors.entreprise.ville && <span style={styles.error}>{errors.entreprise.ville}</span>}
              </div>
            </div>

            <div style={{ ...styles.inputRow, flexDirection: 'column' }}>
              <div>
                <input
                  type="text"
                  name="adresse"
                  value={entrepriseData.adresse}
                  onChange={handleEntrepriseChange}
                  onBlur={(e) => {
                    if (e.target.value.trim() === "") {
                      setErrors(prev => ({
                        ...prev,
                        entreprise: { ...prev.entreprise, adresse: "Ce champ est obligatoire" }
                      }));
                    }
                  }}
                  style={{ ...styles.input, flex: 2, width: '720px' }}
                  placeholder="Rue Didouche Mourad..."
                />
                {errors.entreprise.adresse && <span style={styles.error}>{errors.entreprise.adresse}</span>}
              </div>
              <div>
                <input
                  type="text"
                  name="siteWeb"
                  value={entrepriseData.siteWeb}
                  onChange={handleEntrepriseChange}
                  style={{ ...styles.input, flex: 2, width: '720px' }} placeholder="www.techinnovdz.com"
                />
                {errors.entreprise.siteWeb && <span style={styles.error}>{errors.entreprise.siteWeb}</span>}
              </div>
            </div>
          </form>
        )}

        {step === 2 && (
          <form>
            <div style={styles.inputRow}>
              <div style={{ flex: 1 }}>
                <input
                  type="text"
                  name="nom"
                  value={representantData.nom}
                  onChange={handleRepresentantChange}
                  onBlur={(e) => {
                    if (e.target.value.trim() === "") {
                      setErrors(prev => ({
                        ...prev,
                        representant: { ...prev.representant, nom: "Ce champ est obligatoire" }
                      }));
                    }
                  }}
                  style={styles.input}
                  placeholder="Nom"
                />
                {errors.representant.nom && <span style={styles.error}>{errors.representant.nom}</span>}
              </div>
              <div style={{ flex: 1 }}>
                <input
                  type="text"
                  name="prenom"
                  value={representantData.prenom}
                  onChange={handleRepresentantChange}
                  onBlur={(e) => {
                    if (e.target.value.trim() === "") {
                      setErrors(prev => ({
                        ...prev,
                        representant: { ...prev.representant, prenom: "Ce champ est obligatoire" }
                      }));
                    }
                  }}
                  style={styles.input}
                  placeholder="Prénom"
                />
                {errors.representant.prenom && <span style={styles.error}>{errors.representant.prenom}</span>}
              </div>
            </div>

            <div style={styles.inputRow}>
              <div style={{ flex: 1 }}>
                <select
                  name="poste"
                  value={representantData.poste}
                  onChange={handleRepresentantChange}
                  onBlur={(e) => {
                    if (e.target.value === "") {
                      setErrors(prev => ({
                        ...prev,
                        representant: { ...prev.representant, poste: "Ce champ est obligatoire" }
                      }));
                    }
                  }}
                  style={{ ...styles.input, width: '720px' }}
                >
                  <option value="" disabled hidden>Poste occupé</option>
                  <option value="Manager">Manager</option>
                  <option value="Développeur">Développeur</option>
                  <option value="Designer">Designer</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Autre">Autre</option>
                </select>
                {errors.representant.poste && <span style={styles.error}>{errors.representant.poste}</span>}
              </div>
            </div>

            <div style={{ ...styles.inputRow, flexDirection: 'column' }}>
              <div>
                <input
                  type="email"
                  name="email"
                  value={representantData.email}
                  onChange={handleRepresentantChange}
                  onBlur={(e) => {
                    if (e.target.value.trim() === "") {
                      setErrors(prev => ({
                        ...prev,
                        representant: { ...prev.representant, email: "Ce champ est obligatoire" }
                      }));
                    }
                  }}
                  style={{ ...styles.input, width: '720px' }}
                  placeholder="email@exemple.com"
                />
                {errors.representant.email && <span style={styles.error}>{errors.representant.email}</span>}
              </div>
              <div>
                <input
                  type="tel"
                  name="telephone"
                  value={representantData.telephone}
                  onChange={handleRepresentantChange}
                  onBlur={(e) => {
                    if (e.target.value.trim() === "") {
                      setErrors(prev => ({
                        ...prev,
                        representant: { ...prev.representant, telephone: "Ce champ est obligatoire" }
                      }));
                    }
                  }}
                  style={{ ...styles.input, width: '720px' }}
                  placeholder="0601020304"
                />
                {errors.representant.telephone && <span style={styles.error}>{errors.representant.telephone}</span>}
              </div>
            </div>
          </form>
        )}

        <div style={styles.buttonRow}>
          {step === 1 && (
            <button
              onClick={handleNext}
              style={{
                ...styles.button,
                background: isEntrepriseValid ? '#925FE2' : '#ccc',
                color: 'white'
              }}
              disabled={!isEntrepriseValid}
            >
              Suivant
            </button>
          )}
          {step === 2 && (
            <>
              <button
                onClick={() => setStep(1)}
                style={{
                  ...styles.button,
                  background: '#ccc',
                  color: 'white',
                  marginRight: '10px'
                }}
              >
                Retour
              </button>
              <button
                onClick={handleValider}
                disabled={!isRepresentantValid}
                style={{
                  ...styles.button,
                  background: isRepresentantValid ? '#925FE2' : '#ccc',
                  color: 'white'
                }}
              >
                Valider
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AjouterEntreprise;