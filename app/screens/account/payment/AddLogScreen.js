import React, { useState, useLayoutEffect } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
} from 'react-native';

// import { useIsFocused } from '@react-navigation/native';

// import ActivityLoader from '../../../components/loader/ActivityLoader';

import TCTabView from '../../../components/TCTabView';
import TCThinDivider from '../../../components/TCThinDivider';
import colors from '../../../Constants/Colors';
import fonts from '../../../Constants/Fonts';
import images from '../../../Constants/ImagePath';
import strings from '../../../Constants/String';

export default function AddLogScreen({ navigation }) {
  // const [loading, setloading] = useState(false);

  // const isFocused = useIsFocused();
  const [paymentSwitchSelection, setPaymentSwitchSelection] = useState(0);
  const [paymentType, setPaymentType] = useState(0);
  const [amount, setAmount] = useState(0);
  const [note, setNote] = useState();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity style={styles.rightHeaderView}>
          <Text>Done</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  return (
    <ScrollView bounces={false}>
      <View style={styles.mainContainer}>
        {/* <ActivityLoader visible={loading} /> */}

        <TCTabView
          totalTabs={2}
          firstTabTitle={'PAYMENT'}
          secondTabTitle={'REFUND'}
          indexCounter={paymentSwitchSelection}
          eventPrivacyContianer={{ width: 100 }}
          onFirstTabPress={() => setPaymentSwitchSelection(0)}
          onSecondTabPress={() => setPaymentSwitchSelection(1)}
          activeHeight={36}
          inactiveHeight={40}
        />

        <TouchableOpacity
          style={{
            margin: 15,
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}
          onPress={() => setPaymentType(0)}>
          <Text
            style={{
              fontFamily: fonts.RRegular,
              fontSize: 16,
              color: colors.lightBlackColor,
            }}>
            In Cash
          </Text>
          <Image
            source={
              paymentType === 0 ? images.radioCheckYellow : images.radioUnselect
            }
            style={{ height: 22, width: 22 }}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            margin: 15,
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}
          onPress={() => setPaymentType(1)}>
          <Text
            style={{
              fontFamily: fonts.RRegular,
              fontSize: 16,
              color: colors.lightBlackColor,
            }}>
            By check
          </Text>
          <Image
            source={
              paymentType === 1 ? images.radioCheckYellow : images.radioUnselect
            }
            style={{ height: 22, width: 22, resizeMode: 'contain' }}
          />
        </TouchableOpacity>

        <TCThinDivider marginTop={10} width={'94%'} />

        <View>
          <Text
            style={{
              fontFamily: fonts.RRegular,
              fontSize: 16,
              color: colors.lightBlackColor,
              marginLeft: 15,
              marginTop: 15,
            }}>
            {strings.amountTitle}
          </Text>
          <TextInput
            placeholder={strings.amountPlaceholder}
            style={styles.amountTxt}
            onChangeText={(text) => setAmount(text)}
            keyboardType="numeric"
            value={amount}></TextInput>
        </View>

        <View>
          <Text
            style={{
              fontFamily: fonts.RRegular,
              fontSize: 16,
              color: colors.lightBlackColor,
              marginLeft: 15,
              marginTop: 15,
            }}>
            {strings.noteTitle}
          </Text>
          <TextInput
            placeholder={strings.enterNotePlaceholder}
            style={styles.noteTxt}
            multiline
            onChangeText={(text) => setNote(text)}
            value={note}></TextInput>
        </View>
      </View>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    // backgroundColor: colors.grayBackgroundColor,
  },

  rightHeaderView: {
    flexDirection: 'row',
    marginRight: 15,
    alignItems: 'center',
  },
  amountTxt: {
    alignSelf: 'center',
    backgroundColor: colors.offwhite,
    borderRadius: 5,
    color: 'black',
    elevation: 3,
    height: 40,

    marginTop: 12,
    paddingHorizontal: 15,
    paddingRight: 30,
    shadowColor: colors.googleColor,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 1,

    width: '92%',
  },

  noteTxt: {
    alignSelf: 'center',
    backgroundColor: colors.offwhite,
    borderRadius: 5,
    color: 'black',
    elevation: 3,
    height: 100,

    marginTop: 12,
    paddingHorizontal: 15,
    paddingVertical: 15,
    shadowColor: colors.googleColor,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 1,

    width: '92%',
  },
});
