import React, { useState } from 'react';

function BookForm({ book, onSave, onCancel }) {
    const initialFormState = book ? { ...book } : {
        title: '',
        author: '',
        genre: '',
        year: '',
        pages: '',
        rating: '',
        isFavorite: false
    };

    const [formData, setFormData] = useState(initialFormState);
    const [tagInput, setTagInput] = useState(book?.tags?.map(t => t.name).join(", ") || "");
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const validate = () => {
        const newErrors = {};

        // Title validation
        if (!formData.title.trim()) {
            newErrors.title = 'Title is required';
        }

        // Author validation
        if (!formData.author.trim()) {
            newErrors.author = 'Author is required';
        }

        // Genre validation
        if (!formData.genre.trim()) {
            newErrors.genre = 'Genre is required';
        }

        // Year validation
        if (!formData.year) {
            newErrors.year = 'Year is required';
        } else {
            const yearNum = Number(formData.year);
            if (isNaN(yearNum) || yearNum < 1000 || yearNum > new Date().getFullYear()) {
                newErrors.year = `Year must be between 1000 and ${new Date().getFullYear()}`;
            }
        }

        // Pages validation
        if (!formData.pages) {
            newErrors.pages = 'Number of pages is required';
        } else {
            const pagesNum = Number(formData.pages);
            if (isNaN(pagesNum) || pagesNum <= 0 || !Number.isInteger(pagesNum)) {
                newErrors.pages = 'Pages must be a positive integer';
            }
        }

        // Rating validation
        if (!formData.rating) {
            newErrors.rating = 'Rating is required';
        } else {
            const ratingNum = Number(formData.rating);
            if (isNaN(ratingNum) || ratingNum < 0 || ratingNum > 5) {
                newErrors.rating = 'Rating must be between 0 and 5';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (validate()) {
            // Convert numeric fields to actual numbers
            const processedData = {
                ...formData,
                year: Number(formData.year),
                pages: Number(formData.pages),
                rating: Number(formData.rating),
                tags: tagInput.split(",").map(tag => tag.trim()).filter(Boolean)
            };


            onSave(processedData);
        }
    };

    return (
        <div className="book-form">
            <h2>{book ? 'Edit Book' : 'Add New Book'}</h2>

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="book-title">Title:</label>
                    <input
                        type="text"
                        id="book-title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        className={errors.title ? 'error' : ''}
                    />
                    {errors.title && <div className="error-message">{errors.title}</div>}
                </div>

                <div className="form-group">
                    <label htmlFor="book-author">Author:</label>
                    <input
                        type="text"
                        id="book-author"
                        name="author"
                        value={formData.author}
                        onChange={handleChange}
                        className={errors.author ? 'error' : ''}
                    />
                    {errors.author && <div className="error-message">{errors.author}</div>}
                </div>

                <div className="form-group">
                    <label htmlFor="book-genre">Genre:</label>
                    <input
                        type="text"
                        id="book-genre"
                        name="genre"
                        value={formData.genre}
                        onChange={handleChange}
                        className={errors.genre ? 'error' : ''}
                    />
                    {errors.genre && <div className="error-message">{errors.genre}</div>}
                </div>

                <div className="form-group">
                    <label htmlFor="book-year">Year Published:</label>
                    <input
                        type="number"
                        id="book-year"
                        name="year"
                        value={formData.year}
                        onChange={handleChange}
                        className={errors.year ? 'error' : ''}
                    />
                    {errors.year && <div className="error-message">{errors.year}</div>}
                </div>

                <div className="form-group">
                    <label htmlFor="book-pages">Number of Pages:</label>
                    <input
                        type="number"
                        id="book-pages"
                        name="pages"
                        value={formData.pages}
                        onChange={handleChange}
                        className={errors.pages ? 'error' : ''}
                    />
                    {errors.pages && <div className="error-message">{errors.pages}</div>}
                </div>

                <div className="form-group">
                    <label htmlFor="book-rating">Rating (0-5):</label>
                    <input
                        type="number"
                        id="book-rating"
                        name="rating"
                        step="0.1"
                        min="0"
                        max="5"
                        value={formData.rating}
                        onChange={handleChange}
                        className={errors.rating ? 'error' : ''}
                    />
                    {errors.rating && <div className="error-message">{errors.rating}</div>}
                </div>

                <div className="form-group">
                    <label htmlFor="book-tags">Tags (comma separated):</label>
                    <input
                        type="text"
                        id="book-tags"
                        name="tags"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                    />
                </div>

                <div className="form-group checkbox-group">
                    <label htmlFor="book-favorite">
                        <input
                            type="checkbox"
                            id="book-favorite"
                            name="isFavorite"
                            checked={formData.isFavorite}
                            onChange={handleChange}
                        />
                        Add to Favorites
                    </label>
                </div>

                <div className="form-buttons">
                    <button type="submit" className="save-button">Save</button>
                    <button type="button" className="cancel-button" onClick={onCancel}>Cancel</button>
                </div>
            </form>
        </div>
    );
}

export default BookForm;