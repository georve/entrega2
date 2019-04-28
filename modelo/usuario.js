const mongoose=require('mongoose');
var uniqueValidator=require('mongoose-unique-validator');

const Schema=mongoose.Schema;

const usuarioSchema=new Schema({
   
      doc:{
          type:String,
          required:true,
          index:true,
          unique:true,
          trim: true
      },
      nombre:{
          type:String,
          require:true
      },
      correo:{
          type:String,
          require:true,
          index:true,
          unique:true,
          trim: true
      },
      telefono:{
          type:Number,
          require:true
      },
      password:{
          type:String,
          require:true
      },
      rol:{
          type:String,
          default:'aspirante'
      },
      verificado:{
          type:Boolean,
          default:false
      }

});

usuarioSchema.plugin(uniqueValidator, { message: '{VALUE} ya existe.' });
const Usuario=mongoose.model('Usuario',usuarioSchema);

module.exports=Usuario;