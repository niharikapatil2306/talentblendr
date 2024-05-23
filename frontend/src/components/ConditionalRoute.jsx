import React from 'react';
import { Navigate } from 'react-router-dom';
import LandingPage from '../pages/LandingPage';
import Home from '../pages/Home';
import Seeker from '../pages/Seeker';

const ConditionalRoute = ({ user, userRole }) => {
  if (user === null) {
    return <LandingPage />;
  }

  if (userRole === 'seeker') {
    return <Seeker />;
  }

  return <Home />;
};

export default ConditionalRoute;
