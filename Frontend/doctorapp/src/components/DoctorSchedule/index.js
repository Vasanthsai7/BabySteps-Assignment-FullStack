import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Spinner } from "react-bootstrap";
import "./index.css"; // Import CSS file

const DoctorSchedule = () => {
  const { id: doctorId } = useParams();
  const [slots, setSlots] = useState([]);
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(false); // Start with false

  const fetchSlots = async () => {
    if (!date) {
      alert("Please select a date!");
      return;
    }

    setLoading(true); // Show spinner while fetching

    try {
      const response = await fetch(
        `https://babysteps-assignment-3bcn.onrender.com/doctors/${doctorId}/slots?date=${date}`
      );
      const data = await response.json();
      setSlots(data.availableSlots || []);
    } catch (error) {
      console.error("Error fetching slots:", error);
      setSlots([]);
    } finally {
      setLoading(false); // Stop loading when done
    }
  };

  return (
    <div>
      {/* Slots List */}
      {loading ? (
        <div className="spinner">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      ) : (
        <div className="schedule-container">
          <h2>Available Slots</h2>

          {/* Date Picker */}
          <input
            type="date"
            className="date-picker"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            disabled={loading} // Disable when loading
          />

          {/* Fetch Slots Button */}
          <button
            className="check-slots-btn"
            onClick={fetchSlots}
            disabled={loading}
          >
            {loading ? <Spinner animation="border" size="sm" /> : "Check Slots"}
          </button>

          {/* Slots List */}

          <ul className="slot-list">
            {slots.length > 0 ? (
              slots.map((slot, index) => (
                <li key={index} className="slot-item">
                  <p>{slot}</p>
                  <Link
                    to={`/book/${doctorId}/${encodeURIComponent(slot)}?date=${date}`}
                  >
                    Book
                  </Link>
                </li>
              ))
            ) : (
              <p>No slots available for this date.</p>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default DoctorSchedule;
