// Try-catch wrapper for async route functions
const tryCatch = (fn)=>{
	return(req,res,next)=>{
		fn(req,res,next).catch(next);
	};
};

// Custom error handler
class CustomError extends Error {
	constructor(status, message, name, route){
		super();
		this.status = status;
		this.message = message;
		this.name = name;
		this.route = route;
	};
};

const errorHandler = ((err,req,res,next)=>{
	const {status=500, message="Something somewhere somehow went wrong. That's all we know. :(", name='GenericError', route='Route unspecified'}=err;
	console.log('***********************************************************');
	console.log('***************************ERROR***************************');
	console.log('***********************************************************');
	console.log('err in errorHandler', err);
	console.log(`HTTP status: ${status}, Error message: ${message}, Error name: ${name}, Route: ${route}`);
	if(name==="404Error"){
		res.status(status).render('pages/status404', {err});
	}else if(name==="CastError"){
		res.status(404).render('pages/status404', {err});
	}else if(route==='registrationRoute'){
		if(name==="registrationError"){
			const originalUrl = req.get('referer');
			res.redirect(originalUrl);
		}else if(name==="MissingUsernameError"){
			const originalUrl = req.get('referer');
			res.redirect(originalUrl);
		}else if(name==="MissingPasswordError"){
			const originalUrl = req.get('referer');
			res.redirect(originalUrl);
		};
	}else{
		const originalUrl = req.get('referer');
		res.redirect(originalUrl);
	};
});

const errorStringToShowUser = (stringArg)=>{
	const lastColonIndex = stringArg.lastIndexOf(':');
	if(lastColonIndex>=0){
		return stringArg.slice(lastColonIndex+2);
	}else{
		return stringArg;
	};
};

module.exports = {CustomError, tryCatch, errorHandler};
