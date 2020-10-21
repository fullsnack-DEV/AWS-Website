import React from 'react';
import {

  View,
  Text,
  Image,

} from 'react-native';

import {

  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import images from '../../../Constants/ImagePath';
import strings from '../../../Constants/String';
import TCButton from '../../../components/TCButton';
import styles from './style';

function TotalTeamsScreen({ navigation, route }) {
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

export default TotalTeamsScreen;
