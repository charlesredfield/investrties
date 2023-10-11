import React from "react";
import { useRef, useState, useEffect, useContext } from 'react';
import AuthContext from "./context/AuthProvider";
import { NavLink } from 'react-router-dom';
import Cookies from 'universal-cookie';

import axios from './api/axios';
const USERNAME_URL = '/api/account/username';
const UPDATE_ACCOUNT = '/api/account/update';
const ACCOUNT_INFO = '/api/account';


const cookies = new Cookies();

const Account = () => {
    const [username, setUsername] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [about, setAbout] = useState('');
    const [profilePicture, setProfilePicture] = useState(null);
    const [profilePictureBinary, setProfilePictureBinary] = useState('');
    const [banner, setBanner] = useState(null);
    const [bannerBinary, setBannerBinary] = useState('');

    useEffect(() => {

        const accessToken = cookies.get('accessToken');
        console.log(accessToken); // This will output the token value
        axios
        .get(ACCOUNT_INFO, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then((response) => {
          const userData = response.data;
          setFirstName(userData.firstName);
          setLastName(userData.lastName);
          setAbout(userData.about);
          // You may need to update the profile picture logic here if the data format is different
        })
        .catch((error) => {
          // Handle errors
        });

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

const handleProfilePictureChange = (e) => {
    setProfilePicture(e.target.files[0]);
    const file = e.target.files[0]; // Get the selected file
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        // Convert the selected image to a Uint8Array (raw binary data)
        const binaryData = new Uint8Array(event.target.result);
        setProfilePictureBinary(binaryData);
        console.log('Profile Picture Binary:', binaryData); // Add this line to check the binary data
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const handleBannerChange = (e) => {
    setBanner(e.target.files[0]);
    const file = e.target.files[0]; // Get the selected file
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        // Convert the selected image to a Uint8Array (raw binary data)
        const binaryData = new Uint8Array(event.target.result);
        setBannerBinary(binaryData);
        console.log('Banner Binary:', binaryData); // Add this line to check the binary data
      };
      reader.readAsArrayBuffer(file);
    }
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
        if (banner.size > 2 * 1024 * 1024) { // 2 MB limit
          alert('Image size should be less than 2MB.');
          return;
      }
        // Proceed to submit and handle the profile picture
        // Remember to handle the server-side validation and saving here
        // For demonstration purposes, I'm just logging the file details
        console.log('Profile Picture:', profilePicture.name, profilePicture.type, profilePicture.size);
    }
    const accessToken = cookies.get('accessToken');
   
    const name = {
        firstName: firstName,
        lastName: lastName,
        about: about,
        profilePicture: Array.from(profilePictureBinary),
        banner: Array.from(bannerBinary), // Include the base64 string directly
      };
      
      axios
        .post(
          UPDATE_ACCOUNT,
          JSON.stringify(name),
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${accessToken}`,
            },
          }
        )
        .then((response) => {
          // Handle the response from the server
          console.log('Response:', response.data);
           document.location.replace('/accountpage');
          
        })
        .catch((error) => {
          // Handle any errors
          console.error('Error:', error);
        });

    console.log("Sending JSON Data:", name); // Check if name contains the expected values
    
};
const back = async (e) => {
  e.preventDefault();
  document.location.replace('/accountpage');
}
const image = new Image();
      image.src = banner;
      const aspectRatio = image.width / image.height;
      const bannerWidth = window.innerWidth;
      const bannerHeight = bannerWidth / aspectRatio;
    return(
      <><button onClick={back}>Back</button><div style={{
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        gap: '10px',
      }}>
        <h1>Hello! {username}</h1>
        <p>Finish Setting Up Your Profile!</p>
        <form>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px' }}>
            <label htmlFor="firstName">First Name:</label>
            <input
              type="text"
              style={{ width: '200px', border: '1px solid #ccc', borderRadius: '4px' }}
              value={firstName} // Set the input value to the state variable
              onChange={(e) => setFirstName(e.target.value)} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px' }}>
            <label htmlFor="lastName">Last Name:</label>
            <input
              type="text"
              style={{ width: '200px', border: '1px solid #ccc', borderRadius: '4px' }}
              value={lastName} // Set the input value to the state variable
              onChange={(e) => setLastName(e.target.value)} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px' }}>
            <label htmlFor="about">About:</label>
            <textarea
              rows="5"
              style={{ width: '300px', maxWidth: '100%' }}
              value={about} // Set the input value to the state variable
              onChange={(e) => setAbout(e.target.value)} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px' }}>
            <label htmlFor="profilePicture">Profile Picture:</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleProfilePictureChange} />
            {profilePicture && (
              <img
                src={URL.createObjectURL(profilePicture)}
                alt="Profile Picture"
                style={{ width: '200px', height: '200px', borderRadius: '50%' }} />
            )}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px' }}>
            <label htmlFor="banner">Banner:</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleBannerChange} />
            {banner && (
              <img
                src={URL.createObjectURL(banner)}
                alt="banner"
                style={{
                  boxSizing: 'border-box',
                  border: '2px solid #ececec',
                  width: '100%',
                  height: `120px`,
                  top: '0',
                  objectFit: 'cover',
                  overflowY: 'hidden',
                  borderTopLeftRadius: '1rem',
                  borderTopRightRadius: '1rem',
                  maxWidth: '100%',
                }} />
            )}
          </div>
          <button onClick={nameSubmit} className="submit">Submit</button>
        </form>
      </div></>
    );
}

export default Account