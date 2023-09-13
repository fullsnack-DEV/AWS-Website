import {
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  Alert,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import React, {useState} from 'react';
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

export default function MemberFilterModal({
  visible,
  groupID,
  authContext,
  closeModal,
  onApplyPress,
}) {
  const [parentGroup, setParentGroup] = useState([]);
  const [isallForConnect, setIsAllForConnect] = useState(false);
  const [isallForRole, setIsAllForRole] = useState(false);
  const [loading, setloading] = useState(false);
  const [firstTimeCalled, setFirstTimeCalled] = useState(false);

  const filterEntity = [
    {
      title: 'All',
      role: 'is_all',
      is_role: true,
      is_checked: true,
    },
    {
      title: 'Admin',
      role: 'is_admin',
      is_role: true,
      is_checked: true,
    },
    {
      title: 'Coach',
      role: 'is_coach',
      is_role: true,
      is_checked: true,
    },
    {
      title: 'Player',
      role: 'is_player',
      is_role: true,
      is_checked: true,
    },
    {
      title: 'Parent',
      role: 'is_parent',
      is_role: true,
      is_checked: true,
    },
    {
      title: 'No role',
      role: 'no_role',
      is_role: true,
      is_checked: true,
    },
  ];

  const [role, setRole] = useState(filterEntity);
  const ConnectionData = [
    {
      title: 'All',
      is_checked: true,
      is_connect: true,
      connected: 'is_all',
    },
    {
      title: 'Connected to account',
      is_checked: true,
      connected: true,
      is_connect: true,
    },
    {
      title: 'Disconnected to account',
      is_checked: true,
      connected: false,
      is_connect: true,
    },
  ];

  const [connectData, setConnectdata] = useState(ConnectionData);

  const onCloseModal = () => {
    const updatedConnect = connectData.map((roleItem) => ({
      ...roleItem,
      is_checked: true,
    }));
    const updatedRole = role.map((roleItem) => ({
      ...roleItem,
      is_checked: true,
    }));
    setConnectdata(updatedConnect);
    setRole(updatedRole);
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
              is_checked: false,
            }));

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

  const onItemPress = (item) => {
    if (item.is_role) {
      if (item.role === 'is_all') {
        setIsAllForRole(!isallForRole);
        const updatedRole = role.map((roleItem) => ({
          ...roleItem,
          is_checked: isallForRole,
        }));

        setRole(updatedRole);
      } else if (item.is_role) {
        const updatedRole = role.map((roleItem) => {
          if (
            roleItem.title === item.title &&
            // eslint-disable-next-line no-prototype-builtins
            roleItem.hasOwnProperty('is_checked')
          ) {
            return {
              ...roleItem,
              is_checked: !roleItem.is_checked,
            };
          }
          return roleItem;
        });

        setRole(updatedRole);
      }
    }
    if (item.is_connect) {
      if (item.connected === 'is_all') {
        setIsAllForConnect(!isallForConnect);

        const updatedConnect = connectData.map((roleItem) => ({
          ...roleItem,
          is_checked: isallForConnect,
        }));

        setConnectdata(updatedConnect);
      } else if (item.is_connect) {
        const updatedConnect = connectData.map((roleItem) => {
          if (
            roleItem.title === item.title &&
            // eslint-disable-next-line no-prototype-builtins
            roleItem.hasOwnProperty('is_checked')
          ) {
            return {
              ...roleItem,
              is_checked: !roleItem.is_checked,
            };
          }
          return roleItem;
        });

        setConnectdata(updatedConnect);
      }
    }
  };

  const renderGenders = ({item}) => (
    <TouchableOpacity
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
        <Text style={styles.languageList}>{item.title}</Text>
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

  const onRightButtonPress = () => {
    const rolesWithIsCheckedTrue = role
      .filter((item) => item.is_checked === true && item.is_role === true)
      .map((item) => item.role);

    const connectWithIcCheckedTrue = connectData
      .filter((item) => item.is_checked === true && item.is_connect === true)
      .map((item) => item.connected);

    onApplyPress(rolesWithIsCheckedTrue, connectWithIcCheckedTrue);
  };

  return (
    <CustomModalWrapper
      isVisible={visible}
      closeModal={onCloseModal}
      title={strings.filter}
      modalType={ModalTypes.style1}
      headerRightButtonText={strings.apply}
      onModalShow={() => getParentClub()}
      onRightButtonPress={() => onRightButtonPress()}
      containerStyle={{margin: 0, padding: 0}}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <ActivityLoader visible={loading} />
        {authContext.entity.role === Verbs.entityTypeClub && (
          <>
            <View>
              <Text style={styles.titleTextStyle}>{strings.teams}</Text>

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
        {/* connection */}
        <View>
          <Text style={styles.titleTextStyle}>
            {'Profile-Account Connection'}
          </Text>
          <FlatList
            scrollEnabled={false}
            data={connectData}
            extraData={connectData}
            ItemSeparatorComponent={() => <TCThinDivider />}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderGenders}
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
