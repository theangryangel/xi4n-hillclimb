var misc = require('./misc');

exports = module.exports = {
	'info': function(ucid, global, personal)
	{
		var text = [
			'^7The name of the game is to be faster to climb the hill than anyone else. Simple.',
			'',
			'^7Rules of combat:',
			'^71. You may use any vehicle you wish, the only rules are; ',
			'^72. No Idling',
			'^73. One at a time',
			'^74. If you crash, spectate or pit (others will thank you - vote kick is permitted)',
			'',
			'^7If this is your first time here, I suggest taking it easy the first time',
			'',
			'^7Global Fastest Time: ' + global,
			'^7Your Fastest Time: ' + personal
		];

		var btns = [];

		btns[0] = new this.insim.IS_BTN;
		btns[0].ucid = ucid;
		btns[0].reqi = 1;
		btns[0].bstyle = this.insim.ISB_DARK;
		btns[0].l = 40;
		btns[0].t = 50;
		btns[0].w = 120;
		btns[0].h = 8;
		btns[0].text = misc.plugin.name;

		for (var i = 0; i < text.length; i++)
		{
			if (text[i].length <= 0)
				continue;

			var j = i + 1;

			var btn = new this.insim.IS_BTN;
			btn.ucid = ucid;
			btn.reqi = 1;
			btn.bstyle = this.insim.ISB_DARK | this.insim.ISB_LEFT;
			btn.l = 40;
			btn.t = 58 + (j * 6);
			btn.w = 120;
			btn.h = 6;
			btn.text = text[i];

			btns.push(btn);
		}

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
	}
}
