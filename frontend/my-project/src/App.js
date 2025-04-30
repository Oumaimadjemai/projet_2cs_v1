
import { Route, Routes } from "react-router";
import React, { useState } from 'react';

import './App.css';
import Enseignanteinterface from './Components/enseignante/Components/enseignanteinterface';
import Entrepriseinterface from './Components/entreprise/Components/entrepriseinterface';
import Login from './Components/Login/Login';
import Pagedacceuille from './Components/Login/Pagedacceuille';
import DemandeEntreprise from './Components/entreprise/listdemande'
import EntreprisesPage from './Components/entreprise/ListEntreprise';
import AjouterEntreprisePage from './Components/entreprise/AjouterEntreprise';
import InscriptionEntreprise from "./Components/inscriEntreprise/inscriEntreprise";
import { AdminLayout } from "./Layouts/AdminLayout";
import Dashboard from "./Components/admin/Components/Dashboard";
import EnseignantsListe from "./Components/admin/Components/EnseignantsListe";
import Etudiantinterface from "./Components/Etudiant/Components/etudiantinterface";

import Groupes from "./Components/Etudiant/pages/Groupes";
import Invitations from "./Components/Etudiant/pages/Invitation";
import Themeselectionform from "./Components/Etudiant/pages/ThemeSelectionForm";
import { EtudiantLayout } from "./Layouts/EtudiantLayout";
import Theme from "./Components/Etudiant/pages/Theme";
function App() {
  const [cards, setCards] = useState([]);

  const handleAddEntreprise = (newCompany) => {
    setCards((prev) => [...prev, newCompany]);
  };
  return (
    <div className='App'>
      <Routes>
        {/* pour la racine */}
        <Route path="/" element={<Pagedacceuille />} />
        <Route path="/admin" element={<AdminLayout />} >
          <Route index element={<Dashboard />} />
          <Route path="enseignants" element={<EnseignantsListe />} />
          <Route path="etudiants" element={<h1>etudiants</h1>} />
          <Route path="entreprises" element={<h1>entreprises</h1>} />
          <Route path="admins" element={<h1>admins</h1>} />
          <Route path="scolarite" element={<h1>scolarite</h1>} />
          <Route path="themes" element={<h1>Themes</h1>} />
          <Route path="groupes" element={<h1>groupes</h1>} />
          <Route path="soutenances" element={<h1>soutenances</h1>} />
          <Route path="profile" element={<h1>profile</h1>} />
          <Route path="settings" element={<h1>settings</h1>} />
          <Route path="notifications" element={<h1>notifications</h1>} />
        </Route>

        <Route path="/enseignant" element={<Enseignanteinterface />} ></Route>
        <Route path="/etudiant" element={<EtudiantLayout />} >
        <Route index element={<Dashboard />} />

        {/* <Route path="dashboard" element={<Themeselectionform  />} /> */}
        <Route path="groupes" element={<Groupes />} />
        <Route path="invitations" element={<Invitations />} />
        <Route path="group/:groupId/select-theme" element={<Themeselectionform  />} />

        </Route>

        <Route path="/entreprise" element={<Entrepriseinterface />} ></Route>
        <Route><Route path="/login" element={<Login />} /></Route>
        <Route><Route path="/inscription" element={< InscriptionEntreprise/>} /></Route>

  {/* pour la racine */}
  <Route path="/" element={<Pagedacceuille />} ></Route>
 {/* pour admin */}
 {/* <Route path="/admin" element={<Admininterface/>} ></Route> */}
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
