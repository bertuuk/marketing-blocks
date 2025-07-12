/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-i18n/
 */
import { __ } from '@wordpress/i18n';

/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import { useBlockProps, InspectorControls, PanelColorSettings } from '@wordpress/block-editor';

import { useInstanceId } from '@wordpress/compose';
import { useEffect } from '@wordpress/element';

/**
 * Importing additional components for the InspectorControls
 */
import { PanelBody, PanelRow, TextControl, ToggleControl } from '@wordpress/components';

/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * Those files can contain any CSS code that gets applied to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import './editor.scss';

/**
 * Imports utility function to calculate readable text color (black or white)
 * based on background for WCAG contrast compliance.
 *
 * @see ../utils/colors.js
 */
import { getReadableTextColor, isDarkColor } from '../utils/colors';

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
 *
 * @param {Object} props - Props for the block.
 * @return {Element} Element to render.
 */
export default function Edit({ attributes, setAttributes }) {
	const instanceId = useInstanceId(Edit);
	const { uniqueId } = 'attributes';

	// Genera un número aleatorio entre 0 y 1000000
	const randomNumber = Math.floor(Math.random() * 1000000);

	useEffect(() => {
		if (!uniqueId) {
			// Asigna un ID único basado en uniqueInstanceId
			setAttributes({ uniqueId: `getresponse-form-${instanceId}-${randomNumber}` });
		}
	}, [uniqueId, setAttributes]);
	// Extracting attributes and setAttributes function from props
	// preventRedirect, confirmationMessage, destinationUrl		
	const { campaignToken, inputLabel, buttonLabel, destinationUrl, termsAndConditionsText, hasRowAlign, RowAlign, hasLabel, recaptchaKey, isDarkInput } = attributes;

	// Handler functions for attribute changes
	const onChangeCampaignToken = (value) => {
		setAttributes({
			campaignToken: value === undefined ? 'none' : value,
		});
	};
	const onChangeInputLabel = (newInputLabel) => {
		setAttributes({
			inputLabel: newInputLabel,
		});
	};

	const onChangeButtonLabel = (newButtonLabel) => {
		setAttributes({
			buttonLabel: newButtonLabel,
		});
	};

	const onChangeDestinationUrl = (newDestinationUrl) => {
		setAttributes({
			destinationUrl: newDestinationUrl,
		});
	};
	const onChangeTermsAndConditionsText = (newTermsAndConditionsText) => {
		setAttributes({
			termsAndConditionsText: newTermsAndConditionsText,
		});
	};
	const onChangeRowAlign = (newRowAlign) => {
		setAttributes({
			hasRowAlign: newRowAlign,
		});
	};
	const onChangeLabel = (newLabel) => {
		setAttributes({
			hasLabel: newLabel,
		});
	};
	const onChangeRecaptchaKey = (newRecaptchaKey) => {
		setAttributes({
			recaptchaKey: newRecaptchaKey,
		});
	};

	/**
	 * useEffect to calculate and save inputTextColor and buttonTextColor
	 * whenever their background colors change.
	 */
	useEffect(() => {
		const newInputTextColor = getReadableTextColor(attributes.inputBackgroundColor);
		if (newInputTextColor !== attributes.inputTextColor) {
			setAttributes({ inputTextColor: newInputTextColor });
		}
	}, [attributes.inputBackgroundColor]);

	useEffect(() => {
		const newButtonTextColor = getReadableTextColor(attributes.buttonBackgroundColor);
		if (newButtonTextColor !== attributes.buttonTextColor) {
			setAttributes({ buttonTextColor: newButtonTextColor });
		}
	}, [attributes.buttonBackgroundColor]);
	useEffect(() => {
		const isDark = isDarkColor(attributes.inputTextColor);
		if (attributes.isDarkInput !== isDark) {
			setAttributes({ isDarkInput: isDark });
		}
	}, [attributes.inputTextColor]);

	const inputId = 'alone-input-email_' + uniqueId;
	const checkboxId = 'terms-conditions_' + uniqueId;
	const inputPlaceholder = !hasLabel ? inputLabel : undefined;
	const inputTextClass = isDarkInput ? 'is-dark' : 'is-light';

	return (
		<div {...useBlockProps()}>

			<InspectorControls>
				<PanelColorSettings
					title={__("Colors", "getresponse-form-block")}
					initialOpen={true}
					colorSettings={[
						{
							label: __("Input Label", "getresponse-form-block"),
							value: attributes.inputLabelColor,
							onChange: (color) => setAttributes({ inputLabelColor: color }),

						},
						{
							label: __("Input Background", "getresponse-form-block"),
							value: attributes.inputBackgroundColor,
							onChange: (color) => setAttributes({ inputBackgroundColor: color }),

						},
						{
							label: __("Input Border", "getresponse-form-block"),
							value: attributes.inputBorderColor,
							onChange: (color) => setAttributes({ inputBorderColor: color }),

						},
						{
							label: __("Button Background", "getresponse-form-block"),
							value: attributes.buttonBackgroundColor,
							onChange: (color) => setAttributes({ buttonBackgroundColor: color }),

						},
						{
							label: __("Button Border", "getresponse-form-block"),
							value: attributes.buttonBorderColor,
							onChange: (color) => setAttributes({ buttonBorderColor: color }),

						},
					]}
				/>
				<PanelBody
					title={__("Configuración del Bloque", "getresponse-form-block")}
					initialOpen={true}
				>

					<PanelRow>
						<ToggleControl
							label={__("Alineación", "getresponse-form-block")}
							help={
								hasRowAlign
									? 'Has row align.'
									: 'Has column align.'
							}
							checked={hasRowAlign}
							onChange={() => setAttributes({ hasRowAlign: !hasRowAlign })}
						/>
					</PanelRow>
					<PanelRow>
						<ToggleControl
							label={__("Label", "getresponse-form-block")}
							help={
								hasLabel
									? 'Yes'
									: 'No'
							}
							checked={hasLabel}
							onChange={() => setAttributes({ hasLabel: !hasLabel })}
						/>
					</PanelRow>
					<PanelRow>
						<TextControl
							label={__("Texto del input", "getresponse-form-block")}
							value={inputLabel}
							onChange={onChangeInputLabel}
							__nextHasNoMarginBottom={true}
						/>
					</PanelRow>
					<PanelRow>
						<TextControl
							label={__("Texto del botón", "getresponse-form-block")}
							value={buttonLabel}
							onChange={onChangeButtonLabel}
							__nextHasNoMarginBottom={true}
						/>
					</PanelRow>
				</PanelBody>
				<PanelBody
					title={__("Confirmación", "getresponse-form-block")}
					initialOpen={false}
				>
					<PanelRow>
						<TextControl
							label={__("Token de Campaña", "getresponse-form-block")}
							value={campaignToken}
							onChange={onChangeCampaignToken}
							__nextHasNoMarginBottom={true}
						/>
					</PanelRow>
					<PanelRow>
						<TextControl
							label={__("Términos y política de privacidad", "getresponse-form-block")}
							value={termsAndConditionsText}
							onChange={onChangeTermsAndConditionsText}
							__nextHasNoMarginBottom={true}
						/>
					</PanelRow>
					<PanelRow>
						<TextControl
							label={__("URL de destino", "getresponse-form-block")}
							value={destinationUrl}
							onChange={onChangeDestinationUrl}
							__nextHasNoMarginBottom={true}
						/>
					</PanelRow>
					<PanelRow>
						<TextControl
							label={__("Clave Recaptcha", "getresponse-form-block")}
							value={recaptchaKey}
							onChange={onChangeRecaptchaKey}
							__nextHasNoMarginBottom={true}
						/>
					</PanelRow>
				</PanelBody>
			</InspectorControls>
			<div className="lead-mail-form" data-rowalign={hasRowAlign} id={uniqueId}>
				<div className="form-group form-group__first">

					{hasLabel && (
						<div className="form-field form-field__email-label" data-label={hasLabel}>
							<label htmlFor={inputId} style={{ color: attributes.inputLabelColor }}>{inputLabel}</label>
						</div>
					)}

					<div className="form-field form-field__email alone-input-email" data-label={hasLabel}>
						<input type="text" id={inputId} name="email" autoComplete="email" className={`form-input ${inputTextClass}`} placeholder={inputPlaceholder} style={{ backgroundColor: attributes.inputBackgroundColor, color: attributes.inputTextColor, borderColor: attributes.inputBorderColor }} disabled/>
					</div>

					<div className="form-field form-field__terms-conditions">
						<input type="checkbox" className="dahlia-checkbox-input" id={checkboxId} name="terms-and-conditions" disabled style={{ backgroundColor: attributes.inputBackgroundColor, color: attributes.inputTextColor, borderColor: attributes.inputBorderColor }} />
						<label className="dahlia-checkbox-label" htmlFor={checkboxId} style={{ color: attributes.inputLabelColor }}>
							<span className="dahlia-checkbox-box" aria-hidden="true" style={{ backgroundColor: attributes.inputBackgroundColor, borderColor: attributes.inputBorderColor }}>
								<span className="dahlia-tick" style={{ borderColor: attributes.inputTextColor }} />
							</span>
							<span className="dahlia-checkbox-text">{termsAndConditionsText}</span>
						</label>
					</div>

					<div className="form-field form-field__submit-button">
						<input type="button" value={buttonLabel || 'Enviar'} className="g-recaptcha" data-callback="onSubmit" data-action="submit" data-id={uniqueId} data-sitekey={recaptchaKey} disabled style={{ backgroundColor: attributes.buttonBackgroundColor, color: attributes.buttonTextColor, borderColor: attributes.buttonBorderColor }} />
					</div>

				</div>
			</div>
		</div>
	);
}
