const jwt = require("jsonwebtoken");
const User = require("../models/user");

module.exports = {
  async login(req, res) {
    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email });

      if (!user || user.password !== password) {
        return res.status(401).json({
          statusCode: 401,
          message: "Credenciais inválidas",
          error: "Unauthorized",
          cause: "Invalid email or password",
        });
      }

      const token = jwt.sign(
        {
          type_user: user.type_user,
          email: user.email,
          full_name: user.full_name,
          id: user._id,
        },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

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
