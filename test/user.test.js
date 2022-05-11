const mongoose = require('mongoose');
// const nock = require('nock')
const supertest = require('supertest');
const app = require('../server');
const request = supertest(app);
const userModel = require('../models/user');
const userDatas = require('../test/user.test.data');

// db connection
describe('user unit test API endpoints', () => {
  beforeAll(async () => {
    await mongoose.connect('mongodb://localhost:27017/testing', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify:false
    })
  })

  beforeEach(async () => {
    for (const userData of userDatas) {
      const newUser = new userModel({
      firstName:userData.firstName,
      lastName:userData.lastName,
      email:userData.email,
      password:userData.password,
      permissionLevel:userData.permissionLevel,
      mobile:userData.mobile
      })
      await newUser.save()
    }
  })

  afterEach(async () => {
    await userModel.deleteMany()
  })
 // db connection close
  afterAll(async () => {
    mongoose.connection.db.dropDatabase(() => {
      mongoose.connection.close(() => done())
    });
    // await userModel.dropDatabase()
    // await mongoose.connection.close()
  })
// get all users
  test('GET | get all users from database', async () => {
    const res = await request.get('/user');
    expect(res.status).toBe(201);
    let userList = res.body.userList;
    expect(userList.length).toBe(userDatas.length)
    expect(userList[0].firstName).toBe(userDatas[0].firstName)
    expect(userList[0].lastName).toBe(userDatas[0].lastName)
    expect(userList[0].email).toBe(userDatas[0].email)
    expect(userList[0].permissionLevel).toBe(userDatas[0].permissionLevel)
    expect(userList[0].mobile).toBe(userDatas[0].mobile)
  })
// create user 
  test('POST | save user to database with user data', async () => {
    let user = {
    firstName:"Govardhan",
    lastName:"Aaleswara",
    email:"goabala8@gmail.com",
    password:"123",
    permissionLevel:1,
    mobile:"6382276063"
  };
    const res = await request.post('/user').send(user);
    let userList = res.body.result;
    expect(res.status).toBe(201)
    expect(userList.firstName).toBe(user.firstName)
    expect(userList.lastName).toBe(user.lastName)
    expect(userList.email).toBe(user.email)
    expect(userList.permissionLevel).toBe(user.permissionLevel)
    expect(userList.mobile).toBe(user.mobile)
    const userDataById = await userModel.findById(userList._id)
    expect(userDataById.firstName).toBe(userList.firstName)
    expect(userDataById.lastName).toBe(userList.lastName)
    expect(userDataById.email).toBe(userList.email)
    expect(userDataById.permissionLevel).toBe(userList.permissionLevel)
    expect(userDataById.mobile).toBe(userList.mobile)
  })

 // get user by id
 test('GET | get user from database by id', async () => {
    const user = await userModel.findOne();
    const res = await request.get(`/user/${user._id}`);
    let userList = res.body.userList;
    expect(res.status).toBe(201)
    expect(userList.firstName).toBe(user.firstName)
    expect(userList.lastName).toBe(user.lastName)
    expect(userList.email).toBe(user.email)
    expect(userList.permissionLevel).toBe(user.permissionLevel)
    expect(userList.mobile).toBe(user.mobile)
  });

  test(`GET | returns message if user id doesn't exist`, async () => {
    const res = await request.get(`/user/${'id'}`);
    expect(res.status).toBe(404)
    expect(res.body.message).toBe('Cast to ObjectId failed for value "id" at path "_id" for model "user"')
  })

  test('PUT | update user by id', async () => {
    const user = await userModel.findOne()
    let userData = {
      firstName:"Govardhan",
      lastName:"A",
      email:"goabala888@gmail.com",
      password:"123",
      permissionLevel:1,
      mobile:"6382276063"
    }
    const res = await request.put(`/user/${user._id}`).send(userData);
    let userList = res.body.userResult;
    expect(res.status).toBe(201);
    expect(userList.firstName).toBe(userData.firstName);
    expect(userList.lastName).toBe(userData.lastName);
    expect(userList.email).toBe(userData.email);
    expect(userList.permissionLevel).toBe(userData.permissionLevel);
    expect(userList.mobile).toBe(userData.mobile);
    const rawUpdatedRes = await request.get(`/user/${userList._id}`);
    let updatedRes = rawUpdatedRes.body.userList;
    expect(updatedRes.firstName).toBe(userList.firstName)
    expect(updatedRes.lastName).toBe(userList.lastName)
    expect(updatedRes.email).toBe(userList.email)
    expect(updatedRes.permissionLevel).toBe(userList.permissionLevel)
    expect(updatedRes.mobile).toBe(userList.mobile)
  });

  // test(`PATCH | returns message if quote id doesn't exist`, async (done) => {
  //   const res = await request
  //     .patch(`/api/quotes/${'non existing id'}`)
  //     .send({ quote: 'updated quote', author: 'updated author' })

  //   expect(res.status).toBe(404)
  //   expect(res.body.message).toBe('Quote not found')
  //   expect(res.body.error).toBeTruthy()

  //   done()
  // })

  test('DELETE | delete user by id', async () => {
    const user = await userModel.findOne();
    const res = await request.delete(`/user/${user._id}`)
    expect(res.status).toBe(201);
    expect(res.body.message).toBe('User Removed')
  })

  // test(`DELETE | returns message if quote id doesn't exist`, async (done) => {
  //   const res = await request.delete(`/api/quotes/${'non existing id'}`)

  //   expect(res.status).toBe(404)
  //   expect(res.body.message).toBe('Quote not found')
  //   expect(res.body.error).toBeTruthy()

  //   done()
  // })

  test(`GET | Default response if endpoint doesn't exist`, async () => {
    const res = await request.get(
      `/user/${'non existing endpoint'}/${'non existing endpoint'}`,
    );
   expect(res.status).toBe(404)
  })

  test(`POST | Default response if endpoint doesn't exist`, async () => {
    const res = await request
      .post(`/user/${'non existing endpoint'}/${'non existing endpoint'}`)
      .send({ quote: 'QUOTE', author: 'AUTHOR' })
    expect(res.status).toBe(404)
  })

  test(`PUT | Default response if endpoint doesn't exist`, async () => {
    const res = await request
      .put(
        `/user/${'non existing endpoint'}/${'non existing endpoint'}`,
      )
      .send({ quote: 'updated quote', author: 'updated author' })
    expect(res.status).toBe(404)
  })

  test(`DELETE | Default response if endpoint doesn't exist`, async () => {
    const res = await request.delete(
      `/user/${'non existing endpoint'}/${'non existing endpoint'}`,
    )
    expect(res.status).toBe(404)
  })
})
