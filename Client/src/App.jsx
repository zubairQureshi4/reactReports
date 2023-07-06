import './App.css'
import ProspectReport from './Pages/DoorSupervisorProspect/ProspectReport'
import {BrowserRouter as Router, Routes, Route, Link} from 'react-router-dom'
import RegisteredReport from './Pages/DoorSupervisorRegistered/RegisteredReport'

function App() {
  return (
    <>
    <Router>
    <Link to={'/prospect'}>Prospect report</Link><br/>
    <Link to={'/registered'}>Registered report</Link>
    <Routes>
      <Route path='/prospect' element={<ProspectReport/>}/>
      <Route path='/registered' element={<RegisteredReport/>}/>
    </Routes>
    </Router>
    </>
  )
}

export default App
