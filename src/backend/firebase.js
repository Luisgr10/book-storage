require('dotenv').config();

console.log("Ruta de credenciales:", process.env.GOOGLE_APPLICATION_CREDENTIALS);

const { initializeApp, applicationDefault } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

initializeApp({
    credential: applicationDefault()
});

const db = getFirestore();

console.log("Firebase Admin inicializado y Firestore instanciado");

module.exports = {
    db,
};
