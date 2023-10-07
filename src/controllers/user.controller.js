const User = require("../models/user");
const Address = require("../models/address");
require("../models/userAddress");
const { sign } = require('jsonwebtoken');

const { filtroBodySignUp, errorLauncher, successMessage, filtroBodyLoginAdmin, verifyTypeUser, verifyPassword } = require("../services/user.services");
const { validaSenha, encriptarSenha, desdenciptarSenha } = require("../services/validators")

module.exports = {
  async signUp(req, res) {
    try {
      const user = req.body.user;
      const addresses = req.body.address;

      await filtroBodySignUp(user, addresses);
      await validaSenha(user.password);
      user.password = await encriptarSenha(user.password);

      const userCreated = await User.create(user);
      const addressesCreated = await Address.bulkCreate(addresses);
      userCreated.setAddresses(addressesCreated)

      successMessage(res, userCreated, addressesCreated)

    } catch (error) {
      errorLauncher(error, res);
    }
  },

  async loginAdmin(req, res) {
    try {
      const { email, password } = req.body

      await filtroBodyLoginAdmin(email, password)

      const userExist = await User.findOne({ where: { email } })

      const userPassword = await desdenciptarSenha(password, userExist.password)
      if (!userPassword) {
        return res.status(401).send({
          status: 401,
          message: "Não foi possível cadastrar novo usuário.",
          cause: "Email ou senha incorretos."
        })
      }
      await verifyPassword(userPassword);

      await verifyTypeUser(userExist.type_user);
      const payload = {
        id: userExist.id,
        type_user: userExist.type_user,
        email: userExist.email,
        full_name: userExist.full_name
      }
      const token = sign(payload, process.env.JWT_KEY)

      return res.status(200).send({
        Status: 200,
        Message: "Login efetuado com sucesso",
        data: token
      })
    } catch (error) {
      errorLauncher(error, res)
    }
  }
};
