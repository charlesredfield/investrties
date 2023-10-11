import logo from './logo.svg';
import './media-queries.css';
import { NavLink } from 'react-router-dom';

function Logo2() {
    
  return (
<div className="logo-container">
<NavLink to='/'><img src={logo} className="logo" /></NavLink>
        </div>
  );
}
export default Logo2;