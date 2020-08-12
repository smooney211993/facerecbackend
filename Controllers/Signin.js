const handleSignin = async (req, res, next, db, bcrypt)=>{
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


};

module.exports ={
    handleSignin: handleSignin
}
