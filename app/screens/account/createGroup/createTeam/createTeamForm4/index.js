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

function CreateTeamForm4({navigation, route}) {
  const [selected, setSelected] = useState(0);
  const [matchFee, setMatchFee] = useState(0.0);
  return (
    <>
      <ScrollView style={styles.mainContainer}>
        <View style={styles.formSteps}>
          <View style={styles.form1}></View>
          <View style={styles.form2}></View>
          <View style={styles.form3}></View>
          <View style={styles.form4}></View>
        </View>
        <Text style={styles.registrationText}>Match fee</Text>
        <Text style={styles.registrationDescText}>
          When your team accepts a game reservation request from another team
          and plays a game against the team, the team will pay your team the
          below amount of the match fee. It may be refunded when the game is
          canceled.
        </Text>

        <View style={styles.matchFeeView}>
          <TextInput
            placeholder={'Enter fee'}
            style={styles.feeText}
            keyboardType={'decimal-pad'}
            onChangeText={(text) => setMatchFee(text)}
            value={matchFee}></TextInput>
          <Text style={styles.curruency}>CAD</Text>
        </View>
        <View>
          <Text style={styles.membershipText}>Cancellation Policies</Text>
          <Text style={styles.whoJoinText}>
            Please, choose one the cancellation policies below
          </Text>
        </View>

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
          <Text style={styles.radioText}>Strict</Text>
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
          <Text style={styles.radioText}>Moderate</Text>
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
          <Text style={styles.radioText}>Flexible</Text>
        </View>
        <Text style={styles.registrationDescText}>
          *Requester: The team or person who sends the game reservation request
          initialy *Requestee: The team or person who receives the game
          reservation request initialy
        </Text>

        {selected == 0 && (
          <View>
            <Text style={styles.membershipText}>Strict </Text>
            <Text style={styles.whoJoinText}>
              <Text style={styles.membershipSubText}>
                -Cancellation 7 days in advance -
              </Text>
              {'\n'}The challenge sender can cancel the game reservation up to 7
              days before the game starting time and get a 50% refund, but not
              service fee. If only 50% of the reservation has been paid, no
              refund will be issued and the remaining 50% will simply not be
              charged.
              {'\n'}
              {'\n'}{' '}
              <Text style={styles.membershipSubText}>
                {' '}
                -Cancellation less than 7 days in advance -
              </Text>
              {'\n'}
              If the challenge sender cancels less than 7 days before the game
              starting time the game fee and service fee are not refunded.
            </Text>
          </View>
        )}
        {selected == 1 && (
          <View>
            <Text style={styles.membershipText}>Moderate </Text>
            <Text style={styles.whoJoinText}>
              <Text style={styles.membershipSubText}>
                -Cancellation 14 days in advance-
              </Text>
              {'\n'}Free cancellation until 14 days before the game starting
              time.
              {'\n'}
              {'\n'}
              <Text style={styles.membershipSubText}>
                {' '}
                -Cancellation less than 14 days in advance-
              </Text>
              {'\n'}
              The challenge sender can cancel less than 7 days before the game
              starting time and get a 50% refund, but not service fee. If only
              50% of the reservation has been paid, no refund will be issued and
              the remaining 50% will simply not be charged.
              {'\n'}
              {'\n'}
              <Text style={styles.membershipSubText}>
                -Cancellation less than 24 hours in advance-
              </Text>
              If the challenge sender cancels less than 24 hours before the game
              starting time the game fee and service fee are not refunded.
            </Text>
          </View>
        )}
        {selected == 2 && (
          <View>
            <Text style={styles.membershipText}>Flexible </Text>
            <Text style={styles.whoJoinText}>
              <Text style={styles.membershipSubText}>
                -Cancellation 24 hours in advance-
              </Text>
              {'\n'}Free cancellation until 24 hours before the game starting
              time.
              {'\n'}
              {'\n'}{' '}
              <Text style={styles.membershipSubText}>
                {' '}
                -Cancellation less than 24 hours in advance-
              </Text>
              {'\n'}
              If the challenge sender cancels less than 24 hours before the game
              starting time the game fee and service fee are not refunded.
            </Text>
          </View>
        )}
        <TouchableOpacity onPress={() => console.log('Form filling ended')}>
          <LinearGradient
            colors={[colors.yellowColor, colors.themeColor]}
            style={styles.nextButton}>
            <Text style={styles.nextButtonText}>NEXT</Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </>
  );
}

export default CreateTeamForm4;
