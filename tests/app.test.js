const request = require('supertest');
const app = require('../app');

describe('Fish test suite', () => {
	it('tests /fish/species endpoint', async () => {
		const res = await request(app).get('/fish/species');

		expect(res.statusCode).toBe(200);

		expect(res.body).toEqual(
			expect.objectContaining({
				fromCache: expect.any(Boolean),
				data: expect.any(Array),
			})
		);
	});
});
