import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getBookingsByHotel } from '../api.js';

export default function Bookings() {
    const { id } = useParams();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        let active = true;
        setLoading(true);
        setError('');

        getBookingsByHotel(id)
            .then((data) => {
                if (active) {
                    setBookings(data);
                }
            })
            .catch(() => {
                if (active) {
                    setError('Could not load bookings. Is the API running?');
                }
            })
            .finally(() => {
                if (active) {
                    setLoading(false);
                }
            });

        return () => {
            active = false;
        };
    }, [id]);

    return (
        <main className="page">
            <section className="panel">
                <Link className="back-link" to="/">Back to hotels</Link>
                <h1>Bookings for hotel #{id}</h1>

                {loading && <p className="loading">Loading bookings...</p>}
                {error && <p className="error" role="alert">{error}</p>}
                {!loading && !error && bookings.length === 0 && (
                    <p className="empty">This hotel has no bookings yet.</p>
                )}

                {bookings.length > 0 && (
                    <div className="table-wrap">
                        <table>
                            <thead>
                                <tr>
                                    <th>Guest</th>
                                    <th>Check-in</th>
                                    <th>Check-out</th>
                                    <th>Adults</th>
                                    <th>Children</th>
                                    <th>Extra guests</th>
                                </tr>
                            </thead>
                            <tbody>
                                {bookings.map((booking) => (
                                    <tr key={`${booking.customer_email}-${booking.hotel_id}`}>
                                        <td>
                                            <span className="guest-cell">
                                                <img
                                                    src={booking.customer_image}
                                                    alt={`${booking.first_name} ${booking.last_name}`}
                                                />
                                                <span>
                                                    <strong>{booking.first_name} {booking.last_name}</strong>
                                                    <br />
                                                    <small>{booking.customer_email}</small>
                                                </span>
                                            </span>
                                        </td>
                                        <td>{booking.start_date}</td>
                                        <td>{booking.end_date}</td>
                                        <td>{booking.adults}</td>
                                        <td>{booking.children}</td>
                                        <td>{booking.boylovers}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>
        </main>
    );
}
