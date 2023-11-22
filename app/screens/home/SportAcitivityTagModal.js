import {
  View,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Image,
  Pressable,
} from 'react-native';
import React, {useEffect, useContext, useState, useCallback} from 'react';
import ToggleSwitch from 'toggle-switch-react-native';
import DraggableFlatList from 'react-native-draggable-flatlist';
import CustomModalWrapper from '../../components/CustomModalWrapper';

import ActivityLoader from '../../components/loader/ActivityLoader';
import AuthContext from '../../auth/context';
import images from '../../Constants/ImagePath';
import {patchPlayer} from '../../api/Users';
import {strings} from '../../../Localization/translation';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';
import {getStorage, setAuthContextData} from '../../utils';
import {getSportDetails} from '../../utils/sportsActivityUtils';
import {SportActivityOrder, ModalTypes} from '../../Constants/GeneralConstants';
import Verbs from '../../Constants/Verbs';

const Options = [
  {id: 1, label: strings.latestDoneActivity},
  {id: 2, label: strings.displayInFixOrder},
];
const Categories = [
  strings.playingTitleText,
  strings.refereeingTitleText,
  strings.scorekeepingTitleText,
];

export default function SportAcitivityTagModal({isVisible, onCloseModal}) {
  const [imageBaseUrl, setImageBaseUrl] = useState('');
  const [loading, setloading] = useState(false);
  const [selectedOption, setSelectedOption] = useState(0);
  const [isClassifyByCategory, setIsCalssifyByCategory] = useState(false);
  const [sportList, setSportList] = useState([]);
  const [categoryOrder, setCategoryOrder] = useState(Categories);

  const authContext = useContext(AuthContext);

  useEffect(() => {
    getStorage('appSetting').then((setting) => {
      setImageBaseUrl(setting.base_url_sporticon);
    });
  });
  const getSportSettings = useCallback(() => {
    const entity = authContext.entity.obj;
    const list = [
      ...(entity.registered_sports ?? []),
      ...(entity.referee_data ?? []),
      ...(entity.scorekeeper_data ?? []),
    ];
    if (entity.sport_setting?.orderType) {
      setSelectedOption(entity.sport_setting.orderType);
      const order = SportActivityOrder[entity.sport_setting.orderType];

      if (order === strings.latestDoneActivity) {
        setIsCalssifyByCategory(entity.sport_setting?.isClassifyByCategory);
        setCategoryOrder(entity.sport_setting?.categoryOrder ?? []);
        const newList = list.filter(
          (obj) =>
            obj.sport && (obj.is_active === true || !('is_active' in obj)),
        );
        setSportList(newList);
      }

      if (order === strings.displayInFixOrder) {
        setIsCalssifyByCategory(false);
        setSportList(entity.sport_setting.sportOrder);
      }
    } else {
      setSportList(list);
    }
  }, [authContext]);

  useEffect(() => {
    getSportSettings();
  }, [getSportSettings]);

  const getIcon = (option) => {
    switch (option) {
      case strings.playingTitleText:
        return images.accountMySports;

      case strings.refereeingTitleText:
        return images.accountMyRefereeing;

      case strings.scorekeepingTitleText:
        return images.accountMyScoreKeeping;

      default:
        return images.accountMySports;
    }
  };

  const onSavePress = () => {
    setloading(true);
    const userObj = {
      sport_setting: {
        orderType: selectedOption,
        isClassifyByCategory,
        categoryOrder,
        sportOrder: sportList,
      },
    };

    patchPlayer(userObj, authContext)
      .then(async (res) => {
        setloading(false);
        await setAuthContextData(res.payload, authContext);
        onCloseModal();
        // navigation.goBack();
      })
      .catch((error) => {
        Alert.alert(error);
      })
      .finally(() => setloading(false));
  };

  return (
    <CustomModalWrapper
      isVisible={isVisible}
      closeModal={onCloseModal}
      modalType={ModalTypes.style1}
      containerStyle={{padding: 0}}
      title={strings.editOrder}
      leftIcon={images.backArrow}
      headerRightButtonText={strings.save}
      leftIconPress={() => onCloseModal()}
      isRightIconText
      onRightButtonPress={() => {
        onSavePress();
      }}>
      <ActivityLoader visible={loading} />

      <View style={{paddingTop: 20, paddingHorizontal: 15}}>
        <Pressable
          style={[styles.row, {marginBottom: 15}]}
          onPress={() => {
            setSelectedOption(Options[0].id);
          }}>
          <View>
            <Text style={styles.label}>{Options[0].label}</Text>
          </View>
          <View style={styles.radioContainer}>
            <Image
              source={
                selectedOption === Options[0].id
                  ? images.radioSelectYellow
                  : images.radioUnselect
              }
              style={styles.image}
            />
          </View>
        </Pressable>

        {selectedOption === 1 ? (
          <View style={styles.container}>
            <View style={[styles.row, {marginBottom: 25}]}>
              <View>
                <Text style={[styles.label, {fontFamily: fonts.RRegular}]}>
                  {strings.classifyByCategories}
                </Text>
              </View>

              <ToggleSwitch
                isOn={isClassifyByCategory}
                onToggle={() => setIsCalssifyByCategory(!isClassifyByCategory)}
                onColor={colors.greenColorCard}
                offColor={colors.userPostTimeColor}
              />
            </View>

            <DraggableFlatList
              data={categoryOrder}
              onDragEnd={({data}) => {
                setCategoryOrder([...data]);
              }}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({item, drag, isActive}) => (
                <View
                  style={[
                    styles.card,
                    styles.row,
                    {marginBottom: 15},
                    isClassifyByCategory ? {opacity: 1} : {opacity: 0.5},
                  ]}>
                  <View style={[styles.row, {justifyContent: 'center'}]}>
                    <View style={styles.sportIcon}>
                      <Image source={getIcon(item)} style={styles.image} />
                    </View>
                    <Text style={styles.label}>{item}</Text>
                  </View>
                  <TouchableOpacity
                    style={{width: 15, height: 13}}
                    onLongPress={drag}
                    disabled={isActive}>
                    <Image source={images.moveIcon} style={styles.image} />
                  </TouchableOpacity>
                </View>
              )}
              bounces={false}
              showsVerticalScrollIndicator={false}
            />
          </View>
        ) : null}

        <Pressable
          style={[styles.row, {marginBottom: 30}]}
          onPress={() => {
            setSelectedOption(Options[1].id);
          }}>
          <View>
            <Text style={styles.label}>{Options[1].label}</Text>
          </View>
          <View style={styles.radioContainer}>
            <Image
              source={
                selectedOption === Options[1].id
                  ? images.radioSelectYellow
                  : images.radioUnselect
              }
              style={styles.image}
            />
          </View>
        </Pressable>

        {selectedOption === 2 ? (
          <DraggableFlatList
            data={sportList}
            onDragEnd={({data}) => {
              setSportList([...data]);
            }}
            style={{height: 520}}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item, drag, isActive}) => {
              const sport = getSportDetails(
                item.sport,
                item?.sport_type,
                authContext.sports,
                item.type,
              );
              return item.is_active || !(Verbs.is_active in item) ? (
                <View style={[styles.card, styles.row, {marginBottom: 15}]}>
                  <View style={[styles.row, {justifyContent: 'center'}]}>
                    <View style={styles.sportIcon}>
                      <Image
                        source={
                          sport?.sport_image
                            ? {uri: `${imageBaseUrl}${sport.sport_image}`}
                            : images.accountMySports
                        }
                        style={styles.image}
                      />
                    </View>
                    <Text style={styles.label}>
                      {sport.sport_name}{' '}
                      <Text
                        style={[
                          styles.label,
                          {fontSize: 14, fontFamily: fonts.RRegular},
                        ]}>{`(${item.type})`}</Text>{' '}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={{width: 15, height: 13}}
                    onLongPress={drag}
                    disabled={isActive}>
                    <Image source={images.moveIcon} style={styles.image} />
                  </TouchableOpacity>
                </View>
              ) : null;
            }}
            bounces={false}
            showsVerticalScrollIndicator={false}
          />
        ) : null}
      </View>
    </CustomModalWrapper>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  label: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.lightBlackColor,
    fontFamily: fonts.RMedium,
  },
  radioContainer: {
    width: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  card: {
    paddingLeft: 5,
    paddingRight: 15,
    backgroundColor: colors.whiteColor,
    borderRadius: 5,
    shadowColor: colors.blackColor,
    shadowOffset: {
      width: 2,
      height: 3,
    },
    shadowOpacity: 0.16,
  },
  sportIcon: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    paddingHorizontal: 20,
    marginTop: 10,
    marginBottom: 50,
  },
});
