import { useEffect, useState } from 'react';
import api from './api/axios';
import AuthorForm from './components/AuthorForm';
import BookForm from './components/BookForm';

function App() {
  const [books, setBooks] = useState([]);
  const [authors, setAuthors] = useState([]);

  const [search, setSearch] = useState('');
  const [authorFilter, setAuthorFilter] = useState('');
  const [sortBy, setSortBy] = useState('');

  useEffect(() => {
    api.get('/books').then(res => setBooks(res.data.data));
    api.get('/authors').then(res => setAuthors(res.data.data));
  }, []);

  const selectedAuthorId = parseInt(authorFilter);

  const filteredBooks = books
    .filter(book =>
      search ? book.title.toLowerCase().includes(search.toLowerCase()) : true
    )
    .filter(book =>
      authorFilter ? book.author?.id === selectedAuthorId : true
    )
    .sort((a, b) => {
      if (sortBy === 'title') return a.title.localeCompare(b.title);
      if (sortBy === 'created_at') return new Date(b.created_at) - new Date(a.created_at);
      return 0;
    });

  return (
    <div style={{ padding: '2rem' }}>
        <AuthorForm onCreated={() => {
          api.get('/authors').then(res => setAuthors(res.data.data));
        }} />

        <BookForm
          authors={authors}
          onCreated={() => {
            api.get('/books').then(res => setBooks(res.data.data));
          }} />

      <h1>📚 Book Library</h1>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
        <input
          type="text"
          placeholder="Search by title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select value={authorFilter} onChange={(e) => setAuthorFilter(e.target.value)}>
          <option value="">All Authors</option>
          {authors.map(author => (
            <option key={author.id} value={author.id}>
              {author.name}
            </option>
          ))}
        </select>

        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="">Sort</option>
          <option value="title">Title (A-Z)</option>
          <option value="created_at">Newest First</option>
        </select>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
        {filteredBooks.map(book => (
          <div key={book.id} style={{ border: '1px solid #ddd', padding: '10px', borderRadius: '8px' }}>
            <img
              src={book.cover_url || 'https://via.placeholder.com/150x220?text=No+Cover'}
              alt={`${book.title} cover`}
              style={{ width: '100%', height: '220px', objectFit: 'cover', borderRadius: '4px' }}
            />
            <h3>{book.title}</h3>
            <p><strong>Author:</strong> {book.author?.name}</p>
          </div>
        ))}
      </div>

    </div>
  );
}

export default App;
