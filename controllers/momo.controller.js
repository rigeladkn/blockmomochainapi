const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");
const axios =  require('axios');
const User = require("../models/User");
const Balance = require("../models/Balance");
const BASE64 = require('crypto-js/enc-base64');


const createApiUser = asyncHandler(
 async function(user,product){
    try{
        const result = await axios.post(process.env.MOMO_SANDBOX_BASE_URL + '/v1_0/apiuser',{
            providerCallbackHost: "string"
        }, {
            headers: {
            "Ocp-Apim-Subscription-Key" : product === 'COLLECTION' ? process.env.COLLECTION_OCP_APIM_SUBSCRIPTION_KEY : process.env.DISBURSEMENT_OCP_APIM_SUBSCRIPTION_KEY,
            "X-Reference-Id": product === 'COLLECTION' ? user.collectionXrefId : user.disbursementXrefId,
            'Cache-Control':'no-cache'
        }});
        if(result.status == 201){
            return true;
        }
        else{
            return false;
        }
    } catch (error) {
        await User.deleteOne({_id:user._id});
        console.log(error);
        return false;
    }
 }
);

const createApiKey = asyncHandler(async function(user,product){
    try{
        const result = await axios.post(process.env.MOMO_SANDBOX_BASE_URL + '/v1_0/apiuser/'+  (product === 'COLLECTION' ? user.collectionXrefId : user.disbursementXrefId) +'/apikey',{},{
            headers: {
            "Ocp-Apim-Subscription-Key" : product === 'COLLECTION' ? process.env.COLLECTION_OCP_APIM_SUBSCRIPTION_KEY : process.env.DISBURSEMENT_OCP_APIM_SUBSCRIPTION_KEY,
            'Cache-Control':'no-cache'
        }});
        if(result.status == 201){
            return result.data.apiKey;
        }
        else{
            return null;
        }
    } catch (error) {
        await User.deleteOne({_id:user._id});
        console.log(error);
        return null;
    }
});

const getAccessToken = asyncHandler(async function(user,product){
    try{
        const credentials = (product === 'COLLECTION' ? user.collectionXrefId : user.disbursementXrefId) + ':' + (product === 'COLLECTION' ? user.collectionApiKey : user.disbursementApiKey);
        const result = await axios.post(process.env.MOMO_SANDBOX_BASE_URL + (product === 'COLLECTION' ? '/collection/token/' : '/disbursement/token/'),{},{
            headers: {
            "Authorization" : 'Basic ' +  Buffer.from(credentials).toString('base64'),
            "Ocp-Apim-Subscription-Key" : product === 'COLLECTION' ? process.env.COLLECTION_OCP_APIM_SUBSCRIPTION_KEY : process.env.DISBURSEMENT_OCP_APIM_SUBSCRIPTION_KEY,
            'Cache-Control':'no-cache'
        }});
        if(result.status == 200){
            return result.data.access_token;
        }
        else if(result.status == 401){
            result.status(401);
            throw new Error('Unauthorized !');
        }
        else{
            return null;
        }
    } catch (error) {
        console.log(error);
        return null;
    }
});



const transfert = asyncHandler(async function(currentUser,receiver,amount,transactionXrefId){
    try{
        const result = await axios.post(process.env.MOMO_SANDBOX_BASE_URL + '/disbursement/v1_0/transfer',{
                "amount": amount,
                "currency": "EUR",
                "externalId": "string",
                "payee": {
                    "partyIdType": "MSISDN",
                    "partyId": receiver.phone
                },
                "payerMessage": "Allow transfert " + amount+ "EUR from your account to " + receiver.phone,
                "payeeNote": "string"
        },{
            headers: {
            "Authorization" : 'Bearer ' +  currentUser.disbursementAccessToken,
            "Ocp-Apim-Subscription-Key" : process.env.DISBURSEMENT_OCP_APIM_SUBSCRIPTION_KEY,
            "X-Reference-Id": transactionXrefId,
            "Cache-Control": 'no-cache',
            "Content-Type" : "application/json",
            "X-Target-Environment": 'sandbox',
            // "X-Callback-Url" : 'string'
        }});
        if(result.status == 202){
            return true;
        }
        else if(result.status == 401){
            result.status(401);
            throw new Error('Unauthorized !');
        }
        else{
            return false;
        }
    } catch (error) {
        console.log(error);
        return false;
    }
});


const requestToPay = asyncHandler(async function(user,amount,transactionXrefId){
    try{
        const result = await axios.post(process.env.MOMO_SANDBOX_BASE_URL + '/collection/token/',{
                "amount": amount,
                "currency": "EUR",
                "externalId": "string",
                "payer": {
                    "partyIdType": "MSISDN",
                    "partyId": user.phone
                },
                "payerMessage": "Allow withdraw " + amount+ "EUR from your account",
                "payeeNote": "string"
        },{
            headers: {
            "Authorization" : 'Bearer ' +  user.accessToken,
            "Ocp-Apim-Subscription-Key" : process.env.COLLECTION_OCP_APIM_SUBSCRIPTION_KEY,
            "X-Reference-Id": transactionXrefId,
            'Cache-Control':'no-cache'
        }});
        if(result.status == 200){
            return result.data.access_token;
        }
        else if(result.status == 401){
            result.status(401);
            throw new Error('Unauthorized !');
        }
        else{
            return null;
        }
    } catch (error) {
        console.log(error);
        return null;
    }
});

module.exports = {createApiUser,createApiKey,getAccessToken,transfert,requestToPay};