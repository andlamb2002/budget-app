const request = require('supertest');
const app = require('../server');  

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

    it('should fail to login with wrong password and return appropriate status code', async () => {
        const response = await request(app)
            .post('/api/login')
            .send({
                email: 'asdf@gmail.com',
                password: 'wrongpassword'
            });

        expect(response.body).toHaveProperty('error');
        expect(response.body.error).toBe('Authentication error: Firebase: Error (auth/invalid-credential).'); 
    });
});
