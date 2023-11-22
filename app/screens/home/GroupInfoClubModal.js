import {View, Text, StyleSheet, TextInput, Alert} from 'react-native';
import React, {useState, useContext, useEffect, useRef} from 'react';
import {format} from 'react-string-format';
import {FlatList} from 'react-native-gesture-handler';
import {useNavigation} from '@react-navigation/native';
import CustomModalWrapper from '../../components/CustomModalWrapper';
import {ModalTypes} from '../../Constants/GeneralConstants';
import fonts from '../../Constants/Fonts';
import {strings} from '../../../Localization/translation';
import ActivityLoader from '../../components/loader/ActivityLoader';
import GroupListItemView from '../../components/Home/GroupListItemView';
import Verbs from '../../Constants/Verbs';
import AuthContext from '../../auth/context';
import colors from '../../Constants/Colors';
import {followGroup, leaveTeam, unfollowGroup} from '../../api/Groups';
import {showAlert} from '../../utils';

export default function GroupInfoClubModal({
  isVisible,
  oncloseModal,
  entity_type,
  groups,
  refreshInfo = () => {},
}) {
  const navigation = useNavigation();

  const authContext = useContext(AuthContext);

  const [searchText, setSearchText] = useState('');
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const searchRef = useRef();

  useEffect(() => {
    if (groups.length > 0) {
      setList(groups);
    }
  }, [groups]);

  useEffect(() => {
    if (searchText) {
      clearTimeout(searchRef.current);
      searchRef.current = setTimeout(() => {
        const newList = groups.filter((item) =>
          item.group_name.toLowerCase().includes(searchText.toLowerCase()),
        );
        setList(newList);
      }, 300);
    } else {
      setList([...groups]);
    }
  }, [groups, searchText]);

  const handleFollowGroup = (groupId, groupType) => {
    const params = {
      entity_type: groupType,
    };

    setLoading(true);
    followGroup(params, groupId, authContext)
      .then(() => {
        const newList = list.map((group) => {
          if (group.group_id === groupId) {
            return {
              ...group,
              is_following: true,
            };
          }
          return {...group};
        });
        setList(newList);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);

        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, error.message);
        }, 10);
      });
  };

  const handleUnfollowGroup = (groupId, groupType) => {
    const params = {
      entity_type: groupType,
    };
    setLoading(true);
    unfollowGroup(params, groupId, authContext)
      .then(() => {
        const newList = list.map((group) => {
          if (group.group_id === groupId) {
            return {
              ...group,
              is_following: false,
            };
          }
          return {...group};
        });
        setList(newList);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, error.message);
        }, 10);
      });
  };

  const onRemovePress = (item) => {
    setLoading(true);
    const params = {};
    leaveTeam(params, item.group_id, authContext)
      .then(() => {
        setLoading(false);
        oncloseModal();
        refreshInfo();

        showAlert(format(strings.youHaveLeftTheteam, item.entity_type));
      })
      .catch((error) => {
        setLoading(false);
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, error.message);
        }, 10);
      });
  };

  return (
    <CustomModalWrapper
      isVisible={isVisible}
      closeModal={oncloseModal}
      modalType={ModalTypes.style2}
      containerStyle={{padding: 0}}>
      <View style={{alignItems: 'center', alignSelf: 'center', marginTop: 5}}>
        <Text style={{fontSize: 16, fontFamily: fonts.RBold, lineHeight: 24}}>
          {entity_type === Verbs.entityTypeClub
            ? strings.clubstitle
            : strings.teamstitle}
        </Text>
      </View>

      <ActivityLoader visible={loading} />
      <View style={styles.inputContainer}>
        <TextInput
          placeholder={strings.searchText}
          placeholderTextColor={colors.userPostTimeColor}
          style={styles.input}
          value={searchText}
          onChangeText={(text) => setSearchText(text)}
        />
      </View>

      <FlatList
        keyExtractor={(item, index) => index.toString()}
        bounces={false}
        data={list}
        contentContainerStyle={{paddingHorizontal: 15}}
        renderItem={({item}) =>
          authContext.entity.uid === item.group_id ? null : (
            <GroupListItemView
              groupData={item}
              onPress={(group) => {
                navigation.push('HomeScreen', {
                  uid: group.group_id,
                  backButtonVisible: true,
                  menuBtnVisible: false,
                  role: group.entity_type,
                });
              }}
              handleFollowUnfollow={() => {
                if (item.is_following) {
                  handleUnfollowGroup(item.group_id, item.entity_type);
                } else {
                  handleFollowGroup(item.group_id, item.entity_type);
                }
              }}
              loggedInEntityId={authContext.entity.uid}
              loggedInEntityType={authContext.entity.role}
              onRemovePress={() => onRemovePress(item)}
            />
          )
        }
        ListEmptyComponent={() => (
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text>{strings.noGroupFond}</Text>
          </View>
        )}
      />
    </CustomModalWrapper>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    paddingHorizontal: 15,
    paddingTop: 20,
    paddingBottom: 15,
  },
  input: {
    backgroundColor: colors.textFieldBackground,
    height: 40,
    borderRadius: 25,
    paddingHorizontal: 15,
    fontSize: 16,
    color: colors.lightBlackColor,
    fontFamily: fonts.RRegular,
  },
});
