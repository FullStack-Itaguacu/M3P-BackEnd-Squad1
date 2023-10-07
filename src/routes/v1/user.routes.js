const { Router } = require("express");
const {signUp, adminSignUp} = require("../../controllers/user.controller");
const { tokenValidate, adminValidate } = require("../../services/auth");

class UserRouter {
  routesFromUser() {
    const userRoutes = Router();
    userRoutes.post("/user/login");
    userRoutes.post("/user/signup", signUp);
    userRoutes.post("/user/admin/signup", tokenValidate, adminValidate, adminSignUp);
    userRoutes.get("/buyers/admin/:offset/:limit");
    userRoutes.get("/buyers/admin/:userId");
    userRoutes.patch("/buyers/admin/:userId");    

    return userRoutes;
  }
}

module.exports = new UserRouter();
