var misc = require('./misc'),
	model = require('./model');

exports = module.exports = {

	'data': function(ucid)
	{
		if (ucid <= 0)
			return;

		var c = this.client.state.getConnByUcid(ucid);

		if (!c)
			return;

		var db = this.client.hillclimb.database;

		var m = model.fetchPlyr(db, c.uname);
		var global = model.fetch(db, 'global');

		var wr = misc.msToHuman(global.fastest) + ' (' + global.who + ')';
		var pb = misc.msToHuman(m.fastest);

		return { 'wr': wr, 'pb': pb };
	},

	'layout': function(ucid, text, title)
	{
		// draws a standard layout
		// should be called with the same context as the client

		// clear the current screen - if any exist	
		var p = new this.insim.IS_BFN;
		p.ucid = ucid;
		p.subt = this.insim.BFN_CLEAR;
		this.client.send(p);

		// the magic
		var btns = [];

		// background
		// makes it easier to read the text
		btns[0] = new this.insim.IS_BTN;
		btns[0].ucid = ucid;
		btns[0].reqi = 1;
		btns[0].bstyle = this.insim.ISB_LIGHT;
		btns[0].l = 39;
		btns[0].t = 49;
		btns[0].w = 122;
		btns[0].h = 8;

		// header
		btns[1] = new this.insim.IS_BTN;
		btns[1].ucid = ucid;
		btns[1].reqi = 1;
		btns[1].bstyle = this.insim.ISB_DARK;
		btns[1].l = 40;
		btns[1].t = 50;
		btns[1].w = 120;
		btns[1].h = 8;
		btns[1].text = ((title) ? title + ' - ' + misc.plugin.name : misc.plugin.name);

		for (var i = 0; i < text.length; i++)
		{
			if (text[i].length <= 0)
				continue;

			var btn = new this.insim.IS_BTN;
			btn.ucid = ucid;
			btn.reqi = 1;
			btn.bstyle = this.insim.ISB_DARK | this.insim.ISB_LEFT;
			btn.l = 40;
			btn.t = 58 + ((i + 1) * 6);
			btn.w = 120;
			btn.h = 6;
			btn.text = text[i];

			btns.push(btn);
		}

		// close button
		var close = new this.insim.IS_BTN;
		close.ucid = ucid;
		close.reqi = 1;
		close.bstyle = this.insim.ISB_DARK | this.insim.ISB_C4 | 4 | this.insim.ISB_CLICK;
		close.l = 40;
		close.t = 58 + ((text.length + 2) * 6);
		close.w = 120;
		close.h = 8;
		close.text = 'Got it? Click here!';

		btns.push(close);

		// Resize the background
		btns[0].h = 18 + ((text.length + 2) * 6);

		for (var i = 0; i < btns.length; i++)
		{
			var cb;

			if (i + 1 == btns.length)
				cb = function(pkt)
				{
					var p = new this.insim.IS_BFN;
					p.ucid = pkt.ucid;
					p.subt = this.insim.BFN_CLEAR;

					this.client.send(p);
				};

			this.client.buttons.add(btns[i], cb);
		}
	},

	'info': function(ucid)
	{
		var data = exports.data.call(this, ucid);
		if (!data)
			return;

		var text = [
			'^7The name of the game is to be faster to climb the hill than anyone else. Simple.',
			'',
			'^7Rules of combat:',
			'^71. You may use any vehicle you wish',
			'^72. No Idling',
			'^73. One at a time',
			'^74. If you crash, spectate or pit (others will thank you - vote kick is permitted)',
			'^75. Climbs will go on as long as they have to',
			'',
			'^7If this is your first time here, you have to climb.',
			'',
			'^7Global Fastest Time: ' + data.wr,
			'^7Your Fastest Time: ' + data.pb
		];

		exports.layout.call(this, ucid, text);
	},

	'stats': function(ucid)
	{
		var data = exports.data.call(this, ucid);
		if (!data)
			return;

		var text = [
			'^7Global Fastest Time: ' + data.wr,
			'^7Your Fastest Time: ' + data.pb
		];

		exports.layout.call(this, ucid, text);
	},

	'about': function(ucid)
	{
		var text = [
			'^7Hillclimb event plugin. Written in a rush between projects, probably buggy.',
			'^7Powered by: ' + this.product.full
		];

		exports.layout.call(this, ucid, text);
	},

	'breakdown': function(ucid, text)
	{
		exports.layout.call(this, ucid, text);
	}

}
