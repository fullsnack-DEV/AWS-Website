import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, Alert, FlatList} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {getGroupList, getUserList} from '../../api/elasticSearch';

export default function SearchModel({searchText, onItemPress}) {
  const [searchUser, setSearchUser] = useState(searchText);
  const [userData, setUserData] = useState([]);
  const [groupData, setGroupData] = useState([]);
  const [filteredUserData, setFilteredUserData] = useState([]);

  useEffect(() => {
    getUserList()
      .then((response) => {
        setUserData(response);
      })
      .catch((e) => {
        console.log('eeeee Get Users :-', e.response);
        Alert.alert('', e.messages);
      });
  }, []);

  useEffect(() => {
    const newData = data.filter((item) => {
      const itemData = item.full_name
        ? item?.full_name?.toUpperCase()
        : ''.toUpperCase();
      const textData =
        searchText !== '' ? searchText?.toUpperCase() : ''.toUpperCase();
      return itemData.indexOf(textData) > -1;
    });
    setFilteredUserData(newData);
    setSearchUser(searchText);
  }, [searchText]);

  useEffect(() => {
    getGroupList()
      .then((response) => {
        setGroupData(response);
      })
      .catch((e) => {
        console.log('eeeee Get Group Users :-', e.response);
        Alert.alert('', e.messages);
      });
  }, []);

  const changeGroupData = [];
  groupData.map((item) => {
    const obj = {
      ...item,
      full_name: item.group_name,
    };
    return changeGroupData.push(obj);
  });

  const data = [...userData, ...changeGroupData];
  if (data) {
    data.sort((a, b) => {
      if (a.full_name > b.full_name) return 1;
      if (a.full_name < b.full_name) return -1;
      return 0;
    });
  }

  return (
    <FlatList
      data={searchUser.length > 0 ? filteredUserData : data}
      keyboardShouldPersistTaps={'always'}
      style={{paddingTop: hp(1)}}
      ListFooterComponent={() => <View style={{height: hp(6)}} />}
      renderItem={({item}) => {
        if (item && item.full_name) {
          return (
            <Text
              style={styles.userTextStyle}
              onPress={() => {
                onItemPress(item.full_name);
              }}>
              {item.full_name}
            </Text>
          );
        }
        return <View />;
      }}
      keyExtractor={(item, index) => index.toString()}
    />
  );
}

const styles = StyleSheet.create({
  userTextStyle: {
    paddingHorizontal: wp(5),
    paddingVertical: hp(1),
  },
});
