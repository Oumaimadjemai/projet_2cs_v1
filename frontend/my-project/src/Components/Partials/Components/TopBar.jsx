import React, {useContext} from 'react'
import '../Styles/TopBar.css'
import { ReactComponent as NotificationIcon } from '../../../Assets/Icons/Reminder.svg'
import franceFlag from '../../../Assets/Images/la-france.png';
import defaultAccountPicture from '../../../Assets/Images/default_picture.jpeg';
import ukFlag from '../../../Assets/Images/royaume-uni.png';
import saudiFlag from '../../../Assets/Images/saudi-arabia.png'
import { AppContext } from '../../../App';


function TopBar() {

    const { lang } = useContext(AppContext)
    const userNom = localStorage.getItem('user_nom') || '';
    const userPrenom = localStorage.getItem('user_prenom') || '';
    const userType = localStorage.getItem('role') || '';
    const profilePicture = localStorage.getItem('photo_profil');

    return (
        <div className='topbar-container'>
            <div className='topbar-wrapper'>
                <div className="user-params-box">
                    <div className="param-box">
                        <NotificationIcon className='icon' />
                    </div>
                    <div className="param-box">
                        <img  src={lang === 'fr' ? franceFlag : lang === 'en' ? ukFlag : saudiFlag} alt='drapeau de france' />
                    </div>
                    <div className="user-line-box">
                        <div className="user-account">
                           <img src={profilePicture || defaultAccountPicture} alt="" />

                        </div>
                        <div className="user-props">
                            <span style={{ fontSize: "0.9rem", fontWeight: "550" }}>{userNom} {userPrenom}</span>
                            <span style={{ fontSize: "0.75rem", fontWeight: "430", color:"#00000050" }}>{userType}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TopBar
