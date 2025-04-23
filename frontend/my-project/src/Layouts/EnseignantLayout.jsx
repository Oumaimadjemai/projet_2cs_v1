import React from "react"
import { Outlet } from 'react-router-dom'
import NavBar from "../Components/Partials/Components/NavBar"
import TopBar from "../Components/Partials/Components/TopBar";
import { ReactComponent as ThemesIcon } from '../Assets/Icons/Lightbulb.svg';
import { ReactComponent as GroupesIcon } from '../Assets/Icons/People.svg';
import { ReactComponent as SoutenancesIcon } from '../Assets/Icons/Mortarboard.svg';
import { useTranslation } from 'react-i18next';

export const EnseignantLayout = () => {

  const { t } = useTranslation();

    const adminMenu = [
        {
          name: t("navElements.themes"),
          icon: <ThemesIcon />,
          path: "/enseignant/themes",
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