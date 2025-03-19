import React from 'react'
import DecoEsi from '../../Partials/Components/DecoEsi'
import '../Styles/Dashboard.css'

function Dashboard() {
  return (
    <div className='dashboard-container'>
      <div className="dashboard-wrapper">
        <DecoEsi />
        <h1>Dashboard</h1>
      </div>
    </div>
  )
}

export default Dashboard
