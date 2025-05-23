import React, { useContext, useEffect, useRef, useState } from "react";
import { ReactComponent as DraftIcon } from "../../../Assets/Icons/draft.svg";
import "../../Partials/Components/i18n";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { EnseignantThemesContext } from "./ThemesEnseignant";
import CreatableSelect from "react-select/creatable";

export const AjouterTheme = ({ annulerAjouter, addWithSuccess }) => {
  const { setThemes, setLoading } = useContext(EnseignantThemesContext);

  const { t } = useTranslation();

  const [annees, setAnnees] = useState([]);
  const [specialites, setSpecialities] = useState([]);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL_SERVICE1}/annees/`)
      .then((res) => setAnnees(res.data))
      .catch((err) => console.error(err));

    axios
      .get(`${process.env.REACT_APP_API_URL_SERVICE1}/specialites/`)
      .then((res) => setSpecialities(res.data))
      .catch((err) => console.error(err));
  }, []);

  const [languages, setLanguages] = useState([
    { value: "html", label: "HTML" },
    { value: "css", label: "CSS" },
    { value: "javascript", label: "JavaScript" },
    { value: "react", label: "React" },
    { value: "nodejs", label: "Node.js" },
    { value: "python", label: "Python" },
    { value: "django", label: "Django" },
    { value: "flask", label: "Flask" },
    { value: "sql", label: "SQL" },
    { value: "mongodb", label: "MongoDB" },
    { value: "firebase", label: "Firebase" },
    { value: "machine-learning", label: "Machine Learning" },
    { value: "data-science", label: "Data Science" },
    { value: "ai", label: "Artificial Intelligence" },
    { value: "tensorflow", label: "TensorFlow" },
    { value: "pytorch", label: "PyTorch" },
    { value: "nextjs", label: "Next.js" },
    { value: "typescript", label: "TypeScript" },
  ]);

  const [livrables, setLivrables] = useState([
    { value: "rapport-final", label: "Rapport final" },
    { value: "code-source", label: "Code source" },
    { value: "demo", label: "Démo du projet" },
    { value: "documentation-technique", label: "Documentation technique" },
    { value: "modele-entrainé", label: "Modèle pré-entraîné" },
    { value: "rapport-performance", label: "Rapport de performance du modèle" },
    { value: "environnement-dev", label: "Environnement de développement" },
    { value: "interface-utilisateur", label: "Interface utilisateur (UI/UX)" },
    { value: "analyse-donnees", label: "Analyse des données" },
    { value: "script-automatisation", label: "Script d'automatisation" },
  ]);

  const [newTheme, setNewTheme] = useState({
    titre: "",
    resume: "",
    outils_et_language: "",
    plan_travail: "",
    livrable: "",
    annee_id: null,
    priorities: [],
    numberOfGrp: null,
  });

  const [selectedYear, setSelectedYear] = useState(null);
  const [showYearOptions, setShowYearOptions] = useState(false);
  const [priorities, setPriorities] = useState({});
  const [showSpecialitesMenu, setShowSpecialitesMenu] = useState(false);

  // Initialiser les priorités quand les années changent
  useEffect(() => {
    const initialPriorities = {};
    annees.forEach((annee) => {
      if (annee.has_specialite) {
        initialPriorities[annee.id] = [];
      }
    });
    setPriorities(initialPriorities);
  }, [annees]);

  const handleYearSelect = (annee) => {
    setSelectedYear(annee);
    if (annee.has_specialite) {
      setShowSpecialitesMenu(true);
    } else {
      setShowYearOptions(false);
    }
  };

  const handlePrioritySelect = (anneeId, specialiteId, priority) => {
    setPriorities((prev) => {
      const newPriorities = { ...prev };

      // Supprimer si la spécialité existe déjà
      newPriorities[anneeId] = newPriorities[anneeId].filter(
        (item) => item.specialite_id !== specialiteId
      );

      // Ajouter la nouvelle priorité
      if (priority !== null) {
        newPriorities[anneeId].push({
          priorite: priority,
          specialite_id: specialiteId,
        });
      }

      return newPriorities;
    });
  };

  const getSpecialiteName = (id) => {
    const specialite = specialites.find((s) => s.id === id);
    return specialite ? specialite.title : "";
  };

  /*------------The Final Post----------- */
  const handleSubmit = (e) => {
    e.preventDefault();

    const finalPriorities = selectedYear?.has_specialite
      ? priorities[selectedYear.id] || []
      : [];

    const finalTheme = {
      ...newTheme,
      priorities: finalPriorities,
      annee_id: selectedYear.id,
    };

    setLoading(true);

    axios
      .post(`${process.env.REACT_APP_API_URL_SERVICE2}/themes/`, finalTheme, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        setThemes((prev) => [
          ...prev,
          {
            ...res.data,
            annee_titre: `${selectedYear.title} ${
              selectedYear.departement_title.toLowerCase() === "préparatoire"
                ? "CPI"
                : "CS"
            }`,
            specialite_title: getSpecialiteName(
              priorities[selectedYear.id]?.find((p) => p.priorite === 1)
                ?.specialite_id
            ),
          },
        ]);
        annulerAjouter();
        addWithSuccess();
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  const anneeRef = useRef("");

  useEffect(() => {
    const handleSwitchAppearance = (e) => {
      if (anneeRef.current && !anneeRef.current.contains(e.target)) {
        setShowYearOptions(false);
      }
    };

    document.addEventListener("mousedown", handleSwitchAppearance);

    return () => {
      document.removeEventListener("mousedown", handleSwitchAppearance);
    };
  }, []);

  const planRef = useRef(null);
  const resumeRef = useRef(null);

  const handlePlanText = () => {
    if (planRef.current) {
      planRef.current.style.height = "auto";
      planRef.current.style.height = `${planRef.current.scrollHeight}px`;
    }
  };

  const handleResumeText = () => {
    if (resumeRef.current) {
      resumeRef.current.style.height = "auto";
      resumeRef.current.style.height = `${resumeRef.current.scrollHeight}px`;
    }
  };

  const handleChangeLanguages = (selectedOptions) => {
    const languagesString = selectedOptions
      .map((option) => option.value)
      .join(", ");

    setNewTheme({
      ...newTheme,
      outils_et_language: languagesString,
    });
  };

  const handleCreateLanguage = (inputValue) => {
    const newOption = { value: inputValue, label: inputValue };
    setLanguages((prev) => [...prev, newOption]);

    const selectedOptions = newTheme.outils_et_language
      ? newTheme.outils_et_language
          .split(", ")
          .map((val) => ({ value: val, label: val }))
      : [];

    const updatedSelected = [...selectedOptions, newOption];
    const languagesString = updatedSelected
      .map((option) => option.value)
      .join(", ");

    setNewTheme({
      ...newTheme,
      outils_et_language: languagesString,
    });
  };

  const handleCreateLivrable = (inputValue) => {
    const newOption = { value: inputValue, label: inputValue };
    setLivrables((prev) => [...prev, newOption]);

    const selectedOptions = newTheme.livrable
      ? newTheme.livrable.split(", ").map((val) => ({ value: val, label: val }))
      : [];

    const updatedSelected = [...selectedOptions, newOption];
    const livrablesString = updatedSelected
      .map((option) => option.value)
      .join(", ");

    setNewTheme({
      ...newTheme,
      livrable: livrablesString,
    });
  };

  const handleChangeLivrables = (selectedOptions) => {
    const livrablesString = selectedOptions
      .map((option) => option.value)
      .join(", ");

    setNewTheme({
      ...newTheme,
      livrable: livrablesString,
    });
  };

  return (
    <div className="ajouter-theme-container">
      <div className="ajouter-theme-wrapper">
        <div className="title-line">
          <h1>Ajouter Thème</h1>
          <svg
            width="36"
            height="36"
            viewBox="0 0 50 50"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ cursor: "pointer" }}
            onClick={() => annulerAjouter()}
          >
            <path
              d="M25 27.9168L14.7917 38.1252C14.4098 38.5071 13.9237 38.6981 13.3334 38.6981C12.7431 38.6981 12.257 38.5071 11.875 38.1252C11.4931 37.7432 11.3021 37.2571 11.3021 36.6668C11.3021 36.0766 11.4931 35.5904 11.875 35.2085L22.0834 25.0002L11.875 14.7918C11.4931 14.4099 11.3021 13.9238 11.3021 13.3335C11.3021 12.7432 11.4931 12.2571 11.875 11.8752C12.257 11.4932 12.7431 11.3022 13.3334 11.3022C13.9237 11.3022 14.4098 11.4932 14.7917 11.8752L25 22.0835L35.2084 11.8752C35.5903 11.4932 36.0764 11.3022 36.6667 11.3022C37.257 11.3022 37.7431 11.4932 38.125 11.8752C38.507 12.2571 38.698 12.7432 38.698 13.3335C38.698 13.9238 38.507 14.4099 38.125 14.7918L27.9167 25.0002L38.125 35.2085C38.507 35.5904 38.698 36.0766 38.698 36.6668C38.698 37.2571 38.507 37.7432 38.125 38.1252C37.7431 38.5071 37.257 38.6981 36.6667 38.6981C36.0764 38.6981 35.5903 38.5071 35.2084 38.1252L25 27.9168Z"
              fill="#000000"
              fill-opacity="0.8"
            />
          </svg>
        </div>
        <form id="ajouterFormTheme" onSubmit={handleSubmit}>
          <div className="ajouter-input-line select-line">
            <div className="input-flex">
              <label
                style={{
                  fontSize: "0.9rem",
                  color: "#00000070",
                  fontWeight: "430",
                }}
              >
                Titre
              </label>
              <input
                type="text"
                name="nom"
                id="nom"
                value={newTheme.titre}
                onChange={(e) =>
                  setNewTheme({ ...newTheme, titre: e.target.value })
                }
                required
              />
            </div>
            <div className="select-flex">
              <div className="select-flex-line">
                <div
                  style={{
                    position: "relative",
                    display: "inline-block",
                    width: "100%",
                  }}
                >
                  <CreatableSelect
                    className="multi-custom-select"
                    isMulti
                    options={languages}
                    value={languages.filter((option) =>
                      newTheme.outils_et_language
                        .split(", ")
                        .includes(option.value)
                    )}
                    onChange={handleChangeLanguages}
                    onCreateOption={handleCreateLanguage}
                    placeholder="Outils & Langages"
                    required
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="ajouter-input-line select-line">
            <div
              style={{
                position: "relative",
                display: "inline-block",
                width: "300px",
              }}
            >
              <CreatableSelect
                className="multi-custom-select"
                isMulti
                options={livrables}
                value={livrables.filter((option) =>
                  newTheme.livrable.split(", ").includes(option.value)
                )}
                onChange={handleChangeLivrables}
                onCreateOption={handleCreateLivrable}
                placeholder="Livrables"
                required
              />
            </div>
            <div className="select-flex">
              <div
                className="annee-field"
                onClick={() => setShowYearOptions(!showYearOptions)}
                ref={anneeRef}
              >
                {selectedYear
                  ? `${selectedYear.title} ${
                      selectedYear.departement_title.toLowerCase() ===
                      "préparatoire"
                        ? "CPI"
                        : "CS"
                    }`
                  : "Année"}
                {/* Icône flèche... */}

                {showYearOptions && (
                  <ul className="annee-options">
                    {annees.map((annee) => (
                      <li
                        key={annee.id}
                        style={{
                          borderBottom: "1px solid #D6D6D6",
                          position: annee.has_specialite
                            ? "relative"
                            : "static",
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (!annee.has_specialite) {
                            handleYearSelect(annee);
                          } else {
                            setSelectedYear(annee);
                          }
                        }}
                      >
                        {annee.title}
                        {annee.departement_title.toLowerCase() ===
                        "préparatoire"
                          ? "CPI"
                          : "CS"}

                        {annee.has_specialite && (
                          <>
                            {/* Icône flèche pour les années avec spécialité */}
                            <svg
                              width="10"
                              height="6"
                              viewBox="0 0 10 6"
                              style={{
                                position: "absolute",
                                right: "10px",
                                top: "50%",
                                transform: `translateY(-50%) rotate(-90deg)`,
                                pointerEvents: "none",
                              }}
                            >
                              <path
                                d="M4.99929 4.18863L8.77899 0.220677C8.91347 0.0793351 9.09533 0 9.28493 0C9.47453 0 9.65649 0.0793351 9.79097 0.220677C9.85721 0.290046 9.90976 0.372607 9.94565 0.463596C9.98153 0.554585 10 0.652194 10 0.750779C10 0.849365 9.98153 0.946974 9.94565 1.03796C9.90976 1.12895 9.85721 1.21152 9.79097 1.28089L5.50595 5.77932C5.37147 5.92066 5.1896 6 5 6C4.8104 6 4.62853 5.92066 4.49405 5.77932L0.209032 1.28089C0.14279 1.21152 0.0902398 1.12895 0.0543536 1.03796C0.0184674 0.946974 0 0.849365 0 0.750779C0 0.652194 0.0184674 0.554585 0.0543536 0.463596C0.0902398 0.372607 0.14279 0.290046 0.209032 0.220677C0.343604 0.0795203 0.525523 0.000314919 0.715067 0.000314919C0.904612 0.000314919 1.08644 0.0795203 1.22101 0.220677L4.99929 4.18863Z"
                                fill="#8A8A8A"
                              />
                            </svg>

                            {/* Menu des priorités */}
                            {selectedYear?.id === annee.id && (
                              <ul className="sub-priorite-options">
                                {specialites.map((specialite) => (
                                  <li
                                    key={specialite.id}
                                    style={{ position: "relative" }}
                                  >
                                    <div>
                                      {specialite.title}
                                      <div
                                        style={{
                                          display: "flex",
                                          gap: "8px",
                                          marginTop: "4px",
                                          width: "100%",
                                          justifyContent: "space-between",
                                        }}
                                      >
                                        {[1, 2, 3].map((priority) => {
                                          const isSelected = priorities[
                                            annee.id
                                          ]?.some(
                                            (item) =>
                                              item.specialite_id ===
                                                specialite.id &&
                                              item.priorite === priority
                                          );
                                          return (
                                            <button
                                              key={priority}
                                              style={{
                                                width: "24px",
                                                height: "24px",
                                                borderRadius: "50%",
                                                border: `1px solid ${
                                                  isSelected
                                                    ? "#925FE2"
                                                    : "#D6D6D6"
                                                }`,
                                                background: isSelected
                                                  ? "#925FE2"
                                                  : "white",
                                                color: isSelected
                                                  ? "white"
                                                  : "#555",
                                                cursor: "pointer",
                                              }}
                                              onClick={(e) => {
                                                e.preventDefault();
                                                handlePrioritySelect(
                                                  annee.id,
                                                  specialite.id,
                                                  isSelected ? null : priority
                                                );
                                              }}
                                            >
                                              {priority}
                                            </button>
                                          );
                                        })}
                                      </div>
                                    </div>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <input
                type="number"
                min={0}
                style={{
                  width: "49%",
                }}
                placeholder="Nombre Groupes"
                value={newTheme.numberOfGrp}
                onChange={(e) =>
                  setNewTheme({ ...newTheme, numberOfGrp: e.target.value })
                }
                required
              />
            </div>
          </div>
          <div className="ajouter-input-line">
            <div className="input-flex">
              <label
                style={{
                  fontSize: "0.9rem",
                  color: "#00000070",
                  fontWeight: "430",
                }}
              >
                Plan de Travail
              </label>
              <textarea
                type="text"
                ref={planRef}
                value={newTheme.plan_travail}
                onChange={(e) => {
                  handlePlanText();
                  setNewTheme({ ...newTheme, plan_travail: e.target.value });
                }}
                required
              />
            </div>
            <div className="input-flex">
              <label
                style={{
                  fontSize: "0.9rem",
                  color: "#00000070",
                  fontWeight: "430",
                }}
              >
                Résumé
              </label>
              <textarea
                type="text"
                ref={resumeRef}
                value={newTheme.resume}
                onChange={(e) => {
                  handleResumeText();
                  setNewTheme({ ...newTheme, resume: e.target.value });
                }}
                required
              />
            </div>
          </div>
        </form>
        <div className="btns-form-line">
          <button
            className="brouillon-btn"
            style={{ backgroundColor: "#E2E4E5", color: "#060606" }}
          >
            <DraftIcon />
            {t("enseignantsPage.brouillonBtn")}
          </button>
          <button type="submit" className="ajout-btn" form="ajouterFormTheme">
            Ajouter Thème
          </button>
        </div>
      </div>
    </div>
  );
};
