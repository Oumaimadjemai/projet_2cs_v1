import React from "react"
import { Outlet } from 'react-router-dom'
import NavBar from "../Components/Partials/Components/NavBar"
import TopBar from "../Components/Partials/Components/TopBar";
import { ReactComponent as ThemesIcon } from '../Assets/Icons/Lightbulb.svg';
import { useTranslation } from 'react-i18next';

export const EntrepriseLayout = () => {

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