import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";

import DoctorList from "./components/DoctorList";
import DoctorSchedule from "./components/DoctorSchedule";
import AppointmentForm from "./components/AppointmentForm";
import Appointments from "./components/Appointments";
import NotFound from "./components/NotFound";

import "./App.css"; // Import CSS

const App = () => {
  return (
    <Router>
      <div>
        <Navbar className="bg-body-tertiary" bg="dark" data-bs-theme="dark">
          <Container>
            <Navbar.Brand href="/">
              <img
                alt="logo"
                src="https://res.cloudinary.com/duajungih/image/upload/v1740327602/switzerland-flag-heart-banner_xwojav.jpg"
                width="30"
                height="30"
                className="d-inline-block align-top"
              />{" "}
              Doctor Appointment
            </Navbar.Brand>
            <Navbar.Toggle />
            <Navbar.Collapse className="justify-content-end">
              <Nav className="">
                <Nav.Link href="/">Home</Nav.Link>
                <Nav.Link href="/appointments">My Appointments</Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>

        <div className="content"></div>
        <Routes>
          <Route path="/" element={<DoctorList />} />
          <Route path="/doctors/:id/schedule" element={<DoctorSchedule />} />
          <Route path="/book/:doctorId/:slot" element={<AppointmentForm />} />
          <Route path="/appointments" element={<Appointments />} />
          <Route path="/bad-path" element={<NotFound />} />
          <Route path="*" element={<Navigate to="/bad-path" />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
