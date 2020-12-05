import React, {
  useState,
  useLayoutEffect,
} from 'react';

import {
  View,
  Text,
  ScrollView,
  Alert,
  StyleSheet,
} from 'react-native';

import TCTextField from '../../components/TCTextField';
import TCLabel from '../../components/TCLabel';
import { patchGroup } from '../../api/Groups';
import ActivityLoader from '../../components/loader/ActivityLoader';
import strings from '../../Constants/String';
import * as Utility from '../../utils';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';
import TCPicker from '../../components/TCPicker';

export default function GameFeeEditScreen({ navigation, route }) {
  // For activity indicator
  const [loading, setloading] = useState(false);
  const [gameFee, setGameFee] = useState(route.params.groupDetails.game_fee);
  const [currency, setCurrency] = useState(route.params.groupDetails.currency_type);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Text style={ {
          marginEnd: 16,
          fontSize: 14,
          fontFamily: fonts.RRegular,
          color: colors.lightBlackColor,
        } } onPress={ () => {
          onSaveButtonClicked();
        } }>{strings.done}</Text>
      ),
    });
  }, [navigation, gameFee]);

  const onSaveButtonClicked = () => {
    setloading(true);
    const groupProfile = {};
    groupProfile.game_fee = gameFee;
    groupProfile.currency_type = currency;
    patchGroup(route.params.groupDetails.group_id, groupProfile).then(async (response) => {
      setloading(false);
      if (response && response.status === true) {
        const entity = await Utility.getStorage('loggedInEntity')
        entity.obj = response.payload;
        Utility.setStorage('loggedInEntity', entity);
        navigation.goBack();
      } else {
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, 'Something went wrong');
        }, 0.1)
      }
    })
  }

  return (
    <>
      <ScrollView style={styles.mainContainer}>
        <ActivityLoader visible={loading} />
        <View>
          <View style={{ flexDirection: 'row', alignContent: 'flex-end', alignItems: 'flex-end' }}>
            <TCLabel title= {strings.gamefeetitle}/>
            <Text style={{
              marginTop: 20,
              marginBottom: 10,
              marginLeft: 4,
              fontSize: 16,
              fontFamily: fonts.RRegular,
              color: colors.userPostTimeColor,
            }}>{strings.perhoursinbracket}</Text>
          </View>
          <View style={{ flexDirection: 'row' }}>
            <TCTextField
              style={{ width: '50%', marginRight: 5 }}
              placeholder={strings.enterBioPlaceholder}
              onChangeText={(text) => setGameFee(text)}
              multiline
              maxLength={5}
              keyboardType={'decimal-pad'}
              value={gameFee}
              />
            <TCPicker
              dataSource={[
                { label: 'CAD', value: 'CAD' },
                { label: 'USD', value: 'USD' },
              ]}
              placeholder={strings.currencyplacholder}
              value={currency}
              onValueChange={(value) => {
                console.log('value', value)
                setCurrency(value);
              }}
            />
          </View>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    flexDirection: 'column',
  },
});
