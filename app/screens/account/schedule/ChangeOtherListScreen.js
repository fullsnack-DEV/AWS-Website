import React, {useContext, useEffect, useState, useCallback} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Alert,
  TouchableOpacity,
  Image,
  SafeAreaView,
  FlatList,
} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import DraggableFlatList from 'react-native-draggable-flatlist';
import * as Utility from '../../../utils/index';
import {getUserSettings} from '../../../api/Users';
import AuthContext from '../../../auth/context';
import ActivityLoader from '../../../components/loader/ActivityLoader';
import colors from '../../../Constants/Colors';
import fonts from '../../../Constants/Fonts';
import images from '../../../Constants/ImagePath';
import {getGroups, getTeamsOfClub} from '../../../api/Groups';
import {strings} from '../../../../Localization/translation';
import Verbs from '../../../Constants/Verbs';
import TCThinDivider from '../../../components/TCThinDivider';
import ScreenHeader from '../../../components/ScreenHeader';
import GroupIcon from '../../../components/GroupIcon';

export default function ChangeOtherListScreen({
  closeBtn,
  userSetting,
  setUserSetting,
  clubLists = [],
}) {
  const authContext = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [addedGroups, setAddedGroups] = useState([]);
  const [removedGroups, setremovedGroups] = useState([]);

  const onDonePress = useCallback(async () => {
    setLoading(true);

    if (addedGroups.length > 0) {
      let params;
      if ([Verbs.entityTypeClub].includes(authContext.entity.role)) {
        const otherGroups = userSetting?.club_schedule_group_filter ?? [];

        const GroupWithKey = [
          {
            groupid: authContext.entity.uid,
            addedgroups: addedGroups,
          },
          ...otherGroups,
        ];

        params = {
          ...userSetting,
          club_schedule_group_filter: GroupWithKey,
        };
      } else if ([Verbs.entityTypeTeam].includes(authContext.entity.role)) {
        const otherGroups = userSetting?.club_schedule_group_filter ?? [];

        const GroupWithKey = [
          {
            groupid: authContext.entity.uid,
            addedgroups: addedGroups,
          },
          ...otherGroups,
        ];

        params = {
          ...userSetting,
          team_schedule_group_filter: GroupWithKey,
        };
      } else {
        params = {
          ...userSetting,
          schedule_group_filter: addedGroups,
        };
      }

      setUserSetting(params);
      closeBtn(false);
      setLoading(false);
    } else {
      setLoading(false);
      Alert.alert('Please select any of the group.');
    }
  }, [
    addedGroups,
    authContext.entity.role,
    authContext.entity.uid,
    closeBtn,
    setUserSetting,
    userSetting,
  ]);

  useEffect(() => {
    setLoading(true);
    if ([Verbs.entityTypeClub].includes(authContext.entity.role)) {
      getTeamsOfClub(authContext.entity.uid, authContext)
        .then((response) => {
          getUserSettings(authContext).then((setting) => {
            setUserSetting(setting.payload.user);
            if (
              setting.payload.user?.club_schedule_group_filter &&
              setting.payload.user?.club_schedule_group_filter.length > 0
            ) {
              let tempAddedGroup = [];
              const groupArray =
                setting?.payload?.user?.club_schedule_group_filter ?? [];

              if (groupArray && Array.isArray(groupArray)) {
                // Find the object with the specified groupId
                const desiredGroup = groupArray.find(
                  (group) => group.groupid === authContext.entity.uid,
                );

                if (desiredGroup) {
                  // Extract addedGroups from the desiredGroup
                  tempAddedGroup = desiredGroup.addedgroups ?? [];
                } else {
                  tempAddedGroup = [];
                }
              } else {
                tempAddedGroup = [];
              }

              setAddedGroups(tempAddedGroup);

              setremovedGroups([
                ...[...response.payload].filter(
                  (e) =>
                    !tempAddedGroup.some(
                      (item) => item.group_id === e.group_id,
                    ),
                ),
              ]);
            } else {
              const groups = [...response.payload].map((obj) => ({
                ...obj,
                isSelected: false,
              }));
              setAddedGroups([...groups.filter((obj) => obj.isSelected)]);
              setremovedGroups([...groups.filter((obj) => !obj.isSelected)]);
            }
            setLoading(false);
          });
        })
        .catch((e) => {
          setLoading(false);
          Alert.alert('', e.messages);
        });
    } else if ([Verbs.entityTypeTeam].includes(authContext.entity.role)) {
      setLoading(false);

      getUserSettings(authContext).then((setting) => {
        setUserSetting(setting.payload.user);
        if (
          setting.payload.user?.team_schedule_group_filter &&
          setting.payload.user?.team_schedule_group_filter.length > 0
        ) {
          let tempAddedGroup = [];
          const groupArray =
            setting?.payload?.user?.team_schedule_group_filter ?? [];

          if (groupArray && Array.isArray(groupArray)) {
            // Find the object with the specified groupId
            const desiredGroup = groupArray.find(
              (group) => group.groupid === authContext.entity.uid,
            );

            if (desiredGroup) {
              // Extract addedGroups from the desiredGroup
              tempAddedGroup = desiredGroup.addedgroups ?? [];
            } else {
              tempAddedGroup = [];
            }
          } else {
            tempAddedGroup = [];
          }

          setAddedGroups(tempAddedGroup);
          setremovedGroups(
            clubLists.filter(
              (e) =>
                !tempAddedGroup.some((item) => item.group_id === e.group_id),
            ),
          );
        } else {
          const groups = clubLists.map((obj) => ({
            ...obj,
            isSelected: false,
          }));
          setAddedGroups(groups.filter((obj) => obj.isSelected));
          setremovedGroups(groups.filter((obj) => !obj.isSelected));
        }
        setLoading(false);
      });
    } else {
      getGroups(authContext)
        .then((response) => {
          const {teams, clubs} = response.payload;
          getUserSettings(authContext).then((setting) => {
            setUserSetting(setting.payload.user);
            if (
              setting?.payload?.user?.schedule_group_filter &&
              setting?.payload?.user?.schedule_group_filter?.length > 0
            ) {
              setAddedGroups([
                ...setting?.payload?.user?.schedule_group_filter,
              ]);
              setremovedGroups([
                ...[...teams, ...clubs].filter(
                  (e) =>
                    !setting?.payload?.user?.schedule_group_filter.some(
                      (item) => item.group_id === e.group_id,
                    ),
                ),
              ]);
            } else {
              const groups = [...teams, ...clubs].map((obj) => ({
                ...obj,
                isSelected: false,
              }));
              setAddedGroups([...groups.filter((obj) => obj.isSelected)]);
              setremovedGroups([...groups.filter((obj) => !obj.isSelected)]);
            }
            setLoading(false);
          });
        })
        .catch((e) => {
          setLoading(false);
          Alert.alert('', e.messages);
        });
    }
  }, [authContext]);

  const handleRemoveGroups = useCallback(
    (item = {}) => {
      const findIndex = addedGroups.findIndex(
        (a) => a.group_id === item.group_id,
      );

      if (findIndex !== -1) {
        const updatedAddedGroups = addedGroups.slice();
        updatedAddedGroups.splice(findIndex, 1);
        setAddedGroups(updatedAddedGroups);
      }

      const updatedItem = {...item, isSelected: !item.isSelected};

      setremovedGroups([...removedGroups, updatedItem]);
    },
    [addedGroups, removedGroups],
  );

  const handleAddGroups = useCallback(
    (item = {}) => {
      if (addedGroups.length < 10) {
        const findIndex = removedGroups.findIndex(
          (a) => a.group_id === item.group_id,
        );

        if (findIndex !== -1) {
          // If the item is found in removedGroups, remove it
          removedGroups.splice(findIndex, 1);
          setremovedGroups([...removedGroups]);
        }

        // Create a new object with the updated properties
        const updatedItem = {...item, isSelected: !item.isSelected};

        // Add the updated item to addedGroups
        if (addedGroups.length < 10) {
          setAddedGroups([...addedGroups, updatedItem]);
        }
      } else {
        Alert.alert(strings.addUpTo10Organizers);
      }
    },
    [addedGroups, removedGroups],
  );

  const renderCheckedOrganizers = useCallback(
    ({item, drag}) =>
      item.sport !== Verbs.allStatus && (
        <View style={styles.sportsBackgroundView}>
          <View style={styles.row}>
            <TouchableOpacity
              onPress={() => handleRemoveGroups(item)}
              style={{alignSelf: 'center'}}>
              <Image
                source={images.removeSportList}
                style={styles.addIconStyle}
              />
            </TouchableOpacity>
            <GroupIcon
              imageUrl={item.thumbnail}
              groupName={item.group_name}
              entityType={item.entity_type}
              containerStyle={[
                styles.iconContainer,
                item.thumbnail ? {} : {paddingTop: 2},
              ]}
              placeHolderStyle={styles.iconPlaceholder}
              textstyle={styles.iconText}
            />

            <Text style={styles.sportNameTitle}>{item.group_name}</Text>
          </View>
          <TouchableOpacity onLongPress={drag} style={{alignSelf: 'center'}}>
            <Image source={images.moveIcon} style={styles.moveIconStyle} />
          </TouchableOpacity>
        </View>
      ),
    [handleRemoveGroups],
  );

  const renderUnCheckedOrganizers = useCallback(
    ({item}) =>
      item.sport !== Verbs.allStatus && (
        <View style={styles.sportsBackgroundView}>
          <View style={styles.row}>
            <TouchableOpacity
              onPress={() => handleAddGroups(item)}
              style={{alignSelf: 'center'}}>
              <Image source={images.addSportList} style={styles.addIconStyle} />
            </TouchableOpacity>
            <GroupIcon
              imageUrl={item.thumbnail}
              groupName={item.group_name}
              entityType={item.entity_type}
              containerStyle={[
                styles.iconContainer,
                item.thumbnail ? {} : {paddingTop: 2},
              ]}
              placeHolderStyle={styles.iconPlaceholder}
              textstyle={styles.iconText}
            />

            <Text style={styles.sportNameTitle}>{item.group_name}</Text>
          </View>
        </View>
      ),
    [handleAddGroups],
  );

  return (
    <SafeAreaView style={{flex: 1}}>
      <GestureHandlerRootView style={{flex: 1}}>
        <ActivityLoader visible={loading} />

        <ScreenHeader
          isFullTitle
          title={strings.changelistforgarnizers}
          leftIcon={images.crossImage}
          leftIconStyle={{width: 50}}
          leftIconPress={() => {
            closeBtn(false);
          }}
          isRightIconText
          rightButtonText={strings.apply}
          onRightButtonPress={onDonePress}
        />
        <View style={styles.sperateLine} />
        <TCThinDivider marginBottom={15} width={'100%'} />
        <View style={{flex: 1, paddingBottom: 20}}>
          <Text style={styles.mainTextStyle}>
            {strings.organizerDisplayInFilterBartext}
          </Text>
          <Text style={styles.subTitle}>{strings.upTo10OrganizerText}</Text>
          <View style={{flex: 0.7}}>
            {addedGroups?.length > 0 ? (
              <DraggableFlatList
                showsHorizontalScrollIndicator={false}
                data={addedGroups}
                keyExtractor={(item, index) => index.toString()}
                renderItem={renderCheckedOrganizers}
                bounces={false}
                onDragEnd={({data}) => {
                  setAddedGroups([...data]);
                }}
              />
            ) : (
              <View style={{marginTop: 10}}>
                <Text style={styles.noEventText}>{strings.noOrganizers}</Text>
              </View>
            )}
          </View>
          <Text style={styles.otherTitle}>{strings.otherOrganizers}</Text>
          <View style={{flex: 0.7}}>
            {removedGroups.length > 0 ? (
              <FlatList
                showsHorizontalScrollIndicator={false}
                data={removedGroups}
                keyExtractor={(item, index) => index.toString()}
                renderItem={renderUnCheckedOrganizers}
              />
            ) : (
              <View style={{marginTop: 15}}>
                <Text style={styles.noEventText}>{strings.noOrganizers}</Text>
              </View>
            )}
          </View>

          <Text style={styles.headerTextStyle}>
            {strings.someOrganizerJoinEventText}
          </Text>
        </View>
      </GestureHandlerRootView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  otherTitle: {
    fontFamily: fonts.RBold,
    fontSize: 16,
    color: colors.lightBlackColor,
    margin: 15,
    marginBottom: 15,
  },
  headerTextStyle: {
    fontFamily: fonts.RRegular,
    fontSize: 14,
    color: colors.lightBlackColor,
    margin: 15,
    marginBottom: 0,
  },
  mainTextStyle: {
    fontFamily: fonts.RBold,
    fontSize: 16,
    color: colors.lightBlackColor,
    marginLeft: 15,
    // marginTop: 15,
  },
  subTitle: {
    fontFamily: fonts.RRegular,
    fontSize: 14,
    color: colors.lightBlackColor,
    margin: 15,
    marginTop: 5,
  },

  moveIconStyle: {
    resizeMode: 'cover',
    height: 13,
    width: 15,
    alignSelf: 'center',
    marginRight: 15,
  },
  addIconStyle: {
    resizeMode: 'cover',
    height: 20,
    width: 20,
    alignSelf: 'center',
    marginLeft: 15,
    marginRight: 15,
  },
  sportNameTitle: {
    fontSize: 16,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
    alignSelf: 'center',
    // margin: 15,
  },

  sportsBackgroundView: {
    alignSelf: 'flex-start',
    backgroundColor: colors.lightGrey,
    borderRadius: 6,
    // elevation: 5,
    flexDirection: 'row',
    height: 35,
    width: Utility.widthPercentageToDP('92%'),
    justifyContent: 'space-between',
    marginBottom: 15,
    marginLeft: 15,
  },
  noEventText: {
    fontSize: 20,
    fontFamily: fonts.RBold,
    color: colors.veryLightBlack,
    alignSelf: 'center',
  },
  iconContainer: {
    width: 25,
    height: 25,
    marginRight: 10,
  },
  iconPlaceholder: {
    width: 10,
    height: 10,
    bottom: 0,
    right: -2,
  },
  iconText: {
    fontSize: 10,
    marginTop: 0,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
