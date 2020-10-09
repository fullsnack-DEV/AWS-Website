import React, {useState, useContext} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import constants from '../../config/constants';
const {PATH} = constants;
import AuthContext from '../../auth/context';

export default function WritePostScreen({navigation}) {
  const authContext = useContext(AuthContext);
  const [searchText, setSearchText] = useState('');
  return (
    <View>
      <View style={styles.mainContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <View style={{flexDirection: 'row'}}>
            <Image source={PATH.backArrow} style={styles.backImage}></Image>
            <Text style={styles.cancelTxt}> Cancel</Text>
          </View>
        </TouchableOpacity>
        <Text style={styles.headingTitle}>Write Post</Text>
        <Text
          style={{
            fontSize: 18,
            color: searchText.length == 0 ? '#cccccc' : 'black',
          }}
          onPress={() =>
            searchText.length == 0
              ? console.log('disble')
              : navigation.navigate('FeedsScreen')
          }>
          Done
        </Text>
      </View>
      <View style={styles.sperateLine}></View>
      <View style={styles.userDetailView}>
        <Image
          style={styles.background}
          source={PATH.profilePlaceHolder}></Image>
        <View style={styles.userTxtView}>
          <Text style={styles.userTxt}>{authContext.user.full_name}</Text>
        </View>
      </View>
      <TextInput
        placeholder="What' going on?"
        placeholderTextColor="grey"
        onChangeText={(text) => setSearchText(text)}
        style={styles.textInputField}
        multiline={true}></TextInput>
      <View style={styles.bottomSperateLine}></View>
      <View style={styles.bottomImgView}>
        <TouchableOpacity
          onPress={() => {
            console.log('Pressed!');
          }}>
          <Image source={PATH.gallaryImage} style={styles.gallaryImage}></Image>
        </TouchableOpacity>
        <Image source={PATH.bagTick} style={styles.bagTick}></Image>
        <Image
          source={PATH.attatchmentGrey}
          style={styles.attatchmentImage}></Image>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: hp('5%'),
    marginLeft: wp('2%'),
    marginRight: wp('4%'),
    marginBottom: hp('2%'),
  },
  background: {
    height: hp('6%'),
    width: wp('13%'),
    resizeMode: 'stretch',
  },
  backImage: {
    height: hp('2.5%'),
    width: wp('4%'),
  },
  cancelTxt: {fontSize: 18},
  headingTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  sperateLine: {
    borderWidth: 0.5,
    borderColor: '#cccccc',
  },
  userDetailView: {
    margin: wp('3%'),
    flexDirection: 'row',
  },
  userTxtView: {
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  userTxt: {
    fontSize: 18,
    fontWeight: '700',
    marginLeft: wp('4%'),
  },
  textInputField: {
    width: wp('90%'),
    height: hp('20%'),
    justifyContent: 'center',
    alignSelf: 'center',
  },
  bottomSperateLine: {
    borderWidth: 0.5,
    borderColor: '#cccccc',
    marginTop: hp('50%'),
  },
  bottomImgView: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignSelf: 'flex-end',
    margin: wp('5%'),
  },
  gallaryImage: {
    height: hp('2.5%'),
    width: wp('6%'),
    right: wp('5%'),
  },
  bagTick: {
    height: hp('4%'),
    width: wp('8%'),
    bottom: hp('0.8%'),
    right: wp('2%'),
  },
  attatchmentImage: {
    height: hp('3%'),
    width: wp('6%'),
    bottom: hp('0%'),
  },
});
