import React, {useState} from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
} from 'react-native';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import colors from '../../Constants/Colors';
import constants from '../../config/constants';
import {ScrollView} from 'react-native-gesture-handler';
const {PATH} = constants;

export default function WriteCommentScreen({navigation}) {
  const [commentTxt, setCommentText] = useState('');

  return (
    <KeyboardAvoidingView style={{flex: 1}} behavior={'padding'}>
      <SafeAreaView style={styles.mainContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <View style={{width: wp('20%')}}>
            <Image source={PATH.backArrow} style={styles.backImage} />
          </View>
        </TouchableOpacity>
        <Text style={styles.headingTitle}>Write Comments</Text>
        <View style={{width: wp('20%')}} />
      </SafeAreaView>
      <View style={styles.topSepratorStyle}></View>
      <ScrollView style={{flex: 1}}>
        {/* <View style={styles.bottomSperateLine}></View> */}
      </ScrollView>
      <SafeAreaView style={{flexDirection: 'row', marginBottom: 10}}>
        <View style={{width: wp('15%')}}>
          <Image style={styles.background} source={PATH.profilePlaceHolder} />
        </View>
        <TextInput
          placeholder={'Enter Comment'}
          placeholderTextColor={colors.darkGrayColor}
          multiline={true}
          onChangeText={(text) => setCommentText(text)}
          style={{
            width: wp('67%'),
            marginHorizontal: '1%',
            padding: 25,
            maxHeight: 60,
            borderWidth: 1,
            paddingLeft: 8,
            borderColor: colors.disableColor,
            alignSelf: 'center',
          }}></TextInput>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            width: wp('15%'),
          }}>
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
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: wp('1%'),
    marginBottom: hp('1.5%'),
  },
  backImage: {
    height: hp('2.5%'),
    width: wp('4%'),
    marginLeft: 10,
  },
  cancelTxt: {fontSize: 18},
  headingTitle: {
    fontSize: 18,
    fontWeight: '700',
    width: wp('59%'),
    textAlign: 'center',
  },
  sperateLine: {
    borderWidth: 0.5,
    borderColor: colors.disableColor,
  },
  topSepratorStyle: {
    borderWidth: 0.5,
    borderColor: colors.disableColor,
  },
  bottomSperateLine: {
    borderWidth: 0.5,
    borderColor: colors.disableColor,
  },
  background: {
    height: hp('6%'),
    width: hp('6%'),
    resizeMode: 'stretch',
    alignSelf: 'center',
  },
});
