import { Route, Routes, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import { getDoc, doc, collection } from 'firebase/firestore';
import { auth, db } from './firebase';
import './App.css';
import Login from './pages/Login';
import Signup from './pages/Signup';
import SeekerRecruiter from './components/SeekerRecruiter';
import SeekerForm from './components/SeekerForm';
import LandingPage from './pages/LandingPage';
import Home from './pages/Home';
import RecruiterForm from './components/RecruiterForm';
import Seeker from './components/Seeker';
import JobBoardPage from './pages/JobBoard';
import RecommendationsPage from './pages/RecommendationsPage';
import { Lan } from '@mui/icons-material';
import ConditionalRoute from './components/ConditionalRoute';
import Screening_Tests from './pages/Screening_Tests';

function App() {
  const [userRole, setUserRole] = useState(null);
  const user = useSelector((state) => state.userReducer);

  const fetchUserRole = async (userId) => {
    try {
      const userDocRef = doc(collection(db, 'users'), userId);
      const userDocSnapshot = await getDoc(userDocRef);
      if (userDocSnapshot.exists()) {
        const userData = userDocSnapshot.data();
        setUserRole(userData.role);
      } else {
        console.error('User document not found');
      }
    } catch (error) {
      console.error('Error fetching user role:', error.message);
    }
  };

  useEffect(() => {
    if (user.user !== null) {
      fetchUserRole(user.user.uid);
    } else {
      setUserRole(null); // Reset user role if user logs out
    }
  }, [user.user]);

    console.log(userRole)


  return (
    <Routes>
      <Route path="/" element={<ConditionalRoute user={user.user} userRole={userRole} />} />
      <Route path="/login" element={<Login />} />
      <Route path="/screening_test" element={<Screening_Tests />} />
      <Route path='/signup' element={<Signup />} />
      <Route path='/question' element={<SeekerRecruiter />} />
      <Route path='/seeker-form' element={<SeekerForm />} />
      <Route path='/recruiter-form' element={<RecruiterForm />} />
      <Route path='/job-board' element={<JobBoardPage />} />
      <Route path='/recommendations' element={<RecommendationsPage />} />
    </Routes>
  );
}

export default App;
