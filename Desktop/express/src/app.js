const express = require('express');
const morgan = require('morgan');
const HttpStatusCode = require('./utils/httpStatusCode.js');
const { getAllTasks, getTask, createTask, patchTask, putTask, deleteTask } = require('./controllers/taskController.js');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const AppError = require('./utils/appError.js');



dotenv.config({
    path: './.env'
});


const app = express();

// middleware - morgan
// Morgan est un middleware pour enregistrer les requêtes HTTP dans ton application Express.
app.use(morgan('dev'));

app.use(express.json());

// custom middleware
app.use((req, res, next) =>{
    req.requestTime = new Date().toISOString();
    console.log(req.requestTime);
    next();
})


// express env
// console.log(app.get('env'));
// node env
// console.log(process.env);


app.get('/', (req, res) => {
    res.send('Hello world!');
})
 

/// get all
app.get('/api/v1/tasks', getAllTasks);

/// get by id
app.get('/api/v1/tasks/:id', getTask);


/// add task
app.post('/api/v1/tasks', createTask);

/// patch (partiel)
app.patch('/api/v1/tasks/:id', patchTask);
 
/// put
app.put('/api/v1/tasks/:id', putTask);

/// delete task
app.delete('/api/v1/tasks/:id', deleteTask);



app.all('*', (req,res, next) =>{
    //res.status(HttpStatusCode.NOT_FOUND).json({
    //    status: 'fail',
    //    message: `Can't find ${req.originalUrl} on this server`
    //})
    //const err = new Error(`Can't find ${req.originalUrl} on this server`);
    //err.statusCode = HttpStatusCode.NOT_FOUND;
    //err.status= 'fail';
    next(new AppError(`Can't find ${req.originalUrl} on this server`, HttpStatusCode.NOT_FOUND));
    //next(err);
})

// error handler - middleware
app.use((err, req, res, next) =>{
    err.statusCode = err.statusCode || HttpStatusCode.INTERNAL_SERVER_ERROR;
    err.status = err.status || 'error';

    res.status(err.statusCode).json({
        status: err.status,
        message: err.message
    })
})




// setup the DB connection String
// connect to the mongo db

const DB = 'mongodb+srv://yasminebenghozzi:t.24EdjRyHbNdei@cluster0.xitto.mongodb.net/Tasks?retryWrites=true&w=majority&appName=Cluster0';
 
mongoose
    .connect(DB)
    .then(() => console.log('DB connection successful!'))
    .catch((err) => console.log(err));
app.listen(3000, () => console.log('Listening on port 3000'));  
