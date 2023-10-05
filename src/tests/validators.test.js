// BEGIN: 1b2c3d4e5f6g

const { validaSenha, validaEmail } = require('../services/validators.js');

describe('validaSenha', () => {
  it('should return true for a valid password', async () => {
    const result = await validaSenha('Abc123!@#');
    expect(result).toBe(true);
  });

  it('should throw an error for a password with less than 8 characters', async () => {
    await expect(validaSenha('Abc123!')).rejects.toThrow(
      'A senha deve ter no mínimo 8 caracteres, mínimo 1 letra maiúscula, mínimo 1 número e mínimo 1 caracteres'
    );
  });

  it('should throw an error for a password without an uppercase letter', async () => {
    await expect(validaSenha('abc123!@#')).rejects.toThrow(
      'A senha deve ter no mínimo 8 caracteres, mínimo 1 letra maiúscula, mínimo 1 número e mínimo 1 caracteres'
    );
  });

  it('should throw an error for a password without a number', async () => {
    await expect(validaSenha('Abcdefg!@#')).rejects.toThrow(
      'A senha deve ter no mínimo 8 caracteres, mínimo 1 letra maiúscula, mínimo 1 número e mínimo 1 caracteres'
    );
  });

  it('should throw an error for a password without a special character', async () => {
    await expect(validaSenha('Abc123456')).rejects.toThrow(
      'A senha deve ter no mínimo 8 caracteres, mínimo 1 letra maiúscula, mínimo 1 número e mínimo 1 caracteres'
    );
  });
});

describe('validaEmail', () => {
  it('should return true for a valid email', async () => {
    const result = await validaEmail('name@example.com');
    expect(result).toBe(true);
  });

  it('should throw an error for an email without an @ symbol', async () => {
    await expect(validaEmail('nameexample.com')).rejects.toThrow(
      'Email incorreto, verificar se e um e-mail valido, ex: name@example.com'
    );
  });

  it('should throw an error for an email without a domain', async () => {
    await expect(validaEmail('name@')).rejects.toThrow(
      'Email incorreto, verificar se e um e-mail valido, ex: name@example.com'
    );
  });

  it('should throw an error for an email with an invalid domain', async () => {
    await expect(validaEmail('name@example')).rejects.toThrow(
      'Email incorreto, verificar se e um e-mail valido, ex: name@example.com'
    );
  });
});

// END: 1b2c3d4e5f6g