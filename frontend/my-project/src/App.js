import React, { useState, useEffect, createContext } from "react";
import { Route, Routes } from "react-router";
import './App.css';
// import Enseignanteinterface from './Components/enseignante/Components/enseignanteinterface';
import Entrepriseinterface from './Components/entreprise/Components/entrepriseinterface';
import Login from './Components/Login/Login';
import Pagedacceuille from './Components/Login/Pagedacceuille';
import DemandeEntreprise from './Components/entreprise/Pages/listdemande'
import InscriptionEntreprise from "./Components/inscriEntreprise/inscriEntreprise";
import { AdminLayout } from "./Layouts/AdminLayout";
import Dashboard from "./Components/admin/Components/Dashboard";
import EnseignantsListe from "./Components/admin/Components/EnseignantsListe";

import Groupes from "./Components/Etudiant/pages/Groupes";
import Invitations from "./Components/Etudiant/pages/Invitation";
import Themeselectionform from "./Components/Etudiant/pages/ThemeSelectionForm";
import { EtudiantLayout } from "./Layouts/EtudiantLayout";
import Theme from "./Components/Etudiant/pages/Theme";
import EtudiantsListe from "./Components/admin/Components/EtudiantsListe";
import ParametresScolarite, { ScolariteLayout } from "./Components/admin/Components/ParametresScolarite";
import cookies from 'js-cookie';
import i18n from "./Components/Partials/Components/i18n";
import { Annees, Departements, Salles, Specialites } from "./Components/admin/Components/Parametres";
// import TextToSpeech from "./Components/admin/Components/TextToSpeech";
import { EnseignantLayout } from "./Layouts/EnseignantLayout";
import Themes from "./Components/admin/Components/Themes";
import Notifications from "./Components/admin/Components/Notifications";
// import IntroPage from "./Components/Login/IntroPage";
import EntrepriseList, { EntrepriseListLayout } from "./Components/entreprise/Pages/ListEntreprise";
import ThemesEnseignant from "./Components/enseignante/Components/ThemesEnseignant";
import GroupeDetail from "./Components/enseignante/Components/GroupeDetail";
import GroupesEnseignant from "./Components/enseignante/Components/Groupes";
import ThemeAdmin from "./Components/admin/Components/ThemeAdmin";
import ThemeEnseignant from "./Components/enseignante/Components/Theme";
import ThemesEntreprise from "./Components/entreprise/Pages/Themes";
import { EntrepriseLayout } from "./Layouts/EntrepriseLayout";
import NotFound from "./Components/Partials/Components/NotFound";
import AdminsList from "./Components/admin/Components/AdminsListe";
import { SocketProvider } from "./Components/Contexts/useSocket";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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

  const token = localStorage.getItem('access_token');


  return (
    <AppContext.Provider value={{ isRtl, setIsRtl, setLang, lang }}>
      {/* {showIntro ? (
        <IntroPage onTimeout={handleIntroTimeout} />
      ) : ( */}
      <SocketProvider token={token}>
        <div className='App'>
          <Routes>

            <Route index element={<Pagedacceuille />} />
            <Route path="/login" element={<Login />} />
            <Route path="/login/entreprise" element={< InscriptionEntreprise />} />
            <Route path="*" element={<NotFound />} />

            <Route path="/admin" element={<AdminLayout />} >
              <Route index element={<Dashboard />} />
              <Route path="enseignants" element={<EnseignantsListe />} />
              <Route path="etudiants" element={<EtudiantsListe />} />
              <Route path="entreprises" element={<EntrepriseListLayout />} >
                <Route index element={<EntrepriseList />} />
                <Route path="demandes" element={<DemandeEntreprise />} />
              </Route>
              <Route path="admins" element={<AdminsList />} />
              <Route path="scolarite" element={<ScolariteLayout />} >
                <Route index element={<ParametresScolarite />} />
                <Route path="departements" element={<Departements />} />
                <Route path="salles" element={<Salles />} />
                <Route path="specialites" element={<Specialites />} />
                <Route path="annees" element={<Annees />} />
              </Route>
              <Route path="themes" element={<Themes />} />
              <Route path="themes/:id" element={<ThemeAdmin />} />
              <Route path="groupes" element={<h1>groupes</h1>} />
              <Route path="soutenances" element={<h1>soutenances</h1>} />
              <Route path="profile" element={<h1>profile</h1>} />
              <Route path="notifications" element={<Notifications />} />
            </Route>

            <Route path="/enseignant" element={<EnseignantLayout />} >
              <Route index element={<ThemesEnseignant />} />
              <Route path="groupes" element={<GroupesEnseignant />} />
              <Route path="groupes/:id" element={<GroupeDetail />} />
              <Route path="themes/:id" element={<ThemeEnseignant link={'enseignant'} />} />
            </Route>
            <Route path="/etudiant" element={<EtudiantLayout />} >
              <Route index element={<Dashboard />} />
              <Route path="groupes" element={<Groupes />} />
              <Route path="invitations" element={<Invitations />} />
              <Route path="themes" element={<Theme />} />
            </Route>

            <Route path="/entreprise" element={<EntrepriseLayout />} >
              <Route index element={<ThemesEntreprise />} />
              <Route path="themes/:id" element={<ThemeEnseignant link={'entreprise'} />} />
            </Route>

          </Routes>
          <ToastContainer position="top-right" autoClose={10000} />
        </div>
      </SocketProvider>
    </AppContext.Provider>
  );
}

export default App;