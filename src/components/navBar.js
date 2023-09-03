import Logo from './logo.js';
import React, { useState, useEffect } from 'react';
import './media-queries.css';
import { NavLink } from 'react-router-dom';

function Navbar() {
  const [navbarClass, setNavbarClass] = useState('black-bg visible');
  const [prevScrollY, setPrevScrollY] = useState(0);
  

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY < prevScrollY) {
        setNavbarClass('black-bg visible');
      } else {
        setNavbarClass('transparent slide-up');
      }

      setPrevScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [prevScrollY]);
  return (
    <nav className={`navbar ${navbarClass}`}>
      <Logo />
        <div className="desktop-menu-center">
          {/* Desktop menu content, e.g., login, signup */}
          
            <NavLink to="/features" className="desktop-link">
              Features
            </NavLink>
            <NavLink to="/ourplan" className="desktop-link">
              Our Plan
            </NavLink>
            <NavLink to="/feedback" className="desktop-link">
              Feedback
            </NavLink>
            <NavLink to="/contact" className="desktop-link">
              Contact Us
            </NavLink>
            <NavLink to="/donation" className="desktop-link">
              Donations
            </NavLink>
            </div>
            <div className="desktop-menu-right">
            <NavLink to="/login" className='login'>
              Log in
            </NavLink>
            <NavLink to="/signup" className='signup'>
              Sign up
            </NavLink>
        </div>
    </nav>
  );
}

export default Navbar;