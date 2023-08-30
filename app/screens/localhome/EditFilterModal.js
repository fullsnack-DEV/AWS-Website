import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  FlatList,
  Pressable,
  Modal,
} from 'react-native';
import React, {useCallback, useEffect, useState, useContext} from 'react';
import DraggableFlatList from 'react-native-draggable-flatlist';
import FastImage from 'react-native-fast-image';
import CustomModalWrapper from '../../components/CustomModalWrapper';
import {ModalTypes} from '../../Constants/GeneralConstants';
import {strings} from '../../../Localization/translation';
import fonts from '../../Constants/Fonts';
import {getSportDetails, getSportList} from '../../utils/sportsActivityUtils';
import images from '../../Constants/ImagePath';
import colors from '../../Constants/Colors';
import {getStorage, setStorage, showAlert} from '../../utils';
import AuthContext from '../../auth/context';
import ScreenHeader from '../../components/ScreenHeader';
import {updateUserProfile} from '../../api/Users';
import ActivityLoader from '../../components/loader/ActivityLoader';

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

  useEffect(() => {
    getStorage('appSetting').then((setting) => {
      setImageBaseUrl(setting.base_url_sporticon);
    });

    const newFavSports = [...favsport];
    sportList.forEach((item) => {
      newFavSports.push(item);
    });
    setFavSport(newFavSports);

    setsports(sportList);
    getAllsportData();
  }, [visible]);

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
        <FastImage
          source={{uri: `${image_base_url}${sportImage}`}}
          style={{height: 40, width: 40}}
        />
      );
    },
    [authContext.sports, image_base_url],
  );

  const Imagecheck = (item) => {
    const isSportAdded = addedSport.some(
      (favItem) => favItem.sport_name === item.sport_name,
    );

    return isSportAdded;
  };

  const FavSportCheck = (item) => {
    const isSportAdded = favsport.some(
      (favItem) => favItem.sport_name === item.sport_name,
    );

    return isSportAdded;
  };

  const RenderAllRow = () => (
    <>
      <Pressable style={styles.listItem} onPress={() => onAllPress()}>
        <Text style={styles.listLabel}>All</Text>
        <View style={styles.listIconContainer}>
          <FastImage
            source={
              addedSport.length === allSports.length
                ? images.orangeCheckBox
                : images.uncheckBox
            }
            style={styles.image}
          />
        </View>
      </Pressable>
      <View style={styles.lineSeparator} />
    </>
  );

  const onAllPress = () => {
    if (addedSport.length === allSports.length) {
      setAddedsport([]);
      return;
    }

    const dummyaaray = [];
    // eslint-disable-next-line array-callback-return
    allSports.map((item) => {
      const obj = {
        sport: item.sport,
        sport_name: item.sport_name,
        sport_type: item.sport_type,
      };

      dummyaaray.push(obj);
    });

    setAddedsport(dummyaaray);
  };

  const toggleSport = (item) => {
    const index = addedSport.findIndex(
      (sportItem) => sportItem.sport_name === item.sport_name,
    );

    const indexed = addedSport.findIndex(
      (sportItem) => sportItem.sport_name === item.sport_name,
    );

    if (indexed === 0) {
      const filteredsport = sports.filter(
        (sportItem) => sportItem.sport_name !== item.sport_name,
      );

      setsports([...filteredsport]);
    }

    if (index === -1) {
      const newAddedSport = [
        ...addedSport,
        {
          sport: item.sport,
          sport_name: item.sport_name,
          sport_type: item.sport_type,
        },
      ];

      if (addedSport.length === 20) {
        showAlert(strings.only20SportsAlert);
      } else {
        setAddedsport(newAddedSport);
      }
    } else {
      const newAddedSport = addedSport.filter(
        (sportItem) => sportItem.sport_name !== item.sport_name,
      );

      setAddedsport(newAddedSport);
    }
  };

  return (
    <Modal visible={visible} collapsable transparent animationType="fade">
      <View style={styles.parent}>
        <View style={styles.Mcard}>
          <ScreenHeader
            leftIcon={images.crossImage}
            leftIconPress={() => {
              setAddedsport([]);
              onClose();
            }}
            rightButtonText={strings.apply}
            title={strings.editFavSportTitle}
            onRightButtonPress={async () => {
              setLoading(true);
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
                  console.log(e);
                });
            }}
            isRightIconText
          />
          <View style={{marginHorizontal: 20}}>
            <ActivityLoader visible={loading} />
            <Text style={styles.topText}> {strings.settingModaltitle} </Text>

            <DraggableFlatList
              scrollEnabled
              data={sports}
              nestedScrollEnabled
              onDragEnd={({data}) => {
                setsports(data);
              }}
              style={{marginBottom: 200}}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({item, drag, isActive}) => (
                <View style={[styles.card, styles.row, {marginBottom: 15}]}>
                  <View style={[styles.row, {justifyContent: 'center'}]}>
                    <View style={{marginRight: 13}}>
                      {renderImageforSport(item)}
                    </View>
                    <Text style={styles.label}>{item.sport_name}</Text>
                  </View>

                  <TouchableOpacity
                    style={{width: 15, height: 13}}
                    onLongPress={drag}
                    disabled={isActive}>
                    <FastImage source={images.moveIcon} style={styles.image} />
                  </TouchableOpacity>
                </View>
              )}
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

            <CustomModalWrapper
              isVisible={visibleAddModal}
              title={strings.addorDeleteFavSportTitle}
              closeModal={() => {
                setVisibleAddModal(false);
                setAddedsport([]);
              }}
              modalType={ModalTypes.style1}
              headerRightButtonText={strings.save}
              onRightButtonPress={() => {
                const newSports = [...sports];

                addedSport.forEach((item) => {
                  if (
                    !newSports.some(
                      (sport) => sport.sport_name === item.sport_name,
                    )
                  ) {
                    newSports.unshift(item);
                  }
                });
                setsports(newSports);
                setVisibleAddModal(false);
              }}>
              <FlatList
                data={allSports}
                style={{marginTop: -20}}
                ListHeaderComponent={RenderAllRow}
                keyExtractor={(item, index) => `${item?.sport_type}/${index}`}
                showsVerticalScrollIndicator={false}
                renderItem={({item}) => (
                  <>
                    <Pressable
                      style={styles.listItem}
                      onPress={() => {
                        if (!FavSportCheck(item)) {
                          toggleSport(item);
                        }
                      }}>
                      <Text style={styles.listLabel}>{item.sport_name}</Text>
                      <View
                        style={[
                          styles.listIconContainer,
                          {opacity: FavSportCheck(item) ? 0.6 : 1},
                        ]}>
                        <FastImage
                          source={
                            Imagecheck(item) || FavSportCheck(item)
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
              />
            </CustomModalWrapper>
          </View>
        </View>
      </View>
    </Modal>
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
});
