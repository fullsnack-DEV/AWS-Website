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

} from 'react-native';
import { useIsFocused } from '@react-navigation/native';

import * as Utility from '../utils/index';

import TCSearchBox from '../components/TCSearchBox';

import {
  getMyGroups,
} from '../api/Groups';
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

  useEffect(() => {
    console.log('NAVIGATION:', navigation);
    const getAuthEntity = async () => {
      entity = await Utility.getStorage('loggedInEntity');
      setSwitchUser(entity)
    }
    getMembers()
    getAuthEntity()
  }, [isFocused])

  const getMembers = async () => {
    getMyGroups()
      .then((response) => {
        setGroups(response.payload)
        setSearchMember(response.payload)
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
      (x) => x.group_name.includes(text),
    );
    setGroups(result);
  };
  const renderList = ({ item }) => (

    <View>
      <TCProfileView name={item.group_name} location={item.entity_type} margin={20}/>
      <TCThinDivider/>
    </View>
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
