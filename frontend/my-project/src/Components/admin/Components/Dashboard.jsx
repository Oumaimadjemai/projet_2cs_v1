import React from 'react'
import DecoEsi from '../../Partials/Components/DecoEsi'
import '../Styles/Dashboard.css'
import defaultImg from '../../../Assets/Images/default_picture.jpeg'
import { Link } from 'react-router-dom'
import ProgressBar from "@ramonak/react-progress-bar";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { ReactComponent as EmptyIcon } from '../../../Assets/Icons/notFound.svg';

function Dashboard() {

  const enseignants = [
    { id: 1, name: "Djamel Bensaber", Date: "05 juin 2025", theme: "Système Expert IA ", annee: "1CS", salle: "TP 15" },
    { id: 2, name: "Amine Boukhalfa", Date: "05 juin 2025", theme: "Gestion des PFE", annee: "3CS", salle: "Salle A3" },
    { id: 3, name: "Nadia Yousfi", Date: "05 juin 2025", theme: "Geo Alert Microserivces", annee: "1CS", salle: "Amphi A" },
    { id: 1, name: "Djamel Bensaber", Date: "05 juin 2025", theme: "Système Expert IA", annee: "2CPI", salle: "Salle A3" },
    { id: 2, name: "Amine Boukhalfa", Date: "05 juin 2025", theme: "Gestion des PFE", annee: "2CS", salle: "TP 15" },
    { id: 3, name: "Nadia Yousfi", Date: "05 juin 2025", theme: "Geo Alert Microserivces", annee: "1CS", salle: "Amphi A" },
    { id: 1, name: "Djamel Bensaber", Date: "05 juin 2025", theme: "Système Expert IA", annee: "3CS", salle: "Salle A3" },
    { id: 2, name: "Amine Boukhalfa", Date: "05 juin 2025", theme: "Gestion des PFE", annee: "3CS", salle: "TP 15" },
    { id: 3, name: "Nadia Yousfi", Date: "05 juin 2025", theme: "Geo Alert Microserivces", annee: "2CS", salle: "Salle A3" },
    { id: 1, name: "Djamel Bensaber", Date: "05 juin 2025", theme: "Système Expert IA", annee: "1CS", salle: "Amphi A" },
    { id: 2, name: "Amine Boukhalfa", Date: "05 juin 2025", theme: "Gestion des PFE", annee: "2CPI", salle: "TP 15" },
    { id: 3, name: "Nadia Yousfi", Date: "05 juin 2025", theme: "Geo Alert Microserivces", annee: "1CS", salle: "Amphi A" },
    { id: 1, name: "Djamel Bensaber", Date: "05 juin 2025", theme: "Système Expert IA", annee: "2CS", salle: "Salle A3" },
    { id: 2, name: "Amine Boukhalfa", Date: "05 juin 2025", theme: "Gestion des PFE", annee: "3CS", salle: "TP 15" },
    { id: 3, name: "Nadia Yousfi", Date: "05 juin 2025", theme: "Geo Alert Microserivces", annee: "2CPI", salle: "Amphi A" }
  ];

  return (
    <div className='dashboard-container'>
      <div className="dashboard-wrapper">
        <DecoEsi />
        <div className="dashboard-core">
          <div className="soutenances-table">
            <span style={{ fontSize: "1.1rem", color: "#000", fontWeight: "600" }}>
              Les Soutenances
            </span>
            <table>
              <thead>
                <tr>
                  <th>
                    Encadrant
                  </th>
                  <th style={{ width: "20%" }}>Thème</th>
                  <th>Année</th>
                  <th>
                    Date
                  </th>
                  <th style={{ textAlign: "center" }}>
                    Salle
                  </th>
                </tr>
              </thead>
              {
                enseignants.length !== 0 && (
                  <tbody>
                    {
                      enseignants.map((enseignant, index) => (
                        <tr>
                          <td style={{
                            textAlign: "start",
                            textIndent: "1rem",
                            background: index % 2 === 0 ? "transparent" : "#F5F5F5",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis"
                          }}>
                            {enseignant.name}
                          </td>
                          <td style={{
                            width: "20%",
                            background: index % 2 === 0 ? "transparent" : "#F5F5F5",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis"
                          }}>
                            {enseignant.theme}
                          </td>
                          <td style={{ background: index % 2 === 0 ? "transparent" : "#F5F5F5" }}>
                            {enseignant.annee}
                          </td>
                          <td style={{ background: index % 2 === 0 ? "transparent" : "#F5F5F5" }}>
                            <span>
                              {enseignant.Date}
                            </span>
                          </td>
                          <td style={{ background: index % 2 === 0 ? "transparent" : "#F5F5F5" }}>
                            {enseignant.salle}
                          </td>
                        </tr>
                      ))
                    }
                  </tbody>
                )
              }
            </table>
            {
              enseignants.length === 0 && (
                <div className="no-enseignants-available">
                  <EmptyIcon className='empty-icon' />
                  <div className="lines-box">
                    <h1 style={{ fontSize: "1.45rem", fontWeight: "650" }}>
                      Pas de Soutenances pour le moment
                    </h1>
                  </div>
                </div>
              )
            }
          </div>
          <div className="parametres-dashboard">
            <div className="administration-box">
              <span style={{ fontSize: "1.1rem", color: "#000", fontWeight: "600" }}>
                Administrtaion
              </span>
              <div className="admins-line">
                <div className="admin">
                  <img src={defaultImg} alt="default" />
                </div>
                <div className="admin">
                  <img src={defaultImg} alt="default" />
                </div>
                <div className="admin">
                  <img src={defaultImg} alt="default" />
                </div>
              </div>
              <div className="link">
                <Link to={`/admin/admins`} style={{ color: "#925FE2", fontWeight: "600", fontSize: "1.03rem" }}>
                  Voir tout
                </Link>
              </div>
            </div>
            <div className="progress-bar">
              <span style={{ fontSize: "1.1rem", color: "#000", fontWeight: "600" }}>
                Année Universitaire
              </span>
              <ProgressBar completed={60} isLabelVisible={false} />
            </div>
            <div className="container-calender">
              <Calendar />
            </div>
          </div>
        </div>
      </div>
    </div >
  )
}

export default Dashboard
