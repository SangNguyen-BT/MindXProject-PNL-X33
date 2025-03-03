import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MdAccountCircle } from 'react-icons/md';
import { TiClipboard } from 'react-icons/ti';
import { IoShieldCheckmarkSharp } from 'react-icons/io5';
import { HiOutlineTicket } from 'react-icons/hi';
import { FiUser } from 'react-icons/fi';
import './ProfileNav.css';
import axios from "axios"
import { backendUrl } from "../App";
const ProfileNav = () => {
  const location = useLocation();
  const [user, setUser] = useState({
    name: '',
    email: "",
    city: "",
    avatar: localStorage.getItem('userAvatar') || null, 
  });

  useEffect(() => {
    if (user.avatar) {
      localStorage.setItem('userAvatar', user.avatar);
    }
  }, [user.avatar]);

  const handleAvatarChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUser((prevUser) => ({ ...prevUser, avatar: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveAvatar = () => {
    setUser((prevUser) => ({ ...prevUser, avatar: null }));
    localStorage.removeItem('userAvatar');
  };
  const getUser = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/auth/getuser`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (response.data.ok) {
        setUser(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  useEffect(() => {
    getUser()
  }, [])
  return (
    <div className="dashboard">
      <div className="avatar-section">
  {user.avatar ? (
    <img src={user.avatar} alt="User Avatar" className="avatar" />
  ) : (
    <div className="avatar-placeholder">
      <FiUser size={40} color="#5033A2" />
    </div>
  )}
  <p className="user-name">{user.name}</p>
  <div className="avatar-actions">
    <label className="change-avatar">
      Change Avatar
      <input type="file" accept="image/*" onChange={handleAvatarChange} style={{ display: 'none' }} />
    </label>
    {user.avatar && (
      <button className="remove-avatar" onClick={handleRemoveAvatar}>
        Remove Avatar
      </button>
    )}
  </div>
</div>
<hr className="divider" />
      <nav className='navbar-dashboard'>
        <ul className="dashboard-menu">
          <li className='li-dashboard'>
            <Link className={`dashboard-link ${location.pathname === "/accountInfo" ? 'active' : ''}`} to="/accountInfo">
              <MdAccountCircle className='icon' />
              <span className='span-dash'>Account Info</span>
            </Link>
          </li>
          <li className='li-dashboard'>
            <Link to="/tickets" className={`dashboard-link ${location.pathname === "/tickets" ? 'active' : ''}`}>
              <HiOutlineTicket className='icon' />
              <span className='span-dash'>My Tickets</span>
            </Link>
          </li>
          <li className='li-dashboard'>
            <Link to="/privacy" className={`dashboard-link ${location.pathname === "/privacy" ? 'active' : ''}`}>
              <IoShieldCheckmarkSharp className='icon' />
              <span className='span-dash'>Privacy Policy</span>
            </Link>
          </li>
          <li className='li-dashboard'>
            <Link to="/termsCondition" className={`dashboard-link ${location.pathname === "/termsCondition" ? 'active' : ''}`}>
              <TiClipboard className='icon' />
              <span className='span-dash'>Terms & Conditions</span>
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default ProfileNav;
