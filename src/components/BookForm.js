import { useState } from 'react';
import api from '../api/axios';

export default function BookForm({ authors, onCreated }) {
  const [title, setTitle] = useState('');
  const [isbn, setIsbn] = useState('');
  const [authorId, setAuthorId] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !authorId) return;

    try {
      await api.post('/books', {
        title,
        isbn,
        author_id: authorId,
      });
      setTitle('');
      setIsbn('');
      setAuthorId('');
      onCreated(); // refresh books
    } catch (err) {
      console.error('Error creating book:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
      <h3>Add Book</h3>
      <input
        type="text"
        placeholder="Book title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        type="text"
        placeholder="ISBN (optional)"
        value={isbn}
        onChange={(e) => setIsbn(e.target.value)}
      />
      <select value={authorId} onChange={(e) => setAuthorId(e.target.value)}>
        <option value="">Select author</option>
        {authors.map(a => (
          <option key={a.id} value={a.id}>{a.name}</option>
        ))}
      </select>
      <button type="submit">Add Book</button>
    </form>
  );
}
