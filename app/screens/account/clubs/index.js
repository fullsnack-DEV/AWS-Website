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

import { getJoinedTeams } from '../../../api/Accountapi';

import images from '../../../Constants/ImagePath';

export default function JoinedClubsScreen() {
  const [clubList, setClubList] = useState([]);

  useEffect(() => {
    getJoinedTeams().then((response) => {
      if (response.status === true) {
        setClubList(response.payload.clubs);
      } else {
        alert(response.messages);
      }
    });
  }, []);

  return (
    <ScrollView style={ styles.mainContainer }>
      <FlatList
        data={ clubList }
        renderItem={ ({ item }) => (
          <TouchableWithoutFeedback
            style={ styles.listContainer }
            onPress={ () => {
              console.log('Pressed club..');
            } }>
            <View>
              {item.full_image ? (
                <Image
                  source={ { uri: item.full_image } }
                  style={ styles.entityImg }
                />
              ) : (
                <Image source={ images.club_ph } style={ styles.entityImg } />
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
