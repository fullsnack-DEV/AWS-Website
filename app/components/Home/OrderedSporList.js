// @flow
import React, {useCallback, useContext, useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  Pressable,
  Image,
  TouchableOpacity,
} from 'react-native';
import ToggleSwitch from 'toggle-switch-react-native';
import {strings} from '../../../Localization/translation';
import AuthContext from '../../auth/context';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';
import EntityStatus, {
  SportActivityOrder,
} from '../../Constants/GeneralConstants';
import images from '../../Constants/ImagePath';
import Verbs from '../../Constants/Verbs';
import {getStorage} from '../../utils';
import {
  getCardBorderColor,
  getEntitySport,
  getEntitySportList,
  getSportDetails,
} from '../../utils/sportsActivityUtils';
import BottomSheet from '../modals/BottomSheet';

const OrderedSporList = ({
  user = {},
  type = 'default',
  onCardPress = () => {},
  showAddActivityButton = false,
  onSelect = () => {},
  showToggleButton = false,
  onToggle = () => {},
  isAdmin = false,
  renderListHeader = () => null,
}) => {
  const [orderType, setOrderType] = useState('');
  const [categoryOrder, setCategoryOrder] = useState([]);
  const [isClassifyByCategory, setIsCalssifyByCategory] = useState(false);
  const [sportList, setSportList] = useState([]);
  const [imageBaseUrl, setImageBaseUrl] = useState('');
  const [showAddActivityModal, setShowAddActivityModal] = useState(false);
  const [toggledList, setToggledList] = useState([]);

  const authContext = useContext(AuthContext);

  const getSportSettings = useCallback(() => {
    const entity = {...user};
    const list = [
      ...(entity.registered_sports ?? []),
      ...(entity.referee_data ?? []),
      ...(entity.scorekeeper_data ?? []),
    ];

    const newList = list.filter(
      (obj) => obj.sport && (obj.is_active === true || !('is_active' in obj)),
    );

    if (entity.sport_setting?.orderType) {
      const order = SportActivityOrder[entity.sport_setting.orderType];

      setOrderType(order);
      if (order === strings.latestDoneActivity) {
        setIsCalssifyByCategory(entity.sport_setting.isClassifyByCategory);
        setCategoryOrder(entity.sport_setting.categoryOrder);
        setSportList(newList);
      }

      if (order === strings.displayInFixOrder) {
        setIsCalssifyByCategory(false);
        setSportList(entity.sport_setting.sportOrder);
      }
    } else {
      setOrderType(SportActivityOrder[1]);
      setIsCalssifyByCategory(true);
      setCategoryOrder([
        strings.playingTitleText,
        strings.refereeingTitleText,
        strings.scorekeepingTitleText,
      ]);

      setSportList(newList);
    }

    if (showToggleButton) {
      const hiddenList = newList.filter((item) => item.is_hide);
      setToggledList(hiddenList);
    }
  }, [user, showToggleButton]);

  const getEntityType = (option) => {
    switch (option) {
      case strings.playingTitleText:
        return Verbs.entityTypePlayer;

      case strings.refereeingTitleText:
        return Verbs.entityTypeReferee;

      case strings.scorekeepingTitleText:
        return Verbs.entityTypeScorekeeper;

      default:
        return Verbs.entityTypePlayer;
    }
  };

  useEffect(() => {
    getSportSettings();
  }, [getSportSettings]);

  useEffect(() => {
    getStorage('appSetting').then((setting) => {
      setImageBaseUrl(setting.base_url_sporticon);
    });
  }, []);

  const handleToggle = (item) => {
    const obj = {
      ...item,
      is_hide: 'is_hide' in item ? !item.is_hide : true,
    };
    const list = [...toggledList];

    if (list.length > 0) {
      const sport = list.find(
        (ele) =>
          item.sport && ele.sport === item.sport && ele.type === item.type,
      );
      if (sport) {
        const index = list.indexOf(sport);
        list[index] = {
          ...list[index],
          is_hide: !list[index].is_hide,
        };
      } else {
        list.push(obj);
      }
    } else {
      list.push(obj);
    }

    onToggle(list);
    setToggledList(list);
  };

  const sportsView = (item, entityType, index) => {
    if (
      item?.item_type === EntityStatus.addNew ||
      item?.item_type === EntityStatus.moreActivity
    ) {
      return (
        <Pressable
          style={[
            styles.horizontalCard,
            index === 0 ? {marginLeft: 15} : {},
            {borderBottomWidth: 0},
          ]}
          onPress={() => {
            onCardPress(item, item?.item_type);
          }}>
          <View style={[styles.imageContainer, {marginHorizontal: 0}]}>
            <Image
              source={
                item?.item_type === EntityStatus.addNew
                  ? images.addRole
                  : images.moreIcon
              }
              style={styles.sportIcon}
            />
          </View>
          <View style={{alignItems: 'center', marginTop: 7}}>
            <Text style={styles.horizontalCardTitle}>{item.sport_name}</Text>
          </View>
        </Pressable>
      );
    }
    const sport = getSportDetails(
      item.sport,
      item.sport_type,
      authContext.sports,
      entityType,
    );
    const isAvailable =
      item.setting?.availibility ||
      item.setting?.referee_availibility ||
      item.setting?.scorekeeper_availibility;

    let isUserWithSameSport = false;
    const userSport = getEntitySport({
      user: authContext.entity.obj,
      role: item.type,
      sport: item.sport,
      sportType: item?.sport_type,
    });
    if (userSport?.sport) {
      isUserWithSameSport = true;
    }
    const obj = toggledList.find(
      (ele) =>
        ele?.sport && sport.sport === ele.sport && entityType === ele.type,
    );
    const isHide = obj?.is_hide;

    if (type === 'horizontal') {
      return (
        <Pressable
          style={[
            styles.horizontalCard,
            index === 0 ? {marginLeft: 15} : {},
            item.is_hide
              ? {borderBottomColor: colors.userPostTimeColor, opacity: 0.5}
              : {borderBottomColor: getCardBorderColor(entityType)},
          ]}
          disabled={item.is_hide}
          onPress={() => {
            onCardPress(item, entityType);
          }}>
          <View style={[styles.imageContainer, {marginHorizontal: 0}]}>
            <Image
              source={{uri: `${imageBaseUrl}${sport.sport_image}`}}
              style={styles.sportIcon}
            />
          </View>
          <View style={{alignItems: 'center', marginTop: 7}}>
            <Text style={styles.horizontalCardTitle}>{sport.sport_name}</Text>
          </View>
        </Pressable>
      );
    }

    return (
      <Pressable
        style={[
          styles.sportView,
          styles.row,
          item.is_hide
            ? {borderLeftColor: colors.userPostTimeColor, opacity: 0.5}
            : {borderLeftColor: getCardBorderColor(entityType)},
        ]}
        onPress={() => {
          onCardPress(item, entityType);
        }}
        disabled={item.is_hide}>
        <View style={styles.innerViewContainer}>
          <View style={styles.row}>
            <View style={styles.imageContainer}>
              <Image
                source={{uri: `${imageBaseUrl}${sport.sport_image}`}}
                style={styles.sportIcon}
              />
            </View>
            <View>
              <Text style={styles.sportName}>{sport.sport_name}</Text>
              <Text style={styles.matchCount}>0 match</Text>
            </View>
          </View>
          {!showToggleButton && item.is_hide ? (
            <View>
              <Text
                style={[
                  styles.matchCount,
                  {fontFamily: fonts.RMedium, color: colors.userPostTimeColor},
                ]}>
                {strings.hiddenText}
              </Text>
            </View>
          ) : null}

          {showToggleButton ? (
            <ToggleSwitch
              isOn={!isHide}
              onToggle={() => {
                handleToggle(item);
              }}
              onColor={colors.greenColorCard}
              offColor={colors.userPostTimeColor}
            />
          ) : null}
          {!isAdmin &&
          isAvailable &&
          isUserWithSameSport &&
          authContext.entity.role !== Verbs.entityTypeClub ? (
            <Pressable style={styles.button}>
              <Text style={styles.btnText}>
                {entityType === Verbs.entityTypePlayer
                  ? strings.challenge.toUpperCase()
                  : strings.book.toUpperCase()}
              </Text>
            </Pressable>
          ) : null}
        </View>
      </Pressable>
    );
  };

  const renderList = () => {
    if (orderType === strings.latestDoneActivity) {
      if (categoryOrder.length > 0 && isClassifyByCategory) {
        return (
          <View style={{paddingHorizontal: 15}}>
            <FlatList
              data={categoryOrder}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({item, index}) => {
                const list = getEntitySportList(
                  user,
                  getEntityType(item),
                ).filter(
                  (obj) =>
                    obj.sport &&
                    (obj.is_active === true || !('is_active' in obj)),
                );

                if (list.length > 0) {
                  return (
                    <View
                      style={[
                        styles.listContainer,
                        index === 0 ? {marginTop: 34} : {},
                      ]}>
                      <Text style={styles.listTitle}>{item}</Text>
                      {list
                        .sort((a, b) => a.sport.localeCompare(b.sport))
                        .map((ele, idx) =>
                          sportsView(ele, getEntityType(item), idx),
                        )}
                    </View>
                  );
                }
                return null;
              }}
              showsVerticalScrollIndicator={false}
              ListFooterComponent={() => {
                if (showAddActivityButton && isAdmin) {
                  return (
                    <TouchableOpacity
                      style={styles.buttonContainer}
                      onPress={() => setShowAddActivityModal(true)}>
                      <Text style={styles.buttonText}>
                        + {strings.addSportActivity}
                      </Text>
                    </TouchableOpacity>
                  );
                }
                return null;
              }}
              ListHeaderComponent={renderListHeader}
            />
          </View>
        );
      }
    }

    return (
      <View style={{paddingTop: 15, paddingHorizontal: 15}}>
        <FlatList
          data={sportList}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item, index}) => sportsView(item, item.type, index)}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={() => {
            if (showAddActivityButton) {
              return (
                <TouchableOpacity
                  style={styles.buttonContainer}
                  onPress={() => setShowAddActivityModal(true)}>
                  <Text style={styles.buttonText}>
                    + {strings.addSportActivity}
                  </Text>
                </TouchableOpacity>
              );
            }
            return null;
          }}
        />
      </View>
    );
  };

  const renderHorizontalList = () => {
    let list = [];
    if (
      orderType === strings.latestDoneActivity &&
      categoryOrder.length > 0 &&
      isClassifyByCategory
    ) {
      list = [];
      categoryOrder.forEach((item) => {
        let newList = [];
        if (isAdmin) {
          newList = getEntitySportList(user, getEntityType(item)).filter(
            (obj) =>
              obj.sport && (obj.is_active === true || !('is_active' in obj)),
          );
        } else {
          newList = getEntitySportList(user, getEntityType(item)).filter(
            (obj) =>
              obj.sport &&
              (obj.is_active === true || !('is_active' in obj)) &&
              (!obj.is_hide || !('is_hide' in obj)),
          );
        }
        list = [...list, ...newList];
      });
    } else {
      let newList = [];
      list = [];
      if (isAdmin) {
        newList = sportList.filter(
          (obj) =>
            obj.sport && (obj.is_active === true || !('is_active' in obj)),
        );
      } else {
        newList = sportList.filter(
          (obj) =>
            obj.sport &&
            (obj.is_active === true || !('is_active' in obj)) &&
            (obj.is_hide === true || !('is_hide' in obj)),
        );
      }
      list = [...list, ...newList];
    }

    let updatedList = [];

    if (list.length < 1) {
      updatedList = isAdmin
        ? [
            ...list,
            {sport_name: strings.addrole, item_type: EntityStatus.addNew},
          ]
        : [...list];
    } else if (list.length > 10) {
      updatedList = isAdmin
        ? [
            ...list.slice(0, 10),
            {
              sport_name: strings.more,
              item_type: EntityStatus.moreActivity,
            },
          ]
        : [...list.slice(0, 10)];
    } else {
      updatedList = isAdmin
        ? [
            ...list,
            {
              sport_name: strings.more,
              item_type: EntityStatus.moreActivity,
            },
          ]
        : [...list];
    }

    return (
      <FlatList
        data={updatedList}
        horizontal
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item, index}) => sportsView(item, item.type, index)}
        showsHorizontalScrollIndicator={false}
      />
    );
  };

  return (
    <View style={styles.parent}>
      {type === 'horizontal' ? renderHorizontalList() : renderList()}
      <BottomSheet
        isVisible={showAddActivityModal}
        closeModal={() => setShowAddActivityModal(false)}
        optionList={[
          strings.addPlaying,
          strings.addRefereeing,
          strings.addScorekeeping,
        ]}
        onSelect={(option) => {
          setShowAddActivityModal(false);
          onSelect(option);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  parent: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sportView: {
    justifyContent: 'space-between',
    borderRadius: 8,
    backgroundColor: colors.whiteColor,
    shadowColor: colors.googleColor,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowRadius: 3,
    shadowOpacity: 0.2,
    elevation: 5,
    marginBottom: 20,
    borderLeftWidth: 8,
    paddingVertical: 5,
  },
  horizontalCard: {
    width: 90,
    height: 90,
    borderRadius: 5,
    backgroundColor: colors.whiteColor,
    shadowColor: colors.googleColor,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowRadius: 3,
    shadowOpacity: 0.16,
    elevation: 5,
    marginRight: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
    borderBottomWidth: 5,
  },
  innerViewContainer: {
    flex: 1,
    marginRight: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sportName: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: fonts.RMedium,
    color: colors.lightBlackColor,
  },
  matchCount: {
    fontSize: 12,
    lineHeight: 14,
    fontFamily: fonts.RLight,
    color: colors.lightBlackColor,
  },
  sportIcon: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  imageContainer: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 5,
  },
  listTitle: {
    fontFamily: fonts.RRegular,
    fontSize: 20,
    color: colors.lightBlackColor,
    marginBottom: 15,
  },
  listContainer: {
    marginTop: 40,
  },
  buttonContainer: {
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: colors.textFieldBackground,
    marginVertical: 35,
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 12,
    lineHeight: 18,
    fontFamily: fonts.RBold,
    color: colors.lightBlackColor,
  },
  horizontalCardTitle: {
    fontSize: 14,
    lineHeight: 15,
    fontFamily: fonts.RMedium,
    color: colors.lightBlackColor,
    textAlign: 'center',
  },
  button: {
    paddingHorizontal: 9,
    paddingVertical: 7,
    backgroundColor: colors.tabFontColor,
    borderRadius: 5,
  },
  btnText: {
    fontSize: 12,
    fontFamily: fonts.RBold,
    color: colors.whiteColor,
  },
});
export default OrderedSporList;
