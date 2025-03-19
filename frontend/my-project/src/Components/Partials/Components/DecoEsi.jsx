import React from 'react'
import '../Styles/DecoEsi.css'
import logoESISBA from '../../../Assets/Images/logo_ESISBA.png'

function DecoEsi() {

    const getFormattedDate = () => {
        const options = { year: "numeric", month: "long", day: "numeric" };
        return new Date().toLocaleDateString("en-US", options);
    };

    return (
        <div className='deco-container'>
            <div className="deco-wrapper">
                <div className="school-name-box">
                    <div className="date-line" style={{ fontWeight: "350", fontSize: "0.9rem" }}>
                        {getFormattedDate()}
                    </div>
                    <div className="school-name-line">
                        <span style={{ fontSize: "1.5rem", fontWeight: "520" }}>
                            École Supérieure En Informatique
                        </span>
                        <span style={{ fontSize: "0.9rem" }}>
                            8 Mai 1945 - Sidi-Bel-Abbès
                        </span>
                    </div>
                </div>
                <img src={logoESISBA} alt="logo de esi sba" style={{ minHeight: "100%" }} />
            </div>
        </div>
    )
}

export default DecoEsi
