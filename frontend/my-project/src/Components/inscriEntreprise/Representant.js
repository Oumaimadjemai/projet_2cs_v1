import React, { useState, useEffect } from "react";
import './InscriptionEntreprise.css'
import '../Partials/Components/i18n'
import { useTranslation } from 'react-i18next';

const InscriptionRepresentant = ({ onValidationChange }) => {
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    poste: "",
    email: "",
    telephone: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const isValid =
      formData.nom.trim() !== "" &&
      formData.prenom.trim() !== "" &&
      formData.poste !== "" &&
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email) &&
      /^0[567][0-9]{8}$/.test(formData.telephone);

    onValidationChange(isValid);
  }, [formData, onValidationChange]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    let errorMsg = "";
    if (value.trim() === "") {
      errorMsg = "Ce champ est obligatoire.";
    } else if (name === "email" && !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)) {
      errorMsg = "Adresse e-mail invalide.";
    } else if (name === "telephone" && !/^0[567][0-9]{8}$/.test(value)) {
      errorMsg = "Numéro de téléphone invalide.";
    }

    setErrors({ ...errors, [name]: errorMsg });
  };

  const {t} = useTranslation();

  return (
    <form>
      <div style={styles.formGroup}>
        <div style={styles.inputContainer}>
          <label style={styles.label}>{t('login.nomInput')}</label>
          <input
            type="text"
            name="nom"
            value={formData.nom}
            onChange={handleChange}
            placeholder={t('login.nomRep')}
            style={styles.input}
            className="input-inscription"
          />
          {errors.nom && <span style={styles.error}>{errors.nom}</span>}
        </div>
        <div style={styles.inputContainer}>
          <label style={styles.label}>{t('login.prenomInput')}</label>
          <input
            type="text"
            name="prenom"
            value={formData.prenom}
            onChange={handleChange}
            placeholder={t('login.prenomRep')}
            style={styles.input}
            className="input-inscription"
          />
          {errors.prenom && <span style={styles.error}>{errors.prenom}</span>}
        </div>
      </div>

      <div style={styles.formGroup}>
        <div style={styles.inputContainer}>
          <label style={styles.label}>{t('login.posteInput')}</label>
          <select
            name="poste"
            value={formData.poste}
            onChange={handleChange}
            style={styles.input}
            className="input-inscription"
          >
            <option value="" disabled hidden>{t('login.posteInput')}</option>
            <option value="Manager">Manager</option>
            <option value="Développeur">Développeur</option>
            <option value="Designer">Designer</option>
            <option value="Marketing">Marketing</option>
          
          </select>
          {errors.poste && <span style={styles.error}>{errors.poste}</span>}
        </div>
      </div>

      <div style={{ ...styles.inputContainer, ...styles.fullWidth }}>
        <label style={styles.label}>{t('login.emailRep')}</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="exemple@domaine.com"
          style={styles.input}
          className="input-inscription"
        />
        {errors.email && <span style={styles.error}>{errors.email}</span>}
      </div>

      <div style={{ ...styles.inputContainer, ...styles.fullWidth }}>
        <label style={styles.label}>{t('login.telInput')}</label>
        <input
          type="tel"
          name="telephone"
          value={formData.telephone}
          onChange={handleChange}
          placeholder="0601020304"
          style={styles.input}
          className="input-inscription"
        />
        {errors.telephone && <span style={styles.error}>{errors.telephone}</span>}
      </div>
    </form>
  );
};

export default InscriptionRepresentant;

const styles = {
  formGroup: { display: "flex", gap: "20px", marginBottom: "10px" },
  inputContainer: { flex: 1, display: "flex", flexDirection: "column", marginBottom: "5px" },
  label: { fontSize: "1.05rem", fontWeight: "500", marginBottom: "5px", color: "#4D4D4D" },
  input: { padding: "10px", border: "1.5px solid #A67EF2", borderRadius: "25px", fontSize: "14px", color: "#925FE2", outline: "none", background: "white" },
  fullWidth: { width: "100%" },
  error: { color: "red", fontSize: "12px", marginTop: "5px" },
};
