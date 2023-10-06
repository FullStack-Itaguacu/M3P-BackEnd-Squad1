const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt"); // Importando o bcrypt
const User = require("../models/user");

module.exports = {
  async login(req, res) {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({
        statusCode: 400,
        message: "Requisição mal-formatada",
        error: "Bad Request",
        cause: "Email e senha são obrigatórios",
      });
    }
    try {
      
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(400).json({
          statusCode: 400,
          message: "Usuário não encontrado",
          error: "Bad Request",
        });
      }
      // Compara a senha informada com a senha criptografada no banco 
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(400).json({
          statusCode: 400,
          message: "Senha ou E-mail incorreta",
          error: "Bad Request",
        });
      }

      const token = jwt.sign(
        {
          type_user: user.type_user,
          email: user.email,
          full_name: user.full_name,
          id: user._id,
        },
        process.env.JWT_KEY,
        { expiresIn: "12h" }
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
