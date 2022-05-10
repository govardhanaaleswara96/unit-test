const app = require("../server");
const mongoose = require("mongoose");
const supertest = require("supertest");
const userModel = require("../models/user");


beforeEach((done) => {
  mongoose.connect("mongodb://localhost:27017/users",
    { useNewUrlParser: true, useUnifiedTopology: true },
    () => done());
});

// afterEach((done) => {
//   mongoose.connection.db.dropDatabase(() => {
//     mongoose.connection.close(() => done())
//   });
// });

test("create user POST /api/users", async () => {
    const user = await userModel.create({ firstName:"Govardhan",
    lastName:"Aaleswara",
    email:"goabala@gmail.com",
    password:"123",
    permissionLevel:1,
    mobile:"6382276063" 
});
  
    await supertest(app).get("/user")
      .expect(201)
      .then((response) => {
          let userList = response.body.userList;
        // Check type and length
        expect(Array.isArray(userList)).toBeTruthy();  
        // Check data
        expect(userList[0].firstName).toBe(user.firstName);
        expect(userList[0].lastName).toBe(user.lastName);
        expect(userList[0].email).toBe(user.email);
        expect(userList[0].permissionLevel).toBe(user.permissionLevel);
        expect(userList[0].mobile).toBe(user.mobile);
      });
  });