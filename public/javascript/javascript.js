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
// const zachMemojiWorkingWrapperObserver = new IntersectionObserver(
// 	(entries) => {
// 		entries.forEach((entry) => {
// 			entry.target.classList.toggle('Zach-Memoji-working-animation', entry.isIntersecting);
// 			if (entry.isIntersecting) zachMemojiWorkingWrapperObserver.unobserve(entry.target);
// 		});
// 	},
// 	{
// 		threshold: 1,
// 		root: null,
// 		rootMargin: '0px'
// 	}
// );
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

// JS handshake flips to '1' after a short delay to identify real browsers in AJAX mode.
setTimeout(() => {
	const el = document.getElementById('js-ready');
	if (el) el.value = '1';
}, 2200); // Delay tuning

// Contact form handler - pre-empts default HTML form submission handler
document.addEventListener('DOMContentLoaded', () => {
	const form = document.getElementById('contact-form');
	if (!form) return;
	// Grab the CSRF token directly from the hidden input
	const tokenEl = form.querySelector('input[name="_csrf"]');
	const csrfToken = tokenEl ? tokenEl.value : '';
	const submitBtn = form.querySelector('[type="submit"]');

	form.addEventListener('submit', async (e) => {
		// Prevent default only when JS is active (AJAX path)
		e.preventDefault();
		if (submitBtn) submitBtn.disabled = true;

		try {
			const fd = new FormData(form);
			const data = Object.fromEntries(fd.entries());

			const resp = await fetch('/contact', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json', 'CSRF-Token': csrfToken },
				body: JSON.stringify(data),
				credentials: 'same-origin'
			});

			// Treat 200 and 204 as user success (avoid signaling to bots)
			if (resp.ok || resp.status === 200) {
				// const done = document.createElement('p');
				// done.className = 'form-status';
				// done.textContent = `Thank you! I'll be in touch!`;
				// form.appendChild(done);
				submitBtn.innerText = `Thank you! I'll be in touch!`;
				// Clear visible inputs; keep hidden tokens intact
				form.querySelectorAll('input[type="text"], input[type="email"], textarea').forEach((el) => (el.value = ''));
			} else if (resp.status === 204) {
				// const done = document.createElement('p');
				// done.className = 'form-status';
				// done.textContent = `Thank you! I'll be in touch!`;
				// form.appendChild(done);
				submitBtn.innerText = `Please wait one hour before submitting the form again.`;
				// Clear visible inputs; keep hidden tokens intact
				form.querySelectorAll('input[type="text"], input[type="email"], textarea').forEach((el) => (el.value = ''));
			} else if (resp.status === 429) {
				// Dev-only path for when rate limiter returns 429 HTTP status during development/testing
				// const err = document.createElement('p');
				// err.className = 'form-status';
				// err.textContent = 'Please wait one hour before submitting the form again.';
				// form.appendChild(err);
				submitBtn.innerText = `Please wait one hour before submitting the form again.`;
			} else {
				// const err = document.createElement('p');
				// err.className = 'form-status';
				// err.textContent = 'Something went wrong. Please try again.';
				// form.appendChild(err);
				submitBtn.innerText = `Something went wrong. Please try again.`;
			}
		} catch {
			// const err = document.createElement('p');
			// err.className = 'form-status';
			// err.textContent = 'Network error. Please try again.';
			// form.appendChild(err);
			submitBtn.innerText = `Network error. Please try again.`;
		} finally {
			if (submitBtn) submitBtn.disabled = false;
		}
	});
});
