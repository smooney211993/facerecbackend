const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const register = require('./Controllers/Register');
const signin = require('./Controllers/Signin');
const image = require('./Controllers/image');
const cors = require('cors');
const knex = require('knex');
const db = knex({
    client: 'pg',
    connection: {
      connectionString : process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false
      }
      
    }
  });
const app = express();
const PORT = process.env.PORT || 4001;
const host = '0.0.0.0';
app.use(bodyParser.json());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});
app.use(cors())




app.get('/',(req,res,next)=>{
    res.send('I am working');
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

app.post('/imageurl', (req,res,next)=>{image.handleApiCall(req,res,next)})

app.listen(PORT,host, ()=>{
  console.log(`you are listening on ${PORT}`);
  
})


