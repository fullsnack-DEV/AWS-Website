/* eslint-disable no-shadow  */

import {Alert} from 'react-native';
import {useEffect, useContext, useState} from 'react';
import AuthContext from '../auth/context';
import Verbs from '../Constants/Verbs';
import {strings} from '../../Localization/translation';
import * as Utility from '../utils';
import {
  QB_ACCOUNT_TYPE,
  QBLogout,
  QBlogin,
  QBconnectAndSubscribe,
} from '../utils/QuickBlox';

const useSwitchAccount = (item, deps) => {
  const [onloading, setloading] = useState(false);
  const authContext = useContext(AuthContext);

  useEffect(() => {
    if (deps) {
      onSwitchProfile(item);
    }
  }, [deps]);

  const onSwitchProfile = async (item) => {
    switchProfile(item)
      .then((currentEntity) => {
        switchQBAccount(item, currentEntity);
      })
      .catch((e) => {
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, e.message);
        }, 10);
      });
  };

  const switchQBAccount = async (accountData, entity) => {
    let currentEntity = entity;
    const entity_type = accountData?.entity_type;
    const uid = entity_type === Verbs.entityTypePlayer ? 'user_id' : 'group_id';
    QBLogout()
      .then(() => {
        const {USER, CLUB, TEAM} = QB_ACCOUNT_TYPE;
        let accountType = USER;
        if (entity_type === Verbs.entityTypeClub) accountType = CLUB;
        else if (entity_type === Verbs.entityTypeTeam) accountType = TEAM;

        QBlogin(
          accountData[uid],
          {
            ...accountData,
            full_name: accountData.group_name,
          },
          accountType,
        )
          .then(async (res) => {
            currentEntity = {
              ...currentEntity,
              QB: {...res.user, connected: true, token: res?.session?.token},
            };
            authContext.setEntity({...currentEntity});
            await Utility.setStorage('authContextEntity', {...currentEntity});
            QBconnectAndSubscribe(currentEntity)
              .then((qbRes) => {
                if (qbRes?.error) {
                  console.log(strings.appName, qbRes?.error);
                }
              })
              .catch(() => {
                setloading(false);
              });
          })
          .catch(() => {
            setloading(false);
          });
      })
      .catch(() => {
        setloading(false);
      });
  };

  const switchProfile = async (item) => {
    let currentEntity = authContext.entity;

    if (item.entity_type === Verbs.entityTypePlayer) {
      currentEntity = {
        ...currentEntity,
        uid: item.user_id,
        role: Verbs.entityTypeUser,
        obj: item,
      };
    } else if (item.entity_type === Verbs.entityTypeTeam) {
      currentEntity = {
        ...currentEntity,
        uid: item.group_id,
        role: Verbs.entityTypeTeam,
        obj: item,
      };
    } else if (item.entity_type === Verbs.entityTypeClub) {
      currentEntity = {
        ...currentEntity,
        uid: item.group_id,
        role: Verbs.entityTypeClub,
        obj: item,
      };
    }
    authContext.setEntity({...currentEntity});
    await Utility.setStorage('authContextEntity', {...currentEntity});

    return currentEntity;
  };

  return {onloading};
};

export default useSwitchAccount;
