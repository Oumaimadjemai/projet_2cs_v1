
import { Route, Routes } from "react-router";
import React, { useState } from 'react';

import './App.css';
import Admininterface from './Components/admin/admininterface';
import Enseignanteinterface from './Components/enseignante/enseignanteinterface';
import Entrepriseinterface from './Components/entreprise/entrepriseinterface';
import Login from './Components/Login/Login';
import Pagedacceuille from './Components/Login/Pagedacceuille';
import DemandeEntreprise from './Components/entreprise/listdemande'
import EntreprisesPage from './Components/entreprise/ListEntreprise';
import AjouterEntreprisePage from './Components/entreprise/AjouterEntreprise';

function App() {
  const [cards, setCards] = useState([]);

  const handleAddEntreprise = (newCompany) => {
    setCards((prev) => [...prev, newCompany]);
  };
  return (
   <div className='App'>
<Routes>
  {/* pour la racine */}
  <Route path="/" element={<Pagedacceuille />} ></Route>
 {/* pour admin */}
 <Route path="/admin" element={<Admininterface/>} ></Route>
  {/* pour enseignant */}
  <Route path="/enseignant" element={<Enseignanteinterface />} ></Route>
 {/* pour enseignant */}
 <Route path="/entreprise" element={<Entrepriseinterface />} ></Route>
{/* pour login */}
<Route><Route path="/login" element={<Login/>} /></Route>

<Route path="/listEntreprise"element={<EntreprisesPage cards={cards} setCards={setCards} />}/>
 <Route path="/ajouterEntreprise" element={<AjouterEntreprisePage onAddEntreprise={handleAddEntreprise} />}/>
 <Route path="/demandeEntreprise" element={<DemandeEntreprise />} />
</Routes>
   </div> 
  );
}

export default App;
