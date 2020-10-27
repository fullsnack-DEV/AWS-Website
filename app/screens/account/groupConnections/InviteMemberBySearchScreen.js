import React, {
  useLayoutEffect, useState, useEffect,
} from 'react';
import {
  Text, View, StyleSheet, FlatList, Alert,
} from 'react-native';

import ActivityLoader from '../../../components/loader/ActivityLoader';
import strings from '../../../Constants/String';
import colors from '../../../Constants/Colors'
import fonts from '../../../Constants/Fonts';
import TCSearchBox from '../../../components/TCSearchBox';
import { getUsersList, sendInvitationInGroup } from '../../../api/Accountapi';
import * as Utility from '../../../utils/index';
import ProfileCheckView from '../../../components/groupConnections/ProfileCheckView';
import TCTags from '../../../components/TCTags';

export default function InviteMembersBySearchScreen({ navigation }) {
  const [loading, setloading] = useState(true);
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
  }, [navigation]);

  const sendInvitation = async () => {
    const entity = await Utility.getStorage('loggedInEntity');
    const obj = {
      entity_type: entity.role,
      userIds: [...selectedList],
      uid: entity.uid,
    }
    sendInvitationInGroup(obj).then((response) => {
      console.log('Response of Invitation sent:', response);
      navigation.navigate('InvitationSentScreen');
    })
      .catch((e) => {
        Alert.alert('', e.messages)
      });
  }
  const getUsers = async () => {
    getUsersList().then((response) => {
      if (response.status) {
        setloading(false);
        const result = response.payload.map((obj) => {
          // eslint-disable-next-line no-param-reassign
          obj.isChecked = false;
          return obj;
        })

        setPlayers(result);
        setSearchPlayers(result);
      }
    });
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
