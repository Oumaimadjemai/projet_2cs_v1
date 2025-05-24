import React from "react"
import { Outlet } from 'react-router-dom'
import NavBar from "../Components/Partials/Components/NavBar"
import TopBar from "../Components/Partials/Components/TopBar";
import { ReactComponent as NotificationsIcon } from '../Assets/Icons/Notifications.svg';
import { ReactComponent as ThemesIcon } from '../Assets/Icons/Lightbulb.svg';
import { ReactComponent as GroupesIcon } from '../Assets/Icons/People.svg';
import { ReactComponent as SoutenancesIcon } from '../Assets/Icons/Mortarboard.svg';

export const EtudiantLayout = () => {

    const etudiatMenu = [
        {
          name: "Thèmes Projet",
          icon: <ThemesIcon />,
          path: "/etudiant/themes",
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











