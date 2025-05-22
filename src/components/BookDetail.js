import React from 'react';

function BookDetail({ book, onEdit, onDelete }) {
    if (!book) return null;

    return (
        <div className="book-detail">
            <h2 className="detail-title">{book.title}</h2>
            <div className="detail-info">
                <div className="book-cover">
                    <img src={`/images/${book.image}`} alt={book.title} />
                </div>

                <div className="book-info">
                    <div className="info-row">
                        <span className="info-label">Author:</span>
                        <span className="info-value">{book.author}</span>
                    </div>

                    <div className="info-row">
                        <span className="info-label">Genre:</span>
                        <span className="info-value">{book.genre}</span>
                    </div>

                    <div className="info-row">
                        <span className="info-label">Published:</span>
                        <span className="info-value">{book.year}</span>
                    </div>

                    <div className="info-row">
                        <span className="info-label">Pages:</span>
                        <span className="info-value">{book.pages}</span>
                    </div>

                    <div className="info-row">
                        <span className="info-label">Rating:</span>
                        <span className="info-value">{book.rating} / 5</span>
                    </div>

                    <div className="info-row">
                        <span className="info-label">Tags:</span>
                        <span className="info-value">{book.tags?.map(tag => tag.name).join(", ") || 'None'}</span>
                    </div>

                    <div className="info-row">
                        <span className="info-label">Favorite:</span>
                        <span className="info-value">{book.isFavorite ? 'Yes' : 'No'}</span>
                    </div>
                </div>
            </div>

            <div className="action-buttons">
                <button className="edit-button" onClick={onEdit}>Edit</button>
                <button className="delete-button" onClick={onDelete}>Delete</button>
            </div>
        </div>
    );
}

export default BookDetail;