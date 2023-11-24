const UUID = require('uuid');
const Network = require('../models/Network');
const Transaction = require('../models/Transaction');
const Balance = require('../models/Balance');
const User = require('../models/User');

class Helpers{

  static generateRandomString(length){

  }

  static async generateUserXrefId(){
    let id = UUID.v4();
    while(await User.findOne({transactionId : id}) != null){
      id = UUID.v4();
    }
    return id;
  }

  static async generateTransactionUuidId(){
    let id = UUID.v4();
    while(await Transaction.findOne({transactionId : id}) != null){
      id = UUID.v4();
    }
    return id;
  }

  static async getNetworkStatus() {
    const status = await Network.find().select('status');
    return status;
  }

  static async checkUserBalanceIsEnough(userId,amount){
    const balance = await Balance.findOne({userId : userId});
    if(balance.amount >= amount){
      return true;
    }
    else{
      return false;
    }
  }
}

module.exports = Helpers;