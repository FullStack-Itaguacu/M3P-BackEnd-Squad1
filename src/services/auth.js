const { verify, sign } = require("jsonwebtoken");

module.exports = {
  // funcao para validar o token do usuario
  async tokenValidate(req, res, next) {
    try {
      const token = req.headers.authorization;

      if (!token) {
        return res.status(403).json({
          msg: "Not token provided",
          status: 403,
        });
      }

      const payload = verify(token, process.env.JWT_KEY);

      if (payload) {
        req.payload = payload;
      }

      next();
    } catch (error) {
      return res.status(401).json({
        msg: error.message,
        status: 401,
      });
    }
  },
  // funcao para validar se tem um payload na requisição e se o tipo de usuário é admin
  async adminValidate(req, res, next) {
    try {
      const payload = req.payload;

      if (!payload) {
        return res.status(403).json({
          msg: "Payload not found",
          status: 403,
        });
      }

      if (payload.type_user === "Admin") {
        next();
      } else {
        return res.status(403).json({
          msg: "User not admin",
          status: 403,
        });
      }
    } catch (error) {
      return res.status(401).json({
        msg: error.message,
        status: 401,
      });
    }
  },
  // funçao para gerar o token do usuario
  async tokenGenerator(payload, expiresIn = "1d") {
    const token = sign(payload, process.env.JWT_KEY, {
      expiresIn: expiresIn,
    });

    return token;
  },
};
