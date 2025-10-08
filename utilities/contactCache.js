function disableCache(res) {
	// Never let browsers or proxies store contact responses
	res.set('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
	res.set('Pragma', 'no-cache'); // legacy proxies
	res.set('Expires', '0');
}
module.exports = { disableCache };
