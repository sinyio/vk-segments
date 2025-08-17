import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Segments = () => {
  const [segments, setSegments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingSegment, setEditingSegment] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });

  useEffect(() => {
    fetchSegments();
  }, []);

  const fetchSegments = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/segments');
      setSegments(response.data);
      setError('');
    } catch (err) {
      setError('Ошибка при загрузке сегментов');
      console.error('Error fetching segments:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      setError('Название сегмента обязательно');
      return;
    }

    try {
      if (editingSegment) {
        await axios.put(`/api/segments/${editingSegment.id}`, formData);
        setSuccess('Сегмент успешно обновлен');
      } else {
        await axios.post('/api/segments', formData);
        setSuccess('Сегмент успешно создан');
      }
      
      setFormData({ name: '', description: '' });
      setEditingSegment(null);
      setShowForm(false);
      fetchSegments();
    } catch (err) {
      setError(err.response?.data?.error || 'Произошла ошибка');
      console.error('Error saving segment:', err);
    }
  };

  const handleEdit = (segment) => {
    setEditingSegment(segment);
    setFormData({
      name: segment.name,
      description: segment.description
    });
    setShowForm(true);
  };

  const handleDelete = async (segmentId) => {
    if (!window.confirm('Вы уверены, что хотите удалить этот сегмент?')) {
      return;
    }

    try {
      await axios.delete(`/api/segments/${segmentId}`);
      setSuccess('Сегмент успешно удален');
      fetchSegments();
    } catch (err) {
      setError(err.response?.data?.error || 'Ошибка при удалении сегмента');
      console.error('Error deleting segment:', err);
    }
  };

  const handleCancel = () => {
    setFormData({ name: '', description: '' });
    setEditingSegment(null);
    setShowForm(false);
    setError('');
  };

  const clearMessages = () => {
    setError('');
    setSuccess('');
  };

  if (loading) {
    return (
      <div className="container">
        <h2>Сегменты</h2>
        <p>Загрузка...</p>
      </div>
    );
  }

  return (
    <div className="container">
      <h2>Управление сегментами</h2>
      
      {error && (
        <div className="alert alert-error" onClick={clearMessages}>
          {error}
        </div>
      )}
      
      {success && (
        <div className="alert alert-success" onClick={clearMessages}>
          {success}
        </div>
      )}

      <div style={{ marginBottom: '1rem' }}>
        <button 
          className="btn btn-primary" 
          onClick={() => setShowForm(true)}
        >
          {showForm ? 'Скрыть форму' : 'Создать новый сегмент'}
        </button>
      </div>

      {showForm && (
        <div className="distribution-form">
          <h3>{editingSegment ? 'Редактировать сегмент' : 'Создать новый сегмент'}</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Название сегмента *</label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Например: MAIL_GPT"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="description">Описание</label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Описание сегмента"
                rows="3"
              />
            </div>
            
            <div>
              <button type="submit" className="btn btn-success">
                {editingSegment ? 'Обновить' : 'Создать'}
              </button>
              <button type="button" className="btn btn-warning" onClick={handleCancel}>
                Отмена
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="segments-grid">
        {segments.map(segment => (
          <div key={segment.id} className="segment-card">
            <h3>{segment.name}</h3>
            <p>{segment.description || 'Описание отсутствует'}</p>
            <div className="segment-actions">
              <button 
                className="btn btn-primary" 
                onClick={() => handleEdit(segment)}
              >
                Редактировать
              </button>
              <button 
                className="btn btn-danger" 
                onClick={() => handleDelete(segment.id)}
              >
                Удалить
              </button>
            </div>
          </div>
        ))}
      </div>

      {segments.length === 0 && (
        <p style={{ textAlign: 'center', color: '#666', marginTop: '2rem' }}>
          Сегменты не найдены. Создайте первый сегмент!
        </p>
      )}
    </div>
  );
};

export default Segments;
