/*
---
description: Better event delegation for MooTools.
license: MIT-style
authors:
  [Christopher Pitt, Arieh Glazer, James Emerton]
provides:
  [Element.delegateEvent, Element.delegateEvents, Element.denyEvent, Element.denyEvents]
requires: 
  core/1.2.4: [Element.Event, Selectors]
...
*/

(function(context) {

	var each = function(collection, fn, context)
	{
		for (var key in collection)
		{
			if (collection.hasOwnProperty(key))
			{
				fn.apply((context || this), [key, collection[key]]);
			}
		}
		return collection;
	};

	Element.implement({
		'delegateEvent': function(type, delegates, prevent, propagate)
		{
			//get stored delegates
			var self = this,
				key = 'delegates:' + type,
				stored = this.retrieve(key) || false,
				handler = function(e)
				{
					// Get target and set defaults
					var target = document.id(e.target),
						prevent = prevent || true,
						propagate = propagate || false
						stored = self.retrieve(key),
						args = arguments;

					// Cycle through rules
					each(stored, function(selector, delegates) {
						if (target.match(selector))
						{
							if (prevent) e.preventDefault();
							if (!propagate) e.stopPropagation();
							each(delegates, function(key, fn) {
								fn.apply && fn.apply(target, args);
							});
						}
					}, self);
					return self;
				};

			// if stored delegates; extend with new delegates and return self.
			if (stored)
			{
				each(delegates, function(selector, fn) {
					(stored[selector]) ? stored[selector].push(fn) : stored[selector] = [fn];
				});
				return self;
			}
			else
			{
				stored = {};
				each(delegates, function(selector, fn) {
					stored[selector] = [fn];
				});
				self.store(key, stored);
			}

			// if event type is focus/blur then shim for delegation.
			if (/focus|blur|change/.test(type))
			{
				var wrapper = function(e)
					{
						e = new Event(e, self.getWindow());
						handler.call(self, e);
					};

				if (Browser.Engine.trident)
				{
					// aliased events for (smell)ie...
					switch (type)
					{
						case 'focus':
							self.attachEvent('onfocusin', wrapper);
							break;
						case 'blur':
							self.attachEvent('onfocusout', wrapper);
							break;
						case 'change':
							self.attachEvent('change', wrapper);
							break;
					}
				}
				else
				{
					self.addEventListener(type, wrapper, true);
				}
			}
			else
			{
				self.addEvent(type, handler);
			}
			return self;
		},

		'delegateEvents': function(delegates, prevent, propagate)
		{
			each(delegates, function(key, delegate) {
				this.delegateEvent(key, delegate, prevent, propagate);
			}, this);
			return this;
		},

		'denyEvent': function(type, selector, fn)
		{
			var stored = this.retrieve('delegates:' + type) || false;
			stored && stored[selector] && stored[selector].erase(fn);
			return this;
		},

		'denyEvents': function(type, selector)
		{
			var stored = this.retrieve('delegates:' + type) || false;
			stored && stored[selector] && delete stored[selector];
			return this;
		}
	});

})(window);