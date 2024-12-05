const admin = require('firebase-admin');

var serviceAccount = require("./socialnetworkingz-firebase-adminsdk-4r5b9-082796b454.json");

var firebase = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

module.exports = firebase;
