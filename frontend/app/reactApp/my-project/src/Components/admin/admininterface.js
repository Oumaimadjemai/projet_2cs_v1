import React from 'react'
import { Outlet } from 'react-router-dom'
function admininterface() {
  return (
    <div className='w-full h-full  '>
    <div className='w-full h-full  flex   '>
        <div className='w-[20%] h-screen bg-purple '> navbar
             </div>
        <div className=' bg-[#ECF1F4] h-full w-[82%] '>
           
            <Outlet />
         

        </div>
    </div>
    <div>footer</div>
</div>
  )
}

export default admininterface