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
class NumberNotPositive extends CustomError {
  constructor(fieldName) {
    super(
      "NumberNotPositive",
      `O campo ${fieldName} deve possuir valor igual ou maior que zero.`,
      "Foi informado um valor abaixo de 0",
      400
    );
  }
}
class OnlyNumbers extends CustomError {
  constructor(fieldName) {
    super(
      "OnlyNumbers",
      `O campo ${fieldName} deve ser um número.`,
      "Foi recebido um caractere diferente de um número.",
      400
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
      "O campo total_stock no body é obrigatório",
      422
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
class NotAcceptValuesTypeProduct extends CustomError {
  constructor() {
    super(
      "NotAcceptValuesTypeProduct",
      "O campo tipo do produto recebeu um valor diferente dos possíveis.",
      "O tipo do produto somente aceita os valores: controlled e uncontrolled",
      400
    );
  }
}
class FullNameNotReceived extends CustomError {
  constructor() {
    super(
      "FullNameNotReceived",
      "O campo full_name é obrigatório, por favor informar na query params em formato string",
      "O nome completo não foi informado na requisição",
      400
    );
  }
}
class CreatedAtFieldNotReceived extends CustomError {
  constructor() {
    super(
      "CreatedAtFieldNotReceived",
      "O campo created_at é obrigatório, , informe ASC ou DESC para ordenar os resultados ascendentemente ou descendentemente respectivamente",
      "O campo created_at não foi informado na requisição",
      400
    );
  }
}
class CreatedAtBadValueReceived extends CustomError {
  constructor() {
    super(
      "CreatedAtBadValueReceived",
      "O campo created_at somente aceita os valores: ASC e DESC, verifique se o valor informado esta escrito corretamente",
      "O campo created_at recebeu um valor diferente dos possíveis.",
      400
    );
  }
}
class UserNotFound extends CustomError {
  constructor() {
    super(
      "UserNotFound",
      "Usuário não existe.",
      "Usuário não consta no banco de dados.",
      404
    );
  }
}
class FieldsTypeIncorrect extends CustomError {
  constructor(campo, tipo) {
    super(
      "FieldsTypeIncorrect",
      `O ${campo} informado deve ser do tipo ${tipo}.`,
      `O ${campo} recebeu outro tipo de dado que não é ${tipo}`,
      400
    );
  }
}
class CustomizableError extends CustomError {
  constructor(name, message, cause, status) {
    super();
    this.message = message;
    this.cause = cause;
    this.status = status;
    this.name = name;
  }
}
class NotAcceptValuesTypeUser extends CustomError {
  constructor() {
    super(
      "NotAcceptValuesTypeUser",
      "O campo tipo do usuário recebeu um valor diferente dos possíveis.",
      "O tipo do usuário somente aceita os valores: Admin e Buyer",
      400
    );
  }
}
class EmptyStringNotAllowed extends CustomError {
  constructor(field) {
    super(
      "EmptyStringNotAllowed",
      `O campo ${field} foi passado com valor vazio.`,
      `O campo ${field} não pode ser uma string vazia.`,
      400
    );
  }
}
class EmailNotFormated extends CustomError {
  constructor() {
    super(
      "EmailNotFormated",
      "O email informado não está formatado corretamente.",
      "O email informado não esta no formato correto. Ex.: teste@teste.com",
      400
    );
  }
}
class CpfWrongFormat extends CustomError {
  constructor() {
    super(
      "CpfWrongFormat",
      "O CPF informado deve possuir 11 números sem ponto ou traços.",
      "O CPF informado não esta no formato correto.",
      400
    );
  }
}
class PhoneWrongFormat extends CustomError {
  constructor() {
    super(
      "PhoneWrongFormat",
      "O telefone informado deve possuir entre 10 e 15 números sem ponto ou traços.",
      "O telefone informado não esta no formato correto.",
      400
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

  if (error.name.slice(0, 9) === "Sequelize") {
    console.log(error.name)
    return res.status(400).json({
      message: `Desculpa por favor, não tratamos 100% este erro pois tava uma correria!, porem não foi possível validar sua requirição para realizar alguma tarefa na base de dados , ela em inglês ta dizendo o seguente : ${error.message}, faz sentido para você ? revise por favor e tente novamente..`,
      cause:
        "Requisição mal formatada, verifique os campos obrigatórios e tente novamente",
      status: 400,
      error: "Sequelize Error",
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
  NumberNotPositive,
  OnlyNumbers,
  OffsetIsNan,
  LimitIsNan,
  NotNameReceivedError,
  NotTypeProductReceivedError,
  NotAcceptValuesTypeProduct,
  TotalStockRequired,
  NotDataToUpdate,
  NotOwnerProduct,
  ProductNotFound,
  EmptyNameReceivedError,
  EmptyImageLinkReceivedError,
  EmptyDosageReceivedError,
  NegativeTotalStockValueReceivedError,
  InvalidKeysReceivedError,
  TotalStockIsNanError,
  FullNameNotReceived,
  CreatedAtFieldNotReceived,
  CreatedAtBadValueReceived,
  UserNotFound,
  CustomizableError,
  FieldsTypeIncorrect,
  NotAcceptValuesTypeUser,
  EmptyStringNotAllowed,
  EmailNotFormated,
  CpfWrongFormat,
  PhoneWrongFormat
};
