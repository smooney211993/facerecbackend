const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const register = require('./Controllers/Register');
const signin = require('./Controllers/Signin');
const image = require('./Controllers/Image');
const cors = require('cors');
const knex = require('knex');
const { handleApiCall } = require('./Controllers/Image');
const db = knex({
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      user : 'postgres',
      password : 'JonesbO21',
      database : 'smartbrain'
    }
  });
const app = express();
const PORT = process.env.PORT 
app.use(bodyParser.json());
app.use(cors())
app.get('/', (req , res, next)=>{
    res.send('working');
})
app.post('/signin', (req,res,next)=>{signin.handleSignin(req,res,next,db,bcrypt)});

app.param('userId', async (req,res,next, id)=>{
   try {
  const user = await db.select('*').from('users').where({id: id})
    if(user.length){
        req.user = user[0];
        next();
       } else {
        res.status(400).send('not found')
         }
    } catch(error){
        response.status(400).send('error getting request')
    }
}) 



app.get('/profile/:userId',(req,res,next)=>{
    res.send(req.user);    
})
app.post('/register', (req,res,next) =>{ register.handleRegister(req, res, next, db, bcrypt)})
app.put('/image', (req,res,next)=>{image.handleImage(req,res,next,db)})
app.listen(PORT, ()=>{
    console.log(`you are listening on ${PORT}`);
})
app.post('/imageurl', (req,res,next)=>{handleApiCall(req,res,next)})

/*

/ res = 
/signin post succ or fail
/register post =  user
/profile/:userId get = user
/image put user

*/
