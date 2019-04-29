const fs = require('fs');
const Curso=require('../modelo/cursos');
const listarCursos = () => {
	console.log('listarCursos');
    listaCursos = [];
	Curso.find({}).exec((err,respuesta)=>{
       if(err){
		console.log('error',error);
	   }
	   console.log('consulta exitosa');
	   console.log(respuesta);
	   listaCursos =respuesta;
	   
	});


}

const listarInscritos = () => {
    listaInscritos = [];
	try {
        listaInscritos = require('./inscritos.json');
    }
	catch (error) {
        console.log('error',error);
    } 

    return listaInscritos;
}

const crearCurso = (curso) => {
	console.log('crear curso');
    let cursoToSave=new Curso({
		id_curso:curso.id_curso,
		 nombre:curso.nombre,
		 modalidad:curso.modalidad,
		 valor:curso.valor,
		 descripcion:curso.descripcion,
		 intensidad:curso.intensidad,
		 estado:'disponible'

	});
	console.log(cursoToSave);

	cursoToSave.save((err,resultado)=>{
		if(err){
			console.log('Error al crear el curso');
			return "<div class='alert alert-danger' role='alert'>No se pudo guardar el curso con el nombre "+cursoToSave.nombre+"</div>";
		}
		console.log('creado con exito');
		console.log(resultado);
        return guardarCursos(resultado.__id,resultado.nombre);
	});




	/*listaCursos = listarCursos();
    
	let duplicado = listaCursos.find(nom => nom.id_curso == curso.id_curso);
    if (!duplicado) {
        curso.estado='disponible';
        listaCursos.push(curso);   
        return guardarCursos(curso.id_curso,curso.nombre);
	}
	else {
		return "<div class='alert alert-danger' role='alert'>Ya existe un curso con el mismo id: "+curso.id_curso+"</div>";
	}*/
}

const guardarCursos = (id,nombre) => {

    return "<div class='alert alert-success' role='alert'>El curso "+ id +"-"+ nombre+" fue creado satisfactoriamente</div>";
	
}

const inscribirCurso = (estudiante) => {
	listaInscritos = listarInscritos();
    
	let duplicado = listaInscritos.find(est => est.doc == estudiante.doc && est.curso == estudiante.curso);
    if (!duplicado) {
        listaInscritos.push(estudiante);   
        guardarInscritos(listaInscritos);
        return "<div class='alert alert-success' role='alert'>El estudiante "+ estudiante.nombre + " fue inscrito en el curso "+ estudiante.curso +" satisfactoriamente</div>";

	}
	else {
        return "<div class='alert alert-warning' role='alert'>El estudiante "+ estudiante.nombre + " ya esta inscrito en el curso "+ estudiante.curso +"</div>";
	}
}

const guardarInscritos = (lista) => {
	let datos = JSON.stringify(lista);
    fs.writeFile('src/inscritos.json', datos, (err) => {
        if (err) throw (err);
	});	
	
}

const eliminarInscrito = (documento) => {
	listaInscritos = listarInscritos();
	let nuevo = listaInscritos.filter(est => est.doc != documento);
    if (nuevo.length == listaInscritos.length) {
        return null;    
    }
	else {
        guardarInscritos(nuevo);
        return nuevo;
	}
}

const listarEstInscritos = (listaEstInscritos) => {
	let texto = '';

	if (listaEstInscritos != null && Object.keys(listaEstInscritos).length != 0) {

		texto = texto + "<table class='table table-striped'>"+ 
		"<thead class='thead-dark'>"+
		"<th>Documento</th>"+
		"<th>Nombre</th>"+
		"<th>Correo</th>"+
		"<th>Telefono</th>"+
		"<th>Eliminar</th>"+
		"<th>Ver Archivo</th>"+
		"</thead>"+
		"<tbody>";

		listaEstInscritos.forEach(inscrito => {
				texto = texto + 
				'<tr>'+
				'<td>'+ inscrito.doc + '</td>' +
				'<td>'+ inscrito.nombre + '</td>' +
				'<td>'+ inscrito.correo + '</td>' +
				'<td>'+ inscrito.telefono + '</td>'+
				"<td><a href='/eliminarInscrito?doc="+ inscrito.doc +"&curso="+ inscrito.curso +"' class='btn btn-danger' role='button' aria-pressed='true'>Eliminar</a></td>"+
				`<td>
				<div class="container">
				  <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#myModal">Modal 1</button>
		
				  <!-- Modal -->
				  <div class="modal fade" id="myModal" role="dialog">
					<div class="modal-dialog">
		
					  <!-- Modal content-->
					  <div class="modal-content">
						<div class="modal-header">
						  <button type="button" class="close" data-dismiss="modal">&times;</button>
						  <h4 class="modal-title">Modal Title Example</h4>
						</div>
						<div class="modal-body">`+
						'<img src="data:application/pdf;base64,'+inscrito.file.toString('base64') + 'class="img-fluid" >'
						
		
						  `</div>
						<div class="modal-footer">
						  <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
						</div>
					  </div>
		
					</div>
				  </div>
		
				</div>
			  </td>`+
				'</tr>';
		
		});
		texto = texto + "</tbody> </table>";
	}
	else {
		texto = "<div class='alert alert-warning' role='alert'>No hay inscritos</div>";
	}
	return texto;
};

const actualizarCurso = (cursoParam) => {
	listaCursos = listarCursos();
	let curso = listaCursos.find(c => c.id_curso == cursoParam);
    let nuevo = listaCursos.filter(c => c.id_curso != cursoParam);
    
    if (nuevo.length == listaCursos.length) {
        return "<div class='alert alert-danger' role='alert'>Ocurrio un problema al intentar actualizar el curso</div>";    
    }
	else {
        curso.estado = 'cerrado';
        nuevo.push(curso);
        let datos = JSON.stringify(nuevo);
        fs.writeFile('src/cursos.json', datos, (err) => {
            if (err) throw (err);
        });	
        return "<div class='alert alert-success' role='alert'>El curso "+ cursoParam +" fue cerrado satisfactoriamente</div>";
	
    }
}

module.exports = {
    crearCurso,
    inscribirCurso,
    eliminarInscrito,
    listarEstInscritos,
    listarCursos,
    listarInscritos,
    actualizarCurso
}