const {estaNaBD}= require('./validators')
const User = require("../models/user");

module.exports = {
  async filtroBodySignUp(user, addresses, res) {

    // Validação de campos obrigatórios do endereço
    if (!addresses) {
      res.status(422);
      const error = new Error();
        error.name = "NotAddressesRecived",
        error.message ="Para o bom funcionamento da API, e necessário informar pelo menos um endereço",
        error.cause = "Não informado endereço na requisição";
        error.status = 422;

      throw error;
    }

    if (addresses.length > 0) {
      addresses.forEach((address) => {
        const { zip, street, number_street, neighborhood, city, state } =
          address;
        if (
          zip === undefined ||
          street === undefined ||
          number_street === undefined ||
          neighborhood === undefined ||
          city === undefined ||
          state === undefined
        ) {

          const nao_informado = [];
          if (zip === undefined) nao_informado.push("zip");
          if (street === undefined) nao_informado.push("street");
          if (number_street === undefined) nao_informado.push("number_street");
          if (neighborhood === undefined) nao_informado.push("neighborhood");
          if (city === undefined) nao_informado.push("city");
          if (state === undefined) nao_informado.push("state");

          res.status(422);
          const error = new Error();
            error.name = "NotFieldsAddressRecived",
            error.message ="Para o bom funcionamento da API, e necessário informar todos os campos orbigatorios do endereço",
            error.cause = `Não informado ${nao_informado} na requisição`;
            error.status = 422;

          throw error;
        }
      });
    }

    // Validação de campos obrigatórios do usuário
    const { full_name, cpf, birth_date, email, phone, password } = user;
    if(!user){
        res.status(422);
        const error = new Error();
            error.name = "NotUserRecived",
            error.message ="Para o bom funcionamento da API, e necessário informar pelo menos um usuário",
            error.cause = "Não informado usuário na requisição";
            error.status = 422;

        throw error;
    }
    if(await estaNaBD(User, 'cpf', cpf)){
        res.status(409);
        const error = new Error();
            error.name = "UserAlreadyExists",
            error.message ="O usuário já existe na base de dados",
            error.cause = `CPF ${cpf} já cadastrado`;
            error.status = 409;

        throw error;
    }
    if(await estaNaBD(User, 'email', email)){
        res.status(409);
        const error = new Error();
            error.name = "UserAlreadyExists",
            error.message ="O usuário já existe na base de dados",
            error.cause = `EMAIL ${email} já cadastrado`;
            error.status = 409;

        throw error;
    }

    if (
      full_name === undefined ||
      cpf === undefined ||
      birth_date === undefined ||
      email === undefined ||
      phone === undefined ||
      password === undefined
    ) {
      const nao_informado = [];
      if (full_name === undefined) nao_informado.push("full_name");
      if (cpf === undefined) nao_informado.push("cpf");
      if (birth_date === undefined) nao_informado.push("birth_date");
      if (email === undefined) nao_informado.push("email");
      if (phone === undefined) nao_informado.push("phone");
      if (password === undefined) nao_informado.push("password");

      res.status(422);
      const error = new Error();
        error.name = "NotFieldsUserRecived",
        error.message ="Para o bom funcionamento da API, e necessário informar os seguintes campos:",
        error.cause = `Não informado ${nao_informado} na requisição`;
        error.status = 422;

      throw error;
    }
  },
};
