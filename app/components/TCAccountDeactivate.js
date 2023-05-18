import React, {memo, useContext, useState} from 'react';
import {Alert, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {format} from 'react-string-format';
import colors from '../Constants/Colors';
import fonts from '../Constants/Fonts';
import AuthContext from '../auth/context';
import {strings} from '../../Localization/translation';
import Verbs from '../Constants/Verbs';
import {userActivate} from '../api/Users';
import {setAuthContextData} from '../utils';
import {groupUnpaused} from '../api/Groups';
import ActivityLoader from './loader/ActivityLoader';
import {getUnreadNotificationCount} from '../utils/accountUtils';

const TCAccountDeactivate = () => {
  const authContext = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  const getLabel = () => {
    if (authContext.entity.obj?.under_terminate === true) {
      return strings.YourAccountIsUnderTermination;
    }

    if (authContext.entity.obj?.is_pause === true) {
      return format(
        strings.accountPaused,
        authContext.entity.role === Verbs.entityTypeClub
          ? Verbs.entityTypeClub
          : Verbs.entityTypeTeam,
      );
    }

    return strings.YourAccountHasBeenDeactivated;
  };

  const getButtonLabel = () => {
    if (authContext.entity.obj?.under_terminate === true) {
      return strings.reactivate;
    }
    if (authContext.entity.obj?.is_pause === true) {
      return strings.unpause;
    }

    return strings.reactivate;
  };

  const reActivateUser = () => {
    setLoading(true);
    userActivate(authContext)
      .then(async (response) => {
        getUnreadNotificationCount(authContext);
        await setAuthContextData(response.payload, authContext);
        setLoading(false);
      })
      .catch((e) => {
        setLoading(false);
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, e.message);
        }, 10);
      });
  };

  const unPauseGroup = () => {
    setLoading(true);
    groupUnpaused(authContext)
      .then(async (response) => {
        getUnreadNotificationCount(authContext);
        await setAuthContextData(response.payload, authContext);
        setLoading(false);
      })
      .catch((e) => {
        setLoading(false);
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, e.message);
        }, 10);
      });
  };

  const handleAccountActivation = () => {
    Alert.alert(
      format(strings.pauseUnpauseAccountText, getButtonLabel().toLowerCase()),
      '',
      [
        {
          text: strings.cancel,
          style: 'cancel',
        },
        {
          text: getButtonLabel(),
          style: 'destructive',
          onPress: () => {
            if (authContext.entity.obj?.is_pause === true) {
              unPauseGroup();
            } else {
              reActivateUser();
            }
          },
        },
      ],
      {cancelable: false},
    );
  };

  return (
    <View style={styles.deactivateContainer}>
      <ActivityLoader visible={loading} />
      <Text style={styles.deactivateText}>{getLabel()}</Text>
      <TouchableOpacity
        style={styles.reactivateButtonView}
        onPress={handleAccountActivation}>
        <Text style={styles.reactivateTitle}>
          {getButtonLabel().toUpperCase()}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  reactivateTitle: {
    fontFamily: fonts.RBold,
    fontSize: 12,
    color: colors.googleColor,
  },
  reactivateButtonView: {
    backgroundColor: colors.whiteColor,
    padding: 4,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
  },
  deactivateText: {
    fontFamily: fonts.RMedium,
    fontSize: 14,
    color: colors.googleColor,
  },
  deactivateContainer: {
    backgroundColor: colors.writePostSepratorColor,
    height: 35,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
  },
});

export default memo(TCAccountDeactivate);
