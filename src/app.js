const express=require('express');
const app=express();
const path=require('path');
const hbs=require('hbs');
const bodyParser=require('body-parser');
const mongoose=require('mongoose');
const Curso=require('../modelo/cursos');
const Inscrito=require('../modelo/inscritos');
//const bcrypt=require('bcrypt');
const session=require('express-session');
const port=3000;
require ('./helper');
const directoriopublico=path.join(__dirname,'../public');
const directoriopartials=path.join(__dirname,'../template/partials');
const directoriobootstrapcss = path.join(__dirname,'../node_modules/bootstrap/dist/css');
const directoriojquery = path.join(__dirname,'../node_modules/jquery/dist');
const directoriopopper = path.join(__dirname,'../node_modules/popper.js/dist');
const directoriobootstrapjs = path.join(__dirname,'../node_modules/bootstrap/dist/js');

app.use(express.static(directoriopublico));
hbs.registerPartials(directoriopartials);
app.use(bodyParser.urlencoded({extended:false}));

app.set('view engine','hbs');
app.use('/css', express.static(directoriobootstrapcss));
app.use('/js', express.static(directoriojquery));
app.use('/js', express.static(directoriopopper));
app.use('/js', express.static(directoriobootstrapjs));

app.use(function (req, res, next) {
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.header('Expires', '-1');
    res.header('Pragma', 'no-cache');
    next()
});


app.get('/',(req,res)=>{
    res.render('index',{
        estudiante:'Sebastian',
        titulo:'Inicio'
    })
});

app.get('/crearcurso',(req,res)=>{
    res.render('crearcurso',{
        titulo:'Crear Curso'
    })
});

app.post('/crear_resultado', (req,res) => {
	console.log('/crear_resultado');
    let curso=new Curso({
		id_curso: req.body.id_curso,
		nombre: req.body.nombre,
		valor: parseInt(req.body.valor),
		descripcion: req.body.descripcion,
		modalidad: req.body.modalidad,
		intensidad: req.body.intensidad

	});

	curso.save((err,resultado)=>{
		if(err){
			console.log('error al crear registro');
		
			res.render('crearresultado',{	
				mensaje:"<div class='alert alert-danger' role='alert'>"+err+"</div>"
			});
		}else{
			console.log('exito al crear registro'); 
			res.render('crearresultado',{	
				mensaje:"<div class='alert alert-success' role='alert'>Registro exitoso</div>"
			});
		}

	



	});

});

app.get('/vercursos', (req,res) => {

   Curso.find({}).exec((err,respuesta)=>{
	   if(err){
		res.render('listarcursos',{
			titulo:'Listar Cursos',
			listado:null
	
		});

	   }

	   res.render('listarcursos',{
		titulo:'Listar Cursos',
		listado:respuesta

	});
	   
   });


});



app.post('/inscribirResultado', (req,res) => {



	let inscrito=new Inscrito({
		doc: req.body.doc,
		nombre: req.body.nombre,
		correo: req.body.correo,
		telefono: req.body.telefono,
		curso: parseInt(req.body.curso)
	});

	Inscrito.find({doc:req.body.doc,curso:req.body.curso}).exec((err,encontrado)=>{
       if(err){
		   return console.log(err)
	   }else{
		   if(!encontrado||encontrado.length==0){
			   inscrito.save((err,resultadoSaved)=>{
                  if(err){
					  return res.render('inscribirresultado',{
						  mensaje:"<div class='alert alert-danger' role='alert'>"+err+"</div>"
					  });
				  }

				  if(!resultadoSaved){
					  return res.render('inscribirresultado',{
						mensaje:"<div class='alert alert-danger' role='alert'>No se pudo realizar la inscripción</div>"
					});
				  }else{
					Inscrito.find().exec((err,inscritos)=>{
						if(err){
							return console.log(err);
						}
						
						res.render('inscribirresultado',{
							documento: resultadoSaved.doc,
							id_curso: resultadoSaved.curso,
							inscritos_curso: inscritos,
							mensaje: "<div class='alert alert-success' role='alert'>El estudiante "+ resultadoSaved.doc + " fue inscrito en el curso "+ resultadoSaved.id_curso +" satisfactoriamente</div>"

						});

					});
				  }


			   });

		   }else{
			return res.render('inscribirresultado',{
				documento: req.body.doc,
                id_curso: req.body.curso,
                mensaje: "<div class='alert alert-warning' role='alert'>El estudiante "+ req.body.doc + "  ya se encuentra inscrito en el curso "+ req.body.curso +"</div>"
			});
		   }
	   }


	});

});

app.get('/inscribir', (req,res) => {
	console.log('inscribir');
    Curso.find({estado:'disponible'}).exec((err,resultado)=>{
		if(err){
			console.log('inscribir consulta error');
			return console.log(err);
		}else{
			if(!resultado){
				res.render('inscribir',{
					existeCurso:resultado.length>0,
					cursos:resultado,
					mensajeInscribir:"<div class='alert alert-warning' role='alert'>No hay cursos disponibles para inscripcion</div>"
				});

			}else{
				res.render('inscribir',{
					existeCurso:resultado.length>0,
					cursos:resultado,
					mensajeInscribir:''
				});

			}


		}



	});

});

app.get('/verinscritos', (req,res) => {


	Curso.find({}).exec((err,cursos)=>{
		if(err){
			return console.log(err);
 
		}
		Inscrito.find().exec((err,inscritos)=>{
			if(err){
				return console.log(err);
			}
			res.render('listarinscritos',{
				titulo:'Ver Inscritos',
				curso: null,
				listaCursos:cursos,
				listaInscritos:inscritos
			});
			


		});
 

 
	 });
		



});

app.get('/eliminarInscrito', (req,res) => {
	console.log('eliminar_inscrito');
    Inscrito.findOneAndDelete({doc:req.query.doc,curso:req.query.curso},req.body,(err,resultado)=>{
		if (err) {
			console.log('error al buscar inscrito a eliminar');
            return console.log(err)
		} 
		
		if(!resultado){
			console.log('No encontro al estudiante');
			res.render('listarinscritoscursos',{
				doc: req.query.doc,
				curso: req.query.curso,
				mensaje:"<div class='alert alert-danger' role='alert'>No se encontro el estudiante</div>"
			});

		}

		Inscrito.find({curso:resultado.curso}).exec((err,inscritos)=>{
			if (err) {
				console.log('No encontro los estudientes del curso');
				return console.log(err)
			} 

			res.render('listarinscritoscursos',{
				doc: req.query.doc,
				curso: req.query.curso,
				inscritos:inscritos,
				mensaje:"<div class='alert alert-success' role='alert'>El estudiante "+ resultado.doc +" fue eliminado satisfactoriamente del curso "+ resultado.curso +"</div>"
			});

		});
	});


	
});

app.get('/actualizarCurso', (req,res) => {

	Curso.findOneAndUpdate({id_curso: req.query.id_curso}, {$set:{estado:'cerrado'}}, {new :  true}, (err, resultado)=> {
        if (err) {
			console.log('error al cerrar el curso');
            return console.log(err)
        }
        
        if (!resultado) {
			console.log('no encontro el curso');
            return res.render('listarinscritos',{
				curso: req.query.id_curso,
				listaCursos:null,
				listaInscritos:null,               
                mensaje: "<div class='alert alert-danger' role='alert'>El curso "+ req.query.id_curso + " no se pudo cerrar</div>"
            }); 
        }
		console.log('buscar cursos restantes');
		Curso.find({}).exec((err,cursos)=>{
			if(err){
				return console.log(err);
	 
			}
	
			Inscrito.find().exec((err,inscritos)=>{
				if(err){
					return console.log(err);
				}
				console.log(inscritos);
				res.render('listarinscritos',{
					titulo:'Ver Inscritos',
					curso: resultado.id_curso,
					listaCursos:cursos,
					listaInscritos:inscritos,
					mensaje: "<div class='alert alert-success' role='alert'>El curso "+ resultado.id_curso + " fue cerrado satisfactoriamente</div>"
				});
				
	
	
			});
	 
	
	 
		 });
 
    
    });

});


mongoose.connect('mongodb://localhost:27017/estudiantes',{useNewUrlParser:true},(err,resultado)=>{
	if (err){
		return console.log("error")
	}

	console.log("conectado");
});


app.listen(port,()=>{
    console.log('Listening on port '+port);
});