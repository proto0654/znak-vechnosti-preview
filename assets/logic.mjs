export function normalizePhone(value) {
  if (!/^\+?[\d\s().-]+$/.test(String(value).trim())) return null;
  const digits = String(value).replace(/\D/g, '');
  if (digits.length === 10) return `+7${digits}`;
  if (digits.length === 11 && /^[78]/.test(digits)) return `+7${digits.slice(1)}`;
  return null;
}

export function validateInquiry(input) {
  const errors = {};
  const phone = normalizePhone(input.phone);
  if (!phone) errors.phone = 'Укажите телефон: 10 цифр или 11 цифр с 7 / 8.';
  if (input.consent !== true) errors.consent = 'Для продолжения подтвердите согласие.';
  if (String(input.name ?? '').trim().length > 80) errors.name = 'Имя должно быть короче 80 символов.';
  if (input.questionRequired && !String(input.question ?? '').trim()) errors.question = 'Напишите ваш вопрос.';
  if (String(input.question ?? '').length > 2000) errors.question = 'Вопрос должен быть короче 2000 символов.';
  return { valid: Object.keys(errors).length === 0, errors, phone };
}

export function createInquiry(input, page, now = new Date()) {
  const result = validateInquiry(input);
  if (!result.valid) return { ...result, inquiry: null };
  return { ...result, inquiry: {name: String(input.name ?? '').trim(), phone: result.phone, question: String(input.question ?? '').trim(), context: String(input.context ?? 'Консультация'), page, createdAt: now.toISOString(), mode:'demo'} };
}

export function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

