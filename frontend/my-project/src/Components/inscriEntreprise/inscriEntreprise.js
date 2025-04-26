import React, { useState, useContext } from "react";
import Entreprise from "./Entreprise";
import Representant from "./Representant";
import Final from "./Final";
import { ReactComponent as CheckIcon } from '../../Assets/Icons/check.svg';
import logoImg from '../../Assets/Images/logo-login.jpg';
import '../Partials/Components/i18n'
import { useTranslation } from 'react-i18next';
import { AppContext } from "../../App";

const InscriptionEntreprise = () => {
  const [step, setStep] = useState(1);
  const [isStepValid, setIsStepValid] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [completedSteps, setCompletedSteps] = useState([]);

  const nextStep = () => {
    if (isStepValid) {
      const newCompletedSteps = [...new Set([...completedSteps, step])];
      setCompletedSteps(newCompletedSteps);
      setStep(step + 1);
      setIsStepValid(false);
      setErrorMessage("");
    } else {
      setErrorMessage("Veuillez remplir tous les champs obligatoires.");
    }
  };

  const returnStep = () => {
    if (step > 1) {
      setStep(step - 1);
      setCompletedSteps(prev => prev.filter(s => s !== step));
      setIsStepValid(true);
      setErrorMessage("");
    }
  }

  const {t} = useTranslation();

  const { isRtl } = useContext(AppContext);

  return (
    <div style={styles.container}>
      <div style={styles.formLeft}>
        <img src={logoImg} alt="logo" style={{width: "100%", height: "100%"}} />
      </div>

      <div style={styles.formRight}>
        <h1 style={styles.title}>CodeGradia</h1>

        <div style={styles.stepsContainer}>
          {[1, 2, 3].map((s, index) => (
            <React.Fragment key={s}>
              <div style={{
                ...styles.step,
                ...(s < step ? styles.completedStep : {}),
                ...(s === step ? styles.currentStep : {})
              }}>
                {completedSteps.includes(s) ? (
                  <CheckIcon />
                ) : (
                  <div
                    style={{
                      ...(s === step ? styles.activateCircle : styles.circle),
                    }}
                  />
                )}
              </div>
              {index < 2 && <div style={styles.line}></div>}
            </React.Fragment>
          ))}
        </div>
        <div style={styles.stepLabels}>
          <span style={{ ...styles.label, ...(step === 1 ? styles.activeLabel : {}) }}>{t('login.entrepriseLabel')}</span>
          <span style={{ ...styles.label, ...(step === 2 ? styles.activeLabel : {}) }}>{t('login.represantant')}</span>
          <span style={{ ...styles.label, ...(step === 3 ? styles.activeLabel : {}) }}>{t('login.merci')}</span>
        </div>

        <div style={styles.formContent}>
          {step === 1 && <Entreprise onValidationChange={setIsStepValid} />}
          {step === 2 && <Representant onValidationChange={setIsStepValid} />}
          {step === 3 && <Final />}
        </div>

        {errorMessage && <p style={styles.errorMessage}>{errorMessage}</p>}

        {step < 3 && (
          <div style={styles.buttonContainer}>
            {
              step === 2 &&
              <button style={styles.previousButton} onClick={returnStep}>
                <svg width="20" height="20" viewBox="0 0 32 32" style={{ transform: isRtl ? "" : "scaleX(-1)" }} fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M10.4393 5.93934C11.0251 5.35355 11.9749 5.35355 12.5607 5.93934L21.5607 14.9393C22.1464 15.5251 22.1464 16.4749 21.5607 17.0607L12.5607 26.0607C11.9749 26.6464 11.0251 26.6464 10.4393 26.0607C9.85355 25.4749 9.85355 24.5251 10.4393 23.9393L18.3787 16L10.4393 8.06066C9.85355 7.47487 9.85355 6.52513 10.4393 5.93934Z" fill="#00000070" />
                </svg>
                {t('login.revenir')}
              </button>
            }
            <button style={styles.nextButton} onClick={nextStep}>
            {t('login.suivant')}
              <svg width="20" height="20" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ transform: isRtl ? "scaleX(-1)" : "" }}>
                <path fill-rule="evenodd" clip-rule="evenodd" d="M10.4393 5.93934C11.0251 5.35355 11.9749 5.35355 12.5607 5.93934L21.5607 14.9393C22.1464 15.5251 22.1464 16.4749 21.5607 17.0607L12.5607 26.0607C11.9749 26.6464 11.0251 26.6464 10.4393 26.0607C9.85355 25.4749 9.85355 24.5251 10.4393 23.9393L18.3787 16L10.4393 8.06066C9.85355 7.47487 9.85355 6.52513 10.4393 5.93934Z" fill="white" />
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

  container: { display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", width: "100%", background: "white", borderRadius: "15px", overflow: "hidden", boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)" },
  formLeft: { height: "100vh", width: "40%", background: "#D3D3D3", display: "flex", justifyContent: "center", alignItems: "center" },
  imageText: { color: "#925FE2", fontSize: "18px", fontWeight: "bold" },
  formRight: { width: "60%", padding: "30px", display: "flex", flexDirection: "column", justifyContent: "space-between", height: "100%" },
  title: { color: "#925FE2", fontSize: "24px", fontWeight: "bold", textAlign: "right" },
  stepsContainer: { display: "flex", alignItems: "center", justifyContent: "center", margin: "15px 0" },
  step: { width: "30px", height: "30px", border: "1.5px solid #A098AE", borderRadius: "50%", fontSize: "12px", lineHeight: "18px", fontWeight: "bold", color: "#8A8A8A", display: "flex", justifyContent: "center", alignItems: "center" },
  currentStep: { border: "1.5px solid #A67EF2" },
  activeStep: { background: "#A67EF2", color: "white", borderColor: "#925FE2" },
  line: { width: "25%", height: "2px", background: "#D3D3D3" },
  stepLabels: { display: "flex", justifyContent: "space-evenly", fontSize: "14px", marginBottom: "30px" },
  activeLabel: { color: "#925FE2", fontWeight: "550", fontSize: "1.1rem" },
  formContent: { flexGrow: 1, width: "80%", alignSelf: "center" },
  buttonContainer: { display: "flex", justifyContent: "flex-end", marginTop: "20px", gap: "0.5rem" },
  nextButton: { display: "flex", marginBottom: "40px", alignItems: "center", justifyContent: "center", gap: "10px", background: "linear-gradient(to right, #925FE2, #693CA8)", color: "white", fontSize: "16px", fontWeight: "bold", border: "none", borderRadius: "25px", padding: "12px", cursor: "pointer", width: "30%", transition: "0.3s", boxShadow: "0 5px 10px rgba(146, 95, 226, 0.3)", fontFamily: "'Nunito', sans-serif" },
  circle: { width: "14px", height: "14px", borderRadius: "50%", backgroundColor: "#A098AE" },
  activateCircle: { width: "14px", height: "14px", borderRadius: "50%", backgroundColor: "#A67EF2" },
  previousButton: { display: "flex", marginBottom: "40px", alignItems: "center", justifyContent: "center", gap: "10px", background: "linear-gradient(to right, #E2E4E5, #DFCFF7)", color: "#00000080", fontSize: "16px", fontWeight: "bold", border: "none", borderRadius: "25px", padding: "12px", cursor: "pointer", width: "30%", transition: "0.3s", fontFamily: "'Nunito', sans-serif" },
  label: { fontFamily: "Nunito, sans-serif", fontSize: "1rem", color: "#A098AE" }
};
