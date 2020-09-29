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
const {strings, colors, fonts, urls, PATH} = constants;

function RegisterPlayer({navigation, route}) {
  const [sports, setSports] = useState('');

  const [description, onChangeText] = React.useState('');
  const [matchFee, onMatchFeeChanged] = React.useState(0.0);

  renderItem = ({item, index}) => {
    return (
      <View style={{flexDirection: 'column'}}>
        <View style={styles.addCertificateView}>
          <TouchableOpacity>
            <Image style={styles.certificateImg} />
            <Image source={PATH.certificateUpload} style={styles.chooseImage} />
          </TouchableOpacity>
          <TextInput
            placeholder={'Title or Description'}
            style={styles.matchFeeTxt}
            onChangeText={(text) => onMatchFeeChanged(text)}
            value={matchFee}></TextInput>
        </View>
        <TouchableOpacity>
          <Text style={styles.delete}>Delete</Text>
        </TouchableOpacity>
      </View>
    );
  };
  return (
    <>
      <ScrollView style={styles.mainContainer}>
        <Text style={styles.LocationText}>SPORTS EVENTS</Text>
        <RNPickerSelect
          placeholder={{
            label: 'Select Sport',
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
          <Text style={styles.LocationText}>DESCRIPTION</Text>
          <Text style={styles.smallTxt}> (Optional) </Text>
        </View>
        <TextInput
          style={styles.descriptionTxt}
          onChangeText={(text) => onChangeText(text)}
          value={description}
          multiline
          numberOfLines={4}
          placeholder={'Describe your self as a personal player'}
        />
        <View style={styles.separatorLine}></View>

        <Text style={styles.LocationText}>
          MATCH FEE <Text style={styles.smallTxt}> (per hour) </Text>
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
        <Text style={[styles.signUpText]}>DONE</Text>
      </TouchableOpacity>
    </>
  );
}

export default RegisterPlayer;
