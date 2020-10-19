import React, {
  useEffect, useState,
} from 'react';
import {
  View, Text, Image,
} from 'react-native';

import {
  TouchableWithoutFeedback,
  FlatList,
  ScrollView,
} from 'react-native-gesture-handler';
import styles from './style';

import { getJoinedTeams, getTeamsByClub } from '../../../api/Accountapi';

import * as Utility from '../../../utility/index';

import PATH from '../../../Constants/ImagePath';

export default function JoinedTeamsScreen() {
  const [teamList, setTeamList] = useState([]);

  useEffect(() => {
    getTeamsList();
  }, []);

  const getTeamsList = async () => {
    const switchBy = await Utility.getStorage('switchBy');
    if (switchBy === 'club') {
      const clubObject = await Utility.getStorage('club');
      getTeamsByClub(clubObject.group_id).then((response) => {
        if (response.status === true) {
          console.log('RESPONSE OF TEAM LIST BY CLUB::', response.payload);
          setTeamList(response.payload);
        } else {
          alert(response.messages);
        }
      });
    } else {
      getJoinedTeams().then((response) => {
        if (response.status === true) {
          console.log('RESPONSE OF TEAM LIST::', response.payload);
          setTeamList(response.payload.teams);
        } else {
          alert(response.messages);
        }
      });
    }
  };

  return (
      <ScrollView style={ styles.mainContainer }>
          <FlatList
        data={ teamList }
        renderItem={ ({ item }) => (
            <TouchableWithoutFeedback
            style={ styles.listContainer }
            onPress={ () => {
              console.log('Pressed Team..');
            } }>
                <View>
                    {item.full_image ? (
                        <Image
                  source={ { uri: item.full_image } }
                  style={ styles.entityImg }
                />
                    ) : (
                        <Image source={ PATH.team_ph } style={ styles.entityImg } />
                    )}
                </View>

                <View style={ styles.textContainer }>
                    <Text style={ styles.entityNameText }>{item.group_name}</Text>

                    <Text style={ styles.entityLocationText }>
                        {item.city}, {item.state_abbr}, {item.country}
                    </Text>
                </View>
            </TouchableWithoutFeedback>
        ) }
        // ItemSeparatorComponent={() => (
        //   <View style={styles.separatorLine}></View>
        // )}
        scrollEnabled={ false }
      />
      </ScrollView>
  );
}
