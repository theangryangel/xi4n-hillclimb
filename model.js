exports = module.exports = {

	fetchPlyr: function(database, uname)
	{
		return exports.fetch(database, 'plyr:' + uname);
	},

	fetchGlobal: function(database)
	{
		return exports.fetch(database, 'global');
	},

	fetch: function(database, userid)
	{
		var m = database.get(this.id(userid));
		if (!m)
			m = { seen: (new Date().getTime()), fastest: -1, latest: -1 };

		return m;
	},
	save: function(database, userid, model)
	{
		database.set(this.id(userid), model);
	},
	id: function(userid)
	{
		return userid.toLowerCase();
	}
};
