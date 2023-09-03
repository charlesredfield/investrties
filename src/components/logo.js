import logo from './logo.svg';
import './media-queries.css';
import { NavLink } from 'react-router-dom';

function Logo() {
    
  return (
<div className="logo-container">
<NavLink to='/'><img src={logo} className="logo" /></NavLink>
<NavLink to='/' className="logo-text">InvestrTies</NavLink>
        </div>
  );
}
export default Logo;