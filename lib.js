var db = require('dirty')('hillclimb.db');
var model = require('./model');

exports.init = function()
{
	this.log.info('Registering hillclimb plugin');

	this.client.isiFlags |= this.insim.ISF_MCI;

	this.client.hillclimb = {
		'timeout': 0
	};

	this.client.on('hillclimb:reload', function()
	{
		var now = new Date().getTime();

		if ((now - this.client.hillclimb.timeout) <= 5000)
			return;

		this.client.hillclimb.timeout = now;

		// new track selected
		var msgs = [];

		// load layout
		msgs.push('/axload hillclimb');

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

	this.client.on('state:track', function()
	{
		this.client.emit('hillclimb:reload');
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
		var c = this.client.state.getConnByPlid(plid);

		if (!c)
			return;

		var m = model.fetch(db, c.uname);
		m.seen = new Date().getTime();
		model.save(db, c.uname, m);
	});

	this.client.on('IS_PLP', function(pkt)
	{
		var c = this.client.state.getConnByPlid(pkt.plid);

		if (!c)
			return;

		// spectate the racers
		var spec = new this.insim.IS_MST;
		spec.msg = "/spec " + c.uname;

		this.client.send(spec);
	});

	this.client.on('IS_MSO', function(pkt)
	{
		if (pkt.usertype != this.insim.MSO_USER)
			return;

		// detect and register command handlers
		if (!pkt.msg.indexOf('!rst') < 0)
			return;

		var m = new this.insim.IS_MST;
		m.msg = '/end';
		this.client.send(m);

		setTimeout(function(ctx)
		{
			return function() 
			{
				var msgs = [];

				msgs.push('/clear');
				msgs.push('/track FE3');

				for (var i = 0; i < msgs.length; i++)
				{
					var m = new ctx.insim.IS_MST;
					m.msg = msgs[i];
					ctx.client.send(m);
				}
			}
		}(this), 6000);
		
	});

	this.client.on('IS_RES', function(pkt)
	{
		var c = this.client.state.getConnByPlid(pkt.plid);

		if (!c)
			return;

		var m = model.fetch(db, c.uname);

		if (!(pkt.confirm & this.client.CONF_DISQ))
		{
			m.latest = pkt.ttime;
			if ((pkt.ttime < m.fastest) || (m.fastest < 0))
			{
				// new fastest lap - notification needed
				m.fastest = pkt.ttime;

				var success = new this.insim.IS_MTC;
				success.ucid = c.ucid;
				success.text = '^3New Fastest Climb!';
				this.client.send(success);
			}

			model.save(db, c.uname, m);
		}

		setTimeout(function(ctx)
		{
			return function() 
			{
				// spectate the racers
				var spec = new ctx.insim.IS_MST;
				spec.msg = "/spec " + c.uname;

				ctx.client.send(spec);
			}
		}(this), 2000);
	});
}
