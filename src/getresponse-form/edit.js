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
import { getReadableTextColor } from '../utils/colors';

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
	const { campaignToken, inputLabel, buttonLabel, destinationUrl, termsAndConditionsText, hasRowAlign, RowAlign, hasDarkTheme, recaptchaKey } = attributes;

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
	const onChangeDarkTheme = (newDarkTheme) => {
		setAttributes({
			hasDarkTheme: newDarkTheme,
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

	return (
		<div {...useBlockProps()}>
			
			<InspectorControls>
				<PanelColorSettings
			title={__("Colors", "getresponse-form-block")}
			initialOpen={true}
			colorSettings={[
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
							label={__("Color", "getresponse-form-block")}
							help={
								hasDarkTheme
									? 'Dark color'
									: 'Light color'
							}
							checked={hasDarkTheme}
							onChange={() => setAttributes({ hasDarkTheme: !hasDarkTheme })}
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
			<div class="lead-mail-form" data-rowalign={hasRowAlign} data-darktheme={hasDarkTheme} id={uniqueId}>
				<div class="form-group form-group__first">
					{/* Email input field (required) */}
					<div class="form-field form-field__email alone-input-email hidden-label__field">
						{inputLabel}:
						<input style={{backgroundColor: attributes.inputBackgroundColor,color: attributes.inputTextColor, borderColor: attributes.inputBorderColor}} type="text" name="email" autocomplete="email"/>
					</div>

					{/* Submit button */}
					<div class="form-field form-field__terms-conditions">
						▢ {termsAndConditionsText}
					</div>
					<div class="form-field form-field__submit-button">
						<input style={{backgroundColor: attributes.buttonBackgroundColor,color: attributes.buttonTextColor, borderColor: attributes.buttonBorderColor}} class="g-recaptcha" data-callback='onSubmit' data-action='submit' data-id={uniqueId} data-sitekey={recaptchaKey} type="submit" value={buttonLabel || 'Enviar'} />
					</div>
				</div>
			</div>

		</div>
	);
}
