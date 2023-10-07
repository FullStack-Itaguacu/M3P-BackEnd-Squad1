// const { loginUser, createOneUser } = require("../controllers/user.controller"); 
const { Router } = require("express");
const { signUp, login, loginAdmin } = require("../../controllers/user.controller");

class UserRouter {
  routesFromUser() {
    const userRoutes = Router();
    userRoutes.post("/user/login" , login);
    userRoutes.post("/user/signup", signUp);
    userRoutes.post("/user/admin/signup");
    userRoutes.get("/buyers/admin/:offset/:limit");
    userRoutes.get("/buyers/admin/:userId");
    userRoutes.patch("/buyers/admin/:userId");
    userRoutes.post("/user/admin/login", loginAdmin);

    return userRoutes;
  }
}

module.exports = new UserRouter();
