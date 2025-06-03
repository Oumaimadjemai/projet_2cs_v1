import React, { useState, useEffect } from 'react';
import { nodeAxios } from '../../../axios';
import { useNavigate, useParams } from 'react-router-dom';

const ThemeSelectionForm = () => {
  const [themes, setThemes] = useState([]);
  const [selections, setSelections] = useState({ p1: null, p2: null, p3: null });
  const [status, setStatus] = useState('not_started');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const { groupId } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [themesRes, choicesRes] = await Promise.all([
          nodeAxios.get('/themes'),
          nodeAxios.get(`/themes/my-choices?groupId=${groupId}`)
        ]);

        let themesData = [];
        if (Array.isArray(themesRes.data)) {
          themesData = themesRes.data;
        } else if (themesRes.data?.themes) {
          themesData = themesRes.data.themes;
        } else if (themesRes.data?.data) {
          themesData = themesRes.data.data;
        }
        setThemes(themesData);

        if (choicesRes.data) {
          const choicesData = choicesRes.data.choices || {};
          setSelections({
            p1: choicesData.p1 || null,
            p2: choicesData.p2 || null,
            p3: choicesData.p3 || null
          });
          setStatus(choicesRes.data.status || 'not_started');
        }
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [groupId]);

  const handleSelectChange = (priority, value) => {
    setSelections(prev => ({
      ...prev,
      [priority]: value ? parseInt(value) : null
    }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError(null);

      await nodeAxios.post('/themes/submit', {
        ...selections,
        groupId
      }, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      setStatus('submitted');
      setSuccess(true);
     
    } catch (err) {
      setError(err.response?.data?.error || 'Submission failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getThemeById = (id) => {
    return themes.find(theme => theme.id === id) || null;
  };

  if (loading && !success) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-[#925FE2] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-lg font-medium text-gray-600">Loading your theme options...</p>
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8 font-sans min-h-screen">
      <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Theme Selection
          </h1>
          {/* <p className="text-gray-600">Select your top 3 theme preferences in order of priority</p> */}
          <div className="w-20 h-1 mt-4 bg-[#925FE2] rounded"></div>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-r">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6 rounded-r">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-green-700">Your selections have been successfully submitted! Redirecting...</p>
              </div>
            </div>
          </div>
        )}

        {status === 'submitted' ? (
          <div className="space-y-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-green-800 mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Your choices have been submitted
              </h2>
              <p className="text-green-700 mb-6">Here are your theme selections:</p>
              
              {[1, 2, 3].map(priority => {
                const theme = getThemeById(selections[`p${priority}`]);
                return (
                  <div key={priority} className="bg-white p-4 mb-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                    <div className="flex items-start">
                      <div className="bg-[#925FE2] text-white rounded-full w-8 h-8 flex items-center justify-center mr-4 flex-shrink-0">
                        {priority}
                      </div>
                      <div>
                        <p className="text-gray-700 font-medium mb-1">Priority {priority}</p>
                        {theme ? (
                          <>
                            <p className="font-bold text-gray-900">{theme.titre}</p>
                            <p className="text-sm text-gray-600 mt-1">{theme.description || theme.resume || 'No description available'}</p>
                            {theme.specialite && (
                              <span className="inline-block bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full mt-2">
                                {theme.specialite}
                              </span>
                            )}
                          </>
                        ) : (
                          <p className="text-gray-500">No theme selected</p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {[1, 2, 3].map(priority => (
              <div key={priority} className="bg-gray-50 p-5 rounded-lg border border-gray-200 hover:border-[#925FE2] transition-colors">
                <div className="flex items-center mb-4">
                  <div className="bg-[#925FE2] text-white rounded-full w-8 h-8 flex items-center justify-center mr-3">
                    {priority}
                  </div>
                  <label className="block text-gray-700 font-semibold text-lg">
                    Priority {priority}
                  </label>
                </div>
                
                <select
                  value={selections[`p${priority}`] || ''}
                  onChange={(e) => handleSelectChange(`p${priority}`, e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#925FE2] focus:border-[#925FE2] focus:outline-none transition"
                >
                  <option value="">Select a theme...</option>
                  {themes.map(theme => (
                    <option
                      key={theme.id}
                      value={theme.id}
                      disabled={Object.values(selections)
                        .filter((val, idx) => idx !== priority - 1)
                        .includes(theme.id)}
                      className="py-2"
                    >
                      {theme.titre} - {theme.specialite}
                    </option>
                  ))}
                </select>

                {selections[`p${priority}`] && (
                  <div className="mt-4 p-4 bg-white rounded-lg border border-gray-200 animate-fadeIn">
                    <h3 className="font-semibold text-gray-800 text-lg">{getThemeById(selections[`p${priority}`])?.titre}</h3>
                    {getThemeById(selections[`p${priority}`])?.specialite && (
                      <span className="inline-block bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full mb-2">
                        {getThemeById(selections[`p${priority}`])?.specialite}
                      </span>
                    )}
                    <p className="text-gray-600 mt-2">
                      {getThemeById(selections[`p${priority}`])?.resume || getThemeById(selections[`p${priority}`])?.description || 'No description available'}
                    </p>
                  </div>
                )}
              </div>
            ))}

            <div className="pt-6 flex justify-end">
              <button
                onClick={handleSubmit}
                disabled={!selections.p1 || !selections.p2 || !selections.p3 || loading}
                className={`px-6 py-3 rounded-lg font-medium transition-all ${(!selections.p1 || !selections.p2 || !selections.p3) ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-[#925FE2] hover:bg-[#7b49cc] text-white shadow-md hover:shadow-lg'}`}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  status === 'not_started' ? 'Submit Selections' : 'Update Selections'
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ThemeSelectionForm;