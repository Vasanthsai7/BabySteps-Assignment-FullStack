import React, { useState, useEffect } from "react";
import "./index.css"; // Import CSS
import { Spinner } from "react-bootstrap";

const Appointments = ({ socket }) => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAppointments = async () => {
    try {
      const response = await fetch(
        "https://babysteps-assignment-3bcn.onrender.com/appointments"
      );
      if (!response.ok) {
        throw new Error("Failed to fetch appointments");
      }
      const data = await response.json();
      setAppointments(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
    if (socket) {
      socket.on("appointmentBooked", fetchAppointments);
      return () => socket.off("appointmentBooked", fetchAppointments);
    }
  }, [socket]);

  // Handle deleting an appointment
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this appointment?"))
      return;

    try {
      const response = await fetch(
        `https://babysteps-assignment-3bcn.onrender.com/appointments/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete appointment");
      }

      fetchAppointments(); // Refresh appointments after deletion
    } catch (error) {
      console.error(error);
      alert("Error deleting appointment.");
    }
  };

  const handleEdit = async (id) => {
    const newPatientName = prompt("Enter new patient name:");
    if (!newPatientName) return;

    const newAppointmentType = prompt("Enter new Appointment Type:");
    if (!newAppointmentType) return;

    try {
      const response = await fetch(
        `https://babysteps-assignment-3bcn.onrender.com/appointments/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            patientName: newPatientName,
            appointmentType: newAppointmentType,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update appointment");
      }

      const updatedAppointment = await response.json();

      // Update UI immediately
      setAppointments((prevAppointments) =>
        prevAppointments.map((appt) =>
          appt._id === id ? updatedAppointment : appt
        )
      );
    } catch (error) {
      console.error(error);
      alert("Error updating appointment.");
    }
  };

  return (
    <div>
      {loading ? (
        <div className="spinner">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      ) : (
        <div className="appointments-container">
          <h2>My Appointments</h2>
          <ul className="appointment-list">
            {appointments.length > 0 ? (
              appointments.map((appt) => (
                <li key={appt._id} className="appointment-item">
                  <span>
                    {appt.patientName} - {appt.appointmentType} -{" "}
                    {new Date(appt.date).toLocaleString()}
                  </span>
                  <div className="appointment-buttons">
                    <button
                      className="edit-btn"
                      onClick={() => handleEdit(appt._id)}
                    >
                      Edit
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(appt._id)}
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))
            ) : (
              <p>No appointments found.</p>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Appointments;
