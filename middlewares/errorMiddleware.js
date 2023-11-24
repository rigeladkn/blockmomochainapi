async function notFound(req,res,next){
    const error = new Error(`Not found - ${req.originalUrl}`);
    res.status(404);
    next(error);
}

async function errorHandler(error,req,res,next){
   let statusCode = res.statusCode == 200 ? 500 : res.statusCode; 
   let message = error.message;
   if(error.name === 'CastError' && error.kind ==  'ObjectId'){
    statusCode = 404;
    message = 'Ressource not found';
   }

   res.status(statusCode).json({
    message : message,
    success : false,
    stack : process.env.NODE_ENV === 'production' ? null : error.stack
   })
}

module.exports = {
    notFound : notFound,
    errorHandler : errorHandler
}