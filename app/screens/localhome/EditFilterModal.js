import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  Pressable,
  Modal,
  TouchableWithoutFeedback,
  Dimensions,
  Image,
  ActivityIndicator,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import React, {useCallback, useEffect, useState, useContext} from 'react';
import {FlatList, GestureHandlerRootView} from 'react-native-gesture-handler';
import DraggableFlatList from 'react-native-draggable-flatlist';
import CustomModalWrapper from '../../components/CustomModalWrapper';
import {ModalTypes} from '../../Constants/GeneralConstants';
import {strings} from '../../../Localization/translation';
import fonts from '../../Constants/Fonts';
import {getSportDetails, getSportList} from '../../utils/sportsActivityUtils';
import images from '../../Constants/ImagePath';
import colors from '../../Constants/Colors';
import {getHitSlop, getStorage, setStorage, showAlert} from '../../utils';
import AuthContext from '../../auth/context';
import ScreenHeader from '../../components/ScreenHeader';
import {getUserDetails, updateUserProfile} from '../../api/Users';
import ActivityLoader from '../../components/loader/ActivityLoader';
import Verbs from '../../Constants/Verbs';
import {getGroupDetails, patchGroup} from '../../api/Groups';

export default function EditFilterModal({
  visible,
  onClose,
  sportList = [],
  onApplyPress = () => {},
}) {
  const authContext = useContext(AuthContext);

  const [sports, setsports] = useState([]);
  const [image_base_url, setImageBaseUrl] = useState();
  const [visibleAddModal, setVisibleAddModal] = useState(false);
  const [allSports, setAllsports] = useState([]);
  const [favsport, setFavSport] = useState([]);
  const [addedSport, setAddedsport] = useState([]);
  const [loading, setLoading] = useState(false);
  const [registerSports, setRegisterSport] = useState([]);
  const [notRegisterSport, setNotRegisterSport] = useState([]);
  const [isSaved, setisSaved] = useState(false);

  useEffect(() => {
    GetandSetSportsLists();

    setisSaved(false);
  }, [visible, sportList, authContext]);

  const GetandSetSportsLists = async () => {
    // setLoading(true);
    getStorage('appSetting')
      .then((setting) => {
        setImageBaseUrl(setting.base_url_sporticon);
      })
      .catch((e) => {
        console.log(e);
      });

    const newFavSports = [...favsport];
    sportList.forEach((item) => {
      if (!newFavSports.includes(item)) {
        newFavSports.push(item);
      }
    });

    const handleSportData = (userSport) => {
      const registeredSports =
        userSport.payload?.registered_sports?.map((item) => item) || [];

      const registerButDeactivated = (
        userSport.payload?.registered_sports || []
      ).filter((item) => item.is_active === false);

      const scorekeeperSports =
        userSport.payload?.scorekeeper_data?.map((item) => item) || [];

      // const likedsports = userSport.payload?.sports?.map((item) => item) || [];
      const refereeSports =
        userSport.payload?.referee_data?.map((item) => item) || [];

      const refreeRegisterButDeactivated = (
        userSport.payload?.referee_data || []
      )
        .filter((item) => item.is_active === false)
        .map((item) => item.sport_name);

      const scoreKeeperRegisterButDeactivated = (
        userSport.payload?.scorekeeper_data || []
      )
        .filter((item) => item.is_active === false)
        .map((item) => item.sport_name);

      const clubFavSport =
        authContext.entity.role === Verbs.entityTypeClub
          ? userSport.payload?.sports.map((item) => item) || []
          : [];

      const uniqueSports = [
        ...(authContext.entity.role === Verbs.entityTypeClub
          ? clubFavSport
          : [...registeredSports, ...scorekeeperSports, ...refereeSports]),
      ];

      const res = uniqueSports.map((obj) => ({
        sport: obj.sport,
        sport_type: obj.sport_type,
        sport_name: obj.sport_name ?? obj.sport,
      }));

      const result = res.reduce((unique, o) => {
        if (
          !unique.some(
            (obj) => obj.sport === o.sport && obj.sport_type === o.sport_type,
          )
        ) {
          unique.push(o);
        }

        return unique;
      }, []);

      const registerSportNames = result.map((item) => item.sport_name);

      const PlayingsportNames = (userSport.payload?.registered_sports || [])
        .filter((item) => item.is_active === true)
        .map((item) => item.sport_name ?? item.sport);

      const refreSportNames = (userSport.payload?.referee_data || [])
        .filter((item) => item.is_active === true)
        .map((item) => item.sport_name);

      const scoreKeeperSportNames = (userSport.payload?.scorekeeper_data || [])
        .filter((item) => item.is_active === true)
        .map((item) => item.sport_name);

      const removedDeactivatedSport = registerSportNames.filter(
        (sportName) =>
          (!registerButDeactivated.some(
            (item) =>
              item?.sport === sportName || item?.sport_name === sportName,
          ) &&
            !refreeRegisterButDeactivated.includes(sportName)) ||
          !scoreKeeperRegisterButDeactivated.includes(sportName) ||
          PlayingsportNames.includes(sportName) ||
          refreSportNames.includes(sportName) ||
          scoreKeeperSportNames.includes(sportName),
      );

      const commonObjects = favsport.filter(
        (item) => !removedDeactivatedSport.includes(item.sport_name),
      );

      if (authContext.entity.role !== Verbs.entityTypeClub) {
        setAddedsport([...result, ...commonObjects]);
      } else {
        setAddedsport([...result, ...commonObjects]);
      }

      setLoading(false);
      setFavSport(sportList);
      setsports(sportList);
      setRegisterSport(result);
      setNotRegisterSport(commonObjects);

      getAllsportData();
    };

    if (authContext.entity.role === Verbs.entityTypeClub) {
      getGroupDetails(authContext?.entity?.uid, authContext)
        .then((userSport) => {
          handleSportData(userSport);
        })
        .catch((error) => {
          setLoading(false);
          console.log(error);
        });
    } else {
      getUserDetails(authContext.entity.uid, authContext)
        .then((userSport) => {
          handleSportData(userSport);
        })
        .catch((error) => {
          setLoading(false);
          console.log(error);
        });
    }

    setLoading(false);
  };

  const getAllsportData = () => {
    const sportArr = getSportList(authContext.sports);
    sportArr.sort((a, b) =>
      a.sport_name.normalize().localeCompare(b.sport_name.normalize()),
    );

    setAllsports([...sportArr]);
  };

  const renderImageforSport = useCallback(
    (item) => {
      const sportDetails = getSportDetails(
        item?.sport,
        item?.sport_type,
        authContext?.sports,
      );

      const sportImage = sportDetails?.sport_image || '';

      return (
        <>
          {image_base_url === '' ? (
            <ActivityIndicator size={'small'} color={colors.blackColor} />
          ) : (
            <FastImage
              source={{uri: `${image_base_url}${sportImage}`}}
              style={{height: 40, width: 40}}
            />
          )}
        </>
      );
    },
    [authContext.sports, image_base_url],
  );

  const FavSportCheck = (item) => {
    const isSportAdded = favsport.some(
      (favItem) =>
        favItem.sport_name.toLowerCase() === item.sport_name.toLowerCase(),
    );

    return isSportAdded;
  };

  const FavSportImageCheck = useCallback(
    (item) => {
      const filteredFavSport = favsport.filter(
        (favItem) =>
          !notRegisterSport.some(
            (notRegisteredItem) =>
              favItem.sport_name.toLowerCase() ===
              notRegisteredItem.sport_name.toLowerCase(),
          ),
      );

      const isSportAdded = filteredFavSport.some(
        (favItem) =>
          favItem.sport_name.toLowerCase() === item.sport_name.toLowerCase(),
      );

      return isSportAdded;
    },
    [favsport, notRegisterSport],
  );

  const CheckisRegister = (item) => {
    const isRegisterSport = notRegisterSport.some(
      (regSport) =>
        regSport.sport_name.toLowerCase() === item.sport_name.toLowerCase(),
    );

    return isRegisterSport;
  };

  const toggleSport = (item) => {
    const index = addedSport.findIndex(
      (sportItem) =>
        sportItem.sport_name.toLowerCase() === item.sport_name.toLowerCase(),
    );

    const indexed = addedSport.findIndex(
      (sportItem) =>
        sportItem.sport_name.toLowerCase() === item.sport_name.toLowerCase(),
    );

    // Remove
    if (indexed === 0) {
      const filteredsport = sports.filter(
        (sportItem) =>
          sportItem.sport_name.toLowerCase() !== item.sport_name.toLowerCase(),
      );

      setsports([...filteredsport]);
    }

    if (index === -1) {
      const newSport = {
        sport: item.sport,
        sport_name: item.sport_name,
        sport_type: item.sport_type,
      };

      const newAddedSport = [...addedSport, newSport];

      const sortedNewAddedSport = newAddedSport
        .slice(sportList.length)
        .sort((a, b) => a.sport_name.localeCompare(b.sport_name));

      const result = [
        ...newAddedSport.slice(0, sportList.length),
        ...sortedNewAddedSport,
      ];

      if (result.length > 20) {
        showAlert(strings.only20SportsAlert);
        // eslint-disable-next-line no-useless-return
        return;
        // eslint-disable-next-line no-else-return
      } else {
        const filteredData = result.filter(
          (i) => i.sport !== undefined && i.sport_type !== undefined,
        );

        setAddedsport([...filteredData]);
      }
    } else {
      const newAddedSport = addedSport.filter(
        (sportItem) =>
          sportItem.sport_name.toLowerCase() !== item.sport_name.toLowerCase(),
      );

      setAddedsport([...newAddedSport]);
    }
  };

  const onEditSport = async () => {
    setLoading(true);
    if (authContext.entity.role !== Verbs.entityTypeClub) {
      const entity = authContext.entity;

      entity.auth.user.favouriteSport = sports;

      const body = {
        favouriteSport: sports,
      };
      updateUserProfile(body, authContext)
        .then(async () => {
          await setStorage('authContextEntity', {...entity});
          setAddedsport([]);
          onApplyPress(sports);
          setLoading(false);
          onClose();
        })
        .catch((e) => {
          console.log(e.message);
        });

      return;
    }

    const grp_id = authContext.entity.obj.group_id;
    const body = {};
    body.favouriteSport = sports;

    patchGroup(grp_id, body, authContext)
      .then(async (response) => {
        const entity = authContext.entity;
        entity.obj = response.payload;
        authContext.setEntity({...entity});
        setStorage('authContextEntity', {...entity});
        setLoading(false);
        onApplyPress(sports);
        onClose();
      })
      .catch((e) => {
        setLoading(false);
        console.log(e.message);
      });
  };

  const checkSportAdded = useCallback(
    (item) => {
      const isImagecheck = addedSport.some(
        (favItem) =>
          favItem.sport_name.toLowerCase() === item.sport_name.toLowerCase(),
      );

      return isImagecheck;
    },
    [addedSport],
  );

  const renderItem = ({item, drag, isActive}) => (
    <View style={[styles.card, styles.row, {marginBottom: 15}]}>
      <View
        style={[
          styles.row,
          {
            justifyContent: 'flex-start',
          },
        ]}>
        <View style={{marginRight: 13}}>{renderImageforSport(item)}</View>
        <Text style={styles.label}>{item.sport_name}</Text>
      </View>

      <TouchableOpacity
        hitSlop={getHitSlop(10)}
        style={styles.dragImageContainer}
        onLongPress={drag}
        disabled={isActive}>
        <Image source={images.moveIcon} style={styles.image} />
      </TouchableOpacity>
    </View>
  );

  const onCloseModal = () => {
    if (isSaved) {
      onEditSport();
      return;
    }
    onClose();
  };

  return (
    <>
      <Modal visible={visible} collapsable transparent animationType="fade">
        <GestureHandlerRootView style={{flex: 1}}>
          <View style={styles.parent}>
            <View style={styles.Mcard}>
              <ScreenHeader
                leftIcon={images.crossImage}
                leftIconPress={() => {
                  onCloseModal();
                  setAddedsport([]);
                }}
                rightButtonText={strings.apply}
                title={strings.editFavSportTitle}
                onRightButtonPress={() => onEditSport()}
                isRightIconText
              />
              <View style={{marginHorizontal: 20}}>
                <ActivityLoader visible={loading} />
                <Text style={styles.topText}>
                  {' '}
                  {strings.settingModaltitle}{' '}
                </Text>
                <TouchableWithoutFeedback>
                  <DraggableFlatList
                    scrollEnabled
                    autoscrollSpeed={200}
                    style={{
                      height: Dimensions.get('window').height * 0.75,
                    }}
                    data={sports}
                    onDragEnd={({data}) => {
                      setsports(data);
                    }}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={renderItem}
                    ListFooterComponent={() => (
                      <TouchableOpacity
                        style={styles.addordeletebtn}
                        onPress={() => setVisibleAddModal(true)}>
                        <Text style={styles.adddeletetext}>
                          {strings.addOrDelete}
                        </Text>
                      </TouchableOpacity>
                    )}
                    bounces={false}
                    showsVerticalScrollIndicator={false}
                  />
                </TouchableWithoutFeedback>
              </View>
            </View>
          </View>
        </GestureHandlerRootView>

        <CustomModalWrapper
          isVisible={visibleAddModal}
          title={strings.addorDeleteFavSportTitle}
          closeModal={() => {
            setVisibleAddModal(false);
            setAddedsport([...sportList]);
            if (authContext.entity.role !== Verbs.entityTypeClub) {
              setAddedsport([...notRegisterSport, ...registerSports]);
            } else {
              setAddedsport([...sportList]);
            }
          }}
          modalType={ModalTypes.style6}
          headerRightButtonText={strings.save}
          onRightButtonPress={() => {
            setisSaved(true);

            setsports([...addedSport]);

            setVisibleAddModal(false);
          }}>
          <FlatList
            data={allSports}
            style={{marginTop: -20}}
            keyExtractor={(item, index) => `${item?.sport_type}/${index}`}
            showsVerticalScrollIndicator={false}
            renderItem={({item}) => (
              <>
                <Pressable
                  style={styles.listItem}
                  onPress={() => {
                    if (CheckisRegister(item)) {
                      toggleSport(item);
                      return;
                    }

                    if (!FavSportCheck(item)) {
                      toggleSport(item);
                    }
                  }}>
                  <Text style={styles.listLabel}>{item.sport_name}</Text>
                  <View
                    style={[
                      styles.listIconContainer,
                      {
                        opacity: FavSportImageCheck(item) ? 0.6 : 1,
                      },
                    ]}>
                    <Image
                      source={
                        checkSportAdded(item)
                          ? images.orangeCheckBox
                          : images.uncheckBox
                      }
                      style={styles.image}
                    />
                  </View>
                </Pressable>
                <View style={styles.lineSeparator} />
              </>
            )}
            ListFooterComponent={() => <View style={{marginBottom: 50}} />}
          />
        </CustomModalWrapper>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  topText: {
    fontSize: 14,
    fontFamily: fonts.RMedium,
    marginTop: 20,
    marginBottom: 15,
  },
  card: {
    paddingLeft: 5,
    paddingRight: 15,
    backgroundColor: colors.lightGrayBackground,
    borderRadius: 5,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  label: {
    fontSize: 16,
    fontFamily: fonts.RRegular,
    lineHeight: 24,
  },
  addordeletebtn: {
    alignSelf: 'center',
    backgroundColor: colors.lightGrayBackground,
    paddingHorizontal: 10,
    borderRadius: 5,
    paddingVertical: 3,
  },
  adddeletetext: {
    fontFamily: fonts.RBold,
    fontSize: 14,
    lineHeight: 24,
    textAlign: 'center',
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  lineSeparator: {
    height: 1,
    backgroundColor: colors.grayBackgroundColor,
  },

  listLabel: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: fonts.RRegular,
  },
  listIconContainer: {
    width: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  Mcard: {
    backgroundColor: colors.whiteColor,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    shadowColor: colors.blackColor,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 5,
    flex: 1,
  },
  parent: {
    flex: 1,
    backgroundColor: colors.modalBackgroundColor,
    paddingTop: 50,
  },
  dragImageContainer: {
    width: 15,
    height: 13,

    alignItems: 'center',
    justifyContent: 'center',
  },
});
