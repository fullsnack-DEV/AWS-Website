import React, {
  useLayoutEffect, useState, useEffect, useContext,
} from 'react';
import {
  Text, View, StyleSheet, FlatList, Alert,
} from 'react-native';

import ActivityLoader from '../../../components/loader/ActivityLoader';
import strings from '../../../Constants/String';
import colors from '../../../Constants/Colors'
import fonts from '../../../Constants/Fonts';
import TCSearchBox from '../../../components/TCSearchBox';
import { sendInvitationInGroup } from '../../../api/Users';
import AuthContext from '../../../auth/context'
import ProfileCheckView from '../../../components/groupConnections/ProfileCheckView';
import TCTags from '../../../components/TCTags';
import { getUserIndex } from '../../../api/elasticSearch';

export default function InviteMembersBySearchScreen({ navigation }) {
  const [loading, setloading] = useState(true);
  const authContext = useContext(AuthContext)
  const [players, setPlayers] = useState([])
  const [searchPlayers, setSearchPlayers] = useState([]);
  const [selectedList, setSelectedList] = useState([]);

  const selectedPlayers = [];
  useEffect(() => {
    getUsers()
  }, [])
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Text style={styles.sendButtonStyle} onPress={() => sendInvitation()}>Send</Text>
      ),
    });
  }, [navigation, selectedList]);

  const sendInvitation =  () => {
    setloading(true)
    const entity = authContext.entity
    const obj = {
      entity_type: entity.role,
      userIds: selectedList,
      uid: entity.uid,
    }
    console.log('Obj::', obj);
    sendInvitationInGroup(obj, authContext).then((response) => {
      setloading(false);
      console.log('Response of Invitation sent:', response);
      navigation.navigate('InvitationSentScreen');
    })
      .catch((e) => {
        setloading(false);
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, e.message);
        }, 10);
      });
  }
  const getUsers =  () => {
   getUserIndex().then((response) => {
     console.log('User list:->',response);
      setloading(false);
      const result = response.map((obj) => {
        // eslint-disable-next-line no-param-reassign
        obj.isChecked = false;
        return obj;
      })
      setPlayers(result);
      setSearchPlayers(result);
    }).catch((error) => {
      setloading(false)
      Alert.alert(error)
    })
  };
  const selectPlayer = ({ item, index }) => {
    players[index].isChecked = !item.isChecked;
    setPlayers([...players]);
    players.map((obj) => {
      if (obj.isChecked) {
        selectedPlayers.push(obj.user_id)
      }
      return obj;
    })
    setSelectedList(selectedPlayers);
    console.log('Selected Item:', selectedPlayers);
  };
  const searchFilterFunction = (text) => {
    const result = searchPlayers.filter(
      (x) => x.first_name.includes(text) || x.last_name.includes(text),
    );
    setPlayers(result);
  };
  const renderPlayer = ({ item, index }) => (
    <ProfileCheckView playerDetail = {item} isChecked = {item.isChecked} onPress={() => selectPlayer({ item, index })}/>
  );
  const handleTagPress = ({ index }) => {
    players[index].isChecked = false;
    setPlayers([...players]);
    players.map((obj) => {
      if (obj.isChecked) {
        selectedPlayers.push(obj.user_id)
      }
      return obj;
    })
  };
  return (
    <View style={styles.mainContainer}>
      <ActivityLoader visible={loading} />
      <Text style={styles.infoTextStyle}>
        {strings.inviteSearchText}
      </Text>
      <TCSearchBox width={'90%'} alignSelf='center' onChangeText={ (text) => searchFilterFunction(text) }/>
      <TCTags dataSource={players} titleKey={'full_name'} onTagCancelPress={handleTagPress}/>
      <FlatList
                  data={players}
                  renderItem={renderPlayer}
                  keyExtractor={(item, index) => index.toString()}
                  />

    </View>
  );
}
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  infoTextStyle: {
    marginTop: 20,
    marginLeft: 20,
    marginBottom: 20,
    fontFamily: fonts.RRegular,
    fontSize: 16,
    color: colors.lightBlackColor,
  },
  sendButtonStyle: {
    fontFamily: fonts.RRegular,
    fontSize: 16,
    marginRight: 10,
  },

})
