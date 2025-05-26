import React from 'react'
import { Link, Outlet, useNavigate } from 'react-router-dom';
import '../Styles/ParametresScolarite.css'
import DecoEsi from '../../Partials/Components/DecoEsi'
import { ReactComponent as UniversityIcon } from '../../../Assets/Icons/University_parametres.svg';
import { ReactComponent as ChairIcon } from '../../../Assets/Icons/Chair_parametres.svg';
import { ReactComponent as CapIcon } from '../../../Assets/Icons/Cap_parametres.svg';
import { ReactComponent as CalenderIcon } from '../../../Assets/Icons/Calender_parametres.svg';
import { ReactComponent as LeftArrowIcon } from '../../../Assets/Icons/left-arrow.svg';
import { ReactComponent as GroupesIcon } from '../../../Assets/Icons/People.svg';
import '../../Partials/Components/i18n'
import { useTranslation, Trans } from 'react-i18next';

export const ScolariteLayout = () => {
    return (
        <div className='parametres-scolarite-container' id='dynamic-liste'>
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
                                <h2 style={{ fontSize: "1.1rem", fontWeight: "550", color: "#925FE2" }}>
                                    {t('parametresPage.salles')}
                                </h2>
                                <button onClick={() => navigate('/admin/scolarite/salles')}>
                                    {t('parametresPage.moreBtn')}
                                </button>
                            </div>
                            <ChairIcon className="parametre-icon" style={{ height: "70px", width: "70px" }} />
                        </div>
                        <div className='parametre-card'>
                            <div className="flex-column">
                                <h2 style={{ fontSize: "1.1rem", fontWeight: "550", color: "#925FE2" }}>
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
                                <h2 style={{ fontSize: "1.1rem", fontWeight: "550", color: "#925FE2" }}>
                                    {t('parametresPage.annees')}
                                </h2>
                                <button onClick={() => navigate('/admin/scolarite/annees')}>
                                    {t('parametresPage.moreBtn')}
                                </button>
                            </div>
                            <CalenderIcon className="parametre-icon calender-icon" />
                        </div>
                        <div className='parametre-card'>
                            <div className="flex-column">
                                <h2 style={{ fontSize: "1.1rem", fontWeight: "550", color: "#925FE2" }}>
                                    Paramètres Groupe
                                </h2>
                                <button onClick={() => navigate('/admin/scolarite/parametres-groupe')}>
                                    {t('parametresPage.moreBtn')}
                                </button>
                            </div>
                            <GroupesIcon className="parametre-icon cap-icon" />
                        </div>
                        <div className='parametre-card'>
                            <div className="flex-column">
                                <h2 style={{ fontSize: "1.1rem", fontWeight: "550", color: "#925FE2" }}>
                                    Périodes
                                </h2>
                                <button onClick={() => navigate('/admin/scolarite/periodes')}>
                                    {t('parametresPage.moreBtn')}
                                </button>
                            </div>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className='parametre-icon'>
                                <path d="M5.19799 3.3C5.79999 2 7.86699 2 12 2C16.133 2 18.2 2 18.802 3.3C18.854 3.41067 18.8973 3.526 18.932 3.646C19.342 5.033 17.88 6.641 14.958 9.856L13 12L14.958 14.143C17.88 17.359 19.341 18.967 18.932 20.353C18.8973 20.4721 18.8539 20.5884 18.802 20.701C18.2 22 16.133 22 12 22C7.86699 22 5.79999 22 5.19799 20.7C5.14618 20.588 5.10273 20.4724 5.06799 20.354C4.65799 18.967 6.11999 17.359 9.04199 14.144L11 12L9.04199 9.857C6.11999 6.64 4.65999 5.033 5.06799 3.647C5.10266 3.527 5.14599 3.412 5.19799 3.3Z" fill="white" />
                            </svg>

                        </div>

                        <div className='parametre-card'>
                            <div className="flex-column">
                                <h2 style={{ fontSize: "1.1rem", fontWeight: "550", color: "#925FE2" }}>
                                    Année Académiques
                                </h2>
                                <button onClick={() => navigate('/admin/scolarite/acdemic-annees')}>
                                    {t('parametresPage.moreBtn')}
                                </button>
                            </div>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className='parametre-icon'>
                                <path d="M7.74998 2.5C7.74998 2.30109 7.67096 2.11032 7.53031 1.96967C7.38966 1.82902 7.19889 1.75 6.99998 1.75C6.80107 1.75 6.6103 1.82902 6.46965 1.96967C6.329 2.11032 6.24998 2.30109 6.24998 2.5V4.08C4.80998 4.195 3.86598 4.477 3.17198 5.172C2.47698 5.866 2.19498 6.811 2.07898 8.25H21.921C21.805 6.81 21.523 5.866 20.828 5.172C20.134 4.477 19.189 4.195 17.75 4.079V2.5C17.75 2.30109 17.671 2.11032 17.5303 1.96967C17.3897 1.82902 17.1989 1.75 17 1.75C16.8011 1.75 16.6103 1.82902 16.4696 1.96967C16.329 2.11032 16.25 2.30109 16.25 2.5V4.013C15.585 4 14.839 4 14 4H9.99998C9.16098 4 8.41498 4 7.74998 4.013V2.5Z" fill="white" />
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M2 12C2 11.161 2 10.415 2.013 9.75H21.987C22 10.415 22 11.161 22 12V14C22 17.771 22 19.657 20.828 20.828C19.656 21.999 17.771 22 14 22H10C6.229 22 4.343 22 3.172 20.828C2.001 19.656 2 17.771 2 14V12ZM17 14C17.2652 14 17.5196 13.8946 17.7071 13.7071C17.8946 13.5196 18 13.2652 18 13C18 12.7348 17.8946 12.4804 17.7071 12.2929C17.5196 12.1054 17.2652 12 17 12C16.7348 12 16.4804 12.1054 16.2929 12.2929C16.1054 12.4804 16 12.7348 16 13C16 13.2652 16.1054 13.5196 16.2929 13.7071C16.4804 13.8946 16.7348 14 17 14ZM17 18C17.2652 18 17.5196 17.8946 17.7071 17.7071C17.8946 17.5196 18 17.2652 18 17C18 16.7348 17.8946 16.4804 17.7071 16.2929C17.5196 16.1054 17.2652 16 17 16C16.7348 16 16.4804 16.1054 16.2929 16.2929C16.1054 16.4804 16 16.7348 16 17C16 17.2652 16.1054 17.5196 16.2929 17.7071C16.4804 17.8946 16.7348 18 17 18ZM13 13C13 13.2652 12.8946 13.5196 12.7071 13.7071C12.5196 13.8946 12.2652 14 12 14C11.7348 14 11.4804 13.8946 11.2929 13.7071C11.1054 13.5196 11 13.2652 11 13C11 12.7348 11.1054 12.4804 11.2929 12.2929C11.4804 12.1054 11.7348 12 12 12C12.2652 12 12.5196 12.1054 12.7071 12.2929C12.8946 12.4804 13 12.7348 13 13ZM13 17C13 17.2652 12.8946 17.5196 12.7071 17.7071C12.5196 17.8946 12.2652 18 12 18C11.7348 18 11.4804 17.8946 11.2929 17.7071C11.1054 17.5196 11 17.2652 11 17C11 16.7348 11.1054 16.4804 11.2929 16.2929C11.4804 16.1054 11.7348 16 12 16C12.2652 16 12.5196 16.1054 12.7071 16.2929C12.8946 16.4804 13 16.7348 13 17ZM7 14C7.26522 14 7.51957 13.8946 7.70711 13.7071C7.89464 13.5196 8 13.2652 8 13C8 12.7348 7.89464 12.4804 7.70711 12.2929C7.51957 12.1054 7.26522 12 7 12C6.73478 12 6.48043 12.1054 6.29289 12.2929C6.10536 12.4804 6 12.7348 6 13C6 13.2652 6.10536 13.5196 6.29289 13.7071C6.48043 13.8946 6.73478 14 7 14ZM7 18C7.26522 18 7.51957 17.8946 7.70711 17.7071C7.89464 17.5196 8 17.2652 8 17C8 16.7348 7.89464 16.4804 7.70711 16.2929C7.51957 16.1054 7.26522 16 7 16C6.73478 16 6.48043 16.1054 6.29289 16.2929C6.10536 16.4804 6 16.7348 6 17C6 17.2652 6.10536 17.5196 6.29289 17.7071C6.48043 17.8946 6.73478 18 7 18Z" fill="white" />
                            </svg>


                        </div>
                    </div>
                    {/* <div className="parametres-infos">
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
                    </div> */}
                </div>
            </div>
        </div>
    )
}

export default ParametresScolarite
