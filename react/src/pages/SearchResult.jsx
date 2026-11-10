import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { searchBookings } from '../api.js';

export default function SearchResult() {
    const { searchedWord } = useParams();
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        let active = true;
        setLoading(true);
        setError('');

        searchBookings(searchedWord)
            .then((data) => {
                if (active) {
                    setResults(data);
                }
            })
            .catch(() => {
                if (active) {
                    setError('Could not run the search. Is the API running?');
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
    }, [searchedWord]);

    return (
        <main className="page">
            <section className="panel">
                <Link className="back-link" to="/">Back to hotels</Link>
                <h1>Search results</h1>
                <p className="lead">Word: {searchedWord}</p>

                {loading && <p className="loading">Searching...</p>}
                {error && <p className="error" role="alert">{error}</p>}
                {!loading && !error && results.length === 0 && (
                    <p className="empty">No results for {searchedWord}.</p>
                )}

                <div className="result-list">
                    {results.map((result) => (
                        <article
                            className="result-card"
                            key={`${result.customer_email}-${result.hotel_id}`}
                        >
                            <img
                                src={result.customer_image}
                                alt={`${result.first_name} ${result.last_name}`}
                            />
                            <div className="result-body">
                                <h2>{result.name}</h2>
                                <p className="result-meta">
                                    {result.first_name} {result.last_name}
                                    {' | '}
                                    {result.start_date} to {result.end_date}
                                </p>
                                <p className="result-meta">
                                    {result.adults} adults, {result.children} children,
                                    {' '}{result.boylovers} extra guests
                                </p>
                            </div>
                            <Link className="result-link" to={`/hotels/${result.hotel_id}`}>
                                Open hotel
                            </Link>
                        </article>
                    ))}
                </div>
            </section>
        </main>
    );
}
