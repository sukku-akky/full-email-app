const mongoose=require('mongoose');


const emailSchema = new mongoose.Schema({
    sender: { type: String, required: true },
    recipient: { type: String, required: true },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    sentAt: { type: Date, default: Date.now },
    isReadSender: { type: Boolean, default: false },
    isReadReceiver:{type:Boolean,default:false},
    deletedBySender: { type: Boolean, default: false },
    deletedByRecipient: { type: Boolean, default: false },
  });
  

const emailModel=mongoose.model("email",emailSchema);
module.exports=emailModel;