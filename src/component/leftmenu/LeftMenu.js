import React, { useContext} from 'react';
import { Link, useLocation } from 'react-router-dom';
import './LeftMenu.css';
import { HeaderContext } from '../HeaderContext.js';


const LeftMenu = (data) => {
  const { headerText } = useContext(HeaderContext);
  const userData = JSON.parse(localStorage.getItem('userData'));
  
  const memberType = userData?.memberType;
  const isUserEvent = memberType === 'userEvent';
  const isUserWo = memberType === 'userWo';

  const isUserAuthenticated = userData !== null && userData !== 'undefined' && userData !== undefined;
  const isAdmin = memberType === 'admin';


  const mainMenuItems = [
    { label: 'Home', path: '/' }
  ];

  return (
    <div className={`left-menu ${data.isVisible ? 'visible' : ''}`}>
      {console.log('This is a log message'+JSON.stringify(data))}
      <ul>
        {console.log("TAG WINDOW ",  window.location.pathname, " - header", headerText)}
        {mainMenuItems.map((item) => (
          <li
            key={item.path}
            className={item.label === headerText || window.location.pathname === item.path ? 'active' : ''}
          >
            <Link to={item.path}>{item.label}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

//List User
export default LeftMenu;