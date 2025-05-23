import React, {useEffect} from "react"
import { Outlet } from 'react-router-dom'
import NavBar from "../Components/Partials/Components/NavBar"
import TopBar from "../Components/Partials/Components/TopBar";
import { ReactComponent as ThemesIcon } from '../Assets/Icons/Lightbulb.svg';
import { ReactComponent as GroupesIcon } from '../Assets/Icons/People.svg';
import { ReactComponent as SoutenancesIcon } from '../Assets/Icons/Mortarboard.svg';
import { useTranslation } from 'react-i18next';
import { useSocket } from "../Components/Contexts/useSocket";
import { toast } from 'react-toastify';

export const EnseignantLayout = () => {

  const { t } = useTranslation();
  const socket = useSocket();

  useEffect(() => {
  if (!socket) return;

  // Listen for teacher-specific notifications
  socket.on('role_notification', (data) => {
    if (data.role === 'enseignant') {
      toast.info(`ENSEIGNANT: ${data.message}`);
    }
  });

  // Register as teacher
  const userId = localStorage.getItem('userId');
  socket.emit('register', { 
    userId,
    userRole: 'enseignant' 
  });

  return () => {
    socket.off('role_notification');
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