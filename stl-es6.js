/*global define*/
(function(window) {

	function iVector (object, options) {
		this.compareFn = options.compareFn;
		this.filterFn = options.filterFn ||
		function(item) {
			return item;
		};
		this.validateFn = options.validateFn ||
		function() {
			return true;
		};
		this.Array = [];
		this.type = 'iVector';
		for (var i = 0; i < object.length; i++) {
			this.push(object[i]);
		}
	}
	iVector.prototype.copy = function() {
		var newVector = new iVector(this.Array, {
			compareFn: this.compareFn,
			filterFn: this.filterFn,
			validateFn: this.validateFn
		});
		return newVector;
	};
	iVector.prototype.length = function () {
		return this.Array.length;
	};
	iVector.prototype.pop = function() {
		return this.Array.pop();
	};
	iVector.prototype.push = function() {
		for (var i = 0; i < arguments.length; i++) {
			var value = arguments[i];
			if(this.validateFn(value))
			{
				this.Array.push(this.filterFn(value));
			}
		}
		return this.length();
	};
	iVector.prototype.reverse = function() {
		this.Array.reverse();
	};
	iVector.prototype.shift = function () {
		return this.Array.shift();
	};
	iVector.prototype.sort = function () {
		//implement quicksort
	};
	iVector.prototype.splice = function (index, howMany) {
		var result = [];
		if(howMany) {
			result = this.Array.splice(index, howMany);
			for(var i = 2; i<arguments.length; i++) {
				this.push(arguments[i]);
			}
		}
		else {
			result = this.Array.splice(index);
		}
		return result;
	};
	iVector.prototype.unshift = function () {
		for (var i = arguments.length - 1; i >= 0; i--) {
			var value = arguments[i];
			if(this.validateFn(value)) {
				this.Array.unshift(this.filterFn(value));
			}
		}
		return this.length();
	};
	iVector.prototype.concat = function() {
		var newArray = new iVector([this.Array], {
			compareFn: this.compareFn,
			filterFn: this.filterFn,
			validateFn: this.validateFn
		});
		for (var i = 0; i < arguments.length; i++) {
			var argValue = arguments[i];
			if(Object.prototype.toString.call(argValue) === '[object Array]') {
				for (var j = 0; j < argValue.length; j++) {
					newArray.push(argValue[j]);
				}
			}
			else if(argValue.type&&argValue.type==='iVector') {
				for (var k = 0; k < argValue.Array.length; k++) {
					newArray.push(argValue.Array[k]);
				}
			}
			else {
				newArray.push(argValue);
			}
		}
		return newArray;
	};
	iVector.prototype.join = function (separator, process) {
		if(process) {
			var result = '';
			this.forEach(function(node) {
				result +=process(node) + separator;
			});
			return result.slice(0, -1*separator.length);
		}
		return this.Array.join(separator);
	};
	iVector.prototype.slice = function(begin, end) {
		if(end) {
			return this.Array.slice(begin, end);
		}
		return this.Array.slice(begin);
	};
	iVector.prototype.toString = function(process) {
		if(process) {
			return process(this.Array);
		}
		return this.Array.toString();
	};
	iVector.prototype.indexOf = function (value) {
		if(this.validateFn(value)) {
			value = this.filterFn(value);
			for (var i = 0; i < this.Array.length; i++) {
				if(this.compareFn(this.Array[i], value)===0) {
					return i;
				}
			}
		}
		return -1;
	};
	iVector.prototype.lastIndexOf = function (value) {
		if(this.validateFn(value)) {
			var index = -1;
			value = this.filterFn(value);
			this.forEach(function(node, i) {
				if(this.compareFn(node, value)) {
					index = i;
				}
			});
			return index;
		}
		return -1;
	};
	iVector.prototype.forEach = function (process, thisArg) {
		var context = thisArg||this;
		for (var i = 0; i < this.Array.length; i++) {
			process.call(context, context.Array[i], i, context.Array);
		}
	};
	iVector.prototype.every = function (process, thisArg) {
		var context = thisArg || this;
		for (var i = 0; i < context.Array.length; i++) {
			if(!process(context.Array[i])) {
				return false;
			}
		}
		return true;
	};
	iVector.prototype.some = function (process, thisArg) {
		var context = thisArg || this;
		for (var i = 0; i < context.Array.length; i++) {
			if(process(context.Array[i])) {
				return true;
			}
		}
		return false;
	};
	iVector.prototype.filter = function (process, thisArg) {
		var context = thisArg || this;
		var newArray = new iVector([], {
			compareFn: this.compareFn,
			filterFn: this.filterFn,
			validateFn: this.validateFn
		});
		this.forEach(function(node) {
			if(process.call(context, node)) {
				newArray.Array.push(node);
			}
		});
		return newArray;
	};
	iVector.prototype.map = function (process, thisArg) {
		var context = thisArg || this;
		var newArray = new iVector([], {
			compareFn: this.compareFn,
			filterFn: this.filterFn,
			validateFn: this.validateFn
		});
		this.forEach(function(node) {
			newArray.push(process(node));
		});
		return newArray;
	};
	iVector.prototype.reduce = function (process, initialValue, context) {
		var context = thisArg || this;
		var result;
		if(initialValue) {
			result = initialValue;
			for (var i = 0; i < context.Array.length; i++) {
				result = process.call(context, result, context.Array[i], i, context.Array);
			}
		}
		else {
			if(context.Array.length>0) {
				result = context.Array[0];
				for (var j = 1; j < context.Array.length; j++) {
					result = process.call(context, result, context.Array[j], j, context.Array);
				}
			}
			else {
				return 0;
			}
		}
		return result;
	};
	iVector.prototype.reduceRight = function (process, initialValue, argValue) {
		var context = thisArg || this;
		var result;
		if(initialValue) {
			result = initialValue;
			for (var i = context.Array.length - 1; i >= 0; i--) {
				result = process.call(context, result, context.Array[i], i, context.Array);
			}
		}
		else {
			if(context.Array.length > 0) {
				result = context.Array[context.length()-1];
				for (var j = context.Array.length - 2; j >= 0; j--) {
					result = process.call(context, result, context.Array[j], j, context.Array);
				}
			}
			else {
				return 0;
			}
		}
		return result;
	};

	function iSet (object, options) {
		this.compareFn = options.compareFn;
		this.filterFn = options.filterFn ||
		function(item) {
			return item;
		};
		this.validateFn = options.validateFn ||
		function() {
			return true;
		};
		this._root = null;
		for (var i = 0; i <= object.length; i++) {
			this.add(object[i]);
		}
	}
	iSet.prototype.get = function(value, options) {
		var returnValue = false,
			valueFilterFn = function(item) {
				return item;
			};
		if(options)	{
			if(options.returnValue) returnValue = options.returnValue;
			if(options.valueFilterFn) valueFilterFn = options.valueFilterFn;
		}
		if(this.validateFn(value)) {
			value = this.filterFn(value);
			var found = false,
				current = this._root;
			while (!found && current) {
				var compareResult = this.compareFn(value, current.value);
				if(compareResult < 0) {
					current = current.left;
				}
				else if(compareResult > 0) {
					current = current.right;
				}
				else {
					return valueFilterFn(current.value);
				}
			}
			return returnValue;
		}
		return returnValue;
	};
	iSet.prototype.has = function (value) {
		if(this.validateFn(value)) {
			value = this.filterFn(value);
			var found = false,
				current = this._root;
			while (!found && current) {
				var compareResult = this.compareFn(value, current.value);
				if(compareResult < 0) {
					current = current.left;
				}
				else if(compareResult > 0) {
					current = current.right;
				}
				else {
					found = true;
				}
			}
			return found;
		}
		return false;
	};
	iSet.prototype.add = function (value, overwrite) {
		var Overwrite = overwrite||false;
		if(this.validateFn(value)) {
			value = this.filterFn(value);
			var node = {
				value: value,
				left: null,
				right: null
			}, current;
			if(this._root === null) {
				this._root = node;
			}
			else {
				current = this._root;
				while (true) {
					var compareResult = this.compareFn(value, current.value);
					if(compareResult < 0) {
						if(current.left === null) {
							current.left = node;
							return true;
						}
						else {
							current = current.left;
						}
					}
					else if(compareResult > 0) {
						if(current.right === null) {
							current.right = node;
							return true;
						}
						else {
							current = current.right;
						}
					}
					else {
						if(Overwrite) {
							current.value = value;
							return true;
						}
						return false;
					}
				}
			}
		}
		return false;
	};
	iSet.prototype.delete = function (value) {
		if(this.validateFn(value)) {
			value = this.filterFn(value);
			var found = false,
				parent = null,
				current = this._root,
				childCount,
				replacement,
				replacementParent;
			while(!found && current) {
				var compareResult = this.compareFn(value, current.value);
				if(compareResult < 0) {
					parent = current;
					current = current.left;
				}
				else if(compareResult > 0) {
					parent = current;
					current = current.right;
				}
				else {
					found = true;
				}
			}
			if(found) {
				childCount = (current.left !== null ? 1 : 0) + (current.right !== null ? 1 : 0);
				if(current === this._root) {
					switch(childCount) {
					case 0:
						this._root = null;
						return true;
					case 1:
						this._root = (current.right === null) ? current.left : current.right;
						return true;
					case 2:
						replacement = this._root.left;
						while (replacement.right !==null) {
							replacementParent = replacement;
							replacement = replacement.right;
						}
						if(replacementParent !== null && replacementParent) {
							console.log(replacementParent);
							replacementParent.right = replacement.left;
							replacement.right = this._root.right;
							replacement.left = this._root.left;
						}
						else {
							replacement.right = this._root.right;
						}
						this._root = replacement;
						return true;

					}
				}
				else {
					switch(childCount) {
					case 0:
						if(current.value < parent.value) {
							parent.left = null;
						}
						else {
							parent.right = null;
						}
						return true;
					case 1:
						if(current.value < parent.value) {
							parent.left = (current.left === null) ? current.right : current.left;
						}
						else {
							parent.right = (current.left === null) ? current.right : current.left;
						}
						return true;
					case 2:
						replacement  = current.left;
						replacementParent = current;
						while(replacement.right !==null) {
							replacementParent = replacement;
							replacement = replacement.right;
						}
						replacementParent.right = replacement.left;
						replacement.right = current.right;
						replacement.left = current.left;
						var replacementCompare = this.compareFn(current.value, parent.value);
						if(replacementCompare < 0) {
							parent.left = replacement;
						}
						else {
							parent.right = replacement;
						}
						return true;
					}
				}
			}

		}
		return false;
	};
	iSet.prototype.forEach = function (process) {
		function inOrder(node) {
			if(node.left !== null) {
				inOrder(node.left);
			}
			process.call(this, node);
			if(node.right !== null) {
				inOrder(node.right);
			}
		}
		inOrder(this._root);
	};
	iSet.prototype.values = function (valueFilterFn) {
		var process = valueFilterFn ||
			function (item) {
				return item;
			};
		var result = [];
		this.forEach(function(node) {
			result.push(process(node.value));
		});
		return result;
	};
	iSet.prototype.size = function () {
		var length = 0;
		this.forEach(function (node) {
			length++;
		});
		return length;
	};
	if (typeof define === 'function' && define.amd) {
	    define({
	        'iSet': iSet,
	        'iVector': iVector
	    });
	} else {
	    window.iSet = iSet;
	    window.iVector = iVector;
	}
})(this);