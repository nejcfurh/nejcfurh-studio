import { StyleSheet, type ImageStyle, type ViewStyle } from 'react-native';

import { COLORS, SIZES } from '../../../constants';

const styles = {
  btnContainer: {
    width: 40,
    height: 40,
    backgroundColor: COLORS.white,
    borderRadius: SIZES.small / 1.25,
    justifyContent: 'center',
    alignItems: 'center',
  } as ViewStyle,
  btnImg: (dimension: string): ImageStyle => ({
    width: dimension as unknown as number,
    height: dimension as unknown as number,
    borderRadius: SIZES.small / 1.25,
  }),
};

export default styles;
