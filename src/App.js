import React from 'react';
import { BrowserRouter as Router, Route, Routes as Switch } from 'react-router-dom';
import Home from './pages/Home';
import Ourplan from './pages/Ourplan'; // Adjust component names accordingly
import Contactus from './pages/Contactus'; // Adjust component names accordingly
import Donations from './pages/Donations'; // Adjust component names accordingly
import Login from './pages/Login'; // Adjust component names accordingly
import Signup from './pages/Signup'; // Adjust component names accordingly
import Feedback from './pages/Feedback'; // Adjust component names accordingly
import Features from './pages/Features'; // Adjust component names accordingly
import Account from './pages/Account';
import AccountPage from './pages/AccountPage';
import UserProfile from './pages/UserProfile';
import FriendRequests from './pages/FriendRequests';
import FriendLists from './pages/FriendLists';
import Message from './pages/Messages';
import ChatThreads from './pages/ChatThreads';
import Messages from './pages/Messages';
import UserFriendsList from './pages/UserFriendsList';




import './App.css';

function App() {
  return (
    <Router>
      
        <Switch>
        <Route path='/' element={<Home />} />
          <Route path='/investrties' element={<Home />} />
          <Route path='/features' element={<Features />} />
          <Route path='/ourplan' element={<Ourplan />} />
          <Route path='/contact' element={<Contactus />} />
          <Route path='/donations' element={<Donations />} />
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<Signup />} />
          <Route path='/feedback' element={<Feedback />} />
          <Route path='/account' element={<Account />} />
          <Route path='/accountpage/' element={<AccountPage />} />
          <Route path="/profile/:username" element={<UserProfile />} />
          <Route path='/friendrequests' element={<FriendRequests />} />
          <Route path='/friendlists' element={<FriendLists />} />
          <Route path="/message/:username" element={<Message />} />
          <Route path="/" exact element={ChatThreads} />
          <Route path="/messages/:username" element={Messages} />
          <Route path="/profile/:username/friendslist" element={<UserFriendsList />} />


        </Switch>
     
    </Router>
  );
}

export default App;
