import React, { useState, useEffect } from "react";

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

  return (
    <form>
      <div style={styles.formGroup}>
        <div style={styles.inputContainer}>
          <label style={styles.label}>Nom</label>
          <input
            type="text"
            name="nom"
            value={formData.nom}
            onChange={handleChange}
            placeholder="Entrez votre nom"
            style={styles.input}
          />
          {errors.nom && <span style={styles.error}>{errors.nom}</span>}
        </div>
        <div style={styles.inputContainer}>
          <label style={styles.label}>Prénom</label>
          <input
            type="text"
            name="prenom"
            value={formData.prenom}
            onChange={handleChange}
            placeholder="Entrez votre prénom"
            style={styles.input}
          />
          {errors.prenom && <span style={styles.error}>{errors.prenom}</span>}
        </div>
      </div>

      <div style={styles.formGroup}>
        <div style={styles.inputContainer}>
          <label style={styles.label}>Poste occupé</label>
          <select
            name="poste"
            value={formData.poste}
            onChange={handleChange}
            style={styles.input}
          >
            <option value="" disabled hidden>Poste occupé</option>
            <option value="Manager">Manager</option>
            <option value="Développeur">Développeur</option>
            <option value="Designer">Designer</option>
            <option value="Marketing">Marketing</option>
            <option value="Autre">Autre</option>
          </select>
          {errors.poste && <span style={styles.error}>{errors.poste}</span>}
        </div>
      </div>

      <div style={{ ...styles.inputContainer, ...styles.fullWidth }}>
        <label style={styles.label}>Email Professionnel</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="exemple@domaine.com"
          style={styles.input}
        />
        {errors.email && <span style={styles.error}>{errors.email}</span>}
      </div>

      <div style={{ ...styles.inputContainer, ...styles.fullWidth }}>
        <label style={styles.label}>N° Téléphone</label>
        <input
          type="tel"
          name="telephone"
          value={formData.telephone}
          onChange={handleChange}
          placeholder="0601020304"
          style={styles.input}
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
  label: { fontSize: "14px", fontWeight: "bold", marginBottom: "5px", color: "#333" },
  input: { padding: "10px", border: "2px solid #925FE2", borderRadius: "25px", fontSize: "14px", color: "#925FE2", outline: "none", background: "white" },
  fullWidth: { width: "100%" },
  error: { color: "red", fontSize: "12px", marginTop: "5px" },
};
