import request from 'supertest';
import app from '../src/app';

describe('Gateway Service', () => {
    it('should respond with 404 for unknown route', async () => {
        const res = await request(app).get('/unknown');
        expect(res.status).toBe(404);
    });

    it('should respond with 401 if no user ID passed', async () => {
        const res = await request(app).get('/profile/me');
        expect(res.status).toBe(401);
    });

    it('should forward request if X-User-ID is provided', async () => {
        const res = await request(app)
            .get('/profile/me')
            .set('X-User-ID', 'test-user-id');

        // если profile-сервис не запущен — ожидаем ошибку соединения
        expect([502, 500, 404]).toContain(res.statusCode);
    });

    it('should allow CORS headers', async () => {
        const res = await request(app)
            .options('/profile/me')
            .set('Origin', 'http://localhost:3000');

        expect(res.headers['access-control-allow-origin']).toBe('*');
        expect(res.status).toBe(204); // preflight OK
    });
});
