import React from 'react'
import { Link, Outlet, useNavigate } from 'react-router-dom';
import '../Styles/ParametresScolarite.css'
import DecoEsi from '../../Partials/Components/DecoEsi'
import { ReactComponent as UniversityIcon } from '../../../Assets/Icons/University_parametres.svg';
import { ReactComponent as ChairIcon } from '../../../Assets/Icons/Chair_parametres.svg';
import { ReactComponent as CapIcon } from '../../../Assets/Icons/Cap_parametres.svg';
import { ReactComponent as CalenderIcon } from '../../../Assets/Icons/Calender_parametres.svg';
import { ReactComponent as LeftArrowIcon } from '../../../Assets/Icons/left-arrow.svg';
import '../../Partials/Components/i18n'
import { useTranslation, Trans } from 'react-i18next';

export const ScolariteLayout = () => {
    return (
        <div className='parametres-scolarite-container' id='dynamic-liste'>
            <DecoEsi />
            <Outlet />
        </div>
    )
}

function ParametresScolarite() {

    const navigate = useNavigate();

    const { t } = useTranslation();

    return (
        <div className="parametres-scolarite-wrapper">
            <div className="parametres-container">
                <h1 style={{ fontSize: "1.6rem", fontWeight: "500", color: "#4F4F4F" }}>
                    {t('parametresPage.title')}
                </h1>
                <div className="parametres-cards-container">
                    <div className="parametres-cards">
                        <div className='parametre-card'>
                            <div className="flex-column">
                                <h2 style={{ fontSize: "1.2rem", fontWeight: "550", color: "#925FE2" }}>
                                    {t('parametresPage.departements')}
                                </h2>
                                <button onClick={() => navigate('/admin/scolarite/departements')}>
                                    {t('parametresPage.moreBtn')}
                                </button>
                            </div>
                            <UniversityIcon className="parametre-icon" />
                        </div>
                        <div className='parametre-card'>
                            <div className="flex-column">
                                <h2 style={{ fontSize: "1.2rem", fontWeight: "550", color: "#925FE2" }}>
                                    {t('parametresPage.salles')}
                                </h2>
                                <button onClick={() => navigate('/admin/scolarite/salles')}>
                                    {t('parametresPage.moreBtn')}
                                </button>
                            </div>
                            <ChairIcon className="parametre-icon" />
                        </div>
                        <div className='parametre-card'>
                            <div className="flex-column">
                                <h2 style={{ fontSize: "1.2rem", fontWeight: "550", color: "#925FE2" }}>
                                    {t('parametresPage.specialites')}
                                </h2>
                                <button onClick={() => navigate('/admin/scolarite/specialites')}>
                                    {t('parametresPage.moreBtn')}
                                </button>
                            </div>
                            <CapIcon className="parametre-icon cap-icon" />
                        </div>
                        <div className='parametre-card'>
                            <div className="flex-column">
                                <h2 style={{ fontSize: "1.2rem", fontWeight: "550", color: "#925FE2" }}>
                                    {t('parametresPage.annees')}
                                </h2>
                                <button onClick={() => navigate('/admin/scolarite/annees')}>
                                    {t('parametresPage.moreBtn')}
                                </button>
                            </div>
                            <CalenderIcon className="parametre-icon calender-icon" />
                        </div>
                    </div>
                    <div className="parametres-infos">
                        <div className="info-element">
                            <h3 style={{ fontSize: "0.95rem", fontWeight: "550", textDecoration: "underline" }}>
                                {t('parametresPage.departements')}
                            </h3>
                            <span style={{ fontSize: "0.88rem", color: "#00000090" }}>
                                <Trans i18nKey={"parametresPage.departemenLine"}>
                                    L'ESI - SBA regroupe <span style={{ color: "#000" }}> 2 départements </span> spécialisés pour offrir une formation d'excellence.
                                </Trans>
                            </span>
                            <Link className='gerer-link' to={'/admin/scolarite/departements'}>
                                {t('parametresPage.gererBtn')}
                                <LeftArrowIcon />
                            </Link>
                        </div>
                        <div className="info-element">
                            <h3 style={{ fontSize: "0.95rem", fontWeight: "550", textDecoration: "underline" }}>
                                {t('parametresPage.salles')}
                            </h3>
                            <span style={{ fontSize: "0.88rem", color: "#00000090" }}>
                                <Trans i18nKey={"parametresPage.sallesLine"}>
                                    L'ESI - SBA dispose de plus de <span style={{ color: "#000" }}>30 salles</span> 30 salles modernes, adaptées aux besoins des étudiants et enseignants.
                                </Trans>
                            </span>
                            <Link className='gerer-link' to={'/admin/scolarite/salles'}>
                                {t('parametresPage.gererBtn')}
                                <LeftArrowIcon />
                            </Link>
                        </div>
                        <div className="info-element">
                            <h3 style={{ fontSize: "0.95rem", fontWeight: "550", textDecoration: "underline" }}>
                                {t('parametresPage.specialites')}
                            </h3>
                            <span style={{ fontSize: "0.88rem", color: "#00000090" }}>
                                <Trans i18nKey={"parametresPage.specialiteLine"}>
                                    L'ESI - SBA propose <span style={{ color: "#000" }}>3 spécialisations</span> innovantes en informatique.
                                </Trans>
                            </span>
                            <Link className='gerer-link' to={'/admin/scolarite/specialites'}>
                                {t('parametresPage.gererBtn')}
                                <LeftArrowIcon />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ParametresScolarite
