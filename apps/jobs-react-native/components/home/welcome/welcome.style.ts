import type { ImageStyle, TextStyle, ViewStyle } from 'react-native';

import { COLORS, FONT, SIZES } from '../../../constants';

const styles = {
  container: {
    width: '100%'
  } as ViewStyle,
  userName: {
    fontFamily: FONT.regular,
    fontSize: SIZES.large,
    color: COLORS.secondary
  } as TextStyle,
  welcomeMessage: {
    fontFamily: FONT.bold,
    fontSize: SIZES.xLarge,
    color: COLORS.primary,
    marginTop: 2
  } as TextStyle,
  searchContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: SIZES.large,
    height: 50
  } as ViewStyle,
  searchWrapper: {
    flex: 1,
    backgroundColor: COLORS.white,
    marginRight: SIZES.small,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: SIZES.medium,
    height: '100%'
  } as ViewStyle,
  searchInput: {
    fontFamily: FONT.regular,
    width: '100%',
    height: '100%',
    paddingHorizontal: SIZES.medium
  } as TextStyle,
  searchBtn: {
    width: 50,
    height: '100%',
    backgroundColor: COLORS.tertiary,
    borderRadius: SIZES.medium,
    justifyContent: 'center',
    alignItems: 'center'
  } as ViewStyle,
  searchBtnImage: {
    width: '50%',
    height: '50%',
    tintColor: COLORS.white
  } as ImageStyle,
  tabsContainer: {
    width: '100%',
    marginTop: SIZES.medium
  } as ViewStyle,
  tab: (activeJobType: string, item: string): ViewStyle => ({
    paddingVertical: SIZES.small / 2,
    paddingHorizontal: SIZES.small,
    borderRadius: SIZES.medium,
    borderWidth: 1,
    borderColor: activeJobType === item ? COLORS.secondary : COLORS.gray2
  }),
  tabText: (activeJobType: string, item: string): TextStyle => ({
    fontFamily: FONT.medium,
    color: activeJobType === item ? COLORS.secondary : COLORS.gray2
  })
};

export default styles;
