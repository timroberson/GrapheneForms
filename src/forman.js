var forman = function(target, data){
    document.querySelector(target).innerHTML = forman.stencils.container(_.assignIn({legend: ''}, data));
    this.form = document.querySelector(target + ' form')
    this.fields = _.map(data.fields, function(field, i) {
        field = _.assignIn({
            name: (field.label||'').toLowerCase().split(' ').join('_'), 
            id: forman.getUID(), 
            type: 'text', 
            extends: 'basic', 
            label: field.name, 
            value: data.attributes[field.name] || field.default
        }, field)
        if(field.type == 'select' || field.type == 'radio'){
            field = _.assignIn(field, forman.processOptions.call(this, field));
        }
        return field;
    })

    _.each(this.fields, function(field){
        field.el = document.createElement("div");
        field.el.setAttribute("id", field.id);
        field.el.innerHTML = (forman.stencils[field.type] || forman.stencils.text)(field);
        this.form.appendChild(field.el); 
    }.bind(this))
    
    var toJSON = function() {
        var obj = {};
        _.each(this.fields, function(field) {
            obj[field.name] = this.form.querySelector('[name="' + field.name + '"]').value;
        }.bind(this))
        return obj;
    }

  return {
    toJSON: toJSON.bind(this)
  }
}

forman.ajax = function(options){
    var request = new XMLHttpRequest();
    request.onreadystatechange = function() {
        if(request.readyState === 4) {
            if(request.status === 200) { 
                options.success(JSON.parse(request.responseText));
            } else {
                console.log(request.responseText);
                // options.error(request.responseText);
            } 
        }
    }
    request.open(options.verb || 'GET', options.path);
    request.send();
}

forman.default= {label_key: 'label', value_key: 'value'}
forman.processOptions = function(field) {
	if(typeof field.options == 'string'){
        field.path = field.options;
        field.options = false;
        forman.ajax({path: field.path, success:function(data){
            this.field.options = data;  
            this.field = forman.processOptions(this.field);
            this.field.el.innerHTML = (forman.stencils[this.field.type] || forman.stencils.text)(this.field);

            var oldDiv = document.getElementById(this.field.id);
            oldDiv.parentNode.replaceChild(this.field.el, oldDiv);
        }.bind({field:field})})
		return field;
	}
    field = _.assignIn({options: []}, forman.default, field);

	// If max is set on the field, assume a number set is desired. 
	// min defaults to 0 and the step defaults to 1.
	if(typeof field.max !== 'undefined') {
		field.min = (field.min || 0);
		field.step = (field.step || 1)
        var i = field.min;
        while(i <= field.max) {
            field.options.push(i.toString());
            i+=field.step;
        }
	}

    if(typeof field.default !== 'undefined' && field.options[0] !== field.default) {
		field.options.unshift(field.default);
	}
    field.options =  _.map(field.options, function(item, i){
        if(typeof item === 'string' || typeof item === 'number') {
            item = {label: item};
           	if(this.value_key !== 'index'){
				item.value = item.label;
            }
        }
        return _.assignIn({label: item[field.label_key], value: item[field.value_key] || i }, item);
    }.bind(field))
    
    return field;
}

forman.i = 0;
forman.getUID = function() {
    return 'f' + (forman.i++);
};