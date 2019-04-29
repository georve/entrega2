const mongoose=require('mongoose');
var uniqueValidator=require('mongoose-unique-validator');

const Schema=mongoose.Schema;
const ObjectId=Schema.ObjectId;
const tokenSchema=new Schema({
   
    _userId:{
          type:ObjectId,
          required:true,
          ref:'Usuario'
      },
      token:{
          type:String,
          require:true
      },
      createdAt:{
          type:Date,
          require:true,
          default:Date.now,
          expires:43200
      }



});

const Token=mongoose.model('Token',tokenSchema);

module.exports=Token;