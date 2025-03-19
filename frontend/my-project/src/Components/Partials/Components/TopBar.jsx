import React from 'react'
import '../Styles/TopBar.css'
import { ReactComponent as NotificationIcon } from '../../../Assets/Icons/Reminder.svg'
import franceFlag from '../../../Assets/Images/la-france.png';
import defaultAccountPicture from '../../../Assets/Images/default_picture.jpeg';

function TopBar() {
    return (
        <div className='topbar-container'>
            <div className='topbar-wrapper'>
                <div className="user-params-box">
                    <div className="param-box">
                        <NotificationIcon className='icon' />
                    </div>
                    <div className="param-box">
                        <img src={franceFlag} alt='drapeau de france' />
                    </div>
                    <div className="user-line-box">
                        <div className="user-account">
                            <img src={defaultAccountPicture} alt="" />
                        </div>
                        <div className="user-props">
                            <span style={{ fontSize: "0.9rem", fontWeight: "550" }}>Derki Ayet</span>
                            <span style={{ fontSize: "0.75rem", fontWeight: "430", color:"#00000050" }}>Admin</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TopBar
