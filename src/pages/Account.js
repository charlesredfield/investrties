import React from "react";
import { useRef, useState, useEffect, useContext } from 'react';
import AuthContext from "./context/AuthProvider";
import { NavLink } from 'react-router-dom';
import Cookies from 'universal-cookie';

import axios from './api/axios';
const USERNAME_URL = '/api/account/username';
const NAME_URL = '/api/account/name';

const cookies = new Cookies();

const Account = () => {
    const [username, setUsername] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [about, setAbout] = useState('');
    const [profilePicture, setProfilePicture] = useState(null);


    useEffect(() => {

        const accessToken = cookies.get('accessToken');
        console.log(accessToken); // This will output the token value

    axios.get(USERNAME_URL, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
        }
    })
    .then(response => {
        const username = response.data;
        setUsername(username);
    })
    .catch(error => {
        // Handle errors
    });
}, []);
const name = {
    FirstName: firstName,
    LastName: lastName,
    About: about, 
    profilePicture: profilePicture ? profilePicture.name : null 
};


const nameSubmit = async (e) => {
    e.preventDefault();
    if (profilePicture) {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (!allowedTypes.includes(profilePicture.type)) {
            alert('Only JPEG, PNG, and GIF images are allowed.');
            return;
        }
        if (profilePicture.size > 2 * 1024 * 1024) { // 2 MB limit
            alert('Image size should be less than 2MB.');
            return;
        }

        // Proceed to submit and handle the profile picture
        // Remember to handle the server-side validation and saving here
        // For demonstration purposes, I'm just logging the file details
        console.log('Profile Picture:', profilePicture.name, profilePicture.type, profilePicture.size);
    }
    console.log(name);
};
    return(
        <><h1>Hello! {username}</h1>
        <p>Finsih Setting Up Your Profile!</p>
        <form onSubmit={nameSubmit}>
            <label htmlFor="firstName">
                First Name:
                </label>
                <input
                    onChange={(e) => setFirstName(e.target.value)}
                ></input>
                <label htmlFor="lastName">
                Last Name:
                </label>
                <input
                    onChange={(e) => setLastName(e.target.value)}
                ></input>
                <label htmlFor="about">
                Tell The World All About Yourself!
                </label>
                <input
                    onChange={(e) => setAbout(e.target.value)}
                ></input>
            <label htmlFor="profilePicture">Profile Picture:</label>
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setProfilePicture(e.target.files[0])}
                />
                 {profilePicture && (
                    <img
                        src={URL.createObjectURL(profilePicture)}
                        alt="Profile Picture"
                        style={{ verticalAlign: 'center', width: '200px', height: '200px', borderRadius: '50%' }}
                    />
                )}
                <button className="submit">Submit</button>
            </form>
        </>
    );
}

export default Account