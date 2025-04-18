import React from "react"
import { Outlet } from 'react-router-dom'
import NavBar from "../Components/Partials/Components/NavBar"
import TopBar from "../Components/Partials/Components/TopBar";
import { ReactComponent as DashboardIcon } from '../Assets/Icons/dashboard.svg';
import { ReactComponent as ParametersIcon } from '../Assets/Icons/University.svg';
import { ReactComponent as ThemesIcon } from '../Assets/Icons/Lightbulb.svg';
import { ReactComponent as GroupesIcon } from '../Assets/Icons/People.svg';
import { ReactComponent as SoutenancesIcon } from '../Assets/Icons/Mortarboard.svg';
import { useTranslation } from 'react-i18next';

export const AdminLayout = () => {

  const { t } = useTranslation();

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
                name:t("navElements.enseignants"),
                path: "/admin/enseignants"
            },
            {
                name:t("navElements.etudiants"),
                path: "/admin/etudiants"
            },
            {
                name:t("navElements.entreprise"),
                path: "/admin/entreprises"
            },
            {
                name:t("navElements.admins"),
                path: "/admin/admins"
            },
            {
                name:t("navElements.scolarite"),
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