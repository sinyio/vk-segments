// In-memory storage
let segments = [
  { id: 1, name: 'MAIL_VOICE_MESSAGES', description: 'Голосовые сообщения в почте' },
  { id: 2, name: 'CLOUD_DISCOUNT_30', description: 'Скидка 30% на подписку в облаке' },
  { id: 3, name: 'MAIL_GPT', description: 'Использование GPT в письмах' }
];

let users = [
  { id: 15230, segments: [1, 2, 3] },
  { id: 19241, segments: [3] },
  { id: 18321, segments: [2] }
];

module.exports = { segments, users };
