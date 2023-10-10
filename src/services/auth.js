const e = require("cors");
const { verify, sign } = require("jsonwebtoken");

module.exports = {
  // funcao para validar o token do usuario
  async tokenValidate(req, res, next) {
    try {
      const token = req.headers.authorization;

      if (!token) {
        return res.status(401).json({
          status: 401,
          message: "Not token provided",
          error: "NotTokenProvidedError",
          cause: "Token não fornecido",
        });
      }

      const payload = verify(token, process.env.JWT_KEY);

      if (payload) {
        req.payload = payload;
      }

      if (payload) {
        req.user = payload;
        next();
      } else {
        return res.status(401).json({
          status: 401,
          message: "Invalid token",
          error: "TokenInvalidError",
          cause: "Token invalido, faça login novamente",
        });
      }
    } catch (error) {
      return res.status(401).json({
        status: 401,
        message: "Não foi possivel validar o token, faça login novamente",
        error: "TokenInvalidError",
        cause: error.message,
      });
    }
  },
  // funcao para validar se tem um payload na requisição e se o tipo de usuário é admin
  async adminValidate(req, res, next) {
    try {
      const payload = req.payload;

      if (!payload) {
        return res.status(401).json({
          status: 401,
          message: "Payload not found",
          error: "PayloadNotFoundError",
          cause: "Payload não encontrado , faça login novamente",
        });
      }

      if (!payload.type_user || payload.type_user !== "Admin") {
        return res.status(401).json({
          status: 401,
          message: "Unauthorized",
          error: "UnauthorizedError",
          cause: "Somente administradores podem acessar este recurso",
        });
      }else{
        next();}

    } catch (error) {
      return res.status(500).json({
        status: 500,
        message: "Internal server error",
        error: "InternalServerError",
        cause: error.message,
      });
    }
  },
  // funçao para gerar o token do usuario
  async tokenGenerator(user) {
    const payload = {
      id: user.id,
      email: user.email,
      type_user: user.type_user,
    };
    const token = sign(payload, process.env.JWT_KEY, {
      expiresIn: "1d",
    });
    return token;
  },
};
