import request from 'supertest';
import { app } from '../index'; // Assuming your Express app is exported as 'app'
import Place from '../models/RegionModel';


describe('GET /regions', () => {
  it('should return all regions', async () => {
    const response = await request(app).get('/regions');
    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(3); // Assuming there are three regions in the database
    // Add more assertions as needed to verify the response body
  });

  it('should return 404 if no regions are found', async () => {
    // Mock the behavior of Place.find() to return an empty array
    jest.spyOn(Place, 'find').mockResolvedValueOnce([]);
    const response = await request(app).get('/regions');
    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: 'No geographic data found' });
  });

  it('should handle internal server errors', async () => {
    // Mock the behavior of Place.find() to throw an error
    jest.spyOn(Place, 'find').mockImplementationOnce(() => {
      throw new Error('Internal server error');
    });
    const response = await request(app).get('/regions');
    expect(response.status).toBe(500);
    expect(response.body).toEqual({ message: 'Internal server error' });
  });
});
