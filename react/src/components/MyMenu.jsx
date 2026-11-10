import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaHome, FaSearch } from 'react-icons/fa';

/**
 * Fixed top bar with a Home button and a search field.
 * Search starts only when the trimmed word has at least 3 characters.
 */
export default function MyMenu() {
    const navigate = useNavigate();
    const [word, setWord] = useState('');
    const [error, setError] = useState('');

    function handleSubmit(event) {
        event.preventDefault();
        const trimmed = word.trim();

        if (trimmed.length < 3) {
            setError('Type at least 3 characters.');
            return;
        }

        setError('');
        navigate(`/search/${encodeURIComponent(trimmed)}`);
    }

    return (
        <header className="navbar">
            <button
                type="button"
                className="home-button"
                onClick={() => navigate('/')}
                aria-label="Go to the home page"
            >
                <FaHome />
                <span>Home</span>
            </button>

            <form className="search-form" onSubmit={handleSubmit} role="search">
                <input
                    type="search"
                    value={word}
                    onChange={(event) => {
                        setWord(event.target.value);
                        setError('');
                    }}
                    placeholder="Search hotels or guests"
                    aria-label="Search hotels or guests"
                />
                <button type="submit" aria-label="Search">
                    <FaSearch />
                </button>
            </form>

            {error && <p className="navbar-error" role="status">{error}</p>}
        </header>
    );
}
