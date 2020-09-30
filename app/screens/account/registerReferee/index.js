import React, {useState, useEffect, Component} from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  Platform,
  TouchableOpacity,
  Animated,
  ScrollView,
  Dimensions,
  LayoutAnimation,
  UIManager,
  FlatList,
} from 'react-native';

import RNPickerSelect, {defaultStyles} from 'react-native-picker-select';

import styles from './style';
import constants from '../../../config/constants';
const {colors, fonts, urls} = constants;
import PATH from '../../../Constants/ImagePath';
import strings from '../../../Constants/String';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

function RegisterReferee({navigation, route}) {
  const placeholder = {
    label: strings.selectSportPlaceholder,
    value: null,
  };
  const [sports, setSports] = useState('');
  const [certificate, setSCertificate] = useState([]);
  const [description, onChangeText] = React.useState('');
  const [matchFee, onMatchFeeChanged] = React.useState(0.0);
  var index = 0;

  useEffect(() => {}, []);
  addMore = () => {
    setSCertificate([...certificate, index]);
    console.log(':::', certificate, index);
    index++;
  };
  renderItem = ({item, index}) => {
    return (
      <View style={{flexDirection: 'column'}}>
        <View style={styles.addCertificateView}>
          <TouchableOpacity>
            <Image style={styles.certificateImg} />
            <Image source={PATH.certificateUpload} style={styles.chooseImage} />
          </TouchableOpacity>
          <TextInput
            placeholder={strings.titleOrDescriptionText}
            style={styles.certificateDescription}
            onChangeText={(text) => onMatchFeeChanged(text)}
            value={matchFee}></TextInput>
        </View>
        <TouchableOpacity>
          <Text style={styles.delete}>{strings.deleteTitle}</Text>
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
          //style={pickerSelectStyles}
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
          {strings.certificateTitle}
          <Text style={styles.smallTxt}> {strings.opetionalText} </Text>
        </Text>
        <Text style={styles.LocationText}>{strings.certificateSubTitle}</Text>

        <FlatList
          scrollEnabled={false}
          data={certificate}
          keyExtractor={(index) => index}
          renderItem={this.renderItem}
        />
        <TouchableOpacity
          onPress={this.addMore}
          style={styles.addCertificateButton}>
          <Text style={[styles.addCertificateText]}>
            {strings.addCertificateTitle}
          </Text>
        </TouchableOpacity>
        <Text style={styles.LocationText}>
          {strings.languageTitle}
          <Text style={styles.smallTxt}> {strings.opetionalText} </Text>
        </Text>
        <RNPickerSelect
          placeholder={{
            label: strings.languagePlaceholder,
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
          //style={pickerSelectStyles}
          style={{...styles}}
          value={sports}
          Icon={() => {
            return (
              <Image source={PATH.dropDownArrow} style={styles.downArrow} />
            );
          }}
        />
        <View style={styles.separatorLine}></View>
        <Text style={styles.LocationText}>
          {strings.refereeFeesTitle}
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

export default RegisterReferee;
