import React, { useState, useContext, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ScrollView,
  Alert, Platform,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import LinearGradient from 'react-native-linear-gradient';
import FastImage from 'react-native-fast-image';
import AuthContext from '../../../auth/context'
import images from '../../../Constants/ImagePath';
import ActivityLoader from '../../../components/loader/ActivityLoader';
import strings from '../../../Constants/String';

import { getUserDetails, patchRegisterScorekeeperDetails } from '../../../api/Users';
import colors from '../../../Constants/Colors'
import fonts from '../../../Constants/Fonts'
import TCKeyboardView from '../../../components/TCKeyboardView';

export default function RegisterScorekeeperForm2({ navigation, route }) {
  const [loading, setloading] = useState(false);
  const authContext = useContext(AuthContext)
  const [matchFee, onMatchFeeChanged] = React.useState('0');
  const [selected, setSelected] = useState(0);
  const [currentScorekeeperData, setCurrentScorekeeperData] = useState([]);
  useEffect(() => {
    getUserDetails(authContext?.entity?.uid, authContext).then((res) => {
      setCurrentScorekeeperData(res?.payload?.scorekeeper_data || []);
    }).catch((error) => {
      console.log(error);
    })
  }, [])
  const registerScorekeeperCall = () => {
    setloading(true);
    if (route.params && route.params.bodyParams) {
      const bodyParams = { ...route.params.bodyParams };
      bodyParams.scorekeeper_data[0].certificates.pop();
      bodyParams.scorekeeper_data[0].fee = matchFee;
      bodyParams.scorekeeper_data[0].is_published = true;
      if (selected === 0) {
        bodyParams.scorekeeper_data[0].cancellation_policy = 'strict';
      } else if (selected === 1) {
        bodyParams.scorekeeper_data[0].cancellation_policy = 'moderate';
      } else {
        bodyParams.scorekeeper_data[0].cancellation_policy = 'flexible';
      }
      const allData = { scorekeeper_data: [...bodyParams?.scorekeeper_data, ...currentScorekeeperData] }
      patchRegisterScorekeeperDetails(allData, authContext).then((res) => {
        const entity = authContext.entity
        entity.auth.user = res.payload;
        entity.obj = res.payload;
        authContext.setEntity({ ...entity })
        navigation.navigate('RegisterScorekeeperSuccess');
      }).catch((error) => {
        Alert.alert(error)
      }).finally(() => setloading(false));
    } else {
      setloading(false);
    }
  };

  return (
    <TCKeyboardView>
      <ScrollView style={ styles.mainContainer }>
        <ActivityLoader visible={ loading } />
        <View style={ styles.formSteps }>
          <View style={ styles.form1 }></View>
          <View style={ styles.form2 }></View>
        </View>

        <Text style={ styles.LocationText }>
          {strings.matchFeesTitle}
        </Text>

        <View style={ styles.matchFeeView }>
          <TextInput
            placeholder={ strings.enterFeePlaceholder }
            style={ styles.feeText }
            onChangeText={ (text) => onMatchFeeChanged(text) }
            value={matchFee}
            keyboardType={ 'decimal-pad' }/>
          <Text style={ styles.curruency } numberOfLines={1}>CAD/hour</Text>
        </View>
        <View>
          <Text style={ styles.LocationText }>
            {strings.cancellationPolicyTitle}
          </Text>
        </View>
        <View style={ styles.radioButtonView }>
          <TouchableWithoutFeedback onPress={ () => setSelected(0) }>
            {selected === 0 ? (
              <FastImage source={ images.radioSelect } style={ styles.radioImage } />
            ) : (
              <FastImage
                source={ images.radioUnselect }
                style={ styles.unSelectRadioImage }
              />
            )}
          </TouchableWithoutFeedback>
          <Text style={ styles.radioText }>{strings.strictText}</Text>
        </View>
        <View style={ styles.radioButtonView }>
          <TouchableWithoutFeedback onPress={ () => setSelected(1) }>
            {selected === 1 ? (
              <FastImage source={ images.radioSelect } style={ styles.radioImage } />
            ) : (
              <FastImage
                source={ images.radioUnselect }
                style={ styles.unSelectRadioImage }
              />
            )}
          </TouchableWithoutFeedback>
          <Text style={ styles.radioText }>{strings.moderateText}</Text>
        </View>
        <View style={ styles.radioButtonView }>
          <TouchableWithoutFeedback onPress={ () => setSelected(2) }>
            {selected === 2 ? (
              <Image source={ images.radioSelect } style={ styles.radioImage } />
            ) : (
              <Image
                source={ images.radioUnselect }
                style={ styles.unSelectRadioImage }
              />
            )}
          </TouchableWithoutFeedback>
          <Text style={ styles.radioText }>{strings.flexibleText}</Text>
        </View>
        {selected === 0 && (
          <View>
            <Text style={ styles.membershipText }>{strings.strictText} </Text>
            <Text style={ styles.whoJoinText }>
              <Text style={ styles.membershipSubText }>
                {strings.strictPoint1Title}
              </Text>
              {'\n'}
              {strings.strictPoint1Desc}
              {'\n'}
              {'\n'}
              <Text style={ styles.membershipSubText }>
                {strings.strictPoint2Title}
              </Text>
              {'\n'}
              {strings.strictPoint2Desc}
            </Text>
          </View>
        )}
        {selected === 1 && (
          <View>
            <Text style={ styles.membershipText }>{strings.moderateText} </Text>
            <Text style={ styles.whoJoinText }>
              <Text style={ styles.membershipSubText }>
                {strings.moderatePoint1Title}
              </Text>
              {'\n'}
              {strings.moderatePoint1Desc}
              {'\n'}
              {'\n'}
              <Text style={ styles.membershipSubText }>
                {strings.moderatePoint2Title}
              </Text>
              {'\n'}
              {strings.moderatePoint2Desc}
              {'\n'}
              {'\n'}
              <Text style={ styles.membershipSubText }>
                {strings.moderatePoint3Title}
              </Text>
              {strings.moderatePoint3Desc}
            </Text>
          </View>
        )}
        {selected === 2 && (
          <View>
            <Text style={ styles.membershipText }>{strings.flexibleText} </Text>
            <Text style={ styles.whoJoinText }>
              <Text style={ styles.membershipSubText }>
                {strings.flexiblePoint1Title}
              </Text>
              {'\n'}
              {strings.flexiblePoint1Desc}
              {'\n'}
              {'\n'}
              <Text style={ styles.membershipSubText }>
                {strings.flexiblePoint2Title}
              </Text>
              {'\n'}
              {strings.flexiblePoint2Desc}
            </Text>
          </View>
        )}
        <TouchableOpacity onPress={ () => registerScorekeeperCall() }>
          <LinearGradient
            colors={ [colors.yellowColor, colors.themeColor] }
            style={ styles.nextButton }>
            <Text style={ styles.nextButtonText }>{strings.doneTitle}</Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </TCKeyboardView>
  );
}
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  formSteps: {
    alignSelf: 'flex-end',
    flexDirection: 'row',
    padding: 15,
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
  LocationText: {
    marginTop: hp('2%'),
    color: colors.lightBlackColor,
    fontSize: wp('3.8%'),
    textAlign: 'left',
    // fontFamily: fonts.RBold,
    paddingLeft: 15,
  },
  curruency: {
    alignSelf: 'center',
    color: colors.lightBlackColor,
    fontFamily: fonts.RRegular,
    fontSize: 15,
    flex: 0.3,
    textAlign: 'center',
  },
  feeText: {
    fontSize: wp('3.8%'),
    flex: 0.7,
  },
  matchFeeView: {
    flex: 1,
    alignSelf: 'center',
    backgroundColor: colors.offwhite,
    borderRadius: 5,
    color: 'black',
    elevation: 3,
    flexDirection: 'row',
    fontSize: wp('3.5%'),
    marginTop: 12,
    paddingHorizontal: 15,
    paddingRight: 30,
    paddingVertical: Platform.OS === 'ios' ? 12 : 0,
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
    marginLeft: 15,
    marginRight: 15,
    marginTop: 15,
  },
  radioText: {
    alignSelf: 'center',
    color: colors.lightBlackColor,
    fontSize: wp('3.8%'),
    marginLeft: 15,
    marginRight: 15,
  },
  radioImage: {
    height: 22,
    width: 22,
    resizeMode: 'contain',
    // tintColor: colors.radioButtonColor,
    alignSelf: 'center',
  },
  unSelectRadioImage: {
    alignSelf: 'center',
    height: 22,
    resizeMode: 'contain',
    tintColor: colors.grayColor,
    width: 22,
  },
  membershipText: {
    color: colors.veryLightBlack,
    fontFamily: fonts.RBold,
    fontSize: 16,
    marginLeft: 15,
    marginTop: 20,
  },
  membershipSubText: {
    color: colors.veryLightBlack,
    fontFamily: fonts.RRegular,
    fontSize: 16,
    fontWeight: 'bold',
    lineHeight: 20,
    marginLeft: 15,
    marginTop: 20,
  },
  whoJoinText: {
    color: colors.veryLightBlack,
    fontFamily: fonts.RMedium,
    fontSize: 16,
    marginBottom: 20,
    marginLeft: 15,
    marginTop: 10,
  },

});
