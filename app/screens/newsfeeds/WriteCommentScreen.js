import React, {useState} from 'react';
import {View, Text, Image, TextInput, StyleSheet} from 'react-native';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import colors from '../../Constants/Colors';

import PATH from '../../Constants/ImagePath';
export default function WriteCommentScreen({navigation}) {
  const [commentTxt, setCommentText] = useState('');

  return (
    <View>
      <View style={styles.bottomSperateLine}></View>
      <View style={{flexDirection: 'row'}}>
        <Image
          style={styles.background}
          source={PATH.profilePlaceHolder}></Image>
        <TextInput
          onChangeText={(text) => setCommentText(text)}
          style={{width: '70%', marginLeft: '3%'}}></TextInput>
        <View style={{justifyContent: 'center', alignItems: 'center'}}>
          <Text
            style={{
              color: commentTxt.length == 0 ? '#cccccc' : 'black',
              fontSize: 18,
              fontWeight: '700',
            }}
            onPress={() =>
              commentTxt.length == 0
                ? console.log('disable')
                : navigation.goBack()
            }>
            Send
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sperateLine: {
    borderWidth: 0.5,
    borderColor: colors.disableColor,
  },

  bottomSperateLine: {
    borderWidth: 0.5,
    borderColor: colors.disableColor,
    marginTop: hp('80%'),
  },
  background: {
    height: hp('6%'),
    width: wp('13%'),
    resizeMode: 'stretch',
  },
});
