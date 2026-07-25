export interface WeatherArtProps {
  /**
   * Instance-unique prefix for any ids the artwork references internally.
   * The same icon can render several times in the forecast row, so masks
   * cannot ship with the ids Meteocons exports.
   */
  uid: string;
}
