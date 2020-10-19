import React, { useState } from 'react';
import {
  View, Text, Image, TouchableWithoutFeedback,
} from 'react-native';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { Tooltip } from 'react-native-elements';

import constants from '../../../config/constants';
import PATH from '../../../Constants/ImagePath';

import TCButton from '../../../components/TCButton';

import strings from '../../../Constants/String';
import styles from './style'

const { colors } = constants;

export default function ChooseGenderScreen({ navigation }) {
  const [selected, setSelected] = useState(0);
  return (
      <View style={ styles.mainContainer }>
          <Image style={ styles.background } source={ PATH.orangeLayer } />
          <Image style={ styles.background } source={ PATH.bgImage } />

          <Text style={ styles.checkEmailText }>{strings.addGenderText}</Text>
          <Text style={ styles.resetText }>{strings.notDisplayGenderText}</Text>

          <Tooltip popover={ <Text style={ { color: colors.themeColor, fontSize: 14 } }>{strings.genderText}</Text> }
            backgroundColor={ colors.parrotColor }
            height={ hp('20%') }
            width={ wp('75%') }
            overlayColor={ 'transparent' }>
              <Text style={ styles.whyAskingText } >{strings.whyAskingGenderText}</Text>
          </Tooltip>

          <View style={ { marginTop: 40, marginLeft: 20 } }>
              <View style={ styles.radioButtonView }>
                  <TouchableWithoutFeedback
          onPress={ () => {
            setSelected(0);
            setMale(true);
            setFemale(false);
            setOther(false);
          } }>
                      {selected === 0 ? (
                          <Image source={ PATH.radioSelect } style={ styles.radioImage } />
                      ) : (
                          <Image
              source={ PATH.radioUnselect }
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
            setMale(false);
            setFemale(true);
            setOther(false);
          } }>
                      {selected === 1 ? (
                          <Image source={ PATH.radioSelect } style={ styles.radioImage } />
                      ) : (
                          <Image
              source={ PATH.radioUnselect }
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
            setMale(false);
            setFemale(false);
            setOther(true);
          } }>
                      {selected === 2 ? (
                          <Image source={ PATH.radioSelect } style={ styles.radioImage } />
                      ) : (
                          <Image
              source={ PATH.radioUnselect }
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
