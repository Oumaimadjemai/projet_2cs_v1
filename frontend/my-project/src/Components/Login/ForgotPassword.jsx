import React, { useState } from 'react';
import axiosInstance from '../../axios';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import logoImg from '../../Assets/Images/logo-login.jpg';
import { IoIosArrowBack } from "react-icons/io";

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState({ text: '', isError: false });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ text: '', isError: false });

    try {
      await axiosInstance.post('/password-reset/', { email });
      setMessage({
        text: t('forgotPassword.successMessage'),
        isError: false
      });
    } catch (error) {
      setMessage({
        text: t('forgotPassword.errorMessage'),
        isError: true
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-[100vh] w-screen flex items-center justify-center bg-gray-100">
      <div className="w-screen h-screen flex shadow-lg rounded-lg overflow-hidden bg-white border border-gray-200">
        {/* Left Side - Image */}
        <div className="w-1/2 h-full hidden md:block">
          <img className="w-full h-full object-cover" src={logoImg} alt="Login" />
        </div>

        {/* Right Side - Form */}
        <div className="w-full md:w-1/2 flex flex-col px-6 md:px-12 py-8 bg-white rounded-lg relative">
          <button
            onClick={() => navigate('/login')}
            className="mb-4 flex items-center text-mypurple font-semibold hover:underline"
          >
            <IoIosArrowBack className="mr-1 text-xl" />
            {t('forgotPassword.backButton')}
          </button>

          <div className="flex flex-col justify-center items-center flex-grow">
            <h2 className="text-2xl font-bold text-mypurple text-center mb-6">
              {t('forgotPassword.title')}
            </h2>

            <div className='w-full md:w-[80%]'>
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold font-[Poppins] text-gray-700 text-left">
                    {t('login.emailInput')}
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="mt-1 w-full px-4 py-2 border rounded-full text-mypurple border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder={t('login.emailPlaceholder')}
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
                  disabled={isLoading}
                  className={`w-full mt-4 py-3 font-nunito text-white bg-gradient-to-r from-mypurple to-purple-400 rounded-full font-semibold text-lg shadow-md transition-opacity ${
                    isLoading ? 'opacity-75 cursor-not-allowed' : 'hover:opacity-90'
                  }`}
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {t('forgotPassword.loading')}
                    </span>
                  ) : (
                    t('forgotPassword.submitButton')
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;