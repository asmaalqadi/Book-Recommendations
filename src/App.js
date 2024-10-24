import React, { useState, useRef } from 'react';
import './App.css';

function App() {
  // State hooks for managing genres, books, reviews, errors, and loading status
  const [genre, setGenre] = useState(''); // Selected genre
  const [books, setBooks] = useState([]); // Best-selling books
  const [reviews, setReviews] = useState({}); // Reviews for selected books
  const [triedBooks, setTriedBooks] = useState({}); // Track books for which reviews were fetched
  const [error, setError] = useState(''); // Error message
  const [loadingGenre, setLoadingGenre] = useState(false); // Loading status for genres
  const [loadingReview, setLoadingReview] = useState({}); // Loading status for reviews

  // Array of genres for the user to select
  const genres = ['Fiction', 'Nonfiction', 'science'];

  const apiKey = process.env.REACT_APP_API_KEY;


  // Ref to manage abort controllers for fetch calls
  const abortControllerRef = useRef(null);

  // Function to abort previous fetch requests before making new ones
  const cleanupPreviousFetch = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort(); // Abort any ongoing requests
    }
  };

  // Function to fetch best sellers based on the selected genre
  const fetchBestSellers = async (selectedGenre) => {
    cleanupPreviousFetch(); // Clean up any previous fetch requests
    setLoadingGenre(true); // Set loading status for genre fetch
    setError(''); // Clear any previous errors
    setBooks([]); // Clear current book list
    setReviews({}); // Clear current reviews
    setTriedBooks({}); // Reset tried books list

    const controller = new AbortController(); // Create a new abort controller
    abortControllerRef.current = controller; // Assign controller to the ref

    try {
      const response = await fetch(
        `https://api.nytimes.com/svc/books/v3/lists/current/${selectedGenre}.json?api-key=${apiKey}`,
        { signal: controller.signal } // Pass abort controller signal
      );
      const data = await response.json(); // Parse the response data

      if (!response.ok) {
        throw new Error('Failed to fetch best sellers'); // Handle unsuccessful response
      }

      if (data && data.results && data.results.books) {
        setBooks(data.results.books); // Set the books data
      } else {
        setError('No best sellers found for this genre.'); // Handle empty results
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        setError(error.message); // Set error if it wasn't an abort error
      }
    } finally {
      if (abortControllerRef.current === controller) {
        setLoadingGenre(false); // Reset loading status after the request completes
      }
    }
  };

  // Function to fetch reviews for a specific book title
  const fetchReviews = async (title) => {
    setLoadingReview((prev) => ({ ...prev, [title]: true })); // Set loading status for the specific book's review

    try {
      const formattedTitle = encodeURIComponent(title.trim()); // Format the book title for the API request
      const response = await fetch(
        `https://api.nytimes.com/svc/books/v3/reviews.json?title=${formattedTitle}&api-key=${apiKey}`
      );
      const data = await response.json(); // Parse the response data

      setTriedBooks((prev) => ({ ...prev, [title]: true })); // Mark the book as tried for fetching reviews

      if (data.results && data.results.length > 0) {
        setReviews((prevReviews) => ({ ...prevReviews, [title]: data.results })); // Set reviews if found
      } else {
        setReviews((prevReviews) => ({ ...prevReviews, [title]: [] })); // Handle no reviews found
      }
    } catch (error) {
      setError('Error fetching reviews.'); // Handle review fetch errors
    } finally {
      setLoadingReview((prev) => ({ ...prev, [title]: false })); // Reset loading status for the specific book's review
    }
  };

  return (
    <div className="app-container">
      <h1>📚 Book Recommendations & Reviews 📚</h1>

      {/* Genre selection section */}
      <div className="genre-selection">
        <h3>📖 Select a Genre: 📖</h3>
        {genres.map((g) => (
          <button
            key={g}
            onClick={() => {
              if (!loadingGenre) {
                setGenre(g); // Set the selected genre
                fetchBestSellers(g); // Fetch best sellers for the selected genre
              }
            }}
            className="genre-button"
            disabled={loadingGenre} // Disable button while fetching data
          >
            {g.replace('-', ' ').toUpperCase()} 📚
          </button>
        ))}
      </div>

      {/* Display loading message if fetching genre */}
      {loadingGenre && <p className="loading-message">Loading best sellers...</p>}
      
      {/* Display error message if any */}
      {error && <p className="error-message">{error}</p>}

      {/* Display list of books if any are found */}
      {books.length > 0 && (
        <ul className="book-list">
          {books.map((book) => (
            <li key={book.title} className="book-item">
              <h3>📕 {book.title}</h3>
              <p>{book.description}</p>
              <button
                onClick={() => fetchReviews(book.title)} // Fetch reviews for the selected book
                className="review-button"
                disabled={loadingReview[book.title]} // Disable review button while loading reviews
              >
                {loadingReview[book.title] ? 'Loading Reviews...' : 'Get Reviews'}
              </button>

              {/* Display reviews if available */}
              {triedBooks[book.title] && reviews[book.title] && reviews[book.title].length > 0 && (
                <ul className="review-list">
                  {reviews[book.title].map((review) => (
                    <li key={review.url}>
                      <p>{review.summary}</p>
                      <a href={review.url} target="_blank" rel="noopener noreferrer" className="review-link">
                        Read Full Review
                      </a>
                    </li>
                  ))}
                </ul>
              )}

              {/* Display message if no reviews found */}
              {triedBooks[book.title] && reviews[book.title] && reviews[book.title].length === 0 && (
                <p>No reviews found for this book.</p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;
