// Details of each portfolio project, organized as a single `projects` object to import into `index.js`
const projects = [
	{
		id: 1,
		title: 'Get It Done!',
		liveUrl: 'https://www.get-it-done.app',
		codeUrl: 'https://github.com/ZachSteinberg-webdev/get-it-done',
		imgSrc: '/images/notepad-favicon-bold-3-reduced.png',
		imgAlt: 'Get It Done project image',
		stack: 'Node.js, Express.js, EJS, MongoDB, Mongoose, Passport.js (local)',
		challenge:
			'As my first web app, the tough part was stitching together everything I’d learned into a polished product. Getting authentication, sessions, and error handling to work smoothly taught me a lot.',
		details: [
			'Get It Done! is a skeuomorphic to-do list web application with a moveable, built-in calculator. It uses HTML, CSS and JavaScript, plus dynamic templating via EJS, server functionality via Node.js, as well as a database via MongoDB and Mongoose, with a focus on keeping the user interface clean and simple, so as to stay out of the way of the user and let them focus on... getting it done!',
			'This is my first web application! Through building this application, I really began to get a sense for how exciting it would be to work on a real web application used by people in their personal and professional pursuits.'
		]
	},
	{
		id: 2,
		title: 'Game Box',
		liveUrl: 'https://www.game-box.app',
		codeUrl: 'https://github.com/ZachSteinberg-webdev/game-box',
		imgSrc: '/images/reaction-test-icon-g-reduced.png',
		imgAlt: 'Game Box project image',
		stack: 'Node.js, Express.js, React.js, Vite, React Router, Axios, Rest APIs, MongoDB, Mongoose',
		challenge:
			'The hardest part was emulating a desktop OS in the browser, from window management and focus handling to keyboard shortcuts and persistence, without using a framework. I also built the core game loops from scratch, orchestrating timing, state updates, and edge cases to keep everything smooth.',
		details: [
			'This is a fun little web application built using the React framework that presents the user with a rough/limited mock-up of an Aqua-style OS X environment and three mini-games. This project became a bit of a runaway train for me. It originally started as only one game, Reaction Time Test. I decided to make the main test button have an Aqua-style appearance, and it really snowballed from there. I realized I needed to come up with a design for the rest of the application. So, why not keep the theme going?',
			'Once I had designed the Reaction Time Test app to fully look like an Aqua-style OS X window, it seemed only fitting to put a static, non-interactive menubar above it. Once I had done that, I figured I might as well make it functional. And, of course, I might as well build out window dragging functionality. And, rightfully so, window resizing functionality. And how could I forget window-layering functionality! And then functional traffic light buttons for the title bars. And desktop icons. Who could forget those? And then surely this all needs a dock! How else could a user re-open a closed window? The horror!',
			'At this point, I felt silly just leaving this all as-is with only one "application", so I built two more "mini-applications" that had been kicking around in my head, Speed Clicker, which is very derivative of Reaction Time Test, and Off The Wall, a very simple ball game. To top it all off, I figured a System Preferences application was needed. Afterall, I had to give a user some way to update their username and/or password. And I couldn\'t leave the System Preferences application with only one settings pane, so I built a pane for time settings and another for desktop wallpaper settings.',
			{
				html: `I really enjoyed working through the logic involved in the functionality of this application as well as designing it to imitate <a class="third-party-link" id="aqua-wiki-link" href="https://en.wikipedia.org/wiki/Aqua_(user_interface)">the famous Aqua UI appearance</a> and some very limited functionality of early OS X versions.`
			}
		]
	},
	{
		id: 3,
		title: 'Did I Watch That?!?!',
		liveUrl: 'https://www.did-i-watch-that.app',
		codeUrl: 'https://github.com/ZachSteinberg-webdev/did-i-watch-that',
		imgSrc: '/images/tv-logo.png',
		imgAlt: 'Did I Watch That project image',
		stack: 'Node.js, Express.js, React.js, Vite, React Router, Axios, MongoDB, Mongoose, JWT, bcryptjs, external API',
		challenge:
			'The hardest part was keeping the UI snappy by figuring out how to efficiently load shows that have hundreds of episodes. Integrating the TVMaze API was also a challenge, mostly learning how to handle missing fields and basic errors while shaping the data to fit my app.',
		details: [
			"Have you ever sat down to watch a TV show but you can't remember where you left off? You know you were in season 3 of that killer comedy or edge-of-your-seat drama, but you aren't sure which episode you last watched. Then you take a guess and launch a random episode. Nope! That's not it. You've already seen that one. Or worse, you get an unwanted preview of an episode you haven't watched yet. Spoiler alert! Well, search no more. Simply keep Did I Watch That?!?! open on your phone, tablet or computer when you watch TV shows, and mark each episode off as you watch it. Never guess again!",
			"I'm not much of a movie watcher, but I absolutely love watching all sorts of TV shows. Often, I'll take a break from a show for a few days or more, and when I come back to it, I can't remember where I left off. So, I built this web application to solve that problem.",
			'This was a really exciting build for me, again making use of the React framework, and additionally gave me some good experience working with an external, 3rd party API to retrive different types of data, sanitize it and use it.',
			{
				html: `Many thanks to the wonderful folks at <a class="third-party-link" href="https://tvmaze.com" target="_blank" rel="noreferrer">TV Maze</a> for making their API available for free for small projects!`
			}
		]
	},
	{
		id: 4,
		title: 'Gimme The Beats',
		liveUrl: 'https://www.gimme-the-beats.app',
		codeUrl: 'https://github.com/ZachSteinberg-webdev/gimme-the-beats',
		imgSrc: '/images/drum-emoji.png',
		imgAlt: 'Gimme The Beats project image',
		stack: 'Node.js, Express.js, React.js, Vite, Web Audio API, MongoDB, Mongoose, JWT, bcrypt',
		challenge:
			'The hardest part was working with the Web Audio API to build a reliable step sequencer and AudioContext graph (gain, filters, reverb, etc.), decoding samples, and scheduling notes ahead of time to avoid latency and timing drift.',
		details: [
			"Making music should be fun, not complicated. Beat Machine gives you an easy way to turn ideas into beats without needing fancy gear or confusing software. Just open it up, tap in your rhythms, layer sounds, and experiment until you've built something that makes your head nod. Every beat you create can be saved and revisited, so those late-night bursts of inspiration don't disappear. Whether you're sketching out a groove for a song or just killing time with some loops, Beat Machine puts the tools in your hands to make it happen.",
			"I've always had rhythms bouncing around in my head, but no real way to capture them quickly. I wanted something simple that would let me play with beats and keep track of my ideas. So, I built this web application to do exactly that.",
			'This project was a fun challenge that pushed me further as a developer. I built it with React on the frontend and connected it to a Node/Express backend with a MongoDB database. It gave me solid experience handling user input, managing state across different components, and making everything work smoothly together from the browser to the database.'
		]
	}
];

module.exports = { projects };
