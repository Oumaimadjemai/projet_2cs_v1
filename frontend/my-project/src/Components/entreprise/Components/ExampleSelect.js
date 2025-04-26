import React, { useState } from 'react';

const specialites = ['SIW', 'ISI', 'SIL'];
const annees = ['2eme', '3eme', '4eme', '5eme'];

const CustomDropdown = () => {
  const [selectedAnnee, setSelectedAnnee] = useState('');
  const [priorites, setPriorites] = useState({ 1: '', 2: '', 3: '' });
  const [openPriorite, setOpenPriorite] = useState(null);

  const handleAnneeClick = (annee) => {
    setSelectedAnnee(annee);
    setPriorites({ 1: '', 2: '', 3: '' });
  };

  const handleSpecialiteSelect = (priorite, value) => {
    setPriorites((prev) => {
      const updated = { ...prev };
      updated[priorite] = value;
      return updated;
    });
    setOpenPriorite(null);
  };

  const alreadySelected = Object.values(priorites);

  return (
    <div style={{ width: 300, fontFamily: 'Arial', padding: 20 }}>
      {/* Dropdown année */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontWeight: 'bold', marginBottom: 5 }}>Année</div>
        <div style={{ border: '1px solid #ccc', borderRadius: 6, padding: 10, cursor: 'pointer' }}>
          <div>{selectedAnnee || 'Sélectionner une année'}</div>
          <div style={{ marginTop: 10 }}>
            {annees.map((a) => (
              <div
                key={a}
                onClick={() => handleAnneeClick(a)}
                style={{
                  padding: 8,
                  borderBottom: '1px solid #eee',
                  backgroundColor: selectedAnnee === a ? '#f0f0f0' : 'white',
                  cursor: 'pointer',
                }}
              >
                {a}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Si 4ème ou 5ème, afficher priorités */}
      {(selectedAnnee === '4eme' || selectedAnnee === '5eme') &&
        [1, 2, 3].map((p) => (
          <div key={p} style={{ marginBottom: 15 }}>
            <div style={{ fontWeight: 'bold', marginBottom: 5 }}>Priorité {p}</div>
            <div
              onClick={() => setOpenPriorite(openPriorite === p ? null : p)}
              style={{
                border: '1px solid #ccc',
                borderRadius: 6,
                padding: 10,
                backgroundColor: '#fff',
                cursor: 'pointer',
              }}
            >
              {priorites[p] || 'Choisir une spécialité'}
            </div>
            {openPriorite === p && (
              <div style={{ border: '1px solid #eee', borderRadius: 6, marginTop: 5 }}>
                {specialites
                  .filter((s) => !alreadySelected.includes(s) || priorites[p] === s)
                  .map((s) => (
                    <div
                      key={s}
                      onClick={() => handleSpecialiteSelect(p, s)}
                      style={{
                        padding: 8,
                        borderBottom: '1px solid #eee',
                        cursor: 'pointer',
                        backgroundColor: priorites[p] === s ? '#f0f0f0' : 'white',
                      }}
                    >
                      {s}
                    </div>
                  ))}
              </div>
            )}
          </div>
        ))}
    </div>
  );
};

export default CustomDropdown;
