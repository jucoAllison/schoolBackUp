const express = require("express"),
path = require("path"),
helmet = require('helmet'),
morgan = require('morgan'),
mongoose = require("mongoose"),
app = express();
// cONNecTIng .eNV
require('dotenv').config();

// Settings the bodyParser ----MIDDLEWARE
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "teacher")));
app.use(express.static(path.join(__dirname, "student")));
app.use(express.static(path.join(__dirname, "management")));
app.use(helmet());
app.use(morgan());



// Handling Cors
app.use((req,res,next) => {
    res.header('Access-Control-Allow-Origin', '*');;
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, content-type, Authorization, Accept');
    if(req.method === 'OPTIONS'){
        res.header('Access-Control-Allow-Methods', 'PUT, POST, DELETE, GET, PATCH');
        return res.status(200).json({})
    }
    next()
})

// Routes
app.use('/admin', require('./api/routes/admin/admin'));
app.use('/teacher', require('./api/routes/teacher/teacher'));
app.use('/student', require('./api/routes/student/student'));

// Conecting the port
mongoose.connect("mongodb://127.0.0.1:27017")
.then(_ => {

  app.listen( process.env.PORT, () => console.log("app started at port " +  process.env.PORT));
})
.catch(err => console.log("Error :" + err + "Message : Common on your Server "))

// HAndling any other Errors
app.use((req,res,next) => {
    const error = new Error ("Oops Not Found");
    error.status = 404;
    next(error);
})

app.use((error,req,res,next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            Message: error.message
        }
    })
})