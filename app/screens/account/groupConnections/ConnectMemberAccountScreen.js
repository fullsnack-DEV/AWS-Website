import React, {
  useState, useLayoutEffect, useEffect, useContext,
} from 'react';
import {
  View,
  StyleSheet,
  Image,
  TouchableWithoutFeedback,
  Alert,
  FlatList,
  Text,
} from 'react-native';
import { useIsFocused } from '@react-navigation/native';

import LinearGradient from 'react-native-linear-gradient'
import TCSearchBox from '../../../components/TCSearchBox'

import { getGroupMembers, connectProfile } from '../../../api/Groups';

import ActivityLoader from '../../../components/loader/ActivityLoader';
import colors from '../../../Constants/Colors'
import fonts from '../../../Constants/Fonts';
import images from '../../../Constants/ImagePath';
import AuthContext from '../../../auth/context'

let entity = {};
export default function ConnectMemberAccountScreen({ navigation, route }) {
  const isFocused = useIsFocused();
  const authContext = useContext(AuthContext)
  // For activity indigator
  const [loading, setloading] = useState(true);
  const [searchMember, setSearchMember] = useState([]);
  const [members, setMembers] = useState([]);
  const [switchUser, setSwitchUser] = useState({})

  useEffect(() => {
    const getAuthEntity = async () => {
      entity = authContext.entity
      setSwitchUser(entity)
    }
    getMembers()
    getAuthEntity()
  }, [isFocused])

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Text style={styles.nextButtonStyle} onPress={() => connectMemberProfile()}>Done</Text>
      ),
    });
  }, [navigation, switchUser, members, searchMember, loading])

  const getMembers = async () => {
    setloading(true)
    getGroupMembers(route.params.groupID, authContext)
      .then((response) => {
        // eslint-disable-next-line array-callback-return
        response.payload.map((e) => {
          e.isSelect = false;
        });
        setMembers(response.payload.filter((obj) => obj.group_member_detail.connected === false && obj.group_member_detail.canConnect === true))
        setSearchMember(response.payload.filter((obj) => obj.group_member_detail.connected === false && obj.group_member_detail.canConnect === true))
        setloading(false);
      })
      .catch((error) => {
        setloading(false)
        Alert.alert(error)
      })
  }
  const connectMemberProfile = () => {
    const result = members.filter((x) => x.isSelect === true);
    const obj = result[0]
    if (result.length > 0) {
      setloading(true)
      connectProfile(switchUser.uid, obj.user_id, authContext).then(() => {
        setloading(false)
        navigation.navigate('ConnectionReqSentScreen', { memberObj: obj });
      })
        .catch((error) => {
          setloading(false)
          Alert.alert(error)
        })
    } else {
      Alert.alert('Towns Cup', 'Please select one member for connect with profile.')
    }
  }
  const searchFilterFunction = (text) => {
    const result = searchMember.filter(
      (x) => x.first_name.includes(text) || x.last_name.includes(text),
    );
    setMembers(result);
  };
  const renderMembers = ({ item }) => (

    item.isSelect
      ? <TouchableWithoutFeedback onPress = {() => {
        // eslint-disable-next-line array-callback-return
        members.map((e) => {
          if (item === e) {
            e.isSelect = false;
          } else {
            e.isSelect = true;
          }
        });
        setMembers([...members]);
      }}>
        <LinearGradient
     colors={[colors.greenGradientStart, colors.greenGradientEnd]}
     style={styles.topViewContainer}>
          <View style={{ flexDirection: 'row' }}>
            <View style={styles.profileView}>
              <Image source={ item.thumbnail ? { uri: item.thumbnail } : images.profilePlaceHolder } style={ styles.profileImage } />
            </View>
            <View style={styles.topTextContainer}>
              <Text style={styles.whiteNameText} numberOfLines={1}>{item.first_name} {item.last_name}</Text>
              <Text style={styles.whiteLocationText} numberOfLines={1}>{item.city}</Text>
            </View>
          </View>
          <Image source={images.radioSelectGreen} style={styles.checkGreenImage}/>
        </LinearGradient>
      </TouchableWithoutFeedback>
      : <TouchableWithoutFeedback onPress = {() => {
        // eslint-disable-next-line array-callback-return
        members.map((e) => {
          if (item === e) {
            e.isSelect = true;
          } else {
            e.isSelect = false;
          }
        });

        setMembers([...members]);
      }}>
        <View style={styles.topViewContainer}>
          <View style={{ flexDirection: 'row' }}>
            <View style={styles.profileView}>
              <Image source={ item.thumbnail ? { uri: item.thumbnail } : images.profilePlaceHolder } style={ styles.profileImage } />
            </View>
            <View style={styles.topTextContainer}>
              <Text style={styles.mediumNameText} numberOfLines={1}>{item.first_name} {item.last_name}</Text>
              <Text style={styles.locationText} numberOfLines={1}>{item.city}</Text>
            </View>
          </View>
          <Image source={images.radioUnSelectGreen} style={styles.checkImage}/>
        </View>
      </TouchableWithoutFeedback>
  );
  return (
    <View style={styles.mainContainer}>
      <ActivityLoader visible={loading} />
      <View tabLabel='Members' style={{ flex: 1 }}>
        <View style={styles.searchBarView}>
          <TCSearchBox onChangeText={ (text) => searchFilterFunction(text) }/>
          {/* <TouchableWithoutFeedback onPress={() => toggleModal()}>
              <Image source={ images.filterIcon } style={ styles.filterImage } />
            </TouchableWithoutFeedback> */}
        </View>

        {/* {members.length > 0 && <FlatList
        data={members}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => <TCProfileView type={'medium'} name={item.first_name + ' ' + item.last_name}/>
        /> */}

        <FlatList
        data={members}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderMembers}
       />
      </View>
    </View>
  );
}
const styles = StyleSheet.create({

  mainContainer: {
    flex: 1,
    flexDirection: 'column',
  },

  searchBarView: {
    flexDirection: 'row',
    marginLeft: 20,
    marginTop: 20,
    marginBottom: 20,
  },
  // Radio
  profileImage: {
    alignSelf: 'center',
    height: 36,
    resizeMode: 'cover',
    width: 36,
    borderRadius: 18,
  },

  topViewContainer: {
    flexDirection: 'row',
    backgroundColor: colors.offwhite,
    height: 60,
    width: ('90%'),
    alignSelf: 'center',
    justifyContent: 'space-between',
    paddingRight: 10,
    paddingLeft: 10,
    marginBottom: 10,

    borderRadius: 10,
    shadowColor: colors.grayColor,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 3,
  },
  profileView: {
    backgroundColor: colors.whiteColor,
    height: 38,
    width: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.grayColor,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 3,
    alignSelf: 'center',
  },
  topTextContainer: {
    marginLeft: 10,
    alignSelf: 'center',
  },

  whiteNameText: {
    fontSize: 16,
    color: colors.whiteColor,
    fontFamily: fonts.RBold,
  },

  whiteLocationText: {
    fontSize: 14,
    color: colors.whiteColor,
    fontFamily: fonts.RLight,
  },

  checkGreenImage: {
    height: 22,
    width: 22,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  checkImage: {
    height: 22,
    width: 22,
    resizeMode: 'contain',
    alignSelf: 'center',

  },
  mediumNameText: {
    fontSize: 16,
    color: colors.lightBlackColor,
    fontFamily: fonts.RBold,
  },
  locationText: {
    fontSize: 14,
    color: colors.lightBlackColor,
    fontFamily: fonts.RLight,
  },
  nextButtonStyle: {
    fontFamily: fonts.RRegular,
    fontSize: 16,
    marginRight: 10,
  },
});
