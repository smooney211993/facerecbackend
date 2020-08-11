const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const knex = require('knex');
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

const PORT = process.env.PORT || 4001;
let id = 124


app.use(bodyParser.json());
app.use(cors())




app.get('/', (req , res, next)=>{
    res.send('working');
})

app.post('/signin', async (req, res, next)=>{
    const {email, password} = req.body;
    try{
        const data = await db.select('email', 'hash').from('login')
        .where('email', '=', email)
        if(bcrypt.compareSync(password, data[0].hash)){
            const user = await db.select('*')
            .from('users')
            .where('email', '=', email)
            res.send(user[0])
          } else {
              res.status(400).send('wrong credentials')
          }

    }catch(error){
        res.status(400).send('unable to connect')

    }


});

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

app.post('/register', async (req, res, next)=>{
    const {name, password, email} = req.body;
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    if (!email || !name || !password) {
        return res.status(400).json('incorrect form submission');
      }
    db.transaction(async(trx)=>{
        try{
            const loginEmail = await trx.insert({
                hash: hash,
                email: email
            }).into('login')
            .returning('email')
    
            const user = await trx('users')
            .returning('*')
            .insert({
                email: loginEmail[0],
                name: name,
                joined: new Date()
            })

            res.send(user[0])
            await trx.commit
        }catch(error){
            await trx.rollback
            res.status(400).send('unable to register')

        }
    })
})




app.put('/image',async (req, res, next)=>{
    const {id, count} = req.body
    const imageCount = count
    const entries = await  db('users').where('id', '=', id)
    .increment('entries', count)
    .returning('entries')
    res.send(entries);    
   
})

app.listen(PORT, ()=>{
    console.log(`you are listening on ${PORT}`);
})

/*

/ res = 
/signin post succ or fail
/register post =  user
/profile/:userId get = user
/image put user

*/
