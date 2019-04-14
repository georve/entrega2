const mongoose=require('mongoose');
var uniqueValidator=require('mongoose-unique-validator');

const Schema=mongoose.Schema;

const cursoSchema=new Schema({
      id_curso:{
          type:Number,
          required:true,
          index:true,
          unique:true
      },
      nombre:{
          type:String,
          require:true,
      },
      modalidad:{
          type:String,
          require:true,
      },
      descripcion:{
          type:String,
          require:true
      },
      valor:{
          type:Number,
          require:true
      },
      intensidad:{
          type:Number
      },
      estado:{
          type:String,
          default:'disponible'
      }



});

cursoSchema.plugin(uniqueValidator, { message: '{VALUE} ya existe.' });
const Curso=mongoose.model('Curso',cursoSchema);

module.exports=Curso;