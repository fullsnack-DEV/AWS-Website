import React, {useContext, useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Alert,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import {useIsFocused} from '@react-navigation/native';
import AuthContext from '../../auth/context';
import images from '../../Constants/ImagePath';
import {getUserDetails} from '../../api/Users';
import {strings} from '../../../Localization/translation';

import OrderedSporList from './OrderedSporList';
import BottomSheet from '../modals/BottomSheet';
import ScreenHeader from '../ScreenHeader';

const SportActivitiesScreen = ({navigation, route}) => {
  const [loading, setloading] = useState(true);
  const [userObject, setUserObject] = useState();

  const [showMoreOptions, setShowMoreOptions] = useState(false);

  const {isAdmin, uid} = route.params;
  const authContext = useContext(AuthContext);
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      setloading(true);
      getUserDetails(uid, authContext)
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
  }, [authContext, isFocused, uid]);

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
            navigation.navigate('SportActivityHome', {
              sport: sport?.sport,
              sportType: sport?.sport_type,
              uid,
              entityType,
              showPreview: true,
            });
          }}
          showAddActivityButton
          isAdmin={isAdmin}
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
