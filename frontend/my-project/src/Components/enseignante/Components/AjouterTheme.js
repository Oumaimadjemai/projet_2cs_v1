import React, { useEffect, useRef, useState } from 'react'
import { ReactComponent as DraftIcon } from '../../../Assets/Icons/draft.svg';
import Select from "react-select";
import '../../Partials/Components/i18n'
import { useTranslation } from 'react-i18next';

export const AjouterTheme = ({ annulerAjouter }) => {

    const { t } = useTranslation();

    const options = [
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
        { value: "typescript", label: "TypeScript" }
    ];

    const [selectedOptions, setSelectedOptions] = useState([]);

    const handleChange = (selected) => {
        setSelectedOptions(selected);
    };

    const [selectedYear, setSelectedYear] = useState(null);
    const [showYearOptions, setShowYearOptions] = useState(false);
    const [showSubOptions, setShowSubOptions] = useState(null);
    const [priorities, setPriorities] = useState({
        '4ème': { priority1: null, priority2: null, priority3: null },
        '5ème': { priority1: null, priority2: null, priority3: null }
    });
    const [showPriorityMenu, setShowPriorityMenu] = useState(null);

    const specialites = ['SIW', 'ISI', 'IASD'];

    const handleYearSelect = (year) => {
        setSelectedYear(year);
        setShowYearOptions(false);
        setShowSubOptions(null);
    };

    const handlePrioritySelect = (year, priority, specialite) => {
        const newPriorities = { ...priorities };

        // Check if this specialité is already selected in another priority
        for (const [key, value] of Object.entries(newPriorities[year])) {
            if (value === specialite && key !== priority) {
                newPriorities[year][key] = null;
            }
        }

        newPriorities[year][priority] = specialite;
        setPriorities(newPriorities);
        setShowPriorityMenu(null);
    };

    const getAvailableSpecialites = (year, currentPriority) => {
        const selected = priorities[year];
        const used = Object.values(selected).filter(Boolean);
        return specialites.filter(s => !used.includes(s) || selected[currentPriority] === s);
    };

    const anneeRef = useRef('')

    useEffect(() => {

        const handleSwitchAppearance = (e) => {
            if (anneeRef.current && !anneeRef.current.contains(e.target)) {
                setShowYearOptions(false);
                setShowSubOptions(null);
            }
        }

        document.addEventListener('mousedown', handleSwitchAppearance)

        return () => {
            document.removeEventListener('mousedown', handleSwitchAppearance)
        }

    }, [])

    const planRef = useRef(null);
    const resumeRef = useRef(null);

    const handlePlanText = () => {

        if (planRef.current) {
            planRef.current.style.height = 'auto';
            planRef.current.style.height = `${planRef.current.scrollHeight}px`;
        }
    };

    const handleResumeText = () => {
        if (resumeRef.current) {
            resumeRef.current.style.height = 'auto';
            resumeRef.current.style.height = `${resumeRef.current.scrollHeight}px`;
        }
    }

    return (
        <div className='ajouter-theme-container'>
            <div className="ajouter-theme-wrapper">
                <div className="title-line">
                    <h1>Ajouter Thème</h1>
                    <svg width="36" height="36" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ cursor: "pointer" }} onClick={() => annulerAjouter()}>
                        <path d="M25 27.9168L14.7917 38.1252C14.4098 38.5071 13.9237 38.6981 13.3334 38.6981C12.7431 38.6981 12.257 38.5071 11.875 38.1252C11.4931 37.7432 11.3021 37.2571 11.3021 36.6668C11.3021 36.0766 11.4931 35.5904 11.875 35.2085L22.0834 25.0002L11.875 14.7918C11.4931 14.4099 11.3021 13.9238 11.3021 13.3335C11.3021 12.7432 11.4931 12.2571 11.875 11.8752C12.257 11.4932 12.7431 11.3022 13.3334 11.3022C13.9237 11.3022 14.4098 11.4932 14.7917 11.8752L25 22.0835L35.2084 11.8752C35.5903 11.4932 36.0764 11.3022 36.6667 11.3022C37.257 11.3022 37.7431 11.4932 38.125 11.8752C38.507 12.2571 38.698 12.7432 38.698 13.3335C38.698 13.9238 38.507 14.4099 38.125 14.7918L27.9167 25.0002L38.125 35.2085C38.507 35.5904 38.698 36.0766 38.698 36.6668C38.698 37.2571 38.507 37.7432 38.125 38.1252C37.7431 38.5071 37.257 38.6981 36.6667 38.6981C36.0764 38.6981 35.5903 38.5071 35.2084 38.1252L25 27.9168Z" fill="#000000" fill-opacity="0.8" />
                    </svg>

                </div>
                <form id='ajouterFormTheme'>
                    <div className="ajouter-input-line select-line">
                        <div className="input-flex">
                            <label style={{ fontSize: "0.9rem", color: "#00000070", fontWeight: "430" }}>Titre</label>
                            <input type="text" name="nom" id="nom" />
                        </div>
                        <div className="select-flex">
                            <div className="select-flex-line">
                                <div style={{ position: "relative", display: "inline-block", width: "100%" }}>
                                    <Select
                                        className="multi-custom-select"
                                        isMulti
                                        options={options}
                                        value={selectedOptions}
                                        onChange={handleChange}
                                        placeholder="Outils & langauge"
                                    />
                                </div>

                            </div>
                        </div>
                    </div>
                    <div className="ajouter-input-line select-line">
                        <div className="input-flex">
                            <label style={{ fontSize: "0.9rem", color: "#00000070", fontWeight: "430" }}>Nombre de Groups</label>
                            <input type="number" name="nombreGroupe" id="nombreGroupe" />
                        </div>
                        <div className="select-flex">
                            <div className="annee-field" onClick={() => setShowYearOptions(!showYearOptions)}>
                                {selectedYear ? selectedYear : "Année"}
                                <svg
                                    width="10"
                                    height="6"
                                    viewBox="0 0 10 6"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                    style={{
                                        position: "absolute",
                                        right: "20px",
                                        top: "50%",
                                        transform: "translateY(-50%)",
                                        pointerEvents: "none"
                                    }}
                                >
                                    <path d="M4.99929 4.18863L8.77899 0.220677C8.91347 0.0793351 9.09533 0 9.28493 0C9.47453 0 9.65649 0.0793351 9.79097 0.220677C9.85721 0.290046 9.90976 0.372607 9.94565 0.463596C9.98153 0.554585 10 0.652194 10 0.750779C10 0.849365 9.98153 0.946974 9.94565 1.03796C9.90976 1.12895 9.85721 1.21152 9.79097 1.28089L5.50595 5.77932C5.37147 5.92066 5.1896 6 5 6C4.8104 6 4.62853 5.92066 4.49405 5.77932L0.209032 1.28089C0.14279 1.21152 0.0902398 1.12895 0.0543536 1.03796C0.0184674 0.946974 0 0.849365 0 0.750779C0 0.652194 0.0184674 0.554585 0.0543536 0.463596C0.0902398 0.372607 0.14279 0.290046 0.209032 0.220677C0.343604 0.0795203 0.525523 0.000314919 0.715067 0.000314919C0.904612 0.000314919 1.08644 0.0795203 1.22101 0.220677L4.99929 4.18863Z" fill="#8A8A8A" />
                                </svg>
                                {
                                    showYearOptions &&
                                    <ul className="annee-options" ref={anneeRef}>
                                        <li
                                            style={{ borderBottom: "1px solid #D6D6D6" }}
                                            onClick={() => handleYearSelect('2ème')}
                                        >2ème
                                        </li>
                                        <li
                                            style={{ borderBottom: "1px solid #D6D6D6" }}
                                            onClick={() => handleYearSelect('3ème')}
                                        >3ème
                                        </li>
                                        <li
                                            style={{ borderBottom: "1px solid #D6D6D6", position: "relative" }}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setShowSubOptions(showSubOptions === '4ème' ? null : '4ème');
                                            }}
                                        >
                                            4ème
                                            <svg
                                                width="10"
                                                height="6"
                                                viewBox="0 0 10 6"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                                style={{
                                                    position: "absolute",
                                                    right: "10px",
                                                    top: "50%",
                                                    transform: "translateY(-50%) rotate(-90deg)",
                                                    pointerEvents: "none"
                                                }}
                                            >
                                                <path d="M4.99929 4.18863L8.77899 0.220677C8.91347 0.0793351 9.09533 0 9.28493 0C9.47453 0 9.65649 0.0793351 9.79097 0.220677C9.85721 0.290046 9.90976 0.372607 9.94565 0.463596C9.98153 0.554585 10 0.652194 10 0.750779C10 0.849365 9.98153 0.946974 9.94565 1.03796C9.90976 1.12895 9.85721 1.21152 9.79097 1.28089L5.50595 5.77932C5.37147 5.92066 5.1896 6 5 6C4.8104 6 4.62853 5.92066 4.49405 5.77932L0.209032 1.28089C0.14279 1.21152 0.0902398 1.12895 0.0543536 1.03796C0.0184674 0.946974 0 0.849365 0 0.750779C0 0.652194 0.0184674 0.554585 0.0543536 0.463596C0.0902398 0.372607 0.14279 0.290046 0.209032 0.220677C0.343604 0.0795203 0.525523 0.000314919 0.715067 0.000314919C0.904612 0.000314919 1.08644 0.0795203 1.22101 0.220677L4.99929 4.18863Z" fill="#8A8A8A" />
                                            </svg>
                                            {
                                                showSubOptions === '4ème' &&
                                                <ul className="sub-priorite-options">
                                                    <li
                                                        style={{ borderBottom: "1px solid #D6D6D6", position: "relative" }}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setShowPriorityMenu(showPriorityMenu === '4ème-priority1' ? null : '4ème-priority1');
                                                        }}
                                                    >
                                                        <div style={{ width: "100%", display: "flex", alignItems: "center", position: "relative" }}>
                                                            {priorities['4ème'].priority1 || 'Priorité 1'}
                                                            <svg
                                                                width="10"
                                                                height="6"
                                                                viewBox="0 0 10 6"
                                                                fill="none"
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                style={{
                                                                    position: "absolute",
                                                                    right: "0",
                                                                    top: "50%",
                                                                    transform: "translateY(-50%)",
                                                                    pointerEvents: "none"
                                                                }}
                                                            >
                                                                <path d="M4.99929 4.18863L8.77899 0.220677C8.91347 0.0793351 9.09533 0 9.28493 0C9.47453 0 9.65649 0.0793351 9.79097 0.220677C9.85721 0.290046 9.90976 0.372607 9.94565 0.463596C9.98153 0.554585 10 0.652194 10 0.750779C10 0.849365 9.98153 0.946974 9.94565 1.03796C9.90976 1.12895 9.85721 1.21152 9.79097 1.28089L5.50595 5.77932C5.37147 5.92066 5.1896 6 5 6C4.8104 6 4.62853 5.92066 4.49405 5.77932L0.209032 1.28089C0.14279 1.21152 0.0902398 1.12895 0.0543536 1.03796C0.0184674 0.946974 0 0.849365 0 0.750779C0 0.652194 0.0184674 0.554585 0.0543536 0.463596C0.0902398 0.372607 0.14279 0.290046 0.209032 0.220677C0.343604 0.0795203 0.525523 0.000314919 0.715067 0.000314919C0.904612 0.000314919 1.08644 0.0795203 1.22101 0.220677L4.99929 4.18863Z" fill="#8A8A8A" />
                                                            </svg>
                                                        </div>
                                                        {
                                                            showPriorityMenu === '4ème-priority1' &&
                                                            <ul className="priorite-menu">
                                                                {getAvailableSpecialites('4ème', 'priority1').map(specialite => (
                                                                    <li
                                                                        key={specialite}
                                                                        style={{ cursor: 'pointer' }}
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            handlePrioritySelect('4ème', 'priority1', specialite);
                                                                        }}
                                                                    >
                                                                        {specialite}
                                                                    </li>
                                                                ))}
                                                                <li
                                                                    className='annuler-li'
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        handlePrioritySelect('4ème', 'priority1', null);
                                                                    }}
                                                                >
                                                                    Annuler
                                                                </li>
                                                            </ul>
                                                        }
                                                    </li>
                                                    <li
                                                        style={{ borderBottom: "1px solid #D6D6D6", position: "relative" }}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setShowPriorityMenu(showPriorityMenu === '4ème-priority2' ? null : '4ème-priority2');
                                                        }}
                                                    >
                                                        <div style={{ width: "100%", display: "flex", alignItems: "center", position: "relative" }}>
                                                            {priorities['4ème'].priority2 || 'Priorité 2'}
                                                            <svg
                                                                width="10"
                                                                height="6"
                                                                viewBox="0 0 10 6"
                                                                fill="none"
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                style={{
                                                                    position: "absolute",
                                                                    right: "0",
                                                                    top: "50%",
                                                                    transform: "translateY(-50%)",
                                                                    pointerEvents: "none"
                                                                }}
                                                            >
                                                                <path d="M4.99929 4.18863L8.77899 0.220677C8.91347 0.0793351 9.09533 0 9.28493 0C9.47453 0 9.65649 0.0793351 9.79097 0.220677C9.85721 0.290046 9.90976 0.372607 9.94565 0.463596C9.98153 0.554585 10 0.652194 10 0.750779C10 0.849365 9.98153 0.946974 9.94565 1.03796C9.90976 1.12895 9.85721 1.21152 9.79097 1.28089L5.50595 5.77932C5.37147 5.92066 5.1896 6 5 6C4.8104 6 4.62853 5.92066 4.49405 5.77932L0.209032 1.28089C0.14279 1.21152 0.0902398 1.12895 0.0543536 1.03796C0.0184674 0.946974 0 0.849365 0 0.750779C0 0.652194 0.0184674 0.554585 0.0543536 0.463596C0.0902398 0.372607 0.14279 0.290046 0.209032 0.220677C0.343604 0.0795203 0.525523 0.000314919 0.715067 0.000314919C0.904612 0.000314919 1.08644 0.0795203 1.22101 0.220677L4.99929 4.18863Z" fill="#8A8A8A" />
                                                            </svg>
                                                        </div>
                                                        {
                                                            showPriorityMenu === '4ème-priority2' &&
                                                            <ul className="priorite-menu">
                                                                {getAvailableSpecialites('4ème', 'priority2').map(specialite => (
                                                                    <li
                                                                        key={specialite}
                                                                        style={{ padding: '8px 10px', cursor: 'pointer' }}
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            handlePrioritySelect('4ème', 'priority2', specialite);
                                                                        }}
                                                                    >
                                                                        {specialite}
                                                                    </li>
                                                                ))}
                                                                <li
                                                                    className='annuler-li'
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        handlePrioritySelect('4ème', 'priority2', null);
                                                                    }}
                                                                >
                                                                    Annuler
                                                                </li>
                                                            </ul>
                                                        }
                                                    </li>
                                                    <li style={{ position: "relative" }}>
                                                        <div
                                                            style={{ width: "100%", display: "flex", alignItems: "center", position: "relative" }}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setShowPriorityMenu(showPriorityMenu === '4ème-priority3' ? null : '4ème-priority3');
                                                            }}
                                                        >
                                                            {priorities['4ème'].priority3 || 'Priorité 3'}
                                                            <svg
                                                                width="10"
                                                                height="6"
                                                                viewBox="0 0 10 6"
                                                                fill="none"
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                style={{
                                                                    position: "absolute",
                                                                    right: "0",
                                                                    top: "50%",
                                                                    transform: "translateY(-50%)",
                                                                    pointerEvents: "none"
                                                                }}
                                                            >
                                                                <path d="M4.99929 4.18863L8.77899 0.220677C8.91347 0.0793351 9.09533 0 9.28493 0C9.47453 0 9.65649 0.0793351 9.79097 0.220677C9.85721 0.290046 9.90976 0.372607 9.94565 0.463596C9.98153 0.554585 10 0.652194 10 0.750779C10 0.849365 9.98153 0.946974 9.94565 1.03796C9.90976 1.12895 9.85721 1.21152 9.79097 1.28089L5.50595 5.77932C5.37147 5.92066 5.1896 6 5 6C4.8104 6 4.62853 5.92066 4.49405 5.77932L0.209032 1.28089C0.14279 1.21152 0.0902398 1.12895 0.0543536 1.03796C0.0184674 0.946974 0 0.849365 0 0.750779C0 0.652194 0.0184674 0.554585 0.0543536 0.463596C0.0902398 0.372607 0.14279 0.290046 0.209032 0.220677C0.343604 0.0795203 0.525523 0.000314919 0.715067 0.000314919C0.904612 0.000314919 1.08644 0.0795203 1.22101 0.220677L4.99929 4.18863Z" fill="#8A8A8A" />
                                                            </svg>
                                                        </div>
                                                        {
                                                            showPriorityMenu === '4ème-priority3' &&
                                                            <ul className="priorite-menu">
                                                                {getAvailableSpecialites('4ème', 'priority3').map(specialite => (
                                                                    <li
                                                                        key={specialite}
                                                                        style={{ padding: '8px 10px', cursor: 'pointer' }}
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            handlePrioritySelect('4ème', 'priority3', specialite);
                                                                        }}
                                                                    >
                                                                        {specialite}
                                                                    </li>
                                                                ))}
                                                                <li
                                                                    className='annuler-li'
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        handlePrioritySelect('4ème', 'priority3', null);
                                                                    }}
                                                                >
                                                                    Annuler
                                                                </li>
                                                            </ul>
                                                        }
                                                    </li>
                                                </ul>
                                            }
                                        </li>
                                        <li
                                            style={{ position: "relative" }}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setShowSubOptions(showSubOptions === '5ème' ? null : '5ème');
                                            }}
                                        >
                                            5ème
                                            <svg
                                                width="10"
                                                height="6"
                                                viewBox="0 0 10 6"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                                style={{
                                                    position: "absolute",
                                                    right: "10px",
                                                    top: "50%",
                                                    transform: "translateY(-50%) rotate(-90deg)",
                                                    pointerEvents: "none"
                                                }}
                                            >
                                                <path d="M4.99929 4.18863L8.77899 0.220677C8.91347 0.0793351 9.09533 0 9.28493 0C9.47453 0 9.65649 0.0793351 9.79097 0.220677C9.85721 0.290046 9.90976 0.372607 9.94565 0.463596C9.98153 0.554585 10 0.652194 10 0.750779C10 0.849365 9.98153 0.946974 9.94565 1.03796C9.90976 1.12895 9.85721 1.21152 9.79097 1.28089L5.50595 5.77932C5.37147 5.92066 5.1896 6 5 6C4.8104 6 4.62853 5.92066 4.49405 5.77932L0.209032 1.28089C0.14279 1.21152 0.0902398 1.12895 0.0543536 1.03796C0.0184674 0.946974 0 0.849365 0 0.750779C0 0.652194 0.0184674 0.554585 0.0543536 0.463596C0.0902398 0.372607 0.14279 0.290046 0.209032 0.220677C0.343604 0.0795203 0.525523 0.000314919 0.715067 0.000314919C0.904612 0.000314919 1.08644 0.0795203 1.22101 0.220677L4.99929 4.18863Z" fill="#8A8A8A" />
                                            </svg>
                                            {
                                                showSubOptions === '5ème' &&
                                                <ul className="sub-priorite-options">
                                                    <li
                                                        style={{ borderBottom: "1px solid #D6D6D6", position: "relative" }}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setShowPriorityMenu(showPriorityMenu === '5ème-priority1' ? null : '5ème-priority1');
                                                        }}
                                                    >
                                                        <div style={{ width: "100%", display: "flex", alignItems: "center", position: "relative" }}>
                                                            {priorities['5ème'].priority1 || 'Priorité 1'}
                                                            <svg
                                                                width="10"
                                                                height="6"
                                                                viewBox="0 0 10 6"
                                                                fill="none"
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                style={{
                                                                    position: "absolute",
                                                                    right: "0",
                                                                    top: "50%",
                                                                    transform: "translateY(-50%)",
                                                                    pointerEvents: "none"
                                                                }}
                                                            >
                                                                <path d="M4.99929 4.18863L8.77899 0.220677C8.91347 0.0793351 9.09533 0 9.28493 0C9.47453 0 9.65649 0.0793351 9.79097 0.220677C9.85721 0.290046 9.90976 0.372607 9.94565 0.463596C9.98153 0.554585 10 0.652194 10 0.750779C10 0.849365 9.98153 0.946974 9.94565 1.03796C9.90976 1.12895 9.85721 1.21152 9.79097 1.28089L5.50595 5.77932C5.37147 5.92066 5.1896 6 5 6C4.8104 6 4.62853 5.92066 4.49405 5.77932L0.209032 1.28089C0.14279 1.21152 0.0902398 1.12895 0.0543536 1.03796C0.0184674 0.946974 0 0.849365 0 0.750779C0 0.652194 0.0184674 0.554585 0.0543536 0.463596C0.0902398 0.372607 0.14279 0.290046 0.209032 0.220677C0.343604 0.0795203 0.525523 0.000314919 0.715067 0.000314919C0.904612 0.000314919 1.08644 0.0795203 1.22101 0.220677L4.99929 4.18863Z" fill="#8A8A8A" />
                                                            </svg>
                                                        </div>
                                                        {
                                                            showPriorityMenu === '5ème-priority1' &&
                                                            <ul className="priorite-menu">
                                                                {getAvailableSpecialites('5ème', 'priority1').map(specialite => (
                                                                    <li
                                                                        key={specialite}
                                                                        style={{ padding: '8px 10px', cursor: 'pointer' }}
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            handlePrioritySelect('5ème', 'priority1', specialite);
                                                                        }}
                                                                    >
                                                                        {specialite}
                                                                    </li>
                                                                ))}
                                                                <li
                                                                    className='annuler-li'
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        handlePrioritySelect('5ème', 'priority1', null);
                                                                    }}
                                                                >
                                                                    Annuler
                                                                </li>
                                                            </ul>
                                                        }
                                                    </li>
                                                    <li
                                                        style={{ borderBottom: "1px solid #D6D6D6", position: "relative" }}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setShowPriorityMenu(showPriorityMenu === '5ème-priority2' ? null : '5ème-priority2');
                                                        }}
                                                    >
                                                        <div style={{ width: "100%", display: "flex", alignItems: "center", position: "relative" }}>
                                                            {priorities['5ème'].priority2 || 'Priorité 2'}
                                                            <svg
                                                                width="10"
                                                                height="6"
                                                                viewBox="0 0 10 6"
                                                                fill="none"
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                style={{
                                                                    position: "absolute",
                                                                    right: "0",
                                                                    top: "50%",
                                                                    transform: "translateY(-50%)",
                                                                    pointerEvents: "none"
                                                                }}
                                                            >
                                                                <path d="M4.99929 4.18863L8.77899 0.220677C8.91347 0.0793351 9.09533 0 9.28493 0C9.47453 0 9.65649 0.0793351 9.79097 0.220677C9.85721 0.290046 9.90976 0.372607 9.94565 0.463596C9.98153 0.554585 10 0.652194 10 0.750779C10 0.849365 9.98153 0.946974 9.94565 1.03796C9.90976 1.12895 9.85721 1.21152 9.79097 1.28089L5.50595 5.77932C5.37147 5.92066 5.1896 6 5 6C4.8104 6 4.62853 5.92066 4.49405 5.77932L0.209032 1.28089C0.14279 1.21152 0.0902398 1.12895 0.0543536 1.03796C0.0184674 0.946974 0 0.849365 0 0.750779C0 0.652194 0.0184674 0.554585 0.0543536 0.463596C0.0902398 0.372607 0.14279 0.290046 0.209032 0.220677C0.343604 0.0795203 0.525523 0.000314919 0.715067 0.000314919C0.904612 0.000314919 1.08644 0.0795203 1.22101 0.220677L4.99929 4.18863Z" fill="#8A8A8A" />
                                                            </svg>
                                                        </div>
                                                        {
                                                            showPriorityMenu === '5ème-priority2' &&
                                                            <ul className="priorite-menu">
                                                                {getAvailableSpecialites('5ème', 'priority2').map(specialite => (
                                                                    <li
                                                                        key={specialite}
                                                                        style={{ padding: '8px 10px', cursor: 'pointer' }}
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            handlePrioritySelect('5ème', 'priority2', specialite);
                                                                        }}
                                                                    >
                                                                        {specialite}
                                                                    </li>
                                                                ))}
                                                                <li
                                                                    className='annuler-li'
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        handlePrioritySelect('5ème', 'priority2', null);
                                                                    }}
                                                                >
                                                                    Annuler
                                                                </li>
                                                            </ul>
                                                        }
                                                    </li>
                                                    <li style={{ position: "relative" }}>
                                                        <div
                                                            style={{ width: "100%", display: "flex", alignItems: "center", position: "relative" }}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setShowPriorityMenu(showPriorityMenu === '5ème-priority3' ? null : '5ème-priority3');
                                                            }}
                                                        >
                                                            {priorities['5ème'].priority3 || 'Priorité 3'}
                                                            <svg
                                                                width="10"
                                                                height="6"
                                                                viewBox="0 0 10 6"
                                                                fill="none"
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                style={{
                                                                    position: "absolute",
                                                                    right: "0",
                                                                    top: "50%",
                                                                    transform: "translateY(-50%)",
                                                                    pointerEvents: "none"
                                                                }}
                                                            >
                                                                <path d="M4.99929 4.18863L8.77899 0.220677C8.91347 0.0793351 9.09533 0 9.28493 0C9.47453 0 9.65649 0.0793351 9.79097 0.220677C9.85721 0.290046 9.90976 0.372607 9.94565 0.463596C9.98153 0.554585 10 0.652194 10 0.750779C10 0.849365 9.98153 0.946974 9.94565 1.03796C9.90976 1.12895 9.85721 1.21152 9.79097 1.28089L5.50595 5.77932C5.37147 5.92066 5.1896 6 5 6C4.8104 6 4.62853 5.92066 4.49405 5.77932L0.209032 1.28089C0.14279 1.21152 0.0902398 1.12895 0.0543536 1.03796C0.0184674 0.946974 0 0.849365 0 0.750779C0 0.652194 0.0184674 0.554585 0.0543536 0.463596C0.0902398 0.372607 0.14279 0.290046 0.209032 0.220677C0.343604 0.0795203 0.525523 0.000314919 0.715067 0.000314919C0.904612 0.000314919 1.08644 0.0795203 1.22101 0.220677L4.99929 4.18863Z" fill="#8A8A8A" />
                                                            </svg>
                                                        </div>
                                                        {
                                                            showPriorityMenu === '5ème-priority3' &&
                                                            <ul className="priorite-menu">
                                                                {getAvailableSpecialites('5ème', 'priority3').map(specialite => (
                                                                    <li
                                                                        key={specialite}
                                                                        style={{ padding: '8px 10px', cursor: 'pointer' }}
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            handlePrioritySelect('5ème', 'priority3', specialite);
                                                                        }}
                                                                    >
                                                                        {specialite}
                                                                    </li>
                                                                ))}
                                                                <li
                                                                    className='annuler-li'
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        handlePrioritySelect('5ème', 'priority3', null);
                                                                    }}
                                                                >
                                                                    Annuler
                                                                </li>
                                                            </ul>
                                                        }
                                                    </li>
                                                </ul>
                                            }
                                        </li>
                                    </ul>
                                }
                            </div>
                        </div>
                    </div>
                    <div className="ajouter-input-line">
                        <div className="input-flex">
                            <label style={{ fontSize: "0.9rem", color: "#00000070", fontWeight: "430" }}>Plan de Travail</label>
                            <textarea
                                type="text"
                                ref={planRef}
                                onChange={handlePlanText}
                            />
                        </div>
                        <div className="input-flex">
                        <label style={{ fontSize: "0.9rem", color: "#00000070", fontWeight: "430" }}>Résumé</label>
                            <textarea
                                type="text"
                                ref={resumeRef}
                                onChange={handleResumeText}
                            />
                        </div>
                    </div>

                </form >
                <div className="btns-form-line">
                    <button className='brouillon-btn' style={{ backgroundColor: "#E2E4E5", color: "#060606" }}>
                        <DraftIcon />
                        {t('enseignantsPage.brouillonBtn')}
                    </button>
                    <button type='submit' className='ajout-btn' form='ajouterFormEnseignant'>
                        Ajouter Thème
                    </button>

                </div>
            </div >
        </div >
    )
}
