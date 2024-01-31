import AsyncStorage from '@react-native-async-storage/async-storage';
import {useCallback, useContext} from 'react';
import {
  useChannelContext,
  useMessageInputContext,
} from 'stream-chat-react-native';
import AuthContext from '../auth/context';

const STORAGE_KEY = '@chat/drafts';

const getDrafts = async () => {
  const data = await AsyncStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : {};
};

const updateDraft = async (key, inputObj, entityId) => {
  const drafts = await getDrafts();
  const draftsObj = {...(drafts[entityId] ?? {})};

  if (!inputObj.value) {
    delete draftsObj[key];
  } else {
    draftsObj[key] = inputObj;
    drafts[entityId] = {...draftsObj};
  }

  AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(drafts));
};

const useDraftAPI = () => {
  const authContext = useContext(AuthContext);
  const {channel} = useChannelContext();
  const {setText, setQuotedMessageState} = useMessageInputContext();

  const handleInputChange = useCallback(
    (value, quotedMessage) => {
      const obj = {
        value,
        quotedMessage,
      };
      setText(value);
      updateDraft(channel.id, obj, authContext.entity.uid);
    },
    [channel.id],
  );

  const getInputDraft = useCallback(async () => {
    const drafts = await getDrafts();
    const draftsObj = {...(drafts[authContext.entity.uid] ?? {})};
    const result = draftsObj[channel.id] ?? '';
    if (result.quotedMessage) {
      setQuotedMessageState(result.quotedMessage);
    }
    setText(result.value);
    return result;
  }, [authContext.entity.uid, channel.id]);

  const removeInputDraft = useCallback(async () => {
    const drafts = await getDrafts();
    const draftsObj = {...(drafts[authContext.entity.uid] ?? {})};

    if (draftsObj[channel.id]) {
      delete draftsObj[channel.id];

      if (Object.keys(draftsObj).length === 0) {
        delete drafts[authContext.entity.uid];
      } else {
        drafts[authContext.entity.uid] = {...draftsObj};
      }
    }
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(drafts));
  }, [authContext.entity.uid, channel.id]);

  return {
    getInputDraft,
    handleInputChange,
    removeInputDraft,
  };
};

export default useDraftAPI;
