import React from 'react';
import NavCss from "../css/NavBar.css";

function NavBar() {
  return (
    <nav className="navbar">
      <div className="logo">BookMate</div>
      <div className="nav-actions">
        <button className="login-btn">Business Login</button>
      </div>
    </nav>
  );
}

export default NavBar;
