var db = require('dirty')('user.db');
var model = require('./model');

exports.init = function()
{
	this.log.info('Registering hillclimb plugin');

	this.client.isiFlags |= this.insim.ISF_MCI;

	this.client.on('state:connnew', function(ucid)
	{
	});

	this.client.on('state:plyrnew', function(plid)
	{
		var p = this.client.state.getPlyrByPlid(plid);

		if (!p)
			return;

		var c = this.client.state.getConnByUcid(p.ucid);

		if (!c)
			return;

		var m = model.fetch(db, c.uname);
		m.seen = new Date().getTime();
		model.save(db, c.uname, m);
	});

	this.client.on('state:plyrupdate', function(plids)
	{
		for (var i in plids)
		{
			var p = this.client.state.getPlyrByPlid(plids[i]);
			if (!p)
				continue;

			var c = this.client.state.getConnByUcid(p.ucid);

			if (!c)
				continue;

			var m = model.fetch(db, c.uname);

			// do magics
		}
	});

	this.client.on('IS_MSO', function(pkt)
	{
		if (pkt.usertype != this.insim.MSO_USER)
			return;
	});
}
