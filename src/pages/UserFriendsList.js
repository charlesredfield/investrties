import React, { useState, useEffect, useRef } from 'react';
import Cookies from 'universal-cookie';
import { Link } from 'react-router-dom';
import SearchBar2 from '../components/SearchBar2';
import { useParams } from 'react-router-dom';

import axios from './api/axios';

const cookies = new Cookies();

const UserFriendLists = () => {
    const errRef = useRef();

    const [friendLists, setFriendLists] = useState([]);
    const { username } = useParams();
    const [errMsg, setErrMsg] = useState('');

    useEffect(() => {
        const accessToken = cookies.get('accessToken');
        // Fetch user's friend list with profile pictures
        const fetchFriendList = async () => {
            try {
                const response = await axios.get(`/api/${username}/friendslist`, {
                    headers: {
                      'Content-Type': 'application/json',
                      Authorization: `Bearer ${accessToken}`,
                  },
                  });
                const friendList = response.data;
                setFriendLists(friendList);
                console.log(friendList);
            } catch (error) {
                // Handle errors
                setErrMsg(`Not a Friend of ${username}`);
            }
        };

        // Fetch user's friend list when the component mounts
        fetchFriendList();
    }, []);
    return (
        <>
            <div className="searchBarDiv2">
      <SearchBar2/>
      </div>
            <h1>Friend List</h1>
            <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
            <ul>
                {friendLists.map((friend) => (
                    <li key={friend.username} style={{ display: 'flex', alignItems: 'center' }}>
                        <Link to={`/profile/${friend.username}`}>
                            {/* Display friend's profile picture */}
                            <img
                                src={`data:image/jpeg;base64,${friend.profilePicture}`}
                                alt={friend.username}
                                style={{ width: '75px', height: '75px', borderRadius: '50%' }}
                            />
                        </Link>
                        {/* Display friend's username */}
                        <Link
                            style={{ textDecoration: 'none', color: 'black', fontSize: '1.5rem', marginLeft: '10px' }}
                            to={`/profile/${friend.username}`}
                        >
                            {friend.username}
                        </Link>
                    </li>
                ))}
            </ul>
        </>
    );
};

export default UserFriendLists;