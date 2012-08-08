var gui = require('./gui');

exports = module.exports = {

	'!help': function(pkt)
	{
		gui.info.call(this, pkt.ucid);
	},

	'!info': function(pkt)
	{
		gui.info.call(this, pkt.ucid);
	},

	'!pb': function(pkt)
	{
		gui.info.call(this, pkt.ucid);
	},

	'!me': function(pkt)
	{
		gui.info.call(this, pkt.ucid);
	},

	'!rst': function(pkt)
	{
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
	}

};
