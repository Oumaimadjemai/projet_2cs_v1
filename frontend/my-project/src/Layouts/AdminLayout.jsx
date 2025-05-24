import React, { useEffect } from "react"
import { Outlet } from 'react-router-dom'
import NavBar from "../Components/Partials/Components/NavBar"
import TopBar from "../Components/Partials/Components/TopBar";
import { ReactComponent as DashboardIcon } from '../Assets/Icons/dashboard.svg';
import { ReactComponent as ParametersIcon } from '../Assets/Icons/University.svg';
import { ReactComponent as ThemesIcon } from '../Assets/Icons/Lightbulb.svg';
import { ReactComponent as GroupesIcon } from '../Assets/Icons/People.svg';
import { ReactComponent as SoutenancesIcon } from '../Assets/Icons/Mortarboard.svg';
import { useTranslation } from 'react-i18next';
import { useSocket } from "../Components/Contexts/useSocket";
import { toast } from 'react-toastify';

export const AdminLayout = () => {

  const { t } = useTranslation();
  const socket = useSocket();

  useEffect(() => {
    if (!socket) {
      console.log("WebSocket non connecté");
      return;
    }

    const userId = localStorage.getItem('user_id');
    const userName = `${localStorage.getItem('user_nom')} ${localStorage.getItem('user_prenom')}`
    const userRole = 'admin'; // À remplacer par la valeur dynamique si nécessaire

    console.log("📡 Enregistrement WebSocket - ID:", userId, "Rôle:", userRole);

    // 1. Enregistrement standard
    socket.emit('register', {
      userId,
      userRole
    });

    // 2. Enregistrement supplémentaire pour les notifications admin
    socket.emit('register_admin');

    // 3. Gestion des notifications
    const handleRoleNotification = (data) => {
      if (data.role === 'admin') {
        toast.info(`${userName} ${data.message}`);
      }
    };

    const handleSystemNotification = (data) => {
      if (data.type === 'ENTREPRISE_DEMANDE') {
        toast.info(
          <div>
            <b>Nouvelle demande entreprise</b>
            <p>{data.metadata.entrepriseNom}</p>
            <p>Contact: {data.metadata.email}</p>
          </div>,
          { autoClose: false } // Garde la notification visible
        );
      } else {
        toast.info(`[SYSTÈME] ${data.message}`);
      }
    };

    // Abonnement
    socket.on('role_notification', handleRoleNotification);
    socket.on('system_notification', handleSystemNotification);

    // Nettoyage
    return () => {
      socket.off('role_notification', handleRoleNotification);
      socket.off('system_notification', handleSystemNotification);
    };
  }, [socket]);


  const adminMenu = [
    {
      name: t("navElements.dashaboard"),
      icon: <DashboardIcon />,
      path: "/admin",
    },
    {
      name: t("navElements.parametres"),
      icon: <ParametersIcon />,
      subMenu: [
        {
          name: t("navElements.enseignants"),
          path: "/admin/enseignants"
        },
        {
          name: t("navElements.etudiants"),
          path: "/admin/etudiants"
        },
        {
          name: t("navElements.entreprise"),
          path: "/admin/entreprises"
        },
        {
          name: t("navElements.admins"),
          path: "/admin/admins"
        },
        {
          name: t("navElements.scolarite"),
          path: "/admin/scolarite"
        },
      ],
    },
    {
      name: t("navElements.themes"),
      icon: <ThemesIcon />,
      path: "/admin/themes",
    },
    {
      name: t("navElements.groupes"),
      icon: <GroupesIcon />,
      path: "/admin/groupes",
    },
    {
      name: t("navElements.soutenances"),
      icon: <SoutenancesIcon />,
      path: "/admin/soutenances",
    },
  ];


  return (
    <div className="admin-grid">
      <NavBar menuItems={adminMenu} racinePath={"/admin"} />
      <TopBar />
      <div className="main-container">
        <Outlet />
      </div>
    </div>
  )
}