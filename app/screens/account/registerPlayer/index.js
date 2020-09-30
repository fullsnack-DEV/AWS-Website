import React, {useState, useEffect, Component} from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

import RNPickerSelect, {defaultStyles} from 'react-native-picker-select';

import styles from './style';
import constants from '../../../config/constants';
const {colors, fonts, urls} = constants;
import PATH from '../../../Constants/ImagePath';
import strings from '../../../Constants/String';

function RegisterPlayer({navigation, route}) {
  const [sports, setSports] = useState('');

  const [description, onChangeText] = React.useState('');
  const [matchFee, onMatchFeeChanged] = React.useState(0.0);

  return (
    <>
      <ScrollView style={styles.mainContainer}>
        <Text style={styles.LocationText}>{strings.sportsEventsTitle}</Text>
        <RNPickerSelect
          placeholder={{
            label: strings.selectSportPlaceholder,
            value: null,
          }}
          items={[
            {label: 'Football', value: 'football'},
            {label: 'Baseball', value: 'baseball'},
            {label: 'Hockey', value: 'hockey'},
          ]}
          onValueChange={(value) => {
            setSports(value);
          }}
          style={{...styles}}
          value={sports}
          Icon={() => {
            return (
              <Image source={PATH.dropDownArrow} style={styles.downArrow} />
            );
          }}
        />
        <View style={styles.separatorLine}></View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <Text style={styles.LocationText}>{strings.descriptionText}</Text>
          <Text style={styles.smallTxt}> {strings.opetionalText} </Text>
        </View>
        <TextInput
          style={styles.descriptionTxt}
          onChangeText={(text) => onChangeText(text)}
          value={description}
          multiline
          numberOfLines={4}
          placeholder={strings.descriptionPlaceholder}
        />
        <View style={styles.separatorLine}></View>

        <Text style={styles.LocationText}>
          {strings.matchFeesTitle}{' '}
          <Text style={styles.smallTxt}> {strings.perHourText} </Text>
        </Text>
        <View style={styles.matchFeeView}>
          <TextInput
            style={styles.matchFeeTxt}
            onChangeText={(text) => onMatchFeeChanged(text)}
            value={matchFee}></TextInput>
          <Text style={styles.curruency}>CAD</Text>
        </View>
        <View style={styles.separatorLine}></View>
      </ScrollView>
      <TouchableOpacity style={[styles.doneButton]}>
        <Text style={[styles.signUpText]}>{strings.doneTitle}</Text>
      </TouchableOpacity>
    </>
  );
}

export default RegisterPlayer;
