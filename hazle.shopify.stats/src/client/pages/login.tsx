import React from 'react';
import { Card, Col, Container, Row} from 'react-bootstrap';
import { msalInstance } from '../authConfig';
import HeroBanner from '../components/hero-banner';
import { Link } from 'react-router-dom';

interface LoginProps {
  onLogin: (userId: string, userName: string,  sessionToken: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {

  const heroBannerContent = `
  <h5>Spyshark</h5>
  <h1>Best tool for your online stores</h1>
  <p>Welcome to Hazle, the launchpad for unique
   web apps, striking websites, and bespoke designs.
    We transform ideas into digital masterpieces, 
    ensuring your brand soars above the rest.
  </p>
  `

  const handleLogin = async () => {
    try {
      const response = await msalInstance.loginPopup({
        ...loginRequest,
        loginHint: "login",
      });

      const user = response.account;

      if (user) {
        const userId = user.localAccountId;
        const userName = user.name!;
        const sessionToken = response.idToken;

        localStorage.setItem('userId', userId);
        localStorage.setItem('userName', userName);
        localStorage.setItem('sessionToken', sessionToken);

        onLogin(userId, userName, sessionToken);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const loginRequest = {
    scopes: ['openid', 'profile']
  };

  return (
    <div className='content-container'>
     <div className="rich-text">
      <h4>Spyshark.io</h4>
      <h1>Best tool for spying online stores</h1>
      <p>Are you intrested? Make a free account clicking link below!</p>
     </div>
      <button className="primary-btn sign-in" onClick={handleLogin}>Sign in</button>
    </div>
  );
};

export default Login;