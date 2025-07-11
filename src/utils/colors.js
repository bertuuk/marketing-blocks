/**
 * tinycolor2 is a small library for color manipulation and conversion.
 * Used here to calculate readable text colors based on background for WCAG contrast.
 *
 * @see https://github.com/bgrins/TinyColor
 */
import tinycolor from 'tinycolor2';

/**
 * Decide text color (black or white) based on background for contrast ≥ 4.5
 * @param {string} bgColor - The background color in any CSS format
 * @returns {string} '#000000' or '#FFFFFF'
 */
export function getReadableTextColor(bgColor) {
  const black = tinycolor('#000');
  const white = tinycolor('#fff');
  const bg = tinycolor(bgColor);

  const contrastWithBlack = tinycolor.readability(bg, black);
  const contrastWithWhite = tinycolor.readability(bg, white);

  if (contrastWithBlack >= 4.5) {
    return '#000000';
  } else if (contrastWithWhite >= 4.5) {
    return '#FFFFFF';
  } else {
    // If neither meets 4.5, return the highest contrast anyway
    return contrastWithBlack > contrastWithWhite ? '#000000' : '#FFFFFF';
  }
}
