import React, {useContext, useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Alert,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import {useIsFocused} from '@react-navigation/native';
import * as Utility from '../../utils';
import AuthContext from '../../auth/context';
import images from '../../Constants/ImagePath';
import {getUserDetails} from '../../api/Users';
import {strings} from '../../../Localization/translation';
import Verbs from '../../Constants/Verbs';

import SportActivityModal from '../../screens/home/SportActivity/SportActivityModal';
import OrderedSporList from './OrderedSporList';
import BottomSheet from '../modals/BottomSheet';
import ScreenHeader from '../ScreenHeader';

const SportActivitiesScreen = ({navigation, route}) => {
  const [loading, setloading] = useState(true);
  const [userObject, setUserObject] = useState();
  const [selectedSport, setSelectedSport] = useState({});
  const [selectedEntity, setSelectedEntity] = useState(Verbs.entityTypePlayer);

  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const [showSportsModal, setShowSportsModal] = useState(false);

  const {isAdmin, currentUserData} = route.params;
  const authContext = useContext(AuthContext);
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      setloading(true);
      getUserDetails(authContext?.entity?.uid, authContext)
        .then((response) => {
          setloading(false);
          setUserObject(response.payload);
        })
        .catch((e) => {
          setloading(false);
          setTimeout(() => {
            Alert.alert(strings.alertmessagetitle, e.message);
          }, 10);
        });
    }
  }, [authContext, isFocused]);

  return (
    <SafeAreaView style={styles.parent}>
      {isAdmin ? (
        <ScreenHeader
          title={strings.sportActivity}
          leftIcon={images.backArrow}
          leftIconPress={() => navigation.goBack()}
          rightIcon2={images.chat3Dot}
          rightIcon2Press={() => setShowMoreOptions(true)}
          containerStyle={styles.headerRow}
        />
      ) : (
        <ScreenHeader
          title={strings.sportActivity}
          leftIcon={images.backArrow}
          leftIconPress={() => navigation.goBack()}
          containerStyle={styles.headerRow}
        />
      )}

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size={'large'} />
        </View>
      ) : (
        <OrderedSporList
          user={userObject}
          onCardPress={(sport, entityType) => {
            setSelectedSport(sport);
            setSelectedEntity(entityType);
            setShowSportsModal(true);
          }}
          showAddActivityButton
          onSelect={(option) => {
            if (option === strings.addPlaying) {
              navigation.navigate('RegisterPlayer', {
                comeFrom: 'SportActivityScreen',
              });
            } else if (option === strings.addRefereeing) {
              navigation.navigate('RegisterReferee');
            } else if (option === strings.addScorekeeping) {
              navigation.navigate('RegisterScorekeeper');
            }
          }}
        />
      )}

      <SportActivityModal
        isVisible={showSportsModal}
        closeModal={() => {
          setShowSportsModal(false);
        }}
        isAdmin={isAdmin}
        userData={currentUserData}
        sport={selectedSport?.sport}
        sportObj={selectedSport}
        sportName={Utility.getSportName(selectedSport, authContext)}
        // onSeeAll={handleSectionClick}
        handleChallengeClick={() => {
          navigation.navigate('InviteChallengeScreen', {
            setting: selectedSport?.setting,
            sportName: selectedSport?.sport,
            sportType: selectedSport?.sport_type,
            groupObj: currentUserData,
          });
        }}
        onMessageClick={() => {
          navigation.push('MessageChat', {
            screen: 'MessageChat',
            params: {userId: currentUserData?.user_id},
          });
        }}
        entityType={selectedEntity}
        continueToChallenge={() => {
          setShowSportsModal(false);
          navigation.navigate('ChallengeScreen', {
            setting: selectedSport?.setting ?? {},
            sportName: selectedSport?.sport,
            sportType: selectedSport?.sport_type,
            groupObj: currentUserData,
          });
        }}
        bookReferee={() => {
          navigation.navigate('RefereeBookingDateAndTime', {
            settingObj: selectedSport?.setting ?? {},
            userData: currentUserData,
            showMatches: true,
            sportName: selectedSport?.sport,
          });
        }}
        bookScoreKeeper={() => {
          navigation.navigate('ScorekeeperBookingDateAndTime', {
            settingObj: selectedSport?.setting ?? {},
            userData: currentUserData,
            showMatches: true,
            sportName: selectedSport?.sport,
          });
        }}
      />

      <BottomSheet
        isVisible={showMoreOptions}
        closeModal={() => setShowMoreOptions(false)}
        optionList={[strings.editOrder, strings.hideUnhide]}
        onSelect={(option) => {
          setShowMoreOptions(false);
          if (option === strings.editOrder) {
            navigation.navigate('SportActivityTagScreen');
          }
          if (option === strings.hideUnhide) {
            navigation.navigate('SportHideUnhideScreen');
          }
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  parent: {
    flex: 1,
  },
  headerRow: {
    paddingHorizontal: 10,
    paddingTop: 6,
    paddingBottom: 14,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default SportActivitiesScreen;
