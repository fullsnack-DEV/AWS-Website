import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ScrollView,
  StyleSheet,
} from 'react-native';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import LinearGradient from 'react-native-linear-gradient';

import colors from '../../../../Constants/Colors';
import fonts from '../../../../Constants/Fonts';
import images from '../../../../Constants/ImagePath';
import strings from '../../../../Constants/String';
import TCKeyboardView from '../../../../components/TCKeyboardView';

export default function CreateClubForm2({ navigation, route }) {
  const [registrationFee, setRegistrationFee] = useState('');
  const [membershipUserSelected, setMembershipUserSelected] = useState(0);
  const [membershipTeamSelected, setMembershipTeamSelected] = useState(0);

  return (
    <TCKeyboardView>
      <ScrollView style={ styles.mainContainer }>
        <View style={ styles.formSteps }>
          <View style={ styles.form1 }></View>
          <View style={ styles.form2 }></View>
          <View style={ styles.form3 }></View>
        </View>

        <Text style={ styles.whoJoinText }>{strings.whoJoinText}</Text>

        <View style={ styles.radioButtonView }>
          <TouchableWithoutFeedback onPress={ () => setMembershipUserSelected(0) }>
            {membershipUserSelected === 0 ? (
              <Image source={ images.radioSelect } style={ styles.radioImage } />
            ) : (
              <Image
              source={ images.radioUnselect }
              style={ styles.unSelectRadioImage }
            />
            )}
          </TouchableWithoutFeedback>
          <Text style={ styles.radioText }>{strings.everyoneText}</Text>
        </View>
        <View style={ styles.radioButtonView }>
          <TouchableWithoutFeedback onPress={ () => setMembershipUserSelected(1) }>
            {membershipUserSelected === 1 ? (
              <Image source={ images.radioSelect } style={ styles.radioImage } />
            ) : (
              <Image
              source={ images.radioUnselect }
              style={ styles.unSelectRadioImage }
            />
            )}
          </TouchableWithoutFeedback>
          <Text style={ styles.radioText }>{strings.onlyPersonText}</Text>
        </View>

        <Text style={ styles.whoJoinText }>{strings.whoseApprovalText}</Text>

        <View style={ styles.radioButtonView }>
          <TouchableWithoutFeedback onPress={ () => setMembershipTeamSelected(0) }>
            {membershipTeamSelected === 0 ? (
              <Image source={ images.radioSelect } style={ styles.radioImage } />
            ) : (
              <Image
              source={ images.radioUnselect }
              style={ styles.unSelectRadioImage }
            />
            )}
          </TouchableWithoutFeedback>
          <Text style={ styles.radioText }>{strings.noneText}</Text>
        </View>
        <View style={ styles.radioButtonView }>
          <TouchableWithoutFeedback onPress={ () => setMembershipTeamSelected(1) }>
            {membershipTeamSelected === 1 ? (
              <Image source={ images.radioSelect } style={ styles.radioImage } />
            ) : (
              <Image
              source={ images.radioUnselect }
              style={ styles.unSelectRadioImage }
            />
            )}
          </TouchableWithoutFeedback>
          <Text style={ styles.radioText }>{strings.clubAdminText}</Text>
        </View>
        <View style={ styles.fieldView }>
          <Text style={ styles.fieldTitle }>{strings.registerTitle}</Text>
        </View>
        <View style={ styles.matchFeeView }>
          <TextInput
          placeholder={ strings.enterFeePlaceholder }
          style={ styles.feeText }
          onChangeText={ (text) => setRegistrationFee(text) }
          value={ registrationFee }
          keyboardType={ 'decimal-pad' }></TextInput>
          <Text style={ styles.curruency }>CAD</Text>
        </View>
        <TouchableOpacity
        onPress={ () => {
          const form2 = {};
          if (membershipUserSelected === 0) {
            form2.join_type = 'anyone';
          } else {
            form2.join_type = 'invited';
          }
          if (membershipTeamSelected === 0) {
            form2.approval_required = false;
          } else {
            form2.approval_required = true;
          }
          if (registrationFee !== 0) {
            form2.registration_fee = registrationFee;
          }
          navigation.navigate('CreateClubForm3', {
            createClubForm2: { ...route.params.createClubForm1, ...form2 },
          });
        } }>
          <LinearGradient
          colors={ [colors.yellowColor, colors.themeColor] }
          style={ styles.nextButton }>
            <Text style={ styles.nextButtonText }>{strings.nextTitle}</Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </TCKeyboardView>
  );
}
const styles = StyleSheet.create({
  curruency: {
    alignSelf: 'flex-end',
    fontSize: wp('4%'),
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

  form1: {
    backgroundColor: colors.themeColor,
    height: 5,
    marginLeft: 2,
    marginRight: 2,
    width: 10,
  },
  form2: {
    backgroundColor: colors.themeColor,
    height: 5,
    marginLeft: 2,
    marginRight: 2,
    width: 10,
  },
  form3: {
    backgroundColor: colors.lightgrayColor,
    height: 5,
    marginLeft: 2,
    marginRight: 2,
    width: 10,
  },

  formSteps: {
    alignSelf: 'flex-end',
    flexDirection: 'row',
    marginRight: 15,
    marginTop: 15,
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
  radioButtonView: {
    flexDirection: 'row',
    marginLeft: 20,
    marginRight: 15,
    marginTop: 10,
  },
  radioImage: {
    alignSelf: 'center',
    height: 22,
    resizeMode: 'contain',
    tintColor: colors.radioButtonColor,
    width: 22,
  },
  radioText: {
    alignSelf: 'center',
    color: colors.lightBlackColor,
    fontSize: wp('4%'),
    marginLeft: 15,
    marginRight: 15,
  },

  unSelectRadioImage: {
    alignSelf: 'center',
    height: 22,
    resizeMode: 'contain',
    tintColor: colors.grayColor,
    width: 22,
  },
  whoJoinText: {
    color: colors.lightBlackColor,
    fontFamily: fonts.RRegular,
    fontSize: wp('4%'),
    marginBottom: 20,
    marginLeft: 20,
    marginRight: 20,
    marginTop: 15,
  },
});
