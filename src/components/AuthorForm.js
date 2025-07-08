import { useState } from 'react';
import api from '../api/axios';

export default function AuthorForm({ onCreated }) {
  const [name, setName] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    try {
      await api.post('/authors', { name });
      setName('');
      onCreated(); // refresh authors
    } catch (err) {
      console.error('Error creating author:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: '1rem' }}>
      <h3>Add Author</h3>
      <input
        type="text"
        placeholder="Author name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button type="submit">Add</button>
    </form>
  );
}
