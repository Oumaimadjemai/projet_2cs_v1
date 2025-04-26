import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../../axios';
import logoImg from '../../Assets/Images/logo-login.jpg';
import '../Partials/Components/i18n'
import { useTranslation, Trans } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../axios';  
import reactconnet from '../../Assets/Images/logo.jpg';
import { NavLink } from "react-router-dom";

function Login() {
   const [formData, updateFormData] = useState({ email: '', password: '' });
   const [errorMessage, setErrorMessage] = useState('');
   const navigate = useNavigate();

   const handleChange = (e) => {
      updateFormData({ ...formData, [e.target.name]: e.target.value.trim() });
   };

   const handleSubmit = async (e) => {
      e.preventDefault();
      try {
         const response = await axiosInstance.post('login/', {
            email: formData.email,
            password: formData.password,
         });

         const { access, refresh, user_info } = response.data;

         // Stocker les tokens et infos utilisateur
         localStorage.setItem('access_token', access);
         localStorage.setItem('refresh_token', refresh);
         localStorage.setItem('role', user_info.type);
         localStorage.setItem('user_id', user_info.id);
         localStorage.setItem('user_email', user_info.email);
         localStorage.setItem('user_nom', user_info.nom);
         localStorage.setItem('user_prenom', user_info.prenom);
         localStorage.setItem('user_grade', user_info.grade || '');


         axiosInstance.defaults.headers['Authorization'] = 'JWT ' + localStorage.getItem('access_token');


         console.log('Connexion réussie:', response.data);

         // Rediriger selon le rôle de l'utilisateur
         if (user_info.type === "admin") {
            navigate('/admin');
         } else if (user_info.type === "enseignant") {
            navigate('/enseignant');
         } else if (user_info.type === "entreprise") {
            navigate('/entreprise');
         }
         else if (user_info.type === "etudiant") {
            navigate('/etudiant');
         } else {
            console.error("Type d'utilisateur inconnu");
         }
      } catch (error) {
         console.error('Erreur de connexion :', error.response?.data || error.message);
         setErrorMessage('Email ou mot de passe incorrect');
      }
   };

   const { t } = useTranslation();

   return (
      <div className="h-[100vh] w-screen flex items-center justify-center bg-gray-100">
         <div className="w-screen h-screen flex shadow-lg rounded-lg overflow-hidden bg-white border border-gray-200">
            {/* Left Side */}
            <div className="w-1/2 h-full">
               <img className="w-full h-full object-cover" src={logoImg} alt="Login" />
            </div>
            {/* Right Side */}
            <div className="w-1/2 flex flex-col justify-center items-center px-12 bg-white rounded-lg">
               <h2 className="text-2xl font-bold text-mypurple text-center mb-6">{t('login.loginTitle')}</h2>
               <div className='w-[80%]'>
                  <form className="space-y-6" >
                     <div>
                        <label htmlFor="email" className="block text-sm font-semibold font-[Poppins] text-gray-700 text-left">{t('login.emailInput')}</label>
                        <input
                           id="email"
                           name="email"
                           type="email"
                           autoComplete="email"
                           required
                           className="mt-1 w-full px-4 py-2 border rounded-full text-mypurple border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                           onChange={handleChange}
                        />
                     </div>
                     <div>
                        <label htmlFor="password" className="block text-sm font-semibold font-[Poppins] text-gray-700 text-left">{t('login.PwdInput')}</label>
                        <div className="relative">
                           <input
                              id="password"
                              name="password"
                              type="password"
                              autoComplete="current-password"
                              required
                              className="mt-1 w-full px-4 py-2 border rounded-full text-mypurple border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                              onChange={handleChange}
                           />
                        </div>
                     </div>
                     {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}
                     <div className="text-sm text-mypurple text-right">
                        <a href="#" className="hover:underline">{t('login.pwdLost')}</a>
                     <NavLink to="/mot-de-passe-oublie" className="hover:underline">
                    Mot de passe oublié ?
                    </NavLink>
                     </div>
                     <div className="flex items-center w-full my-2">
                        <hr className="flex-grow border-gray-300" />
                        <p className="mx-2 text-gray-600 text-sm">
                           <Trans i18nKey={'login.entreprise'}>
                              Entreprise ? <Link to={'/login/entreprise'} className="text-mypurple hover:underline">Inscrivez-vous !</Link>
                           </Trans>
                        </p>
                        <p className="mx-2 text-gray-600 text-sm">
                                       Entreprise ?{" "}
                        <NavLink to="/inscription" className="text-mypurple hover:underline">
                           Inscrivez-vous !
                        </NavLink>
                        </p>
                        {/* <p className="mx-2 text-gray-600 text-sm">Entreprise ? <a href="#" className="text-mypurple hover:underline">Inscrivez-vous !</a></p> */}
                        <hr className="flex-grow border-gray-300" />
                     </div>
                     <button
                        type="submit"
                        onClick={handleSubmit}
                        className="w-full mt-4 py-3 font-nunito text-white bg-gradient-to-r from-mypurple to-purple-400 rounded-full font-semibold text-lg shadow-md hover:opacity-90"
                     >
                        {t('login.connecter')}
                     </button>
                  </form>
               </div>
            </div>
         </div>
      </div>
   );
}

export default Login;
