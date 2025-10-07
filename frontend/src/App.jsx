
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import SpecialRequestForm from './components/SpecialRequestForm'
import ScheduleViewer from './components/ScheduleViewer'
import Navbar from './components/Navbar'
import SpecialRequestViewer from './components/SpecialRequestViewer'
import CompostRequestForm from './components/CompostRequestForm'
import CompostRequestViewer from './components/CompostRequestViewer'
import Login from './pages/Login'
import AdminScheduleManager from "./admin/AdminScheduleManager"
import AdminDashboard from './admin/AdminDashboard'







function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/special-request" element={<SpecialRequestForm />} />
        {/* <Route path="/admin/special-requests" element={<SpecialRequestViewer />} /> */}
        <Route path="/schedule" element={<ScheduleViewer />} />
        <Route path="/compost-request" element={<CompostRequestForm />} />
        <Route path="/compost-requests" element={<CompostRequestViewer />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<AdminDashboard />}  />
        <Route path="/admin/schedules" element={<AdminScheduleManager />} /> 

        
        {/* Admin Routes */}
        <Route path="/admin" element={<AdminDashboard />}>
          {/* <Route path="schedules" element={<AdminScheduleManager />} /> */}
          <Route path="special-requests" element={<SpecialRequestViewer />} />
          <Route path="compost-requests" element={<CompostRequestViewer />} />
        </Route>
      



      </Routes>
    </Router>
  )
}

export default App

