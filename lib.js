var db = require('dirty')('hillclimb.db');
var model = require('./model');

exports.init = function()
{
	this.log.info('Registering hillclimb plugin');

	this.client.isiFlags |= this.insim.ISF_MCI;

	this.client.on('state:track', function()
	{
		// new track selected
		var msgs = [];

		// load layout
		var m = new this.insim.IS_MST;
		msgs.push('/axload hillclimb');
		this.client.send(m);

		// pick a random wind
		// probably not a popular option
		msgs.push('/wind ' + (Math.floor(Math.random() * 3).toString()));

		for (var i = 0; i < msgs.length; i++)
		{
			var m = new this.insim.IS_MST;
			m.msg = msgs[i];
			this.client.send(m);
		}
	});

	this.client.on('state:connnew', function(ucid)
	{
		// show gui
		// top time
		// last seen
		// number of entries
	});

	this.client.on('state:plyrnew', function(plid)
	{
		var c = this.client.state.getConnByPlid(pkt.plid);

		if (!c)
			return;

		var m = model.fetch(db, c.uname);
		m.seen = new Date().getTime();
		model.save(db, c.uname, m);
	});

	this.client.on('IS_MSO', function(pkt)
	{
		if (pkt.usertype != this.insim.MSO_USER)
			return;

		// detect and register command handlers
	});

	this.client.on('IS_FIN', function(pkt)
	{
		// Don't count disqualified times
		if (pkt.confirm & this.client.CONF_DISQ)
			return;

		var c = this.client.state.getConnByPlid(pkt.plid);

		if (!c)
			return;

		var m = model.fetch(db, c.uname);

		m.last = pkt.ttime;
		if (pkt.ttime < m.fastest)
		{
			// new fastest lap - notification needed
			m.fastest = pkt.ttime;
		}

		model.save(db, c.uname, m);

		// spectate the racers
		var spec = new this.insim.IS_MST;
		spec.msg = "/spec " + c.uname;

		this.client.send(spec);

		// send buttons gui
	});
}
