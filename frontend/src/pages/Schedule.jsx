import React, { useEffect, useState } from 'react';
import api from '../api/client';

const Schedule = () => {
    const [appointments, setAppointments] = useState([]);

    useEffect(() => {
        // Ensure this endpoint matches your urls.py path (e.g., 'appointments/')
        api.get('/appointments/')
            .then(res => {
                console.log("Schedule data:", res.data);
                setAppointments(res.data);
            })
            .catch(err => console.error("Error fetching schedule:", err));
    }, []);

    return (
        <div>
            <h2>Appointment Schedule</h2>
            {appointments.length === 0 ? (
                <p>No appointments found. Add some in the Admin panel!</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Patient</th>
                            <th>Doctor</th>
                        </tr>
                    </thead>
                    // In Schedule.jsx
                    <tbody>
                        {appointments.map((app) => (
                            <tr key={app.id}>
                                <td>{app.day} {app.start_time}</td> {/* Updated to match serializer */}
                                <td>{app.patient_name}</td>
                                <td>{app.doctor_name}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default Schedule;