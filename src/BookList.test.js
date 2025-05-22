import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import BookList from './components/BookList';

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

describe('BookList Component', () => {
    test('renders book list with correct number of rows', () => {
        const mockOnSelectBook = jest.fn();
        const mockOnSort = jest.fn();
        const sortConfig = { key: 'title', direction: 'ascending' };

        render(
            <BookList
                books={mockBooks}
                onSelectBook={mockOnSelectBook}
                onSort={mockOnSort}
                sortConfig={sortConfig}
            />
        );

        const rows = screen.getAllByRole('row');
        // +1 for header row
        expect(rows).toHaveLength(mockBooks.length + 1);
    });

    test('clicking on a book row calls onSelectBook', () => {
        const mockOnSelectBook = jest.fn();
        const mockOnSort = jest.fn();
        const sortConfig = { key: 'title', direction: 'ascending' };

        render(
            <BookList
                books={mockBooks}
                onSelectBook={mockOnSelectBook}
                onSort={mockOnSort}
                sortConfig={sortConfig}
            />
        );

        const firstBookRow = screen.getAllByRole('row')[1];
        fireEvent.click(firstBookRow);

        expect(mockOnSelectBook).toHaveBeenCalledWith(mockBooks[0]);
    });

    test('sort indicators appear correctly', () => {
        const mockOnSelectBook = jest.fn();
        const mockOnSort = jest.fn();
        const sortConfig = { key: 'title', direction: 'ascending' };

        render(
            <BookList
                books={mockBooks}
                onSelectBook={mockOnSelectBook}
                onSort={mockOnSort}
                sortConfig={sortConfig}
            />
        );

        const titleHeader = screen.getByText(/Title/);
        expect(titleHeader).toBeInTheDocument();
    });
});