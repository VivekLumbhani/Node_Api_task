const users=require('../models/users')
async function handleUserSignUp(req,res) {
    const {name,email,password}=req.body;
    await users.create({
        name,email,password
    });
    return res.render("home");
}
module.exports={
    handleUserSignUp,
}