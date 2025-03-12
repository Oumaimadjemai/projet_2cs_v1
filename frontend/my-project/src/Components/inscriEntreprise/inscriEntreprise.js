import React, { useState } from "react";

import wilayas from "./Willaya"; 

const InscriptionEntreprise = () => {
  const [selectedWilaya, setSelectedWilaya] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  const handleWilayaChange = (e) => {
    const wilayaCode = e.target.value;
    setSelectedWilaya(wilayaCode);
    setSelectedCity("");
  };

  return (
    <div style={styles.formContainer}>
      <div style={styles.formLeft}>
        <p style={styles.imageText}>Image de site</p>
      </div>

      <div style={styles.formRight}>
        <h1 style={styles.title}>Nom de Site</h1>

        <div style={styles.steps}>
          <div style={{ ...styles.step, ...styles.activeStep }}>●</div> 
          <div style={styles.line}></div>
          <div style={styles.step}>●</div>
          <div style={styles.line}></div>
          <div style={styles.step}>●</div>
        </div>
        <div style={styles.stepLabels}>
          <span style={styles.activeStepLabel}>Entreprise</span>
          <span>Représentant</span>
          <span>Merci!</span>
        </div>

        <form>
          <div style={styles.formGroup}>
            <div style={styles.inputContainer}>
              <label style={styles.label}>Nom</label>
              <input type="text" placeholder="Nom de l'entreprise" required style={styles.input} />
            </div>
            <div style={styles.inputContainer}>
              <label style={styles.label}>Secteur d’activité</label>
              <input type="text" placeholder="Secteur d’activité" required style={styles.input} />
            </div>
          </div>

          <div style={styles.formGroup}>
            <div style={styles.inputContainer}>
              <label style={styles.label}>Wilaya</label>
              <select value={selectedWilaya} onChange={handleWilayaChange} required style={styles.input}>
                <option value="">Sélectionner une wilaya</option>
                {Object.entries(wilayas).map(([code, wilaya]) => (
                  <option key={code} value={code}>
                    {wilaya.name}
                  </option>
                ))}
              </select>
            </div>
            <div style={styles.inputContainer}>
              <label style={styles.label}>Ville</label>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                required
                style={styles.input}
              >
                <option value="">Sélectionner une ville</option>
                {selectedWilaya &&
                  wilayas[selectedWilaya].cities.map((city, index) => (
                    <option key={index} value={city}>
                      {city}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          <div style={{ ...styles.inputContainer, ...styles.fullWidth }}>
            <label style={styles.label}>Adresse</label>
            <input
              type="text"
              placeholder="Rue Didouche Mourad..."
              required
              style={{ ...styles.input, ...styles.inputWithIcon }}
            />
          </div>

          <div style={{ ...styles.inputContainer, ...styles.fullWidth }}>
            <label style={styles.label}>Site Web</label>
            <input
              type="text"
              placeholder="www.techinnovdz.com"
              required
              style={{ ...styles.input, ...styles.inputWithIcon2 }}
            />
          </div>

          <button style={styles.nextButton}>
            Suivant
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              style={styles.iconNext}
              viewBox="0 0 16 16"
            >
              <path
                fillRule="evenodd"
                d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708"
              />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
};

export default InscriptionEntreprise;
const styles = {
  formContainer: { marginLeft: "15%", marginTop: "3%", display: "flex", justifyContent: "center", alignItems: "center", height: "90vh", width: "70%", background: "white", borderRadius: "15px", overflow: "hidden", boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)" },
  formLeft: { height: "90vh", width: "40%", background: "#D3D3D3", display: "flex", justifyContent: "center", alignItems: "center" },
  imageText: { color: "#925FE2", fontSize: "18px", fontWeight: "bold" },
  formRight: { width: "60%", padding: "30px" },
  title: { color: "#925FE2", fontSize: "24px", fontWeight: "bold", textAlign: "right" },
  steps: { display: "flex", alignItems: "center", justifyContent: "center", margin: "15px 0" },
  step: { width: "20px", height: "20px", background: "white", border: "2px solid #8A8A8A", borderRadius: "50%", textAlign: "center", fontSize: "12px", lineHeight: "18px", fontWeight: "bold", color: "#8A8A8A" },
  activeStep: { background: "#925FE2", color: "white", borderColor: "#925FE2" },
  line: { width: "25%", height: "2px", background: "#D3D3D3" },
  stepLabels: { display: "flex", justifyContent: "space-evenly", fontSize: "14px", marginBottom: "30px" },
  stepLabelsSpan: { color: "#8A8A8A" },
  activeStepLabel: { color: "#925FE2", fontWeight: "bold" },
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