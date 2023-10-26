import { useRef, useState, useEffect, useContext } from 'react';
import AuthContext from "./context/AuthProvider";
import { NavLink } from 'react-router-dom';
import Menu from '../components/menu';
import Navbar from '../components/navBar';
import Cookies from 'universal-cookie';

import axios from './api/axios';
const LOGIN_URL = '/api/login';
const cookies = new Cookies();

const Login = () => {
    const { setAuth } = useContext(AuthContext);
    const userRef = useRef();
    const errRef = useRef();

    const [user, setUser] = useState('');
    const [pwd, setPwd] = useState('');
    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);
    const [infoSet, setInfoSet] = useState(false);


    useEffect(() => {
        userRef.current.focus();
    }, [])

    useEffect(() => {
        setErrMsg('');
    }, [user, pwd])

    const accountInfo = {
        username: user,
        password: pwd
      }
    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Submitting login request with the following data:");
        console.log("Username:", user);
        console.log("Password:", pwd);
        console.log("accountInfo:", accountInfo);
        
        try {
            const response = await axios.post(LOGIN_URL,
                JSON.stringify(accountInfo),
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                }
            );
            if (response.status === 201) {
                // Set cookies first
                const accessToken = response?.data;
                cookies.set('accessToken', accessToken, { path: '/', maxAge: 3600 });
                document.location.replace('/account');
                setAuth({ user, pwd, accessToken });

                
                // Check if the response indicates that profile information is already set
            } 
            if (response.status === 200) {
                    // Redirect to AccountPage
                    const accessToken = response?.data;
                    cookies.set('accessToken', accessToken, { path: '/', maxAge: 3600 });
                     document.location.replace('/accountpage');
                    setAuth({ user, pwd, accessToken });
                } else {
                   // Handle other status codes as needed
                console.error('Unexpected response:', response);
                }
            
        } catch (err) {
            if (err.response?.status === 404) {
                setErrMsg('Account Not Found');
            } else if (err.response?.status === 401) {
                setErrMsg('Incorrect Password');
            }
            errRef.current.focus();
        }
    }

  return (
    <>
        <><Navbar /><Menu />
        <section id="section_4" className="offwhite">
                      <section className="signup_section">
                          <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
                          <h1 className="signup_header">Log In</h1>
                          <form id="loginForm" onSubmit={handleSubmit}>
                              <label htmlFor="username">Username or Email</label>
                              <input
                                  type="text"
                                  id="username"
                                  ref={userRef}
                                  autoComplete="off"
                                  onChange={(e) => setUser(e.target.value)}
                                  value={user}
                                  required />

                              <label htmlFor="password">Password</label>
                              <input
                                  type="password"
                                  id="password"
                                  onChange={(e) => setPwd(e.target.value)}
                                  value={pwd}
                                  required />
                              <button className="submit">Log In</button>
                          </form>
                          <p className="registered">
                              Need an Account?<br />
                              <span className="line">
                                  {/*put router link here*/}
                                  <NavLink to='/signup' className="login_link">Sign Up</NavLink>
                              </span>
                          </p>
                      </section>
                  </section></>
    
</>
  )
}

export default Login