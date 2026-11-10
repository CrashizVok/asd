import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getHotels } from '../api.js';

function Stars({ count }) {
    const filled = Number(count) || 0;

    return (
        <p className="stars" aria-label={`${filled} out of 5 stars`}>
            {Array.from({ length: 5 }, (_, index) => (
                <span key={index} aria-hidden="true">{index < filled ? '★' : '☆'}</span>
            ))}
        </p>
    );
}

function OwnerModal({ hotel, onClose }) {
    useEffect(() => {
        function handleKey(event) {
            if (event.key === 'Escape') {
                onClose();
            }
        }
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [onClose]);

    if (!hotel) {
        return null;
    }

    return (
        <div className="modal-overlay" onClick={onClose} role="presentation">
            <div
                className="modal"
                role="dialog"
                aria-modal="true"
                aria-label="Hotel owner"
                onClick={(event) => event.stopPropagation()}
            >
                <button type="button" className="modal-close" onClick={onClose} aria-label="Close">
                    ×
                </button>
                <img
                    src={hotel.owner_image}
                    alt={`${hotel.first_name} ${hotel.last_name}`}
                />
                <h2>{hotel.first_name} {hotel.last_name}</h2>
                <p className="muted">{hotel.owner_email}</p>
                <p className="muted">Owner of {hotel.name}</p>
            </div>
        </div>
    );
}

export default function Home() {
    const navigate = useNavigate();
    const [hotels, setHotels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [ownerHotel, setOwnerHotel] = useState(null);

    useEffect(() => {
        let active = true;
        setLoading(true);

        getHotels()
            .then((data) => {
                if (active) {
                    setHotels(data);
                    setError('');
                }
            })
            .catch(() => {
                if (active) {
                    setError('Could not load hotels. Is the API running?');
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
    }, []);

    return (
        <main className="page">
            <section className="panel">
                <h1>Hotels</h1>
                <p className="lead">Pick a hotel to see its bookings.</p>

                {loading && <p className="loading">Loading hotels...</p>}
                {error && <p className="error" role="alert">{error}</p>}
                {!loading && !error && hotels.length === 0 && (
                    <p className="empty">No hotels in the database.</p>
                )}

                <div className="card-grid">
                    {hotels.map((hotel) => (
                        <article
                            key={hotel.id}
                            className="card"
                            role="button"
                            tabIndex={0}
                            onClick={() => navigate(`/hotels/${hotel.id}`)}
                            onKeyDown={(event) => {
                                if (event.target !== event.currentTarget) {
                                    return;
                                }
                                if (event.key === 'Enter' || event.key === ' ') {
                                    event.preventDefault();
                                    navigate(`/hotels/${hotel.id}`);
                                }
                            }}
                        >
                            <img className="card-image" src={hotel.hotel_image} alt={hotel.name} />
                            <div className="card-body">
                                <h2>{hotel.name}</h2>
                                <p className="muted">{hotel.city}</p>
                                <Stars count={hotel.stars} />
                                <p className="description">{hotel.description}</p>
                                <button
                                    type="button"
                                    className="owner-button"
                                    onClick={(event) => {
                                        event.stopPropagation();
                                        setOwnerHotel(hotel);
                                    }}
                                >
                                    Owner: {hotel.first_name} {hotel.last_name}
                                </button>
                            </div>
                        </article>
                    ))}
                </div>
            </section>

            <OwnerModal hotel={ownerHotel} onClose={() => setOwnerHotel(null)} />
        </main>
    );
}
