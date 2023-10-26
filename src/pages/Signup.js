import React from 'react';
import { useRef, useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import Menu from '../components/menu';
import Navbar from '../components/navBar';

import axios from './api/axios';
const SIGNUP_URL = '/api/update-account';

const USER_REGEX = /^[a-zA-Z][a-zA-z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[-!@#$%]).{8,24}$/;
const EMAIL_REGEX = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

const Signup = () => {
  const userRef = useRef();
    const errRef = useRef();

    const [user, setUser] = useState('');
    const [validName, setValidName] = useState(false);
    const [userFocus, setUserFocus] = useState(false);

    const [email, setEmail] = useState('');
    const [validEmail, setValidEmail] = useState(false);
    const [emailFocus, setEmailFocus] = useState(false);

    const [pwd, setPwd] = useState('');
    const [validPwd, setValidPwd] = useState(false);
    const [pwdFocus, setPwdFocus] = useState(false);

    const [matchPwd, setMatchPwd] = useState('');
    const [validMatch, setValidMatch] = useState(false);
    const [matchFocus, setMatchFocus] = useState(false);

    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        userRef.current.focus();
    }, [])

    useEffect(() => {
        setValidName(USER_REGEX.test(user));
    }, [user])

    useEffect(() => {
      setValidEmail(EMAIL_REGEX.test(email));
  }, [email])

    useEffect(() => {
        setValidPwd(PWD_REGEX.test(pwd));
        setValidMatch(pwd === matchPwd);
    }, [pwd, matchPwd])

    useEffect(() => {
        setErrMsg('');
    }, [user, pwd, matchPwd])

    const accountInfo = {
      username: user,
      password: pwd,
      email: email
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        // if button enabled with JS hack
        const v1 = USER_REGEX.test(user);
        const v2 = PWD_REGEX.test(pwd);
        const v3 = EMAIL_REGEX.test(email);
        if (!v1 || !v2 || !v3) {
            setErrMsg("Invalid Entry");
            return;
        }
        try {
            const response = await axios.post(SIGNUP_URL,
                JSON.stringify(accountInfo),
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                }
            );
            // TODO: remove console.logs before deployment
            console.log(JSON.stringify(response?.data));
            //console.log(JSON.stringify(response))
            setSuccess(true);
            //clear state and controlled inputs
            setUser('');
            setEmail('');
            setPwd('');
            setMatchPwd('');
            document.location.replace('/login');
        } catch (err) {
            if (!err?.response) {
                setErrMsg('No Server Response');
            } else if (err.response?.status === 400) {
                setErrMsg('Username or Email Taken');
            } else {
                setErrMsg('Registration Failed')
            }
            errRef.current.focus();
        }
    }


  return (
    <><Navbar /><Menu /><section id="section_4" className="offwhite">
      <section className="signup_section"><p ref={errRef} className={errMsg ? "errmsg" :
        "offscreen"} aria-live="assertive">{errMsg}</p>
        <h1 className="signup_header">Sign Up</h1>
        <form id="signupForm" onSubmit={handleSubmit}>
          <label htmlFor="username">
            Username
            <span className={validName ? "valid" : "hide"}>
              Valid
            </span>
            <span className={validName || !user ? "hide" :
              "invalid"}>
              Invalid
            </span>
          </label>
          <input
            type="text"
            id="username"
            ref={userRef}
            autocomplete="off"
            onChange={(e) => setUser(e.target.value)}
            required
            aria-invalid={validName ? "false" : "true"}
            aria-describedby="uidnote"
            onFocus={() => setUserFocus(true)}
            onBlur={() => setUserFocus(false)} />
          <p id="uidnote" className={userFocus && user &&
            !validName ? "instructions" : "offscreen"}>
            4 to 24 characters.<br />
            Must begin with a letter.<br />
            Letters, numbers, underscores, hyphens allowed.
          </p>
          <label htmlFor="email">
            Email
            <span className={validEmail ? "valid" : "hide"}>
              Valid
            </span>
            <span className={validEmail || !email ? "hide" :
              "invalid"}>
              Invalid
            </span>
          </label>
          <input
            type="text"
            id="email"
            ref={userRef}
            autocomplete="off"
            onChange={(e) => setEmail(e.target.value)}
            required
            aria-invalid={validEmail ? "false" : "true"}
            aria-describedby="emailnote"
            onFocus={() => setEmailFocus(true)}
            onBlur={() => setEmailFocus(false)} />


          <label htmlFor="password">
            Password
            <span className={validPwd ? "valid" : "hide"}>
              Valid
            </span>
            <span className={validPwd || !pwd ? "hide" : "invalid"}>
              Invalid
            </span>
          </label>
          <input
            type="password"
            id="password"
            onChange={(e) => setPwd(e.target.value)}
            required
            aria-invalid={validPwd ? "false" : "true"}
            aria-describedby="pwdnote"
            onFocus={() => setPwdFocus(true)}
            onBlur={() => setPwdFocus(false)} />
          <p id="pwdnote" className={pwdFocus && !validPwd ? "instructions" : "offscreen"}>
            Must include uppercase and lowercase letters,<br /> a number, and a special
            character.<br /> These include,<span aria-label="dash">-</span><span aria-label="exclamation mark">!</span>
            <span aria-label="at-symbol">@</span><span aria-label="hashtag">#</span>
            <span aria-label="dollar sign">$</span><span aria-label="percentage">%</span>
          </p>

          <label htmlFor="confirm_pwd">
            Confirm Password
            <span className={validMatch && matchPwd ? "valid" : "hide"}>
              Valid
            </span>
            <span className={validMatch || !matchPwd ? "hide" : "invalid"}>
              Invalid
            </span>
          </label>
          <input
            type="password"
            id="confirm_pwd"
            onChange={(e) => setMatchPwd(e.target.value)}
            required
            aria-invalid={validMatch ? "false" : "true"}
            aria-describedby="confirmnote"
            onFocus={() => setMatchFocus(true)}
            onBlur={() => setMatchFocus(false)} />
          <p id="confirmnote" className={matchFocus && !validMatch ? "instructions" :
            "offscreen"}>
            Must match the first password input field.
          </p>
          <button disabled={!validName || !validPwd || !validMatch ? true : false} className="submit">Sign Up</button>
        </form>
        <p className="registered">
          Already registered?<br />
          <span className="line">
            {/*put router link here*/}
            <NavLink to='/login' className="login_link">Log In</NavLink>
          </span>
        </p>
      </section>
    </section></>
  )
}

export default Signup