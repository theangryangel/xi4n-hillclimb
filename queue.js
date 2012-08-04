var Queue = function()
{
	var self = this;

	self.fifo = [];
	self.length = 0;

	// pop off the top of the fifo
	self.shift = function()
	{
		var v = self.fifo.shift();
		self.length--;

		return v;
	};

	// remove from the fifo, by a given value
	self.remove = function(data)
	{
		for (var i = 0; i < self.fifo.length; i++)
		{
			if (self.fifo[i] != data)
				continue;

			// found the value we want
			self.fifo.splice(i, 1);

			return true;
		}

		return false;
	}

	// push onto the end of the fifo
	self.push = function(data)
	{
		self.fifo.push(data);
		self.length++;
	};

	// peek at the top value
	self.top = function() 
	{
		return self.fifo[0];
	};

	// peek at the bottom value
	self.bottom = function()
	{
		return self.fifo[self.fifo.length - 1];
	};

	// reset
	self.reset = function()
	{
		self.fifo = [];
		self.length = 0;
	};

	// return the fifo
	self.all = function()
	{
		return self.fifo;
	};
}

exports = module.exports = Queue;
