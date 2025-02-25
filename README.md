# BabySteps-Assignment-FullStack
# Doctor Appointment Booking System

## Project Description
The **Doctor Appointment Booking System** is a full-stack web application that allows patients to book appointments with doctors based on their availability. The system features:
- **Doctor Selection**: View available doctors and their specialties.
- **Calendar Slot View**: Check doctors' working hours and available slots.
- **Appointment Booking**: Book a slot with a selected doctor.
- **Appointment Management**: View, update, and cancel appointments.

## Table of Contents
1. [Installation](#installation)
2. [Usage](#usage)
3. [API Endpoints](#api-endpoints)
4. [Technologies Used](#technologies-used)
5. [Assumptions & Design Decisions](#assumptions--design-decisions)
6. [Credits](#credits)

## Installation

### Backend Setup
1. Navigate to the `Backend` directory:
   ```sh
   cd Backend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the server:
   ```sh
   node server.js
   ```
   The backend runs on `http://localhost:3001`

### Frontend Setup
1. Navigate to the `Frontend/doctorapp` directory:
   ```sh
   cd Frontend/doctorapp
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the frontend:
   ```sh
   npm start
   ```
   The frontend runs on `http://localhost:3000`

## Usage
- Open the application in your browser at `https://babysteps-assignment-fullstack-vasanth-sais-projects.vercel.app/`.
- Select a doctor and view available time slots.
- Book an appointment by filling in your details.
- View, update, or cancel your appointments from the **My Appointments** page.

## API Endpoints
### Doctors
- **Get all doctors**: `GET /doctors`
- **Get a doctor's schedule**: `GET /doctors/:id/slots?date=YYYY-MM-DD`

### Appointments
- **Get all appointments**: `GET /appointments`
- **Book an appointment**: `POST /appointments`
  ```json
  {
    "doctorId": "string",
    "date": "ISO 8601 format",
    "duration": 30,
    "appointmentType": "string",
    "patientName": "string",
    "notes": "string"
  }
  ```
- **Update an appointment**: `PUT /appointments/:id`
  ```json
  {
    "date": "ISO 8601 format",
    "duration": 30,
    "appointmentType": "string",
    "notes": "string"
  }
  ```
- **Delete an appointment**: `DELETE /appointments/:id`

## Technologies Used
- **Frontend**: React.js, React Router, Bootstrap
- **Backend**: Node.js, Express.js, MongoDB

## Assumptions & Design Decisions
- Each appointment has a fixed duration of 30 minutes.
- Appointments are stored in MongoDB.
- The backend validates slot availability before booking.
- The system allows multiple appointments per day but prevents overlapping bookings.

## Credits
Developed by Veeramreddy Vasanth Sai Reddy



