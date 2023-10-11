import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Cookies from 'universal-cookie';
import { Link } from 'react-router-dom';
import SearchBar2 from '../components/SearchBar2';
import commentBox from '../components/commentBox.svg';
import likeButton from '../components/likeButton.svg';
import likeCounter from '../components/likeCounter.svg';
import axios from './api/axios';
const FRIEND_REQUEST = '/api/friendrequest';
const PROFILE_PICTURE = '/api/account/profilepicture';

const cookies = new Cookies();

const UserProfile = () => {
    const [profilePicture, setProfilePicture] = useState('');
    const [comment, setComment] = useState('');
    const { username } = useParams();
    const [userProfile, setUserProfile] = useState({});
    const [userPosts, setUserPosts] = useState([]);
    const [banner, setBanner] = useState('');
    const [showFullAbout, setShowFullAbout] = useState(false);
    const [imagesLoaded, setImagesLoaded] = useState(false);
    const [isCommentsOpen, setIsCommentsOpen] = useState('');
    const [likeCount, setLikeCount] = useState('');

  // Create an array of comment states, initially empty
  const initialCommentStates = Array.isArray(userPosts) ? Array(userPosts.length).fill('') : [];

const [commentStates, setCommentStates] = useState(initialCommentStates);

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

        // Fetch user profile data based on the username
        axios.get(`/api/profile/${username}`)
            .then((response) => {
                setUserProfile(response.data);
            })
            .catch((error) => {
                // Handle errors
                console.error('Error:', error);
            });

        // Fetch user's posts
        const fetchUsersPosts = async () => {
          try {
            const response = await axios.get(`/api/posts/${username}`);
            if (Array.isArray(response.data.posts)) {
              const posts = response.data.posts;
              setUserPosts(posts);
              const initialCommentStates = Array(posts.length).fill('');
              setCommentStates(initialCommentStates);
            } else {
              console.error('API response does not contain an array of posts:', response.data);
            }
          } catch (error) {
            // Handle errors
            console.error('Error fetching posts:', error);
          }
        };
        fetchUsersPosts()
        }, [username]);

    const submitRequest = async (e) => {
        e.preventDefault();
        const request = {
            username: username
        };
        console.log(request);
        const accessToken = cookies.get('accessToken');

        try {
            // Make the post request
            await axios.post(FRIEND_REQUEST, JSON.stringify(request), {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                },
            });
        } catch (error) {
            // Handle errors
            console.error('Error sending request:', error);
        }
    };
    useEffect(() => {
    axios
    .get(`/api/profile/${username}/banner`, {
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
  }, []); 
  const userFriends = async (e) => {
    e.preventDefault();
    document.location.replace(`/profile/${username}/friendslist`);
  }
  const sendMessage = async (e) => {
    e.preventDefault();
    document.location.replace(`/message/${username}`);
  }
    const image = new Image();
      image.src = banner;
      const aspectRatio = image.width / image.height;
      const bannerWidth = window.innerWidth;
      const bannerHeight = bannerWidth / aspectRatio;
      const [liked, setLiked] = useState(false);
  
    const toggleLike = () => {
      setLiked((prevLiked) => !prevLiked);
    };
    const fetchUsersPosts = async () => {
      try {
        const response = await axios.get(`/api/posts/${username}`);
        if (Array.isArray(response.data.posts)) {
          const posts = response.data.posts;
          setUserPosts(posts);
          const initialCommentStates = Array(posts.length).fill('');
          setCommentStates(initialCommentStates);
          console.log(userPosts);
        
        } else {
          console.error('API response does not contain an array of posts:', response.data);
        }
      } catch (error) {
        // Handle errors
        console.error('Error fetching posts:', error);
      }
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
        toggleComments();
        fetchUsersPosts();
      } catch (error) {
        // Handle errors
        console.error('Error adding comment:', error);
      }
    };
    useEffect(() => {
      if (profilePicture && banner && userProfile) {
        setImagesLoaded(true);
      }
    }, [profilePicture, banner, userProfile]);
    const toggleComments = () => {
      setIsCommentsOpen(!isCommentsOpen);
    };
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
    return (
        <div>
           <div className="searchBarDiv2">
                <SearchBar2 />
            </div>
          {imagesLoaded ? (
            <div>
            <div style={{ width: '100%', height: 'auto', backgroundColor: '#FAF9F6', marginTop: '10px', border: '2px solid #ececec', maxWidth: '100%', boxSizing: 'border-box' }}>
                <div style={{
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
                    {/* Display user's profile picture */}
                    {userProfile.profilePicture && (
                        <img
                            src={`data:image/jpeg;base64,${userProfile.profilePicture}`}
                            alt="Profile Picture"
                            style={{
                                width: "150px",
                                height: "150px",
                                borderRadius: "50%",
                                border: '8px solid white',
                                zIndex: '3',
                            }}
                        />
                    )}
                </div>

                <div style={{ position: 'relative' }}>
                    {/* Display user's banner */}
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
                    <h1 style={{ paddingLeft: '5px' }}>{userProfile.firstName} {userProfile.lastName}</h1>
                    <p style={{ paddingLeft: '7px' }}>
                {" "}
                {userProfile.about ? (
                    showFullAbout ? ( // Use showFullAbout state here
                        userProfile.about
                    ) : (
                        `${userProfile.about.slice(0, 50)}... `
                    )
                ) : (
                    "No information available"
                )}
                {userProfile.about && (
                    <div>
                        <button
                            onClick={() => {
                                setShowFullAbout(!showFullAbout); // Update showFullAbout state
                            }}
                            style={{ color: '#209B47' }}
                        >
                            {showFullAbout ? "Less" : "More"} {/* Use showFullAbout state here */}
                        </button>
                        <br/><br/>
                                <button onClick={submitRequest}>Send Friend Request</button>
                                <button style={{marginLeft: '30px'}} onClick={sendMessage}>Send Message</button>
                    </div>
                )}
            </p>
                </div>
            </div>

            <div style={{ width: '100%', height: 'auto', backgroundColor: '#FAF9F6', marginTop: '10px', border: '2px solid #ececec', maxWidth: '100%', boxSizing: 'border-box', textAlign: 'center' }}>
                <h1 style={{ color: '#209B47' }}>Friends</h1>
                <button onClick={userFriends} style={{ paddingBottom: '20px' }}>Friend Lists</button>
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
  }}
>
  <h1 style={{ textAlign: 'left' }}>{userProfile.username}s Posts</h1>
  {/* Iterate over the array of userPosts and render each one */}
  {Array.isArray(userPosts) &&
  userPosts.map((post, index) => (
    <div
      key={post.id}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start', // Align to the left
        textAlign: 'left',
        marginBottom: '15px', // Add space between posts
        border: '1px solid #ececec',
        backgroundColor: 'white',
        width: '90%',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center', // Center vertically
          marginBottom: '10px',
          marginLeft: '10px', // Add space between profile and post
        }}
      >
        <img
          src={`data:image/jpeg;base64,${userProfile.profilePicture}`}
          alt="Profile Picture"
          style={{
            width: '30px',
            height: '30px',
            borderRadius: '50%',
            marginRight: '10px', // Add space between image and text
          }}
        />
        <p>
          {userProfile.firstName} {userProfile.lastName} posted this
        </p>
      </div>
      <div
      key={post.id}
        style={{
          borderTop: '2px solid #ececec',
          borderBottom: '2px solid #ececec',
          width: '100%',
          textAlign: 'left',
        }}
      >
        <p style={{marginLeft: '10px',}}>{post.posts}</p>
        {post.photoContent && (
                  <img
                  src={`data:image/jpeg;base64,${post.photoContent}`}
                  style={{ maxWidth: '100%', height: 'auto', marginBottom: '5px'}}
                    alt="Photo"
                  />
                )}
                {post.videoContent && (
                  <video  
                  controls
                  loop
                  style={{ maxWidth: '100%', width: '100%', height: 'auto', marginBottom: '5px'}}
                  src={`data:video/mp4;base64,${post.videoContent}`}
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
        <span style={{fontSize: 'larger', marginLeft: '5px',}}>{post.likes.length}</span>
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
      className={`like-button ${post.liked ? "liked" : ""}`}
      onClick={toggleLike}
    >
      <svg
         xmlns="http://www.w3.org/2000/svg"
         viewBox="0 0 80 80"
         className={`like-icon ${post.liked ? "liked-icon" : ""}`}
          onClick={() => { if (post.liked) {
            // If it's already liked, perform unlike for this specific post
            sendUnlike(post.id).then(() => {
              // Decrease like count by 1 and update liked state
              post.likes.length = Math.max(0, post.likes.length - 1);
              post.liked = false;
            });
          } else {
            // If it's not liked, perform like for this specific post
            sendLike(post.id).then(() => {
              // Increase like count by 1 and update liked state
              post.likes.length += 1;
              post.liked = true;
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
    addComment(post.id, commentStates[index], index); // Pass -1 as the index
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
{post.comments.length > 0 && (
          <div>
            {post.comments.map((comment, index) => (
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
     ) : (
      // Display a loading message or spinner while images are loading
      <div></div>
    )}
        </div>
    );
};

export default UserProfile;
