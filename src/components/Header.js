import React, { useEffect } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import './Header.css';
import { useAuth } from 'contexts/authContext';
import { auth } from 'components/firebase/firebase';
import { useNavigate } from 'react-router-dom'; // Importa useNavigate

const Header = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate(); // Instancia useNavigate

  useEffect(() => {
    const fetchHelloMessage = async () => {
      if (currentUser) {
        const token = await auth.currentUser.getIdToken(true);
        console.log("Token:", token); // Agrega esto para verificar el token en la consola
        const response = await fetch('http://localhost:5000/hello', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
  
        if (!response.ok) {
          console.error('HTTP status:', response.status);
        } else {
          const data = await response.json();
          console.log(data.message);
        }
      }
    };
  
    fetchHelloMessage();
  }, [currentUser]);
  

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate('/'); // Redirige a la página principal después de logout
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  return (
    <div className="header">
      <div>My Dashboard</div>
      <div className="header-right">
        <FaUserCircle size={24} />
        {currentUser ? (
          <span className="user-name">Welcome, {currentUser.displayName || currentUser.email}!</span>
        ) : (
          <span className="user-name">Not logged in</span>
        )}
        <button className="logout-button" onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
};

export default Header;
