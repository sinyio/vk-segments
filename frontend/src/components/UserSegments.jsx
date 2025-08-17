import React, { useState } from 'react';
import axios from 'axios';

const UserSegments = () => {
  const [userId, setUserId] = useState('');
  const [userSegments, setUserSegments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [userFound, setUserFound] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!userId.trim()) {
      setError('Введите ID пользователя');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setUserFound(false);
      
      const response = await axios.get(`/api/users/${userId}/segments`);
      setUserSegments(response.data);
      setUserFound(true);
      
    } catch (err) {
      if (err.response?.status === 404) {
        setError('Пользователь с таким ID не найден');
        setUserSegments([]);
        setUserFound(false);
      } else {
        setError('Ошибка при поиске пользователя');
        console.error('Error searching user:', err);
      }
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setUserId('');
    setUserSegments([]);
    setError('');
    setUserFound(false);
  };

  return (
    <div className="container">
      <h2>Поиск сегментов пользователя</h2>
      
      <div className="distribution-form">
        <h3>Введите ID пользователя</h3>
        
        <form onSubmit={handleSearch}>
          <div className="form-group">
            <label htmlFor="userId">ID пользователя</label>
            <input
              type="number"
              id="userId"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="Например: 15230"
              required
            />
            <small style={{ color: '#666' }}>
              Введите числовой ID пользователя для поиска его сегментов
            </small>
          </div>
          
          <div>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Поиск...' : 'Найти пользователя'}
            </button>
            <button type="button" className="btn btn-warning" onClick={clearSearch}>
              Очистить
            </button>
          </div>
        </form>
      </div>

      {error && (
        <div className="alert alert-error">
          {error}
        </div>
      )}

      {userFound && (
        <div className="container">
          <h3>Результат поиска</h3>
          
          <div className="stat-card" style={{ marginBottom: '1.5rem' }}>
            <h4>Пользователь ID: {userId}</h4>
            <div className="number">{userSegments.length}</div>
            <div className="description">
              {userSegments.length === 1 ? 'сегмент' : 
               userSegments.length < 5 ? 'сегмента' : 'сегментов'}
            </div>
          </div>

          {userSegments.length > 0 ? (
            <div className="segments-grid">
              {userSegments.map(segment => (
                <div key={segment.id} className="segment-card">
                  <h3>{segment.name}</h3>
                  <p>{segment.description || 'Описание отсутствует'}</p>
                  <div style={{ 
                    fontSize: '0.9rem', 
                    color: '#666',
                    fontStyle: 'italic'
                  }}>
                    ID сегмента: {segment.id}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="alert alert-info">
              У пользователя ID {userId} нет активных сегментов
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UserSegments;
