import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import '../Styles/NavBar.css'
import { ReactComponent as ProfileIcon } from '../../../Assets/Icons/Account.svg';
import { ReactComponent as SettingsIcons } from '../../../Assets/Icons/setting-2.svg';
import { ReactComponent as NotificationsIcon } from '../../../Assets/Icons/Notifications.svg';
import { ReactComponent as LogoutIcon } from '../../../Assets/Icons/logout.svg';
import { ReactComponent as ArrowIcon } from '../../../Assets/Icons/Arrow.svg';
import { ReactComponent as ListIcon } from '../../../Assets/Icons/Union.svg';


function NavBar({ menuItems, racinePath }) {

    const [isParamMenuOpen, setIsParamMenuOpen] = useState(false);

    const closeParamMenu = () => setIsParamMenuOpen(false);

    const [currentIndex, setCurrentIndex] = useState(0);

    const [ subCurrentIndex, setSubCurrentIndex ] = useState(null);

    return (
        <div className='navbar-container'>
            <div className="nevbar-wrapper">
                <div className="logo-box">
                </div>
                <div className="lists-container">
                    <ul>
                        {menuItems.map((item, index) => (
                            <li key={index}>
                                {item.subMenu ? (
                                    <div
                                        className={`prameteres-item ${isParamMenuOpen ? "open" : ""}`}
                                    >
                                        <Link
                                            className={`list-item ${currentIndex === index ? "active" : ""}`}
                                            style={{ marginBottom: "0px" }}
                                            onClick={() => { setIsParamMenuOpen(!isParamMenuOpen); setCurrentIndex(index) }}
                                        >
                                            {item.icon}
                                            {item.name}
                                            <ArrowIcon className={`arrow-icon ${isParamMenuOpen ? "rotate" : ""}`} />
                                        </Link>
                                        <div className="sub-parametres-menu">
                                            <ListIcon className='list-icon' />
                                            <ul className="sub-menu">
                                                {item.subMenu.map((subItem, subIndex) => (
                                                    <Link
                                                        className={`sub-list-item ${subCurrentIndex === subIndex ? "active" : ""}`}
                                                        onClick={() => setSubCurrentIndex(subIndex)}
                                                        key={subIndex}
                                                        to={subItem.path}
                                                    >
                                                        {subItem.name}
                                                    </Link>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                ) : (
                                    <Link
                                        className={`list-item ${currentIndex === index ? "active" : ""}`}
                                        onClick={() => {setCurrentIndex(index); closeParamMenu()}}
                                        to={item.path}>
                                        {item.icon}
                                        {item.name}
                                    </Link>
                                )}
                            </li>
                        ))}
                    </ul>
                    <ul>
                        <li>
                            <Link
                                className={`list-item ${currentIndex === "profile" ? "active" : ""}`}
                                onClick={() => {setCurrentIndex("profile"); closeParamMenu()}}
                                to={`${racinePath}/profile`}>
                                <ProfileIcon />
                                Profile
                            </Link>
                        </li>
                        <li>
                            <Link
                                className={`list-item ${currentIndex === "settings" ? "active" : ""}`}
                                onClick={() => {setCurrentIndex("settings"); closeParamMenu()}}
                                to={`${racinePath}/settings`}>
                                <SettingsIcons />
                                Settings
                            </Link>
                        </li>
                        <li>
                            <Link
                                className={`list-item ${currentIndex === "notification" ? "active" : ""}`}
                                onClick={() => {setCurrentIndex("notification"); closeParamMenu()}}
                                to={`${racinePath}/notifications`}>
                                <NotificationsIcon />
                                Notifications
                            </Link>
                        </li>
                    </ul>
                    <ul className='logout-ul'>
                        <li className='list-item'>
                            <LogoutIcon />
                            Déconnexion
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default NavBar
