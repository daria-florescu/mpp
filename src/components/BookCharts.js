import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';

function BookCharts({ books }) {
    // Bar Chart - Books by Genre
    const genreData = Object.entries(
        books.reduce((acc, book) => {
            acc[book.genre] = (acc[book.genre] || 0) + 1;
            return acc;
        }, {})
    ).map(([name, value]) => ({ name, value }));

    // Pie Chart - Rating Distribution
    const ratingData = [
        { name: '0-2', value: books.filter(book => book.rating < 2).length },
        { name: '2-3', value: books.filter(book => book.rating >= 2 && book.rating < 3).length },
        { name: '3-4', value: books.filter(book => book.rating >= 3 && book.rating < 4).length },
        { name: '4-5', value: books.filter(book => book.rating >= 4).length }
    ];

    // Line Chart - Publication Year Distribution
    const yearData = Object.entries(
        books.reduce((acc, book) => {
            const decade = Math.floor(book.year / 10) * 10;
            acc[decade] = (acc[decade] || 0) + 1;
            return acc;
        }, {})
    ).map(([name, value]) => ({ name: `${name}s`, value }));

    const COLORS = ['#4F4789', '#16BAC5', '#FF7F11', '#CC3363'];

    return (
        <div className="book-charts">
            <div className="chart-row">
                <div className="chart">
                    <h3>Books by Genre</h3>
                    <BarChart width={300} height={200} data={genreData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="value" fill="#8884d8" />
                    </BarChart>
                </div>
                <div className="chart">
                    <h3>Rating Distribution</h3>
                    <PieChart width={300} height={200}>
                        <Pie
                            data={ratingData}
                            cx={150}
                            cy={100}
                            labelLine={false}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                        >
                            {ratingData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                    </PieChart>
                </div>
            </div>
            <div className="chart-row">
                <div className="chart">
                    <h3>Books by Publication Decade</h3>
                    <BarChart width={400} height={200} data={yearData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="value" fill="#82ca9d" />
                    </BarChart>
                </div>
            </div>
        </div>
    );
}

function PaginatedBookList({ books, itemsPerPage = 5 }) {
    const [currentPage, setCurrentPage] = useState(1);

    // Pagination logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentBooks = books.slice(indexOfFirstItem, indexOfLastItem);

    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(books.length / itemsPerPage); i++) {
        pageNumbers.push(i);
    }

    return (
        <div className="paginated-book-list">
            <table>
                <thead>
                <tr>
                    <th>Title</th>
                    <th>Author</th>
                    <th>Genre</th>
                    <th>Year</th>
                    <th>Rating</th>
                </tr>
                </thead>
                <tbody>
                {currentBooks.map(book => (
                    <tr key={book.id}>
                        <td>{book.title}</td>
                        <td>{book.author}</td>
                        <td>{book.genre}</td>
                        <td>{book.year}</td>
                        <td>{book.rating}</td>
                    </tr>
                ))}
                </tbody>
            </table>
            <div className="pagination">
                {pageNumbers.map(number => (
                    <button
                        key={number}
                        onClick={() => setCurrentPage(number)}
                        className={currentPage === number ? 'active' : ''}
                    >
                        {number}
                    </button>
                ))}
            </div>
        </div>
    );
}

export { BookCharts, PaginatedBookList };