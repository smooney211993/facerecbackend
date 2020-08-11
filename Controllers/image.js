const handleImage = async (req, res, next, db)=>{
    const {id, count} = req.body
    const imageCount = count
    const entries = await  db('users').where('id', '=', id)
    .increment('entries', count)
    .returning('entries')
    res.send(entries);    
   
};


module.exports = {
    handleImage: handleImage
}