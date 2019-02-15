gform.prototype.errors = {};
gform.prototype.validate = function(){
	this.valid = true;
  _.each(this.fields, gform.validateItem)
	return this.valid;
};
gform.handleError = gform.update;
gform.validateItem = function(item){
	gform.performValidate(item);
	item.owner.errors[item.name] = item.errors;
	item.owner.valid = item.valid && item.owner.valid;
};
gform.performValidate = function(item){
	var value = item.get();
	item.valid = true;
	item.errors = '';

	if(item.parsable && typeof item.validate === 'object'){
		var errors = _.compact(_.map(item.validate, function(v, it,i,stuff){
			if(it && v[i].call(item, value, it)){	
					return gform.renderString(it.message || v[i].call(item, value, it), item);
			}
		}.bind(null, gform.validations)))
		if((typeof item.display === 'undefined') || item.visible) {

		item.valid = !errors.length;
		item.errors = errors.join('<br>')

		gform.handleError(item);
		}
	}
};

gform.regex = {
	numeric: /^[0-9]+$/,
	decimal: /^\-?[0-9]*\.?[0-9]+$/
};
gform.validations = 
{
	required:function(value, args) {
			return (this.satisfied(value) ? false : '{{label}} is required.');
	},
	matches:{
		method: function(value, matchName) {
			if (el == this.gform[matchName]) {
				return value === el.value;
			}
			return false;
		},
		message: '{{label}} does not match the %s field.'
	},	
	date:{
		method: function(value, args) {
	        return (/^(0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])\/(19|20)\d{2}$/.test(value) || value === '');
		},
		message: '{{label}} should be in the format MM/DD/YYYY.'
	},
	valid_url:{
		method: function(value) {
			return (/(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/.test(value) || value === '');
		},
		message: '{{label}} must contain a valid Url.'
	},
	valid_email:{
		method: function(value) {
			return (/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,6}$/i.test(value) || value === '');
		},
		message: '{{label}} must contain a valid email address.'
	},
	min_length:{
		method: function(value, length) {
			// return (this.satisfied(value) ? false : true)

			if (!gform.regex.numeric.test(length)) {
				return false;
			}
			return (value.length >= parseInt(length, 10));
		},
		message: '{{label}} must be at least %s characters in length.'
	},
	max_length:{
		method: function(value, length) {
			if (!gform.regex.numeric.test(length)) {
				return false;
			}
			return (value.length <= parseInt(length, 10));
		},
		message: '{{label}} must not exceed %s characters in length.'
	},
	exact_length:{
		method: function(value, length) {
			if (!gform.regex.numeric.test(length)) {
				return false;
			}
			return (value.length === parseInt(length, 10));
		},
		message: '{{label}} must be exactly %s characters in length.'
	},
	greater_than:{
		method: function(value, param) {
			if (!gform.regex.decimal.test(value)) {
				return false;
			}
			return (parseFloat(value) > parseFloat(param));
		},
		message: '{{label}} must contain a number greater than %s.'
	},
	less_than:{
		method: function(value, param) {
			if (!gform.regex.decimal.test(value)) {
				return false;
			}
			return (parseFloat(value) < parseFloat(param));
		},
		message: '{{label}} must contain a number less than %s.'
	},
	numeric:{
		method: function(value) {
			return (gform.regex.numeric.test(value) || value === '');
		},
		message: '{{label}} must contain only numbers.'
	}
};