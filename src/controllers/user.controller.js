const User = require("../models/user");
const Address = require("../models/address");
require("../models/userAddress");
const { filtroBodySignUp, errorLauncher, successMessage } = require("../services/user.services");

module.exports = {
  async signUp(req, res) {
    try {
      const user = req.body.user;
      const addresses = req.body.address;

      await filtroBodySignUp(user, addresses);

      const userCreated = await User.create(user);
      const addressesCreated = await Address.bulkCreate(addresses);
      userCreated.setAddresses(addressesCreated)
      
      successMessage(res, userCreated, addressesCreated)
      
    
    } catch (error) {
      errorLauncher(error, res);
    }
  },
};
