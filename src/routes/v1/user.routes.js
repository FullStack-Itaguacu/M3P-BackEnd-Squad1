const { Router } = require("express");
const { signUp, login, loginAdmin, adminSignUp ,updateOneBuyer} = require("../../controllers/user.controller");
const { tokenValidate, adminValidate } = require("../../services/auth");

class UserRouter {
  routesFromUser() {
    const userRoutes = Router();
    userRoutes.post("/user/login" , login);
    userRoutes.post("/user/signup", signUp);
    userRoutes.post("/user/admin/signup", tokenValidate, adminValidate, adminSignUp);
    userRoutes.get("/buyers/admin/:offset/:limit");
    userRoutes.get("/buyers/admin/:userId");
    userRoutes.patch("/buyers/admin/:user_id",tokenValidate, adminValidate, updateOneBuyer);
    userRoutes.post("/user/admin/login", loginAdmin);

    return userRoutes;
  }
}

module.exports = new UserRouter();
