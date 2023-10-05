const { estaNaBD } = require("./validators");
const User = require("../models/user");

module.exports = {
  async filtroBodySignUp(user, addresses) {
    // Validação de campos obrigatórios do endereço
    if (!addresses) {
      const error = new Error();
        error.name = "NotAddressesRecived",
        error.message = "Para o bom funcionamento da API, e necessário informar pelo menos um endereço",
        error.cause = "Não foi informado nenhum endereço na requisição";
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

          const error = new Error();
            error.name = "NotFieldsAddressRecived",
            error.message = "Para o bom funcionamento da API, e necessário informar todos os campos orbigatorios do endereço",
            error.cause = `Não informado ${nao_informado} na requisição`;
            error.status = 422;

          throw error;
        }
      });
    }

    // Validação de campos obrigatórios do usuário
    const { full_name, cpf, birth_date, email, phone, password } = user;
    if (!user) {
      const error = new Error();
        error.name = "NotUserRecived",
        error.message = "Para o bom funcionamento da API, e necessário informar pelo menos um usuário",
        error.cause = "Não informado usuário na requisição";
      error.status = 422;

      throw error;
    }
    if (await estaNaBD(User, "cpf", cpf)) {
      const error = new Error();
        error.name = "UserAlreadyExists",
        error.message = "O usuário já existe na base de dados",
        error.cause = `CPF ${cpf} já cadastrado`;
        error.status = 409;

      throw error;
    }
    if (await estaNaBD(User, "email", email)) {
      const error = new Error();
      (error.name = "UserAlreadyExists"),
        (error.message = "O usuário já existe na base de dados"),
        (error.cause = `EMAIL ${email} já cadastrado`);
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

      const error = new Error();
      error.name = "NotFieldsUserRecived",
        error.message =
          "Para o bom funcionamento da API, e necessário informar os seguintes campos:",
        error.cause = `Não informado ${nao_informado} na requisição`;
      error.status = 422;

      throw error;
    }
  },
  async errorLauncher(error, res) {
    if (!error.cause) {
      /*
        implementar logica para salvar
        o erro e notificar o dev 
        na versão 2.0
        */
      console.log(error);
    }
    //Se o erro for de validação do sequelize ele retorna um erro 400 por se tratar de uma requisição mal formatada
    if (error.name === "SequelizeValidationError") {
      return res.status(400).json({
        message: error.message,
        cause:
          "Requisição mal formatada, verifique os campos obrigatórios e tente novamente",
        status: 400,
        error: "BadFormatRequest",
      });
    }
    // Caso o erro não foi tratado no filtroBodySignUp nunca tera error.status, retornamos um erro 500 com mensagem generica
    return res.status(error.status || 500).json({
      message:
        error.message ||
        "Ocorreu um erro, pode contatar nosso team de desenvolvimento no email bug_busters_team@dominio.com e enviar esta response nos ficaremos muito gratos em ajudar a resolver o problema, ou verificar a seguente informação para tentar resolver por si mesmo",
      status: error.status || 500,
      cause:
        error.cause ||
        "Desta vez quem falhou foi o dev :(, mas não se preocupe, ele já foi notificado e está trabalhando para resolver o problema o mais rápido possível",
      error: error.name,
    });
  },
  async successMessage(res, userCreated, addressesCreated) {
    const addressInfo = addressesCreated.reduce((acc, address) => {
      acc.push({
        zip: address.zip,
        street: address.street,
        number_street: address.number_street,
        neighborhood: address.neighborhood,
        city: address.city,
        state: address.state,
      });
      return acc;
    }, []);

    return res.status(201).json({
      message: `${userCreated.full_name} seja bem vindo a plataforma, cadastramos satisfatoriamente você e seus endereços!`,
      cause: {
        new_user: {
          id: userCreated.id,
          full_name: userCreated.full_name,
          email: userCreated.email,
        },
        new_addresses: addressInfo,
      },
      status: 201,
    });
  },
};
