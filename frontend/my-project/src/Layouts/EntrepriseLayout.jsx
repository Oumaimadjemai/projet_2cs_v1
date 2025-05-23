import React, {useEffect} from "react"
import { Outlet } from 'react-router-dom'
import NavBar from "../Components/Partials/Components/NavBar"
import TopBar from "../Components/Partials/Components/TopBar";
import { ReactComponent as ThemesIcon } from '../Assets/Icons/Lightbulb.svg';
import { useTranslation } from 'react-i18next';
import { useSocket } from "../Components/Contexts/useSocket";
import { toast } from 'react-toastify';

export const EntrepriseLayout = () => {

  const socket = useSocket();

   useEffect(() => {
    if (!socket) return;

    const userId = localStorage.getItem('user_id');
    const userName = `${localStorage.getItem('user_nom')} ${localStorage.getItem('user_prenom')}`

    console.log("Registering to WebSocket:", userId);

    socket.emit('register', {
      userId,
      userRole: 'entreprise'
    });

    socket.on('user_notification', (data) => {
      console.log("Notification reçue:", data); 
        toast.info(`${userName}: ${data.message}`);
    });

    return () => {
      socket.off('user_notification');
    };
  }, [socket]);

  const { t } = useTranslation();

    const adminMenu = [
        {
          name: t("navElements.themes"),
          icon: <ThemesIcon />,
          path: "/entreprise",
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