const { Router } = require("express");
const {signUp, adminSignUp} = require("../../controllers/user.controller");

class UserRouter {
  routesFromUser() {
    const userRoutes = Router();
    userRoutes.post("/user/login");
    userRoutes.post("/user/signup", signUp);
    userRoutes.post("/user/admin/signup", adminSignUp);
    userRoutes.get("/buyers/admin/:offset/:limit");
    userRoutes.get("/buyers/admin/:userId");
    userRoutes.patch("/buyers/admin/:userId");    

    return userRoutes;
  }
}

module.exports = new UserRouter();
