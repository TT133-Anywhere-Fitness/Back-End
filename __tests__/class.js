const server = require('../server'); 
const request = require('supertest');
const db = require('../data/config');

beforeEach(async () => {
    await db.seed.run();
})

afterAll(async () => {
    await db.destroy();
})

describe('Testing the classes endpoints', () => {
    jest.setTimeout(30000);
    test('GETS the classes', async () => {
        const res = await request(server).get('/classes')
        expect(res.statusCode).toBe(200)
        expect(res.type).toBe('application/json')
        expect(res.body.length).toBe(3)
    })
    test('Triggers Get by id error', async () => {
        jest.setTimeout(30000);
        const res = await request(server).get('/classes/20')
        expect(res.statusCode).toBe(400)
    })
    test('GETS by ID', async () => {
        jest.setTimeout(30000);
        const res = await request(server).get('/classes/1')
        expect(res.statusCode).toBe(200)
        expect(res.type).toBe('application/json')
        expect(res.body.name).toBe('Cycling')
    })
    test('Trigger post a class error', async () => {
        jest.setTimeout(30000);
        const res = await request(server).post("/classes").send({ 
            type: 'Cardio', 
            date: 'Wednesday', 
            duration: '1 hour', 
            intensity: 'Difficult', 
            location: `123 AppleJack place`, 
            numberOfRegisteredAttendees: 12, 
            maxClassSize: 30 })
          expect(res.statusCode).toBe(400);
    })
    test('Posts a class', async () => {
        jest.setTimeout(30000);
        const res = await request(server).post('/classes').send({
                name: 'Swimming',
                type: 'Cardio', 
                date: 'Wednesday',
                duration: '1 hour',
                intensity: 'Difficult',
                location: `122 Somewhere street`,
                numberOfRegisteredAttendees: 12,
                maxClassSize: 30
            })
            expect(res.statusCode).toBe(201)
            expect(res.type).toBe('application/json')
    })
    test('Triggers PUT class error', async () => {
        const res = await request(server).put('/classes/200').send({
            name: 'Swimming',
                type: 'Cardio', 
                date: 'Wednesday',
                duration: '1 hour',
                intensity: 'Difficult',
                location: `122 Somewhere street`,
                numberOfRegisteredAttendees: 12,
                maxClassSize: 30
          })
          expect(res.statusCode).toBe(400)
    })
    test('Updates a class', async () => {
        const res = await request(server).put('/classes/3').send({
                name: 'Triathlon',
                type: 'Cardio', 
                date: 'Wednesday',
                duration: '1 hour',
                intensity: 'Difficult',
                location: `122 Somewhere street`,
                numberOfRegisteredAttendees: 12,
                maxClassSize: 30
        })
        expect(res.statusCode).toBe(200)
        expect(res.type).toBe('application/json')
        expect(res.body.name).toBe('Triathlon')
    })
    test('Deletes a class', async () => {
        const res = await request(server).delete('/classes/3')
        expect(res.statusCode).toBe(204)
    })
})