import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import constants from '../../config/constants';
import Video from 'react-native-video';
const {PATH, colors, fonts} = constants;

export default function FullVideoScreen({
  navigation,
  route: { params: { url }},
}) {
    console.log('url :-', url);

  return (
    <View style={styles.mainContainerStyle}>
        <Video
            source={{uri: url}}
            style={styles.singleImageDisplayStyle}
            resizeMode={'cover'}
        />
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainerStyle: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center'
  },
  singleImageDisplayStyle: {
    height: hp('94%'),
    width: wp('94%'),
    backgroundColor: 'red'
  },
});
