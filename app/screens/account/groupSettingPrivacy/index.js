import React from 'react';
import {

  ScrollView,
} from 'react-native';

import styles from './style';

function GroupSettingPrivacyScreen() {
//   const [selectedMember, setSelectedMember] = useState(0);
//   const [selectedFollower, setSelectedFollower] = useState(0);

  //   const [everyoneMembers, setEveryoneMembers] = useState(true);
  //   const [followersMembers, setFollowersMembers] = useState(false);
  //   const [clubMembersMembers, setclubMembersMembers] = useState(false);
  //   const [admins, setAdmins] = useState(false);

  //   const [everyoneFollowers, setEveryoneFollowers] = useState(true);
  //   const [followersFollowers, setFollowersFollowers] = useState(false);
  //   const [clubMembersFollowers, setclubMembersFollowers] = useState(false);

  return (
    <ScrollView style={ styles.mainContainer }>

      {/* <Text style={ styles.membershipText }>{strings.connectionTitle}</Text>
          {route.params.switchBy === 'team' ? <Text style={ styles.whoJoinText }>{strings.whoCanSeeTeam}</Text> : <Text style={ styles.whoJoinText }>{strings.whoCanSeeClub}</Text>}

          <View style={ styles.radioButtonView }>
              <TouchableWithoutFeedback
          onPress={ () => {
            setSelectedMember(0);
            setEveryoneMembers(true);
            setFollowersMembers(false);
            setclubMembersMembers(false);
            setAdmins(false);
          } }>
                  {selectedMember === 0 ? (
                      <Image source={ PATH.radioSelect } style={ styles.radioImage } />
                  ) : (
                      <Image
              source={ PATH.radioUnselect }
              style={ styles.unSelectRadioImage }
            />
                  )}
              </TouchableWithoutFeedback>
              <Text style={ styles.radioText }>{strings.everyoneRadio}</Text>
          </View>
          <View style={ styles.radioButtonView }>
              <TouchableWithoutFeedback
          onPress={ () => {
            setSelectedMember(1);
            setEveryoneMembers(false);
            setFollowersMembers(true);
            setclubMembersMembers(false);
            setAdmins(false);
          } }>
                  {selectedMember === 1 ? (
                      <Image source={ PATH.radioSelect } style={ styles.radioImage } />
                  ) : (
                      <Image
              source={ PATH.radioUnselect }
              style={ styles.unSelectRadioImage }
            />
                  )}
              </TouchableWithoutFeedback>
              <Text style={ styles.radioText }>{strings.followersRadio}</Text>
          </View>
          <View style={ styles.radioButtonView }>
              <TouchableWithoutFeedback
          onPress={ () => {
            setSelectedMember(2);
            setEveryoneMembers(false);
            setFollowersMembers(false);
            setclubMembersMembers(true);
            setAdmins(false);
          } }>
                  {selectedMember === 2 ? (
                      <Image source={ PATH.radioSelect } style={ styles.radioImage } />
                  ) : (
                      <Image
              source={ PATH.radioUnselect }
              style={ styles.unSelectRadioImage }
            />
                  )}
              </TouchableWithoutFeedback>
              <Text style={ styles.radioText }>{strings.clubMembersRadio}</Text>
          </View>
          <View style={ styles.radioButtonView }>
              <TouchableWithoutFeedback
          onPress={ () => {
            setSelectedMember(3);
            setEveryoneMembers(false);
            setFollowersMembers(false);
            setclubMembersMembers(false);
            setAdmins(true);
          } }>
                  {selectedMember === 3 ? (
                      <Image source={ PATH.radioSelect } style={ styles.radioImage } />
                  ) : (
                      <Image
              source={ PATH.radioUnselect }
              style={ styles.unSelectRadioImage }
            />
                  )}
              </TouchableWithoutFeedback>
              <Text style={ styles.radioText }>{strings.adminsRadio}</Text>
          </View>

          {route.params.switchBy === 'team' ? <Text style={ [styles.whoJoinText, { marginTop: 20 }] }>{strings.whoCanSeeTeamFollowers}</Text> : <Text style={ [styles.whoJoinText, { marginTop: 20 }] }>{strings.whoCanSeeClubFollowers}</Text>}

          <View style={ styles.radioButtonView }>
              <TouchableWithoutFeedback
          onPress={ () => {
            setSelectedFollower(0);
            setEveryoneFollowers(true);
            setFollowersFollowers(false);
            setclubMembersFollowers(false);
          } }>
                  {selectedFollower === 0 ? (
                      <Image source={ PATH.radioSelect } style={ styles.radioImage } />
                  ) : (
                      <Image
              source={ PATH.radioUnselect }
              style={ styles.unSelectRadioImage }
            />
                  )}
              </TouchableWithoutFeedback>
              <Text style={ styles.radioText }>{strings.everyoneRadio}</Text>
          </View>
          <View style={ styles.radioButtonView }>
              <TouchableWithoutFeedback
          onPress={ () => {
            setSelectedFollower(1);
            setEveryoneFollowers(false);
            setFollowersFollowers(true);
            setclubMembersFollowers(false);
          } }>
                  {selectedFollower === 1 ? (
                      <Image source={ PATH.radioSelect } style={ styles.radioImage } />
                  ) : (
                      <Image
              source={ PATH.radioUnselect }
              style={ styles.unSelectRadioImage }
            />
                  )}
              </TouchableWithoutFeedback>
              <Text style={ styles.radioText }>{strings.followersRadio}</Text>
          </View>
          <View style={ styles.radioButtonView }>
              <TouchableWithoutFeedback
          onPress={ () => {
            setSelectedFollower(2);
            setEveryoneFollowers(false);
            setFollowersFollowers(false);
            setclubMembersFollowers(true);
          } }>
                  {selectedFollower === 2 ? (
                      <Image source={ PATH.radioSelect } style={ styles.radioImage } />
                  ) : (
                      <Image
              source={ PATH.radioUnselect }
              style={ styles.unSelectRadioImage }
            />
                  )}
              </TouchableWithoutFeedback>
              <Text style={ styles.radioText }>{strings.clubMembersRadio}</Text>
          </View>

          <TouchableOpacity
        onPress={ () => { console.log('Next pressed..'); }
        }>
              <LinearGradient
          colors={ [colors.yellowColor, colors.themeColor] }
          style={ styles.nextButton }>
                  <Text style={ styles.nextButtonText }>{strings.doneTitle}</Text>
              </LinearGradient>
          </TouchableOpacity> */}
    </ScrollView>
  );
}

export default GroupSettingPrivacyScreen;
