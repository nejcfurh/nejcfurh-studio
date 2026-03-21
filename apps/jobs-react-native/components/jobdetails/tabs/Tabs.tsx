import React from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';

import { SIZES } from '../../../constants';
import styles from './tabs.style';

interface TabButtonProps {
  name: string;
  activeTab: string;
  onHandleSearchType: () => void;
}

const TabButton = ({ name, activeTab, onHandleSearchType }: TabButtonProps) => (
  <TouchableOpacity
    style={styles.btn(name, activeTab)}
    onPress={onHandleSearchType}
  >
    <Text style={styles.btnText(name, activeTab)}>{name}</Text>
  </TouchableOpacity>
);

interface TabsProps {
  tabs: string[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Tabs = ({ tabs, activeTab, setActiveTab }: TabsProps) => {
  return (
    <View style={styles.container}>
      <FlatList
        data={tabs}
        renderItem={({ item }) => (
          <TabButton
            name={item}
            activeTab={activeTab}
            onHandleSearchType={() => setActiveTab(item)}
          />
        )}
        horizontal
        showsHorizontalScrollIndicator
        keyExtractor={(item) => item}
        contentContainerStyle={{ columnGap: SIZES.small / 2 }}
      />
    </View>
  );
};

export default Tabs;
