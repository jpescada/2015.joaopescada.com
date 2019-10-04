window.JPescadaForms = (function(app){

	'use strict';

	app.Forms = {

		name: 'app.Forms',

		delegate: function(form){
			return _delegate(form);
		},

		updateValidators: function(form){
			_addValidators(form);
			_enableSubmissionCheck(form);
		}
	};

	function _delegate(form){

		// listen for submits
		form.unbind('submit', _handleFormSubmit).bind('submit', _handleFormSubmit);

		// add validators
		_addValidators(form);

		// remove html5 validation
		form.attr('novalidate', 'novalidate');

		// update .preview-box
		if (form.hasClass('update-preview-box')){
			_enableSubmissionCheck(form);
		}
	}

	function _addValidators(form){
		form.find('input,textarea').each(function(index, item){
			if (item.type === 'text') { _addTextValidator(item); }
			if (item.type === 'email') { _addEmailValidator(item); }
			if (item.type === 'url') { _addUrlValidator(item); }
			if (item.type === 'textarea') { _addTextareaValidator(item); }
			if (item.type === 'radio') { _addRadioValidator(item); }
		});
	}

	function _addTextValidator(input){
		$(input).unbind('change', _handleTextInputChange).bind('change keyup', _handleTextInputChange );
		$(input).unbind('focus', _handleInputFocus).bind('focus', _handleInputFocus );
		$(input).unbind('blur', _handleInputBlur).bind('blur', _handleInputBlur );
	}

	function _addEmailValidator(input){
		$(input).unbind('change', _handleEmailInputChange).bind('change keyup', _handleEmailInputChange );
		$(input).unbind('focus', _handleInputFocus).bind('focus', _handleInputFocus );
		$(input).unbind('blur', _handleInputBlur).bind('blur', _handleInputBlur );
	}

	function _addUrlValidator(input){
		$(input).unbind('change', _handleUrlInputChange).bind('change keyup', _handleUrlInputChange );
		$(input).unbind('focus', _handleInputFocus).bind('focus', _handleInputFocus );
		$(input).unbind('blur', _handleInputBlur).bind('blur', _handleInputBlur );
	}

	function _addTextareaValidator(input){
		$(input).unbind('change', _handleTextareaInputChange).bind('change keyup', _handleTextareaInputChange );
		$(input).unbind('focus', _handleInputFocus).bind('focus', _handleInputFocus );
		$(input).unbind('blur', _handleInputBlur).bind('blur', _handleInputBlur );
	}

	function _addRadioValidator(input){
		$(input).unbind('change', _handleRadioInputChange).bind('change', _handleRadioInputChange );
		$(input).unbind('focus', _handleInputFocus).bind('focus', _handleInputFocus );
		$(input).unbind('blur', _handleInputBlur).bind('blur', _handleInputBlur );
	}

	function _enableSubmissionCheck(form){

		var $placeholders = $('.preview-box .placeholder');

		$placeholders.each(function(index,item){

			var $placeholder = $(item);
			var $relatedInput = form.find($placeholder.data('relatedInput'));

			$relatedInput.bind('change keyup', {placeholder: item}, function(event){
				var $input = $(event.currentTarget),
					inputValue = $input.val(),
					$placeholder = $(event.data.placeholder);

				// show div when as soon as one input changes
				if (inputValue !== '') {
					$('.submission-check').addClass('is-active');
				}

				// not the best, but a simple solution still
				// if phone-input is valid and skype-input isn’t, show phone placeholder
				if ($('#phone-input').length && $('#skype-input').length){
					if ($('#phone-input').val().length >= 2 && $('#skype-input').val().length <= 2) {
						$('.preview-box .placeholder[data-related-input="#skype-input"]').parent().hide();
						$('.preview-box .placeholder[data-related-input="#phone-input"]').parent().show();
					} else {
						$('.preview-box .placeholder[data-related-input="#skype-input"]').parent().show();
						$('.preview-box .placeholder[data-related-input="#phone-input"]').parent().hide();
					}
				}


				// show default value if value is empty
				if (inputValue === '') {
					inputValue = $placeholder.data('defaultValue');
				}

				// update placeholder
				$placeholder.html( inputValue );
			});

		});
	}

	function _flagValid(input){
		$(input).removeClass('is-invalid').addClass('is-valid');
		_updateFormValidationStatus(input);
	}

	function _flagInvalid(input){
		$(input).removeClass('is-valid').addClass('is-invalid');
		_updateFormValidationStatus(input);
	}

	function _updateFormValidationStatus(input){

		var form = $(input).closest('form'),
			isValid = true;

		form.find('input, textarea').each(function(index, item){

			if (
				item.required && !$(item).hasClass('is-valid') &&
					(
						item.type === 'text' ||
						item.type === 'email' ||
						item.type === 'url' ||
						item.type === 'textarea'
					)
				) {
				isValid = false;
			}

			// specific validation for radio inputs
			if (item.required && item.type === 'radio') {

				if ( $(item).hasClass('form-input-meeting') ) {

					if( $('.form-input-meeting:checked').val() ) {
						isValid = true;
					} else {
						isValid = false;
					}
				}

			}
		});

		if (isValid) {
			form.removeClass('is-invalid').addClass('is-valid');
		} else {
			form.removeClass('is-valid').addClass('is-invalid');
		}
	}

	function _checkFormValidationStatus(form){

		var isValid = $(form).hasClass('is-valid');

		if (!isValid) {

			// set focus on first invalid input
			$(form).find('input, textarea').each(function(index, item){

				if (
					item.required && !$(item).hasClass('is-valid') &&
						(
							item.type === 'text' ||
							item.type === 'email' ||
							item.type === 'url' ||
							item.type === 'textarea'
						)
					) {
					$(item).focus();
					return false;
				}

				// specific validation for radio inputs
				if (item.required && item.type === 'radio') {

					if ( $(item).hasClass('form-input-meeting') ) {

						if( $('.form-input-meeting:checked').val() ) {
							isValid = true;
						} else {
							$(item).focus();
							return false;
						}
					}
				}

			});
		}

		return isValid;
	}

	function _enableLoadingState(form){

		var $form = $(form);

		// add loading flag
		$form.addClass('is-loading');

		// disable all inputs (except hidden)
		$form.find('input[type!="hidden"], textarea').prop('disabled', true);

		// change submit button label
		var $submitButton = $form.find('.button');
		$submitButton.attr('data-default-value', $submitButton.val());
		$submitButton.val('Please wait...');
	}

	function _disableLoadingState(form){

		var $form = form ? $(form) : $('form.is-loading');

		// enable all inputs
		$form.find('input, textarea').prop('disabled', false);

		// reset submit button label
		var $submitButton = $form.find('.button');
		$submitButton.val( $submitButton.attr('data-default-value') );

		// remove loading flag
		$form.removeClass('is-loading');
	}

	function _isFormLoading(form){
		return $(form).hasClass('is-loading');
	}

	function _resetForm(form){

		var $form = form ? $(form) : $('form.is-loading');

		// Reset inputs (except hidden)
		$form.find('input[type!="hidden"], textarea').val('').prop('checked', false).removeClass('has-focus had-focus is-valid is-invalid');

		$('.submission-check').removeClass('is-active');
	}

	function _isEmail(email){ return /^([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22))*\x40([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d))*$/.test( email ); }

	function _isUrl(url){ return /(http|ftp|https):\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-])?/.test( url ); }

	function _handleTextInputChange(event){

		var input = $(event.currentTarget),
			value = input.val();

		if (value.length >= 2) {
			_flagValid(input);
		}
		else {
			_flagInvalid(input);
		}
	}

	function _handleEmailInputChange(event){

		var input = $(event.currentTarget),
			value = input.val();

		if (_isEmail(value)) {
			_flagValid(input);
		}
		else {
			_flagInvalid(input);
		}
	}

	function _handleUrlInputChange(event){

		var input = $(event.currentTarget),
			value = input.val();

		if (_isUrl(value)) {
			_flagValid(input);
		}
		else {
			_flagInvalid(input);
		}
	}

	function _handleTextareaInputChange(event){

		var input = $(event.currentTarget),
			value = input.val();

		if ( value.length >= 5 ) {
			_flagValid(input);
		}
		else {
			_flagInvalid(input);
		}
	}

	function _handleRadioInputChange(event){

		var input = $(event.currentTarget),
			value = input.val();

		if ( value ) {
			_flagValid(input);
		}
		else {
			_flagInvalid(input);
		}
	}

	function _handleInputFocus(event){

		var $input = $(event.currentTarget);
		$input.removeClass('had-focus').addClass('has-focus');
	}

	function _handleInputBlur(event){

		var $input = $(event.currentTarget);
		$input.removeClass('has-focus').addClass('had-focus');

		if ($input[0].type === 'text' || $input[0].type === 'email') {
			_handleRadioInputChange(event);
		}
	}

	function _handleFormSubmit(event){

		event.preventDefault();

		var $form = $(event.currentTarget);

		// stop second submission if first is still running
		if (_isFormLoading($form)) { return false; }

		// check form validation before posting
		if (_checkFormValidationStatus($form) ) {

			_enableLoadingState($form);

			var formData = {
				a1: $form.find('.form-input-fname').val(),
				a2: $form.find('.form-input-email').val(),
				a3: $form.find('.form-input-skype').val(),
				a4: $form.find('.form-input-phone').val(),
				a5: $form.find('.form-input-website').val(),
				a6: $form.find('.form-input-goals').val(),
				a7: $form.find('.form-input-actions').val(),
				a8: $form.find('.form-input-meeting:checked').val(),
				b1: window.sessionStorage.getItem('inflow-id'),
				b2: window.sessionStorage.getItem('inflow-ref'),
				b3: window.sessionStorage.getItem('inflow-path'),
				b4: window.localStorage.getItem('inflow-back'),
				c1: $form.find('.form-input-profile').val(),
				c2: 'true'
			};

			// Tag user on Fullstory
			if (window.FS) {
				FS.identify(window.sessionStorage.getItem('inflow-id'), {
					displayName: $form.find('.form-input-fname').val(),
					email: $form.find('.form-input-email').val(),
					inflowId: window.sessionStorage.getItem('inflow-id'),
					inflowRef: window.sessionStorage.getItem('inflow-ref'),
					inflowPath: window.sessionStorage.getItem('inflow-path'),
					inflowBack: window.sessionStorage.getItem('inflow-back')
				});
			}

			app.Model.subscribe(app.Model.events.contactSentLoaded, _handleContactSentLoaded);
			app.Model.subscribe(app.Model.events.contactSentLoadError, _handleContactSentLoadError);
			app.Model.sendContact(formData);

		} else {
			// do nothing
			// console.warn('-- form is not valid');
		}

		// TODO: check if form / event.currentTarget is .form-inflow (for now just assume so)
	}

	function _handleContactSentLoaded(event, data) {

		app.Model.unsubscribe(app.Model.events.contactSentLoaded);

		// check data.result
		if (data) {
			if (data.result === 'success') {

				app.Overlay.openContactSent(true);

				_resetForm();

				_disableLoadingState();

			} else {
				//data.result === 'error'

				app.Overlay.openContactSent(false);

				_disableLoadingState();
			}
		}

	}

	function _handleContactSentLoadError() {

		app.Model.unsubscribe(app.Model.events.contactSentLoadError);

		app.Overlay.openContactSent(false);

		_disableLoadingState();
	}

	return app.Forms;


})(window.JPescadaApp);