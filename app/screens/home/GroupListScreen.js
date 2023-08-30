import React, {
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';

import {
  View,
  FlatList,
  Text,
  SafeAreaView,
  TextInput,
  StyleSheet,
  Alert,
} from 'react-native';

import {strings} from '../../../Localization/translation';
import GroupListItemView from '../../components/Home/GroupListItemView';
import Verbs from '../../Constants/Verbs';
import ScreenHeader from '../../components/ScreenHeader';
import images from '../../Constants/ImagePath';
import AuthContext from '../../auth/context';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';
import {followGroup, unfollowGroup} from '../../api/Groups';
import ActivityLoader from '../../components/loader/ActivityLoader';

const GroupListScreen = ({navigation, route}) => {
  const authContext = useContext(AuthContext);
  const {groups, entity_type} = route.params;

  const [searchText, setSearchText] = useState('');
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const searchRef = useRef();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

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

  return (
    <SafeAreaView style={{flex: 1}}>
      <ScreenHeader
        title={
          entity_type === Verbs.entityTypeClub
            ? strings.clubstitle
            : strings.teamstitle
        }
        leftIconPress={() => navigation.goBack()}
        leftIcon={images.backArrow}
      />
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
            />
          )
        }
        ListEmptyComponent={() => (
          <View>
            <Text>{strings.noGroupFond}</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

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

export default GroupListScreen;
