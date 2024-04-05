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
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';

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

	useEffect(() => {
        if (!uniqueId) {
            // Asigna un ID único basado en instanceId
            setAttributes({ uniqueId: `getresponse-form-${instanceId}` });
        }
    }, [uniqueId, setAttributes]);
    // Extracting attributes and setAttributes function from props
	// preventRedirect, confirmationMessage, destinationUrl		
    const { campaignToken, inputLabel, buttonLabel, destinationUrl, termsAndConditionsText } = attributes;

    // Handler functions for attribute changes
    const onChangeCampaignToken = (value) => {
        setAttributes( {
			campaignToken: value === undefined ? 'none' : value, 
		});
    };
	const onChangeInputLabel = (newInputLabel) => {
        setAttributes( {
			inputLabel: newInputLabel, 
		});
    };

	const onChangeButtonLabel = (newButtonLabel) => {
        setAttributes( {
			buttonLabel: newButtonLabel, 
		});
    };
	
	const onChangeDestinationUrl = (newDestinationUrl) => {
        setAttributes( {
			destinationUrl: newDestinationUrl, 
		});
    };
	const onChangeTermsAndConditionsText = (newTermsAndConditionsText) => {
        setAttributes( {
			termsAndConditionsText: newTermsAndConditionsText, 
		});
    };

    // Add similar handler functions for other attributes like buttonLabel, preventRedirect, etc.

    return (
		<div {...useBlockProps()}>
			<InspectorControls>
                <PanelBody 
					title={__("Configuración del Bloque", "getresponse-form-block")}
					initialOpen={true}
				>
					<PanelRow>
						<TextControl
							label={__("Token de Campaña", "getresponse-form-block")}
							value={ campaignToken }
							onChange={ onChangeCampaignToken }
						/>
					</PanelRow>
					<PanelRow>
						<TextControl
							label={__("Texto del input", "getresponse-form-block")}
							value={ inputLabel }
							onChange={ onChangeInputLabel }
						/>
					</PanelRow>
					<PanelRow>
						<TextControl
							label={__("Texto del botón", "getresponse-form-block")}
							value={ buttonLabel }
							onChange={ onChangeButtonLabel }
						/>
					</PanelRow>
				</PanelBody>
				<PanelBody 
					title={__("Confirmación", "getresponse-form-block")}
					initialOpen={false}
				>
				
					<PanelRow>
						<TextControl
							label={__("Términos y política de privacidad", "getresponse-form-block")}
							value={ termsAndConditionsText }
							onChange={ onChangeTermsAndConditionsText }
						/>
					</PanelRow>
					<PanelRow>
						<TextControl
							label={__("URL de destino", "getresponse-form-block")}
							value={ destinationUrl }
							onChange={ onChangeDestinationUrl }
						/>
					</PanelRow>
				</PanelBody>
            </InspectorControls>
			<p>Hello World { buttonLabel} and { campaignToken}  </p>
			
		</div>
    );
}
