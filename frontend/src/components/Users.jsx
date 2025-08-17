import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/users');
      setUsers(response.data);
      setError('');
    } catch (err) {
      setError('Ошибка при загрузке пользователей');
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveSegment = async (userId, segmentId) => {
    try {
      await axios.delete(`/api/users/${userId}/segments/${segmentId}`);
      fetchUsers(); // Обновляем список
    } catch (err) {
      setError('Ошибка при удалении сегмента у пользователя');
      console.error('Error removing segment:', err);
    }
  };

  if (loading) {
    return (
      <div className="container">
        <h2>Пользователи</h2>
        <p>Загрузка...</p>
      </div>
    );
  }

  return (
    <div className="container">
      <h2>Пользователи и их сегменты</h2>
      
      {error && (
        <div className="alert alert-error">
          {error}
        </div>
      )}

      <div className="stats-grid">
        <div className="stat-card">
          <h4>Всего пользователей</h4>
          <div className="number">{users.length}</div>
          <div className="description">в системе</div>
        </div>
        
        <div className="stat-card">
          <h4>Пользователей с сегментами</h4>
          <div className="number">
            {users.filter(user => user.segments.length > 0).length}
          </div>
          <div className="description">активных</div>
        </div>
        
        <div className="stat-card">
          <h4>Среднее количество сегментов</h4>
          <div className="number">
            {users.length > 0 
              ? (users.reduce((sum, user) => sum + user.segments.length, 0) / users.length).toFixed(1)
              : 0
            }
          </div>
          <div className="description">на пользователя</div>
        </div>
      </div>

      <table className="users-table">
        <thead>
          <tr>
            <th>ID пользователя</th>
            <th>Сегменты</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>
                <strong>{user.id}</strong>
              </td>
              <td>
                {user.segments.length > 0 ? (
                  user.segments.map(segment => (
                    <span key={segment.id} className="segment-tag">
                      {segment.name}
                    </span>
                  ))
                ) : (
                  <span style={{ color: '#999', fontStyle: 'italic' }}>
                    Нет сегментов
                  </span>
                )}
              </td>
              <td>
                {user.segments.length > 0 && (
                  <div>
                    {user.segments.map(segment => (
                      <button
                        key={segment.id}
                        className="btn btn-danger"
                        style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem' }}
                        onClick={() => handleRemoveSegment(user.id, segment.id)}
                        title={`Удалить сегмент ${segment.name}`}
                      >
                        Убрать {segment.name}
                      </button>
                    ))}
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {users.length === 0 && (
        <p style={{ textAlign: 'center', color: '#666', marginTop: '2rem' }}>
          Пользователи не найдены.
        </p>
      )}
    </div>
  );
};

export default Users;
