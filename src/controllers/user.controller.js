const bcrypt = require("bcrypt");
const { errorResponse, successResponse } = require("../services/validators");
const { generateToken } = require("../services/auth");
const User = require("../models/user");
const Address = require("../models/address");
require("../models/userAddress");

const {
  filtroBodySignUp,
  errorLauncher,
  successMessage,
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

      successMessage(res, userCreated, addressesCreated);
    } catch (error) {
      errorLauncher(error, res);
    }
  },
  async login(req, res) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return errorResponse(res, "Email e senha são obrigatórios", 401);
      }

      const user = await User.findOne({ where: { email } });
      if (!user) {
        return errorResponse(res, "Usuário não encontrado", 400);
      }

      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return errorResponse(res, "Senha ou E-mail incorreta", 401);
      }

      const tokenPayload = {
        type_user: user.type_user,
        email: user.email,
        full_name: user.full_name,
        id: user._id,
      };

      const token = generateToken(tokenPayload);
      return successResponse(res, { token }, "Autenticação bem-sucedida");
    } catch (error) {
      return errorResponse(res, "Erro interno do servidor", 500, error.message);
    }
  },
};

