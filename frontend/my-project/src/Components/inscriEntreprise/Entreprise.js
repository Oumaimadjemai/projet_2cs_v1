import React, { useState, useEffect } from "react";
import wilayas from "./Willaya"; 

const Entreprise = ({ onValidationChange }) => {
  const [nom, setNom] = useState("");
  const [secteur, setSecteur] = useState("");
  const [selectedWilaya, setSelectedWilaya] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [adresse, setAdresse] = useState("");
  const [siteWeb, setSiteWeb] = useState("");

  useEffect(() => {
    const isValid = nom && secteur && selectedWilaya && selectedCity && adresse && siteWeb;
    onValidationChange(isValid);
  }, [nom, secteur, selectedWilaya, selectedCity, adresse, siteWeb, onValidationChange]);

  return (
    <form>
      <div style={styles.formGroup}>
        <div style={styles.inputContainer}>
          <label style={styles.label}>Nom</label>
          <input type="text" placeholder="Nom de l'entreprise" required style={styles.input} 
            value={nom} onChange={(e) => setNom(e.target.value)} />
        </div>
        <div style={styles.inputContainer}>
          <label style={styles.label}>Secteur d’activité</label>
          <input type="text" placeholder="Secteur d’activité" required style={styles.input} 
            value={secteur} onChange={(e) => setSecteur(e.target.value)} />
        </div>
      </div>

      <div style={styles.formGroup}>
        <div style={styles.inputContainer}>
          <label style={styles.label}>Wilaya</label>
          <select value={selectedWilaya} onChange={(e) => { setSelectedWilaya(e.target.value); setSelectedCity(""); }} required style={styles.input}>
            <option value="">Sélectionner une wilaya</option>
            {Object.entries(wilayas).map(([code, wilaya]) => (
              <option key={code} value={code}>{wilaya.name}</option>
            ))}
          </select>
        </div>
        <div style={styles.inputContainer}>
          <label style={styles.label}>Ville</label>
          <select value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)} required style={styles.input}>
            <option value="">Sélectionner une ville</option>
            {selectedWilaya && wilayas[selectedWilaya].cities.map((city, index) => (
              <option key={index} value={city}>{city}</option>
            ))}
          </select>
        </div>
      </div>

      <div style={{ ...styles.inputContainer, ...styles.fullWidth }}>
        <label style={styles.label}>Adresse</label>
        <input type="text" placeholder="Rue Didouche Mourad..." required style={styles.input} 
          value={adresse} onChange={(e) => setAdresse(e.target.value)} />
      </div>

      <div style={{ ...styles.inputContainer, ...styles.fullWidth }}>
        <label style={styles.label}>Site Web</label>
        <input type="text" placeholder="www.techinnovdz.com" required style={styles.input} 
          value={siteWeb} onChange={(e) => setSiteWeb(e.target.value)} />
      </div>
    </form>
  );
};

export default Entreprise;

const styles = {
  formContainer: { marginLeft: "15%", marginTop: "3%", display: "flex", justifyContent: "center", alignItems: "center", height: "90vh", width: "70%", background: "white", borderRadius: "15px", overflow: "hidden", boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)" },
  formRight: { width: "60%", padding: "30px" },
  line: { width: "25%", height: "2px", background: "#D3D3D3" },
  form: { display: "flex", flexDirection: "column" },
  formGroup: { display: "flex", gap: "20px" },
  inputContainer: { flex: 1, display: "flex", flexDirection: "column", marginBottom: "5px" },
  label: { fontSize: "14px", fontWeight: "bold", marginBottom: "5px", color: "#333", fontFamily: "'Poppins', sans-serif" },
  input: { padding: "10px", border: "2px solid #925FE2", borderRadius: "25px", fontSize: "14px", color: "#925FE2", outline: "none", background: "white", textAlign: "center", fontFamily: "'Nunito', sans-serif" },
  fullWidth: { width: "100%" },
  nextButton: { display: "flex", alignItems: "center", justifyContent: "center", gap: "28px", marginTop: "20px", background: "linear-gradient(to right, #925FE2, #693CA8)", color: "white", fontSize: "16px", fontWeight: "bold", border: "none", borderRadius: "25px", padding: "12px", cursor: "pointer", width: "30%", marginLeft: "auto", transition: "0.3s", boxShadow: "0 5px 10px rgba(146, 95, 226, 0.3)" },
  iconNext: { width: "18px", height: "18px", fill: "white" },
  select: { padding: "12px", border: "2px solid #925FE2", borderRadius: "25px", fontSize: "14px", color: "#925FE2", outline: "none", background: "white", textAlign: "center" },
  inputWithIcon: { padding: "10px 10px 10px 40px", border: "2px solid #925FE2", borderRadius: "25px", fontSize: "14px", color: "#925FE2", background: "white", textAlign: "left", backgroundRepeat: "no-repeat", backgroundPosition: "10px center", backgroundSize: "16px" },
  inputWithIcon2: { padding: "10px 10px 10px 40px", border: "2px solid #925FE2", borderRadius: "25px", fontSize: "14px", color: "#925FE2", background: "white", textAlign: "left", backgroundRepeat: "no-repeat", backgroundPosition: "10px center", backgroundSize: "20px" }
};