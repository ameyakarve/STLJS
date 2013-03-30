'use strict';
var STLVector = function(constructorFn, compareFn) {
	this.constructorFn = constructorFn;
	this.compareFn = compareFn;
	this.data = [];
};
STLVector.prototype.pushBack = function () {
	for (var i = 0; i < arguments.length; i++) {
		if(this.constructorFn(arguments[i])) {
			this.data.push(arguments[i]);
		}
	}
};
STLVector.prototype.popBack = function () {
	return this.data.pop();
};
STLVector.prototype.insert = function (position) {
	if(position < 0 || position >= this.data.length){
		return false;
	}
	var middle = [];
	for (var i = 1; i < arguments.length; i++) {
		if(this.constructorFn(arguments[i])) {
			middle.push(arguments[i]);
		}
	}
	var left  = this.data.slice(0, position),
		right = this.data.slice(position);
	this.data = left.concat(middle, right);
	return true;
};
STLVector.prototype.erase = function (begin) {
	if(begin < 0 || begin >= this.data.length) {
		return false;
	}
	var end = arguments[1]||begin+1;
	if(end <=begin || end > this.data.length) {
		return false;
	}
	var left = this.data.slice(0, begin),
		right = this.data.slice(end);
	this.data = left.concat(right);
	return true;
};
STLVector.prototype.remove = function () {
	for (var i = 0; i < this.data.length; i++) {
		var currentElement = this.data[i];
		for(var j = 0; j< arguments.length && i<this.data.length; j++) {
			var currentArg = arguments[j];
			if(this.constructorFn(currentArg) && this.compareFn(currentArg, currentElement)) {
				this.data.splice(i,1);
			}
		}
	}
}
STLVector.prototype.clear = function () {
	this.data = [];
};
var STLSet = function (constructorFn, compareFn) {
	this.constructorFn = constructorFn;
	this.compareFn = compareFn;
	this._root = null;
};
STLSet.prototype.insert = function (overwrite) {
	for(var i = 1; i< arguments.length; i++)
	{
		var value = arguments[i];
		overwrite = overwrite||false;
		if(this.constructorFn(value))
		{
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
							break;
						}
						else {
							current = current.left;
						}
					}
					else if(compareResult > 0) {
						if(current.right === null) {
							current.right = node;
							break;
						}
						else {
							current = current.right;
						}
					}
					else {
						if(overwrite) {
							current.value = value;
						}
						break;
					}
				}
			}
		}
	}
};
STLSet.prototype.remove = function () {
	for(var i = 0; i<arguments.length; i++)	{
		var value = arguments[i];
		if(this.constructorFn(value)) {
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
						break;
					case 1:
						this._root = (current.right === null) ? current.left : current.right;
						break;
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
						break;

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
						break;
					case 1:
						if(current.value < parent.value) {
							parent.left = (current.left === null) ? current.right : current.left;
						}
						else {
							parent.right = (current.left === null) ? current.right : current.left;
						}
						break;
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
						break;
					}
				}
			}
		}
	}
};
STLSet.prototype.contains = function(value) {
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
};
STLSet.prototype.traverse = function (process) {
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
STLSet.prototype.size = function() {
	var length = 0;
	this.traverse(function(node) {
		length++;
	});
	return length;
};
STLSet.prototype.toArray = function() {
	var result = [];
	this.traverse(function(node) {
		result.push(node.value);
	});
	return result;
};