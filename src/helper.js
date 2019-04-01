const hbs = require('hbs');
const funciones = require ('./funciones');

hbs.registerHelper('crearCurso', (curso) => {
	return funciones.crearCurso(curso);
});

hbs.registerHelper('listarCursos', () => {

	listaCursos = funciones.listarCursos();

	let texto = "";

	if (listaCursos != null && Object.keys(listaCursos).length != 0) {

		texto = texto + "<table class='table table-striped'>"+ 
		"<thead class='thead-dark'>"+
		"<th>ID</th>"+
		"<th>Nombre</th>"+
		"<th>Valor</th>"+
		"<th>Descripcion</th>"+
		"<th>Modalidad</th>"+
		"<th>Intensidad</th>"+
		"<th>Estado</th>"+
		"</thead>"+
		"<tbody>";

		listaCursos.forEach(curso => {
			if (curso.estado == 'disponible') {
				texto = texto + 
				'<tr>'+
				'<td>'+ curso.id_curso + '</td>' +
				'<td>'+ curso.nombre + '</td>' +
				'<td>'+ curso.valor + '</td>' +
				'<td>'+ curso.descripcion + '</td>'+
				'<td>'+ (curso.modalidad==null?'-':curso.modalidad) + '</td>'+
				'<td>'+ (curso.intensidad==null?'-':curso.intensidad) + '</td>'+
				'<td>'+ curso.estado + '</td>'+
				'</tr>';
			}

			
		});
		texto = texto + "</tbody> </table>";
	}
	else {
		texto = "<div class='alert alert-warning' role='alert'>No hay cursos</div>";
	}

	return texto;
});

hbs.registerHelper('inscribirCurso', (estudiante) => {
	return funciones.inscribirCurso(estudiante);
});

hbs.registerHelper('listarInscritosCurso', (curso) => {
	
	listaInscritos = funciones.listarInscritos();
 
	let texto = 'Curso: '+curso;

	let inscritos = listaInscritos.filter(est => est.curso == curso);

	if (inscritos != null && Object.keys(inscritos).length != 0) {

		texto = texto + "<table class='table table-striped'>"+ 
		"<thead class='thead-dark'>"+
		"<th>Documento</th>"+
		"<th>Nombre</th>"+
		"<th>Correo</th>"+
		"<th>Telefono</th>"+
		"</thead>"+
		"<tbody>";

		inscritos.forEach(inscrito => {
				texto = texto + 
				'<tr>'+
				'<td>'+ inscrito.doc + '</td>' +
				'<td>'+ inscrito.nombre + '</td>' +
				'<td>'+ inscrito.correo + '</td>' +
				'<td>'+ inscrito.telefono + '</td>'+
				'</tr>';
		
		});
		texto = texto + "</tbody> </table>";
	}
	else {
		texto = "<div class='alert alert-warning' role='alert'>No hay estudiantes inscritos en este curso</div>"
	}
	return texto;
});

hbs.registerHelper('listarEstInscritos', () => {

	listaCursos = funciones.listarCursos();
	listaInscritos = funciones.listarInscritos();

	let texto = '';

	if (listaCursos != null && Object.keys(listaCursos).length != 0) {
		if (listaInscritos != null && Object.keys(listaInscritos).length != 0) {

			texto = texto + "<div class='accordion' id='accordionExample'>";
			i = 1;   
			listaCursos.forEach(curso => {
				if (curso.estado == 'disponible') {
					let inscritos = listaInscritos.filter(est => est.curso == curso.id_curso);
					if (inscritos != null && Object.keys(inscritos).length != 0) {
						texto = texto + 
						`<div class="card">
						<div class="card-header" id="heading${i}">
						<h2 class="text-center">
							<button class="btn btn-link" type="button" data-toggle="collapse" data-target="#collapse${i}" aria-expanded="true" aria-controls="collapse${i}">
							<h5>
							Curso: ${curso.id_curso}-${curso.nombre}
							</h5>
							</button>

						</h2>
						<div class="text-center">
							<a href='/actualizarCurso?curso=${curso.id_curso}' class='btn btn-danger' role='button' aria-pressed='true'>Cerrar</a></td>
						</div>

						<div id="collapse${i}" class="collapse" aria-labelledby="heading${i}" data-parent="#accordionExample">
						<div class="card-body">
						<h6 class="text-center">Estudiantes Inscritos</h6>`
					
						texto = texto + funciones.listarEstInscritos(inscritos);
						texto = texto + 
							`</div>
							</div>
						</div>`
					}
				}
				
				i = i + 1;
			
			});
			texto = texto + "</div>";
		}
		else {
			texto = "<div class='alert alert-warning' role='alert'>No hay estudiantes inscritos en los cursos</div>";
		}
	}
	else {
		texto = "<div class='alert alert-warning' role='alert'>No hay cursos disponibles</div>";
	}
	return texto;
});

hbs.registerHelper('selectCursos', () => {

	listaCursos = funciones.listarCursos();

	let texto = '';

	if (listaCursos != null && Object.keys(listaCursos).length != 0) {
		texto = texto + "<select class='form-control'  name='curso' required>";

		listaCursos.forEach(curso => {
			if (curso.estado == 'disponible') {
			texto = texto + 
				"<option value='"+curso.id_curso+"'>"+curso.nombre+"-"+curso.id_curso+"</option>";
			}
		});
		texto = texto + "</select>";
	}
	return texto;
});

hbs.registerHelper('eliminarInscrito', (documento, curso) => {

	let nuevo = funciones.eliminarInscrito(documento);

	let texto = "";

	if (nuevo != null) {

		texto = "<div class='alert alert-success' role='alert'>El estudiante "+ documento +" fue eliminado satisfactoriamente del curso "+ curso +"</div>"
     
		let inscritos = nuevo.filter(est => est.curso == curso);

		if (inscritos != null && Object.keys(inscritos).length != 0) {

			texto = texto + "Curso: "+ curso +"<table class='table table-striped'>"+ 
			"<thead class='thead-dark'>"+
			"<th>Documento</th>"+
			"<th>Nombre</th>"+
			"<th>Correo</th>"+
			"<th>Telefono</th>"+
			"</thead>"+
			"<tbody>";

			inscritos.forEach(inscrito => {
					texto = texto + 
					'<tr>'+
					'<td>'+ inscrito.doc + '</td>' +
					'<td>'+ inscrito.nombre + '</td>' +
					'<td>'+ inscrito.correo + '</td>' +
					'<td>'+ inscrito.telefono + '</td>'+
					'</tr>';
			
			});
			texto = texto + "</tbody> </table>";
		}
		else {
			texto = texto + "<div class='alert alert-warning' role='alert'>No hay inscritos en el curso"+curso+"</div>"
		}
	}
	else {
		texto = "<div class='alert alert-danger' role='alert'>Ocurrió un problema al intentar eliminar el estudiante</div>"
	}
	
	return texto;
 
});

hbs.registerHelper('actualizarCurso', (curso) => {
	if (curso != null) {
		return funciones.actualizarCurso(curso);
	}
});

hbs.registerHelper('existeCurso', (curso) => {
	listaCursos = funciones.listarCursos();
    return (Object.keys(listaCursos).length != 0 && listaCursos.some(c => c.estado == 'disponible'))?'':'none';
});

hbs.registerHelper('mensajeInscribir', (curso) => {
	listaCursos = funciones.listarCursos();
    return (Object.keys(listaCursos).length != 0 && listaCursos.some(c => c.estado == 'disponible'))?'':"<div class='alert alert-warning' role='alert'>No hay cursos disponibles para inscripcion</div>";
});