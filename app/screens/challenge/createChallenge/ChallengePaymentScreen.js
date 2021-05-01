/* eslint-disable max-len */
import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,

} from 'react-native';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
  } from 'react-native-responsive-screen';
import { useIsFocused } from '@react-navigation/native';
import strings from '../../../Constants/String';
import fonts from '../../../Constants/Fonts';
import colors from '../../../Constants/Colors';
import TCGradientButton from '../../../components/TCGradientButton';
import TCKeyboardView from '../../../components/TCKeyboardView';
import TCThickDivider from '../../../components/TCThickDivider';
import TCLabel from '../../../components/TCLabel';
import TCThinDivider from '../../../components/TCThinDivider';
import TCInfoImageField from '../../../components/TCInfoImageField';
import TCInfoField from '../../../components/TCInfoField';
import EventMapView from '../../../components/Schedule/EventMapView';
import MatchFeesCard from '../../../components/challenge/MatchFeesCard';
import ChallengeHeaderView from '../../../components/challenge/ChallengeHeaderView';
import TCTouchableLabel from '../../../components/TCTouchableLabel';
import * as Utility from '../../../utils';
import TCChallengeTitle from '../../../components/TCChallengeTitle';

export default function ChallengePaymentScreen({ route, navigation }) {
    const isFocused = useIsFocused();

    const [defaultCard, setDefaultCard] = useState();

    useEffect(() => {
        if (isFocused) {
          if (route?.params?.paymentMethod) {
            setDefaultCard(route?.params?.paymentMethod);
          }
        }
      }, [isFocused, route?.params?.paymentMethod]);

  return (
    <TCKeyboardView>

      <ChallengeHeaderView/>

      <TCThickDivider/>

      <View>

        <TCLabel title={'Game · Soccer'} />
        <TCInfoImageField
          title={'Home'}
          // image = {route.params.teamData[0]?.thumbnail && route.params.teamData[0].thumbnail}
          name={'Makani Team'}
          marginLeft={30}
        />
        <TCThinDivider />
        <TCInfoImageField
          title={'Away'}
          // image = {route.params.teamData[1]?.thumbnail && route.params.teamData[1].thumbnail}
          name={'Kishan Team'}
          marginLeft={30}
        />
        <TCThinDivider />

        <TCInfoField
          title={'Time'}
          value={'Feb 15, 2020  12:00pm -\nFeb 15, 2020  3:30pm\n( 3h 30m )   '}
          marginLeft={30}
          titleStyle={{ fontSize: 16 }}
        />
        <TCThinDivider />

        <TCInfoField
          title={'Venue'}
          value={'Test Address venue'}
          marginLeft={30}
          titleStyle={{ fontSize: 16 }}
        />
        <TCThinDivider />
        <TCInfoField
          title={'Address'}
          value={'Test Address sescription'}
          marginLeft={30}
          titleStyle={{ fontSize: 16 }}
        />
        <EventMapView
          coordinate={{
            latitude: 27.45425,
            longitude: 72.456485,
          }}
          region={{
            latitude: 27.45425,
            longitude: 72.456485,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          style={styles.map}
        />
        <TCThickDivider marginTop={20} />
      </View>

      <TCLabel title={'Payment details'} style={{ marginBottom: 15 }} />
      <MatchFeesCard/>
      <TCThickDivider marginTop={20} />

      <View >
        <TCLabel title={'Payment Method'} />
        <View style={styles.viewMarginStyle}>
          <TCTouchableLabel
            title={
              defaultCard && defaultCard?.card?.brand && defaultCard?.card?.last4
                ? `${Utility.capitalize(defaultCard?.card?.brand)} ****${defaultCard?.card?.last4}`
                : strings.addOptionMessage
            }
            showNextArrow={true}
            onPress={() => {
              navigation.navigate('PaymentMethodsScreen', {
                comeFrom: 'ChallengePaymentScreen',
              })
            }}
          />
        </View>
      </View>
      <TCThickDivider marginTop={20} />

      <TCChallengeTitle
            title={'Refund Policy'}
            value={'Flexible'}
            tooltipText={
            '-Cancellation 24 hours in advance- Free cancellation until 24 hours before the game starting time.  -Cancellation less than 24 hours in advance-If the challenge sender cancels  less than 24 hours before the game starting time the game fee and service fee are not refunded.'
            }
            tooltipHeight={hp('18%')}
            tooltipWidth={wp('50%')}
          />
      <Text style={styles.normalTextStyle}>When you cancel this game reservation before
        3:55pm on August 11, you will get a 50% refund,
        minus the service fee. </Text>
      <TCThickDivider />

      <Text style={styles.termsTextStyle}>By selecting the button below, I agree to the Game Rules
        cancellation policy and refund policy. I also agree to pay
        the total amount shown above.</Text>

      <TCGradientButton
      isDisabled={!defaultCard}
        title={strings.confirmAndPayTitle}
        onPress={() => {
            navigation.push('ChallengeSentScreen');
        }}
        outerContainerStyle={{ marginBottom: 45 }}
      />
    </TCKeyboardView>
  );
}
const styles = StyleSheet.create({
  map: {
    height: 150,
    marginTop: 15,
    marginBottom: 15,
    marginLeft: 15,
  },
  viewMarginStyle: {
    marginTop: 10,
    marginBottom: 10,
  },
  normalTextStyle: {
   margin: 15,
   marginTop: 0,
    fontSize: 16,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
  },
  termsTextStyle: {
    fontSize: 14,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
    margin: 15,
  },
});
