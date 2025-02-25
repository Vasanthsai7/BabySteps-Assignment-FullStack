import React, { useState } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom"; // ✅ Import useNavigate
import { Button } from "@mui/material";
import "./index.css"; // Import CSS
import { Spinner } from "react-bootstrap";

const AppointmentForm = ({ socket }) => {
  const { doctorId, slot } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const selectedDate = searchParams.get("date");

  const [patientName, setPatientName] = useState("");
  const [appointmentType, setAppointmentType] = useState("");
  const [duration, setDuration] = useState(30);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  const getFormattedDateTime = () => {
    if (!selectedDate || !slot) return null;
    const formattedDate = new Date(`${selectedDate} ${slot}`);
    return isNaN(formattedDate.getTime()) ? null : formattedDate.toISOString();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formattedDate = getFormattedDateTime();
    if (!formattedDate) {
      alert("Invalid date or time format. Please select a valid slot.");
      return;
    }

    const appointmentData = {
      doctorId,
      date: formattedDate,
      duration: Number(duration),
      appointmentType,
      patientName,
      notes,
    };

    setLoading(true);

    try {
      const response = await fetch(
        "https://babysteps-assignment-3bcn.onrender.com/appointments",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(appointmentData),
        }
      );

      if (!response.ok) throw new Error("Failed to book appointment");

      if (socket) socket.emit("appointmentBooked");

      alert("Appointment booked successfully!");
      navigate("/appointments"); // Redirect to appointments page
    } catch (error) {
      console.error(error);
      alert("Failed to book appointment. Please try again.");
    } finally {
      setLoading(false);
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
        <div className="doctor-list-container">
          <form className="appointment-form" onSubmit={handleSubmit}>
            <h2 className="form-heading">Book Appointment</h2>
            <p className="slot-info">
              Time Slot: {slot} on {selectedDate}
            </p>

            <label className="form-label">Patient Name:</label>
            <input
              type="text"
              className="form-input"
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
              required
            />

            <label className="form-label">Appointment Type:</label>
            <input
              type="text"
              className="form-input"
              value={appointmentType}
              onChange={(e) => setAppointmentType(e.target.value)}
              required
            />

            <label className="form-label">Duration (minutes):</label>
            <input
              type="number"
              className="form-input"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              min="15"
              step="15"
              required
            />

            <label className="form-label">Notes (Optional):</label>
            <textarea
              className="form-textarea"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
            <Button type="submit" className="form-button" variant="contained">
              Book Appointment
            </Button>
          </form>
        </div>
      )}
    </div>
  );
};

export default AppointmentForm;
