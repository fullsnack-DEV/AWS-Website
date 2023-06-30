import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, SafeAreaView, KeyboardAvoidingView, Platform, Image, TouchableOpacity, Alert, TextInput, FlatList} from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import images from '../../Constants/ImagePath';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';
import {getGroupList, getUserList} from '../../api/elasticSearch';
import {strings} from '../../../Localization/translation';

export default function TagUserScreen({backBtnPress, onItemPress}) {
  const [searchUser, setSearchUser] = useState('');
  const [userData, setUserData] = useState([]);
  const [groupData, setGroupData] = useState([]);
  const [filteredUserData, setFilteredUserData] = useState([]);

  useEffect(() => {
    getUserList()
      .then((response) => {
        setUserData(response);
      })
      .catch((e) => {
        Alert.alert('', e.messages);
      });
  }, []);

  useEffect(() => {
    getGroupList()
      .then((response) => {
        setGroupData(response);
      })
      .catch((e) => {
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
    <KeyboardAvoidingView style={{flex: 1, backgroundColor: 'white'}} behavior={Platform.OS === 'ios' ? 'padding' : null}>
      <SafeAreaView>
        <View style={styles.containerStyle}>
          <View style={styles.backIconViewStyle}>
            <TouchableOpacity onPress={backBtnPress}>
              <Image source={images.backArrow} style={styles.backImage} />
            </TouchableOpacity>
          </View>
          <View style={styles.writePostViewStyle}>
            <Text style={styles.writePostTextStyle}>{strings.tagUser}</Text>
          </View>
          <View style={styles.doneViewStyle}>
            {/* <Text
                        style={ styles.doneTextStyle }
                        onPress={ () => { }}>
                          Done
                      </Text> */}
          </View>
        </View>
      </SafeAreaView>
      <View style={styles.sperateLine} />
      <View style={styles.searchViewStyle}>
        <View style={styles.searchImageViewStyle}>
          <Image source={images.searchUser} style={styles.searchImageStyle} />
        </View>
        <TextInput
          placeholder={strings.searchUser}
          placeholderTextColor={colors.disableColor}
          style={styles.searchUserTextStyle}
          autoCorrect={false}
          autoFocus={true}
          onChangeText={(text) => {
            const newData = data.filter((item) => {
              const itemData = item.full_name ? item.full_name.toUpperCase() : ''.toUpperCase();
              const textData = text.toUpperCase();
              return itemData.indexOf(textData) > -1;
            });
            setFilteredUserData(newData);
            setSearchUser(text);
          }}
          value={searchUser}
        />
      </View>
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
                  onItemPress(item);
                }}>
                {item.full_name}
              </Text>
            );
          }
          return <View />;
        }}
        keyExtractor={(item, index) => index.toString()}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  containerStyle: {
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: hp('1%'),
    width: wp('92%'),
  },
  backIconViewStyle: {
    justifyContent: 'center',
    width: wp('17%'),
  },
  backImage: {
    height: hp('2%'),
    tintColor: colors.lightBlackColor,
    width: hp('1.5%'),
  },
  // doneTextStyle: {
  //   color: colors.lightBlackColor,
  //   fontFamily: fonts.RLight,
  //   fontSize: 14,
  // },
  doneViewStyle: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    width: wp('17%'),
  },
  writePostTextStyle: {
    color: colors.lightBlackColor,
    fontFamily: fonts.RBold,
    fontSize: 16,
  },
  writePostViewStyle: {
    alignItems: 'center',
    justifyContent: 'center',
    width: wp('58%'),
  },
  sperateLine: {
    borderColor: colors.writePostSepratorColor,
    borderWidth: 0.5,
    marginVertical: hp('1%'),
  },
  searchViewStyle: {
    width: wp('90%'),
    alignSelf: 'center',
    padding: 10,
    marginTop: 10,
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: colors.disableColor,
  },
  searchImageViewStyle: {
    width: wp('8%'),
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchImageStyle: {
    width: 20,
    height: 20,
    tintColor: colors.blackColor,
  },
  searchUserTextStyle: {
    width: wp('75%'),
    color: colors.blackColor,
    marginLeft: 5,
  },
  userTextStyle: {
    paddingHorizontal: wp(5),
    paddingVertical: hp(1),
  },
});
