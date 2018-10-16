var carbon = function(data, el){
    "use strict";
    
    //initalize form
    this.options = _.assignIn({legend: '', data:{}, columns:carbon.columns},this.opts, data);
    this.el = document.querySelector(el || data.el);
    this.on = this.events.on;
    this.trigger = this.events.trigger;
    this.debounce = this.events.debounce;

    this.trigger('initialize');
    
    //set flag on all root fieldsets as a section
    if(this.options.sections){
        _.each(_.filter(this.options.fields,{type:'fieldset'}),function(item,i){
            item.index = i;
            item.section = true;
            // item.text = item.legend || item.label || i;
        return item})
    }
    
    if(this.options.clear) {
        this.el.innerHTML = carbon.render(this.options.sections+'_container', this.options);
    }

    this.container = this.el.querySelector((el || data.el) + ' form') || this.el;
    this.rows = {};

    //parse form values into JSON object
    var toJSON = function(name) {
        if(typeof name == 'string') {
            return _.find(this.fields, {name: name}).get();
        }
        var obj = {};
        _.each(this.fields, function(field) {
            if(field.parsable){
                if(field.fields){
                    if(field.array){
                        obj[field.name] = obj[field.name] || [];
                        obj[field.name].unshift(toJSON.call(field));
                    }else{
                        obj[field.name] = toJSON.call(field);
                    }
                }else{
                    if(field.array){
                        obj[field.name] = obj[field.name] || [];
                        obj[field.name].unshift(field.get());
                    }else{
                        obj[field.name] = field.get();
                    }
                }
            }
        }.bind(this))
        return obj;
    }
    this.toJSON = toJSON.bind(this);
    this.set = function(name,value) {
        _.find(this.fields, {name: name}).set(value);
    }.bind(this),
    this.field = function(name){
        return _.find(this.fields,{name:name})
    }.bind(this)

    this.fields = _.map(this.options.fields, carbon.createField.bind(this, this, this.options.data||{}, null, null))
    _.each(this.fields, carbon.inflate.bind(this, this.options.data||{}))
    _.each(this.fields, function(field) {
		field.owner.events.trigger('change:' + field.name, field);
    })
    this.isActive = true;
    this.active = function(){return this.isActive}
}

//creates multiple instances of duplicatable fields if input attributes exist for them
carbon.inflate = function(atts, fieldIn, ind, list) {
    var field;    
    if(fieldIn.array){
        field = _.findLast(list, {name: _.uniqBy(list,'name')[ind].name});
    }else{
        field = _.findLast(list, {name:list[ind].name});
    }
    if(!field.array && field.fields){
        _.each(field.fields, carbon.inflate.bind(this, atts[field.name] || {}) );
    }
    if(field.array && typeof atts[field.name] == 'object') {
        if(atts[field.name].length > 1){
            for(var i = 1; i<atts[field.name].length; i++) {
                var newfield = carbon.createField.call(this, field.parent, atts, field.el, i, field.item);
                field.parent.fields.splice(_.findIndex(field.parent.fields, {id: field.id}), 0, newfield)
                field = newfield;
            }
        }
    }
}

carbon.createField = function(parent, atts, el, index, fieldIn ) {
    fieldIn.type = fieldIn.type || 'text';
    //work carbon.default in here
    var field = _.assignIn({
        name: (fieldIn.label||'').toLowerCase().split(' ').join('_'), 
        id: carbon.getUID(), 
        // type: 'text', 
        label: fieldIn.legend || fieldIn.name,
        validate: false,
        valid: true,
        parsable:true,
        visible:true,
        enabled:true,
        parent: parent,
        array:false,
        columns: this.options.columns,
        offset: 0,
        isChild:!(parent instanceof carbon)        
    }, carbon.types[fieldIn.type].defaults, fieldIn)
    
    field.item = fieldIn;
    field.owner = this;
	if(field.columns > this.options.columns) { field.columns = this.options.columns; }
    
    if(field.array && typeof atts[field.name] == 'object'){
        field.value =  atts[field.name][index||0];
    }else{
        field.value =  atts[field.name] || field.value || field.default;
    }

	if(field.item.value !== 0){
        if(field.array && typeof atts[field.name] == 'object'){
            field.value =  atts[field.name][index||0];
        }else{
            if(typeof field.item.value === 'function') {
                //uncomment this when ready to test function as value for input
                field.valueFunc = item.value;
                field.derivedValue = function() {
                    return field.valueFunc.call(field.owner.toJSON());
                };
                field.item.value = field.item.value = field.derivedValue();
                field.owner.on('change', function(){
                    this.set(this.derivedValue());
                }.bind(field));
            } else {
                //may need to search deeper in atts?
                field.value =  atts[field.name] || field.value || field.default || '';
            }  
        }
	} else {
		field.value = 0;
	}

    field.satisfied = carbon.types[field.type].satisfied.bind(field);

    field.active = function() {
		return this.parent.active() && this.enabled && this.parsable && this.visible;
	}
    field.set = function(value, silent){
        //not sure we should be excluding objects - test how to allow objects
        if(this.value != value && typeof value !== 'object') {
            this.value = value;
            carbon.types[this.type].set(value);
			if(!silent){this.trigger('change')};
		}
    }.bind(field)

    field.get = carbon.types[field.type].get.bind(field);
    
    field.render = carbon.types[field.type].render.bind(field);
    
    field.el = carbon.types[field.type].create.call(field);

    field.container =  field.el.querySelector('fieldset') || null;

    if(!field.target && (this.options.clear || field.isChild)){
        var cRow;
        // cRow = field.owner.rows[field.owner.rows.length-1];
        var formRows = field.parent.container.querySelectorAll('form > .row,fieldset > .row');
        var temp =(formRows[formRows.length-1] || {}).id;
        if(typeof temp !== 'undefined') {
            cRow = field.parent.rows[temp];	
        }
        if(typeof cRow === 'undefined' || (cRow.used + parseInt(field.columns,10) + parseInt(field.offset,10)) > this.options.columns){
            var temp = carbon.getUID();
            cRow = {};
            cRow.used = 0;
            cRow.ref  = document.createElement("div");
            cRow.ref.setAttribute("id", temp);
            cRow.ref.setAttribute("class", 'row');
            field.parent.rows[temp] = cRow;
            field.parent.container.appendChild(cRow.ref);
        }
        cRow.used += parseInt(field.columns, 10);
        cRow.used += parseInt(field.offset, 10);
        cRow.ref.appendChild(field.el);
        field.row = temp;
    }else{
        if(!field.target){
            field.target = '[name="'+field.name+'"]';
        }
        var temp = this.container.querySelector(field.target)
        if(typeof temp !== 'undefined' && temp !== null    ){
            temp.appendChild(field.el);
        }
       
    }
    // }
    // else{
    //         field.rows = {};

    //     if (el == null){
    //         field.parent.container.appendChild(field.el);
    //     } else {
    //         field.parent.container.insertBefore(field.el, el.nextSibling);
    //     }
    // }


    carbon.types[field.type].initialize.call(field);

    var add = field.el.querySelector('.carbon-add');
    if(add !== null){
        add.addEventListener('click', function(field){
            if(_.countBy(field.parent.fields, {name: field.name}).true < (field.array.max || 5)){
                var index = _.findIndex(field.parent.fields,{id:field.id});
                var atts = {};
                // atts[field.name] = field.value;
                var newField = carbon.createField.call(this, field.parent, atts, field.el ,null, field.item);
                field.parent.fields.splice(index, 0, newField)
                newField.el.querySelector('[name="'+field.name+'"]').focus();

                _.each(['change', 'change:'+field.name, 'create:'+field.name, 'inserted:'+field.name], _.partialRight(this.trigger, field) )
            }
        }.bind(this, field));
    }
    var minus = field.el.querySelector('.carbon-minus');
    if(minus !== null){
        minus.addEventListener('click', function(field){
            if(_.countBy(field.parent.fields, {name: field.name}).true > (field.array.min || 1)){
                var index = _.findIndex(field.parent.fields,{id:field.id});
                field.parent.fields.splice(index, 1);
                if(!field.target){
                    field.parent.rows[field.row].used -= (field.offset + field.columns)
                    field.parent.rows[field.row].ref.removeChild(field.el);
                    if(field.parent.rows[field.row].used  == 0){
                        field.parent.container.removeChild(field.parent.rows[field.row].ref);
                    }
                }else{
                    this.container.querySelector(field.target).removeChild(field.el);
                }
                _.each(['change', 'change:' + field.name, 'removed:' + field.name], _.partialRight(this.trigger, field) )
            }else{
                field.set(null);
            }
        }.bind(this, field));
    }
    if(field.fields){
        var newatts = {};
            if(field.array && typeof atts[field.name] == 'object'){
                newatts =  atts[field.name][index||0];
            }else{
                newatts = atts[field.name]||{};
            }

            field.fields = _.map(field.fields, carbon.createField.bind(this, field, newatts, null, null) );
                 if(field.array){
                    _.each(field.fields, carbon.inflate.bind(this, newatts) );
                }
        
    }

    carbon.processConditions.call(field, field.display, function(result){
        this.el.style.display = result ? "block" : "none";
        this.visible = result;        
    })      
    // carbon.processConditions.call(field, field.visible, function(result){
    //     this.el.style.visibility = result ? "visible" : "hidden";
    //     this.visible = result;
    // })
    
    carbon.processConditions.call(field, field.enable, function(result){
        this.enabled = result;        
        carbon.types[this.type].enable.call(this,this.enabled);
    })
    carbon.processConditions.call(field, field.parse, function(result){
        this.parsable = result
    })

    return field;
}

carbon.update = function(field){
    field.el.innerHTML = carbon.types[field.type].render.call(field);
    var oldDiv = document.getElementById(field.id);
    if(oldDiv == null){
        // oldDiv.parentNode.appendChild(field.el, oldDiv);
        
    }else{
        oldDiv.parentNode.replaceChild(field.el, oldDiv);
    }
}

carbon.ajax = function(options){
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

carbon.default= {label_key: 'label', value_key: 'value'}
carbon.prototype.opts = {
    clear:true,
    sections:'',
    suffix: ':',
    required: '<span style="color:red">*</span>'
}

/* Process the options of a field for normalization */
carbon.options = function(field) {
    if(typeof field.options == 'function') {
        field.action = field.options;
        field.options = field.action.call(this, field);
    }
	if(typeof field.options == 'string') {
        field.path = field.options;
        field.options = false;
        carbon.ajax({path: field.path, success:function(field, data) {
            field.options = data;  
            field = carbon.options(field);
            carbon.update(field)
        }.bind(null, field )})
		return field;
	}
    field = _.assignIn({options: []}, carbon.default, field);

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
    field.options =  _.map(field.options, function(item, i){
        if(typeof item === 'string' || typeof item === 'number') {
            item = {label: item};
           	if(this.value_key !== 'index'){
				item.value = item.label;
            }
        }
        var temp = _.assignIn({label: item[field.label_key], value: item[field.value_key] || i }, item);
        if(temp.value == field.value) { temp.selected = true;}
        return temp;
    }.bind(field))
    
    if(typeof field.default !== 'undefined' && field.options[0] !== field.default) {
		field.options.unshift(field.default);
	}

    return field;
}

carbon.i = 0;
carbon.getUID = function() {
    return 'f' + (carbon.i++);
};

carbon.types = {
    'basic':{
        defaults:{},
        create: function(){
            var tempEl = document.createElement("span");
            tempEl.setAttribute("id", this.id);
            // tempEl.setAttribute("data-columns", this.columns);
            tempEl.setAttribute("class", ' '+carbon.columnClasses[this.columns]);
            tempEl.innerHTML = this.render();
            return tempEl;
        },
        render: function(){
            return carbon.render(this.type, this);
        },
        initialize: function(){
            if(this.onchange !== undefined){ this.el.addEventListener('change', this.onchange);}
            var onchange = function(){
                this.value = this.get();
                this.owner.events.trigger('change:'+this.name, this);
                this.owner.events.trigger('change', this);
            }.bind(this)
            this.el.addEventListener('change',onchange );		
            this.el.addEventListener('input', onchange);
        },
        get: function(){
            return this.el.querySelector('[name="' + this.name + '"]').checked || this.el.querySelector('[name="' + this.name + '"]').value;
        },
        set: function(value){
            this.el.querySelector('[name="' + this.name + '"]').value = value;
        },
        satisfied: function(value){
            return (typeof value !== 'undefined' && value !== null && value !== '');            
        },
        enable: function(state){
            this.el.querySelector('input').disabled = !state;            
        }
        //display
    },
    'list':{
        render: function(){
            _.assignIn(this, carbon.options.call(this.owner, this));
            return carbon.render(this.type, this);
        },
        initialize: function(){
            if(this.onchange !== undefined){ this.el.addEventListener('change', this.onchange);}
            this.el.addEventListener('change', function(){
                this.value = this.get();
                this.owner.events.trigger('change:'+this.name, this);
                this.owner.events.trigger('change', this);
            }.bind(this));		
        },
        get: function(){
            return this.el.querySelector('[name="' + this.name + '"]').value;
        },
        set: function(value){
            this.el.querySelector('[name="' + this.name + '"]').value = value;
            _.each(this.options, function(option, index){
                if(option.value == value) this.el.querySelector('[name="' + this.name + '"]').selectedIndex = index;
            }.bind(this))
        }
    },
    'section':{
        initialize: function(){
            //handle rows
            this.rows = {};
        },        
        render: function(){
            if(this.owner.options.sections){
                return carbon.render(this.owner.options.sections+'_fieldset', this);                
            }else{
                return carbon.render('_fieldset', this);                
            }
        },
        // get: function(){
        //     return this.el.querySelector('[name="' + this.name + '"]').value;
        // },
        // set: function(value){
        //     this.el.querySelector('[name="' + this.name + '"]').value = value;
        //     _.each(this.options, function(option, index){
        //         if(option.value == value) this.el.querySelector('[name="' + this.name + '"]').selectedIndex = index;
        //     }.bind(this))
        // }
    }
};

carbon.types['hidden'] = carbon.types['textarea'] = carbon.types['text'] = carbon.types['checkbox'] = carbon.types['number'] = carbon.types['color'] = carbon.types['basic'];
carbon.types['fieldset'] = _.extend({},carbon.types['basic'],carbon.types['section']);
carbon.types['radio'] = carbon.types['select'] =  _.extend({},carbon.types['basic'],carbon.types['list']);
carbon.types['email'] = _.extend({},carbon.types['basic'],{defaults:{validate: { 'valid_email': true }}});