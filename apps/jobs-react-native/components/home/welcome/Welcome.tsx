import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  FlatList,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

import { icons, SIZES } from '../../../constants';
import styles from './welcome.style';

const jobTypes = ['Full-time', 'Part-time', 'Contractor/Freelance'] as const;

interface WelcomeProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  handleSearch: () => void;
}

const Welcome = ({
  searchQuery,
  setSearchQuery,
  handleSearch
}: WelcomeProps) => {
  const router = useRouter();
  const [activeJobType, setActiveJobType] = useState<string>('Full-time');

  return (
    <View>
      <View style={styles.container}>
        <Text style={styles.userName}>Hello Nejc</Text>
        <Text style={styles.welcomeMessage}>Find your perfect job!</Text>
      </View>
      <View style={styles.searchContainer}>
        <View style={styles.searchWrapper}>
          <TextInput
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={(text) => setSearchQuery(text)}
            placeholder="Search for jobs..."
            placeholderTextColor="gray"
          />
        </View>

        <TouchableOpacity style={styles.searchBtn} onPress={handleSearch}>
          <Image
            source={icons.search}
            resizeMode="contain"
            style={styles.searchBtnImage}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.tabsContainer}>
        <FlatList
          data={[...jobTypes]}
          keyExtractor={(item) => item}
          contentContainerStyle={{ columnGap: SIZES.small }}
          horizontal
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.tab(activeJobType, item)}
              onPress={() => {
                setActiveJobType(item);
                router.push(`/search/${item}`);
              }}
            >
              <Text style={styles.tabText(activeJobType, item)}>{item}</Text>
            </TouchableOpacity>
          )}
        />
      </View>
    </View>
  );
};

export default Welcome;
