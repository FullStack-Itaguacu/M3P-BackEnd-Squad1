const bcrypt = require("bcrypt");
const {
  errorResponse,
  successResponse,
  verificaNumeroPositivo,
  verificaSomenteNumeros,
} = require("../services/validators");
const { tokenGenerator } = require("../services/auth");
const User = require("../models/user");
const Address = require("../models/address");
require("../models/userAddress");
const { sign, verify } = require("jsonwebtoken");

const {
  filtroBodySignUp,
  errorLauncher,
  successMessage,
  filtroBodyLoginAdmin,
  verifyPassword,
  validateUserType,
  verifyUserId,
  verifyCpfExist,
  verifyTypeUser,
} = require("../services/user.services");
const {
  validaSenha,
  encriptarSenha,
  desdenciptarSenha,
} = require("../services/validators");

module.exports = {
  async signUp(req, res) {
    try {
      const user = req.body.user;
      const addresses = req.body.address;

      await filtroBodySignUp(user, addresses);
      await validaSenha(user.password);
      user.password = await encriptarSenha(user.password);
      // fixando o tipo de usuário como Buyer para evitar que o usuário se cadastre como Admin
      user.type_user = "Buyer";

      const userCreated = await User.create(user);
      const addressesCreated = await Address.bulkCreate(addresses);
      userCreated.setAddresses(addressesCreated);
      successMessage(res, userCreated, addressesCreated);
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
      const { email, password } = req.body;

      await filtroBodyLoginAdmin(email, password);

      const userExist = await User.findOne({ where: { email } });

      const userPassword = await desdenciptarSenha(
        password,
        userExist.password
      );

      await verifyPassword(userPassword);
      await verifyTypeUser(userExist.type_user);

      const payload = {
        id: userExist.id,
        type_user: userExist.type_user,
        email: userExist.email,
        full_name: userExist.full_name,
      };
      const token = sign(payload, process.env.JWT_KEY);

      return res.status(200).send({
        Status: 200,
        Message: "Login efetuado com sucesso",
        data: token,
      });
    } catch (error) {
      errorLauncher(error, res);
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

  async listOneBuyer(req, res) {
    try {
      const { user_id } = req.params;

      await verificaNumeroPositivo(user_id, "user_id");
      await verificaSomenteNumeros(user_id, "user_id");

      const data = await verifyUserId(user_id);

      return res.status(200).send({
        status: 200,
        message: "Sucesso",
        data,
      });
    } catch (error) {
      errorLauncher(error, res);
    }
  },
};
