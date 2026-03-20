import type { ImageStyle, TextStyle, ViewStyle } from 'react-native';

import { COLORS, FONT, SHADOWS, SIZES } from '../../../../constants';
import type { Job } from '../../../../types/job';

const styles = {
  container: (selectedJob: string | undefined, item: Job): ViewStyle => ({
    width: 250,
    padding: SIZES.xLarge,
    backgroundColor: selectedJob === item.job_id ? COLORS.primary : '#FFF',
    borderRadius: SIZES.medium,
    justifyContent: 'space-between',
    ...SHADOWS.medium,
    shadowColor: COLORS.white,
  }),
  logoContainer: (selectedJob: string | undefined, item: Job): ViewStyle => ({
    width: 50,
    height: 50,
    backgroundColor: selectedJob === item.job_id ? '#FFF' : COLORS.white,
    borderRadius: SIZES.medium,
    justifyContent: 'center',
    alignItems: 'center',
  }),
  logoImage: {
    width: '70%',
    height: '70%',
  } as ImageStyle,
  companyName: {
    fontSize: SIZES.medium,
    fontFamily: FONT.regular,
    color: '#B3AEC6',
    marginTop: SIZES.small / 1.5,
  } as TextStyle,
  infoContainer: {
    marginTop: SIZES.large,
  } as ViewStyle,
  jobName: (selectedJob: string | undefined, item: Job): TextStyle => ({
    fontSize: SIZES.large,
    fontFamily: FONT.medium,
    color: selectedJob === item.job_id ? COLORS.white : COLORS.primary,
  }),
  location: {
    fontSize: SIZES.medium - 2,
    fontFamily: FONT.regular,
    color: '#B3AEC6',
  } as TextStyle,
};

export default styles;
