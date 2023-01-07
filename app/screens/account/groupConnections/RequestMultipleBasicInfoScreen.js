import React, {
  useLayoutEffect,
  useState,
  useEffect,
  useContext,
  useCallback,
} from 'react';
import {Text, View, StyleSheet, FlatList, Alert} from 'react-native';

import {format} from 'react-string-format';
import ActivityLoader from '../../../components/loader/ActivityLoader';
import {strings} from '../../../../Localization/translation';
import colors from '../../../Constants/Colors';
import fonts from '../../../Constants/Fonts';
import TCSearchBox from '../../../components/TCSearchBox';
import AuthContext from '../../../auth/context';
import TCTags from '../../../components/TCTags';
import TCThinDivider from '../../../components/TCThinDivider';
import TCThickDivider from '../../../components/TCThickDivider';
import {getGroupMembers, sendBasicInfoRequest} from '../../../api/Groups';
import MemberProfile from '../../../components/groupConnections/MemberProfile';
import {showAlert} from '../../../utils';

export default function RequestMultipleBasicInfoScreen({navigation, route}) {
  const [loading, setloading] = useState(false);
  const authContext = useContext(AuthContext);
  const [players, setPlayers] = useState([]);
  const [searchPlayers, setSearchPlayers] = useState([]);

  const [selectedList, setSelectedList] = useState([]);

  const selectedPlayers = [];
  useEffect(() => {
    setloading(true);

    getGroupMembers(route.params?.groupID, authContext)
      .then((response) => {
        setloading(false);
        const result = response.payload.map((obj) => {
          // eslint-disable-next-line no-param-reassign
          obj.isChecked = false;
          return obj;
        });
        setPlayers(result);
        setSearchPlayers(result);
      })
      .catch((e) => {
        setloading(false);
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, e.message);
        }, 10);
      });
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Text
          style={styles.sendButtonStyle}
          onPress={() => sendRequestForBasicInfo()}>
          {strings.send}
        </Text>
      ),
    });
  }, [navigation, selectedList, searchPlayers]);

  const selectPlayer = ({item, index}) => {
    players[index].isChecked = !item.isChecked;
    players.map((obj) => {
      if (obj.isChecked) {
        selectedPlayers.push(obj.user_id);
      }
      return obj;
    });
    setSelectedList(selectedPlayers);
  };

  const renderPlayer = ({item, index}) => (
    <MemberProfile
      playerDetail={item}
      isChecked={item.isChecked}
      onPress={() => selectPlayer({item, index})}
    />
  );
  const handleTagPress = ({index}) => {
    players[index].isChecked = false;
    setPlayers([...players]);
    players.map((obj) => {
      if (obj.isChecked) {
        selectedPlayers.push(obj.user_id);
      }
      return obj;
    });
  };

  const listEmptyComponent = () => (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text
        style={{
          fontFamily: fonts.RRegular,
          color: colors.grayColor,
          fontSize: 26,
        }}>
        {strings.noPlayer}
      </Text>
    </View>
  );

  const ItemSeparatorComponent = useCallback(() => <TCThinDivider />, []);
  const searchFilterFunction = (text) => {
    const result = players.filter(
      (x) =>
        x?.first_name?.toLowerCase().includes(text.toLowerCase()) ||
        x?.last_name?.toLowerCase().includes(text.toLowerCase()),
    );
    if (text.length > 0) {
      setPlayers(result);
    } else {
      setPlayers(searchPlayers);
    }
  };

  const sendRequestForBasicInfo = () => {
    if (selectedList.length > 0) {
      setloading(true);

      sendBasicInfoRequest(route?.params?.groupID, selectedList, authContext)
        .then(() => {
          setloading(false);

          setTimeout(() => {
            showAlert(
              format(strings.multipleRequestSent, selectedList?.length),
              () => {
                navigation.goBack();
              },
            );
          }, 10);
        })
        .catch((e) => {
          setloading(false);
          setTimeout(() => {
            Alert.alert(strings.alertmessagetitle, e.message);
          }, 10);
        });
    } else {
      Alert.alert(strings.alertmessagetitle, strings.selectmemberValidation);
    }
  };

  return (
    <View style={styles.mainContainer}>
      <ActivityLoader visible={loading} />
      <Text style={styles.infoTextStyle}>{strings.collectMemberInfoText}</Text>

      <TCThickDivider marginBottom={15} />
      <TCSearchBox
        width={'90%'}
        alignSelf="center"
        onChangeText={(text) => {
          searchFilterFunction(text);
        }}
      />
      <TCTags
        dataSource={players}
        titleKey={'first_name'}
        onTagCancelPress={handleTagPress}
      />

      <FlatList
        extraData={players}
        showsVerticalScrollIndicator={false}
        data={players}
        keyExtractor={(item, index) => index.toString()}
        ItemSeparatorComponent={ItemSeparatorComponent}
        renderItem={renderPlayer}
        ListEmptyComponent={listEmptyComponent}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  infoTextStyle: {
    margin: 15,
    fontFamily: fonts.RRegular,
    fontSize: 16,
    color: colors.lightBlackColor,
  },
  sendButtonStyle: {
    fontFamily: fonts.RRegular,
    fontSize: 16,
    marginRight: 10,
  },
});
