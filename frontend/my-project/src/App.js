import React, { useState, useEffect, createContext } from "react";
import { Route, Routes } from "react-router";
import './App.css';
import Enseignanteinterface from './Components/enseignante/Components/enseignanteinterface';
import Entrepriseinterface from './Components/entreprise/Components/entrepriseinterface';
import Login from './Components/Login/Login';
import Pagedacceuille from './Components/Login/Pagedacceuille';
// import InscriptionEntreprise from "./Components/inscriEntreprise/inscriEntreprise";
import { AdminLayout } from "./Layouts/AdminLayout";
import Dashboard from "./Components/admin/Components/Dashboard";
import EnseignantsListe from "./Components/admin/Components/EnseignantsListe";
import EtudiantsListe from "./Components/admin/Components/EtudiantsListe";
import ParametresScolarite, { ScolariteLayout } from "./Components/admin/Components/ParametresScolarite";
import cookies from 'js-cookie';
import i18n from "./Components/Partials/Components/i18n";
import { Annees, Departements, Salles, Specialites } from "./Components/admin/Components/Parametres";
import InscriptionEntreprise from "./Components/inscriEntreprise/inscriEntreprise";

export const AppContext = createContext();

function App() {

  const [lang, setLang] = useState(cookies.get('i18next') || 'ar');

  useEffect(() => {
    window.document.dir = i18n.dir();
  }, [lang])

  const [isRtl, setIsRtl] = useState(false);

  useEffect(() => {
    setIsRtl(document.documentElement.dir === "rtl");
  }, []);

  return (
    <AppContext.Provider value={{ isRtl, setIsRtl, setLang, lang }}>
      <div className='App'>
        <Routes>
          {/* pour la racine */}
          <Route index element={<Pagedacceuille />} />
          <Route path="/admin" element={<AdminLayout />} >
            <Route index element={<Dashboard />} />
            <Route path="enseignants" element={<EnseignantsListe />} />
            <Route path="etudiants" element={<EtudiantsListe />} />
            <Route path="entreprises" element={<h1>entreprises</h1>} />
            <Route path="admins" element={<h1>admins</h1>} />
            <Route path="scolarite" element={<ScolariteLayout />} >
              <Route index element={<ParametresScolarite />} />
              <Route path="departements" element={<Departements />} />
              <Route path="salles" element={<Salles />} />
              <Route path="specialites" element={<Specialites />} />
              <Route path="annees" element={<Annees />} />
            </Route>
            <Route path="themes" element={<h1>Themes</h1>} />
            <Route path="groupes" element={<h1>groupes</h1>} />
            <Route path="soutenances" element={<h1>soutenances</h1>} />
            <Route path="profile" element={<h1>profile</h1>} />
            <Route path="settings" element={<h1>settings</h1>} />
            <Route path="notifications" element={<h1>notifications</h1>} />
          </Route>

          <Route path="/enseignant" element={<Enseignanteinterface />} ></Route>
          <Route path="/entreprise" element={<Entrepriseinterface />} ></Route>
          <Route path="/login">
            <Route index element={<Login />} />
            <Route path="entreprise" element= {<InscriptionEntreprise />} />
          </Route>
        </Routes>
      </div>
    </AppContext.Provider>
  );
}

export default App;
