exports = module.exports = {

	'plugin': { name: '^3King^7 Of The Hill(Climb)', version: '0.1.0-unstable' },

	'zeroPad': function(num, count)
	{
		var numZeropad = num + '';

		while(numZeropad.length < count)
			numZeropad = "0" + numZeropad;

		return numZeropad;
	},

	'msToHuman': function(ms)
	{
		var seconds = ((ms / 1000) % 60),
		minutes = (((ms / 1000) / 60) % 60),
		hours = ((((ms / 1000) / 60) / 60) % 24);

		return ((hours >= 1) ? zeroPad(Math.floor(hours), 2) + ':' : '') +
			this.zeroPad(Math.floor(minutes), 2) + ':' +
			this.zeroPad(seconds.toFixed(2), 5);
	}

}
