import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Cookies from 'universal-cookie';
import { Link } from 'react-router-dom';
import SearchBar2 from '../components/SearchBar2';

import axios from './api/axios';
const FRIEND_REQUEST = '/api/friendrequestlist';
const FRIEND_REQUEST_RESPONSE ='/api/friendrequestresponse';
const PROFILE_PICTURE = '/api/account/profilepicture';

const cookies = new Cookies();
const FriendRequests = () => {
    const [friendRequests, setFriendRequests] = useState([]);
    const [profilePicture, setProfilePicture] = useState('');

    useEffect(() => {
      const accessToken = cookies.get('accessToken');
      axios
      .get(PROFILE_PICTURE, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        responseType: 'blob' // Set the responseType to 'blob' to handle binary data
      })
      .then(response => {
        const blob = new Blob([response.data], { type: response.headers['content-type'] });
        const imageUrl = URL.createObjectURL(blob);
        setProfilePicture(imageUrl);
      })
  .catch(error => {
      // Handle errors
  });
        const fetchRequests = async () => {
            try {
              const response = await axios.get(FRIEND_REQUEST, {
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${accessToken}`,
                },
              });
              const requests = response.data;
              setFriendRequests(requests);
            } catch (error) {
              // Handle errors
              console.error('Error fetching requests:', error);
            }
          };
          
          // Fetch requests when the component mounts
          fetchRequests();
    }, []);
const accept = async (username) => {
    const myResponse = {
        username: username,
        response: "accept",
      };
      const accessToken = cookies.get('accessToken');
      
      try {
        // Make the post request
        await axios.post(FRIEND_REQUEST_RESPONSE, JSON.stringify(myResponse), {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        });
    } catch (error) {
        // Handle errors
        console.error('Error sending response:', error);
      }
    };
    const decline = async (username) => {
        const myResponse = {
            username: username,
            response: "decline",
          };
          const accessToken = cookies.get('accessToken');
          
          try {
            // Make the post request
            await axios.post(FRIEND_REQUEST_RESPONSE, JSON.stringify(myResponse), {
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
              },
            });
        } catch (error) {
            // Handle errors
            console.error('Error sending response:', error);
          }
        };

   

    return (
       <>
       <div className="searchBarDiv2">
          <SearchBar2 /> 
          </div>
       <h1>Friend Requests</h1>
    <ul>
      {friendRequests.map((request) => {
        return (
          <li key={request.id}>
            {request.friendRequestsList.map((friend, index) => (
              <div key={index}>
                {/* Display request content */}
                <span>
                <Link to={`/profile/${friend}`}>{friend}{' '}</Link><br></br>
                  <button onClick={() => accept(friend)}>Accept</button>
                  <p>or</p>
                  <button onClick={() => decline(friend)}>Decline</button>
                </span>
              </div>
            ))}
          </li>
        );
      })}
    </ul></>
    );
};

export default FriendRequests;