import React from 'react';
import {View, Text, Image, TouchableOpacity} from 'react-native';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import PATH from '../../../../../Constants/ImagePath';
import strings from '../../../../../Constants/String';

import TCButton from '../../../../../components/TCButton';
import styles from './style';

function TeamCreatedScreen({navigation, route}) {
  return (
    <View style={styles.mainContainer}>
      <Image style={styles.background} source={PATH.orangeLayer} />
      <Image style={styles.background} source={PATH.bgImage} />
      <TouchableOpacity onPress={() => navigation.navigate('AccountScreen')}>
        <Image
          source={PATH.backArrow}
          style={{
            marginTop: 45,
            marginLeft: 20,
            height: 20,
            width: 20,
            resizeMode: 'contain',
          }}
        />
      </TouchableOpacity>
      <View style={styles.sectionStyle}>
        <Image source={PATH.group_ph} style={styles.groupsImg} />

        <Text style={styles.LocationText}>
          <Text style={styles.foundText}>
            New Team {route.params.groupName} has been created.
          </Text>
        </Text>
        <TouchableOpacity style={styles.goToProfileButton}>
          <Text style={styles.goToProfileTitle}>Switch to Team Account</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default TeamCreatedScreen;
