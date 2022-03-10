import React, { useState, useContext } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Alert,
  SafeAreaView,
} from 'react-native';

import TCInfoField from '../../../../components/TCInfoField';
import { getGroupRequest } from '../../../../api/Groups';

import AuthContext from '../../../../auth/context';
import ActivityLoader from '../../../../components/loader/ActivityLoader';
import strings from '../../../../Constants/String';
import fonts from '../../../../Constants/Fonts';
import colors from '../../../../Constants/Colors';
import TCLabel from '../../../../components/TCLabel';
import TCFormProgress from '../../../../components/TCFormProgress';
import TCThinDivider from '../../../../components/TCThinDivider';
import TCPlayerImageInfo from '../../../../components/TCPlayerImageInfo';
import TCSmallButton from '../../../../components/TCSmallButton';
import { getSportName, widthPercentageToDP } from '../../../../utils';
import TeamStatus from './TeamStatus';

export default function RespondToInviteScreen({ navigation, route }) {
  const { teamObject } = route?.params ?? {};
  const authContext = useContext(AuthContext);
  // eslint-disable-next-line no-unused-vars
  const entity = authContext.entity;
  const [loading, setloading] = useState(false);

  const onAcceptDecline = (type, groupId) => {
    setloading(true);
    getGroupRequest(type, groupId, authContext)
      .then((response) => {
        setloading(false);

        // if (
        //   entity.role === ('user' || 'player')
        //   && teamObject?.sport?.toLowerCase() === 'Tennis Double'.toLowerCase()
        // ) {
        //   navigation.push('HomeScreen', {
        //     uid: response.payload.group_id,
        //     role: response.payload.entity_type,
        //     backButtonVisible: false,
        //     menuBtnVisible: false,
        //     isDoubleSportTeamCreated: true,
        //     name: teamObject?.player2?.full_name,
        //   });
        // } else {

        console.log('Team created res:=>', response.payload);
        if (type === 'accept') {
          navigation.push('HomeScreen', {
            uid: response.payload.group_id,
            role: response.payload.entity_type,
            backButtonVisible: false,
            menuBtnVisible: false,
            isEntityCreated: true,
            groupName: response.payload.group_name,
            entityObj: response.payload,
          });
        } else {
          navigation.goBack();
        }

        // }
      })
      .catch((e) => {
        setloading(false);
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, e.message);
        }, 10);
      });
  };

  const getStatusMessage = () => {
    if (teamObject?.status === TeamStatus.declined) {
      return 'This request is already declined.';
    }
    if (teamObject?.status === TeamStatus.cancelled) {
      return 'This request is already deleted.';
    }
    if (teamObject?.status === TeamStatus.accepted) {
      return 'This request is already accepted.';
    }
    if (teamObject?.status === TeamStatus.invalid) {
      return 'This request is not valid now.';
    }
    return 'status not defined';
  };

  return (
    <>
      <TCFormProgress totalSteps={3} curruentStep={3} />
      <ScrollView
        style={styles.mainContainer}
        showsVerticalScrollIndicator={false}>
        <ActivityLoader visible={loading} />

        <TCLabel title={strings.invitetocreateteam} />

        <TCInfoField
          title={'Sport'}
          value={getSportName(teamObject, authContext)}
          marginLeft={25}
          marginTop={30}
        />
        <TCThinDivider marginTop={5} marginBottom={3} />

        {teamObject?.sport?.toLowerCase() === 'Tennis Double'.toLowerCase() && (
          <View>
            <TCPlayerImageInfo
              title={'Players'}
              player1Image={teamObject?.player1?.thumbnail}
              player2Image={teamObject?.player2?.thumbnail}
              player1Name={teamObject?.player1?.full_name}
              player2Name={teamObject?.player2?.full_name}
              marginLeft={25}
              marginRight={25}
              marginTop={10}
            />
            <TCThinDivider marginTop={10} marginBottom={5} />
          </View>
        )}

        <TCInfoField
          title={'Team name'}
          value={teamObject?.group_name}
          marginLeft={25}
        />
        <TCThinDivider marginTop={5} marginBottom={3} />

        <TCInfoField
          title={'Home city'}
          value={teamObject?.city}
          marginLeft={25}
        />
        <TCThinDivider marginTop={5} marginBottom={3} />

        {teamObject?.sport?.toLowerCase() !== 'Tennis Double'.toLowerCase() && (
          <View>
            <TCInfoField
              title={'Members’ gender'}
              value={
                teamObject?.gender?.charAt(0)?.toUpperCase()
                + teamObject?.gender?.slice(1)
              }
              marginLeft={25}
            />
            <TCThinDivider marginTop={5} marginBottom={3} />

            <TCInfoField
              title={'Members’ ages'}
              value={`Min ${teamObject?.min_age ?? 'N/A'} Max ${
                teamObject?.max_age ?? 'N/A'
              }`}
              marginLeft={25}
            />
            <TCThinDivider marginTop={5} marginBottom={3} />
          </View>
        )}

        <TCInfoField
          title={'Language'}
          value={teamObject?.language.join(', ')}
          marginLeft={25}
        />
        <TCThinDivider marginTop={5} marginBottom={3} />

        <Text style={styles.describeTitle} numberOfLines={2}>
          Describe
        </Text>
        <Text style={styles.describeText} numberOfLines={50}>
          {teamObject?.descriptions}
        </Text>

        <View style={{ flex: 1 }} />
      </ScrollView>
      {teamObject?.status !== TeamStatus.new ? (
        <Text
          style={{
            marginBottom: 50,
            marginLeft: 15,
            fontSize: 20,
            fontFamily: fonts.RRegular,
            color: colors.lightBlackColor,
          }}>
          {getStatusMessage()}
        </Text>
      ) : (
        <SafeAreaView>
          <TCLabel
            title={strings.whouldYouLikeToAccept}
            style={{ marginBottom: 15 }}
          />

          <View style={styles.bottomButtonContainer}>
            <TCSmallButton
              isBorderButton={true}
              borderstyle={{
                borderColor: colors.userPostTimeColor,
                borderWidth: 1,
                borderRadious: 80,
              }}
              textStyle={{ color: colors.userPostTimeColor }}
              title={strings.declineTitle}
              onPress={() => {
                onAcceptDecline('decline', teamObject?.group_id);
              }}
              style={{ width: widthPercentageToDP('45%') }}
            />
            <TCSmallButton
              title={strings.acceptTitle}
              onPress={() => {
                onAcceptDecline('accept', teamObject?.group_id);
              }}
              style={{ width: widthPercentageToDP('45%') }}
            />
          </View>
        </SafeAreaView>
      )}
    </>
  );
}
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    flexDirection: 'column',
  },

  describeTitle: {
    fontSize: 16,
    color: colors.lightBlackColor,
    fontFamily: fonts.RLight,
    marginTop: 5,
    marginBottom: 3,
    marginLeft: 25,
  },
  describeText: {
    fontSize: 16,
    color: colors.lightBlackColor,
    fontFamily: fonts.RRegular,
    marginTop: 5,
    marginBottom: 3,
    marginLeft: 25,
  },
  bottomButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    margin: 15,
  },
});
