class CustomError extends Error {
  constructor(name, message, cause, status) {
    super(message);
    this.name = name;
    this.cause = cause;
    this.status = status;
  }
}
class NotAddressesReceivedError extends CustomError {
  constructor() {
    super(
      "NotAddressesReceived",
      "Para o bom funcionamento da API, e necessário informar pelo menos um endereço, esperado um array de addresses",
      "Não foi informado nenhum endereço na requisição",
      422
    );
  }
}
class NotFieldsAddressReceivedError extends CustomError {
  constructor(nao_informado) {
    super(
      "NotFieldsAddressReceived",
      "Para o bom funcionamento da API, e necessário informar todos os campos orbigatorios do endereço dentro do array de addresses",
      `Não informado ${nao_informado} na requisição`,
      422
    );
  }
}
class NotUserReceivedError extends CustomError {
  constructor() {
    super(
      "NotUserReceived",
      "Para o bom funcionamento da API, e necessário informar pelo menos um usuário, esperado um objeto de user",
      "Não enviado objeto user na requisição",
      422
    );
  }
}

class UserAlredyExistError extends CustomError {
  constructor() {
    super(
      "UserAlreadyExists",
      "O usuário já existe na base de dados, caso queira atualizar os dados pessoais, utilize o endpoint PUT /api/users/:id",
      "Ja existe registro de dados pessoais para o usuário informado",
      409
    );
  }
}
class CpfUserAlredyExistError extends UserAlredyExistError {
  constructor() {
    super();
    this.cause = "CPF informado na requirição já esta  cadastrado";
  }
}
class EmailUserAlredyExistError extends UserAlredyExistError {
  constructor() {
    super();
    this.cause = "EMAIL  informado na requirição já esta  cadastrado";
  }
}
class NotFieldsUserReceivedError extends CustomError {
  constructor(nao_informado) {
    super(
      "NotFieldsUserReceived",
      "Para o bom funcionamento da API, e necessário informar todos os campos orbigatorios do usuário no objeto user",
      `Não informado ${nao_informado} na requisição, adicione os campos obrigatórios faltantes e tente novamente`,
      422
    );
  }
}
class WeakPasswordError extends CustomError {
  constructor() {
    super(
      "WeakPasswordError",
      "A senha deve ter no mínimo 8 caracteres, mínimo 1 letra maiúscula, mínimo 1 número e mínimo 1 caracteres",
      "A senha informada não cumpre os requisitos de segurança",
      400
    );
  }
}
class FieldEmailNotReceived extends CustomError {
  constructor() {
    super(
      "FieldEmailNotReceived",
      "O campo email é obrigatório",
      "O campo email não foi enviado",
      401
    );
  }
}
class FieldPasswordNotReceived extends CustomError {
  constructor() {
    super(
      "FieldPasswordNotReceived",
      "O campo password é obrigatório",
      "O campo password não foi enviado",
      401
    );
  }
}
class IncorrectFields extends CustomError {
  constructor() {
    super(
      "EmailOrPasswordIncorrects",
      "Email ou senha incorretos",
      "Email ou senha incorretos",
      401
    );
  }
}
class BuyerNotAllowed extends CustomError {
  constructor() {
    super(
      "BuyerNotAllowed",
      "Somente administradores pode efetuar o login",
      "Este usuário não pode efetuar login nesta página",
      403
    );
  }
}
class OffsetIsNan extends CustomError{
  constructor(){
    super(
      "OffsetIsNan",
      "O valor do offset deve ser um número",
      "O valor do offset informado na path params não é um número",
      400
    )
  }
}
class LimitIsNan extends CustomError{
  constructor(){
    super(
      "LimitIsNan",
      "O valor do limit deve ser um número",
      "O valor do limit informado na path params não é um número",
      400
    )
  }
}
async function errorLauncher(error, res) {
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
}
module.exports = {
  errorLauncher,
  NotAddressesReceivedError,
  NotFieldsAddressReceivedError,
  NotUserReceivedError,
  CpfUserAlredyExistError,
  EmailUserAlredyExistError,
  NotFieldsUserReceivedError,
  WeakPasswordError,
  FieldEmailNotReceived,
  FieldPasswordNotReceived,
  IncorrectFields,
  BuyerNotAllowed,
  OffsetIsNan, 
  LimitIsNan
};
