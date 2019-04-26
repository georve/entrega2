const express=require('express');
const app=express();
const path=require('path');
const hbs=require('hbs');
const sgMail=require('@sendgrid/mail');
const bodyParser=require('body-parser');
const mongoose=require('mongoose');
const Curso=require('../modelo/cursos');
const Inscrito=require('../modelo/inscritos');
const Usuario=require('../modelo/usuario');
//const bcrypt=require('bcrypt');
const session=require('express-session');
require ('./helper');
require('./configuration');
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


app.use(session({
	secret:'keyboard cat',
	resave:true,
	saveUninitialized:true
}));

app.use((req,res,next)=>{
	if(req.session.usuario){
		res.locals.sesion=true;
		res.locals.nombre=req.session.nombre;
	}
    next();
});


app.post('/registrar',(req,res)=>{
	let usuario=new Usuario({
		doc:req.body.documento,
		nombre:req.body.nombre,
		correo:req.body.email,
		telefono:req.body.telf,
		password:req.body.password,
		rol:'aspirante'
	});

	const msg={
		to:req.body.email,
		from:'georve@gmail.com',
		subject:'Bienvenido',
		text:'Bienvenido a la paginas de cursos'
	};
    console.log(usuario);
	Usuario.find({doc:req.body.documento,correo:req.body.email}).exec((err,encontrado)=>{
		if(err){
			return console.log(err);
		}
		if(!encontrado||encontrado.length == 0){
			//inscribir
			console.log('no encontrado');
			usuario.save((err,resultado)=>{
				if(err){
					console.log(err);
					return res.render('register',{
						mensaje:'Error al registrar al Usuario'
					});
				}
				sgMail.send(msg);
                console.log(resultado);
				res.render('register',{
					mensaje:'Registro Exitoso'
				});


			});
		}else{
			console.log('encontrado');
			res.render('register',{
				mensaje:'Documento y correo registrado'
			});
		}
	});



});


app.post('/login',(req,res)=>{
	console.log('login');
	console.log(req.body);
    Usuario.findOne({doc:req.body.email},(err,resultado)=>{
		if(err){
		 return	console.log(err);
		}

		if(!resultado){
			console.log('No encontrado');
           return 	res.render('login',{
			            mensaje:'Usuario no existe'
		               });
		}
        console.log(resultado);
		if(resultado.password!=req.body.password){
			return 	res.render('login',{
				mensaje:'Password Invalido'
			   });
		}

		//variables de session
		req.session.usuario=resultado._id;
		req.session.nombre=resultado.nombre;
		req.session.rol=resultado.rol;
		req.session.correo=resultado.correo;
		req.session.telefono=resultado.telefono;
		req.session.documento=resultado.doc;

		res.render('index',{
			mensaje:req.session.nombre,
			sesion:true,
			nombre:req.session.nombre,
			coordinador:req.session.rol=='coordinador',
			aspirante:req.session.rol=='aspirante'
		   });
	})


});


app.get('/',(req,res)=>{
	if(req.session.usuario){
		res.render('index',{
			estudiante:'Sebastian',
			titulo:'Inicio',
			nombre:req.session.nombre,
			coordinador:req.session.rol=='coordinador',
			aspirante:req.session.rol=='aspirante'
		});

	}else{
	   //res.redirect('/login');
	   
	   //////crear usuario coordinador
	   let coordinador = new Usuario({
        doc: '0',
        nombre: 'Coordinador',
        password: '12345',
        correo: 'coordinador@gmail.com',
        telefono: '0',
        rol:'coordinador'
    })

    Usuario.find({doc:'0', rol:'coordinador'}).exec((err, encontrado)=> {
        if (err) {
            return console.log(err)
        }
        
        if (!encontrado || encontrado.length == 0) {
            
            coordinador.save((err, resultado)=> {
                if (err) {
                    console.log(err);
                }else{
					console.log('usuario creado');
				}
   
            });
        }else{
			res.redirect('/login');
		}
        

    })









	}

});

app.get('/crearcurso',(req,res)=>{
    res.render('crearcurso',{
		titulo:'Crear Curso',
		nombre:req.session.nombre,
		coordinador:req.session.rol=='coordinador',
		aspirante:req.session.rol=='aspirante'
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
				mensaje:"<div class='alert alert-danger' role='alert'>"+err+"</div>",
				nombre:req.session.nombre,
				coordinador:req.session.rol=='coordinador',
				aspirante:req.session.rol=='aspirante'
			});
		}else{
			console.log('exito al crear registro'); 
			res.render('crearresultado',{	
				mensaje:"<div class='alert alert-success' role='alert'>Registro exitoso</div>",
				nombre:req.session.nombre,
				coordinador:req.session.rol=='coordinador',
				aspirante:req.session.rol=='aspirante'
			});
		}

	



	});

});

app.get('/vercursos', (req,res) => {

   Curso.find({}).exec((err,respuesta)=>{
	   if(err){
		res.render('listarcursos',{
			titulo:'Listar Cursos',
			listado:null,
			nombre:req.session.nombre,
			coordinador:req.session.rol=='coordinador',
			aspirante:req.session.rol=='aspirante'
	
		});

	   }

	   res.render('listarcursos',{
		titulo:'Listar Cursos',
		listado:respuesta,
		nombre:req.session.nombre,
		coordinador:req.session.rol=='coordinador',
		aspirante:req.session.rol=='aspirante'

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
						  mensaje:"<div class='alert alert-danger' role='alert'>"+err+"</div>",
						  nombre:req.session.nombre,
						  coordinador:req.session.rol=='coordinador',
						  aspirante:req.session.rol=='aspirante'
					  });
				  }

				  if(!resultadoSaved){
					  return res.render('inscribirresultado',{
						mensaje:"<div class='alert alert-danger' role='alert'>No se pudo realizar la inscripción</div>",
						nombre:req.session.nombre,
						coordinador:req.session.rol=='coordinador',
						aspirante:req.session.rol=='aspirante'
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
							mensaje: "<div class='alert alert-success' role='alert'>El estudiante "+ resultadoSaved.doc + " fue inscrito en el curso "+ resultadoSaved.id_curso +" satisfactoriamente</div>",
							nombre:req.session.nombre,
							coordinador:req.session.rol=='coordinador',
							aspirante:req.session.rol=='aspirante'

						});

					});
				  }


			   });

		   }else{
			return res.render('inscribirresultado',{
				documento: req.body.doc,
                id_curso: req.body.curso,
				mensaje: "<div class='alert alert-warning' role='alert'>El estudiante "+ req.body.doc + "  ya se encuentra inscrito en el curso "+ req.body.curso +"</div>",
				nombre:req.session.nombre,
				coordinador:req.session.rol=='coordinador',
				aspirante:req.session.rol=='aspirante'
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
					nombre:req.session.nombre,
					coordinador:req.session.rol=='coordinador',
			        aspirante:req.session.rol=='aspirante',
					mensajeInscribir:"<div class='alert alert-warning' role='alert'>No hay cursos disponibles para inscripcion</div>"
				});

			}else{
				res.render('inscribir',{
					existeCurso:resultado.length>0,
					cursos:resultado,
					mensajeInscribir:'',
					nombre:req.session.nombre,
					correo:req.session.correo,
					telefono:req.session.telefono,
					documento:req.session.documento,
					coordinador:req.session.rol=='coordinador',
			        aspirante:req.session.rol=='aspirante'
				});

			}


		}



	});

});

app.get('/registrar',(req,res)=>{
     res.render('register',{
		 mensaje:''
	 });
});

app.get('/login',(req,res)=>{
	res.render('login',{
		mensaje:''
	});

});

app.get('/logout',(req,res)=>{
	req.session.destroy((err)=>{
		if(err){
			return console.log(err);
		}
	});
	res.redirect('/');

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
				listaInscritos:inscritos,
				nombre:req.session.nombre,
				coordinador:req.session.rol=='coordinador',
				aspirante:req.session.rol=='aspirante'
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
				mensaje:"<div class='alert alert-danger' role='alert'>No se encontro el estudiante</div>",
				nombre:req.session.nombre,
				coordinador:req.session.rol=='coordinador',
				aspirante:req.session.rol=='aspirante'
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
				mensaje:"<div class='alert alert-success' role='alert'>El estudiante "+ resultado.doc +" fue eliminado satisfactoriamente del curso "+ resultado.curso +"</div>",
				nombre:req.session.nombre,
				coordinador:req.session.rol=='coordinador',
				aspirante:req.session.rol=='aspirante'
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
				nombre:req.session.nombre,
				coordinador:req.session.rol=='coordinador',
				aspirante:req.session.rol=='aspirante',            
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
					nombre:req.session.nombre,
					coordinador:req.session.rol=='coordinador',
			        aspirante:req.session.rol=='aspirante',
					mensaje: "<div class='alert alert-success' role='alert'>El curso "+ resultado.id_curso + " fue cerrado satisfactoriamente</div>"
				});
				
	
	
			});
	 
	
	 
		 });
 
    
    });

});

app.get('*',(req,res)=>{
     res.render('error',{
		 titulo:'Error'
	 });
});


mongoose.connect(process.env.URLDB,{useNewUrlParser:true},(err,resultado)=>{
	if (err){
		return console.log("error")
	}

	console.log("conectado");
});


app.listen(process.env.PORT,()=>{
    console.log('Listening on port '+process.env.PORT);
});