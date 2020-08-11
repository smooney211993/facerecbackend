const handleRegister =  async (req, res, next, db, bcrypt)=>{
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
}

module.exports = {
    handleRegister: handleRegister
}