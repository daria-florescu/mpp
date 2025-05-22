import React, { useState, useEffect } from 'react';
import './App.css';
import BookList from './components/BookList';
import BookDetail from './components/BookDetail';
import BookForm from './components/BookForm';
import useNetworkStatus from './hooks/useNetworkStatus';
import { syncQueuedOperations, queueOperation } from './utils/offlineQueue';
import { Client } from '@stomp/stompjs';
import FileUploader from './components/FileUploader';

// Use environment variables with fallbacks for local development
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api/books';
const API_TAGS_URL = process.env.REACT_APP_API_TAGS_URL || 'http://localhost:8080/api/tags';
const WEBSOCKET_URL = process.env.REACT_APP_WEBSOCKET_URL || 'ws://localhost:8080/book-websocket';

function App() {
    const [books, setBooks] = useState([]);
    const [selectedBook, setSelectedBook] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isAdding, setIsAdding] = useState(false);
    const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'ascending' });
    const [filterConfig, setFilterConfig] = useState({ searchTerm: '', genre: 'all', favorite: 'all' });
    const [genres, setGenres] = useState(['all']);
    const [tags, setTags] = useState(['all']);
    const [tagFilter, setTagFilter] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const status = useNetworkStatus(syncQueuedOperations);

    const fetchBooks = async () => {
        try {
            setIsLoading(true);
            const queryParams = new URLSearchParams({
                searchTerm: filterConfig.searchTerm,
                genre: filterConfig.genre,
                favorite: filterConfig.favorite,
                sortBy: sortConfig.key,
                direction: sortConfig.direction
            });

            tagFilter.forEach(tag => queryParams.append("tags", tag));

            const response = await fetch(`${API_BASE_URL}?${queryParams}`);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            setBooks(data);
            setError(null);
        } catch (err) {
            setError('Failed to fetch books. Please try again later.');
            console.error('Error fetching books:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchGenres = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/genres`);

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            setGenres(data);
        } catch (err) {
            console.error('Error fetching genres:', err);
        }
    };

    const fetchTags = async () => {
        try {
            const response = await fetch(API_TAGS_URL);
            const data = await response.json();
            setTags(data);
        } catch (err) {
            console.error('Error fetching tags:', err);
        }
    };

    useEffect(() => {
        fetchGenres();
        fetchTags();
        fetchBooks();
    }, []);

    useEffect(() => {
        fetchBooks();
    }, [filterConfig, sortConfig, tagFilter]);

    useEffect(() => {
        const stompClient = new Client({
            brokerURL: WEBSOCKET_URL,
            connectHeaders: {},
            debug: (str) => console.log(str),
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
        });

        stompClient.onConnect = (frame) => {
            console.log('Connected to WebSocket');
            stompClient.subscribe('/topic/newBook', (message) => {
                const newBook = JSON.parse(message.body);
                setBooks((prevBooks) => [...prevBooks, newBook]);
            });
        };

        stompClient.onStompError = (frame) => {
            console.error('Broker reported error: ' + frame.headers['message']);
        };

        stompClient.activate();

        return () => {
            stompClient.deactivate();
        };
    }, [setBooks]);

    const addBook = async (newBook) => {
        try {
            const response = await fetch(API_BASE_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newBook),
            });

            if (!response.ok) throw new Error('Request failed');

            const savedBook = await response.json();
            setBooks([...books, savedBook]);
            setIsAdding(false);
            fetchBooks();
            fetchGenres();
        } catch (err) {
            queueOperation({ url: API_BASE_URL, method: 'POST', body: newBook });
            setIsAdding(false);
            alert('You are offline. Book will be saved once connection is restored.');
        }
    };

    const updateBook = async (updatedBook) => {
        try {
            const response = await fetch(`${API_BASE_URL}/${updatedBook.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedBook),
            });

            if (!response.ok) throw new Error('Request failed');

            const savedBook = await response.json();
            setSelectedBook(savedBook);
            setIsEditing(false);
            fetchBooks();
            fetchGenres();
        } catch (err) {
            queueOperation({ url: `${API_BASE_URL}/${updatedBook.id}`, method: 'PATCH', body: updatedBook });
            setIsEditing(false);
            alert('You are offline. Changes will be saved when online.');
        }
    };

    const deleteBook = async (id) => {
        try {
            const response = await fetch(`${API_BASE_URL}/${id}`, { method: 'DELETE' });

            if (!response.ok) throw new Error('Request failed');

            setSelectedBook(null);
            fetchBooks();
            fetchGenres();
        } catch (err) {
            queueOperation({ url: `${API_BASE_URL}/${id}`, method: 'DELETE', body: null });
            setSelectedBook(null);
            alert('You are offline. Deletion will complete when back online.');
        }
    };

    const handleSort = (key) => {
        const direction = sortConfig.key === key && sortConfig.direction === 'ascending' ? 'descending' : 'ascending';
        setSortConfig({ key, direction });
    };

    const handleSearch = (e) => {
        setFilterConfig({ ...filterConfig, searchTerm: e.target.value });
    };

    const handleGenreFilter = (genre) => {
        setFilterConfig({ ...filterConfig, genre });
    };

    const handleFavoriteFilter = (favorite) => {
        setFilterConfig({ ...filterConfig, favorite });
    };

    useEffect(() => {
        const handleClickOutside = (e) => {
            const dropdown = document.getElementById('tag-dropdown');
            if (dropdown && !dropdown.contains(e.target) && !e.target.closest('.dropdown-toggle')) {
                dropdown.classList.remove('show');
            }
        };
        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    return (
        <div className="app-container">
            <header className="app-header">
                <h1>Book Collection Manager</h1>
            </header>

            {status !== 'online' && (
                <div className={`status-banner ${status}`}>
                    {status === 'offline' && 'You are offline. Changes will sync when back online.'}
                    {status === 'server-down' && 'Server is down. Some features may not work.'}
                </div>
            )}

            {error && <div className="error-banner">{error}</div>}

            <section className="filters-section">
                <div className="search-bar">
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Search by title or author..."
                        value={filterConfig.searchTerm}
                        onChange={handleSearch}
                    />
                    <button className="search-button">🔍</button>
                </div>

                <div className="filter-controls">
                    <div className="filter-group">
                        <label>Genre:</label>
                        <select value={filterConfig.genre} onChange={(e) => handleGenreFilter(e.target.value)}>
                            {genres.map(genre => (
                                <option key={genre} value={genre}>
                                    {genre === 'all' ? 'All Genres' : genre}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="filter-group">
                        <label>Favorites:</label>
                        <select value={filterConfig.favorite} onChange={(e) => handleFavoriteFilter(e.target.value)}>
                            <option value="all">All Books</option>
                            <option value="favorite">Favorites Only</option>
                            <option value="not-favorite">Non-Favorites</option>
                        </select>
                    </div>

                    <div className="filter-group tags-filter">
                        <label>Tags:</label>
                        <div className="dropdown-multiselect">
                            <button
                                className="dropdown-toggle"
                                onClick={(e) => {
                                    e.preventDefault();
                                    document.getElementById('tag-dropdown').classList.toggle('show');
                                }}
                            >
                                {tagFilter.length > 0 ? tagFilter.join(', ') : 'All Tags'}
                            </button>
                            <div id="tag-dropdown" className="dropdown-menu">
                                {tags.map(tag => (
                                    <label key={tag.id} className="dropdown-item">
                                        <input
                                            type="checkbox"
                                            value={tag.name}
                                            checked={tagFilter.includes(tag.name)}
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                setTagFilter(prev =>
                                                    e.target.checked
                                                        ? [...prev, value]
                                                        : prev.filter(tag => tag !== value)
                                                );
                                            }}
                                        />
                                        {tag.name}
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <div className="main-content">
                <section className="master-section">
                    <div className="section-header">
                        <h2>Books ({books.length})</h2>
                        <button className="add-button" onClick={() => {
                            setIsAdding(true);
                            setSelectedBook(null);
                            setIsEditing(false);
                        }}>
                            Add New Book
                        </button>
                    </div>

                    {isLoading ? (
                        <div className="loading-spinner">Loading books...</div>
                    ) : (
                        <BookList
                            books={books}
                            onSelectBook={setSelectedBook}
                            onSort={handleSort}
                            sortConfig={sortConfig}
                        />
                    )}
                </section>

                <section className="detail-section">
                    {isAdding ? (
                        <BookForm onSave={addBook} onCancel={() => setIsAdding(false)} />
                    ) : isEditing && selectedBook ? (
                        <BookForm book={selectedBook} onSave={updateBook} onCancel={() => setIsEditing(false)} />
                    ) : selectedBook ? (
                        <BookDetail
                            book={selectedBook}
                            onEdit={() => setIsEditing(true)}
                            onDelete={() => {
                                if (window.confirm('Are you sure you want to delete this book?')) {
                                    deleteBook(selectedBook.id);
                                }
                            }}
                        />
                    ) : (
                        <div className="no-selection">
                            <p>Select a book from the list or add a new one</p>
                        </div>
                    )}
                </section>
            </div>

            <section className="upload-section">
                <FileUploader />
            </section>
        </div>
    );
}

export default App;
