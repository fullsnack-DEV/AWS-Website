import React, {useContext, useState, useEffect, useCallback} from 'react';
import {
  View,
  StyleSheet,
  Alert,
  SafeAreaView,
  ActivityIndicator,
  BackHandler,
} from 'react-native';
import {useIsFocused} from '@react-navigation/native';
import AuthContext from '../../auth/context';
import images from '../../Constants/ImagePath';
import {getUserDetails} from '../../api/Users';
import {strings} from '../../../Localization/translation';

import OrderedSporList from './OrderedSporList';
import BottomSheet from '../modals/BottomSheet';
import ScreenHeader from '../ScreenHeader';
import SportsListModal from '../../screens/account/registerPlayer/modals/SportsListModal';
import {
  getExcludedSportsList,
  getTitleForRegister,
} from '../../utils/sportsActivityUtils';
import Verbs from '../../Constants/Verbs';

const SportActivitiesScreen = ({navigation, route}) => {
  const [loading, setloading] = useState(true);
  const [userObject, setUserObject] = useState();
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const [visibleSportsModal, setVisibleSportsModal] = useState(false);
  const [sportsData, setSportsData] = useState([]);
  const [selectedMenuOptionType, setSelectedMenuOptionType] = useState(
    Verbs.entityTypePlayer,
  );

  const {isAdmin, uid} = route.params;
  const authContext = useContext(AuthContext);
  const isFocused = useIsFocused();

  useEffect(() => {
    const sportArr = getExcludedSportsList(authContext, selectedMenuOptionType);
    sportArr.sort((a, b) =>
      a.sport_name.normalize().localeCompare(b.sport_name.normalize()),
    );
    setSportsData([...sportArr]);
  }, [authContext, selectedMenuOptionType]);

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

  const handleSportSelection = (sport) => {
    setVisibleSportsModal(false);
    let screenName = '';
    switch (selectedMenuOptionType) {
      case Verbs.entityTypePlayer:
        screenName = 'RegisterPlayer';

        break;

      case Verbs.entityTypeReferee:
        screenName = 'RegisterReferee';
        break;

      case Verbs.entityTypeScorekeeper:
        screenName = 'RegisterScorekeeper';
        break;

      default:
        break;
    }
    if (screenName) {
      navigation.navigate('AccountStack', {
        screen: screenName,
        params: {
          comeFrom: 'SportActivitiesScreen',
          routeParams: {
            isAdmin,
            uid: uid ?? authContext.entity.uid,
          },
          ...sport,
        },
      });
    }
  };
  const handleBackPress = useCallback(() => {
    if (route.params?.parentStack) {
      navigation.navigate(route.params?.parentStack, {
        screen: route.params.screen,
      });
    } else {
      navigation.goBack();
    }
  }, [navigation, route.params?.parentStack, route.params?.screen]);

  useEffect(() => {
    const backAction = () => {
      handleBackPress();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );
    return () => backHandler.remove();
  }, [handleBackPress]);

  return (
    <SafeAreaView style={styles.parent}>
      {isAdmin ? (
        <ScreenHeader
          title={strings.sportActivity}
          leftIcon={images.backArrow}
          leftIconPress={() => handleBackPress}
          rightIcon2={images.chat3Dot}
          rightIcon2Press={() => setShowMoreOptions(true)}
          containerStyle={styles.headerRow}
        />
      ) : (
        <ScreenHeader
          title={strings.sportActivity}
          leftIcon={images.backArrow}
          leftIconPress={() => handleBackPress}
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
            if (option === strings.playingTitleText) {
              setSelectedMenuOptionType(Verbs.entityTypePlayer);
            } else if (option === strings.refereeingTitleText) {
              setSelectedMenuOptionType(Verbs.entityTypeReferee);
            } else if (option === strings.scorekeepingTitleText) {
              setSelectedMenuOptionType(Verbs.entityTypeScorekeeper);
            }
            setVisibleSportsModal(true);
          }}
        />
      )}

      <BottomSheet
        isVisible={showMoreOptions}
        type="ios"
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

      <SportsListModal
        isVisible={visibleSportsModal}
        closeList={() => setVisibleSportsModal(false)}
        title={getTitleForRegister(selectedMenuOptionType)}
        sportsList={sportsData}
        onNext={handleSportSelection}
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
