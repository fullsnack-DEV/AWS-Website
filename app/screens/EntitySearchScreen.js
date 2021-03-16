import React, {
  useState, useEffect, useContext,
} from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';

import TCSearchBox from '../components/TCSearchBox';

import {
  getMyGroups,
} from '../api/Groups';

import {
  getUserList,
} from '../api/Users';

import AuthContext from '../auth/context'
import TCProfileView from '../components/TCProfileView';
import TCThinDivider from '../components/TCThinDivider';
import UserListShimmer from '../components/shimmer/commonComponents/UserListShimmer';

export default function EntitySearchScreen({ navigation }) {
  const authContext = useContext(AuthContext)
  // For activity indigator
  const [loading, setloading] = useState(true);
  const [searchMember, setSearchMember] = useState();
  const [groups, setGroups] = useState();

  let list = []

  useEffect(() => {
    list = [];
    const promises = [getMyGroups(authContext), getUserList(authContext)]
    Promise.all(promises).then(([res1, res2]) => {
      list = [...res1.payload, ...res2.payload]
      setGroups([...list])
      setSearchMember(list)
      setloading(false);
    })
  }, [])

  const searchFilterFunction = (text) => {
    const result = searchMember.filter(
      (x) => (
        (x.group_name && x.group_name.toLowerCase().includes(text.toLowerCase()))
      || (x.first_name && x.first_name.toLowerCase().includes(text.toLowerCase()))),
    );
    setGroups(result);
  };

  const onProfilePress = (item) => {
    navigation.navigate('HomeScreen', {
      uid: ['user', 'player']?.includes(item?.entity_type) ? item?.user_id : item?.group_id,
      role: ['user', 'player']?.includes(item?.entity_type) ? 'user' : item.entity_type,
      backButtonVisible: true,
      menuBtnVisible: false,
    })
  }

  const renderList = ({ item }) => {
    if (!(authContext?.entity?.uid === (item?.group_id || item?.user_id))) {
      return (
        <TouchableOpacity onPress={() => { onProfilePress(item) }}>
          <TCProfileView name={item.group_name || `${item.first_name} ${item.last_name}`} location={item.entity_type} margin={20} onPressProfile/>
          <TCThinDivider/>
        </TouchableOpacity>
      )
    }
    return null;
  }

  return (
    <View style={{ flex: 1 }}>

      <View style={styles.searchBarView}>
        <TCSearchBox editable={!loading} onChangeText={ (text) => searchFilterFunction(text) } />
      </View>
      {loading
          ? <UserListShimmer/>
          : <FlatList
              data={groups}
              renderItem={renderList}
              onPressProfile = {() => navigation.navigate('MembersProfileScreen')}
              keyExtractor={(item, index) => index.toString()}
              ListFooterComponent={() => <View style={{ marginBottom: 90 }} />}
          />
      }

    </View>
  );
}
const styles = StyleSheet.create({
  searchBarView: {
    flexDirection: 'row',
    marginLeft: 20,
    marginTop: 20,
    marginBottom: 20,
  },
});
