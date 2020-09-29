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
import CreateClubForm1 from '../createClubForm1';

import constants from '../../../../../config/constants';
const {colors, fonts, urls} = constants;
import PATH from '../../../../../Constants/ImagePath';
import strings from '../../../../../Constants/String';

function CreateClubForm2({navigation, route}) {
  const [selected, setSelected] = useState(0);
  const [membershipUserSelected, setMembershipUserSelected] = useState(0);
  const [membershipTeamSelected, setMembershipTeamSelected] = useState(0);
  const [
    membershipRequestUserSelected,
    setMembershipRequestUserSelected,
  ] = useState(0);
  const [
    membershipRequestTeamSelected,
    setMembershipRequestTeamSelected,
  ] = useState(0);

  return (
    <ScrollView style={styles.mainContainer}>
      <View style={styles.formSteps}>
        <View style={styles.form1}></View>
        <View style={styles.form2}></View>
      </View>
      <Text style={styles.membershipText}>Invitation to Membership</Text>
      <Text style={styles.smallText}>USER</Text>
      <Text style={styles.whoJoinText}>
        Does a user need an invitation from the club to join It?
      </Text>

      <View style={styles.radioButtonView}>
        <TouchableWithoutFeedback onPress={() => setMembershipUserSelected(0)}>
          {membershipUserSelected == 0 ? (
            <Image source={PATH.radioSelect} style={styles.radioImage} />
          ) : (
            <Image
              source={PATH.radioUnselect}
              style={styles.unSelectRadioImage}
            />
          )}
        </TouchableWithoutFeedback>
        <Text style={styles.radioText}>No, a user doesn’t.</Text>
      </View>
      <View style={styles.radioButtonView}>
        <TouchableWithoutFeedback onPress={() => setMembershipUserSelected(1)}>
          {membershipUserSelected == 1 ? (
            <Image source={PATH.radioSelect} style={styles.radioImage} />
          ) : (
            <Image
              source={PATH.radioUnselect}
              style={styles.unSelectRadioImage}
            />
          )}
        </TouchableWithoutFeedback>
        <Text style={styles.radioText}>Yes, a user does.</Text>
      </View>

      <Text style={styles.smallText}>TEAM</Text>
      <Text style={styles.whoJoinText}>
        Does a user need an invitation from the club to join It?
      </Text>

      <View style={styles.radioButtonView}>
        <TouchableWithoutFeedback onPress={() => setMembershipTeamSelected(0)}>
          {membershipTeamSelected == 0 ? (
            <Image source={PATH.radioSelect} style={styles.radioImage} />
          ) : (
            <Image
              source={PATH.radioUnselect}
              style={styles.unSelectRadioImage}
            />
          )}
        </TouchableWithoutFeedback>
        <Text style={styles.radioText}>No, a team doesn’t.</Text>
      </View>
      <View style={styles.radioButtonView}>
        <TouchableWithoutFeedback onPress={() => setMembershipTeamSelected(1)}>
          {membershipTeamSelected == 1 ? (
            <Image source={PATH.radioSelect} style={styles.radioImage} />
          ) : (
            <Image
              source={PATH.radioUnselect}
              style={styles.unSelectRadioImage}
            />
          )}
        </TouchableWithoutFeedback>
        <Text style={styles.radioText}>Yes, a team does.</Text>
      </View>

      <View style={styles.separatorLine}></View>

      <Text style={styles.membershipText}>Approval for Membership request</Text>
      <Text style={styles.smallText}>USER</Text>
      <Text style={styles.whoJoinText}>
        Does a user need the approval for his or her membership request from the
        club to join it?
      </Text>

      <View style={styles.radioButtonView}>
        <TouchableWithoutFeedback
          onPress={() => setMembershipRequestUserSelected(0)}>
          {membershipRequestUserSelected == 0 ? (
            <Image source={PATH.radioSelect} style={styles.radioImage} />
          ) : (
            <Image
              source={PATH.radioUnselect}
              style={styles.unSelectRadioImage}
            />
          )}
        </TouchableWithoutFeedback>
        <Text style={styles.radioText}>No, a user doesn’t.</Text>
      </View>
      <View style={styles.radioButtonView}>
        <TouchableWithoutFeedback
          onPress={() => setMembershipRequestUserSelected(1)}>
          {membershipRequestUserSelected == 1 ? (
            <Image source={PATH.radioSelect} style={styles.radioImage} />
          ) : (
            <Image
              source={PATH.radioUnselect}
              style={styles.unSelectRadioImage}
            />
          )}
        </TouchableWithoutFeedback>
        <Text style={styles.radioText}>Yes, a user does.</Text>
      </View>

      <Text style={styles.smallText}>TEAM</Text>
      <Text style={styles.whoJoinText}>
        Does a user need the approval for its membership request from the club
        to join it?
      </Text>

      <View style={styles.radioButtonView}>
        <TouchableWithoutFeedback
          onPress={() => setMembershipRequestTeamSelected(0)}>
          {membershipRequestTeamSelected == 0 ? (
            <Image source={PATH.radioSelect} style={styles.radioImage} />
          ) : (
            <Image
              source={PATH.radioUnselect}
              style={styles.unSelectRadioImage}
            />
          )}
        </TouchableWithoutFeedback>
        <Text style={styles.radioText}>No, a team doesn’t.</Text>
      </View>
      <View style={styles.radioButtonView}>
        <TouchableWithoutFeedback
          onPress={() => setMembershipRequestTeamSelected(1)}>
          {membershipRequestTeamSelected == 1 ? (
            <Image source={PATH.radioSelect} style={styles.radioImage} />
          ) : (
            <Image
              source={PATH.radioUnselect}
              style={styles.unSelectRadioImage}
            />
          )}
        </TouchableWithoutFeedback>
        <Text style={styles.radioText}>Yes, a team does.</Text>
      </View>
      <TouchableOpacity onPress={() => console.log('form filling ended')}>
        <LinearGradient
          colors={[colors.yellowColor, colors.themeColor]}
          style={styles.nextButton}>
          <Text style={styles.nextButtonText}>NEXT</Text>
        </LinearGradient>
      </TouchableOpacity>
    </ScrollView>
  );
}

export default CreateClubForm2;
