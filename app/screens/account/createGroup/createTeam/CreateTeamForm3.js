import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import RNPickerSelect from 'react-native-picker-select';
import LinearGradient from 'react-native-linear-gradient';

import images from '../../../../Constants/ImagePath';
import strings from '../../../../Constants/String';

import colors from '../../../../Constants/Colors'
import fonts from '../../../../Constants/Fonts'
import DataSource from '../../../../Constants/DataSource';
import TCKeyboardView from '../../../../components/TCKeyboardView';
import TCFormProgress from '../../../../components/TCFormProgress';

export default function CreateTeamForm3({ navigation, route }) {
  const [basicFee, setBasicFee] = useState(0.0);
  const [membershipFee, setMembershipFee] = useState(0.0);
  const [basicFeeDetail, setBasicFeeDetail] = useState('');
  const [feeCycle, setFeeCycle] = useState('');
  const [membershipFeeDetail, setMembershipFeeDetail] = useState('');

  return (
    <>
      <TCFormProgress totalSteps={4} curruentStep={3}/>
      <TCKeyboardView>

        <ScrollView style={ styles.mainContainer }>

          <Text style={ styles.registrationText }>{strings.registerTitle}</Text>
          <Text style={ styles.registrationDescText }>
            {strings.registerSubTitle}
          </Text>
          <View style={ styles.fieldView }>
            <Text style={ styles.fieldTitle }>{strings.basicFeeTitle}</Text>
          </View>
          <View style={ styles.matchFeeView }>
            <TextInput
            placeholder={ strings.enterFeePlaceholder }
            style={ styles.feeText }
            onChangeText={ (text) => setBasicFee(text) }
            value={ basicFee }
            keyboardType={ 'decimal-pad' }></TextInput>
            <Text style={ styles.curruency }>{route?.params?.createTeamForm2?.currency_type}</Text>
          </View>

          <View style={ styles.fieldView }>
            <Text style={ styles.fieldTitle }>{strings.feeDetailsText}</Text>
            <TextInput
            style={ styles.descriptionTxt }
            onChangeText={ (text) => setBasicFeeDetail(text) }
            value={ basicFeeDetail }
            multiline
            numberOfLines={ 4 }
            textAlignVertical={'top'}
            placeholder={ strings.feeDetailsPlaceholder }
          />
          </View>
          <Text style={ styles.registrationText }>
            {strings.membershipFeeTitle}
          </Text>
          <Text style={ styles.registrationDescText }>
            {strings.membershipSubTitle}
          </Text>

          <View style={ styles.fieldView }>
            <Text style={ styles.fieldTitle }>{strings.basicFeeTitle}</Text>
            <View
            style={ {
              flexDirection: 'row',

              marginTop: 12,

              align: 'center',
              marginLeft: 15,
              marginRight: 15,
              justifyContent: 'space-between',
            } }>
              <RNPickerSelect
              placeholder={ {
                label: strings.feeCyclePlaceholder,
                value: null,
              } }
              items={ DataSource.FeeCycle}
              onValueChange={ (value) => {
                setFeeCycle(value);
              } }
              value={ feeCycle }
              useNativeAndroidPickerStyle={ false }
              style={ {
                inputIOS: {
                  height: 40,

                  fontSize: wp('3.5%'),
                  paddingVertical: 12,
                  paddingHorizontal: 15,
                  width: wp('45%'),
                  color: 'black',
                  paddingRight: 30,
                  backgroundColor: colors.offwhite,

                  borderRadius: 5,
                  shadowColor: colors.googleColor,
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.5,
                  shadowRadius: 1,
                },
                inputAndroid: {
                  height: 40,

                  fontSize: wp('4%'),
                  paddingVertical: 12,
                  paddingHorizontal: 15,
                  width: wp('45%'),
                  color: 'black',
                  paddingRight: 30,
                  backgroundColor: colors.offwhite,

                  borderRadius: 5,
                  shadowColor: colors.googleColor,
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.5,
                  shadowRadius: 1,
                  elevation: 3,
                },
              } }
              Icon={ () => (
                <Image
                    source={ images.dropDownArrow }
                    style={ styles.miniDownArrow }
                  />
              ) }
            />
              <View style={ styles.halfMatchFeeView }>
                <TextInput
                placeholder={ strings.enterFeePlaceholder }
                style={ styles.halffeeText }
                keyboardType={ 'decimal-pad' }
                onChangeText={ (text) => setMembershipFee(text) }
                value={ membershipFee }></TextInput>
                <Text style={ styles.curruency }>{route?.params?.createTeamForm2?.currency_type}</Text>
              </View>
            </View>
          </View>
          <View style={ styles.fieldView }>
            <Text style={ styles.fieldTitle }>{strings.feeDetailsText}</Text>
            <TextInput
            style={ styles.descriptionTxt }
            onChangeText={ (text) => setMembershipFeeDetail(text) }
            value={ membershipFeeDetail }
            multiline
            textAlignVertical={'top'}
            numberOfLines={ 4 }
            placeholder={ strings.membershipPlaceholder }
          />
          </View>
          <TouchableOpacity
          onPress={ () => navigation.navigate('CreateTeamForm4', {
            createTeamForm3: {
              ...route.params.createTeamForm2,
              registration_fee: basicFee,
              registration_details: basicFeeDetail,
              membership_fee_type: feeCycle,
              membership_fee: membershipFee,
              details: membershipFeeDetail,
            },
          })
          }>
            <LinearGradient
            colors={ [colors.yellowColor, colors.themeColor] }
            style={ styles.nextButton }>
              <Text style={ styles.nextButtonText }>{strings.nextTitle}</Text>
            </LinearGradient>
          </TouchableOpacity>
        </ScrollView>
      </TCKeyboardView>
    </>
  );
}

const styles = StyleSheet.create({
  curruency: {
    alignSelf: 'flex-end',
    fontSize: wp('4%'),
  },

  descriptionTxt: {
    height: 120,
    // alignSelf: 'center',
    width: wp('92%'),
    fontSize: wp('3.8%'),

    marginTop: 12,

    alignSelf: 'center',

    paddingVertical: 12,
    paddingHorizontal: 15,

    color: 'black',
    paddingRight: 30,
    backgroundColor: colors.offwhite,

    borderRadius: 5,
    shadowColor: colors.googleColor,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 1,
    elevation: 3,
  },

  feeText: {
    alignSelf: 'center',
    fontSize: wp('3.8%'),
    height: 40,
    width: '96%',
  },

  fieldTitle: {
    marginTop: hp('2%'),

    fontSize: wp('3.8%'),
    textAlign: 'left',
    // fontFamily: fonts.RBold,
    paddingLeft: 15,

    color: colors.lightBlackColor,
  },

  halfMatchFeeView: {
    alignSelf: 'center',
    backgroundColor: colors.offwhite,

    borderRadius: 5,
    color: 'black',

    elevation: 3,
    flexDirection: 'row',
    fontSize: wp('3.5%'),

    height: 40,
    paddingHorizontal: 15,
    paddingRight: 30,

    paddingVertical: 12,
    shadowColor: colors.googleColor,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 1,
    width: wp('46%'),
  },

  halffeeText: {
    alignSelf: 'center',
    fontSize: wp('3.8%'),
    height: 40,
    width: '90%',
  },
  mainContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  matchFeeView: {
    alignSelf: 'center',
    backgroundColor: colors.offwhite,

    borderRadius: 5,
    color: 'black',
    elevation: 3,
    flexDirection: 'row',
    fontSize: wp('3.5%'),
    height: 40,

    marginTop: 12,
    paddingHorizontal: 15,
    paddingRight: 30,

    paddingVertical: 12,
    shadowColor: colors.googleColor,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 1,
    width: wp('92%'),
  },
  miniDownArrow: {
    alignSelf: 'center',
    height: 12,
    resizeMode: 'contain',

    right: 15,
    tintColor: colors.grayColor,

    top: 15,
    width: 12,
  },
  nextButton: {
    alignSelf: 'center',
    borderRadius: 30,
    height: 45,
    marginBottom: 40,
    marginTop: wp('12%'),
    width: '90%',
  },
  nextButtonText: {
    alignSelf: 'center',
    color: colors.whiteColor,
    fontFamily: fonts.RBold,
    fontSize: wp('4%'),
    marginVertical: 10,
  },
  registrationDescText: {
    color: colors.lightBlackColor,
    fontSize: wp('4%'),
    marginBottom: 20,
    marginLeft: 15,
    marginRight: 15,
    marginTop: 10,
  },
  registrationText: {
    color: colors.lightBlackColor,
    fontSize: wp('5%'),
    marginLeft: 15,
    marginTop: 20,
  },

});
