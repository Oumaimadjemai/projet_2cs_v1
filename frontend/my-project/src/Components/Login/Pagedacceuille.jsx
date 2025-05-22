import React, { useState, useEffect, useRef } from 'react';
// import reactlogoconnect from '../../Assets/Images/logo.jpg';
import './Styles/IntroPage.css';
import { ReactComponent as LogoIcon } from '../../Assets/Icons/logo.svg';
import Typed from 'typed.js';


import Login from './Login'
function Pagedacceuille() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true); // Après 2 secondes, rendre l'interface invisible
    }, 3000); // Délai de 2000 millisecondes (2 secondes)

    // Nettoyer le timer lorsque le composant est démonté ou rechargé
    return () => clearTimeout(timer);
  }, []); // Ce useEffect s'exécute une seule fois après le premier rendu

  const typedElement = useRef(null);
  const typedInstance = useRef(null);

  useEffect(() => {
    // Lancer l'animation Typed
    typedInstance.current = new Typed(typedElement.current, {
      strings: ['Code Grade'],
      typeSpeed: 80,
      backSpeed: 40,
      backDelay: 1600,
      loop: true,
    });

    // Nettoyage
    return () => {
      if (typedInstance.current) {
        typedInstance.current.destroy();
      }
    };
  }, []);

  return (
    <div >
      {!isVisible && (

        <div className="introPage">

          <LogoIcon className="log-img" style={{ height: '100px' }} />

          <div style={{ marginTop: "1rem" }}>
            <span ref={typedElement} className="multi-texte" style={{ fontFamily: "Nunito, sans-serif", fontSize: "2rem", color: "#925FE2", fontWeight: "500" }}></span>
          </div>

          <div className="company-logo">
            <span>made with ❤️ by</span>
            <div className="meta-company">
              <span className="gradiant-text">A Group of CS Students</span>
            </div>
          </div>
        </div>
      )}
      {isVisible && <Login />}
    </div>
  )
}

export default Pagedacceuille