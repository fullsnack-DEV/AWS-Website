import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ScrollView,
} from 'react-native';

import {
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import LinearGradient from 'react-native-linear-gradient';

import images from '../../../../Constants/ImagePath';
import strings from '../../../../Constants/String';
import colors from '../../../../Constants/Colors'
import fonts from '../../../../Constants/Fonts'
import TCFormProgress from '../../../../components/TCFormProgress';

export default function CreateTeamForm2({ navigation, route }) {
  const [selected, setSelected] = useState(0);
  const [canJoinEveryone, setCanJoinEveryone] = useState(true);
  const [
    joinMembershipAcceptedadmin,
    setJoinMembershipAcceptedadmin,
  ] = useState(false);
  const [canJoinInvitedPerson, setCanJoinInvitedPerson] = useState(false);
  return (
    <>
      <TCFormProgress totalSteps={4} curruentStep={2}/>
      <ScrollView style={ styles.mainContainer }>

        <Text style={ styles.membershipText }>{strings.membershipTitle}</Text>
        <Text style={ styles.whoJoinText }>{strings.whoJoinTitle}</Text>

        <View style={ styles.radioButtonView }>
          <TouchableWithoutFeedback
          onPress={ () => {
            setSelected(0);
            setCanJoinEveryone(true);
            setJoinMembershipAcceptedadmin(false);
            setCanJoinInvitedPerson(false);
          } }>
            {selected === 0 ? (
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
          <TouchableWithoutFeedback
          onPress={ () => {
            setSelected(1);
            setCanJoinEveryone(false);
            setJoinMembershipAcceptedadmin(true);
            setCanJoinInvitedPerson(false);
          } }>
            {selected === 1 ? (
              <Image source={ images.radioSelect } style={ styles.radioImage } />
          ) : (
            <Image
              source={ images.radioUnselect }
              style={ styles.unSelectRadioImage }
            />
          )}
          </TouchableWithoutFeedback>
          <Text style={ styles.radioText }>{strings.membershipRequestText}</Text>
        </View>
        <View style={ styles.radioButtonView }>
          <TouchableWithoutFeedback
          onPress={ () => {
            setSelected(2);
            setCanJoinEveryone(false);
            setJoinMembershipAcceptedadmin(false);
            setCanJoinInvitedPerson(true);
          } }>
            {selected === 2 ? (
              <Image source={ images.radioSelect } style={ styles.radioImage } />
          ) : (
            <Image
              source={ images.radioUnselect }
              style={ styles.unSelectRadioImage }
            />
          )}
          </TouchableWithoutFeedback>
          <Text style={ styles.radioText }>{strings.inviteText}</Text>
        </View>

        <TouchableOpacity
        onPress={ () => navigation.navigate('CreateTeamForm3', {
          createTeamForm2: {
            ...route.params.createTeamForm1,
            can_join_everyone: canJoinEveryone,
            join_membership_acceptedadmin: joinMembershipAcceptedadmin,
            can_join_invited_person: canJoinInvitedPerson,
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
    </>
  );
}
const styles = StyleSheet.create({

  mainContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  membershipText: {
    color: colors.lightBlackColor,
    fontSize: wp('5%'),
    marginLeft: 15,
    marginTop: 20,
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
  radioImage: {
    height: 22,
    width: 22,
    resizeMode: 'contain',
    // tintColor: colors.radioButtonColor,
    alignSelf: 'center',
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
    fontSize: wp('4%'),
    marginBottom: 20,
    marginLeft: 15,
    marginTop: 10,
  },
});
