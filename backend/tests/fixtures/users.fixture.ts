export const testUsers = {
  validUser: {
    id: '1',
    email: 'test@example.com',
    password: 'password123',
    firstName: 'Test',
    lastName: 'User',
    phoneNumber: '+1234567890',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  invalidUser: {
    id: '2',
    email: 'invalid-email',
    password: '123', // Too short
    firstName: '',
    lastName: '',
    phoneNumber: 'invalid-phone',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  duplicateUser: {
    id: '3',
    email: 'test@example.com', // Same email as validUser
    password: 'password456',
    firstName: 'Duplicate',
    lastName: 'User',
    phoneNumber: '+0987654321',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
};

export const userCredentials = {
  valid: {
    email: 'test@example.com',
    password: 'password123',
  },
  invalid: {
    email: 'test@example.com',
    password: 'wrongpassword',
  },
  nonExistent: {
    email: 'nonexistent@example.com',
    password: 'password123',
  },
}; 