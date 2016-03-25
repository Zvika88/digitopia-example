var loopback = require('loopback');
var server = require('../../server/server');
var uploadable = require('../../server/lib/uploadable')();
var async = require('async');

module.exports = function (MyUser) {

	// on login set access_token cookie with same ttl as loopback's accessToken
	MyUser.afterRemote('login', function setLoginCookie(context, accessToken, next) {
		var res = context.res;
		var req = context.req;
		if (accessToken != null) {
			if (accessToken.id != null) {
				res.cookie('access_token', accessToken.id, {
					signed: req.signedCookies ? true : false,
					maxAge: 1000 * accessToken.ttl
				});
				return res.redirect('/');
			}
		}
		return next();
	});

	// set up uploadable gear for MyUser model
	MyUser.on('attached', function () {

		// on Upload make versions for various UI uses
		var versions = [{
			suffix: 'large',
			quality: 90,
			maxHeight: 1040,
			maxWidth: 1040,
		}, {
			suffix: 'medium',
			quality: 90,
			maxHeight: 780,
			maxWidth: 780
		}, {
			suffix: 'thumb',
			quality: 90,
			maxHeight: 320,
			maxWidth: 320
		}, {
			suffix: 'icon',
			quality: 90,
			maxWidth: 50,
			maxHeight: 50,
			aspect: '1:1'
		}];

		uploadable(MyUser, 'MyUser', versions);
	});
};
