import React from 'react';
import './Header.css';
import sureWalkTitle from '../../../assets/images/sure-walk-title.png';

function Header() {
    return (
        <header className="admin-header">
            <img src={sureWalkTitle} alt="Sure Walk" />
        </header>
    )
}

export default Header;