import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SegmentDistribution = () => {
  const [segments, setSegments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedSegment, setSelectedSegment] = useState('');
  const [percentage, setPercentage] = useState(30);
  const [distributing, setDistributing] = useState(false);

  useEffect(() => {
    fetchSegments();
  }, []);

  const fetchSegments = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/segments');
      setSegments(response.data);
      if (response.data.length > 0) {
        setSelectedSegment(response.data[0].id);
      }
      setError('');
    } catch (err) {
      setError('Ошибка при загрузке сегментов');
      console.error('Error fetching segments:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDistribute = async () => {
    if (!selectedSegment) {
      setError('Выберите сегмент для распределения');
      return;
    }

    if (percentage < 0 || percentage > 100) {
      setError('Процент должен быть от 0 до 100');
      return;
    }

    try {
      setDistributing(true);
      setError('');
      
      const response = await axios.post(`/api/segments/${selectedSegment}/distribute`, {
        percentage: parseInt(percentage)
      });
      
      setSuccess(response.data.message);
      
      // Очищаем сообщение через 5 секунд
      setTimeout(() => setSuccess(''), 5000);
      
    } catch (err) {
      setError(err.response?.data?.error || 'Ошибка при распределении сегмента');
      console.error('Error distributing segment:', err);
    } finally {
      setDistributing(false);
    }
  };

  const clearMessages = () => {
    setError('');
    setSuccess('');
  };

  if (loading) {
    return (
      <div className="container">
        <h2>Распределение сегментов</h2>
        <p>Загрузка...</p>
      </div>
    );
  }

  return (
    <div className="container">
      <h2>Распределение сегментов на пользователей</h2>
      
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

      <div className="distribution-form">
        <h3>Распределить сегмент на процент пользователей</h3>
        
        <div className="form-group">
          <label htmlFor="segment">Выберите сегмент</label>
          <select
            id="segment"
            value={selectedSegment}
            onChange={(e) => setSelectedSegment(e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '2px solid #e1e5e9',
              borderRadius: '8px',
              fontSize: '1rem'
            }}
          >
            {segments.map(segment => (
              <option key={segment.id} value={segment.id}>
                {segment.name} - {segment.description}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="percentage">Процент пользователей</label>
          <div className="percentage-input">
            <input
              type="number"
              id="percentage"
              min="0"
              max="100"
              value={percentage}
              onChange={(e) => setPercentage(e.target.value)}
              style={{
                width: '100px',
                padding: '0.75rem',
                border: '2px solid #e1e5e9',
                borderRadius: '8px',
                fontSize: '1rem'
              }}
            />
            <span>%</span>
          </div>
          <small style={{ color: '#666' }}>
            Введите процент от 0 до 100. Например, 30 означает, что сегмент будет добавлен 30% всех пользователей.
          </small>
        </div>

        <button
          className="btn btn-primary"
          onClick={handleDistribute}
          disabled={distributing || !selectedSegment}
        >
          {distributing ? 'Распределение...' : 'Распределить сегмент'}
        </button>
      </div>
    </div>
  );
};

export default SegmentDistribution;
