import React, {
  useLayoutEffect, useState, useEffect,
} from 'react';
import {
  Text, View, StyleSheet, FlatList,
} from 'react-native';

import ActivityLoader from '../../../components/loader/ActivityLoader';
import strings from '../../../Constants/String';
import colors from '../../../Constants/Colors'
import fonts from '../../../Constants/Fonts';
import TCSearchBox from '../../../components/TCSearchBox';
import { getUsersList } from '../../../api/Accountapi';

import ProfileCheckView from '../../../components/groupConnections/ProfileCheckView';
import TCTags from '../../../components/TCTags';

export default function InviteMembersBySearchScreen({ navigation }) {
  const [loading, setloading] = useState(true);
  const [players, setPlayers] = useState([])
  const [searchPlayers, setSearchPlayers] = useState([]);

  const selectedPlayers = [];
  useEffect(() => {
    getUsers()
  }, [])
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Text style={styles.sendButtonStyle} onPress={() => console.log('Sent invitation')}>Send</Text>
      ),
    });
  }, [navigation]);

  const getUsers = async () => {
    getUsersList().then((response) => {
      if (response.status === true) {
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
        selectedPlayers.push(obj)
      }
      return obj;
    })

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
        selectedPlayers.push(obj)
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
