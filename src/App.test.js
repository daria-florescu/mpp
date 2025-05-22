import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';

// Mock data
const mockBooks = [
    {
        id: 1,
        title: "The Great Gatsby",
        author: "F. Scott Fitzgerald",
        genre: "Classic",
        year: 1925,
        pages: 180,
        rating: 4.2,
        isFavorite: true,
        image: "gatsby.jpg"
    },
    {
        id: 2,
        title: "To Kill a Mockingbird",
        author: "Harper Lee",
        genre: "Fiction",
        year: 1960,
        pages: 281,
        rating: 4.5,
        isFavorite: false,
        image: "mockingbird.jpg"
    }
];

describe('App Component Integration', () => {
    test('adds a new book', () => {
        render(<App />);

        // Click Add New Book button
        const addBookButton = screen.getByText('Add New Book');
        fireEvent.click(addBookButton);

        // Fill out the form
        fireEvent.change(screen.getByLabelText(/Title:/i), { target: { value: 'New Test Book' } });
        fireEvent.change(screen.getByLabelText(/Author:/i), { target: { value: 'New Test Author' } });
        fireEvent.change(screen.getByLabelText(/Genre:/i), { target: { value: 'New Test Genre' } });
        fireEvent.change(screen.getByLabelText(/Year Published:/i), { target: { value: '2023' } });
        fireEvent.change(screen.getByLabelText(/Number of Pages:/i), { target: { value: '300' } });
        fireEvent.change(screen.getByLabelText(/Rating \(0-5\):/i), { target: { value: '4.0' } });

        const saveButton = screen.getByText('Save');
        fireEvent.click(saveButton);

        // Check if the new book appears in the list
        expect(screen.getByText('New Test Book')).toBeInTheDocument();
    });

    test('search functionality works', () => {
        render(<App />);

        const searchInput = screen.getByPlaceholderText('Search by title or author...');
        fireEvent.change(searchInput, { target: { value: 'Gatsby' } });

        // Check if only matching books are displayed
        expect(screen.getByText('The Great Gatsby')).toBeInTheDocument();
    });

    test('genre filter works', () => {
        render(<App />);

        // Find the genre dropdown using the label
        const genreSelect = screen.getByLabelText('Genre:');

        // Change the select to 'Classic'
        fireEvent.change(genreSelect, { target: { value: 'Classic' } });

        // Get all book rows
        const bookTable = screen.getByRole('table');
        const bookRows = within(bookTable).getAllByRole('row').slice(1); // Skip header row

        // Check that each row contains a book with 'Classic' genre
        bookRows.forEach(row => {
            const cells = within(row).getAllByRole('cell');
            const genreCell = cells[2]; // Genre is typically the third column
            expect(genreCell).toHaveTextContent('Classic');
        });
    });
});
