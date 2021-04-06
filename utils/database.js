require('dotenv').config({ path: '../.env'});
const mongoose = require('mongoose');
const uri = "mongodb+srv://" + process.env.DB_USER + ":" + process.env.DB_PASS + "@cluster0.gvwj0.mongodb.net/MarkComDB";

module.exports = () => {
        return mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex:true,useFindAndModify:false})
}