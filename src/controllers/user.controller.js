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

module.exports = {
  async signUp(req, res) {
    try {
      const user = req.body.user;
      const addresses = req.body.address;

      const userCreated = await User.create(user);
      const addressesCreated = await Address.bulkCreate(addresses);

      userCreated.setAddresses(addressesCreated);

      return res
        .status(201)
        .json({ message: "Usuário cadastrado com sucesso!" });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Erro interno do servidor", error: error.message });
    }
  },
};
