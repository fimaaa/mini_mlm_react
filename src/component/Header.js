import React, { useContext } from 'react';
import { HeaderContext } from './HeaderContext.js'; // Adjust the import path
import { useNavigate, useLocation } from 'react-router-dom';
import ImageWithFallback from './ImageWithFallback'; // Adjust the import according to your project structure

const Header = () => {
  const { headerText, headerBackButton } = useContext(HeaderContext);
  const navigate = useNavigate();
  const location = useLocation();

  const userData = JSON.parse(localStorage.getItem('userData'));

  const handleLogout = () => {
    localStorage.removeItem("userData");
    window.location.reload();
  };

  return (
    <header className="header">
      <div className="left">
        {headerBackButton && (
          <button className="back-button" onClick={() => navigate(-1)}>
            Back
          </button>
        )}
      </div>
      <h1>{headerText}</h1>
      <div className="right">
        {userData == null ? (
          <></>
        ) : (
          <div className="user-info">
            <ImageWithFallback
              src={userData.memberPhoto}
              alt="User Photo"
              style={{ width: '40px', height: '40px', borderRadius: '50%', marginRight: '10px' }}
            />
            <p style={{ margin: 0 }}>{userData.username}</p>
            <button className="logout" onClick={handleLogout}>Logout</button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;