import './navbar.css'
import banner from './banner.png'
import React, { useContext } from 'react';
import { AuthContext } from '../../auth/AuthContext';
import LogoutButton from '../../pages/Login/Logout';

export default function Navbar() {
    const { token, username, userId } = useContext(AuthContext);
    const root = window.location.origin;
    return (
        <div className='navbar'>
            <a href="./" className='navbar-image'>
                <img src={banner} ></img>
            </a>
            <div className='navbar-links'>
                <a href={root}>Landing Page</a>
                <a href={root + "/principal"}>Main Page</a>
                {userId !== null && userId !== "null" &&
                    <a href={root + "/games"}>Games</a>
                }
                <a href={root + "/about"}>About Us</a>
                <a href={root + "/rules"}>Rules</a>
                <div className='user-login'>
                    <p>Usuario:</p>
                    <p>{token !== null && token !== "null" ? username : "pendiente"}</p>
                </div>
                {token !== "null" && token !== null && <LogoutButton />}
            </div>
        </div>    
    )   
}