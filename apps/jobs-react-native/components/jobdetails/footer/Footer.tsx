import { Image, Linking, Text, TouchableOpacity, View } from 'react-native';

import { icons } from '../../../constants';
import styles from './footer.style';

interface FooterProps {
  url: string;
}

const Footer = ({ url }: FooterProps) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.likeBtn}>
        <Image
          source={icons.heartOutline}
          resizeMode="contain"
          style={styles.likeBtnImage}
        />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.applyBtn}
        onPress={async () => await Linking.openURL(url)}
      >
        <Text style={styles.applyBtnText}>Apply for Job</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Footer;
