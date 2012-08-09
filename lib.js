var db = require('dirty')(__dirname + '/hillclimb.db'),
	model = require('./model'),
   	misc = require('./misc'),
	gui = require('./gui'),
	chatCmds = require('./cmds');

exports.init = function()
{
	this.log.info('Registering hillclimb plugin');

	this.client.isiFlags |= this.insim.ISF_MCI;

	this.client.hillclimb = {
		'timeout': 0,
		'current': 0,
		'database': db,
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

		// night
		msgs.push('/weather 3');

		for (var i = 0; i < msgs.length; i++)
		{
			var m = new this.insim.IS_MST;
			m.msg = msgs[i];
			this.client.send(m);
		}
	});

	this.client.on('state:track', function()
	{
		if (this.client.state.flags & this.insim.ISS_GAME)
			return;

		//this.client.emit('hillclimb:reload');
	});

	this.client.on('state:connnew', function(ucid)
	{
		if (ucid <= 0)
			return;

		var c = this.client.state.getConnByUcid(ucid);

		if (!c)
			return;

		var m = model.fetch(db, 'plyr:' + c.uname);
		var global = model.fetch(db, 'global');

		var wr = misc.msToHuman(global.fastest) + ' (' + global.who + ')';
		var pb = misc.msToHuman(m.fastest);

		var msgs = [
			'^7Welcome to ' + misc.plugin.name + '!',
			'^7Global Record: ' + wr,
			'^7Personal Record: ' + pb,
		];

		for (var i = 0; i < msgs.length; i++)
		{
			var msg = new this.insim.IS_MST;
			msg.msg = msgs[i];
			this.client.send(msg);
		}

		m.seen = new Date().getTime();
		model.save(db, c.uname, m);

		gui.info.call(this, ucid);
	});

	this.client.on('state:plyrnew', function(plid)
	{
		var c = this.client.state.getConnByPlid(plid);

		if (!c)
			return;

		// check to see if the player is the next queued player, if not then
		// spectate

		// force clear any buttons
		var clear = new this.insim.IS_BFN;
		clear.ucid = c.ucid;
		clear.subt = this.insim.BFN_CLEAR;
		this.client.send(clear);
	});

	this.client.on('state:plyrleave', function(plid)
	{
		// remove player from queue
	});

	this.client.on('IS_PLP', function(pkt)
	{
		var c = this.client.state.getConnByPlid(pkt.plid);

		if (!c)
			return;

		// spectate the racer
		var spec = new this.insim.IS_MST;
		spec.msg = "/spec " + c.uname;

		this.client.send(spec);
	});

	this.client.on('IS_MSO', function(pkt)
	{
		if (pkt.usertype != this.insim.MSO_USER)
			return;

		if (pkt.ucid <= 0)
			return;

		for (var i in chatCmds)
		{
			if (pkt.msg.indexOf(i) < 0)
				continue;

			chatCmds[i].call(this, pkt);
			return;
		}
	});

	this.client.on('IS_III', function(pkt)
	{
		if (pkt.ucid <= 0)
			return;

		for (var i in chatCmds)
		{
			if (pkt.msg.indexOf(i) < 0)
				continue;

			chatCmds[i].call(this, pkt);
			return;
		}
	});

	this.client.on('IS_RES', function(pkt)
	{
		var c = this.client.state.getConnByPlid(pkt.plid);

		if (!c)
			return;

		var m = model.fetch(db, 'plyr:' + c.uname);
		var global = model.fetch(db, 'global');

		var text = [];

		if (!(pkt.confirm & this.client.CONF_DISQ))
		{
			global.latest = m.latest = pkt.ttime;
			if ((pkt.ttime < m.fastest) || (m.fastest < 0))
			{
				// new personal fastest lap - notification needed
				m.fastest = pkt.ttime;

				var success = new this.insim.IS_MTC;
				success.ucid = c.ucid;
				success.text = '^3New Personal Fastest Climb - ' + misc.msToHuman(pkt.ttime);

				text.push(success.text);

				this.client.send(success);
			}

			model.save(db, 'plyr:' + c.uname, m);

			if ((pkt.ttime < global.fastest) || (global.fastest < 0))
			{
				// new global fastest lap - notification needed
				global.fastest = pkt.ttime;
				global.who = c.uname;

				var success = new this.insim.IS_MST;
				success.text = '^3New Global Fastest Climb by ' + c.uname + ' - ' + misc.msToHuman(pkt.ttime);

				text.push(success.text);

				this.client.send(success);
			}

			model.save(db, 'global', global);
		}

		if (text.length <= 0)
		{
			text.push('Bad luck. You weren\'t quite fast enough this time.');
			text.push('Your time was: ' + misc.msToHuman(pkt.ttime));
		}

		setTimeout(function(ctx, ucid, gui, text)
		{
			return function() 
			{
				// spectate the racers
				var spec = new ctx.insim.IS_MST;
				spec.msg = "/spec " + c.uname;

				ctx.client.send(spec);

				gui.breakdown.call(ctx, ucid, text);
			}
		}(this, c.ucid, gui, text), 2000);
	});
}
