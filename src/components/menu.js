import React, { useState, useEffect } from 'react';
import './media-queries.css';
import { NavLink } from 'react-router-dom';
import logo from './logo.svg';

function Menu() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isDisabled, setIsDisabled] = useState(false);
    const [navbarClass, setNavbarClass] = useState('black-bg visible');
  const [prevScrollY, setPrevScrollY] = useState(0);
  
  
  

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY < prevScrollY) {
        setNavbarClass('down');
      } else {
        setNavbarClass('up');
      }

      setPrevScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [prevScrollY]);
  const toggleMenu = () => {
    setIsDisabled(true)
    setIsMenuOpen(!isMenuOpen)
      setTimeout(() => {
        setIsDisabled(false)
        }, 1100);
    };
    return (
        <>
        <button className={`menu ${navbarClass}`} onClick={toggleMenu} disabled={isDisabled}>Menu</button>
            <div className={`mobile-menu ${isMenuOpen ? 'open' : 'close'}`}>
                <div className='mobie-content'>
            <div className="mobile-links">
            <NavLink to="/login" onClick={toggleMenu} className={`link ${isMenuOpen ? 'fade-in-link' : 'fade-out-link'}`}>
              Log in
            </NavLink>
            <NavLink to="/signup" onClick={toggleMenu} className={`link ${isMenuOpen ? 'fade-in-link' : 'fade-out-link'}`}>
              Sign up
            </NavLink>
            <NavLink to="/features" className={`link ${isMenuOpen ? 'fade-in-link' : 'fade-out-link'}`}>
              Features
            </NavLink>
            <NavLink to="/ourplan" onClick={toggleMenu} className={`link ${isMenuOpen ? 'fade-in-link' : 'fade-out-link'}`}>
              Our Plan
            </NavLink>
            <NavLink to="/feedback" onClick={toggleMenu} className={`link ${isMenuOpen ? 'fade-in-link' : 'fade-out-link'}`}>
              Feedback
            </NavLink>
            <NavLink to="/contact" onClick={toggleMenu} className={`link ${isMenuOpen ? 'fade-in-link' : 'fade-out-link'}`}>
              Contact Us
            </NavLink>
            <NavLink to="/donation" onClick={toggleMenu} className={`link ${isMenuOpen ? 'fade-in-link' : 'fade-out-link'}`}>
              Donations
            </NavLink>   
                </div>
                <div className="slits">
                <span className={`slit-1 ${isMenuOpen ? 'fade-in-link' : 'fade-out-link'}`}> </span>
            <span className={`slit-2 ${isMenuOpen ? 'fade-in-link' : 'fade-out-link'}`}> </span>
            <span className={`slit-3 ${isMenuOpen ? 'fade-in-link' : 'fade-out-link'}`}> </span>
            <span className={`slit-4 ${isMenuOpen ? 'fade-in-link' : 'fade-out-link'}`}> </span>
            <span className={`slit-5 ${isMenuOpen ? 'fade-in-link' : 'fade-out-link'}`}> </span>
            <span className={`slit-6 ${isMenuOpen ? 'fade-in-link' : 'fade-out-link'}`}> </span>
            <span className={`slit-7 ${isMenuOpen ? 'fade-in-link' : 'fade-out-link'}`}> </span>
            <span className={`slit-8 ${isMenuOpen ? 'fade-in-link' : 'fade-out-link'}`}> </span>
            <span className={`slit-9 ${isMenuOpen ? 'fade-in-link' : 'fade-out-link'}`}> </span>
            <span className={`slit-10 ${isMenuOpen ? 'fade-in-link' : 'fade-out-link'}`}> </span>
            <span className={`slit-11 ${isMenuOpen ? 'fade-in-link' : 'fade-out-link'}`}> </span>
            <span className={`slit-12 ${isMenuOpen ? 'fade-in-link' : 'fade-out-link'}`}> </span>
            <span className={`slit-13 ${isMenuOpen ? 'fade-in-link' : 'fade-out-link'}`}> </span>
            <span className={`slit-14 ${isMenuOpen ? 'fade-in-link' : 'fade-out-link'}`}> </span>
            <span className={`slit-15 ${isMenuOpen ? 'fade-in-link' : 'fade-out-link'}`}> </span>
            </div> 
                </div>
            </div>
            </>
    );
}
export default Menu;