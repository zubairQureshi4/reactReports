import './App.css'
import ProspectReport from './Pages/DoorSupervisorProspect/ProspectReport'
import {BrowserRouter as Router, Routes, Route, Link} from 'react-router-dom'
import RegisteredReport from './Pages/DoorSupervisorRegistered/RegisteredReport'
import Audit from './Pages/AuditReport/Audit'
import { Navbar, Nav } from 'react-bootstrap';


function App() {
  return (
    <>
    <Router>
    <Navbar className='background_color' expand="lg" variant="dark">
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <Nav.Link as={Link} to="/prospect" activeClassName="active">Prospect report</Nav.Link>
            <Nav.Link as={Link} to="/registered" activeClassName="active">Registered report</Nav.Link>
            <Nav.Link as={Link} to="/audit" activeClassName="active">Audit report</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    <Routes>
      <Route path='/prospect' element={<ProspectReport/>}/>
      <Route path='/registered' element={<RegisteredReport/>}/>
      <Route path='/audit' element={<Audit/>}/>
    </Routes>
    </Router>
    </>
  )
}

export default App
