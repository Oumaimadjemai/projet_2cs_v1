import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../../axios';
import { useTranslation } from 'react-i18next';
import logoImg from '../../Assets/Images/logo-login.jpg';

function ResetPassword() {
  const { uid, token } = useParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState({ text: '', isError: false });
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (password.length < 8) {
      setMessage({
        text: t('Password.tooShort'),
        isError: true
      }); 
      return;
    }
  
    if (password !== confirmPassword) {
      setMessage({
        text: t('Password.mismatch'),
        isError: true
      });
      return; 
    }
  
    try {
      await axiosInstance.post('/password-reset-confirm/', {
        uid,
        token,
        new_password: password
      });
      setMessage({
        text: t('resetPassword.success'),
        isError: false
      });
      setTimeout(() => navigate('/login'), 2000);
    } catch (error) {
      setMessage({
        text: t('resetPassword.error'),
        isError: true
      });
    }
  };

  return (
    <div className="h-[100vh] w-screen flex items-center justify-center bg-gray-100">
      <div className="w-screen h-screen flex shadow-lg rounded-lg overflow-hidden bg-white border border-gray-200">
        {/* Left Side - Image */}
        <div className="w-1/2 h-full">
          <img className="w-full h-full object-cover" src={logoImg} alt="Login" />
        </div>

        {/* Right Side - Form */}
        <div className="w-1/2 flex flex-col justify-center items-center px-12 bg-white rounded-lg">
          <h2 className="text-2xl font-bold text-mypurple text-center mb-6">
            {t('resetPassword.title')}
          </h2>
          
          <div className='w-[80%]'>
            <form className="space-y-6">
              <div>
                <label htmlFor="password" className="block text-sm font-semibold font-[Poppins] text-gray-700 text-left">
                  {t('resetPassword.newPassword')}
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="mt-1 w-full px-4 py-2 border rounded-full text-mypurple border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-semibold font-[Poppins] text-gray-700 text-left">
                  {t('resetPassword.confirmPassword')}
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="mt-1 w-full px-4 py-2 border rounded-full text-mypurple border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              {message.text && (
                <div className={`p-3 rounded-lg text-sm ${
                  message.isError ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'
                }`}>
                  {message.text}
                </div>
              )}

              <button
                type="submit"
                onClick={handleSubmit}
                className="w-full mt-4 py-3 font-nunito text-white bg-gradient-to-r from-mypurple to-purple-400 rounded-full font-semibold text-lg shadow-md hover:opacity-90"
              >
                {t('resetPassword.submit')}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;