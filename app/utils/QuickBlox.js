import QB from 'quickblox-react-native-sdk';
import _ from 'lodash';
import { QB_Auth_Password } from './constant';

const MESSAGE_LIMIT = 50;
const DIALOG_LIST_LIMIT = 200;
const MAX_FILE_SIZE = 104857600;
export const QB_UNREAD_MESSAGE_COUNT_API = 'https://api.quickblox.com/chat/Message/unread.json?token=';

const MESSAGES_SORT = {
  ascending: false,
  field: QB.chat.MESSAGES_SORT.FIELD.DATE_SENT,
}

export const QB_ACCOUNT_TYPE = {
  USER: 'U_',
  TEAM: 'T_',
  CLUB: 'C_',
  LEAGUE: 'L_',
}

export const QB_DIALOG_TYPE = {
  SINGLE: 'single',
  GROUP: 'group',
}
const appSettings = {
  // appId: '79537',
  // authKey: 'bMFuNaWXVNJGqzY',
  // authSecret: 'bpm8-gfaay9DWWv',
  // accountKey: 'idPrZuxa3UseWLaRFRQU',
  appId: '86953',
  authKey: '62JSShsNZqtNrfN',
  authSecret: 'KMJLjnxr3drT-AR',
  accountKey: '8LSpkznPxy1C9XSJcd91',
};

export const QBChatConnected = async () => QB.chat.isConnected()

export const QBChatDisconnect = () => QBChatConnected().then(() => QB.chat.disconnect()).catch((e) => e);
export const QBinit = () => {
  QB.settings
    .init(appSettings)
    .then(() => {})
    .catch(() => {
      // Some error occured, look at the exception message for more details
    });
  QB.settings.enableAutoReconnect({ enable: true });
}
export const QBlogin = (uniqueID, customData = {}, userAccountType = QB_ACCOUNT_TYPE.USER) => new Promise((resolve, reject) => {
  QB.auth
    .login({
      login: uniqueID,
      password: QB_Auth_Password,
    }).then((res) => {
      resolve(res)
    }).catch((error) => {
      if (error.message.toLowerCase().indexOf('unauthorized') > -1) {
        QBcreateUser(uniqueID, customData, userAccountType).then(() => {
          QBlogin(uniqueID).then((loginRes) => resolve(loginRes));
        }).catch((e) => {
          reject(e)
        })
      } else {
        reject(error)
      }
    })
})

export const QBLogout = async () => {
  await QBChatDisconnect();
  return QB.auth.logout()
}

export const QBcreateUser = (
  uniqueID,
  customData,
  userAccountType,
) => {
  const fullName = userAccountType + _.get(customData, ['full_name'], 'Full Name')
  const {
    country = '',
    city = '',
    entity_type = '',
    full_image = '',
    full_name = '',
    user_id = '',
    group_id = '',
    createdAt = '',
    createdBy = {},
    group_name = '',
  } = customData;
  const custData = {
    country, city, entity_type, full_image, full_name, user_id, createdAt, createdBy, group_id, group_name,
  }
  return QB.users.create({
    fullName,
    login: uniqueID.trim(),
    password: QB_Auth_Password,
    customData: JSON.stringify(custData),
  })
}

export const QBsetupSettings = async () => {
  await QB.settings.initStreamManagement({
    autoReconnect: true,
    messageTimeout: 10,
  });
  await QB.settings.enableCarbons();
  await QB.settings.enableAutoReconnect({ enable: true })
}

export const QBgetDialogs = async (request = {}) => {
  const connected = await QBChatConnected()
  if (connected) {
    try {
      const { append, ...params } = request || {}
      const response = await QB.chat.getDialogs({ limit: DIALOG_LIST_LIMIT, ...params });
      return { ...response, append };
    } catch (e) {
      return e;
    }
  }
  return 'error'
}

export const QBgetMessages = (dialogId, skipCount = 0) => QBChatConnected().then((connected) => {
  if (connected) {
    const query = {
      dialogId,
      limit: MESSAGE_LIMIT,
      sort: MESSAGES_SORT,
      skip: skipCount,
    }
    return QB.chat.getDialogMessages(query).then((response) => ({
      message: response.messages.reverse(),
    }))
  }
  throw new Error('server-not-connected')
})

export const QBsendMessage = (dialogId, body, file = null) => QBChatConnected().then((connected) => {
  if (connected) {
    const message = {
      dialogId,
      body,
      saveToHistory: true,
    }
    if (file) {
      message.attachments = [{
        id: file.uid,
        type: file.contentType.includes('image') ? 'image' : 'file',
      }];
    }
    return QB.chat.sendMessage(message)
  }
  throw new Error('server-not-connected')
})

export const QBcreateDialog = (occupantsIds = [], dialogType = QB_DIALOG_TYPE.SINGLE, groupName = 'Group') => {
  const type = dialogType === QB_DIALOG_TYPE.SINGLE ? QB.chat.DIALOG_TYPE.CHAT : QB.chat.DIALOG_TYPE.GROUP_CHAT
  return QBChatConnected().then((connected) => {
    if (connected) {
      const dialogParams = {
        occupantsIds,
      };
      if (dialogType === QB_DIALOG_TYPE.GROUP) {
        dialogParams.name = groupName
        dialogParams.type = type
      }
      return QB.chat.createDialog(dialogParams)
    }
    throw new Error('server-not-connected')
  })
}
export const QBupdateDialog = (
  dialogId,
  addUsers = [],
  removeUsers = [],
  name = '',
) => QBChatConnected().then((connected) => {
  if (connected) {
    const update = {
      dialogId,
      addUsers,
      removeUsers,
      name,
    };
    return QB.chat.updateDialog(update)
  }
  throw new Error('server-not-connected')
})

export const QBgetAllUsers = () => QBChatConnected().then((connected) => {
  if (connected) {
    const filter = {
      field: QB.users.USERS_FILTER.FIELD.LOGIN,
      operator: QB.users.USERS_FILTER.OPERATOR.IN,
      type: QB.users.USERS_FILTER.TYPE.NUMBER,
      value: '',
    };
    return QB.users.getUsers({ filter });
  }
  throw new Error('server-not-connected')
});

export const QBgetUserDetail = (field, fieldType, value) => QBChatConnected().then((connected) => {
  if (connected) {
    const filter = {
      field,
      operator: QB.users.USERS_FILTER.OPERATOR.IN,
      type: fieldType,
      value,
    };
    return QB.users.getUsers({ filter })
  }
  throw new Error('server-not-connected');
})

export const QBgetFileURL = (fileID) => QBChatConnected().then((connected) => {
  if (connected) {
    return QB.content.getPrivateURL({ uid: fileID });
  }
  throw new Error('server-not-connected');
})

export const QBleaveDialog = (dialogId) => QBChatConnected().then((connected) => {
  if (connected) {
    return QB.chat.leaveDialog({ dialogId });
  }
  throw new Error('server-not-connected')
})

export const QBuploadFile = (image) => QBChatConnected().then(async (connected) => {
  if (connected) {
    const imagePath = image?.sourceURL;
    const validImageSize = image?.size <= MAX_FILE_SIZE;
    if (!validImageSize) throw new Error('File size should be less than 100 MB');
    await QB.content.subscribeUploadProgress({ url: imagePath });
    await QB.content.upload({ url: imagePath, public: false }).then((file) => file).catch((e) => e);
  }
  throw new Error('server-not-connected');
})

export const QBconnectAndSubscribe = async (entity) => {
  const connected = await QBChatConnected();
  if (entity.QB) {
    const { id } = entity.QB
    if (!connected) {
      return QB.chat.connect({ userId: id, password: QB_Auth_Password })
        .then(async () => {
          console.log('QB connected successfully')
          return true;
        }).catch((error) => {
          console.log(error.message)
          return { error: error.message }
        })
    }
    console.log('QB already connected')
    return true
  }
  console.log('Something went wrong');
  return { error: 'Something Went wrong' }
}
