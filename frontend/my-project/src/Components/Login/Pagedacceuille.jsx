import React, { useState, useEffect } from 'react';
import reactlogoconnect from '../../Assets/Images/logo.jpg';


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

  return (
<div >
{!isVisible && (
 
    <div className=" w-screen h-[100vh] flex justify-center ">

        <div className='w-full h-full flex items-start'>
        <div className=' w-[20%] h-[20%]'>
          <img
            className="mx-auto h-16 w-auto mt-[6rem]  ml-[3rem]"
            src={reactlogoconnect}
            alt="Your logo"
          />
          </div>
        </div>
    </div>
    )}
    {isVisible && <Login/> }
    </div>
  )
}

export default Pagedacceuille