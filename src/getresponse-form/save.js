/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import { useBlockProps } from '@wordpress/block-editor';

/**
 * The save function defines the way in which the different attributes should
 * be combined into the final markup, which is then serialized by the block
 * editor into `post_content`.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#save
 *
 * @param {Object} props - Props for the block.
 * @return {Element} Element to render.
 */
export default function save({ attributes }) {
	// Extracting attributes for use in the block
	const { uniqueId, campaignToken, inputLabel, buttonLabel, destinationUrl, termsAndConditionsText, hasRowAlign, hasDarkTheme, recaptchaKey } = attributes;
	let inputId = 'alone-input-email_' + uniqueId;
	let checkboxId = 'terms-conditions_' + uniqueId;
	let recaptchaScriptUrl = 'https://www.google.com/recaptcha/api.js?render=' + recaptchaKey;
	

	return (
		<div {...useBlockProps.save()}>
			<form class="lead-mail-form" data-rowalign={hasRowAlign} data-darktheme={hasDarkTheme} action="https://app.getresponse.com/add_subscriber.html" accept-charset="utf-8" method="post" id={uniqueId}>
				<div class="form-group form-group__first">
					{/* Email input field (required) */}
					<div class="form-field form-field__email alone-input-email hidden-label__field">
						<label for={inputId} style={{color: attributes.inputLabelColor}}>{inputLabel}</label>
						<input type="text" name="email" placeholder={inputLabel} id={inputId} autocomplete="email" style={{backgroundColor: attributes.inputBackgroundColor,color: attributes.inputTextColor, borderColor: attributes.inputBorderColor}}/>
						<div class="sr-only" aria-hidden="true">
							<label for={`${inputId}-honeypot`}>Deja este campo vacío:</label>
							<input id={`${inputId}-honeypot`} type="text" name="user_comment" tabindex="-1" autocomplete="off"/>
						</div>
					</div>
					<div class="form-field form-field__hidden-fields">
						<input name="custom_url_seguimiento" type="text" />
						{/* Campaign token field */}
						<input type="hidden" name="campaign_token" value={campaignToken} />
						{/* Conditional rendering based on the preventRedirect attribute */}
						<input type="hidden" name="thankyou_url" value={destinationUrl} />	
						<input type="hidden" name="start_day" value="0" />
						<input type="hidden" name="start_time" id="start_time"/>
                       
					</div>
					{/* Submit button */}
					<div class="form-field form-field__terms-conditions">
						<input type="checkbox" class="dahlia-checkbox-input" id={checkboxId} name="terms-and-conditions" required style={{backgroundColor: attributes.inputBackgroundColor,color: attributes.inputTextColor, borderColor: attributes.inputBorderColor}}/>
						<label class="dahlia-checkbox-label" for={checkboxId} style={{color: attributes.inputLabelColor}}>
							<span
      class="dahlia-checkbox-box"
      aria-hidden="true"
      style={{ backgroundColor: attributes.inputBackgroundColor, borderColor: attributes.inputBorderColor }}
    >
      <span
        class="dahlia-tick"
        style={{ borderColor: attributes.inputTextColor }}
      />
    </span>
							<span class="dahlia-checkbox-text">{termsAndConditionsText}</span>
						</label>
					</div>
					<div class="form-field form-field__submit-button">
						<input class="g-recaptcha" data-callback='onSubmit' data-action='submit' data-id={uniqueId} data-sitekey={recaptchaKey} type="button" value={buttonLabel || 'Enviar'} style={{backgroundColor: attributes.buttonBackgroundColor,color: attributes.buttonTextColor, borderColor: attributes.buttonBorderColor}}/>
					</div>
				</div>
				<div class="form-error-region" aria-live="assertive" aria-atomic="true" style={{color: attributes.inputLabelColor}}></div>
			</form>
			<script src={recaptchaScriptUrl}></script>
		</div>

	);
}