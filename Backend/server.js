const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const moment = require("moment");

const app = express();

app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose
  .connect(
    "mongodb+srv://vasanthsaireddyveeramreddy:Vasanth7@cluster0.pcxjx.mongodb.net/Node-API?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => console.log("Connected to Database"))
  .catch((err) => {
    console.error("Database connection error:", err.message);
    process.exit(1);
  });

// Doctor Schema
const DoctorSchema = new mongoose.Schema({
  name: String,
  specialization: String,
  workingHours: { start: String, end: String },
});
const Doctor = mongoose.model("Doctor", DoctorSchema);

// Appointment Schema
const AppointmentSchema = new mongoose.Schema({
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor" },
  date: String,
  time: String,
  patientName: String,
  appointmentType: String,
  notes: String,
});
const Appointment = mongoose.model("Appointment", AppointmentSchema);

// Get all doctors
app.get("/doctors", async (req, res) => {
  try {
    const doctors = await Doctor.find();
    res.json(doctors);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get available slots for a doctor
app.get("/doctors/:id/slots", async (req, res) => {
  try {
    const { id } = req.params;
    const { date } = req.query;

    const doctor = await Doctor.findById(id);
    if (!doctor) return res.status(404).json({ error: "Doctor not found" });

    let startTime = moment(doctor.workingHours.start, "hh:mm A");
    let endTime = moment(doctor.workingHours.end, "hh:mm A");
    let slots = [];

    while (startTime < endTime) {
      slots.push(startTime.format("hh:mm A"));
      startTime.add(30, "minutes"); // 30-minute intervals
    }

    // Filter out booked slots
    const bookedAppointments = await Appointment.find({ doctorId: id, date });
    const bookedTimes = bookedAppointments.map((appt) => appt.time);
    slots = slots.filter((slot) => !bookedTimes.includes(slot));

    res.json({ availableSlots: slots });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Book an appointment
app.post("/appointments", async (req, res) => {
  try {
    const { doctorId, date, duration, appointmentType, patientName, notes } =
      req.body;

    // Validate required fields
    if (!doctorId || !date || !patientName || !appointmentType) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Check if the appointment slot is already booked
    const existingAppointment = await Appointment.findOne({ doctorId, date });
    if (existingAppointment) {
      return res.status(400).json({ error: "Time slot already booked" });
    }

    // Create and save the new appointment
    const newAppointment = new Appointment({
      doctorId,
      date,
      duration,
      appointmentType,
      patientName,
      notes,
    });

    await newAppointment.save();

    // Emit real-time update

    res.status(201).json(newAppointment);
  } catch (error) {
    console.error("Error booking appointment:", error);
    res.status(500).json({ error: error.message });
  }
});

// Get all appointments
app.get("/appointments", async (req, res) => {
  try {
    const appointments = await Appointment.find().populate(
      "doctorId",
      "name specialization appointmentType"
    );
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update an appointment
app.put("/appointments/:id", async (req, res) => {
  try {
    const { doctorId, date, time, patientName, appointmentType } = req.body;
    const appointmentId = req.params.id;

    // Check if appointment exists
    const existingAppointment = await Appointment.findById(appointmentId);
    if (!existingAppointment) {
      return res.status(404).json({ error: "Appointment not found" });
    }

    // Check if the new time slot is already booked (if time is being changed)
    if (date && time) {
      const conflictingAppointment = await Appointment.findOne({
        doctorId,
        date,
        time,
        _id: { $ne: appointmentId }, // Exclude the current appointment
      });

      if (conflictingAppointment) {
        return res.status(400).json({ error: "Time slot is already booked" });
      }
    }

    // Update the appointment with new values
    const updatedAppointment = await Appointment.findByIdAndUpdate(
      appointmentId,
      { doctorId, date, time, patientName, appointmentType }, // Include missing fields
      { new: true } // Return updated document
    );

    res.json(updatedAppointment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete an appointment
app.delete("/appointments/:id", async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndDelete(req.params.id);
    if (!appointment)
      return res.status(404).json({ error: "Appointment not found" });

    res.json({ message: "Appointment cancelled" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start Server
app.listen(3001, () => console.log("Server running on port 3001"));
