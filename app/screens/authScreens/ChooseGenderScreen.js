import React, { useState } from 'react';
import {
  View, Text, Image, StyleSheet, TouchableOpacity,
} from 'react-native';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import { Tooltip } from 'react-native-elements';
import LinearGradient from 'react-native-linear-gradient';
import images from '../../Constants/ImagePath';
import * as Utility from '../../utils/index';
import TCButton from '../../components/TCButton';
import strings from '../../Constants/String';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';

export default function ChooseGenderScreen({ navigation }) {
  const [selected, setSelected] = useState(0);

  const RenderRadio = ({ isSelected, onRadioPress }) => (
    <View style={{
      flex: 0.1,
      paddingHorizontal: 5,
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      <TouchableOpacity style={{
        borderColor: colors.whiteColor,
        height: 22,
        width: 22,
        borderWidth: isSelected ? 0 : 1,
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: isSelected && 'white',
      }}
      onPress={onRadioPress}>
        {isSelected && (
          <LinearGradient
                colors={[colors.greenGradientStart, colors.greenGradientEnd]}
                end={{ x: 0.0, y: 0.25 }}
                start={{ x: 1, y: 0.5 }}
                style={{ height: 13, width: 13, borderRadius: 50 }}>
          </LinearGradient>
        )}
      </TouchableOpacity>
    </View>
  )
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
        <Text style={ styles.whyAskingText }>{strings.whyAskingGenderText}</Text>
      </Tooltip>

      <View style={ { marginTop: 40, marginLeft: 20 } }>
        <View style={ styles.radioButtonView }>
          <RenderRadio isSelected={selected === 0} onRadioPress={() => setSelected(0)}/>
          <Text style={ styles.radioText }>{strings.maleRadioText}</Text>
        </View>
        <View style={ styles.radioButtonView }>
          <RenderRadio isSelected={selected === 1} onRadioPress={() => setSelected(1)}/>
          <Text style={ styles.radioText }>{strings.femaleRadioText}</Text>
        </View>
        <View style={ styles.radioButtonView }>
          <RenderRadio isSelected={selected === 2} onRadioPress={() => setSelected(2)}/>
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
