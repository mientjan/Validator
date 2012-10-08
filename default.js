if(!console){
	var console = {
		'log':function(){}
	};
}

$(document).ready(function(){

	new Helper.Form($('form'));
	new Helper.Table($('table'));
	new Helper.Search($('.form-search'));
	new Helper.Controls.FileUpload($('[type="file"]'));
	new Helper.Controls.Password($('.controls-password'));
	new Helper.Controls.Date($('[data-datepicker]'));
	new Helper.Controls.Youtube($('input[name=youtubeid]'));

	// new LocaleSelector($('.navbar .country-select'), $('.navbar .language-select'), locale );
	
	if( Helper.Url.getObject().controller == 'article'
		&& Helper.Url.getObject().action == 'upsert' ){
		new Article($('.form-horizontal'));
	}
	
	$('form .tab-pane').each(function(index, element){
		new Themepage(element);
	});
	
	$('a[rel=tooltip]').tooltip({});
	
	$('a[rel=popover]').popover({
		'placement':'top',
		'trigger':'click'
	}).click(function(e){
		e.preventDefault();
		var self = this;
		var arr = jQuery.grep( $('a[rel=popover]'), function(el){
			if(self != el){
				return true
			} 
			
			return false
			
		});
		$(arr).popover('hide');
		$(this).popover('show');
		return false;
	});
	
	$('body').on('click', function(e){
		$('a[rel=popover]').popover('hide');
	});
	
	$('.nav.nav-tabs a').on('click',function (e) {
		e.preventDefault();
		$(this).tab('show');
	});
	
	
	$('[data-media-filter=true]').each(function(i,el){
		
		var mediaElements = $(el).parents('form').find('[name=media_id]');
		$(el).on('change',function(e)
		{
			mediaElements.find('option[data-type]:not([hide-absolute])')
			.css('display','block')
			.attr('disabled',false );
			
			
			var option = $(this).find('[value='+$(this).val()+']');
			
			if(option.length>0)
			{
				var media = parseInt(option.attr('data-media')),
				image = parseInt(option.attr('data-image')),
				video = parseInt(option.attr('data-video'));
				
				
				
				mediaElements.off('change');
				mediaElements.on('change', function(e){
					var value = $(this).val(),
					options = $(this).find('option:selected');
					
				}).trigger('change');
				
				
				
				if(media>0)
				{

				} else if(image>0 || video>0 ){
						
					if(video == 0 ){
						mediaElements.find('option[data-type=video]')
						.css('display','none')
						.attr('disabled',true)
						.attr('selected',false);
					}
					
					if(image == 0 ){
						mediaElements.find('option[data-type=image]')
						.css('display','none')
						.attr('disabled',true)
						.attr('selected',false);
					}
				}
				
			}
		}).trigger('change');
		
	});
	
	
	// filter locale
	$('select[name=locale_id]').on('change', function(e){
		var form = $(this).parents('form');
		var locale = $(this).find('option[value='+$(this).val()+']')
		.attr('data-locale');
		
		$(form).find('[data-locale-filter=true] > option[data-locale]:not([data-locale^='+locale+'])')
		.css('visible','hidden').css('display','none')
		.attr('disabled',true);
			
		$(form).find('[data-locale-filter=true] > option[data-locale^='+locale+']')
		.css('visible','visible').css('display','block')
		.attr('disabled',false);
			
	}).trigger('change');
	
	$('select[name=template_id]').each(function(i,el){
		
		var mediaElements = $(el).parents('form').find('[name=media_id]');
		$(el).on('change',function(e)
		{
			mediaElements.find('option[data-type]:not([hide-absolute])')
			.css('display','block')
			.attr('disabled',false );
			
			
			var option = $(this).find('[value='+$(this).val()+']');
			
			if(option.length>0)
			{
				var media = parseInt(option.attr('data-media')),
					image = parseInt(option.attr('data-image')),
					video = parseInt(option.attr('data-video'));
				
				mediaElements.off('change');
				mediaElements.on('change', function(e){
					var value = $(this).val(),
					options = $(this).find('option:selected');
				}).trigger('change');
				
				if(image>0 || video>0 )
				{
					if(video == 0 ){
						mediaElements.find('option[data-type=video]')
						.css('display','none')
						.attr('disabled',true)
						.attr('selected',false);
					}
					
					if(image == 0 ){
						mediaElements.find('option[data-type=image]')
						.css('display','none')
						.attr('disabled',true)
						.attr('selected',false);
					}
				}
				
			}
		}).trigger('change');
		
	});
});

//var FlexEditor = !function(){
//	var FlexEditor = function(){
//		this.settings = {
//			'chapter':''
//		};
//	}
//	
//	FlexEditor.prototype.settings = null;
//	
//	return FlexEditor;
//}();

/*
// template
var Article = new Class({
	
	'data':{
		'title':'',
		'chapters':[]
	},
	
	'initialize':function(element){
		this.element = element;
		var data = Helper.Url.getObject();
		
		// initialize modal
		if(!$('#upsert-chapter').data('initialized')){
			$('#upsert-chapter').data('initialized', true );
			
			
			$('#upsert-chapter .btn.create-paragraph').click(function(e){
				Article.Modal.createParagraph('', $(this).parent().find('.article-paragraphs'));
			});
			
			// validation
			var form = $('#upsert-chapter').find('form')[0];
			new Helper.Form(form);
			
			// push/create Chapter
			$('#upsert-chapter .modal-footer .btn').click(function(e){
				
				form.validate(function(success)
				{
					
					if(!success){
						Helper.ScrollToElement( 
							$(form).find('.error'),
							$(form).parents('.modal-body')
							);
						return;
					} 
					
					var chapter = Object.clone(Themepage.Dto.Chapter);

					$('#upsert-chapter input, #upsert-chapter select').each(function(i, el){
						if( typeof(chapter[$(el).attr('name')]) != 'undefined' ){
							chapter[$(el).attr('name')] = $(el).val();
						}
					});

					$('#upsert-chapter .paragraph:not(.clonable) textarea').each(function(i, el)
					{
						// var text = Article.CKEditors[$(el).attr('id')] ? Article.CKEditors[$(el).attr('id')].getData() : $(el).val();
						chapter.paragraphs.push( $(el).val() );
					});

					var scope = $('#upsert-chapter').data('scope');

					if( scope != null ){
						Article.updateChapter(chapter, $('#upsert-chapter').data('scope') );
					} else {
						Article.createChapter(chapter, $('body .form-horizontal .article-chapters') );
					}

					Object.each( Article.CKEditors, function(editor){
						editor.destroy();
					});
					
					Article.CKEditors = {};

					$('#upsert-chapter').modal('hide');
				});
				
				return false;
			});
		}
		
		// bind click events on stored chapters
		$(element).find('.chapter:not(.clonable)').each(function(index,element){
			Article.bindEventsChapter(element);
		});
		
		// make chapters sortable
		$(element).find(".article-chapters" ).sortable({
			placeholder: "ui-state-highlight"
		});
		$(element).find(".article-chapters" ).disableSelection();
		
		$(element).find('.clonable').addClass('hide');
		
		$(element).find('.create-chapter').click(function(e){
			// $(element).find('.clonable input').val('');
			Article.Modal(null, null, $(this).attr('data-locale') );
			
			return false;
		});
	}
});

Article.CKEditors = {};

Article.bindEventsChapter = function(element)
{
	$(element).find('.edit-chapter').click(function(e){
		
		var value = $(this).parents('.chapter.well').find('textarea[name="chapter[]"]').val();
		var chapter = JSON.decode(value);
		
		Article.Modal(chapter, $(this).parents('div.chapter'), $(this).attr('data-locale') );
		return false;
	});

	$(element).find('.delete-chapter').click(function(e){
		$(this).parents('.chapter.well').remove();
	});
}

Article.createChapter = function(chapter, scope){

	var element = scope.find('.chapter.clonable').clone();
	element.removeClass('hide clonable')
	scope.append(element);
	
	element.find('span.title').html(chapter.title);
	element.find('span.template').html(chapter.template_id);
	
	if( chapter.media_id ){
		element.find('span.media').html(chapter.media_id.join(','));
	}
	
	element.find('textarea[name="chapter[]"]').val(JSON.encode(chapter))
	
	this.bindEventsChapter(element);
}

Article.updateChapter = function(chapter, scope){
	
	element = $(scope);

	element.find('span.title').html(chapter.title);
	element.find('span.template').html(chapter.template_id);
	
	if(chapter.media_id){
		element.find('span.media').html(chapter.media_id.join(','));
	}
	
	element.find('textarea[name="chapter[]"]').val(JSON.encode(chapter));
}

Article.Modal = function(chapter, scope)
{
	var localeElement = $('form.form-horizontal:parent(.span10)').find('[name=locale_id]'),
	locale = localeElement.find('option[value='+localeElement.val()+']').attr('data-locale');
	
	// console.log(locale);
	var modal = $('#upsert-chapter');
	modal.data('scope', scope );
	
	var paragraphsHolder = modal.find('.article-paragraphs');
	modal.find('.article-paragraphs .paragraph:not(.clonable)').remove();
	modal.find('.article-paragraphs .clonable').addClass('hide');
	
	if(locale){
		modal.find('select[name=media_id] option').each(function(index, option)
		{
			if( $(option).attr('data-locale').indexOf(locale) == -1  ){
				$(option).css('display', 'none')
				.attr('selected', false )
				.attr('disabled', true )
				.attr('hide-absolute', true )
				return;
			}

			$(option).css('display', 'block')
			.attr('disabled', false )
			.removeAttr('hide-absolute');
		});
	}

	if(!chapter){
		modal.addClass('create').removeClass('edit');
		modal.find('input[name=title]').val('');
	} else {
		modal.removeClass('create').addClass('edit');
		modal.find('input[name=title]').val( chapter.title );
		
		if(!isArray(chapter.media_id)){
			chapter.media_id = [parseInt(chapter.media_id)];
		} else {
			Array.each(chapter.media_id, function(node, index){
				chapter.media_id[index] = parseInt(node);
			});
		}
		
		modal.find('select[name=media_id] option').each(function(index, option)
		{
			
			if( $(option).attr('data-locale').indexOf(locale) == -1 ){
				$(option).css('display', 'none')
				.attr('selected', false )
				.attr('disabled',true)
				return;
			}
			
			$(option).css('display', 'block').attr('disabled',false);
			
			if( chapter.media_id 
				&& chapter.media_id.indexOf( parseInt($(option).attr('value')) ) != -1 )
				{
				$(option).attr('selected', true )
			} else {
				$(option).attr('selected', false );
			}
		});
		
		modal.find('select[name=template_id] option').each(function(index, option){
			if( chapter.template_id 
				&& chapter.template_id == $(option).attr('value') )
				{
				$(option).attr('selected', true )
			} else {
				$(option).attr('selected', false );
			}
		});

		modal.find('select[name=template_id]').trigger('change');
	
		Array.each(chapter.paragraphs, function(text){
			Article.Modal.createParagraph(text, paragraphsHolder );
		});
	}

	$('#upsert-chapter').modal('show');
}

	Article.Modal.createParagraph = function(text,scope){
	
		var element = scope.find('.paragraph.clonable'),
		id = String.uniqueID(),
		newElement = element.clone(false,false).removeClass('hide clonable');
	
		newElement.html(
			newElement.html().substitute({
				'text':text
			})
			);

		newElement.removeClass('well');				
		scope.append(newElement);

		newElement.find('textarea').attr('id', id );

		// remove element
		newElement.find('a').click(function(e){
			$(this).parent().remove();
		});

		Article.CKEditors[id] = CKEDITOR.replace(id);
	}

Article.Dto = {};
	Article.Dto.Chapter = {
		'title':'',
		'template_id':-1,
		'media_id':-1,
		'paragraphs':[]
	}

	Article.Dto.Paragraph = {
		'text':''
	}
*/
// template
var Themepage = new Class({
	
	'data':{
		'title':'',
		'chapters':[]
	},
	
	'options':{
		'chapter-editor':{
			'holder':'#upsert-chapter',
			'form':'#upsert-chapter form',
			'save':'#upsert-chapter .modal-footer .btn',
			'paragraphs':'#upsert-chapter .paragraphs',
			'paragraph-clonable':'#upsert-chapter .paragraph.clonable',
			'create-paragraph':'#upsert-chapter .btn.create-paragraph'
		}

	},
	
	'initialize':function(element){
		this.element = element;
		var data = Helper.Url.getObject();
		
		// initialize modal
		if(!$( this.options['chapter-editor'].holder ).data('initialized') ){
			$( this.options['chapter-editor'].holder ).data('initialized', true );
			
			
			$( this.options['chapter-editor']['create-paragraph'] ).click(function(e){
				Themepage.Modal.createParagraph('', this.options['chapter-editor']['paragraph-clonable'] );
				
			});
			
			// validation
			new Helper.Form( $( this.options['chapter-editor-form'] ) );
			
			// push/create Chapter
			$( this.options['chapter-editor-save'] ).click(function(e){
				
				form.validate(function(success)
				{
					if(!success){
						Helper.ScrollToElement( 
							$(form).find('.error'),
							$(form).parents('.modal-body')
							);
						return;
					} 
					
					var chapter = Object.clone(Themepage.Dto.Chapter);

//					$('#upsert-chapter input, #upsert-chapter select').each(function(i, el){
//						if( typeof(chapter[$(el).attr('name')]) != 'undefined' ){
//							chapter[$(el).attr('name')] = $(el).val();
//						}
//					});
//
//					$('#upsert-chapter .paragraph:not(.clonable) textarea').each(function(i, el){
//						
//						var paragraph = Object.clone(Themepage.Dto.Paragraph);
//						
//						paragraph.text = Themepage.Modal.ckEditors[$(el).attr('id')] ? Themepage.Modal.ckEditors[$(el).attr('id')].getData() : $(el).val();
//						
//						paragraph.text = paragraph.text.replace(/["]/g,'');
//						chapter.paragraphs.push(paragraph);
//					});
//
//					var scope = $('#upsert-chapter').data('scope');
//
//					if( scope != null ){
//						Themepage.updateChapter(chapter, $('#upsert-chapter').data('scope') );
//					} else {
//						Themepage.createChapter(chapter, $('.tab-pane.active .theme-chapters'));
//					}
//
//					$('#upsert-chapter').modal('hide');
				});
				
				return false;
			});
		}
		
		// bind click events on stored chapters
		$(element).find('.chapter:not(.clonable)').each(function(index,element){
			Themepage.bindEventsChapter(element);
		});
		
		// make chapters sortable
		$(element).find(".theme-chapters" ).sortable({
			placeholder: "ui-state-highlight"
		});
		$(element).find(".theme-chapters" ).disableSelection();
		
		$(element).find('.clonable').addClass('hide');
		
		$(element).find('.create-chapter').click(function(e){
			// $(element).find('.clonable input').val('');
			Themepage.Modal(null, null, $(this).attr('data-locale') );
			
			return false;
		});
	}
});

Themepage.bindEventsChapter = function(element){
	$(element).find('.edit-chapter').click(function(e){
		var value = $(this).parents('.chapter.well').find('textarea[name^="chapter"]').val();
		var chapter = JSON.decode(value);

		Themepage.Modal(chapter, $(this).parents('div.chapter'), $(this).attr('data-locale') );
		return false;
	});

	$(element).find('.delete-chapter').click(function(e){
		$(this).parents('.chapter.well').remove();
	});
}

Themepage.createChapter = function(chapter, scope){

	var element = scope.find('.chapter.clonable').clone();
	element.removeClass('hide clonable')
	scope.append(element);
	
	element.find('span.title').html(chapter.title);
	element.find('span.template').html(chapter.template_id);
	
	if( chapter.media_id ){
		element.find('span.media').html(chapter.media_id.join(','));
	}
	element.find('textarea[name^="chapter"]').val(JSON.encode(chapter))
	
	this.bindEventsChapter(element);
}

Themepage.updateChapter = function(chapter, scope){
	element = $(scope);

	element.find('span.title').html(chapter.title);
	element.find('span.template').html(chapter.template_id);
	
	if(chapter.media_id){
		element.find('span.media').html(chapter.media_id.join(','));
	}
	
	element.find('textarea[name^="chapter"]').val(JSON.encode(chapter));
}

Themepage.Modal = function(chapter, scope, locale)
{
	var modal = $('#upsert-chapter');
	modal.data('scope', scope );
	
	var paragraphsHolder = modal.find('.theme-paragraphs');
	modal.find('.theme-paragraphs .paragraph:not(.clonable)').remove();
	modal.find('.theme-paragraphs .clonable').addClass('hide');

	if(locale){
		modal.find('select[name=media_id] option').each(function(index, option)
		{
			if( $(option).attr('data-locale').indexOf(locale) == -1  ){
				$(option).css('display', 'none')
				.attr('selected', false )
				.attr('disabled', true )
				.attr('hide-absolute', true )
				return;
			}

			$(option).css('display', 'block')
			.attr('disabled', false )
			.removeAttr('hide-absolute');
		});
	}

	if(!chapter){
		modal.addClass('create').removeClass('edit');
		modal.find('input[name=title]').val('');
	} else {
		modal.removeClass('create').addClass('edit');
		modal.find('input[name=title]').val( chapter.title );
		
		if(!isArray(chapter.media_id)){
			chapter.media_id = [parseInt(chapter.media_id)];
		} else {
			Array.each(chapter.media_id, function(node, index){
				chapter.media_id[index] = parseInt(node);
			});
		}
		
		modal.find('select[name=media_id] option').each(function(index, option)
		{
			
			if( $(option).attr('data-locale').indexOf(locale) == -1 ){
				$(option).css('display', 'none')
				.attr('selected', false )
				.attr('disabled',true)
				return;
			}
			
			$(option).css('display', 'block').attr('disabled',false);
			
			if( chapter.media_id 
				&& chapter.media_id.indexOf( parseInt($(option).attr('value')) ) != -1 )
				{
				$(option).attr('selected', true )
			} else {
				$(option).attr('selected', false );
			}
		});
		
		modal.find('select[name=template_id] option').each(function(index, option){
			if( chapter.template_id 
				&& chapter.template_id == $(option).attr('value') )
				{
				$(option).attr('selected', true )
			} else {
				$(option).attr('selected', false );
			}
		});

		modal.find('select[name=template_id]').trigger('change');
	
		Array.each(chapter.paragraphs, function(paragraph){
			Themepage.Modal.createParagraph(paragraph.text, modal.find('.paragraph.clonable') );
		});
	}

	$('#upsert-chapter').modal('show');
}
	Themepage.Modal.ckEditors = {};
	Themepage.Modal.createParagraph = function(text, clonable){
		//	element = scope.find('.paragraph.clonable');

		var newElement = clonable.clone(false,false).removeClass('well hide clonable'),
		id = String.uniqueID();
		
		$(clonable).parent().append(newElement);
		textarea = newElement.find('textarea').val(text);
		textarea.attr('id', id );
	
		Themepage.Modal.ckEditors[id] = CKEDITOR.replace(textarea[0]);

		// remove element
		newElement.find('a').click(function(e){
		
			if(Themepage.Modal.ckEditors[id]){
				Themepage.Modal.ckEditors[id].destroy();
				delete Themepage.Modal.ckEditors[id];
			}
		
			$(this).parent().remove();
		});
	}

Themepage.Dto = {};
Themepage.Dto.Chapter = {
	'title':'',
	'template_id':-1,
	'media_id':-1,
	'paragraphs':[]
}

Themepage.Dto.Paragraph = {
	'text':''
}

var Helper = {}

Helper.Xhr = function(){
	
	var url = typeof(arguments[0]) != 'string' ? Helper.Url(arguments[0]) : arguments[0];
	
	switch(arguments.length){
		case 3:{
			jQuery.ajax({
				'url': url,
				'cache': false,
				'data':arguments[1],
				'type': "POST"
			}).done(arguments[2]);
			break;
		}
		case 2:{
			jQuery.ajax({
				'cache': false,
				'url': url,
				'type': "POST"
			}).done(arguments[1]);
			break;
		}
		case 1:{
			jQuery.ajax({
				'cache': false,
				'url': url,
				'type': "POST"
			}).done();
			break;
		}
	}
}

	Helper.Xhr.JSONP = function(){
	
		var url = arguments[0];
	
		switch(arguments.length){
			case 3:{
				jQuery.ajax({
					'dataType': 'jsonp',
					'url': url,
					'cache': false,
					'data':arguments[1],
					'type': "GET"
				}).done(arguments[2]);
				break;
			}
			case 2:{
				jQuery.ajax({
					'dataType': 'jsonp',
					'cache': false,
					'url': url,
					'type': "GET"
				}).done(arguments[1]);
				break;
			}
			case 1:{
				jQuery.ajax({
					'dataType': 'jsonp',
					'cache': false,
					'url': url,
					'type': "GET"
				}).done();
				break;
			}
		}
	}

Helper.CKEditor = !function(){
	function CKEditor(){
		
	}
	
	CKEditor.bindAllEvents = function(elements){
		
		$(elements).off('focus').on('focus', function(e){
			$(this).data('ckeditor', CKEDITOR.replace(this) );
		});

		$(elements).off('blur').on('blur', function(e){
			$(this).val( $(this).data('ckeditor').getData() );
			$(this).data('ckeditor').destroy();
			$(this).data('ckeditor', null );
		});
	}
	
	return CKEditor;
}();


Helper.Controls = {};

	Helper.Controls.Password = (function(){
		return new Class({
			'initialize':function(element)
			{
				if(isArray(element)){
					Array.each(element, function(el){
						new Helper.Controls.Password(el);
					});
					return;
				}

				var input = $(element).find('.btn + input');
				input.data('value', input.val() );
				if( input.val() != '' ){
					input.attr('disabled', true );
				}

			//			$(element).on('click', '.btn', function(e){
			//				var input = $(this).find('+ input');
			//				if(input[0].disabled){
			//					input.attr('disabled', false ).val('').focus();
			//					$(this).text('Reset');
			//				} else {
			//					input.attr('disabled', true ).val('********');
			//					$(this).text('Change');
			//				}
			//				
			//			});
			}
		});
	}());

	Helper.Controls.Date = (function(){
		return new Class({
			'initialize':function(element)
			{
				if(isArray(element)){
					Array.each(element, function(el){
						new Helper.Controls.Date(el);
					});
					return;
				}
			
				var btn = $(element).parent().find('.add-on.btn');
				btn.click(function(e){
					$(this).parents('.control-group').find('input').val( new Date().toYMD() );
				});
			}
		});
	}());

	Helper.Controls.Youtube = (function(){
		return new Class({
			'initialize':function(element)
			{
				var youtubeUrl = new RegExp(/(?:\?v=)([a-zA-Z0-9_-]*)/);
				var youtubeId = new RegExp(/^([a-zA-Z0-9_-]*)$/);

				element.change(function(e){
				
					
				
				
					var arr = youtubeUrl.exec($(this).val());
					if(!arr){
						arr = youtubeId.exec($(this).val());
						if(!arr){
						
							return ;
						}
					}
				
					clearInterval(this.inter);
					this.inter = (function(){
						var options = {
							'q':arr[1],
							'v':2,
							'alt':'jsonc',
							'max-results':1,
							'format':6
						}
					
						// http://www.youtube.com/watch?v=E9G6_nHLzKQ
						Helper.Xhr.JSONP('https://gdata.youtube.com/feeds/api/videos', options, function(response){
							//console.log(response);
							});
					}).delay(500);
				
					$(this).val(arr[1]);
					var self = this;
				
					Helper.Form.validateElement(this, function(success){
						//					console.log.apply(console, arguments);
						if(success){
						//						var el = $(self).find('+ [data-toggle="modal"]');
			
						}
					});
				});
			
				element.trigger('change');
			
				element.each(function(index,element){
					Helper.Form.validateElement(element);
				});
			
			}
		});
	}());

	Helper.Controls.FileUpload = ( function(){
	
		return new Class({
			'url':{
				'controller':'api',
				'action':'fileUpload'
			},
			'initialize':function(element){

				if(isArray(element)){
					Array.each(element, function(el){
						new Helper.Controls.FileUpload(el);
					});
					return;
				}
		
				element = $(element);
		
				var parent = element.parent(),
				name = element.attr('name'),
				extension = element.data('extension') || '*.*',
				httpfilepath = element.data('httpfilepath'),
				hash = element.attr('data-value'),
				className = element[0].className;

				//			console.log(element.attr('data-value'));

				element.remove();
			
				this.url.name = name;
				this.url.extension = extension;
		
				var iframe = $(document.createElement('iframe'))
				.attr('src', Helper.Url(this.url, null, true) )
				.addClass('span5')
				.css({
					'height':91,
					'margin-left':0,
					'border':'none',
					'overflow':'hidden'
				});

				parent.append(iframe);

				var hidden = $(document.createElement('input'))
				.data('httpfilepath', httpfilepath )
				.attr('type', 'hidden')
				.attr('name', name)
				.addClass(className)
				.val(hash);

				parent.prepend(hidden);

				var success = $(document.createElement('a'))
				.addClass('btn btn-warning')
				.css('display','none')
				.html('<i class="icon-remove-circle icon-white"></i> <strong> reset </string')
				.attr('name', name);

			
				var view = $(document.createElement('a'))
				.addClass('btn btn-info')
				.css('display','none')
				.html('<i class="icon-eye-open icon-white"></i> <strong>view</string')
				.attr('name', name);

				parent.prepend(
					success, 
					$(document.createElement('span')).html('&nbsp;'), 
					view
					);
			
				success.click(function(){
					$(this).css('display', 'none');
					view.css('display', 'none');
					iframe.css('display', 'block');
				});

				hidden.click(function(e){
					success.css('display', 'inline');
					view.css('display', 'inline');
					iframe.css('display', 'none');
				});

				view.click(function(e){
					var httpfilepath = $(hidden).attr('data-httpfilepath') || $(hidden).data('httpfilepath'),
					holder = $('#modal' + name + ' .holder');
				
					holder.empty();
					holder.append($(document.createElement('img')).attr('src', httpfilepath ));
				
					$('#modal' + name ).modal('show');
				});


				if( hash != null && hash != '' ){
					success.css('display', 'inline');
					view.css('display', 'inline');
					iframe.css('display', 'none');
				}

			}
		});
	})();

Helper.Table = (function(){
	
	return new Class({
		'_sorttype':['desc','asc'],
		'initialize':function(element)
		{
			if( isArray(element) ){
				Array.each(element, function(v,i){
					new Helper.Table(v);
				});
				return;
			}
			
			this._element = element;
			var url = Helper.Url.getObject();
			
			var _sorttype = this._sorttype;
			var list = $(this._element).find('thead td[data-column]').click(function(e){
				
				var column = $(this).data('column');
				
				sortType = _sorttype[0];
				if( url.sort == column && url['sort-type'] == _sorttype[0] )
				{
					sortType = _sorttype[1];
				};
			
				location.href = Helper.Url({
					'sort':column,
					'sort-type':sortType
				});
			});
			
			list.each(function(i, el){
				$(el).addClass('sorting');
				
				if( url.sort == $(el).data('column') ){
					
					if( url['sort-type'] == 'desc'){
						$(el).addClass('sorting-desc');
					} else {
						$(el).addClass('sorting-asc');
					}
				}
			});
		
			$(element).find('[data-delete=true]').click(function(e){
				if(confirm('Are you sure?')){
					$(this).parents('tr').css('display','none');
					Helper.Xhr({
						'action':'delete'
					},{
						'id': $(this).data('id')
					}, function(response){
						if(response.success){
							$(this).parents('tr').remove();
						} else {
							$(this).parents('tr').css('display','block');
							Helper.Message($(this).parents('table'), 'error', response.data.message );
						}
					}.bind(this));
				}
				
				return false;
			});
			
		}
	});
	
})();

Helper.ScrollToElement = function(element, scrollElement){
	
	var top = 0, 
	left = 0;
	

	var destination = $(element).offset().top;
	
	if(!scrollElement){
		scrollElement = $("html,body");
	}
	
	scrollElement.animate({
		'scrollTop': destination
	}, 500 );
	
	
//	element = $(element);
//	
//	if(element.length>1){
//		element = $(element[0]);
//	}
//	
//	if(!scrollElement){
//		scrollElement = $(window);
//		top = scrollElement.height();
//	} else {
//		scrollElement = $(scrollElement);
//		top = scrollElement.offset();
//	}
//
//	var pos = element.offset().top - 
//		top + scrollElement.scrollTop();
//	
//	console.log(pos);
//	scrollElement.animate({'scrollTop': pos });
};

Helper.Message = function(beforeElement, type, message){
			
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

	$(beforeElement).before(element);
		
};


Helper.Search = (function(){
	
	return new Class({
		'initialize':function(form)
		{
			if( isArray(form) ){
				Array.each(form, function(v,i){
					new Helper.Search(v);
				});
				return;
			}
			
			
			this._element = form;
			
			var url = Helper.Url.getObject();
			
			var select	= $(this._element).find('select'),
			input	= $(this._element).find('input'),
			button	= $(this._element).find('button'),
			a		= $(this._element).find('a');
			
			select.val(url['search']);
			input.val(url['search-query']);
			
			var go = function(e){
				
				location.href = Helper.Url({
					'search':select.val(),
					'search-query':input.val()
				});
				return false;
			}
			
			a.click(function(e){
				location.href = Helper.Url({}, null, true);
				return false;
			});
			
			button.click(function(e){
				go();
				return false;
			});
			
			var url = Helper.Url.getObject();
			
		}
	});
	
})();

Helper.Url = function(object, route, reset ){
	// console.log(Object.toQueryString);
	var object	= object || {},
	route	= route || null,
	reset	= reset || false,
	//		querystring = Object.toQueryString(Helper.Url.getQueryStringObject(query || {}))
	arr = [];
	
	if(reset){
		var obj = Helper.Url.getObject();
		object['controller'] = object['controller'] || obj['controller'];
		object['action'] = object['action'] || obj['action'];
		
		return Helper.Url.buildFromObject(object);
	}
	
	
	return Helper.Url.buildFromObject( jQuery.extend(Helper.Url.getObject(),object) );

//	var url = trim(Helper.Url.getBaseUrl(),'/') + '/' + arr.join('/');
//	if(querystring!=""){
//		url += '?'+querystring;
//	}
}

	Helper.Url.getObject = function()
	{
		var _structure = ['controller','action'],
		tmp = location.href.replace(Helper.Url.getBaseUrl(),''),
		base, url;
		
		if(tmp.lastIndexOf('?')!=-1){
			tmp = tmp.substr(0,tmp.lastIndexOf('?'));
		}
	
		tmp = jQuery.grep(tmp.split('/'), function(value){
			return value != ''
		});
	
		base = tmp.splice(0,2);
		url = {};
	
		for(var i=0, l = _structure.length;i<l;i++){
			if(!base[i]){
				base[i] = 'index';
			}
		
			var wrd = '';
			for(var j = 0; j < base[i].length; j++)
			{
				if( base[i].charAt(j) == '-' ){
					j++;
					wrd += base[i].charAt(j).toUpperCase();
				}
			}
		
			url[_structure[i]] = base[i];
		}
	
		for(var i=0, l = tmp.length;i<l;i+=2){
			url[tmp[i]] = tmp[i+1];
		}
	
		//	Object.each(object, function(value, name){
		//		var wrd
		//		object[name] = value
		//	});
	
		return url;
	}

	Helper.Url.buildFromObject = function(object)
	{
		Object.each(object, function(value,name){
		
			if( name != 'controller' && name != 'action'){
				return;
			}
		
			this[name] = '';
		
			for(var j = 0; j < value.length; j++)
			{	
				if( value.charAt(j) == value.charAt(j).toUpperCase() 
					&& ! /\d/.test(value.charAt(j)) 
					){
					this[name] += '-'+value.charAt(j).toLowerCase();
				} else {
					this[name] += value.charAt(j);
				}
			}
		}, object );
	
		arr = [];
		arr.push(object.controller);
		arr.push(object.action);
	
		jQuery.each(object, function(key, value){
			if(key!='controller'&&key!='action'){
				arr.push(key);
				arr.push(value);
			}
		});
	
		return this.getBaseUrl() + arr.join('/');
	}

	Helper.Url.getQueryStringObject = function(object)
	{
		var url = {};
	
		var url = {};
		$(location.search.substr( location.search.indexOf('?')+1 )
			.split('&')).each(function(index, value){
			url[value.substr(0,value.indexOf('='))] = value.substr(value.indexOf('=')+1);
		});
    
	
		return jQuery.extend(url,object);
	}


	Helper.Url.setBaseUrl = function(str){
		this._baseUrl = str;
	}

	Helper.Url.getBaseUrl = function(){
		if(!this._baseUrl){
			console.warn('baseurl not set');
		}
		return this._baseUrl;
	}


Helper.Form = (function(){
	
	var Form = new Class({
		
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
	

// adding validators
/*(function(add, Validator){
	console.log(add, Validator);
	add(new Validator('required', function(value){
		if(value == ''){
			return false;
		}
		
		return true;
	}));
	
	add(new Validator('youtubeid', function(value){
		
	}));
	
})(Form, Form.Validator);*/




var LocaleSelector = (function(){
	return new Class({

		'initialize':function(countrySelector, languageSelector, data)
		{
			this._country = countrySelector;
			this._language = languageSelector;
			this._data = data;
			
			var textNode = this._country.find(' > a.btn > .text');
			
			// feed country
			this.feed(this._country, data);
			
			var self = this;
			this._country.on('click', 'ul li a', function(e){
				var id = $(this).data('id');
				self.selectCountry(id);
			});
			
			if(this.country() == null){
				this.country(this._data[0].id);
			}
			
			this.selectCountry(this.country());

		},
		feed:function(element, list){
			var ul = element.find('ul').empty(),
			li, a;
			
			Array.each(list, function(entity,index){
				
				li = $(document.createElement('li'));
				a = $(document.createElement('a'))
				.data('id', entity.id )
				.text(entity.description);
				
				li.append(a);
				ul.append(li);
			});
			
		},
		selectCountry:function(id){
			this.country(id);
			var countryData = this._data.filter(function(data){ 
				return id == data.id; 
			});
				
			this.feed(this._language, countryData[0].languages);
			
			var self = this;
			this._language.on('click', 'ul li a', function(e){
				var id = $(this).data('id');
				self.selectLanguage(id);
			});
			
			if(this.language() == null ){
				this.selectLanguage(countryData[0].languages[0].id);
			} else {
				if( !this.selectLanguage(this.language()) ){
					this.selectLanguage(countryData[0].languages[0].id);
				}
			}
			
			$('[data-country-id]').val(countryData[0].id);
			$('[data-country-description]').val(countryData[0].description);
			
			
			$('[data-country-disablewhenglobal]').each(function(i, el){
				if( countryData[0].id == 1 ){
					if( $(el).is('input') ){
						$(el).attr('disabled', true );
					} else {
						$(el).css('visibility', 'hidden' );
					}
				} else {
					if( $(el).is('input') ){
						$(el).attr('disabled', false );
					} else {
						$(el).css('visibility', 'visible' );
					}
				}
			});
		
			
			this._country.find('span.text').text(countryData[0].description);
		},
		selectLanguage:function(languageid)
		{
			var countryid = this.country();
			
			if( countryid ){
				
				var countryData = this._data.filter(function(data){ 
					return countryid == data.id; 
				});
				
				var languageData = countryData[0].languages.filter(function(data){ 
					return languageid == data.id; 
				});
				
				if( languageData.length > 0){
					this.language(languageData[0].id);
					this._language.find('span.text').text(languageData[0].description);
					
								
					$('input[data-language-id]').val(languageData[0].id);
					$('input[data-language-description]').val(languageData[0].description);
					
					$('a[data-language-id]').text(languageData[0].id);
					$('a[data-language-description]').text(languageData[0].description);
					
					return true;
				}
				
				return false;
			}
			
			return false;
		},
		country:function(value){
			
			if(!value){
				return Cookie.read('country');
			} else {
				Cookie.write('country', value);
			}
			
			
		},
		language:function(value){
			if(!value){
				return Cookie.read('language');
			} else {
				Cookie.write('language', value);
			}
		}
	});
})();

function isArray(v){
	if( v && typeof(v.push) == 'function'){
		return true;
	}
	return false
}

function trim (str, charlist) {
	// http://kevin.vanzonneveld.net
	// +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
	// +   improved by: mdsjack (http://www.mdsjack.bo.it)
	// +   improved by: Alexander Ermolaev (http://snippets.dzone.com/user/AlexanderErmolaev)
	// +      input by: Erkekjetter
	// +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
	// +      input by: DxGx
	// +   improved by: Steven Levithan (http://blog.stevenlevithan.com)
	// +    tweaked by: Jack
	// +   bugfixed by: Onno Marsman
	// *     example 1: trim('    Kevin van Zonneveld    ');
	// *     returns 1: 'Kevin van Zonneveld'
	// *     example 2: trim('Hello World', 'Hdle');
	// *     returns 2: 'o Wor'
	// *     example 3: trim(16, 1);
	// *     returns 3: 6
	var whitespace, l = 0,
	i = 0;
	str += '';

	if (!charlist) {
		// default list
		whitespace = " \n\r\t\f\x0b\xa0\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u200b\u2028\u2029\u3000";
	} else {
		// preg_quote custom list
		charlist += '';
		whitespace = charlist.replace(/([\[\]\(\)\.\?\/\*\{\}\+\$\^\:])/g, '$1');
	}

	l = str.length;
	for (i = 0; i < l; i++) {
		if (whitespace.indexOf(str.charAt(i)) === -1) {
			str = str.substring(i);
			break;
		}
	}

	l = str.length;
	for (i = l - 1; i >= 0; i--) {
		if (whitespace.indexOf(str.charAt(i)) === -1) {
			str = str.substring(0, i + 1);
			break;
		}
	}

	return whitespace.indexOf(str.charAt(0)) === -1 ? str : '';
}

(function() {
	Date.prototype.toYMD = Date_toYMD;
	function Date_toYMD() {
		var year, month, day;
		year = String(this.getFullYear());
		month = String(this.getMonth() + 1);
		if (month.length == 1) {
			month = "0" + month;
		}
		day = String(this.getDate());
		if (day.length == 1) {
			day = "0" + day;
		}
		return year + "-" + month + "-" + day;
	}
})();
