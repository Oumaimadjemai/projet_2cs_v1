import React from "react";
import done from '../../Assets/Images/Done.png'
import '../Partials/Components/i18n'
import { useTranslation } from 'react-i18next';

const Final = () => {

  const { t } = useTranslation();

  return (
    <div style={styles.thankYouContainer}>
      <div className="img-container" style={{ width: "200px", height: "140px" }}>
        <img src={done} style={{ width: "100%", height: "100%", objectFit: "contain" }} alt="done" />
      </div>
      <h2 style={styles.thankYouTitle}>
      {t('login.merciNote')}
      </h2>
      <span style={{ textAlign: "center", fontFamily: "Kumbh Sans, sans-serif", fontSize: "1.15rem", color: "#00000070", fontWeight: "500" }}>
      {t('login.merciDetail')}
      </span>
    </div>
  );
};

export default Final;

const styles = {

  thankYouContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  thankYouTitle: {
    fontSize: "1.9rem",
    fontWeight: "bold",
    color: "#000",
    textAlign: "center",
    lineHeight: "1.3",
    marginBottom: "20px",
    fontFamily: "'Nunito', sans-serif",
  },
};
