import { expect, test } from 'vitest';
import { POST } from '@/app/api/register/route';
import User from '@/models/User';
import { sendVerificationEmail } from '@/lib/email';

test('POST /api/register - returns success for valid data', async () => {
  const payload = {
    name: 'Test User',
    email: 'test@example.com',
    password: 'password123',
    role: 'student'
  };

  const req = new Request('http://localhost:3000/api/register', {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: { 'Content-Type': 'application/json' }
  });

  const response = await POST(req);
  const data = await response.json();

  expect(response.status).toBe(200);
  expect(data.success).toBe(true);
  expect(data.message).toContain('Account constructed successfully');

  // Verify database state
  const user = await User.findOne({ email: 'test@example.com' });
  expect(user).toBeDefined();
  expect(user?.name).toBe('Test User');
  expect(user?.role).toBe('student');

  // Verify email mock was called
  expect(sendVerificationEmail).toHaveBeenCalledWith(
    'test@example.com',
    expect.any(String),
    'Test User'
  );
});

test('POST /api/register - returns 400 for missing fields', async () => {
  const payload = {
    email: 'test@example.com'
  };

  const req = new Request('http://localhost:3000/api/register', {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: { 'Content-Type': 'application/json' }
  });

  const response = await POST(req);
  const data = await response.json();

  expect(response.status).toBe(400);
  expect(data.success).toBe(false);
  expect(data.error).toBe('All fields required');
});
