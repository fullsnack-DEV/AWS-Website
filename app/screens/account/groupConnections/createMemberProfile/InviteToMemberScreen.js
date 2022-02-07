import React, { useLayoutEffect, useState, useContext } from 'react';
import {
  View,
  StyleSheet,
  Image,
  Text,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { acceptRequest, declineRequest } from '../../../../api/Notificaitons';
import AuthContext from '../../../../auth/context';

import TCProfileView from '../../../../components/TCProfileView';
import TCSmallButton from '../../../../components/TCSmallButton';
import colors from '../../../../Constants/Colors';
import fonts from '../../../../Constants/Fonts';
import images from '../../../../Constants/ImagePath';
import strings from '../../../../Constants/String';
import { widthPercentageToDP } from '../../../../utils';
import ActivityLoader from '../../../../components/loader/ActivityLoader';

export default function InviteToMemberScreen({ navigation, route }) {
  const { data } = route?.params ?? {};
  const authContext = useContext(AuthContext);

  const [loading, setloading] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity onPress={() => navigation.popToTop()}>
          <Image source={images.backArrow} style={styles.backStyle} />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const onAccept = (requestId) => {
    setloading(true);
    acceptRequest(requestId, authContext)
      .then(() => {
        navigation.goBack();
        setloading(false);
      })
      .catch((error) => {
        setloading(false);
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, error.message);
        }, 10);
      });
  };

  const onDecline = (requestId) => {
    setloading(true);
    declineRequest(requestId, authContext)
      .then(() => {
        navigation.goBack();
        setloading(false);
      })
      .catch((error) => {
        setloading(false);
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, error.message);
        }, 10);
      });
  };

  return (
    <View style={styles.mainContainer}>
      <Image style={styles.background} source={images.orangeLayer} />
      <Image style={styles.background} source={images.bgImage} />
      <ActivityLoader visible={loading} />

      <View style={styles.mailContainer}>
        <View>
          <Text style={styles.mainTextStyle}>
            <Text style={{ fontFamily: fonts.RBlack }}>
              {data?.activities?.[0]?.actor?.data?.full_name}
            </Text>{' sent you a request to connect your account  to one of their exsiting member profiles. When you accept it, you will be a member in the team and the profile will be connected to your account.'}
          </Text>
        </View>

        <View>
          <TCProfileView
            image={
              authContext.entity.obj.thumbnail
                ? { uri: authContext.entity.obj.thumbnail }
                : images.profilePlaceHolder
            }
            style={styles.profileImage}
            name={`${authContext.entity.obj.full_name}`}
            location={`${authContext.entity.obj.city}, ${authContext.entity.obj.state_abbr}`}
            color={colors.whiteColor}
          />

          <Image source={images.chain} style={styles.fileButton}></Image>

          <TCProfileView
            image={images.profilePlaceHolder}
            style={styles.profileImage}
            name={`${JSON.parse(data.activities[0].object)?.connectInfo?.first_name} ${JSON.parse(data.activities[0].object)?.connectInfo?.last_name}`}
            location={data?.activities?.[0]?.actor?.data?.full_name}
            color={colors.whiteColor}
          />
        </View>

        <View>
          <Text style={styles.infoText}>
            {'If the name on the profile is different from the name on your account, it will be replaced with the name on your account.'}
          </Text>
          <View style={styles.bottomButtonContainer}>
            <TCSmallButton
              isBorderButton={true}
              borderstyle={{
                borderColor: colors.whiteColor,
                borderWidth: 1,
                borderRadious: 80,
              }}
              textStyle={{ color: colors.whiteColor }}
              title={strings.declineTitle}
              onPress={() => {
                onDecline(data.activities[0].id);
              }}
              style={{ width: widthPercentageToDP('42%') }}
            />
            <TCSmallButton
              title={strings.acceptTitle}
              textStyle={{ color: colors.themeColor }}
              onPress={() => {
               
                onAccept(data.activities[0].id);
              }}
              startGradientColor={colors.whiteColor}
              endGradientColor={colors.whiteColor}
              style={{ width: widthPercentageToDP('42%') }}
            />
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  background: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    resizeMode: 'stretch',
  },
  mailContainer: {
    alignSelf: 'center',
    justifyContent: 'space-between',
    flex: 1,
    alignItems: 'center',
    marginTop: 100,
    marginBottom: 50,
  },

  infoText: {
    fontSize: 16,
    fontFamily: fonts.RRegular,
    color: colors.whiteColor,
    marginLeft: 30,
    marginRight: 30,

    // textAlign: 'center',
    // lineHeight: 25,
  },
  mainTextStyle: {
    fontSize: 16,
    fontFamily: fonts.RMedium,
    color: colors.whiteColor,
    marginLeft: 30,
    marginRight: 30,

    // textAlign: 'center',
    // lineHeight: 25,
  },

  fileButton: {
    marginTop: 15,
    height: 14,
    width: 27,
    marginBottom: 15,
    alignSelf: 'center',
  },
  backStyle: {
    height: 20,
    width: 15,
    resizeMode: 'contain',
    marginLeft: 15,
    tintColor: colors.whiteColor,
  },
  bottomButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    margin: 15,
  },
});
