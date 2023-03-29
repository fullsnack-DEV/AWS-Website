import React, {useContext, useState} from 'react';
import {StyleSheet, Alert, SafeAreaView, View, Text} from 'react-native';
import ActivityLoader from '../../components/loader/ActivityLoader';
import AuthContext from '../../auth/context';
import {patchPlayer} from '../../api/Users';
import {setAuthContextData} from '../../utils';
import ScreenHeader from '../../components/ScreenHeader';
import {strings} from '../../../Localization/translation';
import images from '../../Constants/ImagePath';
import fonts from '../../Constants/Fonts';
import colors from '../../Constants/Colors';
import OrderedSporList from '../../components/Home/OrderedSporList';
import Verbs from '../../Constants/Verbs';

export default function SportHideUnhideScreen({navigation}) {
  const [loading, setloading] = useState(false);
  const [updatedSportList, setUpdatedSportList] = useState([]);

  const authContext = useContext(AuthContext);

  const onSavePress = () => {
    const user = authContext.entity.obj;
    setloading(true);
    let registeredSports = [];
    let refereeSports = [];
    let scorekeeperSports = [];

    updatedSportList.forEach((item) => {
      if (item.type === Verbs.entityTypePlayer) {
        const list = user.registered_sports.map((ele) => {
          if (ele.sport === item.sport && ele.sport_type === item.sport_type) {
            return {...ele, ...item};
          }
          return ele;
        });
        registeredSports = list;
      }

      if (item.type === Verbs.entityTypeReferee) {
        const list = user.referee_data.map((ele) => {
          if (ele.sport === item.sport) {
            return {...ele, ...item};
          }
          return ele;
        });
        refereeSports = list;
      }

      if (item.type === Verbs.entityTypeScorekeeper) {
        const list = user.scorekeeper_data.map((ele) => {
          if (ele.sport === item.sport) {
            return {...ele, ...item};
          }
          return ele;
        });
        scorekeeperSports = list;
      }
    });

    const body = {
      ...authContext.entity.obj,
      registered_sports: registeredSports,
      referee_data: refereeSports,
      scorekeeper_data: scorekeeperSports,
    };

    patchPlayer(body, authContext)
      .then(async (res) => {
        setloading(false);
        await setAuthContextData(res.payload, authContext);
        navigation.goBack();
      })
      .catch((error) => {
        Alert.alert(error);
      })
      .finally(() => setloading(false));
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <ActivityLoader visible={loading} />
      <ScreenHeader
        title={strings.hideUnhide}
        leftIcon={images.backArrow}
        leftIconPress={() => navigation.goBack()}
        isRightIconText
        rightButtonText={strings.save}
        onRightButtonPress={onSavePress}
        containerStyle={styles.headerRow}
        loading={loading}
      />
      <View style={{paddingTop: 15, paddingHorizontal: 15}}>
        <Text style={styles.label}>{strings.hideUnhideDescription}</Text>
      </View>
      <OrderedSporList
        user={authContext.entity.obj}
        showToggleButton
        onToggle={(list) => {
          setUpdatedSportList(list);
        }}
      />
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  headerRow: {
    paddingLeft: 10,
    paddingTop: 6,
    paddingRight: 17,
    paddingBottom: 14,
  },
  label: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
  },
});
