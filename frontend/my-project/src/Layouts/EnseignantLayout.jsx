import React, { useEffect } from "react"
import { Outlet } from 'react-router-dom'
import NavBar from "../Components/Partials/Components/NavBar"
import TopBar from "../Components/Partials/Components/TopBar";
import { ReactComponent as ThemesIcon } from '../Assets/Icons/Lightbulb.svg';
import { ReactComponent as GroupesIcon } from '../Assets/Icons/People.svg';
import { ReactComponent as SoutenancesIcon } from '../Assets/Icons/Mortarboard.svg';
import { useTranslation } from 'react-i18next';
import { useSocket } from "../Components/Contexts/useSocket";
import { toast } from 'react-toastify';
import { ReactComponent as NotificationsIcon } from '../Assets/Icons/Notifications.svg';


export const EnseignantLayout = () => {

  const { t } = useTranslation();
  const socket = useSocket();

  useEffect(() => {
    if (!socket) return;

    const userId = localStorage.getItem('user_id');
    const userName = `${localStorage.getItem('user_nom')} ${localStorage.getItem('user_prenom')}`

    socket.emit('register', {
      userId,
      userRole: 'enseignant'
    });

    socket.on('user_notification', (data) => {
      console.log("Notification reçue:", data); 
      toast.info(`${userName} ${data.message}`);
    });

    return () => {
      socket.off('user_notification');
    };
  }, [socket]);

  const adminMenu = [
    {
      name: t("navElements.themes"),
      icon: <ThemesIcon />,
      path: "/enseignant",
    },
    {
      name: t("navElements.groupes"),
      icon: <GroupesIcon />,
      path: "/enseignant/groupes",
    },
    {
      name: t("navElements.soutenances"),
      icon: <SoutenancesIcon />,
      path: "/enseignant/soutenances",
    },
      {
      name: "Rendez-vous",
      icon: <NotificationsIcon />,
      path: "/enseignant/rendez-vous",
    }
  ];

  return (
    <div className="admin-grid">
      <NavBar menuItems={adminMenu} racinePath={"/enseignant"} />
      <TopBar />
      <div className="main-container">
        <Outlet />
      </div>
    </div>
  )
}