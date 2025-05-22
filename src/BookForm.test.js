import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import BookForm from './components/BookForm';

describe('BookForm Component', () => {
    const mockOnSave = jest.fn();
    const mockOnCancel = jest.fn();

    beforeEach(() => {
        mockOnSave.mockClear();
        mockOnCancel.mockClear();
    });

    test('renders add book form', () => {
        render(
            <BookForm
                onSave={mockOnSave}
                onCancel={mockOnCancel}
            />
        );

        expect(screen.getByText('Add New Book')).toBeInTheDocument();
        expect(screen.getByLabelText(/Title:/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Author:/i)).toBeInTheDocument();
    });

    test('form validation works', () => {
        render(
            <BookForm
                onSave={mockOnSave}
                onCancel={mockOnCancel}
            />
        );

        const saveButton = screen.getByText('Save');
        fireEvent.click(saveButton);

        // Check error messages appear
        expect(screen.getByText('Title is required')).toBeInTheDocument();
        expect(screen.getByText('Author is required')).toBeInTheDocument();
        expect(screen.getByText('Genre is required')).toBeInTheDocument();
    });

    test('form submission with valid data', () => {
        render(
            <BookForm
                onSave={mockOnSave}
                onCancel={mockOnCancel}
            />
        );

        // Fill out the form
        fireEvent.change(screen.getByLabelText(/Title:/i), { target: { value: 'Test Book' } });
        fireEvent.change(screen.getByLabelText(/Author:/i), { target: { value: 'Test Author' } });
        fireEvent.change(screen.getByLabelText(/Genre:/i), { target: { value: 'Test Genre' } });
        fireEvent.change(screen.getByLabelText(/Year Published:/i), { target: { value: '2023' } });
        fireEvent.change(screen.getByLabelText(/Number of Pages:/i), { target: { value: '250' } });
        fireEvent.change(screen.getByLabelText(/Rating \(0-5\):/i), { target: { value: '4.5' } });

        const saveButton = screen.getByText('Save');
        fireEvent.click(saveButton);

        expect(mockOnSave).toHaveBeenCalledWith(expect.objectContaining({
            title: 'Test Book',
            author: 'Test Author',
            genre: 'Test Genre',
            year: 2023,
            pages: 250,
            rating: 4.5
        }));
    });

    test('edit book form populates existing data', () => {
        const existingBook = {
            id: 1,
            title: 'Existing Book',
            author: 'Existing Author',
            genre: 'Existing Genre',
            year: 2022,
            pages: 200,
            rating: 4.0,
            isFavorite: false
        };

        render(
            <BookForm
                book={existingBook}
                onSave={mockOnSave}
                onCancel={mockOnCancel}
            />
        );

        expect(screen.getByText('Edit Book')).toBeInTheDocument();

        // Check if form fields are pre-populated
        const titleInput = screen.getByLabelText(/Title:/i);
        expect(titleInput.value).toBe('Existing Book');
    });
});