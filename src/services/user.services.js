const { estaNaBD } = require("./validators");
const User = require("../models/user");

const {
  NotAddressesReceivedError,
  NotFieldsAddressReceivedError,
  NotUserReceivedError,
  CpfUserAlredyExistError,
  EmailUserAlredyExistError,
  NotFieldsUserReceivedError,
  FieldEmailNotReceived,
  FieldPasswordNotReceived,
  IncorrectFields,
  BuyerNotAllowed,
  UserNotFound
} = require("./customs.errors.services");

module.exports = {
  async filtroBodySignUp(user, addresses) {
    // Validação de endereço
    if (!addresses) {
      throw new NotAddressesReceivedError();
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

          throw new NotFieldsAddressReceivedError(nao_informado);
        }
      });
    }

    // Validação de  usuário
    if (!user) {
      throw new NotUserReceivedError();
    }

    const { full_name, cpf, birth_date, email, phone, password } = user;


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

      throw new NotFieldsUserReceivedError(nao_informado);
    }

    if (await estaNaBD(User, "cpf", cpf)) {
      throw new CpfUserAlredyExistError();
    }
    if (await estaNaBD(User, "email", email)) {
      throw new EmailUserAlredyExistError();
    }
  },
  async errorLauncher(error, res) {
    if (!error.cause) {
      /*
        implementar logica para salvar
        o erro e notificar o dev 
        na versão 2.0
        */
      //console.log(error);
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
  async filtroBodyLoginAdmin(email, password) {

    if (!email) {
      throw new FieldEmailNotReceived();
    }

    if (!password) {
      throw new FieldPasswordNotReceived();
    }

    if (!await estaNaBD(User, "email", email)) {
      throw new IncorrectFields();
    }
  },
  async verifyTypeUser(type_user) {
    if (type_user !== "Admin") {
      throw new BuyerNotAllowed();
    }
  },
  async verifyPassword(userPassword) {
    if (!userPassword) {
      throw new IncorrectFields();
    }
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

  async validateUserType(type_user, res) {
    if (type_user !== "Admin" && type_user !== "Buyer") {
      return res.status(400).json({ message: "Tipo de usuário inválido" });
    }
  },
};
