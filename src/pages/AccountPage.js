import React from "react";
import { useRef, useState, useEffect, useContext } from 'react';
import AuthContext from "./context/AuthProvider";
import { NavLink } from 'react-router-dom';
import Cookies from 'universal-cookie';
import SearchBar from '../components/SearchBar';
import commentBox from '../components/commentBox.svg';
import likeButton from '../components/likeButton.svg';
import likeCounter from '../components/likeCounter.svg';
import { Link } from 'react-router-dom';
import customPencilIcon from '../components/pencil.svg'; // Import your custom icon


import axios from './api/axios';
const PROFILE_PICTURE = '/api/account/profilepicture';
const MY_PROFILE = 'api/profile/myProfile';
const POST_ACCOUNT = '/api/account/post';
const GETPOSTS_URL = '/api/account/getPosts';
const BANNER_PICTURE = '/api/account/banner';

const cookies = new Cookies();

const AccountPage = () => {
    const [profilePicture, setProfilePicture] = useState('');
    const [banner, setBanner] = useState('');
    const [post, setPost] = useState('');
    const [getPosts, setGetPosts] = useState([]);
    const [myProfile, setMyProfile] = useState({});
    const [showFullAbout, setShowFullAbout] = useState(false);
    const [media, setMedia] = useState(null);
    const [photoBinary, setPhotoBinary] = useState([]);
    const [videoBinary, setVideoBinary] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isCommentsOpen, setIsCommentsOpen] = useState('');
    const initialCommentStates = Array.isArray(post) ? Array(post.length).fill('') : [];
    const [imagesLoaded, setImagesLoaded] = useState(false);
    const [commentStates, setCommentStates] = useState(initialCommentStates);
    const [likeCount, setLikeCount] = useState('');
    
    
    
      // Function to add a new comment input field
      const addCommentField = () => {
        // Create a new comment state with an initial empty value
        const newCommentState = { comment: '' };
        // Add the new comment state to the array of comment states
        setCommentStates([...commentStates, newCommentState]);
      };
    
      // Function to update a specific comment state by index
      const updateComment = (index, value) => {
      // Create a copy of the comment states array
      const updatedCommentStates = [...commentStates];
      // Update the comment state at the specified index
      updatedCommentStates[index] = value; // Update the comment state for the current post
      // Update the state with the modified array
      setCommentStates(updatedCommentStates);
    };
useEffect(() => {
  const accessToken = cookies.get('accessToken');
  console.log(accessToken); // This will output the token value

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
axios
.get(BANNER_PICTURE, {
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${accessToken}`
  },
  responseType: 'blob' // Set the responseType to 'blob' to handle binary data
})
.then(response => {
  const blob = new Blob([response.data], { type: response.headers['content-type'] });
  const imageUrl = URL.createObjectURL(blob);
  setBanner(imageUrl);
})
.catch(error => {
// Handle errors
});
const getMyProfile = async () => {
  try {
    const accessToken = cookies.get('accessToken');
    const response = await axios.get(MY_PROFILE, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const data = response.data;
    setMyProfile(data);
  } catch (error) {
    // Handle errors
    console.error('Error fetching profile:', error);
  }
  console.log(myProfile);
};
const fetchPosts = async () => {
  try {
    const accessToken = cookies.get('accessToken');
    const response = await axios.get(GETPOSTS_URL, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });
    if (Array.isArray(response.data.posts)) { // Check if 'posts' is an array within the response
      const posts = response.data.posts;
      setGetPosts(posts);
      const initialCommentStates = Array(posts.length).fill('');
      setCommentStates(initialCommentStates);
      console.log("this is post: ", getPosts);
    } else {
      console.error('API response does not contain an array of posts:', response.data);
    }
  } catch (error) {
    // Handle errors
    console.error('Error fetching posts:', error);
  }
};
getMyProfile();
fetchPosts();
}, []); 
const fetchPosts = async () => {
  try {
    const accessToken = cookies.get('accessToken');
    const response = await axios.get(GETPOSTS_URL, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });
    if (Array.isArray(response.data.posts)) { // Check if 'posts' is an array within the response
      const posts = response.data.posts;
      setGetPosts(posts);
      const initialCommentStates = Array(posts.length).fill('');
      setCommentStates(initialCommentStates);
      console.log("this is post: ", getPosts);
    } else {
      console.error('API response does not contain an array of posts:', response.data);
    }
  } catch (error) {
    // Handle errors
    console.error('Error fetching posts:', error);
  }
};

console.log(profilePicture);
const submitPost = async (e) => {
  e.preventDefault();
  toggleComments();
  if (post === '') {
    // If the post is empty after trimming, display an error message or take appropriate action
    alert('Post cannot be blank.');
    return; // Exit the function without making the post request
  }
  const myPost = {
    post: post,
    photo: Array.from(photoBinary),
    video: Array.from(videoBinary),
    createdAt: Date.now(),
  };
  const accessToken = cookies.get('accessToken');
  
  try {
    // Make the post request
    await axios.post(POST_ACCOUNT, JSON.stringify(myPost), {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });

    // Clear the post input
    setPost('');

    // Fetch updated posts after a successful post creation
    fetchPosts();
  } catch (error) {
    // Handle errors
    console.error('Error creating post:', error);
  }
};
const friendRequests = async (e) => {
  e.preventDefault();
  document.location.replace('/friendrequests');
};
const friendLists = async (e) => {
  e.preventDefault();
  document.location.replace('/friendlists');
};
const editProfile = async (e) => {
  e.preventDefault();
  document.location.replace('/account');
};
const handleOpportunityButtonClick = () => {
  // Handle the Media button click here
  // You can open a file upload dialog or perform the desired action
};

const handleInvestrEventButtonClick = () => {
  // Handle the InvestrEvent button click here
  // You can open a modal to schedule an event or perform the desired action
};

const handleMediaChange = (e) => {
  setMedia(e.target.files[0]);
  const file = e.target.files[0]; // Get the selected file

  if (!file) {
    return; // No file selected, do nothing
  }

  const reader = new FileReader();

  reader.onload = (event) => {
    // Convert the selected file to a Uint8Array (raw binary data)
    const binaryData = new Uint8Array(event.target.result);

    if (
      file.type === 'image/jpeg' ||
      file.type === 'image/png' ||
      file.type === 'image/gif' ||
      file.type === 'image/bmp' ||
      file.type === 'image/webp' ||
      file.type === 'image/svg+xml' ||
      file.type === 'image/tiff'
    ) {
      // It's a photo
      setPhotoBinary(binaryData);
      setVideoBinary([]); // Ensure videoBinary is an empty array for photos
    } else if (
      file.type === 'video/mp4' ||
      file.type === 'video/webm' ||
      file.type === 'video/ogg' ||
      file.type === 'video/3gpp' ||
      file.type === 'video/3gpp2' ||
      file.type === 'video/x-msvideo' ||
      file.type === 'video/quicktime' ||
      file.type === 'video/x-matroska' ||
      file.type === 'video/quicktime' // Include .mov files here
    ) {
      // It's a video
      setVideoBinary(binaryData);
      setPhotoBinary([]); // Ensure photoBinary is an empty array for videos
    } else {
      // It's neither a photo nor a video
      console.log("not allowed");
      setPhotoBinary([]);
      setVideoBinary([]);
    }
  };

  reader.onerror = (event) => {
    // Handle file read error
    console.error("Error reading file:", event.target.error);
  };

  reader.readAsArrayBuffer(file); // Start reading the file
};
const image = new Image();
      image.src = banner;
      const aspectRatio = image.width / image.height;
      const bannerWidth = window.innerWidth;
      const bannerHeight = bannerWidth / aspectRatio;
      // Function to toggle the visibility of the full "About" section
  const toggleAboutVisibility = () => {
    setShowFullAbout(!showFullAbout);
  };
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };
  const toggleComments = () => {
    setIsCommentsOpen(!isCommentsOpen);
  };
    const [liked, setLiked] = useState(false);
  
    const toggleLike = () => {
      setLiked((prevLiked) => !prevLiked);
    };
    const addComment = async (postId, commentText, commentIndex) => {
      const accessToken = cookies.get('accessToken');
      const commentData = {
        comment: commentText,
      };
    
      try {
        // Make a POST request to your backend to add the comment
        await axios.post(`/${postId}/comments`, commentData, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        });
    
        // Update the comment state for the specific post
        const updatedCommentStates = [...commentStates];
    updatedCommentStates[commentIndex] = '';
    setCommentStates(updatedCommentStates);
    
        // Fetch user posts
        fetchPosts();
      } catch (error) {
        // Handle errors
        console.error('Error adding comment:', error);
      }
    };
    useEffect(() => {
      if (profilePicture && banner) {
        setImagesLoaded(true);
      }
    }, [profilePicture, banner]);
    const sendLike = async (postId) => {
      const accessToken = cookies.get('accessToken');
      console.log(postId);
    
      try {
        const response = await axios.post(
          `/like/${postId}`,
          {},
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
    
        if (response.status === 200) {
          // The like was successful, update the like count
          setLikeCount(likeCount + 1);
        } else {
          // Handle errors, e.g., show a message to the user
        }
      } catch (error) {
        // Handle any network or request errors
        console.error('Error liking post:', error);
      }
    };
    const sendUnlike = async (postId) => {
      const accessToken = cookies.get('accessToken');
      console.log(postId);
    
      try {
        const response = await axios.delete(`/unlike/${postId}`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        });
    
        if (response.status === 200) {
          // The unlike was successful, update the like count
          setLikeCount(likeCount - 1);
        } else {
          // Handle errors, e.g., show a message to the user
        }
      } catch (error) {
        // Handle any network or request errors
        console.error('Error unliking post:', error);
      }
    };
return(
  <div className="accountPageContainer">
    {imagesLoaded ? (
      <div>
    <div className={`modal ${isModalOpen ? 'isOpen' : 'isNotOpen'}`}>
      <button onClick={toggleModal}>Back</button>
    <form id="postForm" onSubmit={submitPost}>
      <div style={{display: 'inline-flex',}}>
    <input
    className='postInput'
      type="text"
      placeholder="Create a Post" 
      onChange={(e) => setPost(e.target.value)}
    />
<label htmlFor="media" style={{ cursor: 'pointer', fontSize: '1.7rem', marginLeft: '15px'}}>
📷
  </label>
  </div>
  <input
    type="file"
    id="media"
    accept="
      image/jpeg, image/png, image/gif, image/bmp, image/webp, image/svg+xml, image/tiff,
      video/mp4, video/webm, video/ogg, video/3gpp, video/3gpp2, video/x-msvideo,
      video/quicktime, video/x-matroska,
      .mov"
    style={{ display: 'none' }} // Hide the default file input
    onChange={handleMediaChange}
  />
  {media && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px' }}>
            {media.type.startsWith('image/') ? (
              
                <img
                    src={URL.createObjectURL(media)}
                    alt="Media"
                    style={{ width: '100%', height: 'auto', marginTop: '20px' }}
                />
            ) : (
                <video controls width="100%" height="auto" style={{marginTop: '20px'}} src={URL.createObjectURL(media)}>
                    Your browser does not support the video tag.
                </video>
            )}
        </div>
    )}
    </form>
    </div>
  
<div
className={`accountPage ${isModalOpen ? 'blurred-background' : ''}`}
      style={{
        margin: '0',
        padding: '0',
        boxSizing: 'border-box',
      }}
    >
      <div className="searchBarDiv">
      <SearchBar/>
      </div>
      <div className="profileContainer" style={{width: '100%', height: 'auto', backgroundColor: '#FAF9F6', marginTop: '10px', border: '2px solid #ececec',maxWidth: '100%', boxSizing: 'border-box',}}>
      <div
      className="profilePictureBorder"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          left: '20px',
          width: "170px",
          height: "170px",
          borderRadius: "50%",
          top: '65px',
          position: 'absolute',
          backgroundColor: 'grey',
          border: '5px solid white',
          zIndex: '2',
          
        }}>
      
      <img
      className="actualProfilePicture"
        src={profilePicture}
        alt="Profile Picture"
        style={{
          width: "150px",
          height: "150px",
          borderRadius: "50%",
          border: '8px solid white',
          zIndex: '3',
        
        }}
      />
      </div>
      <div style={{ position: 'relative' }}>
  <img
    src={banner}
    alt="Banner"
    style={{
      boxSizing: 'border-box',
      border: '2px solid #ececec',
      width: '100%',
      height: `120px`, // Set the height dynamically
      top: '0',
      objectFit: 'cover',
      overflowY: 'hidden',
      borderTopLeftRadius: '1rem',
      borderTopRightRadius: '1rem',
      maxWidth: '100%',
    }}
  />
</div>
      
      <div style={{
        marginTop: '50px',
      }}>
      <h1 style={{ paddingLeft: '5px'}}>{myProfile.firstName} {myProfile.lastName}  <button
        onClick={editProfile}
        style={{

          backgroundColor: 'transparent',
          border: 'none',
        }}
      >
        <img
          src={customPencilIcon}
          alt="Edit Profile"
          style={{
            width: '32px', // Set the desired width and height
            height: '32px',
          }}
        />
      </button></h1>
      <p style={{ paddingLeft: '7px' }}>
  {" "}
  {myProfile.about ? (
    showFullAbout ? (
      myProfile.about
    ) : (
      `${myProfile.about.slice(0, 50)}... `
    )
  ) : (
    "No information available"
  )}
  {myProfile.about && (
    <div>
      <button
  onClick={toggleAboutVisibility}
  style={{ color: '#209B47' }} // Change the color to your preference
>
  {showFullAbout ? "Less" : "More"}
</button>
    </div>
  )}
</p>
            </div>
            </div>
      <div style={{width: '100%', height: 'auto', backgroundColor: '#FAF9F6', marginTop: '10px', border: '2px solid #ececec',maxWidth: '100%', boxSizing: 'border-box', textAlign: 'center'}}>
      <h1 style={{color: '#209B47'}}>Friends</h1>
      <button className="friendButton" onClick={friendRequests} style={{ marginRight: '10px' }}>Friend Requests</button>
      <button className="friendButton" onClick={friendLists}style={{ marginLeft: '10px', paddingBottom: '20px' }}>Friend Lists</button>
      </div>
      <div style={{width: '100%', height: 'auto', backgroundColor: '#FAF9F6', marginTop: '10px', border: '2px solid #ececec',maxWidth: '100%', boxSizing: 'border-box', textAlign: 'center'}}>
        <h1 style={{textDecoration: 'underline', color: '#209B47'}}>Portfolio</h1>
      </div>
      <div id="section_post">
      <img
          src={profilePicture}
          alt="Profile Picture"
          style={{
            width: '55px',
            height: '55px',
            borderRadius: '50%',
          marginTop: '10px',
          marginLeft: '20px',
          }}/>
  <form id="postForm" onSubmit={submitPost}>
    <input
    className='postInput'
      type="text"
      placeholder="Create a Post"
      onChange={(e) => setPost(e.target.value)}
    />
    <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-start',
              width: '100%',
              marginTop: '13px',
              left: '10px',
              height: 'auto',
              overflowX: 'hidden',
              boxSizing: 'border-box',
            }}
          >
            <button
  type="button"
  className="postButton"
  onClick={toggleModal}
  style={{ fontSize: '17px', marginRight: '17px' }}
>
  <span role="img" aria-label="Media" style={{ marginRight: '0px' }}>
    📷
  </span>
  Media
</button>
      <button
        type="button"
        className="postButton"
        onClick={handleInvestrEventButtonClick}
        style={{ fontSize: '17px', marginRight: '17px' }}
      >
        <span role="img" aria-label="InvestrEvent" style={{ marginRight: '0px' }}>
          📅
        </span>
        Event
      </button>
      <button
        type="button"
        className="postButton"
        onClick={handleOpportunityButtonClick}
        style={{ fontSize: '17px' }}
      >
        <span role="img" aria-label="Opportunity" style={{ marginRight: '0px' }}>
          💼
        </span>
        Opportunity
      </button>
          </div>

  </form>
</div>
<div
  style={{
    width: '100%',
    height: 'auto',
    backgroundColor: '#FAF9F6',
    marginTop: '10px',
    border: '2px solid #ececec',
    maxWidth: '100%',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomLeftRadius: '1.5rem',
    borderBottomRightRadius: '1.5rem'
  }}
>
  <h1 style={{ textAlign: 'left' }}>Activity</h1>
  {/* Iterate over the array of posts and render each one */}
  {Array.isArray(getPosts) &&
        getPosts.map((postItem, index) => (
    <div
    className="userPostContainer"
      key={postItem.id}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start', // Align to the left
        textAlign: 'left',
        marginBottom: '15px', // Add space between posts
        border: '2px solid #ececec',
        backgroundColor: 'white',
        width: '90%',
        borderRadius: '1rem',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center', // Center vertically
          marginBottom: '10px',
          marginLeft: '10px' // Add space between profile and post
        }}
      >
        <img
          src={profilePicture}
          alt="Profile Picture"
          style={{
            width: '45px',
            height: '45px',
            marginTop: '10px',
            borderRadius: '50%',
            marginRight: '10px', // Add space between image and text
          }}
        />
        <p>
          {myProfile.firstName} {myProfile.lastName} posted this
        </p>
      </div>
      <div
        style={{
          borderTop: '2px solid #ececec',
          borderBottom: '2px solid #ececec',
          width: '100%',
          textAlign: 'left',
        }}
      >
        <p style={{marginLeft: '10px',}}>{postItem.posts}</p>
        {postItem.photoContent && (
                  <img
                  src={`data:image/jpeg;base64,${postItem.photoContent}`}
                  style={{ maxWidth: '100%',maxHeight: '95vh', marginBottom: '5px'}}
                    alt="Photo"
                  />
                )}
                {postItem.videoContent && (
                  <video  
                  controls
                  loop
                  style={{ maxWidth: '100%', width: '100%', maxHeight: '95vh', marginBottom: '5px'}}
                  src={`data:video/mp4;base64,${postItem.videoContent}`}
                  type="video/mp4">
                    Your browser does not support the video tag.
                  </video>
                )}
                <div style={{display: 'flex', alignItems: 'center', marginBottom: '5px'}}>
                <img
          src={likeCounter}
          alt="Edit Profile"
          style={{
            width: '25px', // Set the desired width and height
            height: '25px',
            marginLeft: '2%',
          }}
        />
        <span style={{fontSize: 'larger', marginLeft: '5px',}}>{postItem.likes.length}</span>
        </div>
                <div style={{
                  display: 'inline-block',
                  alignItems: 'center',
                  justifyContent: 'center',
                  alignContent: 'center',
                  borderTop: '2px solid #ececec',
                  width: '100%',
                }}>
                  <button
      className={`like-button ${postItem.liked ? "liked" : ""}`}
      onClick={toggleLike}
    >
      <svg
         xmlns="http://www.w3.org/2000/svg"
         viewBox="0 0 80 80"
         className={`like-icon ${postItem.liked ? "liked-icon" : ""}`}
          onClick={() => { if (postItem.liked) {
            // If it's already liked, perform unlike for this specific post
            sendUnlike(postItem.id).then(() => {
              // Decrease like count by 1 and update liked state
              postItem.likes.length = Math.max(0, postItem.likes.length - 1);
              postItem.liked = false;
            });
          } else {
            // If it's not liked, perform like for this specific post
            sendLike(postItem.id).then(() => {
              // Increase like count by 1 and update liked state
              postItem.likes.length += 1;
              postItem.liked = true;
            });
          }
        }}
      >
           <path
          d="M75 32.548c0-3.916-3.186-7.101-7.1-7.101H50.061c1.311-4.285 2.868-12.455-2.189-17.435-1.526-1.502-3.468-2.352-5.469-2.394-2.016-.048-3.773.675-5.082 2.074a4.136 4.136 0 0 0-1.108 2.838v.711c0 7.31-3.331 14.08-8.91 18.107a21.165 21.165 0 0 1-5.381 2.812 3.366 3.366 0 0 0-3.353-3.188H8.371A3.375 3.375 0 0 0 5 32.342v38.67a3.375 3.375 0 0 0 3.371 3.371h10.2a3.375 3.375 0 0 0 3.37-3.37V69.64c5.945 1.004 12.078 1.509 18.369 1.509 7.033 0 14.262-.628 21.636-1.884a6.902 6.902 0 0 0 6.71-6.891c0-1.155-.289-2.243-.793-3.2 2.877-.88 4.977-3.56 4.977-6.721 0-1.48-.462-2.85-1.245-3.984A6.885 6.885 0 0 0 75 42.537c0-1.942-.81-3.694-2.107-4.948A7.078 7.078 0 0 0 75 32.548zM17.941 70.383H9V32.972h8.941v37.411zM68.112 39.65c1.592 0 2.888 1.295 2.888 2.888s-1.296 2.887-2.888 2.887H56.277a2 2 0 0 0 0 4h9.535a3.031 3.031 0 0 1 3.028 3.029 3.031 3.031 0 0 1-3.028 3.027H58.865a2 2 0 0 0 0 4h2.898a2.896 2.896 0 0 1 2.893 2.894 2.897 2.897 0 0 1-2.893 2.893c-.114 0-.227.01-.338.029-13.827 2.371-27.101 2.46-39.484.28V36.361a25.032 25.032 0 0 0 7.705-3.77c6.617-4.777 10.568-12.758 10.568-21.35v-.711a.18.18 0 0 1 .03-.105c.525-.562 1.212-.83 2.077-.808.976.02 1.95.463 2.745 1.246 4.918 4.842.49 15.397.33 15.769-.1.222-.156.465-.168.72 0 .026-.007.052-.008.077l-.001.018c0 .068.013.133.02.2.006.06.007.12.018.177.013.07.037.136.057.203.018.058.031.117.054.172.022.056.053.106.08.159.033.064.063.13.103.19.023.035.052.065.077.098.053.072.107.143.17.207.018.018.04.033.058.05.076.072.154.14.242.2.01.007.02.01.03.017.092.06.185.118.289.163.276.122.564.17.847.164H67.9c1.71 0 3.101 1.39 3.101 3.1s-1.39 3.102-3.1 3.102H54.982a2 2 0 0 0 0 4h13.129z"
          fillRule="evenodd"
        />
                </svg>
    </button>
                   <img
          src={commentBox}
          onClick={toggleComments}
          alt="Edit Profile"
          style={{
            width: '32px', // Set the desired width and height
            height: '32px',
            paddingTop: '10px',
            marginLeft: '20%',
          }}
        />
                </div>
                <form
  onSubmit={(e) => {
    e.preventDefault();
    addComment(postItem.id, commentStates[index], index); // Pass -1 as the index
  }}
  style={{
    display: 'flex',
    alignItems: 'center',
    marginBottom: '20px',
    marginTop: '15px',
    marginLeft: '15px',
  }}
>
  <img
    src={profilePicture}
    alt="Profile Picture"
    style={{
      width: '40px',
      height: '40px',
      borderRadius: '50%',
      marginRight: '10px',
    }}
  />

  <input
    className='commentInput'
    type="text"
    placeholder="Add a Comment..."
    value={commentStates[index]} // Use the comment state for the current post and index
    onChange={(e) => updateComment(index, e.target.value)}
  />
</form> 
{postItem.comments.length > 0 && (
          <div>
            {postItem.comments.map((comment, index) => (
              
               <div key={index} className={`comment-container ${isCommentsOpen ? 'isCommentsOpen' : 'isCommentsNotOpen'}`}>
               <div className="profile-picture-container">
                 <img
                   src={`data:image/jpeg;base64,${comment.profilePicture}`}
                   style={{ maxWidth: '35px', height: '35px', borderRadius: '50%' }}
                   alt="Photo"
                 />
               </div>
               <div className="commentStyles">
                 <Link
                   style={{ color: 'inherit', textDecoration: 'inherit' }}
                   to={`/profile/${comment.username}`}
                   onClick={() => {
                     window.location.href = `/profile/${comment.username}`;
                   }}
                 >
                   <p className="comments">
                     <span className="commentUser">{comment.username}:</span><br></br><span className="commentComment">{comment.comment}</span>
                   </p>
                 </Link>
               </div>
             </div>
           ))}
         </div>
        )}
      </div>
    </div>
  ))}
</div>
</div>
    </div>
     ) : (
      // Display a loading message or spinner while images are loading
      <div></div>
    )}
    </div>
    );
}

export default AccountPage