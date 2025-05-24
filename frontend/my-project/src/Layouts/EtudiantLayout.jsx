import React, {useEffect} from "react"
import { Outlet } from 'react-router-dom'
import NavBar from "../Components/Partials/Components/NavBar"
import TopBar from "../Components/Partials/Components/TopBar";
import { ReactComponent as NotificationsIcon } from '../Assets/Icons/Notifications.svg';
import { ReactComponent as ThemesIcon } from '../Assets/Icons/Lightbulb.svg';
import { ReactComponent as GroupesIcon } from '../Assets/Icons/People.svg';
import { ReactComponent as SoutenancesIcon } from '../Assets/Icons/Mortarboard.svg';
import { useSocket } from "../Components/Contexts/useSocket";
import { toast } from 'react-toastify';

export const EtudiantLayout = () => {

  const socket = useSocket();
  useEffect(() => {
    if (!socket) return;

    const userId = localStorage.getItem('user_id');
    const userName = `${localStorage.getItem('user_nom')} ${localStorage.getItem('user_prenom')}`

    console.log("Registering to WebSocket:", userId);

    socket.emit('register', {
      userId,
      userRole: 'etudiant'
    });

    socket.on('user_notification', (data) => {
      console.log("Notification reçue:", data); 
        toast.info(`${userName}: ${data.message}`);
    });

    return () => {
      socket.off('user_notification');
    };
  }, [socket]);

  const etudiatMenu = [
    {
      name: "Thèmes Projet",
      icon: <ThemesIcon />,
      path: "/etudiant",
    },
    {
      name: "Groupes de Projet",
      icon: <GroupesIcon />,
      path: "/etudiant/groupes",
    },
    {
      name: "Invitations",
      icon: <NotificationsIcon />,
      path: "/etudiant/invitations",
    },
    {
      name: "Soutenances",
      icon: <SoutenancesIcon />,
      path: "/etudiant/soutenances",
    },
  ];

  return (
    <div className="admin-grid">
      <NavBar menuItems={etudiatMenu} racinePath={"/etudiant"} />
      <TopBar />
      <div className="main-container">
        <Outlet />
      </div>
    </div>
  )
}