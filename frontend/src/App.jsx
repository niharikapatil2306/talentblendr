import { Route, Routes } from 'react-router-dom'
import './App.css'
import Login from './pages/Login'
import Signup from './pages/Signup'
import SeekerRecruiter from './components/SeekerRecruiter'
import SeekerForm from './components/SeekerForm'
import LandingPage from './pages/LandingPage'
import Home from './pages/Home'
import RecruiterForm from './components/RecruiterForm'
import Seeker from './components/Seeker'
import JobBoardPage from './pages/JobBoard'
import { auth } from './firebase'

function App() {
  return (
    <Routes>
      <Route path='/home' element={<Home />} />
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path='/signup' element={<Signup />} />
      <Route path='/question' element={<SeekerRecruiter />} />
      <Route path='/seeker-form' element={<SeekerForm />} />
      <Route path='/recruiter-form' element={<RecruiterForm />} />
      <Route path='/seeker' element={<Seeker />} />
      <Route path='/job-board' element={<JobBoardPage />} />
    </Routes>
  )
}

export default App
