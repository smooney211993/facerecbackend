const Clarifai = require('clarifai');
const app = new Clarifai.App({
    apiKey: 'e0357803b22f409dbb059d51ca2675b1'
   });
const handleApiCall = async (req,res,next)=>{
    const {input} = req.body;
        try{
            const response = await app.models.predict("c0c0ac362b03416da06ab3fa36fb58e3", input);
            await res.json(response); 
        }catch (error){
            res.status(400).send('error')

        }
}


const handleImage = async (req, res, next, db)=>{
    const {id, count} = req.body
    const imageCount = count
    const entries = await  db('users').where('id', '=', id)
    .increment('entries', count)
    .returning('entries')
    res.send(entries);    
   
};


module.exports = {
    handleImage: handleImage,
    handleApiCall: handleApiCall
}