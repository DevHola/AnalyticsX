const baseurl = 'http://localhost:7000/api'
const request = require('supertest')
const crypto = require('crypto')
let token;
let decoded;
let apikey;
let siteidd;
describe('user registration', () => {
  it('New user should be created - status ->200', async () => {
    const response = await request(baseurl).post('/register').send({
      email: 'ai@ai.com',
      username: 'ai',
      password: 'ai12345678'
    })
    expect(response.statusCode).toBe(200)
    expect(response.body).toHaveProperty('message')
  })
})
describe('user login', () => {
  it('User login - status -> 200', async () => {
    const response = await request(baseurl).post('/login').send({
      email: 'ai@ai.com',
      password: 'ai12345678'
    })
    token = response.body.data
    expect(response.statusCode).toEqual(200)
    expect(response.body).toHaveProperty('Message')
    expect(response.body).toHaveProperty('data')
  })
})
describe('get auth user', () => {
  it('retrieve auth user data -> 200', async () => {
    const response = await request(baseurl).get('/auth/user').set('auth-access-token', `${token}`)
    decoded = response.body.User
    // console.log(decoded._id)
    expect(response.statusCode).toBe(200)
    expect(response.body.User).toEqual(
      expect.objectContaining({
        Email: expect.any(String),
        Username: expect.any(String),
        __v: expect.any(Number),
        _id: expect.any(String),
        createdAt: expect.any(String),
        updatedAt: expect.any(String)

      })
    )
  })
})
describe('Create ownable(site)', () => {
  it('Create an instance on ownable site for user -statusCode -> 200', async () =>{
    const response = await request(baseurl).post('/addsite').send({
      Owner: decoded._id,
      sitename: 'my_website',
      siteurl: 'https://susafrica.com/'
  }).set('auth-access-token',`${token}`);
  // console.log(response.body)
  expect(response.statusCode).toBe(200);
}) 
})
describe('Get ownable(site)', () => {
  it('get ownable data by Name - statusCode -> 200', async () => {
    const response = await request(baseurl).get('/site/my_website').set('auth-access-token', `${token}`);
    siteidd = response.body.data._id
    expect(response.body).toHaveProperty('data')
    expect(response.statusCode).toBe(200)
  })
})
describe('regenerate tracking code', () => {
  it('Regenerate Tracking code on user request', async () => {
    const response = await request(baseurl).put('/site/tcu/my_website').set('auth-access-token', `${token}`);
    expect(response.body).toHaveProperty('message')
    expect(response.statusCode).toBe(200)
  })
})
describe('Get users specific Ownables', () => {
  it('Get ownables by user - statuscode - 200 expected', async () => {
    const response = await request(baseurl).get('/user/sites').set('auth-access-token', `${token}`)
    expect(response.body).toHaveProperty('data');
    apikey = response.body.data[0];
    //  console.log(response.body.data[0]._id)
    expect(response.statusCode).toBe(200)
  })
})
describe('Get all Ownables', () => {
  it('Get all ownables  - statuscode - 200 expected', async () => {
    const response = await request(baseurl).get('/allsites').set('auth-access-token', `${token}`)
    expect(response.body).toHaveProperty('data');
    expect(response.statusCode).toBe(200)
  })
})
 describe('Generate Verification file', () => {
  it('Gen Verification.html  - statuscode - 200 expected', async () => {
    console.log(apikey.ApiKey)
    const response = await request(baseurl).get(`/verification/${apikey}`).set('auth-access-token', `${token}`)
    expect(response.statusCode).toBe(200)
  })
}) 

describe('create new trackable', () => {
  it('new trackable custom - statusCode -200 expected', async () => {
    const response = await request(baseurl).post('/event/new').send({
      siteId: siteidd,
      eventName: 'sign up event',
      eventType: 'form-submittion'
    })
    expect(response.statusCode).toBe(200)
    expect(response.body).toHaveProperty('message')
  })
})
describe('get all custom events', () => {
  it('Get all custom trackable event  - statuscode - 200 expected', async () => {
    const response = await request(baseurl).get(`/events/${siteidd}`).set('auth-access-token', `${token}`)
    expect(response.statusCode).toBe(200)
  })
}) 

/* describe('Verification ping', () => {
  it('Ping user site to retreive ver-file details - statuscode - 200 expected', async () => {
    const response = await request(baseurl).get(`/verify/ownership?url=https://susafrica.com/`).set('auth-access-token', `${token}`)
    expect(response.statusCode).toBe(200)
    expect(response.body).toHaveProperty('message')
  })
}) */