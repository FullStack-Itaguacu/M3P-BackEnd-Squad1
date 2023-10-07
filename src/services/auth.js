const { verify, sign } = require("jsonwebtoken");

module.exports = {
  // funcao para validar o token do usuario
  async tokenValidate(req, res, next) {
    try {
      const token = req.headers.authorization;

      if (!token) {
        return res.status(401).json({
          message: "Not token provided",
          status: 401,
          cause : "Token não fornecido",
          error : "NotTokenProvidedError"
        });
      }

      const payload = verify(token, process.env.JWT_KEY);

      if (payload) {
        req.payload = payload;
      }

      next();
    } catch (error) {
      return res.status(401).json({
        message: "Não foi possivel validar o token, faça login novamente",
        status: 401,
        cause : error.message,
        error : "TokenInvalidError"
      });
    }
  },
  // funcao para validar se tem um payload na requisição e se o tipo de usuário é admin
  async adminValidate(req, res, next) {
    try {
      const payload = req.payload;

      if (!payload) {
        return res.status(401).json({
          message: "Payload not found",
          status: 401,
          cause : "Payload não encontrado , faça login novamente",
          error : "PayloadNotFoundError"
        });
      }

      if (payload.type_user === "Admin") {
        next();
      } else {
        return res.status(403).json({
          message: "User not admin",
          status: 403,
          cause : "Usuario sem permissão para acessar essa rota",
          error : "UserNotAdminError"
        });
      }
    } catch (error) {
      return res.status(500).json({
        message: "Internal server error",
        status: 500,
        cause : error.message,
        error : "InternalServerError"
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
