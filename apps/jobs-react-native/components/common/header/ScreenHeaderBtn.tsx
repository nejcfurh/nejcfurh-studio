import React from 'react';
import {
  Image,
  TouchableOpacity,
  type ImageSourcePropType
} from 'react-native';

import styles from './screenheader.style';

interface ScreenHeaderBtnProps {
  iconUrl: ImageSourcePropType;
  dimension: string;
  handlePress?: () => void;
}

const ScreenHeaderBtn = ({
  iconUrl,
  dimension,
  handlePress
}: ScreenHeaderBtnProps) => {
  return (
    <TouchableOpacity style={styles.btnContainer} onPress={handlePress}>
      <Image
        source={iconUrl}
        resizeMode="cover"
        style={styles.btnImg(dimension)}
      />
    </TouchableOpacity>
  );
};

export default ScreenHeaderBtn;
