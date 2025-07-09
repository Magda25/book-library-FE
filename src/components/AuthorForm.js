import { useState, useEffect } from 'react';
import api from '../api/axios';

export default function AuthorForm({ onCreated, editingAuthor, onCancelEdit }) {
  const [name, setName] = useState('');

  useEffect(() => {
    if (editingAuthor) {
      setName(editingAuthor.name);
    } else {
      setName('');
    }
  }, [editingAuthor]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      if (editingAuthor) {
        await api.put(`/authors/${editingAuthor.id}`, { name });
      } else {
        await api.post('/authors', { name });
      }
      setName('');
      onCreated();
      onCancelEdit();
    } catch (err) {
      console.error('Error saving author:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: '1rem' }}>
      <h3>{editingAuthor ? 'Edit Author' : 'Add Author'}</h3>
      <input
        type="text"
        placeholder="Author name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button type="submit">{editingAuthor ? 'Save' : 'Add Author'}</button>
      {editingAuthor && (
        <button type="button" onClick={onCancelEdit} style={{ marginLeft: '1rem' }}>
          Cancel
        </button>
      )}
    </form>
  );
}
