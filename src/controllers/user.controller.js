const User = require("../models/user");
const Address = require("../models/address");
require("../models/userAddress");

const { filtroBodySignUp, errorLauncher, successMessage } = require("../services/user.services");
const{validaSenha, encriptarSenha}= require("../services/validators")

module.exports = {
  async signUp(req, res) {
    try {
      const user = req.body.user;
      const addresses = req.body.address;

      await filtroBodySignUp(user, addresses);
      await validaSenha(user.password);
      user.password = await encriptarSenha(user.password);

      const userCreated = await User.create(user);
      const addressesCreated = await Address.bulkCreate(addresses);
      userCreated.setAddresses(addressesCreated)
      
      successMessage(res, userCreated, addressesCreated)
      
    } catch (error) {
      errorLauncher(error, res);
    }
  },

  async adminSignUp(req, res) {
    try {
      const user = req.body.user;
      const addresses = req.body.address;

      await filtroBodySignUp(user, addresses);
      await validaSenha(user.password);
      user.password = await encriptarSenha(user.password);
      user.type_user = "Admin";
      user.created_by = 1;

      const userCreated = await User.create(user);
      const addressesCreated = await Address.bulkCreate(addresses);
      userCreated.setAddresses(addressesCreated)
      
      successMessage(res, userCreated, addressesCreated)
      
    } catch (error) {
      errorLauncher(error, res);
    }
  }
};
