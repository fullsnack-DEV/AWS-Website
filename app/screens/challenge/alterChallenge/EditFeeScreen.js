import React, {useState, useEffect} from 'react';
import {StyleSheet, View, Text, TextInput, Alert} from 'react-native';

import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {useIsFocused} from '@react-navigation/native';
import colors from '../../../Constants/Colors';
import {strings} from '../../../../Localization/translation';
import TCGradientButton from '../../../components/TCGradientButton';
import TCLabel from '../../../components/TCLabel';

let bodyParams = {};
export default function EditFeeScreen({navigation, route}) {
  const isFocused = useIsFocused();
  const [basicFee, setBasicFee] = useState(0.0);
  useEffect(() => {
    if (
      route &&
      route.params &&
      route.params.editableAlter &&
      route.params.body
    ) {
      console.log('EDIT FEES::', route.params.body);
      bodyParams = {
        ...route.params.body,
      };
      setBasicFee(route.params.body.total_game_fee);
    }
  }, [isFocused]);
  return (
    <View style={styles.mainContainer}>
      <TCLabel title={'Match Fee'} />
      <View style={styles.matchFeeView}>
        <TextInput
          placeholder={strings.enterFeePlaceholder}
          style={styles.feeText}
          onChangeText={(text) => {
            bodyParams = {
              ...route.params.body,
              total_game_fee: text,
            };
            setBasicFee(text);
          }}
          value={basicFee}
          keyboardType={'decimal-pad'}></TextInput>
        <Text style={styles.curruency}>CAD</Text>
      </View>
      <TCGradientButton
        title={strings.doneTitle}
        textColor={colors.grayColor}
        startGradientColor={colors.yellowColor}
        endGradientColor={colors.themeColor}
        height={40}
        shadow={true}
        marginTop={15}
        onPress={() => {
          console.log('BASIC FEE::', basicFee);
          if (basicFee <= 0.0 || basicFee >= 1.0) {
            navigation.navigate('EditChallenge', {
              challengeObj: {
                ...bodyParams,
                manual_fee: true,
                total_game_fee: parseFloat(basicFee).toFixed(2),
              },
              updatedFee: true,
            });
          } else {
            Alert.alert('Please enter valid match fee.');
          }
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
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
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.5,
    shadowRadius: 1,
    width: wp('92%'),
  },
  feeText: {
    alignSelf: 'center',
    fontSize: wp('3.8%'),
    height: 40,
    width: '96%',
  },
  curruency: {
    alignSelf: 'flex-end',
    fontSize: wp('4%'),
  },
});
