const { users, segments } = require('../storage');

exports.getAllUsers = (req, res) => {
  const usersWithSegments = users.map(user => ({
    ...user,
    segments: segments.filter(segment => user.segments.includes(segment.id))
  }));

  res.json(usersWithSegments);
};

exports.getUserSegments = (req, res) => {
  const { userId } = req.params;
  const user = users.find(u => u.id === parseInt(userId));

  if (!user) {
    return res.status(404).json({ error: 'Пользователь не найден' });
  }

  const userSegments = segments.filter(segment => user.segments.includes(segment.id));
  res.json(userSegments);
};

exports.addUserToSegment = (req, res) => {
  const { userId, segmentId } = req.params;
  const userIdInt = parseInt(userId);
  const segmentIdInt = parseInt(segmentId);

  const user = users.find(u => u.id === userIdInt);
  if (!user) {
    return res.status(404).json({ error: 'Пользователь не найден' });
  }

  const segment = segments.find(s => s.id === segmentIdInt);
  if (!segment) {
    return res.status(404).json({ error: 'Сегмент не найден' });
  }

  if (user.segments.includes(segmentIdInt)) {
    return res.status(400).json({ error: 'Пользователь уже находится в этом сегменте' });
  }

  user.segments.push(segmentIdInt);
  res.json({ message: 'Пользователь успешно добавлен в сегмент' });
};

exports.removeUserFromSegment = (req, res) => {
  const { userId, segmentId } = req.params;
  const userIdInt = parseInt(userId);
  const segmentIdInt = parseInt(segmentId);

  const user = users.find(u => u.id === userIdInt);
  if (!user) {
    return res.status(404).json({ error: 'Пользователь не найден' });
  }

  const segmentIndex = user.segments.indexOf(segmentIdInt);
  if (segmentIndex === -1) {
    return res.status(400).json({ error: 'Пользователь не находится в этом сегменте' });
  }

  user.segments.splice(segmentIndex, 1);
  res.json({ message: 'Пользователь успешно удален из сегмента' });
};
