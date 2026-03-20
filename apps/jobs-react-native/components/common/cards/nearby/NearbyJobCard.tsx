import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';

import type { Job } from '../../../../types/job';
import { checkImageURL } from '../../../../utils/checkImageURL';
import styles from './nearbyjobcard.style';

interface NearbyJobCardProps {
  job: Job;
  handleNavigate: () => void;
}

const NearbyJobCard = ({ job, handleNavigate }: NearbyJobCardProps) => {
  return (
    <TouchableOpacity style={styles.container} onPress={handleNavigate}>
      <TouchableOpacity style={styles.logoContainer}>
        <Image
          source={{
            uri: checkImageURL(job.employer_logo)
              ? job.employer_logo!
              : 'https://t4.ftcdn.net/jpg/05/05/61/73/360_F_505617309_NN1CW7diNmGXJfMicpY9eXHKV4sqzO5H.jpg'
          }}
          resizeMode="contain"
          style={styles.logoImage}
        />
      </TouchableOpacity>
      <View style={styles.textContainer}>
        <Text style={styles.jobName} numberOfLines={1}>
          {job.job_title}
        </Text>
        <Text style={styles.jobType} numberOfLines={1}>
          {job.job_employment_type}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default NearbyJobCard;
