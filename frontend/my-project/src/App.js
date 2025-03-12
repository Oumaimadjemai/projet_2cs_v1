
import { Route, Routes } from "react-router";
import './App.css';
import Admininterface from './Components/admin/admininterface';
import Enseignanteinterface from './Components/enseignante/enseignanteinterface';
import Entrepriseinterface from './Components/entreprise/entrepriseinterface';
import Login from './Components/Login/Login';
import Pagedacceuille from './Components/Login/Pagedacceuille';

function App() {
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
</Routes>
   </div> 
  );
}

export default App;
