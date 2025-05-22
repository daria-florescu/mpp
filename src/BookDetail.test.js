import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import BookDetail from './components/BookDetail';

const mockBook = {
    id: 1,
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    genre: "Classic",
    year: 1925,
    pages: 180,
    rating: 4.2,
    isFavorite: true,
    image: "gatsby.jpg"
};

describe('BookDetail Component', () => {
    const mockOnEdit = jest.fn();
    const mockOnDelete = jest.fn();

    test('renders book details correctly', () => {
        render(
            <BookDetail
                book={mockBook}
                onEdit={mockOnEdit}
                onDelete={mockOnDelete}
            />
        );

        expect(screen.getByText((content, element) => {
            return element.classList.contains('detail-title') && content === mockBook.title;
        })).toBeInTheDocument();

        expect(screen.getByText((content, element) => {
            return element.classList.contains('info-value') && content === mockBook.author;
        })).toBeInTheDocument();

        expect(screen.getByText((content, element) => {
            return element.classList.contains('info-value') && content === mockBook.genre;
        })).toBeInTheDocument();

        expect(screen.getByText((content, element) => {
            return element.classList.contains('info-value') && content === String(mockBook.year);
        })).toBeInTheDocument();
    });

    test('edit and delete buttons work', () => {
        render(
            <BookDetail
                book={mockBook}
                onEdit={mockOnEdit}
                onDelete={mockOnDelete}
            />
        );

        const editButton = screen.getByText('Edit');
        const deleteButton = screen.getByText('Delete');

        fireEvent.click(editButton);
        expect(mockOnEdit).toHaveBeenCalled();
//check if the element has been deleted from a list
        fireEvent.click(deleteButton);
        expect(mockOnDelete).toHaveBeenCalled();
    });
});