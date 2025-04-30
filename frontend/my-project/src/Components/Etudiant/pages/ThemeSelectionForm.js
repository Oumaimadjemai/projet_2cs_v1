import React, { useState, useEffect } from 'react';
import { nodeAxios } from '../../../axios';
import { useNavigate, useParams } from 'react-router-dom';
const ThemeSelectionForm = () => {
  const [themes, setThemes] = useState([]);
  const [selections, setSelections] = useState({
    p1: null,
    p2: null,
    p3: null
  });
  const [status, setStatus] = useState('not_started');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { groupId } = useParams();

  // Fetch data
  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       setLoading(true);
  //       const [themesRes, selectionsRes] = await Promise.all([
  //         nodeAxios.get('/theme-selection/available-themes'),
  //         nodeAxios.get('/theme-selection/my-choices?groupId=${groupId}')
  //       ]);

  //       setThemes(themesRes.data);
        
  //       if (selectionsRes.data.status !== 'not_started') {
  //         setSelections(selectionsRes.data.choices);
  //         setStatus(selectionsRes.data.status);
  //       }
  //     } catch (err) {
  //       setError(err.response?.data?.error || 'Failed to load data');
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchData();
  // }, []);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [themesRes, selectionsRes] = await Promise.all([
          nodeAxios.get('/themes/available-themes'),
          nodeAxios.get(`/themes/my-choices?groupId=${groupId}`) // ✅ Correct
        ]);

        setThemes(themesRes.data);
        
        if (selectionsRes.data.status !== 'not_started') {
          setSelections(selectionsRes.data.choices);
          setStatus(selectionsRes.data.status);
        }
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load data');
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



// const handleSubmit = async () => {
//     try {
//       setLoading(true);
      
//       // Prepare the request data
//       const submissionData = {
//         p1: selections.p1,
//         p2: selections.p2,
//         p3: selections.p3
//       };
  
//       const response = await nodeAxios.post(
//         '/theme-selection/submit',
//         submissionData,  // Send the selections in request body
//         {
//           headers: {
//             'Content-Type': 'application/json',
//             Authorization: `Bearer ${localStorage.getItem('token')}`
//           }
//         }
//       );
  
//       setStatus('submitted');
//       alert('Selections submitted successfully!');
//       navigate('/confirmation');
//     } catch (err) {
//       console.error('Submission error:', err);
//       setError(err.response?.data?.error || 'Submission failed');
//     } finally {
//       setLoading(false);
//     }
//   };  
const handleSubmit = async () => {
  try {
    setLoading(true);
    
    // Ajout du groupId aux données de la soumission
    const submissionData = {
      p1: selections.p1,
      p2: selections.p2,
      p3: selections.p3,
      groupId: groupId // Ajout du groupId ici
    };
  
    const response = await nodeAxios.post(
      '/themes/submit',
      submissionData,  // Ajout du groupId dans les données
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      }
    );
  
    setStatus('submitted');
    alert('Selections submitted successfully!');
    navigate('/confirmation');
  } catch (err) {
    console.error('Submission error:', err);
    setError(err.response?.data?.error || 'Submission failed');
  } finally {
    setLoading(false);
  }
};

const getThemeById = (id) => themes.find(theme => theme.id === id);

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (error) return <div className="text-red-500 p-4">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Theme Selection</h1>
      
      {status === 'submitted' ? (
        <div className="bg-green-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Your selections have been submitted</h2>
          {[1, 2, 3].map(priority => {
            const theme = getThemeById(selections[`p${priority}`]);
            return (
              <div key={priority} className="mb-4 p-3 bg-white rounded shadow">
                <h3 className="font-medium">Priority {priority}:</h3>
                {theme ? (
                  <div>
                    <p className="font-bold">{theme.title}</p>
                    <p className="text-gray-600">{theme.description}</p>
                  </div>
                ) : (
                  <p>Not selected</p>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="space-y-6">
          {[1, 2, 3].map(priority => (
            <div key={priority} className="bg-white p-4 rounded-lg shadow">
              <label className="block font-medium mb-2">
                Priority {priority} (P{priority})
              </label>
              <select
                value={selections[`p${priority}`] || ''}
                onChange={(e) => handleSelectChange(`p${priority}`, e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
              >
                <option value="">Select a theme...</option>
                {themes.map(theme => (
                  <option 
                    key={theme.id} 
                    value={theme.id}
                    // Disable if selected in another priority
                    disabled={Object.values(selections)
                      .filter((val, idx) => idx !== priority - 1)
                      .includes(theme.id)}
                  >
                    {theme.title} - {theme.specialite}
                  </option>
                ))}
              </select>
              
              {selections[`p${priority}`] && (
                <div className="mt-2 p-2 bg-gray-50 rounded">
                  <p className="font-semibold">{getThemeById(selections[`p${priority}`])?.title}</p>
                  <p className="text-sm text-gray-600">
                    {getThemeById(selections[`p${priority}`])?.description}
                  </p>
                </div>
              )}
            </div>
          ))}
          
          <div className="flex justify-end">
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300"
              disabled={!selections.p1 || !selections.p2 || !selections.p3}
            >
              Submit Selections
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ThemeSelectionForm;

