define([], function()
{
	var ASync =
	{
		// Basically, syncLoop is a for loop that you can control
		syncLoop: function(iterations, func, onComplete)
		{
			var iterations = (typeof iterations !== "undefined") ? iterations : 0;
			var func = (typeof func === "function") ? func : function(){ loop.next(); };
			var onComplete = (typeof onComplete === "function") ? onComplete : function(){};

			var index = 0;
	    	var done = false;
	    	var loop =
	    	{
		        next: function()
		        {
		            if(done)
		                return;

		            if(index < iterations)
		            {
		                index++;
		                func(loop);
		            }

		            else
		            {
		                done = true;
		                onComplete();
		            }
		        },
		        iteration: function()
		        {
		            return index - 1;
		        },
		        break: function(bCallback)
		        {
		            done = true;

		            if(bCallback)
		            	onComplete();
		        }
	    	};

	    	loop.next();
	    	return loop;
		},
		reverseSyncLoop: function(iterations, func, onComplete)
		{
			var iterations = (typeof iterations !== "undefined") ? iterations : 0;
			var func = (typeof func === "function") ? func : function(){ loop.next(); };
			var onComplete = (typeof onComplete === "function") ? onComplete : function(){};

			var index = iterations;
	    	var done = false;
	    	var loop =
	    	{
		        next: function()
		        {
		            if(done)
		                return;

		            if(index > 0)
		            {
		                index--;
		                func(loop);
		            }

		            else
		            {
		                done = true;
		                onComplete();
		            }
		        },
		        iteration: function()
		        {
		            return index;
		        },
		        break: function(bCallback)
		        {
		            done = true;

		            if(bCallback)
		            	onComplete();
		        }
	    	};

	    	loop.next();
	    	return loop;
		}
	};

	return ASync;	
});