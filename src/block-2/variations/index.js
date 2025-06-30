/**
 * Registers a new block variation provided a unique name and an object defining its behavior.
 *
 * @see https://developer.wordpress.org/block-editor/packages/packages-blocks/#registerBlockVariation
 */



/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/packages/packages-i18n/
 */
import { __ } from '@wordpress/i18n';

wp.blocks.registerBlockVariation(
	'core/columns',
	{
		name: 'fancy-group',
		title: 'Fancy Group',
		attributes: {
			"align": "full",
			"verticalAlignment": null, "align": "full", "style": {
				"spacing": {
					"padding": {
						"top": "0",
						"bottom": "0",
						"left": "0",
						"right": "0"
					},
					"margin": {
						"top": "0",
						"bottom": "0"
					},
					"blockGap": {
						"top": "0",
						"left": "0"
					}
				}
			},
			"backgroundColor": "contrast", "layout": {
				"type": "flex",
				"flexWrap": "nowrap"
			}
		},

		innerBlocks: [
			['core/column', {
				width: "60%",
			}, [
					['core/image', {
						
					}],
				]],

			['core/column', {
				"style": {
					"spacing": {
						"padding": {
							"top": "var:preset|spacing|20",
							"bottom": "var:preset|spacing|20",
							"left": "var:preset|spacing|10",
							"right": "var:preset|spacing|10"
						}
					}
				}
			}, [
					['core/heading', {
						level:
							2, content: 'My Role',
						"style": {
							"elements": {
								"link": {
									"color": {
										"text": "var:preset|color|base-2"
									}
								}
							}
						},
						"textColor": "base-2"

					}],
					['core/paragraph', {
						placeholder: 'Describe your role',
						"style": {
							"elements": {
								"link": {
									"color": {
										"text": "var:preset|color|base-2"
									}
								}
							}
						},
						"textColor": "base-2"
					}
					],
					['core/buttons', {}, [
						['core/button', {
							"textColor": "base-2",
							"style": {
								"elements": {
									"link": {
										"color": {
											"text": "var:preset|color|base-2"
										}
									}
								}
							}
						}]
					]],
				]
			],
		],
	},
);

wp.blocks.registerBlockVariation(
	'core/list',
	{
		name: 'list-extended',
		title: "List Extended",
		icon: "",
		attributes:{
			providerNameSlug: 'list-extended',
			className: 'tarambana-list-extended',
			
			"style":{
				"spacing":{
					"blockGap":{
						"top":"2rem",
						"left":"2rem"
					}
				}
			}
		},
		innerBlocks: [
			['core/list-item', {
				"style":{
					"spacing":{
						"padding":{
							"bottom":"var:preset|spacing|30",
						}
					}
				}
			}],
			['core/list-item', {
				"style":{
					"spacing":{
						"padding":{
							"bottom":"var:preset|spacing|30",
						}
					}
				}
			}],
			['core/list-item', {
				"style":{
					"spacing":{
						"padding":{
							"bottom":"var:preset|spacing|30",
						}
					}
				}
			}]

		]
	}
)
