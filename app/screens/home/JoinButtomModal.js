import {Text, View} from 'react-native';
import React, {useMemo, useState, useContext} from 'react';
import {useNavigation} from '@react-navigation/native';

// eslint-disable-next-line import/no-extraneous-dependencies
import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetBackdrop,
} from '@gorhom/bottom-sheet';
import {format} from 'react-string-format';
import colors from '../../Constants/Colors';
import AuthContext from '../../auth/context';

import {strings} from '../../../Localization/translation';
import fonts from '../../Constants/Fonts';

import Verbs from '../../Constants/Verbs';

import GroupInfo from '../../components/Home/GroupInfo';
import TCThinDivider from '../../components/TCThinDivider';

const renderBackdrop = (props) => (
  <BottomSheetBackdrop
    {...props}
    disappearsOnIndex={-1}
    appearsOnIndex={1}
    style={{
      backgroundColor: colors.modalBackgroundColor,
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      height: '99%',
    }}
    opacity={6}
  />
);

export default function JoinButtonModal({
  JoinButtonModalRef,
  currentUserData,
  onJoinPress,
  onAcceptPress,
  isInvited = false,
  hideMessageBox = false,
}) {
  const snapPoints = useMemo(() => ['95%', '95%'], []);
  const [selectedVenue] = useState([]);
  const authContext = useContext(AuthContext);
  const navigation = useNavigation();

  return (
    <BottomSheetModalProvider>
      <BottomSheetModal
        ref={JoinButtonModalRef}
        backgroundStyle={{
          borderRadius: 10,
        }}
        index={1}
        handleIndicatorStyle={{
          backgroundColor: colors.modalHandleColor,
          width: 40,
          height: 5,
          marginTop: 5,
          alignSelf: 'center',
          borderRadius: 5,
        }}
        snapPoints={snapPoints}
        enablePanDownToClose={true}
        enableDismissOnClose
        backdropComponent={renderBackdrop}>
        <View style={{flex: 1}}>
          <View>
            <Text
              style={{
                alignItems: 'center',
                textAlign: 'center',
                fontFamily: fonts.RBold,
                fontSize: 16,
                lineHeight: 24,
                marginTop: 5,
                marginBottom: 5,
              }}>
              {format(strings.joinModaltitle, currentUserData?.entity_type)}
            </Text>
            <TCThinDivider height={1} width={'100%'} marginTop={5} />
          </View>

          {/* Team Ifo */}

          <GroupInfo
            navigation={navigation}
            groupDetails={currentUserData}
            isAdmin={currentUserData?.am_i_admin}
            authContext={authContext}
            onSeeAll={(option = '', clubsofteam = []) => {
              switch (option) {
                case strings.membersTitle:
                  navigation.navigate('App', {
                    screen: 'Members',
                    params: {
                      groupObj: currentUserData,
                      groupID: currentUserData.group_id,
                      fromProfile: true,
                      showBackArrow: true,
                    },
                  });
                  break;

                case strings.clubsTitleText:
                  navigation.push('GroupListScreen', {
                    groups: clubsofteam,
                    entity_type: Verbs.entityTypeClub,
                  });
                  break;

                case strings.teams:
                  navigation.push('GroupListScreen', {
                    groups: currentUserData.joined_teams,
                    entity_type: Verbs.entityTypeTeam,
                  });
                  break;

                default:
                  break;
              }
            }}
            onPressMember={(groupObject) => {
              navigation.push('HomeScreen', {
                uid: groupObject?.user_id,
                role: Verbs.entityTypeUser,
              });
            }}
            onPressGroup={(groupObject) => {
              navigation.push('HomeScreen', {
                uid: groupObject?.group_id,
                backButtonVisible: true,
                role: groupObject?.entity_type,
              });
            }}
            selectedVenue={selectedVenue}
            forJoinButton={true}
            onJoinPress={(message) => onJoinPress(message)}
            onAcceptPress={() => onAcceptPress()}
            isInvited={isInvited}
            isAccept={isInvited}
            hideMessageBox={hideMessageBox}
          />
        </View>
      </BottomSheetModal>
    </BottomSheetModalProvider>
  );
}
