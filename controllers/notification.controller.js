const admin  = require('firebase-admin');

async function test(req,res){
    var serviceAccount = require('../config/blockmomochainapp-firebase-adminsdk-h7hlw-13aa7ae794.json');

    const alreadyCreatedAps = admin.apps;
    console.log(alreadyCreatedAps);
     
    const app = alreadyCreatedAps.length == 0 ? admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
      }) : alreadyCreatedAps[0];
    // console.log(app);

    // const messaging = app.messaging();
    const message = {
        data: {
          score: '850',
          time: '2:45'
        },
        notification :{
          title : 'ffff',
          body : 'uuuu'
        },
        token: 'f_H4gdmXTPq4SgMFA1gYit:APA91bGYIBjND3enYCCEPkA_5Hlg-p6IESyFHmGAQjom7xLE7NcFXfLk5YtKInTboN9SiErG9HZfLAVFd-9ZaX8pUe0WGEDYEfEIaNggAF3fl3Rwdk7uzae1JPn-xMA-O7HywrEOJYMU'
      };
    const result = await admin.messaging().send(message);
    
    return res.status(200).json(result);
}

module.exports = {test};