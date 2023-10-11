import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from './api/axios';
import Cookies from 'universal-cookie';
import { Link } from 'react-router-dom';



const cookies = new Cookies();

const PROFILE_PICTURE = '/api/account/profilepicture';

const Messages = () => {
  const { username } = useParams();
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [profilePicture, setProfilePicture] = useState('');
  const [media, setMedia] = useState(null);
  const [mediaBinary, setMediaBinary] = useState('');
  const [photo, setPhoto] = useState(null);
  const [photoBinary, setPhotoBinary] = useState([]);
  const [video, setVideo] = useState(null);
  const [videoBinary, setVideoBinary] = useState([]);
  const [messagesSet, isMessagesSet] = useState(false);
  const [initialScrollDone, setInitialScrollDone] = useState(false);
  const [offset, setOffset] = useState(0);
  const [messagesPerPage, setMessagesPerPage] = useState(10);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false); // Add this state
  const [lastLoadedMessageTimestamp, setLastLoadedMessageTimestamp] = useState(null);



  const messagesContainerRef = useRef(null);
  const debounce = (func, delay) => {
    let timeout;
    return function () {
      const context = this;
      const args = arguments;
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(context, args), delay);
    };
  };
  const scrollToTop = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = 0;
    }
  };
  
  useEffect(() => {
    const loadMessages = debounce(() => {
      fetchMessages(offset);
    }, 1000);
    loadMessages();
    const accessToken = cookies.get('accessToken');
    scrollToTop();
       // Fetch the initial messages
       
    axios
      .get(PROFILE_PICTURE, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        responseType: 'blob',
      })
      .then((response) => {
        const blob = new Blob([response.data], {
          type: response.headers['content-type'],
        });
        const imageUrl = URL.createObjectURL(blob);
        setProfilePicture(imageUrl);
      })
      .catch((error) => {
        console.error('Error fetching profile picture:', error);
      });
  }, []);


  useEffect(() => {
    const handleScroll = debounce(() => {
      const messagesContainer = messagesContainerRef.current;
    
      if (messagesContainer) {
        const scrollPosition = messagesContainer.scrollTop;
        const clientHeight = messagesContainer.clientHeight;
    
        // Calculate a threshold value (e.g., 10% from the bottom) to trigger loading more messages
        const threshold = messagesContainer.scrollHeight - clientHeight - clientHeight * 2;
    
        // Load more messages when the user is close to the bottom
        if (scrollPosition >= threshold) {
          fetchMessages(offset, lastLoadedMessageTimestamp);
        }
      }
    }, 500);
    // Attach scroll event listener to messages container
    const messagesContainer = messagesContainerRef.current;
    if (messagesContainer) {
      messagesContainer.addEventListener('scroll', handleScroll);
    }

    // Clean up the event listener when the component unmounts
    return () => {
      if (messagesContainer) {
        messagesContainer.removeEventListener('scroll', handleScroll);
      }
    };
  }, [offset, lastLoadedMessageTimestamp]);
  useEffect(() => {
 
  }, [profilePicture])

  const fetchMessages = async (offset) => {
    const accessToken = cookies.get('accessToken');
    try {
      const response = await axios.get(`/api/chat/threads/${username}/history`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          offset,
          messagesPerPage,
          lastLoadedMessageTimestamp, // Pass the last loaded message timestamp to the API
        },
      });
      const { messages } = response.data;
      if (!messagesSet) {
        isMessagesSet(true);
      }
      // Append the new messages to the existing ones
      setMessages((prevMessages) => [...messages, ...prevMessages]);
      if (messages.length > 0) {
        // Update the last loaded message timestamp
        setLastLoadedMessageTimestamp(messages[messages.length - 1].timestamp);
      }
      // Update the offset to indicate the number of older messages loaded
      setOffset(offset + messagesPerPage);
    } catch (error) {
      console.error('Error fetching chat messages:', error);
    }
    
  };
  const fetchNewMessage = async (offset, messagesPerPage) => {
    const accessToken = cookies.get('accessToken');
    try {
      const response = await axios.get(`/api/chat/threads/${username}/history`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          offset,
          messagesPerPage,
          lastLoadedMessageTimestamp, // Pass the last loaded message timestamp to the API
        },
      });
      const { messages } = response.data;
      if (!messagesSet) {
        isMessagesSet(true);
      }
      // Append the new messages to the existing ones
      setMessages((prevMessages) => [...prevMessages, ...messages]);
    } catch (error) {
      console.error('Error fetching chat messages:', error);
    }
    
  };

  const submitMessage = async (e) => {
    e.preventDefault();

    const accessToken = cookies.get('accessToken');

    const messageSend = {
      messageContent: message,
      timestamp: Date.now(),
      photo: Array.from(photoBinary),
      video: Array.from(videoBinary),
    };

    try {
      await axios.post(`/api/chat/send/${username}`, JSON.stringify(messageSend), {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      });
    } catch (error) {
      console.error('Error Creating Chat:', error);
      console.error('Error Response:', error.response); // Log the error response for debugging
    }
    setMessage('');
    setMedia(null);
    fetchNewMessage(0, 1); // Fetch new messages after sending a message
  };

  const checkMedia = async () => {
  }
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
          setPhoto(file);
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
          setVideo(file);
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
    const reversedMessages = messages.slice().reverse();
  return (
    <div>
      
    {messagesSet ? (
    <div style={{ boxSizing: 'border-box', backgroundColor: '#FAF9F6' }}>
      <div style={{ boxSizing: 'border-box', position: 'fixed', width: '100vw', height: '70px', backgroundColor: '#209B47', color: 'white', top: '0%', display: 'flex', alignItems: 'center', paddingLeft: '10px', paddingRight: '10px', overflow: 'none', borderBottomLeftRadius: '.75rem', borderBottomRightRadius: '.75rem' }}>
        <h2 style={{ flex: 1, margin: '0' }}>Chat Messages</h2>
        <Link to="/accountpage">
          <img
            src={profilePicture}
            alt="Profile Picture"
            style={{ width: '50px', height: '50px', borderRadius: '50%' }}
          />
        </Link>
      </div>
      <div ref={messagesContainerRef} style={{ maxHeight: 'calc(100vh - 70px)', overflowY: 'auto', paddingBottom: '70px' }}>
        <ul style={{ listStyle: 'none', paddingTop: '70px', paddingBottom: '50px', paddingLeft: '0', paddingRight: '0' }}>
          {reversedMessages.map((messageItem, index) => (
            <li key={index} style={{ marginBottom: '10px', overflow: 'none' }}>
            <div style={{ height: 'auto', marginBottom: '20px' }}>
              <p
                style={{
                  color: messageItem.senderUsername === username ? '#ffd700' : '#209B47',
                  marginLeft: messageItem.senderUsername === username ? '2%' : '92%',
                }}
              >
                {messageItem.senderUsername === username ? messageItem.senderUsername : 'Me'}
              </p>
              <div
                style={{
                  border: messageItem.senderUsername === username ? '1px solid #ffd700' : '1px solid #209B47',
                  boxShadow: messageItem.senderUsername === username
                    ? `
                      -5px 5px 0px 0px rgba(255, 215, 0, 0.4), 
                      -10px 10px 0px 0px rgba(255, 215, 0, 0.3), 
                      -15px 15px 0px 0px rgba(255, 215, 0, 0.2), 
                      -20px 20px 0px 0px rgba(255, 215, 0, 0.1), 
                      -25px 25px 0px 0px rgba(255, 215, 0, 0.05)`
                    : `
                      5px 5px 0px 0px rgba(32, 155, 71, 0.4), 
                      10px 10px 0px 0px rgba(32, 155, 71, 0.3), 
                      15px 15px 0px 0px rgba(32, 155, 71, 0.2), 
                      20px 20px 0px 0px rgba(32, 155, 71, 0.1), 
                      25px 25px 0px 0px rgba(32, 155, 71, 0.05)`,
                  backgroundColor: 'white',
                  borderRadius: '1rem',
                  marginLeft: messageItem.senderUsername === username ? '20px' : '55%',
                  marginRight: '10px',
                  width: '40%',
                }}
              >
                {messageItem.message && (
                  <p
                    style={{
                      color: 'black',
                      marginLeft: '10px',
                    }}
                  >
                    {messageItem.message}
                  </p>
                )}
                {messageItem.photoContent && (
                  <img
                    src={ `data:image/jpeg;base64,${messageItem.photoContent}`}
                    alt="Photo"
                    style={{ maxWidth: '100%', height: 'auto', borderRadius: '1rem' }}
                  />
                )}
                {messageItem.videoContent && (
                  <video
                    controls
                    loop
                    style={{ maxWidth: '100%', height: 'auto', borderRadius: '1rem' }}
                    src={`data:video/mp4;base64,${messageItem.videoContent}`}
                    type="video/mp4"
                  >
                    Your browser does not support the video tag.
                  </video>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
      <form onSubmit={submitMessage} style={{ position: 'fixed', width: '100vw', backgroundColor: '#209B47', color: 'white', bottom: '0px', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '10px', boxSizing: 'border-box', borderTopLeftRadius: '.75rem', borderTopRightRadius: '.75rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
  <input
    type="text"
    placeholder="Message"
    value={message}
    onChange={(e) => setMessage(e.target.value)}
    style={{ flex: 1, padding: '10px', borderRadius: '1rem', width: '60vw' }}
  />
  <label htmlFor="media" style={{ cursor: 'pointer', marginBottom: '15px', marginLeft: '10px'}}>
    Media
  </label>
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
</div>
    {media && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px' }}>
            {media.type.startsWith('image/') ? (
              
                <img
                    src={URL.createObjectURL(media)}
                    alt="Media"
                    style={{ width: '100px', height: '100px' }}
                />
            ) : (
                <video controls width="200" height="200" src={URL.createObjectURL(media)}>
                    Your browser does not support the video tag.
                </video>
            )}
        </div>
        
    )}
    
    
    <button type="submit" style={{ minWidth: '80px' }}>Send</button>
  </form>
  
  </div>
  ) : (
    // Display a loading message or spinner while images are loading
    <div></div>
  )}
  </div>
  
  );
};

export default Messages;
