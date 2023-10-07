const bcrypt = require("bcrypt");
const { errorResponse, successResponse } = require("../services/validators");
const { tokenGenerator } = require("../services/auth");
const User = require("../models/user");
const Address = require("../models/address");
require("../models/userAddress");
const { sign } = require('jsonwebtoken');

const { 
  filtroBodySignUp,
  errorLauncher,
  successMessage,
  filtroBodyLoginAdmin,
  verifyTypeUser,
  verifyPassword
} = require("../services/user.services");
const { validaSenha, encriptarSenha, desdenciptarSenha } = require("../services/validators")

const {
  filtroBodySignUp,
  errorLauncher,
  successMessage,
  validateUserType,
} = require("../services/user.services");
const { validaSenha, encriptarSenha } = require("../services/validators");

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
      userCreated.setAddresses(addressesCreated);
      
    } catch (error) {
      errorLauncher(error, res);
    }
  },

  async adminSignUp(req, res) {
    try {
      const user = req.body.user;
      const addresses = req.body.address;

      await filtroBodySignUp(user, addresses);
      await validaSenha(user.password);
      await validateUserType(user.type_user, res);
      user.password = await encriptarSenha(user.password);

      const userCreated = await User.create(user);
      const addressesCreated = await Address.bulkCreate(addresses);
      userCreated.setAddresses(addressesCreated);

      successMessage(res, userCreated, addressesCreated);
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

      await verifyPassword(userPassword)
      await verifyTypeUser(userExist.type_user)

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
  },

  async login(req, res) {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(401).json({
        statusCode: 401,
        message: "Requisição mal-formatada",
        error: "Bad Request",
        cause: "Email e senha são obrigatórios",
      });
    }
    try {
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(401).json({
          statusCode: 401,
          message: "Usuário não encontrado",
          error: "Bad Request",
        });
      }
      // Compara a senha informada com a senha criptografada no banco
      const valid = await desdenciptarSenha(password, user.password);
      if (!valid) {
        return res.status(401).json({
          statusCode: 401,
          message: "Senha ou E-mail incorreta",
          error: "Bad Request",
        });
      }

      const token = await tokenGenerator(user); // Aguarde a Promise ser resolvida
      return res.status(200).json({
        statusCode: 200,
        message: "Autenticação bem-sucedida",
        data: { token },
      });
    } catch (error) {
      return res.status(500).json({
        statusCode: 500,
        message: "Erro interno do servidor",
        error: "Internal Server Error",
        cause: error.message,
      });
    }
  },
};

