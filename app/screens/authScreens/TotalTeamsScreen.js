import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
} from 'react-native';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import colors from '../../Constants/Colors'
import fonts from '../../Constants/Fonts'
import images from '../../Constants/ImagePath';
import strings from '../../Constants/String';
import TCButton from '../../components/TCButton';

export default function TotalTeamsScreen({ navigation, route }) {
  return (
    <View style={ styles.mainContainer }>
      <Image style={ styles.background } source={ images.orangeLayer } />
      <Image style={ styles.background } source={ images.bgImage } />

      <View style={ styles.sectionStyle }>
        <Image source={ images.groupIcon } style={ styles.groupsImg } />
        <Text style={ styles.LocationText }>
          <Text style={ styles.foundText }> We found </Text>
          <Text style={ styles.LocationText }>
            {route.params.totalTeams}
          </Text>
          <Text style={ styles.foundText }> teams in </Text>
          <Text style={ styles.LocationText }>{route.params.city}, {route.params.state}</Text>
        </Text>
      </View>
      <TCButton
        title={ strings.continueCapTitle }
        extraStyle={ { position: 'absolute', bottom: hp('7%') } }
        onPress={ () => navigation.navigate('ChooseSportsScreen', {
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

const styles = StyleSheet.create({
  LocationText: {
    color: colors.whiteColor,
    fontFamily: fonts.RBold,
    fontSize: wp('6.5%'),
    marginTop: 20,
    textAlign: 'center',
    width: wp('60%'),
  },
  background: {
    height: '100%',
    position: 'absolute',
    resizeMode: 'stretch',
    width: '100%',
  },
  foundText: {
    color: colors.whiteColor,
    fontFamily: fonts.RRegular,
    fontSize: wp('6.5%'),
  },
  groupsImg: {
    height: 60,
    resizeMode: 'contain',

    width: 60,
  },

  mainContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  sectionStyle: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
