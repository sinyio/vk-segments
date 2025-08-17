const { segments, users } = require("../storage");

exports.getAllSegments = (req, res) => {
  res.json(segments);
};

exports.createSegment = (req, res) => {
  const { name, description } = req.body;

  if (!name) {
    return res.status(400).json({ error: "Название сегмента обязательно" });
  }

  const existingSegment = segments.find((s) => s.name === name);
  if (existingSegment) {
    return res
      .status(400)
      .json({ error: "Сегмент с таким названием уже существует" });
  }

  const newSegment = {
    id: segments.length > 0 ? Math.max(...segments.map((s) => s.id)) + 1 : 1,
    name,
    description: description || "",
  };

  segments.push(newSegment);
  res.status(201).json(newSegment);
};

exports.updateSegment = (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;

  const segmentIndex = segments.findIndex((s) => s.id === parseInt(id));
  if (segmentIndex === -1) {
    return res.status(404).json({ error: "Сегмент не найден" });
  }

  if (name && name !== segments[segmentIndex].name) {
    const existingSegment = segments.find(
      (s) => s.name === name && s.id !== parseInt(id)
    );
    if (existingSegment) {
      return res
        .status(400)
        .json({ error: "Сегмент с таким названием уже существует" });
    }
  }

  segments[segmentIndex] = {
    ...segments[segmentIndex],
    name: name || segments[segmentIndex].name,
    description:
      description !== undefined
        ? description
        : segments[segmentIndex].description,
  };

  res.json(segments[segmentIndex]);
};

exports.deleteSegment = (req, res) => {
  const { id } = req.params;
  const segmentId = parseInt(id);

  const segmentIndex = segments.findIndex((s) => s.id === segmentId);
  if (segmentIndex === -1) {
    return res.status(404).json({ error: "Сегмент не найден" });
  }

  users.forEach((user) => {
    user.segments = user.segments.filter((segId) => segId !== segmentId);
  });

  segments.splice(segmentIndex, 1);
  res.json({ message: "Сегмент успешно удален" });
};

exports.getStats = (req, res) => {
  const stats = segments.map((segment) => ({
    ...segment,
    userCount: users.filter((u) => u.segments.includes(segment.id)).length,
  }));

  res.json(stats);
};

exports.distributeSegment = (req, res) => {
  const { id } = req.params;
  const { percentage } = req.body;

  if (!percentage || percentage < 0 || percentage > 100) {
    return res.status(400).json({ error: "Процент должен быть от 0 до 100" });
  }

  const segment = segments.find((s) => s.id === parseInt(id));
  if (!segment) {
    return res.status(404).json({ error: "Сегмент не найден" });
  }

  const totalUsers = users.length;
  const targetUserCount = Math.ceil((percentage / 100) * totalUsers);
  const currentUsersInSegment = users.filter((u) =>
    u.segments.includes(segment.id)
  ).length;

  if (currentUsersInSegment >= targetUserCount) {
    return res.json({ message: "Достаточно пользователей уже в сегменте" });
  }

  const usersToAdd = targetUserCount - currentUsersInSegment;
  const availableUsers = users.filter((u) => !u.segments.includes(segment.id));

  if (availableUsers.length < usersToAdd) {
    const newUsersNeeded = usersToAdd - availableUsers.length;
    for (let i = 0; i < newUsersNeeded; i++) {
      const newUserId =
        users.length > 0 ? Math.max(...users.map((u) => u.id)) + 1 : 1;
      users.push({ id: newUserId, segments: [] });
    }
  }

  const usersWithoutSegment = users.filter(
    (u) => !u.segments.includes(segment.id)
  );
  const shuffled = usersWithoutSegment.sort(() => 0.5 - Math.random());
  const selectedUsers = shuffled.slice(0, usersToAdd);

  selectedUsers.forEach((user) => {
    user.segments.push(segment.id);
  });

  res.json({
    message: `Сегмент добавлен ${usersToAdd} пользователям`,
    totalUsersInSegment: targetUserCount,
  });
};
