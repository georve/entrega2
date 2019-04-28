process.env.PORT = process.env.PORT || 3000;
process.env.NODE_ENV = process.env.NODE_ENV || 'local';

let urlDB
if (process.env.NODE_ENV === 'local'){
	urlDB = 'mongodb://localhost:27017/estudiantes';
}
else {
	urlDB = 'mongodb+srv://georve:oPaEv7YOmgWt39mq@nodecursejs-lddv7.mongodb.net/estudiantes?retryWrites=true'
}

process.env.URLDB = urlDB;

process.env.EMAIL="coordinadornode2019@gmail.com";

process.env.SENGRID_API_KEY='abc'