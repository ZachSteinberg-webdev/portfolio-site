if(process.env.NODE_ENV!=="production") {
	const dotenv = require('dotenv').config();
};
const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const ejsMate = require('ejs-mate');
const hmsTime = require('./utilities/hmsTime');
const ContactFormSubmission = require('./models/contact-form-submission-model');
const {
	CustomError,
	tryCatch,
	errorHandler
} = require('./utilities/errorHandling');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.engine('ejs', ejsMate);

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({extended:true}));
app.use(express.json());

app.use(mongoSanitize());

app.get('/', tryCatch(async(req,res)=>{
	res.render('pages/index', {req});
}));

app.post('/contact', tryCatch(async(req,res,next)=>{
	if(req.body.spamTrap!==''){
		res.status(200).end();
	}else{
		const contactSubmissionDetails={name: req.body.name, email: req.body.email, message: req.body.message};
		const newContactSubmission=await new ContactFormSubmission(contactSubmissionDetails);
		await newContactSubmission.save();
		res.render('pages/thankYou');
	};
}));

// 404 route ----------------------------------------------------------------
app.get('/*', (req,res,next)=>{
	next(new CustomError(404, 'Page not found', '404Error'));
});

app.use((err,req,res,next)=>{
	errorHandler(err,req,res,next);
});

const mongoDbUrl = process.env.MONGO_ATLAS_URL;

mongoose.connect(mongoDbUrl)
	.then(()=>{console.log(`${hmsTime()}: Mongo connection open.`)})
	.catch(error=>{console.log(`${hmsTime()}: Mongo error: ${error}`)});

const port = process.env.PORT || 3000;
app.listen(port, ()=>{console.log(`App is listening on port ${port}!`)});
