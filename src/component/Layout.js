import React, {useContext, useEffect, useState} from 'react';
import Header from './Header';
import Footer from './Footer';
import { HeaderProvider, HeaderContext } from './HeaderContext';
import '../App.css'
import LeftMenu from './leftmenu/LeftMenu';


export const CommonLayout = ({ children }) => {
  return (
      <HeaderProvider>
          <Header/>
          <div className="container" style={{marginLeft: 16, marginRight: 16}}>
            {children}
          </div>
          <Footer/>
      </HeaderProvider>
      
  );
};

export const MenuLayout = ({ children }) => {
  const [isVisible, setIsVisible] = useState(true); // Manage menu visibility
  // const {setHeaderBackButton } = useContext(HeaderContext);
  const handleCloseMenu = () => {
    setIsVisible(prevIsVisible => !prevIsVisible); // Update state to hide/show menu
    console.log("TAG CLOSE", isVisible);
  };
  
  // useEffect(() => {
  //   setHeaderBackButton(false)
  // // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [setHeaderBackButton]);

  return (
      <HeaderProvider>
          <Header/>
          <div className="menu-container">
            <LeftMenu isVisible={isVisible}/>
            <div className="container" style={{marginLeft: 16, marginRight: 16}}>
              {children}
            </div>
            <button className="close-button-menu" style={{padding:8, marginLeft:20}} onClick={handleCloseMenu}>
              {isVisible ? 'Close' : 'Open'}
            </button>
          </div>
          <Footer/>
      </HeaderProvider>
      
  );
};

export const FooterLayout = ({children}) => {
    return (
        <>
            <main className="container">
              {children}
              </main>
            <Footer />
        </>
    );
};

