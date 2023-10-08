function validateFields(fields) {
    // Verifica se o objeto é nulo ou indefinido
    if (!fields || Object.keys(fields).length === 0) {
      return {
        status: "422",
        error: "Erro, Não foi possível criar o produto",
        cause: "O corpo da requisição não pode ser vazio.",
      };
    }
  
    const requiredFields = ['name', 'lab_name', 'image_link', 'dosage'];
    for (const field of requiredFields) {
      // Verifica se o campo obrigatório está faltando
      if (!fields[field]) {
        return {
          status: "422",
          error: "Erro, Não foi possível criar o produto",
          cause: `O campo ${field} é obrigatório.`,
        };
      }
    }
  
    // Verifica se unit_price é menor ou igual a zero
    if (typeof fields.unit_price !== 'number' || fields.unit_price <= 0) {
      return {
        status: "422",
        error: "Erro, Não foi possível criar o produto",
        cause: "O campo unit_price deve ser maior que zero.",
      };
    }
  
    // Verifica se total_stock é menor que zero
    if (typeof fields.total_stock !== 'number' || fields.total_stock < 0) {
      return {
        status: "422",
        error: "Erro, Não foi possível criar o produto",
        cause: "O campo total_stock não pode ser menor que zero.",
      };
    }
  
    // Adicione mais validações conforme necessário
    // Verifica se type_product tem valor inválido
  if (!['controlled', 'uncontrolled'].includes(fields.type_product)) {
    return {
      status: "400",
      error: "Erro, Não foi possível criar o produto",
      cause: "Somente são aceitos os valores: 'controlled' e 'uncontrolled' no campo type_product.",
    };
  }

    return null;
  }
  
  module.exports = {
    validateFields,
  };
  