import { Route, Routes } from 'react-router-dom';
import MyMenu from './components/MyMenu.jsx';
import Home from './pages/Home.jsx';
import Bookings from './pages/Bookings.jsx';
import SearchResult from './pages/SearchResult.jsx';

export default function App() {
    return (
        <>
            <MyMenu />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/hotels/:id" element={<Bookings />} />
                <Route path="/search/:searchedWord" element={<SearchResult />} />
                <Route path="*" element={<main className="page"><section className="panel"><h1>Page not found</h1></section></main>} />
            </Routes>
        </>
    );
}
