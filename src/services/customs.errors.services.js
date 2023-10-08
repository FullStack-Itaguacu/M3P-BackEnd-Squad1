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
class OffsetIsNan extends CustomError {
  constructor() {
    super(
      "OffsetIsNan",
      "O valor do offset deve ser um número",
      "O valor do offset informado na path params não é um número",
      400
    );
  }
}
class LimitIsNan extends CustomError {
  constructor() {
    super(
      "LimitIsNan",
      "O valor do limit deve ser um número",
      "O valor do limit informado na path params não é um número",
      400
    );
  }
}
class NotNameReceivedError extends CustomError {
  constructor() {
    super(
      "NotNameReceived",
      "O nome do produto é obrigatório",
      "O nome do produto não foi informado na requisição",
      400
    );
  }
}
class NotTypeProductReceivedError extends CustomError {
  constructor() {
    super(
      "NotTypeProductReceived",
      "O tipo do produto é obrigatório",
      "O tipo do produto não foi informado na requisição",
      400
    );
  }
}
class TotalStockRequired extends CustomError {
  constructor() {
    super(
      "TotalStockRequired",
      "O total de estoque é obrigatório",
      "Não informou o campo total_stock no body é ele obrigatório",
      400
    );
  }
}
class NotDataToUpdate extends CustomError {
  constructor() {
    super(
      "NotDataToUpdate",
      "Nenhum dado para atualizar",
      "Nao informou nenhum dado na requisiçao para atualizar",
      400
    );
  }
}

class NotOwnerProduct extends CustomError {
  constructor() {
    super(
      "NotOwnerProduct",
      "Você não tem permissão para atualizar este produto",
      "Esta tentando atualizar um produto que não é seu",
      401
    );
  }
}

class ProductNotFound extends CustomError {
  constructor() {
    super(
      "ProductNotFound",
      "Produto não encontrado",
      "Produto não encontrado no banco de dados com o id informado",
      404
    );
  }
}
class EmptyNameReceivedError extends CustomError {
  constructor() {
    super(
      "EmptyNameReceived",
      "O nome do produto não pode ser vazio, caso não queira atualizar o nome do produto, não envie o campo name",
      "Requisição mal formatada, recebemos um string vazia no campo name ",
      422
    );
  }
}
class EmptyImageLinkReceivedError extends CustomError {
  constructor() {
    super(
      "EmptyImageLinkReceived",
      "O link da imagem não pode ser vazio, caso não queira atualizar o link da imagem, não envie o campo image_link",
      "Requisição mal formatada, recebemos um string vazia no campo image_link ",
      422
    );
  }
}
class EmptyDosageReceivedError extends CustomError {
  constructor() {
    super(
      "EmptyDosageReceived",
      "A dosagem não pode ser vazia, caso não queira atualizar a dosagem, não envie o campo dosage",
      "Requisição mal formatada, recebemos um string vazia no campo dosage ",
      422
    );
  }
}
class NegativeTotalStockValueReceivedError extends CustomError {
  constructor() {
    super(
      "NegativeValueReceived",
      "O valor não pode ser negativo",
      "Requisição mal formatada, recebemos um valor negativo no campo total_stock ",
      422
    );
  }
}
class InvalidKeysReceivedError extends CustomError {
  constructor() {
    super(
      "InvalidKeysReceived",
      "Chaves inválidas recebidas na requisição verifique que so esta enviando as chaves name, image_link, dosage e total_stock",
      "Requisição mal formatada, recebemos chaves inválidas no body",
      422
    );
  }
}
class TotalStockIsNanError extends CustomError {
  constructor() {
    super(
      "TotalStockIsNan",
      "O valor de total_stock deve ser um número",
      "O valor da total_stock informado no body não é um número",
      422
    );
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
  // Caso o erro não foi tratado  nunca tera error.status, retornamos um erro 500 com mensagem genérica
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
  LimitIsNan,
  NotNameReceivedError,
  NotTypeProductReceivedError,
  TotalStockRequired,
  NotDataToUpdate,
  NotOwnerProduct,
  ProductNotFound,
  EmptyNameReceivedError,
  EmptyImageLinkReceivedError,
  EmptyDosageReceivedError,
  NegativeTotalStockValueReceivedError,
  InvalidKeysReceivedError,
  TotalStockIsNanError
};
