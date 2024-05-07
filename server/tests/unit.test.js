const request = require('supertest');
const app = require('../server');  // Update this path if needed

describe('POST /api/login', () => {
    it('should login successfully and return user data', async () => {
        const response = await request(app)
            .post('/api/login')
            .send({
                email: 'asdf@gmail.com',
                password: '123456'
            });

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('id');
        expect(response.body).toHaveProperty('firstName');
        expect(response.body).toHaveProperty('lastName');
        expect(response.body).toHaveProperty('email');
    });
});
