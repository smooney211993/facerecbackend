const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const knex = require('knex');
const { response } = require('express');
const db = knex({
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      user : 'postgres',
      password : 'JonesbO21',
      database : 'smartbrain'
    }
  });

  db.select('*').from('users').then(data=>console.log(data));




const app = express();

const PORT = process.env.PORT || 4001;
let id = 124

/*const dataBase = {
    users: [
        {
            id: '123',
            name: 'Stephen',
            password: 'cookies',
            entries : 0,
            email: 'stephen@gmail.com',
            joined: new Date()
        },
        {
            id: '124',
            name: 'holby',
            password: 'schnob',
            email: "holby@gmail.com",
            entries: 0,
            joined: new Date()

        }
    ]
}
*/

app.use(bodyParser.json());
app.use(cors())




app.get('/', (req , res, next)=>{
    res.send('this is working bitch tits');
})

app.post('/signin', (req, res, next)=>{
    bcrypt.compare(req.body.password, '$2a$10$dHoVH.wq9LVgZLbcsE.x4.xi2jaeuuhskNkL2QX9c1zzfjUUWZNme', function(err, res) {
       console.log(res)
    });
     
     /*if(req.body.email === dataBase.users[2].email && 
        req.body.password === dataBase.users[2].password) {
        res.json('success')
    } else {
        res.status(400).json('error logging in')
    } */

    const found = dataBase.users.find(user=>{
       return  user.password === req.body.password && user.email === req.body.email
    })
    console.log('found' + found)
    if(found) {
        res.json(found)
        console.log(found)
    } else {
        res.status(400).json('error logging in')
    }

});

app.param('userId',(req,res,next, id)=>{
    /*const found = dataBase.users.find(user=> user.id === id)
    if(found){
        req.user = found;
        next();
    } else {
        res.status(404).send()
    }
    */
   db.select('*').from('users').where({id: id}).then(user=>{
       if(user.length){
        req.user = user[0];
        next();
       } else {
        res.status(400).send('not found')
        
       }
   }).catch(error=>response.status(400).send('error getting request'))
})


app.get('/profile/:userId',(req,res,next)=>{
    res.send(req.user)
    
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

            res.json(user[0])
            await trx.commit
        }catch(error){
            await trx.rollback

        }
    })
})




app.put('/image',async (req, res, next)=>{
    const {id, count} = req.body
    const imageCount = count
   /* const imageCount = req.body.count;
    console.log(imageCount + 'box length');
    const found = dataBase.users.find(user=> user.id === id)
    if(found){
        let updated = found.entries + imageCount;
        found.entries = updated;
        console.log(updated + 'updated')
        
        
        res.json(found.entries)
        console.log(`put count ${found.entries}`)
    } else {
        res.status(404).send('error')
    }
    */
   /*
    db('users').where('id', '=', id)
   .increment('entries', count)
   .returning('entries')
   .then(entries => {
     res.json(entries[0]);
   })
   */
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
