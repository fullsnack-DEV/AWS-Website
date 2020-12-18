import React, { useState } from 'react';
import {
  View, Text, Image, TouchableWithoutFeedback, StyleSheet,
} from 'react-native';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import { Tooltip } from 'react-native-elements';
import FastImage from 'react-native-fast-image';
import images from '../../Constants/ImagePath';
import * as Utility from '../../utils/index';
import TCButton from '../../components/TCButton';
import strings from '../../Constants/String';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';

export default function ChooseGenderScreen({ navigation }) {
  const [selected, setSelected] = useState(0);
  return (
    <View style={ styles.mainContainer }>
      <Image style={ styles.background } source={ images.orangeLayer } />
      <Image style={ styles.background } source={ images.bgImage } />

      <Text style={ styles.checkEmailText }>{strings.addGenderText}</Text>
      <Text style={ styles.resetText }>{strings.notDisplayGenderText}</Text>

      <Tooltip popover={ <Text style={ { color: colors.themeColor, fontSize: 14 } }>{strings.genderText}</Text> }
            backgroundColor={ colors.parrotColor }
            height={ hp('20%') }
            width={ wp('75%') }
            overlayColor={ 'transparent' }
            skipAndroidStatusBar={true}>
        <Text style={ styles.whyAskingText } >{strings.whyAskingGenderText}</Text>
      </Tooltip>

      <View style={ { marginTop: 40, marginLeft: 20 } }>
        <View style={ styles.radioButtonView }>
          <TouchableWithoutFeedback
          onPress={ () => {
            setSelected(0);
          } }>
            {selected === 0 ? (
              <FastImage source={ images.radioSelect } style={ styles.radioImage } />
            ) : (
              <FastImage
              source={ images.radioUnselect }
              style={ styles.unSelectRadioImage }
            />
            )}
          </TouchableWithoutFeedback>
          <Text style={ styles.radioText }>{strings.maleRadioText}</Text>
        </View>
        <View style={ styles.radioButtonView }>
          <TouchableWithoutFeedback
          onPress={ () => {
            setSelected(1);
          } }>
            {selected === 1 ? (
              <Image source={ images.radioSelect } style={ styles.radioImage } />
            ) : (
              <Image
              source={ images.radioUnselect }
              style={ styles.unSelectRadioImage }
            />
            )}
          </TouchableWithoutFeedback>
          <Text style={ styles.radioText }>{strings.femaleRadioText}</Text>
        </View>
        <View style={ styles.radioButtonView }>
          <TouchableWithoutFeedback
          onPress={ () => {
            setSelected(2);
          } }>
            {selected === 2 ? (
              <Image source={ images.radioSelect } style={ styles.radioImage } />
            ) : (
              <Image
              source={ images.radioUnselect }
              style={ styles.unSelectRadioImage }
            />
            )}
          </TouchableWithoutFeedback>
          <Text style={ styles.radioText }>{strings.otherRadioText}</Text>
        </View>
      </View>
      <TCButton
        title={ strings.continueCapTitle }
        onPress={ async () => {
          let userGender = {};
          const user = await Utility.getStorage('userInfo');
          if (selected === 0) {
            userGender = {
              ...user,
              gender: 'male',
            }
          } else if (selected === 1) {
            userGender = {
              ...user,
              gender: 'female',
            }
          } else if (selected === 2) {
            userGender = {
              ...user,
              gender: 'other',
            }
          }

          await Utility.setStorage('userInfo', userGender);
          navigation.navigate('ChooseLocationScreen');
        } }
        extraStyle={ { bottom: hp('4%'), position: 'absolute' } }
      />
    </View>
  );
}
const styles = StyleSheet.create({
  background: {
    height: '100%',
    position: 'absolute',
    resizeMode: 'stretch',
    width: '100%',
  },
  checkEmailText: {
    color: colors.whiteColor,
    fontFamily: fonts.RBold,
    fontSize: 28,
    marginLeft: 20,
    marginTop: wp('25%'),
    textAlign: 'left',

  },
  mainContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  radioButtonView: {
    flexDirection: 'row',
    marginLeft: 20,
    marginRight: 15,
    marginTop: 20,
  },
  radioImage: {
    alignSelf: 'center',
    height: 22,
    resizeMode: 'contain',
    width: 22,

  },
  radioText: {
    alignSelf: 'center',
    color: colors.whiteColor,
    fontFamily: fonts.RMedium,
    fontSize: 15,
    marginLeft: 15,
    marginRight: 15,
  },
  resetText: {
    color: colors.whiteColor,
    fontFamily: fonts.RRegular,
    fontSize: 16,
    marginLeft: 20,
    marginRight: 20,
    marginTop: 10,
    textAlign: 'left',

  },

  unSelectRadioImage: {
    alignSelf: 'center',
    height: 22,
    resizeMode: 'contain',
    tintColor: colors.whiteColor,
    width: 22,
  },
  whyAskingText: {
    color: colors.parrotColor,
    fontFamily: fonts.RRegular,
    fontSize: 14,
    marginLeft: 20,
    marginRight: 20,
    marginTop: 10,
    textAlign: 'left',
  },
});
