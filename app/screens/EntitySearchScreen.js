import React, {
  useState, useLayoutEffect, useRef, useEffect,
} from 'react';
import {

  View,
  StyleSheet,
  Image,
  TouchableWithoutFeedback,
  Alert,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import * as Utility from '../utils/index';

import TCSearchBox from '../components/TCSearchBox';

import {
  getMyGroups,
} from '../api/Groups';

import {
  getUserList,
} from '../api/Users';

import ActivityLoader from '../components/loader/ActivityLoader';

import images from '../Constants/ImagePath'
import colors from '../Constants/Colors'

import TCProfileView from '../components/TCProfileView';
import TCThinDivider from '../components/TCThinDivider';

let entity = {};
export default function EntitySearchScreen({ navigation, route }) {
  const actionSheet = useRef();
  const isFocused = useIsFocused();
  // For activity indigator
  const [loading, setloading] = useState(true);
  const [searchMember, setSearchMember] = useState();

  const [groups, setGroups] = useState();
  const [switchUser, setSwitchUser] = useState({})

  let list = []

  useEffect(() => {
    console.log('NAVIGATION:', navigation);
    const getAuthEntity = async () => {
      entity = await Utility.getStorage('loggedInEntity');
      setSwitchUser(entity)
    }
    list = [];
    getMembers()
    getUsers()
    getAuthEntity()
  }, [isFocused])

  const getMembers = async () => {
    getMyGroups()
      .then((response) => {
        list = [...list, ...response.payload]
        setGroups([...list])
        setSearchMember(list)
        setloading(false);
      })
      .catch((e) => {
        Alert.alert('', e.messages)
      });
  }

  const getUsers = async () => {
    getUserList()
      .then((response) => {
        list = [...list, ...response.payload]
        setGroups([...list])
        setSearchMember(list)
        setloading(false);
      })
      .catch((e) => {
        Alert.alert('', e.messages)
      });
  }

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        switchUser.uid === route.params.groupID && <TouchableWithoutFeedback
            onPress={ () => actionSheet.current.show() }>
          <Image source={ images.horizontal3Dot } style={ styles.navigationRightItem } />
        </TouchableWithoutFeedback>

      ),
    });
  }, [navigation, switchUser]);

  const searchFilterFunction = (text) => {
    const result = searchMember.filter(
      (x) => ((x.group_name && x.group_name.includes(text)) || (x.first_name && x.first_name.includes(text))),
    );
    setGroups(result);
  };

  const onProfilePress = (item) => {
    console.log(item);
    navigation.navigate('HomeScreen', {
      uid: item.group_id ? item.group_id : item.user_id,
      backButtonVisible: true,
      role: item.entity_type === 'player' ? 'user' : item.entity_type,
    })
  }

  const renderList = ({ item }) => (
    <TouchableOpacity onPress={() => { onProfilePress(item) }}>
      <TCProfileView name={item.group_name || `${item.first_name} ${item.last_name}`} location={item.entity_type} margin={20} onPressProfile/>
      <TCThinDivider/>
    </TouchableOpacity>
  )

  return (
    <View>

      <ActivityLoader visible={loading} />

      <View style={styles.searchBarView}>
        <TCSearchBox onChangeText={ (text) => searchFilterFunction(text) } marginTop={70}/>
      </View>
      <FlatList
        data={groups}
        renderItem={renderList}
        onPressProfile = {() => navigation.navigate('MembersProfileScreen')}
        keyExtractor={(item, index) => index.toString()}
        style={{ marginBottom: 160 }}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  // filterImage: {
  //   marginLeft: 10,
  //   alignSelf: 'center',
  //   height: 25,
  //   resizeMode: 'contain',
  //   width: 25,
  // },
  searchBarView: {
    flexDirection: 'row',
    marginLeft: 20,
    marginTop: 20,
    marginBottom: 20,
  },
  navigationRightItem: {
    height: 15,
    marginRight: 20,
    resizeMode: 'contain',
    tintColor: colors.blackColor,
    width: 15,
  },

});
