import { useState, useEffect } from 'react';
import api from '../api/axios';

export default function BookForm({ authors, onCreated, editingBook, onCancelEdit }) {
  const [title, setTitle] = useState('');
  const [isbn, setIsbn] = useState('');
  const [authorId, setAuthorId] = useState('');

  useEffect(() => {
    if (editingBook) {
      setTitle(editingBook.title);
      setIsbn(editingBook.isbn || '');
      setAuthorId(editingBook.author?.id || '');
    } else {
      setTitle('');
      setIsbn('');
      setAuthorId('');
    }
  }, [editingBook]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !authorId) return;

    try {
      if (editingBook) {
        await api.put(`/books/${editingBook.id}`, {
          title,
          isbn,
          author_id: authorId,
        });
      } else {
        await api.post('/books', {
          title,
          isbn,
          author_id: authorId,
        });
      }

      onCreated();
      onCancelEdit();
    } catch (err) {
      console.error('Error saving book:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
      <h3>{editingBook ? 'Edit Book' : 'Add Book'}</h3>
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
      <button type="submit">{editingBook ? 'Save' : 'Add Book'}</button>
      {editingBook && (
        <button type="button" onClick={onCancelEdit} style={{ marginLeft: '1rem' }}>
          Cancel
        </button>
      )}
    </form>
  );
}
