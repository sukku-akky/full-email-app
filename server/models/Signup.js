const mongoose=require('mongoose');


const signupSchema=new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    confirmPassword: { type: String, required: true }
})


const signupModel=mongoose.model("signup",signupSchema);

module.exports=signupModel;