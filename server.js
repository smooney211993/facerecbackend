const express = require('express');
const bodyParser = require('body-parser');
const brcypt = require('bcrypt-nodejs');

const app = express();

const PORT = process.env.PORT || 4001;
let id = 124

const dataBase = {
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

app.use(bodyParser.json());

app.get('/', (req , res, next)=>{
    res.send('this is working bitch tits');
})

app.post('/signin', (req, res, next)=>{
    if(req.body.email === dataBase.users[0].email && req.body.password === dataBase.users[0].password) {
        res.join(success)
    } else {
        res.status(400).json('error logging in')
    }

});

app.param('userId',(req,res,next, id)=>{
    const found = dataBase.users.find(user=> user.id === id)
    if(found){
        req.user = found;
        next();
    } else {
        res.status(404).send()
    }
})


app.get('/profile/:userId',(req,res,next)=>{
    res.send(req.user)
    console.log(req.user.id)
})

app.post('/register',(req, res, next)=>{
    const {name, password, email} = req.body;
    if(dataBase.users.find(user => user.email === email)){
        res.status(404).send('user already exists');
    }
    brcypt.hash(password, null, null, function(err, hash) {
        console.log(hash)

    })
    
    let newUser = {
        id : ++id,
        name: name,
        password : password,
        email: email,
        entries : 0,
        joined: new Date()
    }
    dataBase.users.push(newUser);
    res.json(newUser);
    console.log(dataBase.users);
})




app.put('/image',(req, res, next)=>{
    const id = req.body.id;
    const found = dataBase.users.find(user=> user.id === id)
    if(found){
        
        res.json(found.entries ++)
    } else {
        res.status(404).send(error)
    }
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
