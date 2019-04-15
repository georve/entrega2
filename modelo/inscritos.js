const mongoose=require('mongoose');
var uniqueValidator=require('mongoose-unique-validator');

const Schema=mongoose.Schema;

const inscritoSchema=new Schema({
   
    doc:{
          type:String,
          required:true
      },
      nombre:{
          type:String,
          require:true,
      },
      correo:{
          type:String,
          require:true,
      },
      telefono:{
          type:Number,
          require:true
      },
      curso:{
          type:Number,
          require:true
      }



});

const Inscrito=mongoose.model('Inscrito',inscritoSchema);

module.exports=Inscrito;