import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Spinner } from "react-bootstrap";
import "./index.css"; // Import CSS file

const DoctorList = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://babysteps-assignment-3bcn.onrender.com/doctors")
      .then((res) => res.json())
      .then((data) => {
        setDoctors(data);
        console.log(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching doctors:", error);
        setLoading(false);
      });
  }, []);

  return (
    <>
      {loading ? (
        <div className="spinner">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      ) : (
        <div className="container">
          <div className="doctor-list-container">
            <h1>Available Doctors</h1>
            <ul className="doctor-list">
              {doctors.map((doctor) => (
                <li key={doctor._id} className="doctor-item">
                  <Link to={`/doctors/${doctor._id}/schedule`}>
                    {doctor.name} - {doctor.specialization}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </>
  );
};

export default DoctorList;
