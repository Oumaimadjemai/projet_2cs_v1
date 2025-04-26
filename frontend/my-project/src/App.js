import React, { useState, useEffect, createContext } from "react";
import { Route, Routes } from "react-router";
import './App.css';
// import Enseignanteinterface from './Components/enseignante/Components/enseignanteinterface';
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
import { AdminLayout } from "./Layouts/AdminLayout";
import Dashboard from "./Components/admin/Components/Dashboard";
import EnseignantsListe from "./Components/admin/Components/EnseignantsListe";
import EtudiantsListe from "./Components/admin/Components/EtudiantsListe";
import ParametresScolarite, { ScolariteLayout } from "./Components/admin/Components/ParametresScolarite";
import cookies from 'js-cookie';
import i18n from "./Components/Partials/Components/i18n";
import { Annees, Departements, Salles, Specialites } from "./Components/admin/Components/Parametres";
import InscriptionEntreprise from "./Components/inscriEntreprise/inscriEntreprise";
// import TextToSpeech from "./Components/admin/Components/TextToSpeech";
import { EnseignantLayout } from "./Layouts/EnseignantLayout";
import Themes from "./Components/admin/Components/Themes";
import Notifications from "./Components/admin/Components/Notifications";
// import IntroPage from "./Components/Login/IntroPage";
import DemandeEntreprise from './Components/entreprise/Pages/listdemande'
import EntrepriseList, { EntrepriseListLayout } from "./Components/entreprise/Pages/ListEntreprise";
import AjouterEntreprisePage from './Components/entreprise/Components/AjouterEntreprise';
import ThemesEnseignant from "./Components/enseignante/Components/ThemesEnseignant";
import Groupes, { GroupeLayout } from "./Components/enseignante/Components/Groupes";
import PrioriteSpecialite from "./Components/entreprise/Components/ExampleSelect";
import GroupeDetail from "./Components/enseignante/Components/GroupeDetail";

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

  // const [showIntro, setShowIntro] = useState(true);

  // const handleIntroTimeout = () => {
  //   setShowIntro(false); // Hide the intro screen
  // };

  const [cards, setCards] = useState([]);

  const handleAddEntreprise = (newCompany) => {
    setCards((prev) => [...prev, newCompany]);
  };

  return (
    <AppContext.Provider value={{ isRtl, setIsRtl, setLang, lang }}>
      {/* {showIntro ? (
        <IntroPage onTimeout={handleIntroTimeout} />
      ) : ( */}
      <div className='App'>
        <Routes>
          {/* pour la racine */}
          <Route index element={<Pagedacceuille />} />
          <Route path="/admin" element={<AdminLayout />} >
            <Route index element={<Dashboard />} />
            <Route path="enseignants" element={<EnseignantsListe />} />
            <Route path="etudiants" element={<EtudiantsListe />} />
            <Route path="entreprises" element={<EntrepriseListLayout />} >
              <Route index element={<EntrepriseList />} />
              <Route path="demandes" element={<DemandeEntreprise />} />
            </Route>
            <Route path="admins" element={<h1>admins</h1>} />
            <Route path="scolarite" element={<ScolariteLayout />} >
              <Route index element={<ParametresScolarite />} />
              <Route path="departements" element={<Departements />} />
              <Route path="salles" element={<Salles />} />
              <Route path="specialites" element={<Specialites />} />
              <Route path="annees" element={<Annees />} />
            </Route>
            <Route path="themes" element={<Themes />} />
            <Route path="groupes" element={<h1>groupes</h1>} />
            <Route path="soutenances" element={<h1>soutenances</h1>} />
            <Route path="profile" element={<h1>profile</h1>} />
            <Route path="notifications" element={<Notifications />} />
          </Route>

          <Route path="/enseignant" element={<Enseignanteinterface />} ></Route>
          <Route path="/etudiant" element={<EtudiantLayout />} >
            <Route index element={<Dashboard />} />

            {/* <Route path="dashboard" element={<Themeselectionform  />} /> */}
            <Route path="groupes" element={<Groupes />} />
            <Route path="invitations" element={<Invitations />} />
            <Route path="themes" element={<Theme />} />

          </Route>

          <Route path="/entreprise" element={<Entrepriseinterface />} ></Route>
          <Route><Route path="/login" element={<Login />} /></Route>
          <Route><Route path="/inscription" element={< InscriptionEntreprise />} /></Route>
        </Routes>
      </div>
    </AppContext.Provider>
  );
}

export default App;