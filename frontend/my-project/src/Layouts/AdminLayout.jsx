import React from "react"
import { Outlet } from 'react-router-dom'
import NavBar from "../Components/Partials/Components/NavBar"
import TopBar from "../Components/Partials/Components/TopBar";
import { ReactComponent as DashboardIcon } from '../Assets/Icons/dashboard.svg';
import { ReactComponent as ParametersIcon } from '../Assets/Icons/University.svg';
import { ReactComponent as ThemesIcon } from '../Assets/Icons/Lightbulb.svg';
import { ReactComponent as GroupesIcon } from '../Assets/Icons/People.svg';
import { ReactComponent as SoutenancesIcon } from '../Assets/Icons/Mortarboard.svg';

export const AdminLayout = () => {

    const adminMenu = [
        {
          name: "Tableau de Bord",
          icon: <DashboardIcon />,
          path: "/admin/dashboard",
        },
        {
          name: "Paramètres",
          icon: <ParametersIcon />,
          subMenu: [
            {
                name:"Enseignants",
                path: "/admin/enseignants"
            },
            {
                name:"Étudiants",
                path: "/admin/etudiants"
            },
            {
                name:"Entreprises",
                path: "/admin/entreprises"
            },
            {
                name:"Admins",
                path: "/admin/admins"
            },
            {
                name:"Paramètres Scolarité",
                path: "/admin/scolarite"
            },
          ],
        },
        {
          name: "Thèmes Projet",
          icon: <ThemesIcon />,
          path: "/admin/themes",
        },
        {
          name: "Groupes de Projet",
          icon: <GroupesIcon />,
          path: "/admin/groupes",
        },
        {
          name: "Soutenances",
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