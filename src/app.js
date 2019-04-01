const express=require('express');
const app=express();
const path=require('path');
const hbs=require('hbs');
const bodyParser=require('body-parser');
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
	res.render('crearresultado',{
		titulo:'Inicio',
		curso: {
			id_curso: req.body.id_curso,
			nombre: req.body.nombre,
			valor: parseInt(req.body.valor),
			descripcion: req.body.descripcion,
			modalidad: req.body.modalidad,
			intensidad: req.body.intensidad
		}
	});
});

app.get('/vercursos', (req,res) => {
	res.render('listarcursos',{
		titulo:'Listar Cursos'

	});
});



app.post('/inscribirResultado', (req,res) => {
	res.render('inscribirresultado',{
		titulo:'Inscribir - Resultado',
		estudiante: {
			doc: req.body.doc,
			nombre: req.body.nombre,
			correo: req.body.correo,
			telefono: req.body.telefono,
			curso: req.body.curso
		}
	});
});

app.get('/inscribir', (req,res) => {
	res.render('inscribir',{
		titulo:'Inscribir Curso'

	});
});

app.get('/verinscritos', (req,res) => {

	res.render('listarinscritos',{
		titulo:'Ver Inscritos',
        curso: null
	});
});

app.get('/eliminarInscrito', (req,res) => {
	res.render('listarinscritoscurso',{
		doc: req.query.doc,
		curso: req.query.curso,
	});
});

app.get('/actualizarCurso', (req,res) => {
	res.render('listarinscritos',{
		titulo:'Actualizar Curso',
		curso: req.query.curso
	});
});



app.listen(port,()=>{
    console.log('Listening on port '+port);
});