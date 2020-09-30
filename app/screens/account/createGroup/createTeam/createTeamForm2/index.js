import React, {useState, useEffect, Component} from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ScrollView,
} from 'react-native';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import RNPickerSelect, {defaultStyles} from 'react-native-picker-select';
import LinearGradient from 'react-native-linear-gradient';

import styles from './style';

import constants from '../../../../../config/constants';
const {colors, fonts, urls} = constants;
import PATH from '../../../../../Constants/ImagePath';
import strings from '../../../../../Constants/String';

function CreateTeamForm2({navigation, route}) {
  const [selected, setSelected] = useState(0);
  return (
    <ScrollView style={styles.mainContainer}>
      <View style={styles.formSteps}>
        <View style={styles.form1}></View>
        <View style={styles.form2}></View>
        <View style={styles.form3}></View>
        <View style={styles.form4}></View>
      </View>
      <Text style={styles.membershipText}>{strings.membershipTitle}</Text>
      <Text style={styles.whoJoinText}>{strings.whoJoinTitle}</Text>

      <View style={styles.radioButtonView}>
        <TouchableWithoutFeedback onPress={() => setSelected(0)}>
          {selected == 0 ? (
            <Image source={PATH.radioSelect} style={styles.radioImage} />
          ) : (
            <Image
              source={PATH.radioUnselect}
              style={styles.unSelectRadioImage}
            />
          )}
        </TouchableWithoutFeedback>
        <Text style={styles.radioText}>{strings.everyoneText}</Text>
      </View>
      <View style={styles.radioButtonView}>
        <TouchableWithoutFeedback onPress={() => setSelected(1)}>
          {selected == 1 ? (
            <Image source={PATH.radioSelect} style={styles.radioImage} />
          ) : (
            <Image
              source={PATH.radioUnselect}
              style={styles.unSelectRadioImage}
            />
          )}
        </TouchableWithoutFeedback>
        <Text style={styles.radioText}>{strings.membershipRequestText}</Text>
      </View>
      <View style={styles.radioButtonView}>
        <TouchableWithoutFeedback onPress={() => setSelected(2)}>
          {selected == 2 ? (
            <Image source={PATH.radioSelect} style={styles.radioImage} />
          ) : (
            <Image
              source={PATH.radioUnselect}
              style={styles.unSelectRadioImage}
            />
          )}
        </TouchableWithoutFeedback>
        <Text style={styles.radioText}>{strings.inviteText}</Text>
      </View>

      <TouchableOpacity onPress={() => navigation.navigate('CreateTeamForm3')}>
        <LinearGradient
          colors={[colors.yellowColor, colors.themeColor]}
          style={styles.nextButton}>
          <Text style={styles.nextButtonText}>{strings.nextTitle}</Text>
        </LinearGradient>
      </TouchableOpacity>
    </ScrollView>
  );
}

export default CreateTeamForm2;
