import React, { useState, useEffect,  useRef } from 'react';
import Cookies from 'universal-cookie';
import { useDebounce } from './useDebounce';
import { Link } from 'react-router-dom';
import Logo2 from './logo2.js';

import axios from '../pages/api/axios';
const SEARCHUSERS_URL = '/api/search';

const cookies = new Cookies();

function SearchBar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [currentPage, setCurrentPage] = useState( -1);
  const [pageSize, setPageSize] = useState(5);


  const debouncedSearchQuery = useDebounce(searchQuery, 300);
 

  const searchBarRef = useRef(null);

  // Close the dropdown when clicking outside
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (searchBarRef.current && !searchBarRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    console.log("searchBarRef.current:", searchBarRef.current);
    document.addEventListener('mousedown', handleOutsideClick);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);
  useEffect(() => {
    if (searchQuery === '') {
      setIsDropdownOpen(false);
    }
  }, [searchQuery]);
    // Define a function to make the API request for search results
    
    useEffect(() => {
        // Define a function to make the API request for search results
        const fetchSearchResults = async () => {
          try {
            setIsLoading(true);
            const myQuery = {
              query: debouncedSearchQuery,
            };
            const response = await axios.post(SEARCHUSERS_URL, JSON.stringify(myQuery), {
              headers: {
                'Content-Type': 'application/json',
              },
            });
            console.log(response.data);
            const data = response.data.map((result) => ({
              ...result,
              profilePicture: `data:image/jpeg;base64,${result.profilePicture}`,
            }));
            setSearchResults(data); // Update searchResults with the received data
            setIsLoading(false);
          } catch (error) {
            console.error('Error fetching search results:', error);
            setIsLoading(false);
          }
        };
      
        // Execute the API request whenever searchQuery changes (as the user types)
        if (debouncedSearchQuery !== '') {
          fetchSearchResults();
        } else {
          // Clear searchResults when the search query is empty
          setSearchResults([]);
        }
      }, [debouncedSearchQuery]);
      
  // Function to fetch profile pictures for users
  const handleInputChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    setIsDropdownOpen(query !== '');
  };

  return (
      <div ref={searchBarRef} className="search-bar-wrapper">
        <Logo2 />
        <form className="searchBarForm">
  <input
    className="friendListSearchBar"
    type="text"
    placeholder="Search..."
    value={searchQuery}
    onChange={handleInputChange}
  />
  <div className={`dropDownSearch ${isDropdownOpen ? 'down' : 'up'}`}>
    {isLoading ? (
      <p>Loading...</p>
    ) : (
      <ul style={{ listStyle: 'none', margin: '0', padding: '0' }}>
        {searchResults.map((result) => (
          <li key={result.id} style={{ marginBottom: '1px' }}>
            {/* Display user information */}
            {result.profilePicture && (
              <Link to={`/profile/${result.username}`}>
                <img
                  src={result.profilePicture}
                  alt="Profile"
                />
              </Link>
            )}
            <Link to={`/profile/${result.username}`}>
              {result.firstName && result.lastName ? (
                `${result.firstName} ${result.lastName}`
              ) : result.firstName ? (
                result.firstName
              ) : result.lastName ? (
                result.lastName
              ) : (
                result.username
              )}
            </Link>
          </li>
        ))}
      </ul>
    )}
  </div>
</form>
      </div>
  );
}

export default SearchBar;
