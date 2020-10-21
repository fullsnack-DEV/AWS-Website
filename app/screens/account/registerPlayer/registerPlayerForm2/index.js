import React, {
  useState, useContext,
} from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ScrollView,
  Alert,
} from 'react-native';

import LinearGradient from 'react-native-linear-gradient';

import styles from './style';
import images from '../../../../Constants/ImagePath';
import AuthContext from '../../../../auth/context';
import ActivityLoader from '../../../../components/loader/ActivityLoader';
import strings from '../../../../Constants/String';
import * as Utility from '../../../../utils/index';

import { patchRegisterPlayerDetails } from '../../../../api/Accountapi';

import colors from '../../../../Constants/Colors'

export default function RegisterPlayerForm2({ navigation, route }) {
  // For activity indigator
  const [loading, setloading] = useState(false);
  const authContext = useContext(AuthContext);
  const [matchFee, onMatchFeeChanged] = React.useState('');
  const [selected, setSelected] = useState(0);

  registerPlayerCall = () => {
    setloading(true);
    if (route.params && route.params.bodyParams) {
      const bodyParams = { ...route.params.bodyParams };
      bodyParams.fee = matchFee;
      if (selected === 0) {
        bodyParams.cancellation_policy = 'strict';
      } else if (selected === 1) {
        bodyParams.cancellation_policy = 'moderate';
      } else {
        bodyParams.cancellation_policy = 'flexible';
      }
      console.log('bodyPARAMS:: ', bodyParams);
      const registerdPlayerData = authContext.user.registered_sports
      registerdPlayerData.push(bodyParams);
      const body = {
        registered_sports: registerdPlayerData,
      }
      patchRegisterPlayerDetails(body).then(async (response) => {
        if (response.status === true) {
          await Utility.setStorage('user', response.payload);
          authContext.setUser(response.payload)
          Alert.alert('Towns Cup', 'Player sucessfully registered');
          navigation.navigate('AccountScreen');
        } else {
          Alert.alert('Towns Cup', response.messages);
        }
        console.log('RESPONSE IS:: ', response);
        setloading(false);
      });
    }
  };

  return (
      <>
          <ScrollView style={ styles.mainContainer }>
              <ActivityLoader visible={ loading } />
              <View style={ styles.formSteps }>
                  <View style={ styles.form1 }></View>
                  <View style={ styles.form2 }></View>
              </View>

              <Text style={ styles.LocationText }>
                  {strings.matchFeesTitle}

                  <Text style={ styles.smallTxt }> {strings.perHourText} </Text>
              </Text>

              <View style={ styles.matchFeeView }>
                  <TextInput
            placeholder={ strings.enterFeePlaceholder }
            style={ styles.feeText }
            onChangeText={ (text) => onMatchFeeChanged(text) }
            value={ (matchFee) }
            keyboardType={ 'decimal-pad' }></TextInput>
                  <Text style={ styles.curruency }>CAD/match</Text>
              </View>
              <View>
                  <Text style={ styles.LocationText }>
                      {strings.cancellationPolicyTitle}
                  </Text>
              </View>
              <View style={ styles.radioButtonView }>
                  <TouchableWithoutFeedback onPress={ () => setSelected(0) }>
                      {selected === 0 ? (
                          <Image source={ images.radioSelect } style={ styles.radioImage } />
                      ) : (
                          <Image
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
                          <Image source={ images.radioSelect } style={ styles.radioImage } />
                      ) : (
                          <Image
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
              <TouchableOpacity onPress={ () => registerPlayerCall() }>
                  <LinearGradient
            colors={ [colors.yellowColor, colors.themeColor] }
            style={ styles.nextButton }>
                      <Text style={ styles.nextButtonText }>{strings.doneTitle}</Text>
                  </LinearGradient>
              </TouchableOpacity>
          </ScrollView>
      </>
  );
}
