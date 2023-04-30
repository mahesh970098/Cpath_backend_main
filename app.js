const express = require('express');
global.validate = require('express-validation');
global.env = require('dotenv').config();
const app = express();
global.fs = require('fs');
global.stdCodes = require('./config/error_codes');//Error Codes Config File
global.jwt = require('jsonwebtoken');
// global.bcrypt = require('sha256');
global.validate = require('express-validation');
const bodyParser = require('body-parser');
const useragent = require('express-useragent');
global.logger = require('./config/logger');
global.path = require('path');
global.bcrypt = require("bcryptjs");
global.async = require('async');
global.sqldb = require('./config/dbconnect');//To establish a connection to particular DB
global.dbutil = require('./utils/dbutils');//Execute Query
global.multer = require('multer');//file upload Module
global.upload = multer();//file upload Module
global.moment = require('moment');
process.env["NO_PROXY"] = "*";
// //global.email_service = require('./utils/mail_services'); //send a E-mail from AWS-SES //
app.use(useragent.express());
app.use(bodyParser.json({ limit: '100mb' }));
app.use(bodyParser.urlencoded({ limit: '100mb', extended: true }));

app.use(express.static('public'));
app.use(logErrors);
app.use('/filestorage', express.static(path.join(__dirname, '/filestorage')))

app.use(function (req, res, next) {
  // console.log(req.headers.origin,"%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%^^^")
  logger.info("Requested URL : ", req.header);
  logger.info(req.url);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,Accept,authorization');
  res.setHeader('Access-Control-Allow-Credentials', true);
  if ('OPTIONS' == req.method || req.url == '/favicon.ico') {
    return res.status(200).send('OK');
  } else {
    next();
  }
});
// app.use(express.static('public'));
// app.use(logErrors);

app.use('/', require('./routes/routes'));
app.use((err, req, res, next) => {
  if (err instanceof validate.ValidationError) {
    res.status(err.status).json(err);
  } else {
    res.status(500)
      .json({
        status: err.status,
        message: err.message
      });
  }
});
function logErrors(err, req, res, next) {
  logger.error(err.stack);
  next(err);
}
app.get('/', function (req, res) {
  res.send("CharisPathWay Api server is listening");
});
let server = app.listen(5555, function () {
  let [host, port] = [server.address().address, server.address().port];
  logger.debug('CharisPathWay API server is listening at http://%s:%s', host, port);


  // let pwd='$2y$10$mM4qp2XnFonvOGd5NAqOP.h2.VrY6sj2dQbjwcaONJzFHTH7bFJqa'
  // bcrypt.compare('Test@123', pwd, function(err, res) {
  //         if(res==true){
  //           console.log("true")
  //         }
  //         else
  //         {
  //           console.log('false',res)
  //         }
  //       })


  //   let nodemailer=require('nodemailer')
  //   let transporter=nodemailer.createTransport({
  //     host: "smtp.mailtrap.io",
  //     port: 2525,
  //     // host: 'smtp.gmail.com',
  //     // host:'smtp.ethereal.email',
  //     // port: 3535,
  //     // secure: false,
  //     service: 'startupindia',
  //     auth:{
  //       // user:'sreeram1807@gmail.com',
  //       user:'f88f81279ac992',
  //       pass:'06100516dd485b'
  //       // pass:'Dataevolve@1234'
  //     }
  //   })

  // let mailOptions={
  //   from:'no-reply@startupindia.gov.in',
  //   // from:'sreeram1807@gmail.com',
  //   to:'teja@dataevolve.in',
  //   subject:'Testing Mail',
  //   text:'This is Testing Mail of Seedfund#Tej'
  // }

  // transporter.sendMail(mailOptions,function(err,res){
  // if(err){
  //   console.log("IN ERROR",err)
  // }
  // else{
  //   console.log("MAIL SENT SUCCESSFULLY",res)
  // }
  // })
  // var mysql = require('mysql');
  //   const conn = mysql.createConnection(
  //     { host: 'localhost', user: 'root', /* MySQL User */ 
  //     password: 'root', /* MySQL Password */
  //       database: "charispathway" /* MySQL Database */ });
  //      /* IT SHOWS MYSQL CONNECT */
  //       conn.connect((err) => {
  //        if (err) throw err;
  //         console.log('Mysql Connected with App...');
  //        });
});
