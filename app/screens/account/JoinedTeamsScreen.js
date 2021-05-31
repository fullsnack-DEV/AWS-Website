import React, {
  useEffect, useState, useContext,
} from 'react';
import {
  View, Text, Image, TouchableWithoutFeedback,
  FlatList,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import { getJoinedGroups, getTeamsOfClub } from '../../api/Groups';
import colors from '../../Constants/Colors'
import fonts from '../../Constants/Fonts'
import images from '../../Constants/ImagePath'
import AuthContext from '../../auth/context'
import strings from '../../Constants/String';

export default function JoinedTeamsScreen() {
  const [teamList, setTeamList] = useState([]);
  const authContext = useContext(AuthContext)
  useEffect(() => {
    getTeamsList();
  }, []);

  const getTeamsList = async () => {
    const entity = authContext.entity
    if (entity.role === 'club') {
      getTeamsOfClub(entity.uid, authContext).then((response) => {
        setTeamList(response.payload);
      }).catch((e) => {
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, e.message);
        }, 10);
      });
    } else {
      getJoinedGroups(false, 'team', authContext).then((response) => {
        setTeamList(response.payload);
      }).catch((e) => {
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, e.message);
        }, 10);
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
                <Image source={ images.team_ph } style={ styles.entityImg } />
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
const styles = StyleSheet.create({

  entityImg: {
    alignSelf: 'center',
    borderColor: colors.whiteColor,
    borderRadius: 10,

    borderWidth: 1,
    height: 60,
    margin: 15,
    resizeMode: 'cover',
    width: 60,
  },
  entityLocationText: {
    color: colors.lightBlackColor,
    fontFamily: fonts.RLight,
    fontSize: wp('3.8%'),
    marginTop: 5,
  },
  entityNameText: {
    color: colors.lightBlackColor,
    fontFamily: fonts.RBold,
    fontSize: wp('4%'),
    marginTop: hp('1%'),
  },
  listContainer: {
    flex: 1,
    flexDirection: 'row',
  },

  mainContainer: {
    flex: 1,
    flexDirection: 'column',
    width: '100%',
    height: '100%',
  },

  textContainer: {
    height: 80,
    justifyContent: 'center',
  },
});
