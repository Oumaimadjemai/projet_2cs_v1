import React, { useState } from 'react';

const TextToSpeech = () => {
  const [selectedText, setSelectedText] = useState('');

  // Fonction pour lire le texte sélectionné
  const speakText = () => {
    if (selectedText && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(selectedText);
      speechSynthesis.speak(utterance);
    }
  };

  // Récupérer le texte sélectionné par l'utilisateur
  const handleMouseUp = () => {
    const text = window.getSelection().toString();
    if (text) {
      setSelectedText(text);
    }
  };

  return (
    <div onMouseUp={handleMouseUp}>
      <p>
        Ceci est un paragraphe que vous pouvez sélectionner. Quand vous le sélectionnez,
        un bouton apparaîtra pour le lire à voix haute.
      </p>

      {selectedText && (
        <button onClick={speakText} style={{ marginTop: '10px' }}>
          🔊 Lire le texte
        </button>
      )}
    </div>
  );
};

export default TextToSpeech;
