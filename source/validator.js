
Validator = !function(){
	
	var options = {
		'element-selector':'input[class*=validate], select[class*=validate], textarea[class*=validate]'
	};
	
	var Validator = function(element){
		
		this._element = element;
		
		// set validation on element
		this._element.validate = this.validate.bind(this);
		this._elements = $(this._element).find('input[class*=validate], select[class*=validate], textarea[class*=validate]');

		// store initialized value on element
		Array.each( this._elements, function(element){
			$(element).data('value', $(element).val());
		});


		this._elements.bind('change keyup', function(){
			Form.validateElement(this);
		});

		$(this._element).find('.form-actions .btn-primary').bind('click', this.submit.bind(this) )
	}
	
	// vars
	Validator.prototype.options = null;
	Validator.prototype._element = null;
	Validator.prototype._elements = null;
	Validator.prototype._xhr = null;
	
	Validator.prototype.validate = function(){};
	
	// rules
	Validator.Rule = function(){}
	
	Validator.validateElement
	
	
	var Validator = new Class({
		
		_element:null,
		_elements:null,
		_xhr:null,
		
		'initialize':function(element){
			
			if( isArray(element) ){
				Array.each(element, function(v){
					new Helper.Form(v);
				});
				return;
			}
			
			this._element = element;

			// set validation on element
			this._element.validate = this.validate.bind(this);
			this._elements = $(this._element).find('input[class*=validate], select[class*=validate], textarea[class*=validate]');
			
			// store initialized value on element
			Array.each( this._elements, function(element){
				$(element).data('value', $(element).val());
			});


			this._elements.bind('change keyup', function(){
				Form.validateElement(this);
			});

			$(this._element).find('.form-actions .btn-primary').bind('click', this.submit.bind(this) )
		},
		'submit':function(e)
		{
			
			if(e){
				e.preventDefault();
			}

			var url = $(this._element).attr('action');
			if(!url){
				url = location.href;
			}

			if(!this._xhr){
				this._xhr = {
					'url': url,
					'dataType':'json',
					'type':'POST',
					'data':{},
					'success':function(response)
					{
						$(this._element).find('.form-actions .btn-primary').button('reset');
						
						if(!response.success){
							this.message('error', response.data.message );
						} else {

							switch( true )
							{
								case response.data.redirect != '' 
									&& !Helper.Url.getObject()['id']:
									{
										location.href = response.data.redirect;
										break;
									}
								
								default:
								{
									this.message('success', 'Save successfull <a class="btn btn-mini" href="'+Helper.Url({
										'action':'index'
									}, null, true)+'">back to overview</a>');
									break;
								}
							}
						}
					}.bind(this)
				};
			}

			this._xhr.data = this.getValueObject();
			
			this.validate(function(success){
				if(success){
					$(this._element).find('.form-actions .btn-primary').button('loading');
					jQuery.ajax(this._xhr);
				} else {
					Helper.ScrollToElement( $(this._element).find('.error') );
				}
			}.bind(this));
		},
		'message':function(type, message){
			
			var element = document.createElement('div');
			element.className = 'alert alert-'+type;

			var btnClose = document.createElement('button');
			btnClose.className = 'close';
			$(btnClose).attr('data-dismiss', 'alert');
			btnClose.type = 'button';
			btnClose.className = 'close';
			btnClose.appendChild(document.createTextNode('x'));


			element.appendChild(btnClose);
			var span = document.createElement('span');
			span.innerHTML = message;
			element.appendChild(span);

			$(this._element).before(element);
		},
		'validate':function(fn){
			
			this._elements = $(this._element).find('input[class*=validate], select[class*=validate], textarea[class*=validate]');
			
			var valid = true,
			length = this._elements.length,
			count = 0,
			responseFn = function(success){
					
				if(!success){
					valid = false;
				}
					
				count++;

				if(count == length){
					fn.call(window,valid)
				}
			};
				
			this._elements.each(function(i, el){
				Form.validateElement(el, responseFn );
			});

			return valid;
		},
		'getValueObject':function(){
			var values = {};
			
			$(this._element).find('textarea').each(function(i,el){
				
				if( $(el).data('ckeditor') ){
					$(el).val( $(el).data('ckeditor').getData().replace(/["]/g,'') );
				}
			});
			
			var data = $.parseParams( $(this._element).serialize() );
			
			$(this._element).find('select[multiple]').each(function(index,element){
				if( data[$(element).attr('name')] ){
					data[$(element).attr('name')] = $(element).val();
				}
			});
			
			
			//			console.log( $.parseParams( $(this._element).serialize() ) );
			
			/*$(this._element).find('input, select, textarea').each(function(i, el){

				if( typeof($(el).attr('name')) == 'undefined'){
					console.warn('element has no name', el);
					return;
				}

				
				var name = $(el).attr('name').test('')

				switch(el.tagName.toLowerCase()){
					default:{
							
						values[$(el).attr('name')] = $.type($(el).val()) == 'array' ? $(el).val().join(',') : $(el).val();
						break;
					}
					case 'input':{
						switch($(el).attr('type')){
							default:{
								values[$(el).attr('name')] = $(el).val();
								break;
							}
							case 'checkbox':
							case 'radio':{
								if(el.checked){
									values[$(el).attr('name')] = $(el).val();
								}
								break;
							}
						}
						values[$(el).attr('name')] = $(el).val();
						break;
					}
				}
			});*/

			return data;
		}
	});
	
	Form.validateElement = function(element, fn )
	{
		var callback = function(success){
			
			if(success == false){
				$(element).parents('.control-group').addClass('error').removeClass('success');
			} else if( success == true ) {
				$(element).parents('.control-group').addClass('success').removeClass('error');
			}
			
			if(fn) fn.call(window,success);
		}
		
		var classArray = jQuery.grep( element.className.split(' '), function(value){
			return value.indexOf('validate-')>=0;
		});
		
		var re = new RegExp(/(?:validate\-)([\w-]*)/),
		valid = true,
		length = classArray.length,
		count = 0,
		responseFn = function(success, element){
			switch( success ){
				case false:{
					valid = false;
						
					$(element).parents('.control-group').find('.error.validate-' + this.name )
					.addClass('active');
					break;
				}
				case true:{
					$(element).parents('.control-group').find('.error.validate-' + this.name )
					.removeClass('active');
						
					break;
				}
			}

			count++;
				
			if(count == length){
				var gfx = $(element).parents('.control-group').find('.async');
				if(gfx[0]){
					gfx[0].className = gfx.data('classname');
				}
				callback.call(window,valid)
			}
		};
		
		
		var gfx = $(element).parents('.control-group').find('.async');
		if(gfx.length>0 && !gfx.data('classname')){
			gfx.data('classname', gfx[0].className );
		}
		
		if(gfx.length>0){
			gfx[0].className = 'async icon-loading';
		}
		
		$(classArray).each(function(i, str){
			var validatorName = re.exec(str)[1],
			validator = Form.getValidator(validatorName),
			isValid = null;
			
			if( typeof(validator) != 'undefined'
				&& validator instanceof Helper.Form.Validator )
				{
				validator.isValid(element, responseFn );
			}
		});
		
	}
	
	_validators = {};
	
	// validation of form
	Form.addValidator = function(validator){
		_validators[validator.name] = validator;
	}
	
	Form.getValidator = function(name){
		return _validators[name];
	}
	
	return Form;
	
})();

	Helper.Form.Validator = (function(){
		var Validator = function(name, fn){
			this.name = name;
			this.fn = fn;
		}
	
		Validator.prototype.name = null;
		Validator.prototype.fn = null;
	
		Validator.prototype.isValid = function(element, fn){
			return this.fn.call(this, element, fn);
		};
	
		return Validator;
	})();

(function(addValidator, Validator){
	addValidator(new Validator('required', function(element, fn){
		if($(element).val() == ''){
			fn.call(this, false, element);
		} else {
			fn.call(this, true, element);
		}
	}));
	
	addValidator(new Validator('youtubeid', function(element, fn){
		// var youtubeId = new RegExp(/^([a-zA-Z0-9_-]*)$/);
		if(/^([a-zA-Z0-9_-]*)$/.test($(element).val())
			&& $(element).val().length>=11 )
			{
			fn.call(this, true, element);
		} else {
			fn.call(this, false, element);
		}

	}));
	
	addValidator(new Validator('mysqldate', function(element, fn){
		if($(element).val() == ''){
			fn.call(this, false, element);
		}
		
		if(/^(?:199[0-9]|20[0-9][0-9])-(?:0[1-9]|1[0-2])-(?:[0-2][0-9]|3[0-1])$/.test($(element).val())){
			fn.call(this, true, element);
		} else {
			fn.call(this, false, element);
		}

	}));
	
	addValidator(new Validator('username-available', function(element, fn){
		
		clearInterval(this.interval);
		
		if( $(element).data('value') == $(element).val() ){
			fn.call(this, true, element);
			return;
		}
		
		this.interval = (function(element, fn, scope){
			Helper.Xhr({
				'controller':'api',
				'action':'isUsernameAvailable'
			}, {
				'username':$(element).val()
			}, function(response){
				fn.call(scope, response.success, element);
	
			});
		}).delay(500, null, [element,fn, this]);
	}));
	
	
})(Helper.Form.addValidator, Helper.Form.Validator);