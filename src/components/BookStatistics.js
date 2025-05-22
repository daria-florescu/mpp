import React from 'react';

function BookStatistics({ books }) {
    // Calculate statistics
    const calculateStatistics = () => {
        if (books.length === 0) return null;

        // Pages statistics
        const pageStats = {
            min: Math.min(...books.map(book => book.pages)),
            max: Math.max(...books.map(book => book.pages)),
            avg: Math.round(books.reduce((sum, book) => sum + book.pages, 0) / books.length)
        };

        // Rating statistics
        const ratingStats = {
            min: Math.min(...books.map(book => book.rating)),
            max: Math.max(...books.map(book => book.rating)),
            avg: Number(books.reduce((sum, book) => sum + book.rating, 0) / books.length).toFixed(1)
        };

        // Publication year statistics
        const yearStats = {
            oldest: Math.min(...books.map(book => book.year)),
            newest: Math.max(...books.map(book => book.year)),
            avgPublicationYear: Math.round(books.reduce((sum, book) => sum + book.year, 0) / books.length)
        };

        // Genre distribution
        const genreDistribution = books.reduce((acc, book) => {
            acc[book.genre] = (acc[book.genre] || 0) + 1;
            return acc;
        }, {});

        return { pageStats, ratingStats, yearStats, genreDistribution };
    };

    const stats = calculateStatistics();

    if (!stats) return null;

    return (
        <div className="book-statistics">
            <h3>Book Collection Statistics</h3>
            <div className="stats-grid">
                <div className="stat-card">
                    <h4>Pages</h4>
                    <p>Min: {stats.pageStats.min}</p>
                    <p>Max: {stats.pageStats.max}</p>
                    <p>Average: {stats.pageStats.avg}</p>
                </div>
                <div className="stat-card">
                    <h4>Ratings</h4>
                    <p>Min: {stats.ratingStats.min}</p>
                    <p>Max: {stats.ratingStats.max}</p>
                    <p>Average: {stats.ratingStats.avg}</p>
                </div>
                <div className="stat-card">
                    <h4>Publication Years</h4>
                    <p>Oldest: {stats.yearStats.oldest}</p>
                    <p>Newest: {stats.yearStats.newest}</p>
                    <p>Average: {stats.yearStats.avgPublicationYear}</p>
                </div>
                <div className="stat-card">
                    <h4>Genre Distribution</h4>
                    {Object.entries(stats.genreDistribution).map(([genre, count]) => (
                        <p key={genre}>{genre}: {count}</p>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default BookStatistics;