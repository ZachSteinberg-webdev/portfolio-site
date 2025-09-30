// Nav (large and small) ----------------------------------------------------------------
// Element selections
const html = document.querySelector('html');
const burgerMenu = document.querySelector('#burger-menu');
const navbar = document.querySelector('nav');
const navigationSmall = document.querySelector('#navigation-small');
const navLinks = document.querySelectorAll('.nav-link');
const navLinkButtons = document.querySelectorAll('.nav-link-button');
const bodyClickArea = document.querySelector('body');

// Setting scroll-margin-top ----------------------------------------------------------------
const windowHeight = window.innerHeight;
const windowWidth = window.innerWidth;

if (windowWidth > 414) {
	html.style.setProperty('--scroll-margin-top', '100px');
} else {
	html.style.setProperty('--scroll-margin-top', '80px');
}
// Event listeners --------------------------------------------------------------
burgerMenu.addEventListener('click', () => {
	navigationSmall.classList.toggle('show');
	event.stopPropagation();
});
navLinks.forEach((link) => {
	link.addEventListener('click', () => {
		navigationSmall.classList.toggle('show');
	});
});
navLinkButtons.forEach((link) => {
	link.addEventListener('click', () => {
		const section = document.querySelector(link.dataset.section);
		section.scrollIntoView();
		navigationSmall.classList.toggle('show');
	});
});
bodyClickArea.addEventListener('click', () => {
	if (navigationSmall.classList.contains('show')) {
		navigationSmall.classList.remove('show');
		event.stopPropagation();
	}
});

// Intersection observers ----------------------------------------------------------------
// Element selection for intersection observers
const heroSection = document.querySelector('#hero');
const heroMemojiContainer = document.querySelector('.hero-pic-container');
const aboutSection = document.querySelector('#more-about');
const skillsSection = document.querySelector('#skills');
const zachWonderingMemojiWrapper = document.querySelector('#Zach-wondering-memoji-wrapper');
const html5IconWrapper = document.querySelector('#HTML5-icon-wrapper');
const css3IconWrapper = document.querySelector('#CSS3-icon-wrapper');
const bootstrapIconWrapper = document.querySelector('#bootstrap-icon-wrapper');
const jsIconWrapper = document.querySelector('#JS-icon-wrapper');
const ejsIconWrapper = document.querySelector('#ejs-icon-wrapper');
const npmIconWrapper = document.querySelector('#npm-icon-wrapper');
const nodejsIconWrapper = document.querySelector('#nodejs-icon-wrapper');
const expressjsIconWrapper = document.querySelector('#expressjs-icon-wrapper');
const reactIconWrapper = document.querySelector('#react-icon-wrapper');
const viteIconWrapper = document.querySelector('#vite-icon-wrapper');
const axiosIconWrapper = document.querySelector('#axios-icon-wrapper');
const mongodbIconWrapper = document.querySelector('#mongodb-icon-wrapper');
const mongooseIconWrapper = document.querySelector('#mongoose-icon-wrapper');
const passportjsIconWrapper = document.querySelector('#passportjs-icon-wrapper');
const jwtIconWrapper = document.querySelector('#jwt-icon-wrapper');
const herokuIconWrapper = document.querySelector('#heroku-icon-wrapper');
const zachThumbsUppingMemojiWrapper = document.querySelector('#Zach-thumbs-upping-memoji-wrapper');
// const zachWonderingMemojiWrapperSmall = document.querySelector('#Zach-wondering-memoji-wrapper-small');
// const html5IconWrapperSmall = document.querySelector('#HTML5-icon-wrapper-small');
// const css3IconWrapperSmall = document.querySelector('#CSS3-icon-wrapper-small');
// const bootstrapIconWrapperSmall = document.querySelector('#bootstrap-icon-wrapper-small');
// const jsIconWrapperSmall = document.querySelector('#JS-icon-wrapper-small');
// const ejsIconWrapperSmall = document.querySelector('#ejs-icon-wrapper-small');
// const npmIconWrapperSmall = document.querySelector('#npm-icon-wrapper-small');
// const nodejsIconWrapperSmall = document.querySelector('#nodejs-icon-wrapper-small');
// const expressjsIconWrapperSmall = document.querySelector('#expressjs-icon-wrapper-small');
// const reactIconWrapperSmall = document.querySelector('#react-icon-wrapper-small');
// const viteIconWrapperSmall = document.querySelector('#vite-icon-wrapper-small');
// const axiosIconWrapperSmall = document.querySelector('#axios-icon-wrapper-small');
// const mongodbIconWrapperSmall = document.querySelector('#mongodb-icon-wrapper-small');
// const mongooseIconWrapperSmall = document.querySelector('#mongoose-icon-wrapper-small');
// const passportjsIconWrapperSmall = document.querySelector('#passportjs-icon-wrapper-small');
// const jwtIconWrapperSmall = document.querySelector('#jwt-icon-wrapper-small');
// const herokuIconWrapperSmall = document.querySelector('#heroku-icon-wrapper-small');
// const zachThumbsUppingMemojiWrapperSmall = document.querySelector('#Zach-thumbs-upping-memoji-wrapper-small');
const projectsSection = document.querySelector('#projects');
const zachMemojiWorkingWrapper = document.querySelector('.Zach-Memoji-working-wrapper');
const contactSection = document.querySelector('#contact');
const nameField = document.querySelector('#name-field');
const emailField = document.querySelector('#email-field');
const messageField = document.querySelector('#message-field');
const contactSectionSubmitButtonWrapper = document.querySelector('.submit-button-wrapper');
const contactMemojiContainerAbove500px = document.querySelector('.contact-memoji-container-above-500-px');

// Intersection observers
// Hero observer
const heroObserver = new IntersectionObserver(
	(entries) => {
		entries.forEach((entry) => {
			entry.target.classList.toggle('hidden-until-in-viewport', entry.isIntersecting);
			entry.target.classList.toggle('animate__animated', entry.isIntersecting);
			entry.target.classList.toggle('animate__delay-1s', entry.isIntersecting);
			entry.target.classList.toggle('animate__lightSpeedInLeft', entry.isIntersecting);
			if (entry.isIntersecting) heroObserver.unobserve(entry.target);
		});
	},
	{
		threshold: 0.1,
		root: null,
		rootMargin: '0px'
	}
);
// Hero memoji observer
const heroMemojiObserver = new IntersectionObserver(
	(entries) => {
		entries.forEach((entry) => {
			if (entry.isIntersecting) {
				entry.target.classList.toggle('hero-pic-container-animation', entry.isIntersecting);
				heroMemojiObserver.unobserve(entry.target);
			}
		});
	},
	{
		threshold: 0.1,
		root: null,
		rootMargin: '0px'
	}
);
// More about observer
const aboutObserver = new IntersectionObserver(
	(entries) => {
		entries.forEach((entry) => {
			entry.target.classList.toggle('hidden-until-in-viewport', entry.isIntersecting);
			entry.target.classList.toggle('animate__animated', entry.isIntersecting);
			entry.target.classList.toggle('animate__delay-1s', entry.isIntersecting);
			entry.target.classList.toggle('animate__lightSpeedInRight', entry.isIntersecting);
			if (entry.isIntersecting) aboutObserver.unobserve(entry.target);
		});
	},
	{
		threshold: 0.1,
		root: null,
		rootMargin: '0px'
	}
);
// Skills observer
const skillsObserver = new IntersectionObserver(
	(entries) => {
		entries.forEach((entry) => {
			entry.target.classList.toggle('hidden-until-in-viewport', entry.isIntersecting);
			entry.target.classList.toggle('animate__animated', entry.isIntersecting);
			entry.target.classList.toggle('animate__delay-1s', entry.isIntersecting);
			entry.target.classList.toggle('animate__lightSpeedInLeft', entry.isIntersecting);
			if (entry.isIntersecting) skillsObserver.unobserve(entry.target);
		});
	},
	{
		threshold: 0.1,
		root: null,
		rootMargin: '0px'
	}
);
// Skill icons observers
// Zach wondering memoji observer
const zachWonderingMemojiObserver = new IntersectionObserver(
	(entries) => {
		entries.forEach((entry) => {
			entry.target.classList.toggle('animate__animated', entry.isIntersecting);
			entry.target.classList.toggle('animate__pulse', entry.isIntersecting);
		});
	},
	{
		threshold: 1,
		root: null,
		rootMargin: '0px'
	}
);
// HTML 5 icon observer
const htmlIconObserver = new IntersectionObserver(
	(entries) => {
		entries.forEach((entry) => {
			entry.target.classList.toggle('animate__animated', entry.isIntersecting);
			entry.target.classList.toggle('animate__delay-1s', entry.isIntersecting);
			entry.target.classList.toggle('animate__pulse', entry.isIntersecting);
		});
	},
	{
		threshold: 1,
		root: null,
		rootMargin: '0px'
	}
);
// CSS 3 icon observer
const css3IconObserver = new IntersectionObserver(
	(entries) => {
		entries.forEach((entry) => {
			entry.target.classList.toggle('animate__animated', entry.isIntersecting);
			entry.target.classList.toggle('animate__delay-2s', entry.isIntersecting);
			entry.target.classList.toggle('animate__pulse', entry.isIntersecting);
		});
	},
	{
		threshold: 1,
		root: null,
		rootMargin: '0px'
	}
);
// Bootstrap icon observer
const bootstrapIconObserver = new IntersectionObserver(
	(entries) => {
		entries.forEach((entry) => {
			entry.target.classList.toggle('animate__animated', entry.isIntersecting);
			entry.target.classList.toggle('animate__delay-3s', entry.isIntersecting);
			entry.target.classList.toggle('animate__pulse', entry.isIntersecting);
		});
	},
	{
		threshold: 1,
		root: null,
		rootMargin: '0px'
	}
);
// JS icon observer
const jsIconObserver = new IntersectionObserver(
	(entries) => {
		entries.forEach((entry) => {
			entry.target.classList.toggle('animate__animated', entry.isIntersecting);
			entry.target.classList.toggle('animate__delay-4s', entry.isIntersecting);
			entry.target.classList.toggle('animate__pulse', entry.isIntersecting);
		});
	},
	{
		threshold: 1,
		root: null,
		rootMargin: '0px'
	}
);
// EJS icon observer
const ejsIconObserver = new IntersectionObserver(
	(entries) => {
		entries.forEach((entry) => {
			entry.target.classList.toggle('animate__animated', entry.isIntersecting);
			entry.target.classList.toggle('animate__delay-5s', entry.isIntersecting);
			entry.target.classList.toggle('animate__pulse', entry.isIntersecting);
		});
	},
	{
		threshold: 1,
		root: null,
		rootMargin: '0px'
	}
);
// NPM icon observer
const npmIconObserver = new IntersectionObserver(
	(entries) => {
		entries.forEach((entry) => {
			entry.target.classList.toggle('animate__animated', entry.isIntersecting);
			entry.target.classList.toggle('animate__pulse', entry.isIntersecting);
		});
	},
	{
		threshold: 1,
		root: null,
		rootMargin: '0px'
	}
);
// Node.js icon observer
const nodejsIconObserver = new IntersectionObserver(
	(entries) => {
		entries.forEach((entry) => {
			entry.target.classList.toggle('animate__animated', entry.isIntersecting);
			entry.target.classList.toggle('animate__delay-1s', entry.isIntersecting);
			entry.target.classList.toggle('animate__pulse', entry.isIntersecting);
		});
	},
	{
		threshold: 1,
		root: null,
		rootMargin: '0px'
	}
);
// Express.js icon observer
const expressjsIconObserver = new IntersectionObserver(
	(entries) => {
		entries.forEach((entry) => {
			entry.target.classList.toggle('animate__animated', entry.isIntersecting);
			entry.target.classList.toggle('animate__delay-2s', entry.isIntersecting);
			entry.target.classList.toggle('animate__pulse', entry.isIntersecting);
		});
	},
	{
		threshold: 1,
		root: null,
		rootMargin: '0px'
	}
);
// React icon observer
const reactIconObserver = new IntersectionObserver(
	(entries) => {
		entries.forEach((entry) => {
			entry.target.classList.toggle('animate__animated', entry.isIntersecting);
			entry.target.classList.toggle('animate__delay-3s', entry.isIntersecting);
			entry.target.classList.toggle('animate__pulse', entry.isIntersecting);
		});
	},
	{
		threshold: 1,
		root: null,
		rootMargin: '0px'
	}
);
// Vite icon observer
const viteIconObserver = new IntersectionObserver(
	(entries) => {
		entries.forEach((entry) => {
			entry.target.classList.toggle('animate__animated', entry.isIntersecting);
			entry.target.classList.toggle('animate__delay-4s', entry.isIntersecting);
			entry.target.classList.toggle('animate__pulse', entry.isIntersecting);
		});
	},
	{
		threshold: 1,
		root: null,
		rootMargin: '0px'
	}
);
// Axios icon observer
const axiosIconObserver = new IntersectionObserver(
	(entries) => {
		entries.forEach((entry) => {
			entry.target.classList.toggle('animate__animated', entry.isIntersecting);
			entry.target.classList.toggle('animate__delay-5s', entry.isIntersecting);
			entry.target.classList.toggle('animate__pulse', entry.isIntersecting);
		});
	},
	{
		threshold: 1,
		root: null,
		rootMargin: '0px'
	}
);
// MongoDB icon observer
const mongodbIconObserver = new IntersectionObserver(
	(entries) => {
		entries.forEach((entry) => {
			entry.target.classList.toggle('animate__animated', entry.isIntersecting);
			entry.target.classList.toggle('animate__pulse', entry.isIntersecting);
		});
	},
	{
		threshold: 1,
		root: null,
		rootMargin: '0px'
	}
);
// Mongoose icon observer
const mongooseIconObserver = new IntersectionObserver(
	(entries) => {
		entries.forEach((entry) => {
			entry.target.classList.toggle('animate__animated', entry.isIntersecting);
			entry.target.classList.toggle('animate__delay-1s', entry.isIntersecting);
			entry.target.classList.toggle('animate__pulse', entry.isIntersecting);
		});
	},
	{
		threshold: 1,
		root: null,
		rootMargin: '0px'
	}
);
// Passport.js icon observer
const passportjsIconObserver = new IntersectionObserver(
	(entries) => {
		entries.forEach((entry) => {
			entry.target.classList.toggle('animate__animated', entry.isIntersecting);
			entry.target.classList.toggle('animate__delay-2s', entry.isIntersecting);
			entry.target.classList.toggle('animate__pulse', entry.isIntersecting);
		});
	},
	{
		threshold: 1,
		root: null,
		rootMargin: '0px'
	}
);
// JWT icon observer
const jwtIconObserver = new IntersectionObserver(
	(entries) => {
		entries.forEach((entry) => {
			entry.target.classList.toggle('animate__animated', entry.isIntersecting);
			entry.target.classList.toggle('animate__delay-3s', entry.isIntersecting);
			entry.target.classList.toggle('animate__pulse', entry.isIntersecting);
		});
	},
	{
		threshold: 1,
		root: null,
		rootMargin: '0px'
	}
);
// Heroku icon observer
const herokuIconObserver = new IntersectionObserver(
	(entries) => {
		entries.forEach((entry) => {
			entry.target.classList.toggle('animate__animated', entry.isIntersecting);
			entry.target.classList.toggle('animate__delay-4s', entry.isIntersecting);
			entry.target.classList.toggle('animate__pulse', entry.isIntersecting);
		});
	},
	{
		threshold: 1,
		root: null,
		rootMargin: '0px'
	}
);
// Zach thumbs-upping memoji observer
const zachThumbsUppingMemojiObserver = new IntersectionObserver(
	(entries) => {
		entries.forEach((entry) => {
			entry.target.classList.toggle('animate__animated', entry.isIntersecting);
			entry.target.classList.toggle('animate__delay-5s', entry.isIntersecting);
			entry.target.classList.toggle('animate__pulse', entry.isIntersecting);
		});
	},
	{
		threshold: 1,
		root: null,
		rootMargin: '0px'
	}
);
// Skill icons small observers
// Zach wondering memoji small observer
// const zachWonderingMemojiSmallObserver = new IntersectionObserver(
// 	(entries) => {
// 		entries.forEach((entry) => {
// 			entry.target.classList.toggle('animate__animated', entry.isIntersecting);
// 			entry.target.classList.toggle('animate__pulse', entry.isIntersecting);
// 		});
// 	},
// 	{
// 		threshold: 1,
// 		root: null,
// 		rootMargin: '0px'
// 	}
// );
// HTML 5 icon small observer
// const htmlIconSmallObserver = new IntersectionObserver(
// 	(entries) => {
// 		entries.forEach((entry) => {
// 			entry.target.classList.toggle('animate__animated', entry.isIntersecting);
// 			entry.target.classList.toggle('animate__delay-1s', entry.isIntersecting);
// 			entry.target.classList.toggle('animate__pulse', entry.isIntersecting);
// 		});
// 	},
// 	{
// 		threshold: 1,
// 		root: null,
// 		rootMargin: '0px'
// 	}
// );
// // CSS 3 icon small observer
// const css3IconSmallObserver = new IntersectionObserver(
// 	(entries) => {
// 		entries.forEach((entry) => {
// 			entry.target.classList.toggle('animate__animated', entry.isIntersecting);
// 			entry.target.classList.toggle('animate__pulse', entry.isIntersecting);
// 		});
// 	},
// 	{
// 		threshold: 1,
// 		root: null,
// 		rootMargin: '0px'
// 	}
// );
// // Bootstrap icon small observer
// const bootstrapIconSmallObserver = new IntersectionObserver(
// 	(entries) => {
// 		entries.forEach((entry) => {
// 			entry.target.classList.toggle('animate__animated', entry.isIntersecting);
// 			entry.target.classList.toggle('animate__delay-1s', entry.isIntersecting);
// 			entry.target.classList.toggle('animate__pulse', entry.isIntersecting);
// 		});
// 	},
// 	{
// 		threshold: 1,
// 		root: null,
// 		rootMargin: '0px'
// 	}
// );
// // JS icon small observer
// const jsIconSmallObserver = new IntersectionObserver(
// 	(entries) => {
// 		entries.forEach((entry) => {
// 			entry.target.classList.toggle('animate__animated', entry.isIntersecting);
// 			entry.target.classList.toggle('animate__pulse', entry.isIntersecting);
// 		});
// 	},
// 	{
// 		threshold: 1,
// 		root: null,
// 		rootMargin: '0px'
// 	}
// );
// // EJS icon small observer
// const ejsIconSmallObserver = new IntersectionObserver(
// 	(entries) => {
// 		entries.forEach((entry) => {
// 			entry.target.classList.toggle('animate__animated', entry.isIntersecting);
// 			entry.target.classList.toggle('animate__delay-1s', entry.isIntersecting);
// 			entry.target.classList.toggle('animate__pulse', entry.isIntersecting);
// 		});
// 	},
// 	{
// 		threshold: 1,
// 		root: null,
// 		rootMargin: '0px'
// 	}
// );
// // NPM icon small observer
// const npmIconSmallObserver = new IntersectionObserver(
// 	(entries) => {
// 		entries.forEach((entry) => {
// 			entry.target.classList.toggle('animate__animated', entry.isIntersecting);
// 			entry.target.classList.toggle('animate__pulse', entry.isIntersecting);
// 		});
// 	},
// 	{
// 		threshold: 1,
// 		root: null,
// 		rootMargin: '0px'
// 	}
// );
// // Node.js icon small observer
// const nodejsIconSmallObserver = new IntersectionObserver(
// 	(entries) => {
// 		entries.forEach((entry) => {
// 			entry.target.classList.toggle('animate__animated', entry.isIntersecting);
// 			entry.target.classList.toggle('animate__delay-1s', entry.isIntersecting);
// 			entry.target.classList.toggle('animate__pulse', entry.isIntersecting);
// 		});
// 	},
// 	{
// 		threshold: 1,
// 		root: null,
// 		rootMargin: '0px'
// 	}
// );
// // Express.js icon small observer
// const expressjsIconSmallObserver = new IntersectionObserver(
// 	(entries) => {
// 		entries.forEach((entry) => {
// 			entry.target.classList.toggle('animate__animated', entry.isIntersecting);
// 			entry.target.classList.toggle('animate__pulse', entry.isIntersecting);
// 		});
// 	},
// 	{
// 		threshold: 1,
// 		root: null,
// 		rootMargin: '0px'
// 	}
// );
// // React icon small observer
// const reactIconSmallObserver = new IntersectionObserver(
// 	(entries) => {
// 		entries.forEach((entry) => {
// 			entry.target.classList.toggle('animate__animated', entry.isIntersecting);
// 			entry.target.classList.toggle('animate__delay-1s', entry.isIntersecting);
// 			entry.target.classList.toggle('animate__pulse', entry.isIntersecting);
// 		});
// 	},
// 	{
// 		threshold: 1,
// 		root: null,
// 		rootMargin: '0px'
// 	}
// );
// // Vite icon small observer
// const viteIconSmallObserver = new IntersectionObserver(
// 	(entries) => {
// 		entries.forEach((entry) => {
// 			entry.target.classList.toggle('animate__animated', entry.isIntersecting);
// 			entry.target.classList.toggle('animate__pulse', entry.isIntersecting);
// 		});
// 	},
// 	{
// 		threshold: 1,
// 		root: null,
// 		rootMargin: '0px'
// 	}
// );
// // Axios icon small observer
// const axiosIconSmallObserver = new IntersectionObserver(
// 	(entries) => {
// 		entries.forEach((entry) => {
// 			entry.target.classList.toggle('animate__animated', entry.isIntersecting);
// 			entry.target.classList.toggle('animate__delay-1s', entry.isIntersecting);
// 			entry.target.classList.toggle('animate__pulse', entry.isIntersecting);
// 		});
// 	},
// 	{
// 		threshold: 1,
// 		root: null,
// 		rootMargin: '0px'
// 	}
// );
// // MongoDB icon small observer
// const mongodbIconSmallObserver = new IntersectionObserver(
// 	(entries) => {
// 		entries.forEach((entry) => {
// 			entry.target.classList.toggle('animate__animated', entry.isIntersecting);
// 			entry.target.classList.toggle('animate__pulse', entry.isIntersecting);
// 		});
// 	},
// 	{
// 		threshold: 1,
// 		root: null,
// 		rootMargin: '0px'
// 	}
// );
// // Mongoose icon small observer
// const mongooseIconSmallObserver = new IntersectionObserver(
// 	(entries) => {
// 		entries.forEach((entry) => {
// 			entry.target.classList.toggle('animate__animated', entry.isIntersecting);
// 			entry.target.classList.toggle('animate__delay-1s', entry.isIntersecting);
// 			entry.target.classList.toggle('animate__pulse', entry.isIntersecting);
// 		});
// 	},
// 	{
// 		threshold: 1,
// 		root: null,
// 		rootMargin: '0px'
// 	}
// );
// // Passport.js icon small observer
// const passportjsIconSmallObserver = new IntersectionObserver(
// 	(entries) => {
// 		entries.forEach((entry) => {
// 			entry.target.classList.toggle('animate__animated', entry.isIntersecting);
// 			entry.target.classList.toggle('animate__pulse', entry.isIntersecting);
// 		});
// 	},
// 	{
// 		threshold: 1,
// 		root: null,
// 		rootMargin: '0px'
// 	}
// );
// // JWT icon small observer
// const jwtIconSmallObserver = new IntersectionObserver(
// 	(entries) => {
// 		entries.forEach((entry) => {
// 			entry.target.classList.toggle('animate__animated', entry.isIntersecting);
// 			entry.target.classList.toggle('animate__delay-1s', entry.isIntersecting);
// 			entry.target.classList.toggle('animate__pulse', entry.isIntersecting);
// 		});
// 	},
// 	{
// 		threshold: 1,
// 		root: null,
// 		rootMargin: '0px'
// 	}
// );
// // Heroku icon small observer
// const herokuIconSmallObserver = new IntersectionObserver(
// 	(entries) => {
// 		entries.forEach((entry) => {
// 			entry.target.classList.toggle('animate__animated', entry.isIntersecting);
// 			entry.target.classList.toggle('animate__pulse', entry.isIntersecting);
// 		});
// 	},
// 	{
// 		threshold: 1,
// 		root: null,
// 		rootMargin: '0px'
// 	}
// );
// // Zach thumbs-upping memoji small observer
// const zachThumbsUppingMemojiSmallObserver = new IntersectionObserver(
// 	(entries) => {
// 		entries.forEach((entry) => {
// 			entry.target.classList.toggle('animate__animated', entry.isIntersecting);
// 			entry.target.classList.toggle('animate__delay-1s', entry.isIntersecting);
// 			entry.target.classList.toggle('animate__pulse', entry.isIntersecting);
// 		});
// 	},
// 	{
// 		threshold: 1,
// 		root: null,
// 		rootMargin: '0px'
// 	}
// );
// Projects observer
const projectsObserver = new IntersectionObserver(
	(entries) => {
		entries.forEach((entry) => {
			entry.target.classList.toggle('hidden-until-in-viewport', entry.isIntersecting);
			entry.target.classList.toggle('animate__animated', entry.isIntersecting);
			entry.target.classList.toggle('animate__delay-1s', entry.isIntersecting);
			entry.target.classList.toggle('animate__lightSpeedInRight', entry.isIntersecting);
			if (entry.isIntersecting) projectsObserver.unobserve(entry.target);
		});
	},
	{
		threshold: 0.1,
		root: null,
		rootMargin: '0px'
	}
);
// Zach-Memoji-working observer
const zachMemojiWorkingWrapperObserver = new IntersectionObserver(
	(entries) => {
		entries.forEach((entry) => {
			entry.target.classList.toggle('Zach-Memoji-working-animation', entry.isIntersecting);
			if (entry.isIntersecting) zachMemojiWorkingWrapperObserver.unobserve(entry.target);
		});
	},
	{
		threshold: 1,
		root: null,
		rootMargin: '0px'
	}
);
// Contact observer
const contactObserver = new IntersectionObserver(
	(entries) => {
		entries.forEach((entry) => {
			entry.target.classList.toggle('hidden-until-in-viewport', entry.isIntersecting);
			entry.target.classList.toggle('animate__animated', entry.isIntersecting);
			entry.target.classList.toggle('animate__delay-1s', entry.isIntersecting);
			entry.target.classList.toggle('animate__lightSpeedInLeft', entry.isIntersecting);
			if (entry.isIntersecting) contactObserver.unobserve(entry.target);
		});
	},
	{
		threshold: 0.1,
		root: null,
		rootMargin: '0px'
	}
);
// Name field observer
const nameFieldObserver = new IntersectionObserver(
	(entries) => {
		entries.forEach((entry) => {
			entry.target.classList.toggle('animate__animated', entry.isIntersecting);
			entry.target.classList.toggle('animate__pulse', entry.isIntersecting);
			if (entry.isIntersecting) nameFieldObserver.unobserve(entry.target);
		});
	},
	{
		threshold: 1,
		root: null,
		rootMargin: '0px'
	}
);
// Email field observer
const emailFieldObserver = new IntersectionObserver(
	(entries) => {
		entries.forEach((entry) => {
			entry.target.classList.toggle('animate__animated', entry.isIntersecting);
			entry.target.classList.toggle('animate__pulse', entry.isIntersecting);
			if (entry.isIntersecting) emailFieldObserver.unobserve(entry.target);
		});
	},
	{
		threshold: 1,
		root: null,
		rootMargin: '0px'
	}
);
// Message field observer
const messageFieldObserver = new IntersectionObserver(
	(entries) => {
		entries.forEach((entry) => {
			entry.target.classList.toggle('animate__animated', entry.isIntersecting);
			entry.target.classList.toggle('animate__pulse', entry.isIntersecting);
			if (entry.isIntersecting) messageFieldObserver.unobserve(entry.target);
		});
	},
	{
		threshold: 1,
		root: null,
		rootMargin: '0px'
	}
);

const contactMemojiContainerAbove500pxObserver = new IntersectionObserver(
	(entries) => {
		entries.forEach((entry) => {
			if (entry.isIntersecting) {
				entry.target.classList.toggle('contact-memoji-animation', entry.isIntersecting);
				if (entry.isIntersecting) contactMemojiContainerAbove500pxObserver.unobserve(entry.target);
			}
		});
	},
	{
		threshold: 1,
		root: null,
		rootMargin: '0px'
	}
);

// Contact section submit button observer and set-up
async function timer(fn, entry, milliseconds) {
	await new Promise((resolve) => {
		setTimeout(resolve, milliseconds);
	});
	fn(entry);
}

async function animation01(entry) {
	if (
		document.activeElement.id == 'name-field' ||
		document.activeElement.id == 'email-field' ||
		document.activeElement.id == 'message-field'
	) {
	} else if (!entry.isIntersecting) {
		contactSectionSubmitButtonObserver.unobserve(entry.target);
	} else {
		contactSectionSubmitButtonWrapper.classList.remove('animate__headShake');
		contactSectionSubmitButtonWrapper.classList.add('animate__pulse');
	}
}

async function animation02(entry) {
	contactSectionSubmitButtonWrapper.classList.remove('animate__pulse');
	if (
		document.activeElement.id == 'name-field' ||
		document.activeElement.id == 'email-field' ||
		document.activeElement.id == 'message-field'
	) {
	} else if (!entry.isIntersecting) {
		contactSectionSubmitButtonObserver.unobserve(entry.target);
	} else {
		contactSectionSubmitButtonWrapper.classList.add('animate__headShake');
	}
}

const contactSectionSubmitButtonObserver = new IntersectionObserver(
	async (entries) => {
		for (let entry of entries) {
			while (entry.isIntersecting) {
				await timer(animation01, entry, 3000);
				await timer(animation02, entry, 3000);
				contactSectionSubmitButtonObserver.unobserve(entry.target);
			}
		}
	},
	{
		threshold: 1,
		root: null,
		rootMargin: '0px'
	}
);

heroObserver.observe(heroSection);
heroMemojiObserver.observe(heroMemojiContainer);
aboutObserver.observe(aboutSection);
skillsObserver.observe(skillsSection);
zachWonderingMemojiObserver.observe(zachWonderingMemojiWrapper);
htmlIconObserver.observe(html5IconWrapper);
css3IconObserver.observe(css3IconWrapper);
bootstrapIconObserver.observe(bootstrapIconWrapper);
jsIconObserver.observe(jsIconWrapper);
ejsIconObserver.observe(ejsIconWrapper);
npmIconObserver.observe(npmIconWrapper);
nodejsIconObserver.observe(nodejsIconWrapper);
expressjsIconObserver.observe(expressjsIconWrapper);
reactIconObserver.observe(reactIconWrapper);
viteIconObserver.observe(viteIconWrapper);
axiosIconObserver.observe(axiosIconWrapper);
mongodbIconObserver.observe(mongodbIconWrapper);
mongooseIconObserver.observe(mongooseIconWrapper);
passportjsIconObserver.observe(passportjsIconWrapper);
jwtIconObserver.observe(jwtIconWrapper);
herokuIconObserver.observe(herokuIconWrapper);
zachThumbsUppingMemojiObserver.observe(zachThumbsUppingMemojiWrapper);
// zachWonderingMemojiSmallObserver.observe(zachWonderingMemojiWrapperSmall);
// htmlIconSmallObserver.observe(html5IconWrapperSmall);
// css3IconSmallObserver.observe(css3IconWrapperSmall);
// bootstrapIconSmallObserver.observe(bootstrapIconWrapperSmall);
// jsIconSmallObserver.observe(jsIconWrapperSmall);
// ejsIconSmallObserver.observe(ejsIconWrapperSmall);
// npmIconSmallObserver.observe(npmIconWrapperSmall);
// nodejsIconSmallObserver.observe(nodejsIconWrapperSmall);
// expressjsIconSmallObserver.observe(expressjsIconWrapperSmall);
// reactIconSmallObserver.observe(reactIconWrapperSmall);
// viteIconSmallObserver.observe(viteIconWrapperSmall);
// axiosIconSmallObserver.observe(axiosIconWrapperSmall);
// mongodbIconSmallObserver.observe(mongodbIconWrapperSmall);
// mongooseIconSmallObserver.observe(mongooseIconWrapperSmall);
// passportjsIconSmallObserver.observe(passportjsIconWrapperSmall);
// jwtIconSmallObserver.observe(jwtIconWrapperSmall);
// herokuIconSmallObserver.observe(herokuIconWrapperSmall);
// zachThumbsUppingMemojiSmallObserver.observe(zachThumbsUppingMemojiWrapperSmall);
projectsObserver.observe(projectsSection);
// zachMemojiWorkingWrapperObserver.observe(zachMemojiWorkingWrapper);
contactObserver.observe(contactSection);
nameFieldObserver.observe(nameField);
emailFieldObserver.observe(emailField);
messageFieldObserver.observe(messageField);
if (!window.navigator.vendor.includes('Apple')) {
	contactSectionSubmitButtonObserver.observe(contactSectionSubmitButtonWrapper);
}
// speechBubbleAndContactMemojiContainerObserver.observe(speechBubbleAndContactMemojiContainer);
contactMemojiContainerAbove500pxObserver.observe(contactMemojiContainerAbove500px);

// More about section max-height CSS setting and "read more" button click handler
// Element selections
const moreAboutSectionReadMoreButtonContainer = document.querySelector('.more-about-read-more-button-container');
const moreAboutSectionReadMoreButton = document.querySelector('.more-about-section-read-more-button');

// Event handlers
//Setting initial max-height of the "more about" section
const heroSectionClientHeight = heroSection.clientHeight;
aboutSection.style.setProperty('--max-height', `${heroSectionClientHeight}px`); // (Must follow intersection observer section)

// Handling clicks on "read more" button (ver. 2 - keep button shown after expanding and change to a contract section button)
const moreAboutSectionReadMoreButtonClickHandler = () => {
	if (moreAboutSectionReadMoreButton.innerText.includes('Expand')) {
		moreAboutSectionReadMoreButtonContainer.classList.add('more-about-read-more-button-container-expanded');
		aboutSection.style.setProperty('--transition', 'max-height 2000ms ease');
		const aboutSectionScrollHeight = aboutSection.scrollHeight;
		aboutSection.style.setProperty('--max-height', `${aboutSectionScrollHeight}px`);
		moreAboutSectionReadMoreButton.classList.add('animate__flip');
		setTimeout(() => {
			moreAboutSectionReadMoreButton.innerText = 'Collapse this section';
		}, 1000);
		setTimeout(() => {
			moreAboutSectionReadMoreButton.classList.remove('animate__flip');
		}, 2000);
	} else {
		const aboutSectionWrapper = document.querySelector('#more-about-section-wrapper');
		aboutSectionWrapper.scrollIntoView();
		moreAboutSectionReadMoreButtonContainer.classList.remove('more-about-read-more-button-container-expanded');
		aboutSection.style.setProperty('--max-height', `${heroSectionClientHeight}px`);
		moreAboutSectionReadMoreButton.classList.add('animate__flip');
		setTimeout(() => {
			moreAboutSectionReadMoreButton.innerText = 'Expand this section';
		}, 1000);
		setTimeout(() => {
			moreAboutSectionReadMoreButton.classList.remove('animate__flip');
		}, 2000);
	}
};

// Event listeners
moreAboutSectionReadMoreButton.addEventListener('click', moreAboutSectionReadMoreButtonClickHandler);

// Expanding/collapsing project tiles ----------------------------------------------------------------
// Element selections
const projectContainers = document.querySelectorAll('.project-container');
const projectDetailsContainers = document.querySelectorAll('.project-details-container');
const projectButtons = document.querySelectorAll('.project-button');
const projectExpandButtons = document.querySelectorAll('.project-expand-button');
// const zachMemojiWorkingContainer = document.querySelector('#Zach-Memoji-working-container');
// const workingMemojiTextInsertionPoint = document.querySelector('.message-insertion-point');
// const workingMemoji = document.querySelector('#Zach-Memoji-working');
// const memojiContainerExpandButton = document.querySelector('#project-expand-button-4');

// Variables
// let memojiContainerAlreadyClicked = false;

// Class add/remove functions
const addGrandparentClass = (element, className) => {
	return element.parentElement.parentElement.classList.add(className);
};
const removeGrandparentClass = (element, className) => {
	return element.parentElement.parentElement.classList.remove(className);
};
const setGrandparentStyle = (element, styleName, styleProperty) => {
	return element.parentElement.parentElement.style.setProperty(styleName, styleProperty);
};
const addPrevSibClass = (element, className) => {
	return element.previousElementSibling.classList.add(className);
};
const removePrevSibClass = (element, className) => {
	return element.previousElementSibling.classList.remove(className);
};
const addNextSibClass = (element, className) => {
	return element.nextElementSibling.classList.add(className);
};
const addNextNextSibClass = (element, className) => {
	return element.nextElementSibling.nextElementSibling.classList.add(className);
};
const removeNextSibClass = (element, className) => {
	return element.nextElementSibling.classList.remove(className);
};
const removeNextNextSibClass = (element, className) => {
	return element.nextElementSibling.nextElementSibling.classList.remove(className);
};

// Event handlers
const projectExpandButtonClickHandler = (event) => {
	// When a project container expand button is clicked...
	let target = event.target; // create a variable for the click target (button clicked)...
	let previousParent = target.parentElement.parentElement.previousElementSibling; // and create a varible for previous parent element...
	let nextParent = target.parentElement.parentElement.nextElementSibling; // and create a variable for next parent element...
	let previousParentOpacity = ''; // and initialize the previousParentOpacity variable...
	let nextParentOpacity = ''; // and initialize the nextParentOpacity variable.
	if (previousParent !== null) {
		// If a previous parent doesn't exist, ignore it, else...
		previousParentOpacity = window.getComputedStyle(previousParent).opacity; // calculate the previous parent's opacity.
	}
	if (nextParent !== null) {
		// If a next parent doesn't exist, ignore it, else...
		nextParentOpacity = window.getComputedStyle(nextParent).opacity; // calculate the next parent's opacity.
	}
	if (previousParentOpacity === '1' || nextParentOpacity === '1') {
		// If no container is expanded, then...
		projectExpandButtons.forEach((item) => {
			// for each button...
			if (item.contains(target)) {
				// if the button is the clicked button, then...
				removeGrandparentClass(item, 'project-container-collapsed'); // remove all four animation classes...
				removeGrandparentClass(item, 'project-container-unhidden');
				removeGrandparentClass(item, 'project-container-expanded');
				removeGrandparentClass(item, 'project-container-hidden');
				addGrandparentClass(item, 'project-container-expanded'); // and add the expanded container class, then...
				setGrandparentStyle(item, '--hover-scale', '1');
				setGrandparentStyle(item, '--hover-border-color', '#CCC7C7');
				setGrandparentStyle(item, '--hover-color', 'unset');
				setTimeout(() => {
					// set a time-out to...
					item.innerText = 'Collapse this section'; // change the button's text...
					addNextSibClass(item, 'project-visit-button-expanded'); // add expanded button class to gitHub button...
					addNextNextSibClass(item, 'project-visit-button-expanded'); // add expanded button class to visit button...
				}, 1000);
			} else {
				// if the button is not the clicked button, then...
				item.innerText = 'Fading away...'; // change the button's text...
				removeGrandparentClass(item, 'project-container-collapsed'); // remove all four animation classes...
				removeGrandparentClass(item, 'project-container-unhidden');
				removeGrandparentClass(item, 'project-container-expanded');
				removeGrandparentClass(item, 'project-container-hidden');
				addGrandparentClass(item, 'project-container-hidden'); // and add the hidden container class, else...
				setTimeout(() => {
					setGrandparentStyle(item, 'display', 'none');
				}, 1000);
			}
		});
		setTimeout(() => {
			projectButtons.forEach((item) => {
				item.classList.add('project-button-expanded');
			});
		}, 1000);
	} else {
		// if one of the containers is expanded, then...
		projectExpandButtons.forEach((item) => {
			// for each button...
			if (item.contains(target)) {
				// if the button is the clicked button, then...
				removeGrandparentClass(item, 'project-container-collapsed');
				removeGrandparentClass(item, 'project-container-unhidden');
				removeGrandparentClass(item, 'project-container-expanded');
				removeGrandparentClass(item, 'project-container-hidden');
				addGrandparentClass(item, 'project-container-collapsed');
				removeNextSibClass(item, 'project-visit-button-expanded');
				removeNextNextSibClass(item, 'project-visit-button-expanded');
				setTimeout(() => {
					setGrandparentStyle(item, '--hover-scale', '1.05');
					setGrandparentStyle(item, '--hover-border-color', 'white');
					setGrandparentStyle(item, '--hover-color', 'white');
					item.innerText = 'Expand this section'; // and change the button's text, else...
				}, 1000);
			} else {
				// if the button is not the clicked button, then...
				item.innerText = 'Expand this section'; // change the button's text...
				addGrandparentClass(item, 'project-container-unhidden');
				setTimeout(() => {
					setGrandparentStyle(item, 'display', 'flex');
				}, 900);
				setTimeout(() => {
					// set a time-out to...
					removeGrandparentClass(item, 'project-container-collapsed');
					removeGrandparentClass(item, 'project-container-unhidden');
					removeGrandparentClass(item, 'project-container-expanded');
					removeGrandparentClass(item, 'project-container-hidden');
				}, 2500);
			}
		});
		setTimeout(() => {
			projectButtons.forEach((item) => {
				item.classList.remove('project-button-expanded');
			});
		}, 1000);
	}
};

// Event listeners
projectExpandButtons.forEach((item) => {
	item.addEventListener('click', projectExpandButtonClickHandler);
});

// Contact form
const contactForm = document.querySelector('#contact-form');
const inputFields = document.querySelectorAll('.input-field');
const contactSubmitButton = document.querySelector('.submit-btn');

const handleContactFormSubmit = async (e) => {
	e.preventDefault();
	contactSubmitButton.innerText = `Thank you! I'll be in touch!`;
	const formData = new FormData(document.getElementById('contact-form'));
	const spamTrap = formData.get('spamTrap');
	const name = formData.get('name');
	const email = formData.get('email');
	const message = formData.get('message');
	const test = await fetch('/contact', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			spamTrap: spamTrap,
			name: name,
			email: email,
			message: message
		})
	}).catch((err) => console.log(err));
	inputFields.forEach((field, i) => {
		field.value = '';
	});
	return false;
};

contactForm.addEventListener('submit', handleContactFormSubmit);
