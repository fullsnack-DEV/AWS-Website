import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  Button,
  FlatList,
} from 'react-native';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import PATH from "../../../Constants/ImagePath"
import strings from "../../../Constants/String"
// import constants from '../../../config/constants';

import TCButton from '../../../components/TCButton';
import styles from "./style"
// const {strings, colors, fonts, urls, PATH} = constants;

function TotalTeamsScreen({navigation, route}) {
  return (
    <View style={styles.mainContainer}>
      <Image style={styles.background} source={PATH.orangeLayer} />
      <Image style={styles.background} source={PATH.bgImage} />

      <View style={styles.sectionStyle}>
        <Image source={PATH.groupIcon} style={styles.groupsImg} />
        <Text style={styles.LocationText}>
          <Text style={styles.foundText}> We found </Text>
          <Text style={styles.LocationText}>
            {route.params.totalTeams}
          </Text>{' '}
          <Text style={styles.foundText}>teams in </Text>
          {route.params.city}, {route.params.state}
        </Text>
      </View>
      <TCButton
        title={strings.continueCapTitle}
        extraStyle={{position: 'absolute', bottom: hp('7%')}}
        onPress={() =>
          navigation.navigate('ChooseSportsScreen', {
            teamData: route.params.teamData,
            city: route.params.city,
            state: route.params.state,
            country: route.params.country,
          })
        }
      />
    </View>
  );
}


export default TotalTeamsScreen;
