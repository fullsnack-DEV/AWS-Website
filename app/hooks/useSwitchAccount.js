import {Alert} from 'react-native';
import {useCallback, useContext, useState} from 'react';
import AuthContext from '../auth/context';
import Verbs from '../Constants/Verbs';
import {strings} from '../../Localization/translation';
import {setStorage} from '../utils';

const useSwitchAccount = () => {
  const [loading, setLoading] = useState(false);
  const authContext = useContext(AuthContext);

  const onSwitchProfile = useCallback(
    async (item) => {
      let currentEntity = authContext.entity;
      setLoading(true);
      if (
        item.entity_type === Verbs.entityTypePlayer ||
        item.entity_type === Verbs.entityTypeUser
      ) {
        currentEntity = {
          ...currentEntity,
          uid: item.user_id,
          role: Verbs.entityTypeUser,
          obj: {...item},
        };
      } else if (item.entity_type === Verbs.entityTypeTeam) {
        currentEntity = {
          ...currentEntity,
          uid: item.group_id,
          role: Verbs.entityTypeTeam,
          obj: {...item},
        };
      } else if (item.entity_type === Verbs.entityTypeClub) {
        currentEntity = {
          ...currentEntity,
          uid: item.group_id,
          role: Verbs.entityTypeClub,
          obj: {...item},
        };
      }

      try {
        authContext.setStreamChatToken('');
        if (authContext.chatClient?.userID) {
          await authContext.chatClient.disconnectUser();
        }
        authContext.setEntity({...currentEntity});
        await setStorage('authContextEntity', {...currentEntity});
        setLoading(false);
      } catch (error) {
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, error?.message);
        }, 10);
        setLoading(false);
      }
    },
    [authContext],
  );

  return {loading, onSwitchProfile};
};

export default useSwitchAccount;
