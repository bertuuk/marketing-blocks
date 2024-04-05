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
	const { uniqueId, campaignToken, inputLabel, buttonLabel, destinationUrl, termsAndConditionsText } = attributes;
	let inputId = 'alone-input-email_' + uniqueId;
	let checkboxId = 'terms-conditions_' + uniqueId;

	return (
		<div {...useBlockProps.save()}>
			<form class="lead-mail-form" action="https://app.getresponse.com/add_subscriber.html" accept-charset="utf-8" method="post" id={uniqueId}>
				<div class="form-group form-group__first">
					{/* Email input field (required) */}
					<div class="form-field form-field__email alone-input-email hidden-label__field">
						<label for={inputId}>{inputLabel}:</label>
						<input type="text" name="email" placeholder={inputLabel} id={inputId} />
					</div>
					<div class="form-field form-field__hidden-fields">
						{/* Campaign token field */}
						<input type="hidden" name="campaign_token" value={campaignToken} />
						{/* Conditional rendering based on the preventRedirect attribute */}

						<input type="hidden" name="thankyou_url" value={destinationUrl} />
					</div>
					{/* Submit button */}
					<div class="form-field form-field__terms-conditions">
						<input type="checkbox" id={checkboxId} name="terms-and-conditions" required />
						<label for={checkboxId}>{termsAndConditionsText}</label>
					</div>
					<div class="form-field form-field__submit-button">
						<input class="g-recaptcha" data-callback='onSubmit' data-action='submit' data-id={uniqueId} data-sitekey="6LcFAcMUAAAAAJLFEF2PLqrNTh88qBoWzBQbJ4dP" type="submit" value={buttonLabel || 'Enviar'} />
					</div>
				</div>
			</form>
		</div>

	);
}