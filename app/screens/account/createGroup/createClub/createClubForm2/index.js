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
  const [registrationFee, setRegistrationFee] = useState('');
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
    /* Form as per new design */
    // <ScrollView style={styles.mainContainer}>
    //   <View style={styles.formSteps}>
    //     <View style={styles.form1}></View>
    //     <View style={styles.form2}></View>
    //   </View>
    //   <Text style={styles.membershipText}>{strings.inviteTitle}</Text>
    //   <Text style={styles.smallText}>{strings.userText}</Text>
    //   <Text style={styles.whoJoinText}>{strings.userSubtitle}</Text>

    //   <View style={styles.radioButtonView}>
    //     <TouchableWithoutFeedback onPress={() => setMembershipUserSelected(0)}>
    //       {membershipUserSelected == 0 ? (
    //         <Image source={PATH.radioSelect} style={styles.radioImage} />
    //       ) : (
    //         <Image
    //           source={PATH.radioUnselect}
    //           style={styles.unSelectRadioImage}
    //         />
    //       )}
    //     </TouchableWithoutFeedback>
    //     <Text style={styles.radioText}>{strings.noUserText}</Text>
    //   </View>
    //   <View style={styles.radioButtonView}>
    //     <TouchableWithoutFeedback onPress={() => setMembershipUserSelected(1)}>
    //       {membershipUserSelected == 1 ? (
    //         <Image source={PATH.radioSelect} style={styles.radioImage} />
    //       ) : (
    //         <Image
    //           source={PATH.radioUnselect}
    //           style={styles.unSelectRadioImage}
    //         />
    //       )}
    //     </TouchableWithoutFeedback>
    //     <Text style={styles.radioText}>{strings.yesUserText}</Text>
    //   </View>

    //   <Text style={styles.smallText}>{strings.teamText}</Text>
    //   <Text style={styles.whoJoinText}>{strings.teamSubTitle}</Text>

    //   <View style={styles.radioButtonView}>
    //     <TouchableWithoutFeedback onPress={() => setMembershipTeamSelected(0)}>
    //       {membershipTeamSelected == 0 ? (
    //         <Image source={PATH.radioSelect} style={styles.radioImage} />
    //       ) : (
    //         <Image
    //           source={PATH.radioUnselect}
    //           style={styles.unSelectRadioImage}
    //         />
    //       )}
    //     </TouchableWithoutFeedback>
    //     <Text style={styles.radioText}>{strings.noTeamText}</Text>
    //   </View>
    //   <View style={styles.radioButtonView}>
    //     <TouchableWithoutFeedback onPress={() => setMembershipTeamSelected(1)}>
    //       {membershipTeamSelected == 1 ? (
    //         <Image source={PATH.radioSelect} style={styles.radioImage} />
    //       ) : (
    //         <Image
    //           source={PATH.radioUnselect}
    //           style={styles.unSelectRadioImage}
    //         />
    //       )}
    //     </TouchableWithoutFeedback>
    //     <Text style={styles.radioText}>{strings.yesTeamText}</Text>
    //   </View>

    //   <View style={styles.separatorLine}></View>

    //   <Text style={styles.membershipText}>{strings.approvalTitle}</Text>
    //   <Text style={styles.smallText}>{strings.userText}</Text>
    //   <Text style={styles.whoJoinText}>{strings.approvalUserSubTitle}</Text>

    //   <View style={styles.radioButtonView}>
    //     <TouchableWithoutFeedback
    //       onPress={() => setMembershipRequestUserSelected(0)}>
    //       {membershipRequestUserSelected == 0 ? (
    //         <Image source={PATH.radioSelect} style={styles.radioImage} />
    //       ) : (
    //         <Image
    //           source={PATH.radioUnselect}
    //           style={styles.unSelectRadioImage}
    //         />
    //       )}
    //     </TouchableWithoutFeedback>
    //     <Text style={styles.radioText}>{strings.noUserText}</Text>
    //   </View>
    //   <View style={styles.radioButtonView}>
    //     <TouchableWithoutFeedback
    //       onPress={() => setMembershipRequestUserSelected(1)}>
    //       {membershipRequestUserSelected == 1 ? (
    //         <Image source={PATH.radioSelect} style={styles.radioImage} />
    //       ) : (
    //         <Image
    //           source={PATH.radioUnselect}
    //           style={styles.unSelectRadioImage}
    //         />
    //       )}
    //     </TouchableWithoutFeedback>
    //     <Text style={styles.radioText}>{strings.yesUserText}</Text>
    //   </View>

    //   <Text style={styles.smallText}>{strings.teamText}</Text>
    //   <Text style={styles.whoJoinText}>{strings.approvalTeamSubTitle}</Text>

    //   <View style={styles.radioButtonView}>
    //     <TouchableWithoutFeedback
    //       onPress={() => setMembershipRequestTeamSelected(0)}>
    //       {membershipRequestTeamSelected == 0 ? (
    //         <Image source={PATH.radioSelect} style={styles.radioImage} />
    //       ) : (
    //         <Image
    //           source={PATH.radioUnselect}
    //           style={styles.unSelectRadioImage}
    //         />
    //       )}
    //     </TouchableWithoutFeedback>
    //     <Text style={styles.radioText}>{strings.noTeamText}</Text>
    //   </View>
    //   <View style={styles.radioButtonView}>
    //     <TouchableWithoutFeedback
    //       onPress={() => setMembershipRequestTeamSelected(1)}>
    //       {membershipRequestTeamSelected == 1 ? (
    //         <Image source={PATH.radioSelect} style={styles.radioImage} />
    //       ) : (
    //         <Image
    //           source={PATH.radioUnselect}
    //           style={styles.unSelectRadioImage}
    //         />
    //       )}
    //     </TouchableWithoutFeedback>
    //     <Text style={styles.radioText}>{strings.yesTeamText}</Text>
    //   </View>

    //   <TouchableOpacity onPress={() => console.log('form filling ended')}>
    //     <LinearGradient
    //       colors={[colors.yellowColor, colors.themeColor]}
    //       style={styles.nextButton}>
    //       <Text style={styles.nextButtonText}>{strings.nextTitle}</Text>
    //     </LinearGradient>
    //   </TouchableOpacity>
    // </ScrollView>
    <ScrollView style={styles.mainContainer}>
      <View style={styles.formSteps}>
        <View style={styles.form1}></View>
        <View style={styles.form2}></View>
        <View style={styles.form3}></View>
      </View>

      <Text style={styles.whoJoinText}>{strings.whoJoinText}</Text>

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
        <Text style={styles.radioText}>{strings.everyoneText}</Text>
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
        <Text style={styles.radioText}>{strings.onlyPersonText}</Text>
      </View>

      <Text style={styles.whoJoinText}>{strings.whoseApprovalText}</Text>

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
        <Text style={styles.radioText}>{strings.noneText}</Text>
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
        <Text style={styles.radioText}>{strings.clubAdminText}</Text>
      </View>
      <View style={styles.fieldView}>
        <Text style={styles.fieldTitle}>{strings.registerTitle}</Text>
      </View>
      <View style={styles.matchFeeView}>
        <TextInput
          placeholder={strings.enterFeePlaceholder}
          style={styles.feeText}
          onChangeText={(text) => setRegistrationFee(text)}
          value={registrationFee}
          keyboardType={'decimal-pad'}></TextInput>
        <Text style={styles.curruency}>CAD</Text>
      </View>
      <TouchableOpacity onPress={() => navigation.navigate('CreateClubForm3')}>
        <LinearGradient
          colors={[colors.yellowColor, colors.themeColor]}
          style={styles.nextButton}>
          <Text style={styles.nextButtonText}>{strings.nextTitle}</Text>
        </LinearGradient>
      </TouchableOpacity>
    </ScrollView>
  );
}

export default CreateClubForm2;
