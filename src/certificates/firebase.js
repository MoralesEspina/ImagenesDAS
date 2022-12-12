const admin = require('firebase-admin')
const json = require('./firebase.json');

admin.initializeApp({
    databaseURL: 'https://das-jalapa-default-rtdb.firebaseio.com',
    credential: admin.credential.cert(json),
    storageBucket: 'gs://das-jalapa.appspot.com'
})

const bucket = admin.storage().bucket();
const database = admin.database();

module.exports = {
    bucket,
    database
}
