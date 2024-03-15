const mongoose = require('mongoose');

const connection = async ( ) => {
    return await mongoose.connect(process.env.CONNECTION_STRING)
    .then(( ) => {
        console.log("DB connected")
    } ).catch((err) => {
        console.log("DB error : " + err)
    })
}
module.exports = connection