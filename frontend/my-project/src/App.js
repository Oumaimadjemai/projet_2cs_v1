
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
function App() {
  return (
    <div className='App'>
      <Routes>
        {/* pour la racine */}
        <Route index element={<Pagedacceuille />} />
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
        <Route path="/entreprise" element={<Entrepriseinterface />} ></Route>
        <Route><Route path="/login" element={<Login />} /></Route>
      </Routes>
    </div>
  );
}

export default App;
