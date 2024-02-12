import {
  StyleSheet,
  Text,
  View,
  Image,
  Alert,
  TouchableOpacity,
} from 'react-native';
import React, {useState} from 'react';
import {FlatList, ScrollView} from 'react-native-gesture-handler';
import CustomModalWrapper from '../../../components/CustomModalWrapper';
import {strings} from '../../../../Localization/translation';
import {ModalTypes} from '../../../Constants/GeneralConstants';
import images from '../../../Constants/ImagePath';
import TCThinDivider from '../../../components/TCThinDivider';
import colors from '../../../Constants/Colors';
import fonts from '../../../Constants/Fonts';
import {getTeamsOfClub} from '../../../api/Groups';
import Verbs from '../../../Constants/Verbs';
import ActivityLoader from '../../../components/loader/ActivityLoader';
import {showAlert} from '../../../utils';

export default function MemberFilterModal({
  visible,
  groupID,
  authContext,
  closeModal,
  onApplyPress,
}) {
  const [parentGroup, setParentGroup] = useState([]);
  const [isallForRole, setIsAllForRole] = useState(false);
  const [isallForGroup, setIsAllForGroup] = useState(false);
  const [loading, setloading] = useState(false);
  const [firstTimeCalled, setFirstTimeCalled] = useState(false);
  const [profileOptions, setProfileOptions] = useState({
    title: strings.alltitle,
    connected: Verbs.ALL_ROLE,
  });
  const [nonMemberSelected, setNonMemberSelected] = useState(false);
  const [filterEntity] = useState([
    {
      title: strings.alltitle,
      role: Verbs.ALL_ROLE,
      is_role: true,
      is_checked: true,
    },
    {
      title: strings.adminTitle,
      role: Verbs.ADMIN_ROLE,
      is_role: true,
      is_checked: true,
    },
    {
      title: strings.coachTitle,
      role: Verbs.COACH_ROLE,
      is_role: true,
      is_checked: true,
    },
    {
      title: strings.playetTitle,
      role: Verbs.PLAYER_ROLE,
      is_role: true,
      is_checked: true,
    },
    {
      title: strings.parentTitle,
      role: Verbs.PARENT_ROLE,
      is_role: true,
      is_checked: true,
    },
    {
      title: strings.noroleTitle,
      role: Verbs.NOROLE_ROLE,
      is_role: true,
      is_checked: true,
    },
  ]);

  const [role, setRole] = useState(
    authContext.entity.role !== Verbs.entityTypeClub ? filterEntity : [],
  );

  const [ConnectionData] = useState([
    {
      title: strings.alltitle,
      connected: Verbs.ALL_ROLE,
    },
    {
      title: strings.connectedToAccount,
      connected: true,
    },
    {
      title: strings.disconnectedToAccount,
      connected: false,
    },
  ]);

  const [connectData] = useState(ConnectionData);

  const onCloseModal = () => {
    setProfileOptions({
      title: strings.alltitle,
      connected: Verbs.ALL_ROLE,
    });

    closeModal();
  };

  const getParentClub = () => {
    if (!firstTimeCalled) {
      setFirstTimeCalled(true);
      setloading(true);
      getTeamsOfClub(groupID, authContext)
        .then((response) => {
          setloading(false);
          if (response.payload !== undefined) {
            const groupInfoArray = response.payload.map((item) => ({
              group_id: item.group_id,
              title: item.group_name,
              is_checked: true,
              is_group: true,
              is_disable: false,
            }));

            groupInfoArray.unshift({
              group_id: Verbs.ALL_ROLE,
              title: strings.alltitle,
              is_checked: true,
              is_group: true,
              is_disable: false,
            });

            groupInfoArray.push({
              group_id: Verbs.NonTeamMember_Role,
              title: strings.nonTeamMembertTitle,
              is_checked: true,
              is_group: true,
              is_disable: false,
            });

            setParentGroup(groupInfoArray);
          } else {
            setParentGroup(null);
          }
        })
        .catch((e) => {
          setloading(false);
          setTimeout(() => {
            Alert.alert(strings.alertmessagetitle, e.message);
          }, 10);
        });
    }
  };

  if (visible) {
    getParentClub();
  }

  const onItemPress = (item) => {
    if (item.is_group) {
      if (item.group_id === Verbs.NonTeamMember_Role) {
        setNonMemberSelected(true);
        // Update the is_disable property for each element in parentGroup
        const updatedParentGroupData = parentGroup.map((roleItem) => {
          if (roleItem === item) {
            return {...roleItem, is_checked: !roleItem.is_checked};
          }

          return {
            ...roleItem,
            is_disable: !item.is_checked,
            is_checked: false,
          };
        });

        setParentGroup(updatedParentGroupData);

        return;
      }
      if (item.group_id === Verbs.ALL_ROLE) {
        setNonMemberSelected(false);

        setIsAllForGroup(!isallForGroup);
        const updatedParentGroupData = parentGroup.map((roleItem) => ({
          ...roleItem,
          is_checked: isallForGroup,
        }));

        setParentGroup(updatedParentGroupData);
        return;
      }

      if (item.is_group) {
        const updatedparentGroupRole = parentGroup.map((roleItem) => {
          if (roleItem.title === strings.alltitle) {
            // eslint-disable-next-line no-param-reassign
            roleItem.is_checked = false;
          }

          if (roleItem.title === item.title && 'is_checked' in roleItem) {
            return {
              ...roleItem,
              is_checked: !roleItem.is_checked,
            };
          }
          return roleItem;
        });

        const uncheckedElements = updatedparentGroupRole.filter(
          (roleItem) => !roleItem.is_checked,
        );

        if (
          uncheckedElements.length === 1 &&
          !uncheckedElements[0].is_checked
        ) {
          const elementToToggle = uncheckedElements[0];
          const updatedElement = {
            ...elementToToggle,
            is_checked: true,
          };
          const updatedConnectWithToggledElement = updatedparentGroupRole.map(
            (roleItem) =>
              roleItem === elementToToggle ? updatedElement : roleItem,
          );

          setParentGroup(updatedConnectWithToggledElement);
          return;
        }

        setParentGroup(updatedparentGroupRole);
      }
    }

    if (item.is_role) {
      if (item.role === Verbs.ALL_ROLE) {
        if (isallForRole) {
          setIsAllForRole(false);
        } else {
          setIsAllForRole(true);
        }

        const updatedRole = role.map((roleItem) => ({
          ...roleItem,
          is_checked: isallForRole,
        }));

        setRole(updatedRole);
      } else if (item.is_role) {
        const updatedRole = role.map((roleItem) => {
          if (roleItem.title === strings.alltitle) {
            // eslint-disable-next-line no-param-reassign
            roleItem.is_checked = false; // Set is_checked to false for 'All'
          }
          if (roleItem.title === item.title && 'is_checked' in roleItem) {
            return {
              ...roleItem,
              is_checked: !roleItem.is_checked,
            };
          }
          return roleItem;
        });

        const uncheckedElements = updatedRole.filter(
          (roleItem) => !roleItem.is_checked,
        );
        if (
          uncheckedElements.length === 1 &&
          !uncheckedElements[0].is_checked
        ) {
          const elementToToggle = uncheckedElements[0];
          const updatedElement = {...elementToToggle, is_checked: true};
          const updatedConnectWithToggledElement = updatedRole.map((roleItem) =>
            roleItem === elementToToggle ? updatedElement : roleItem,
          );

          setRole(updatedConnectWithToggledElement);
          return;
        }

        setRole(updatedRole);
      }
    }
  };

  const renderGenders = ({item}) => (
    <TouchableOpacity
      disabled={item.is_disable}
      style={{opacity: item?.is_disable ? 0.4 : 1}}
      onPress={() => {
        onItemPress(item);
      }}>
      <View
        style={{
          paddingHorizontal: 40,

          paddingVertical: 15,
          alignItems: 'center',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        <View style={{flexDirection: 'row'}}>
          <Text style={styles.languageList}>
            {item.title === strings.alltitle && item.is_group === true
              ? strings.club
              : item.title}
          </Text>
          {item.is_group && (
            <Image
              source={
                item.title === strings.alltitle
                  ? images.newClubIcon
                  : images.newTeamIcon
              }
              style={{
                width: 15,
                height: 15,
                marginLeft: 5,
                alignSelf: 'center',
              }}
            />
          )}
        </View>

        <View style={styles.checkbox}>
          {item.is_checked ? (
            <Image source={images.orangeCheckBox} style={styles.checkboxImg} />
          ) : (
            <Image source={images.uncheckWhite} style={styles.checkboxImg} />
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderProfileAccountOptions = ({item}) => (
    <TouchableOpacity
      onPress={() => {
        setProfileOptions(item);
      }}>
      <View
        style={{
          paddingHorizontal: 40,

          paddingVertical: 15,
          alignItems: 'center',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        <Text style={styles.languageList}>{item.title}</Text>

        <View style={styles.checkbox}>
          {item.title === profileOptions.title ? (
            <Image
              source={images.radioRoundOrange}
              style={styles.checkboxImg}
            />
          ) : (
            <Image source={images.radioUnselect} style={styles.checkboxImg} />
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  const onRightButtonPress = () => {
    const rolesWithIsCheckedTrue = role
      .filter((item) => item.is_checked === true && item.is_role === true)
      .map((item) => item.role);

    const connectWithIcCheckedTrue = [profileOptions].map(
      (item) => item.connected,
    );

    const TeamsSelectedIds = (() => {
      if (authContext.entity.role === Verbs.entityTypeTeam) {
        return [];
      }
      const nonTeamMembers = parentGroup.filter(
        (item) =>
          item.is_checked === true &&
          item.is_group === true &&
          item.group_id === Verbs.NonTeamMember_Role,
      );

      if (nonTeamMembers.length > 0) {
        return parentGroup.map((item) => item.group_id);
      }
      return parentGroup
        .filter((item) => item.is_checked === true && item.is_group === true)
        .map((item) => item.group_id);
    })();

    const finalTeamIds = nonMemberSelected
      ? TeamsSelectedIds.filter((item) => item !== Verbs.ALL_ROLE)
      : TeamsSelectedIds;

    if (authContext.entity.role === Verbs.entityTypeTeam) {
      setParentGroup([]);
    }

    if (parentGroup.length > 0) {
      if (
        (!connectWithIcCheckedTrue.length > 0 ||
          !TeamsSelectedIds.length > 0) &&
        parentGroup.length > 0
      ) {
        showAlert(strings.filterModalValidation);
      } else {
        onApplyPress(
          rolesWithIsCheckedTrue,
          connectWithIcCheckedTrue,
          finalTeamIds,
        );
      }
    } else if (
      !rolesWithIsCheckedTrue.length > 0 ||
      !connectWithIcCheckedTrue.length > 0
    ) {
      showAlert(strings.filterModalValidation);
    } else {
      onApplyPress(
        rolesWithIsCheckedTrue,
        connectWithIcCheckedTrue,
        finalTeamIds,
      );
    }
  };

  return (
    <CustomModalWrapper
      isVisible={visible}
      closeModal={onCloseModal}
      title={strings.filter}
      modalType={ModalTypes.style1}
      headerRightButtonText={strings.apply}
      onModalShow={() => {
        if (authContext.entity.role === Verbs.entityTypeClub) {
          getParentClub();
        }
      }}
      onRightButtonPress={() => onRightButtonPress()}
      containerStyle={{margin: 0, padding: 0}}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{paddingBottom: 70}}>
        <ActivityLoader visible={loading} />
        {authContext.entity.role === Verbs.entityTypeClub &&
          parentGroup.length > 1 && (
            <>
              <View>
                <Text style={styles.titleTextStyle}>{strings.groups}</Text>

                <FlatList
                  scrollEnabled={false}
                  data={parentGroup}
                  ItemSeparatorComponent={() => <TCThinDivider />}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={renderGenders}
                />
              </View>
              <TCThinDivider height={7} marginTop={15} />
            </>
          )}
        {/* Roles */}
        {authContext.entity.role === Verbs.entityTypeTeam && (
          <>
            <View>
              <Text style={styles.titleTextStyle}>{strings.roles}</Text>
              <FlatList
                scrollEnabled={false}
                extraData={role}
                data={role}
                ItemSeparatorComponent={() => <TCThinDivider />}
                keyExtractor={(item, index) => index.toString()}
                renderItem={renderGenders}
              />
            </View>
            <TCThinDivider height={7} marginTop={15} />
          </>
        )}

        {/* connection */}
        <View>
          <Text style={styles.titleTextStyle}>
            {strings.profileAccountConnectionText}
          </Text>
          <FlatList
            scrollEnabled={false}
            data={connectData}
            extraData={connectData}
            ItemSeparatorComponent={() => <TCThinDivider />}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderProfileAccountOptions}
          />
        </View>
      </ScrollView>
      {/* Teams Section */}
    </CustomModalWrapper>
  );
}

const styles = StyleSheet.create({
  languageList: {
    color: colors.lightBlackColor,
    fontFamily: fonts.RRegular,
    fontSize: 16,
    lineHeight: 24,
  },
  checkboxImg: {
    width: 22,
    height: 22,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  titleTextStyle: {
    textTransform: 'uppercase',
    fontSize: 16,
    fontFamily: fonts.RBold,
    lineHeight: 24,
    marginHorizontal: 25,
    marginTop: 25,
    marginBottom: 10,
  },
});
