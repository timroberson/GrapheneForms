gform.stencils = {
    _container: `
    <form novalidate  {{^autocomplete}}autocomplete="false"{{/autocomplete}}>
    {{#legend}}<legend for="{{name}}"><h4>{{{legend}}}</h4></legend>{{/legend}}
    </form>
    <div class="row gform-footer"></div>`,
text: `
<div class="row row-wrap">
<div class="column">
    {{>_label}}
    <input{{#limit}} maxlength="{{limit}}"{{/limit}}{{#min}} min="{{min}}"{{/min}}{{#max}} max="{{max}}"{{/max}} {{#step}} step="{{step}}"{{/step}} placeholder="{{placeholder}}" name="{{name}}" type="{{type}}" {{#selected}} checked {{/selected}} value="{{value}}" id="{{id}}" />
    {{>_error}}
    </div>
    </div>
    {{>_actions}} 
`,
output: `
<div class="row row-wrap">
<div class="column">
    {{>_label}}
    <output name="{{name}}" id="{{id}}">{{{display}}}</output>
    {{>_error}}
    </div>
    </div>
    {{>_actions}} 
`,
switch: `
{{>_label}}
<label class="switch">
<input name="{{name}}" type="checkbox" {{^editable}}disabled{{/editable}} {{#options.1.selected}}checked=checked{{/options.1.selected}} value="{{value}}" id="{{name}}" />
<span class="slider round"></span>
</label>
    
    {{>_error}}
    </div>
    {{>_actions}}   
`,  
checkbox: `
    {{>_label}}
    <input name="{{name}}" type="{{type}}" {{#options.1.selected}} checked {{/options.1.selected}} value="{{value}}" id="{{name}}" />
    <label class="label-inline" for="{{name}}"><span class="falseLabel">{{options.0.label}}</span><span class="trueLabel">{{options.1.label}}</span></label>
    {{>_error}}
    </div>
    {{>_actions}}   
`,    
hidden: `<input name="{{name}}" type="hidden" value="{{value}}" id="{{id}}" />{{>_error}}`,
textarea: `
<div class="row row-wrap">
<div class="column">
    {{>_label}}
    {{#limit}}<small class="column count" style="text-align:right">0/{{limit}}</small>{{/limit}}
    <textarea{{#limit}} maxlength="{{limit}}"{{/limit}} placeholder="{{placeholder}}" name="{{name}}" rows="{{rows}}{{^rows}}3{{/rows}}" type="{{type}}" id="{{id}}" />{{value}}</textarea>
    {{>_error}}
    </div>
    {{>_actions}}   
</div>
</div> `,
select: `
    {{>_label}}
    {{#mapOptions.waiting}}<div style="position:relative;height:0">    <i class="loading" style="width: 30px;height: 30px;position:absolute;top:5px;left:5px"></i>
    </div>{{/mapOptions.waiting}}

    <select {{#multiple}}multiple=multiple{{/multiple}}  {{#size}}size={{size}}{{/size}}  name="{{name}}{{#multiple}}[]{{/multiple}}" value="{{value}}" id="{{id}}" />

    {{#options}}
            {{^optgroup}}
            <option {{#selected}}selected='selected'{{/selected}} {{^editable}}disabled{{/editable}} {{^visible}}hidden{{/visible}}  value="{{i}}">{{{label}}}</option>
            {{/optgroup}}
            {{#optgroup}}
            {{#optgroup.label}}
            <optgroup label="{{label}}" data-id="{{optgroup.id}} {{^editable}}disabled{{/editable}} {{^visible}}hidden{{/visible}}">
            {{/optgroup.label}}
                {{#options}}
                <option data-id="{{optgroup.id}}" {{#selected}}selected='selected'{{/selected}} {{^editable}}disabled{{/editable}} {{^visible}}hidden{{/visible}}  value="{{i}}">{{{label}}}</option>
                {{/options}}
                {{#optgroup.label}}
            </optgroup>
            {{/optgroup.label}}
            {{/optgroup}}
        {{/options}}

    </select>
    {{>_error}}
    {{>_actions}}       
`,
radio: `
    {{>_label}}
    <span class="">
    {{#options}}

    {{#multiple}}
        <div><input name="{{name}}_{{value}}" type="checkbox" {{#selected}} checked {{/selected}} value="{{value}}"/>
        <label class="noselect label-inline" for="{{name}}_{{value}}">{{label}}</label></div>
    {{/multiple}}
    {{^multiple}}
        <label class="noselect"><input style="margin-right: 5px;" name="{{id}}" {{#selected}} checked=selected {{/selected}}  value="{{i}}" type="radio"><span style="font-weight:normal">{{label}}</span></label>        
    {{/multiple}}
    {{/options}}
    </span>
    {{>_error}}
    {{>_actions}}`,

scale: `
    {{>_label}}
    <table class="table table-striped">
    <thead>
        <tr>
            {{#format.low}}<th></th>{{/format.low}}
            {{#options}}
            <th><label for="{{name}}_{{i}}">{{{label}}}</label></th>
            {{/options}}
            {{#format.high}}<th></th>{{/format.high}}
        </tr>
    </thead>
    <tbody>
        <tr>
            {{#format.low}}<td><label style="font-weight: 500;" for="{{name}}_1">{{{format.low}}}</label></td>{{/format.low}}
            {{#options}}
            <td>
                <input id="{{name}}_{{i}}" style="margin-right: 5px;" name="{{id}}" {{#selected}} checked=selected {{/selected}}  value="{{value}}" type="radio">
            </td>
            {{/options}}
            {{#format.high}}<td><label style="font-weight: 500;" for="{{name}}_{{options.length}}">{{{format.high}}}</label></td>{{/format.high}}
        </tr>
    </tbody>
    </table>

    {{>_error}}
    {{>_actions}}`,
    _fieldset: `<div><fieldset id="{{id}}" name="{{name}}">
    {{>_error}}
    {{#array}}<hr style="margin: 0 0 10px;">{{/array}}
    <div class="row row-wrap">
    {{^section}}<legend class="column" for="{{name}}"><h5>{{{label}}}</h5></legend>{{/section}}
    {{>_actions}}
    </div>
    </fieldset></div>`,
grid: `<div class="row row-wrap">
<fieldset id="{{id}}" name="{{name}}">

    {{>_label}}
    {{>_error}}

    <table class="table table-striped" style="margin-bottom:0">
    <thead>
        <tr>
            <th></th>
            {{#options}}
            <th><label>{{label}}</label></th>
            {{/options}}
            
        </tr>
    </thead>
    <tbody>
    {{#fields}}
        <tr>
            <td><label style="font-weight: 500;" for="{{id}}">{{{label}}}</label></td>
            {{#options}}
            <td>
            {{#multiple}}
                <div><input name="{{id}}" type="checkbox" {{#selected}} checked {{/selected}} value="{{value}}"/>
            {{/multiple}}
            {{^multiple}}
                <input style="margin-right: 5px;" name="{{id}}" {{#selected}} checked=selected {{/selected}}  value="{{value}}" type="radio">
            {{/multiple}}
            </td>
            {{/options}}
        </tr>
        {{/fields}}
    </tbody>
    </table>

    {{>_actions}}

    </fieldset>
</div>`,
_actions: `      
    {{#array}}
    <div data-name="{{name}}" data-ref="{{ref}}" class="noprint" style="float:right">
    {{#duplicate.enable}}
    <input data-id="{{id}}" style="padding: 0 ;padding:0 1.5rem; border-color:green;color:green;float:right;margin:0 5px" class="gform-add button button-outline" type="button" value="{{duplicate.label}}{{^duplicate.label}}+{{/duplicate.label}}">
    {{/duplicate.enable}}
	{{#remove.enable}}
    <input data-id="{{id}}" style="padding: 0 ;padding:0 1.5rem; border-color:red;color:red;float:right;margin:0 5px" class="gform-minus button button-outline" type="button" value="{{remove.label}}{{^remove.label}}-{{/remove.label}}">
	{{/remove.enable}}
    </div>
    {{/array}}
`,
_label: `      
<label class="" for="{{name}}">{{{label}}}{{#required}}{{{requiredText}}}{{/required}}{{suffix}}</label>     
<small class="column form-help" style="position:relative;left:-10px"> {{{help}}}</small>

`,
_error:`<small class="error-text" style="color:red;display:block;position:relative;top:-12px"></small><small class="valid" style="color:green;display:block;"></small>`,
button:`<button type="button" role="button" class="button noprint {{modifiers}}" style="margin:0 15px 0">{{{label}}}</button>`,
tab_container: `
<form id="{{name}}" novalidate {{^autocomplete}}autocomplete="false"{{/autocomplete}} name="{{name}}" class="gform tab-content {{modifiers}}" {{#action}}action="{{action}}"{{/action}} onsubmit="return false;" {{#method}}method="{{method}}"{{/method}}>
{{^legendTarget}}{{#legend}}<legend>{{{legend}}}</legend>{{/legend}}{{/legendTarget}}
	<ul class="tabs">
		{{#fields}}
        {{#section}}
            <a href="#tabs{{id}}" data-toggle="tab"><li {{^index}}class="active"{{/index}}>{{{legend}}}</li></a>
	    {{/section}}		
		{{/fields}}
    </ul></form>
	<div class="footer"></div>`,
tab_fieldset: `{{#section}}<div class="tab-pane {{^index}}active{{/index}} " id="tabs{{id}}">{{/section}}{{>_fieldset}}{{#section}}</div>{{/section}}`,
modal_container:`<div class="modal modal-hide">
<div class="modal-background"></div>
<div class="modal-card">
  <header class="modal-card-head {{modal.header_class}}">
    <legend class="modal-card-title">{{{title}}}{{{legend}}}
    </legend>
    <span class="button button-outline close" aria-label="close" style="padding:0 1.5rem;margin:0">X</span>
  </header>
  <section class="modal-card-body">
    {{{body}}}
    {{^sections}}
    <form id="{{name}}" style="overflow:hidden" {{^autocomplete}}autocomplete="false"{{/autocomplete}} name="{{name}}" class="gform {{#options.horizontal}} smart-form-horizontal form-horizontal{{/options.horizontal}} {{modifiers}}" {{#action}}action="{{action}}"{{/action}} onsubmit="return false;" {{#method}}method="{{method}}"{{/method}}></form>
    {{/sections}}
    {{#sections}}
    <form id="{{name}}" novalidate {{^autocomplete}}autocomplete="false"{{/autocomplete}} name="{{name}}" class="gform tab-content {{modifiers}}" {{#action}}action="{{action}}"{{/action}} onsubmit="return false;" {{#method}}method="{{method}}"{{/method}}>
	<ul class="tabs">
		{{#fields}}
        {{#section}}
		
            <a href="#tabs{{id}}" data-toggle="tab"><li {{^index}}class="active"{{/index}}>{{{legend}}}</li></a>
        
	    {{/section}}		
		{{/fields}}
    </ul></form>
    {{/sections}}
  </section>
  <footer class="modal-card-foot">
  <div class="footer gform-footer" style="width:100%">{{{footer}}}</div>
  

  </footer>
</div>
</div>`,
template:'<div><div class="column column-100">{{#array}}{{#append.enable}}<button data-ref="{{ref}}" data-parent="{{parent.id}}" class="gform-append float-right">{{append.label}}{{^append.label}}Add{{/append.label}}</button>{{/append.enable}}{{/array}}<legend>{{label}}</legend><div class="list-group gform-template_row"></div></div></div>',
template_item:`<div class="input-template"><div class="gform-template_container">{{{format.template}}}{{^format.template}}{{{value}}}{{/format.template}}</div></div>`,
child_modal_footer:`<button class="hidden-print button-outline gform-minus float-left" style="margin:0 15px">X Delete</button><button class="float-right hidden-print done" style="margin:0 15px"><i class="fa fa-check-o"></i>Done</button>`,
table:'<div class="column column-100">{{#array}}<div style="overflow:scroll" class="column column-100">{{#append.enable}}<button data-ref="{{ref}}" data-parent="{{parent.id}}" class="gform-append float-right">{{append.label}}{{^append.label}}Add{{/append.label}}</button>{{/append.enable}}{{/array}}<h3>{{label}}</h3><table class="{{#array.sortable.enable}}sortable{{/array.sortable.enable}}"><thead>{{#fields}}<th>{{label}}</th>{{/fields}}</thead><tbody></tbody></table></div></div>'
};
gform.columns = 12;
gform.columnClasses = _.map(['','10','20','25','33','40','50','60','66','75','80','90','100'],function(item){return 'column-'+item+' column'})
gform.offsetClasses = _.map(['','10','20','25','33','40','50','60','66','75','80','90','100'],function(item){return 'column-offset-'+item+' column'})
gform.prototype.opts.suffix = ""

gform.handleError = function(field){
    if(field.valid){
		if(field.satisfied(field.get())) {
        // field.el.querySelector('.valid').innerHTML = field.validtext||'';
        }
		field.el.classList.remove('error')		
        if(field.el.querySelector('.error-text') !== null){
            field.el.querySelector('.error-text').innerHTML = '';
        }
    }else{
        if(field.el.querySelector('.error-text') !== null){
            field.el.querySelector('.error-text').innerHTML = field.errors;
        }
        field.el.classList.add('error');

        field.el.querySelector('.valid').innerHTML = '';

        if(field.el.querySelector('.valid') !== null){
            field.el.querySelector('.valid').innerHTML = '';
        }
    }
}
gform.types['cancel']   = _.defaultsDeep({}, gform.types['button'], {defaults:{
	label:"<i class=\"fa fa-times\"></i> Cancel",
	action:"cancel",
	modifiers: "button-outline"}});
gform.types['save']   = _.defaultsDeep({}, gform.types['button'], {defaults:{
	label:"<i class=\"fa fa-check\"></i> Save",
	action:"save",
	modifiers: "float-right"}});
gform.types['reset']   = _.defaultsDeep({}, gform.types['button'], {defaults:{
    "label":"<i class=\"fa fa-times\"></i> Reset",
    "action":"reset",
    "modifiers": "button-outline"}});
gform.types['clear']   = _.defaultsDeep({}, gform.types['button'], {defaults:{
    "label":"<i class=\"fa fa-times\"></i> Clear",
    "action":"clear",
    "modifiers": "button-outline"}});

gform.types.fieldset.setLabel = function(){
    this.label = gform.renderString(this.item.label||this.label, this);
    var labelEl = this.el.querySelector('legend');
    if(labelEl !== null){
        labelEl.innerHTML = '<h5>'+this.label+'</h5>';
    }
  }

gform.prototype.modal = function(data){
    var el = this.modalEl||this.el;

    if(!document.body.contains(el)){
        document.body.appendChild(el);
        el.querySelector('.close').addEventListener('click', function(){
            // gform.prototype.modal.call(this,'hide');
            (this.owner||this).trigger('close',this);
        }.bind(this));
    }

    switch(data){
        case "hide":
            gform.addClass(el,'modal-hide');

            // if(typeof this.type !== 'undefined'){
            //     this.owner.trigger("close_child",this);
            // }else{
            //     this.trigger("close",this);
            // }
            break;
        default:
            gform.removeClass(el,'modal-hide');
    }
	// $(this.el).modal(data)
	return this;
};
