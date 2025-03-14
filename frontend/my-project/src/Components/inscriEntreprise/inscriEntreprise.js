import React, { useState } from "react";
import Entreprise from "./Entreprise";
import Representant from "./Representant";
import Final from "./Final";

const InscriptionEntreprise = () => {
  const [step, setStep] = useState(1);
  const [isStepValid, setIsStepValid] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [completedSteps, setCompletedSteps] = useState([]);

  const nextStep = () => {
    if (isStepValid) {
      const newCompletedSteps = [...new Set([...completedSteps, step, step + 1])];
      setCompletedSteps(newCompletedSteps);
      setStep(step + 1);
      setIsStepValid(false);
      setErrorMessage("");
    } else {
      setErrorMessage("Veuillez remplir tous les champs obligatoires.");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.formLeft}>
        <p style={styles.imageText}>Image de site</p>
      </div>

      <div style={styles.formRight}>
        <h1 style={styles.title}>Nom de Site</h1>

        <div style={styles.stepsContainer}>
          {[1, 2, 3].map((s, index) => (
            <React.Fragment key={s}>
              <div style={{
                ...styles.step,
                ...(step === s ? styles.activeStep : {}),
                ...(completedSteps.includes(s) || (step === 3 && s === 3) ? styles.completedStep : {})
              }}>
                {completedSteps.includes(s) || (step === 3 && s === 3) ? '✔' : '●'}
              </div>
              {index < 2 && <div style={styles.line}></div>}
            </React.Fragment>
          ))}
        </div>
        <div style={styles.stepLabels}>
          <span style={step === 1 ? styles.activeLabel : {}}>Entreprise</span>
          <span style={step === 2 ? styles.activeLabel : {}}>Représentant</span>
          <span style={step === 3 ? styles.activeLabel : {}}>Merci!</span>
        </div>

        <div style={styles.formContent}>
          {step === 1 && <Entreprise onValidationChange={setIsStepValid} />}
          {step === 2 && <Representant onValidationChange={setIsStepValid} />}
          {step === 3 && <Final />}
        </div>

        {errorMessage && <p style={styles.errorMessage}>{errorMessage}</p>}

        {step < 3 && (
          <div style={styles.buttonContainer}>
            <button style={styles.nextButton} onClick={nextStep}>
              Suivant
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" style={styles.iconNext} viewBox="0 0 16 16">
                <path fillRule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708"/>
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default InscriptionEntreprise;

const styles = {
  errorMessage: { color: "red", textAlign: "center", fontSize: "14px", marginTop: "10px" },
  completedStep: { background: "#925FE2", color: "white", borderColor: "#925FE2" },

  container: { marginLeft: "15%", marginTop: "3%", display: "flex", justifyContent: "center", alignItems: "center", height: "80vh", width: "70%", background: "white", borderRadius: "15px", overflow: "hidden", boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)" },
  formLeft: { height: "90vh", width: "40%", background: "#D3D3D3", display: "flex", justifyContent: "center", alignItems: "center" },
  imageText: { color: "#925FE2", fontSize: "18px", fontWeight: "bold" },
  formRight: { width: "60%", padding: "30px", display: "flex", flexDirection: "column", justifyContent: "space-between", height: "100%" },
  title: { color: "#925FE2", fontSize: "24px", fontWeight: "bold", textAlign: "right" },
  stepsContainer: { display: "flex", alignItems: "center", justifyContent: "center", margin: "15px 0" },
  step: { width: "20px", height: "20px", background: "white", border: "2px solid #8A8A8A", borderRadius: "50%", textAlign: "center", fontSize: "12px", lineHeight: "18px", fontWeight: "bold", color: "#8A8A8A" },
  activeStep: { background: "#925FE2", color: "white", borderColor: "#925FE2" },
  line: { width: "25%", height: "2px", background: "#D3D3D3" },
  stepLabels: { display: "flex", justifyContent: "space-evenly", fontSize: "14px", marginBottom: "30px" },
  activeLabel: { color: "#925FE2", fontWeight: "bold" },
  formContent: { flexGrow: 1 },
  buttonContainer: { display: "flex", justifyContent: "flex-end", marginTop: "20px" },
  nextButton: { display: "flex", marginBottom:"40px",alignItems: "center", justifyContent: "center", gap: "10px", background: "linear-gradient(to right, #925FE2, #693CA8)", color: "white", fontSize: "16px", fontWeight: "bold", border: "none", borderRadius: "25px", padding: "12px", cursor: "pointer", width: "30%", transition: "0.3s", boxShadow: "0 5px 10px rgba(146, 95, 226, 0.3)" },
};
