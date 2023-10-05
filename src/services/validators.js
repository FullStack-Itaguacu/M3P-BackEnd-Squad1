const bcrypt = require("bcrypt");
const {WeakPasswordError}= require("./customs.errors.services")
//função para validar senha
async function validaSenha(senha) {
    const regex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*\W)[a-zA-Z0-9\W]{8,}$/;
    if (!regex.test(senha)) {
      throw new WeakPasswordError()

    }
    return regex.test(senha);
  }
  //funçao para validar email
  async function validaEmail(email) {
    // este regex e para validar email com domínio .com, .br, .net, etc
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!regex.test(email)) {
      throw new Error(
        "Email incorreto, verificar se e um e-mail valido, ex: name@example.com"
      );
    }
    return regex.test(email);
  }

  async function estaNaBD(modelo, columna, valor) {
    const achado = await modelo.findOne({
      where: {
        [columna]: valor,
      },
    });
    return achado ? true : false;
  }
  async function encriptarSenha(senha) {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(senha, salt);
    return hash;
  }
  async function desdenciptarSenha(senha, hash) {
    const valid = await bcrypt.compare(senha, hash);
    return valid;
  }
  module.exports = { validaSenha, validaEmail, estaNaBD , encriptarSenha, desdenciptarSenha};