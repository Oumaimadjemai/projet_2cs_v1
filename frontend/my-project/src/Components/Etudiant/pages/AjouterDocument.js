import React, { useState } from 'react';
import { ReactComponent as CloudIcon } from '../../../Assets/Icons/cloud.svg';
import { ReactComponent as CloseIcon } from '../../../Assets/Icons/close.svg';
import { useTranslation } from 'react-i18next';
import { nodeAxios2 } from '../../../axios';
import '../../Partials/Components/i18n';
import '../../admin/Styles/EnseignantsListe.css';
import axios from 'axios'

export const AjouterDocument = ({ annulerAjouter,onSuccess,groupId }) => {
    const [file, setFile] = useState(null);
    const [title, setTitle] = useState('');
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { t } = useTranslation();

    // Types MIME autorisés (PDF uniquement)
    const allowedTypes = [
        'application/pdf'
    ];

    // Taille maximale du fichier (5MB)
    const MAX_FILE_SIZE = 5 * 1024 * 1024*1024;

    const validateFile = (selectedFile) => {
        // Vérification du type
        if (!allowedTypes.includes(selectedFile.type)) {
            setError(t('document.errors.invalidType'));
            return false;
        }

        // Vérification de la taille
        if (selectedFile.size > MAX_FILE_SIZE) {
            setError(t('document.errors.fileTooLarge'));
            return false;
        }

        setError("");
        return true;
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
        e.dataTransfer.dropEffect = 'copy';
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (e.dataTransfer.files.length > 0) {
            const droppedFile = e.dataTransfer.files[0];
            if (validateFile(droppedFile)) {
                setFile(droppedFile);
            }
        }
    };

    const handleFileSelect = (event) => {
        if (event.target.files.length > 0) {
            const selectedFile = event.target.files[0];
            if (validateFile(selectedFile)) {
                setFile(selectedFile);
            }
        }
    };
const handleSubmit = async (e) => {
  e.preventDefault();

  if (!file || !title) {
    setError("Veuillez remplir tous les champs");
    return;
  } 

  const formData = new FormData();
  formData.append('title', title);
  formData.append('document', file); // 🔥 Important: 'document' = champ attendu par Multer

  try {
    const response = await axios.post(`http://localhost:5005/api/create-document/${groupId}`, formData, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`
      }
    });
    console.log("Document créé:", response.data);
    annulerAjouter(); // Fermer le modal après succès
     onSuccess(); 
  } catch (err) {
    console.error("Échec de l'envoi:", err);
    setError(err.response?.data?.detail || err.response?.data?.error || "Erreur lors de l'envoi");
  }
};

    return (
        <div className='ajouter-enseignant-container' style={{ height: "500px" }}>
            <div className="ajouter-enseignant-wrapper">
                <div className="title-line">
                    <h1>Déposer Document</h1>
                    <button 
                        className="close-button" 
                        onClick={annulerAjouter}
                        aria-label={t('common.close')}
                    >
                        <svg width="36" height="36" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M25 27.9168L14.7917 38.1252C14.4098 38.5071 13.9237 38.6981 13.3334 38.6981C12.7431 38.6981 12.257 38.5071 11.875 38.1252C11.4931 37.7432 11.3021 37.2571 11.3021 36.6668C11.3021 36.0766 11.4931 35.5904 11.875 35.2085L22.0834 25.0002L11.875 14.7918C11.4931 14.4099 11.3021 13.9238 11.3021 13.3335C11.3021 12.7432 11.4931 12.2571 11.875 11.8752C12.257 11.4932 12.7431 11.3022 13.3334 11.3022C13.9237 11.3022 14.4098 11.4932 14.7917 11.8752L25 22.0835L35.2084 11.8752C35.5903 11.4932 36.0764 11.3022 36.6667 11.3022C37.257 11.3022 37.7431 11.4932 38.125 11.8752C38.507 12.2571 38.698 12.7432 38.698 13.3335C38.698 13.9238 38.507 14.4099 38.125 14.7918L27.9167 25.0002L38.125 35.2085C38.507 35.5904 38.698 36.0766 38.698 36.6668C38.698 37.2571 38.507 37.7432 38.125 38.1252C37.7431 38.5071 37.257 38.6981 36.6667 38.6981C36.0764 38.6981 35.5903 38.5071 35.2084 38.1252L25 27.9168Z" fill="#000000" fillOpacity="0.8" />
                        </svg>
                    </button>
                </div>

                <form id='ajouterFormEnseignant' onSubmit={handleSubmit}>
                  <div className="mb-4 flex items-center gap-4"> 
  <label htmlFor="documentTitle" className="mb-2 font-semibold text-gray-700 ">
    Titre
  </label>
  <input
    type="text"
    id="documentTitle"
    value={title}
    onChange={(e) => setTitle(e.target.value)}
    placeholder="Entrez le titre du document"
    required
    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent "
  />
</div>


                    <div className="drop-file-container">
                        <div 
                            className="drop-file-wrapper" 
                            onDragOver={handleDragOver} 
                            onDrop={handleDrop} 
                            style={{ height: "250px" }}
                        >
                            <CloudIcon />
                            <div className="structures-box">
                                {!file ? (
                                    <>
                                        <h2 style={{ color: "#292D32", fontSize: "1.25rem", fontWeight: "500" }}>
                                           Glisser-déposer un fichier
                                        </h2>
                                        <span style={{ color: "#A9ACB4" }}>
                                            Fichiers PDF (max. 5MB)
                                        </span>
                                        <input
                                            type="file"
                                            id="fileUpload"
                                            style={{ display: "none" }}
                                            accept=".pdf,application/pdf"
                                            onChange={handleFileSelect}
                                        />
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                document.getElementById("fileUpload").click();
                                            }}
                                        >
                                        Parcourir les fichiers
                                        </button>
                                        {error && (
                                            <p style={{ 
                                                color: "red", 
                                                marginTop: "10px",
                                                textAlign: "center"
                                            }}>
                                                {error}
                                            </p>
                                        )}
                                    </>
                                ) : (
                                    <div className="file-preview">
                                        <p>{file.name}</p>
                                        <p style={{ fontSize: "0.8rem", color: "#666" }}>
                                            {(file.size / (1024 * 1024)).toFixed(2)} MB
                                        </p>
                                        <button 
                                            type="button" 
                                            className="delete-file" 
                                            onClick={() => setFile(null)}
                                            aria-label={t('document.removeFile')}
                                        >
                                            <CloseIcon />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </form>

                <div className="btns-form-line">
                    <button
                        type='submit'
                        className='ajout-btn'
                        form='ajouterFormEnseignant'
                        disabled={!file || !title.trim() || isSubmitting}
                    >
                        {isSubmitting ? t('common.uploading') : t('ajouter document')}
                    </button>
                </div>
            </div>
        </div>
    );
};