import {View, StyleSheet, ActivityIndicator} from 'react-native';
import React, {useEffect, useContext, useState} from 'react';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import CustomModalWrapper from '../../../components/CustomModalWrapper';
import {strings} from '../../../../Localization/translation';

import ScreenHeader from '../../../components/ScreenHeader';
import images from '../../../Constants/ImagePath';
import {
  getExcludedSportsList,
  getTitleForRegister,
} from '../../../utils/sportsActivityUtils';
import AuthContext from '../../../auth/context';
import {getUserDetails} from '../../../api/Users';
import Verbs from '../../../Constants/Verbs';
import OrderedSporList from '../../../components/Home/OrderedSporList';
import BottomSheet from '../../../components/modals/BottomSheet';
import SportsListModal from '../../account/registerPlayer/modals/SportsListModal';
import SportAcitivityTagModal from '../SportAcitivityTagModal';
import SportHideUnHideModal from '../SportHideUnHideModal';

export default function SportActivitiesModal({
  isVisible,
  onCloseModal,
  isAdmin,
  uid,
}) {
  const [loading, setloading] = useState(true);
  const [userObject, setUserObject] = useState();
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const [visibleSportsModal, setVisibleSportsModal] = useState(false);
  const [sportsData, setSportsData] = useState([]);
  const [selectedMenuOptionType, setSelectedMenuOptionType] = useState(
    Verbs.entityTypePlayer,
  );
  const [VisibleTagModal, setVisibleTagModal] = useState(false);
  const [visibleHideModal, setVisibleHideModal] = useState(false);
  const isFocused = useIsFocused();
  const authContext = useContext(AuthContext);
  const navigation = useNavigation();

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
          console.log(e.meesage);
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

  return (
    <CustomModalWrapper
      isVisible={isVisible}
      closeModal={onCloseModal}
      // modalType={ModalTypes.style2}
      // title={strings.sportActivity}
      containerStyle={{padding: 0, flex: 1}}>
      {isAdmin ? (
        <ScreenHeader
          title={strings.sportActivity}
          leftIcon={images.backArrow}
          leftIconPress={() => onCloseModal()}
          rightIcon2={images.chat3Dot}
          rightIcon2Press={() => setShowMoreOptions(true)}
          containerStyle={styles.headerRow}
        />
      ) : (
        <ScreenHeader
          title={strings.sportActivity}
          leftIcon={images.backArrow}
          leftIconPress={() => onCloseModal()}
          containerStyle={styles.headerRow}
        />
      )}

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size={'large'} />
        </View>
      ) : (
        <View style={{flex: 1}}>
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
        </View>
      )}

      <BottomSheet
        isVisible={showMoreOptions}
        type="ios"
        closeModal={() => setShowMoreOptions(false)}
        optionList={[strings.editOrder, strings.hideUnhide]}
        onSelect={(option) => {
          setShowMoreOptions(false);
          if (option === strings.editOrder) {
            setVisibleTagModal(true);
            // navigation.navigate('SportActivityTagScreen');
          }
          if (option === strings.hideUnhide) {
            setVisibleHideModal(true);
            // navigation.navigate('SportHideUnhideScreen');
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

      <SportAcitivityTagModal
        isVisible={VisibleTagModal}
        onCloseModal={() => setVisibleTagModal(false)}
      />
      <SportHideUnHideModal
        isVisible={visibleHideModal}
        onCloseModal={() => setVisibleHideModal()}
      />
    </CustomModalWrapper>
  );
}

const styles = StyleSheet.create({
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
