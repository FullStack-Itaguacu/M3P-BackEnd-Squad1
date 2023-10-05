// const { loginUser, createOneUser } = require("../controllers/user.controller"); 
const { Router } = require("express");
const { auth } = require("../../services/auth");

class UserRouter {
  routesFromUser() {
    const userRoutes = Router();
    userRoutes.post("/user/login");
    userRoutes.post("/user/signup");
    userRoutes.post("/user/admin/signup");
    userRoutes.get("/buyers/admin/:offset/:limit");
    userRoutes.get("/buyers/admin/:userId");
    userRoutes.patch("/buyers/admin/:userId");    

    return userRoutes;
  }
}

module.exports = new UserRouter();
