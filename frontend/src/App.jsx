import { Route, Routes } from 'react-router-dom'
import './App.css'
import Login from './pages/Login'
import Signup from './pages/Signup'
import SeekerRecruiter from './components/SeekerRecruiter'
import SeekerForm from './components/SeekerForm'
import LandingPage from './pages/LandingPage'
import Home from './pages/Home'
import RecruiterForm from './components/RecruiterForm'
import Seeker from './pages/Seeker'
import JobBoardPage from './pages/JobBoard'
import { useSelector } from "react-redux";
import RecommendationsPage from './pages/RecommendationsPage'

function App() {

  const user = useSelector(state => state.userReducer);

  return (

    <Routes>
      <Route path="/" element={ (user.user === null)? (<LandingPage />) : (<Home />) } />
      <Route path="/login" element={<Login />} />
      <Route path='/signup' element={<Signup />} />
      <Route path='/question' element={<SeekerRecruiter />} />
      <Route path='/seeker-form' element={<SeekerForm />} />
      <Route path='/recruiter-form' element={<RecruiterForm />} />
      <Route path='/seeker' element={<Seeker />} />
      <Route path='/job-board' element={<JobBoardPage />} />
      <Route path='/recommendations' element={<RecommendationsPage />} />
    </Routes>

  )
}

export default App
