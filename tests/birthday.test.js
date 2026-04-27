const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server/index');
const Birthday = require('../server/models/birthdayModel');

describe('Birthday API Tests', () => {
  beforeAll(async () => {
    await mongoose.connect('mongodb://localhost:27017/birthday_reminder_test', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  afterEach(async () => {
    await Birthday.deleteMany({});
  });

  describe('POST /api/birthdays', () => {
    it('should create a new birthday entry', async () => {
      const res = await request(app)
        .post('/api/birthdays')
        .send({
          username: 'John Doe',
          email: 'john@example.com',
          dateOfBirth: '1990-01-15',
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.username).toBe('John Doe');
    });

    it('should reject duplicate email', async () => {
      await Birthday.create({
        username: 'John',
        email: 'john@example.com',
        dateOfBirth: new Date('1990-01-15'),
      });

      const res = await request(app)
        .post('/api/birthdays')
        .send({
          username: 'Jane',
          email: 'john@example.com',
          dateOfBirth: '1992-05-20',
        });

      expect(res.statusCode).toBe(409);
      expect(res.body.success).toBe(false);
    });

    it('should validate required fields', async () => {
      const res = await request(app)
        .post('/api/birthdays')
        .send({
          username: 'John',
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe('GET /api/birthdays', () => {
    it('should retrieve all birthdays', async () => {
      await Birthday.create({
        username: 'John',
        email: 'john@example.com',
        dateOfBirth: new Date('1990-01-15'),
      });

      const res = await request(app).get('/api/birthdays');

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.count).toBe(1);
    });
  });

  describe('DELETE /api/birthdays/:id', () => {
    it('should delete a birthday entry', async () => {
      const birthday = await Birthday.create({
        username: 'John',
        email: 'john@example.com',
        dateOfBirth: new Date('1990-01-15'),
      });

      const res = await request(app).delete(`/api/birthdays/${birthday._id}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);

      const deleted = await Birthday.findById(birthday._id);
      expect(deleted.isActive).toBe(false);
    });
  });
});