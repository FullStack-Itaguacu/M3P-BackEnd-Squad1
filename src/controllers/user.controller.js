/**
 * Este endpoint deve cadastrar um usuário do tipo BUYER.

Rota usada: POST /user/signup

Dados a serem recebidos:

body:

recebe um objeto user com os dados:

fullname
cpf
birthDate
email
phone
password
E um array address de objetos contendo os campos:

zip
street
numberStreet
neighborhood
city
state
complement
lat
long
Após salvar os dados em suas respectivas tabelas, salvar o id de user e de endereço na tabela users_addresses.

Regras:

Somente os campos complement, lat e lon podem ser nulos
Os outros campos devem ser obrigatórios, a validação pode ser feita na model de user e address.
Os campos cpf e email devem ser únicos. Verificar no banco de dados se os valores do campo já existem.
O campo cpf e phone não pode conter caracteres especiais.
O campo email deve ser do tipo email.
O campo de senha deve ser criptografado e ter um mínimo de 8 caracteres, entre eles uma letra maiúscula, minúscula, caracter especial e um número.
O campo typeUser deve ser somente “BUYER” por default.
RESPOSTAS:

201: Em caso de sucesso na requisição, retornando um objeto contendo uma mensagem informando que os registros foram criados com sucesso
422: Quando um campo obrigatório não for preenchido. A validação deve estar tratada por campo.
409: Exceção de campos duplicados como CPF e EMAIL.
400: Exceção por campos mal formatados como email, telefone, cpf e senha.
 */
const User = require("../models/user");
const Address = require("../models/address");
require("../models/userAddress");
const { filtroBodySignUp } = require("../services/user.services");
const { estaNaBD } = require("../services/validators");

module.exports = {
  async signUp(req, res) {
    res.status(500);
    try {

      const user = req.body.user;
      const addresses = req.body.address;

      await filtroBodySignUp(user, addresses, res);

      const userCreated = await User.create(user);
      const addressesCreated = await Address.bulkCreate(addresses);

      userCreated.setAddresses(addressesCreated);

      return res.status(201).json({
        message: `${userCreated.name} seja bem vindo a plataforma, cadastramos satisfatoriamente você e seus endereços!`,
        cause: {
          new_user: {
            id: userCreated.id,
            name: userCreated.full_name,
            email: userCreated.email,
          },
          new_addresses: addressesCreated,
        },
        status : 201
      });
    } catch (error) {
      if(!error.cause){
        /*
        implementar logica para salvar
        o erro e notificar o dev 
        na versão 2.0
        */
        console.log(error)
      }
      return res.json({
        message:
          error.message ||
          "Ocorreu um erro, pode contatar nosso team de desenvolvimento no email bug_busters_team@dominio.com e enviar esta response nos ficaremos muito gratos em ajudar a resolver o problema, ou verificar a seguente informação para tentar resolver por si mesmo",
        status: error.status || 500,
        cause:
          error.cause ||
          "Desta vez quem falhou foi o dev, mas não se preocupe, ele já foi notificado e está trabalhando para resolver o problema o mais rápido possível",
        error: error.name,
      });
    }
  },
};
