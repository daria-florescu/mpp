import React from 'react';

function BookList({ books, onSelectBook, onSort, sortConfig }) {
    // Helper function to determine the sort indicator for column headers
    const getSortIndicator = (key) => {
        if (sortConfig.key === key) {
            return sortConfig.direction === 'ascending' ? ' ▲' : ' ▼';
        }
        return '';
    };

    return (
        <div className="book-list">
            <table>
                <thead>
                <tr>
                    <th onClick={() => onSort('title')}>
                        Title{getSortIndicator('title')}
                    </th>
                    <th onClick={() => onSort('author')}>
                        Author{getSortIndicator('author')}
                    </th>
                    <th onClick={() => onSort('genre')}>
                        Genre{getSortIndicator('genre')}
                    </th>
                    <th onClick={() => onSort('year')}>
                        Year{getSortIndicator('year')}
                    </th>
                    <th onClick={() => onSort('rating')}>
                        Rating{getSortIndicator('rating')}
                    </th>
                    <th>Tags</th>
                    <th>Favorite</th>
                </tr>
                </thead>
                <tbody>
                {books.length > 0 ? (
                    books.map(book => (
                        <tr
                            key={book.id}
                            onClick={() => onSelectBook(book)}
                            className="book-row"
                        >
                            <td>{book.title}</td>
                            <td>{book.author}</td>
                            <td>{book.genre}</td>
                            <td>{book.year}</td>
                            <td>{book.rating}</td>
                            <td>{book.tags?.map(tag => tag.name).join(", ")}</td>
                            <td>{book.isFavorite ? '❤️' : ''}</td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="6" className="no-books">No books found</td>
                    </tr>
                )}
                </tbody>
            </table>
        </div>
    );
}

export default BookList;