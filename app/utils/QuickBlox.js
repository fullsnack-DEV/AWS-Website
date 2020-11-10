import QB from 'quickblox-react-native-sdk';
import _ from 'lodash';
import { QB_Auth_Password } from './constant';

const MESSAGE_LIMIT = 50;

const MESSAGES_SORT = {
  ascending: false,
  field: QB.chat.MESSAGES_SORT.FIELD.DATE_SENT,
}

export const QB_ACCOUNT_TYPE = {
  PERSON: 'person',
  TEAM: 'team',
  CLUB: 'club',
  LEAGUE: 'league',
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

export const QBChatConnected = async () => {
  let isConnected = false;
  try {
    isConnected = await QB.chat.isConnected()
  } catch (e) {
    isConnected = false
  }
  return isConnected;
}

export const QBChatDisconnect = () => {
  QB.chat.disconnect().then(() => true).catch((e) => e);
}
export const QBinit = () => {
  QB.settings
    .init(appSettings)
    .then(() => {})
    .catch(() => {
      // Some error occured, look at the exception message for more details
    });
  QB.settings.enableAutoReconnect({ enable: true });
}
export const QBlogin = (uniqueID, customData = {}) => new Promise((resolve, reject) => {
  QB.auth
    .login({
      login: uniqueID,
      password: QB_Auth_Password,
    }).then((res) => {
      resolve(res.user)
    }).catch((error) => {
      if (error.message.toLowerCase().indexOf('unauthorized') > -1) {
        QBcreateUser(uniqueID, customData).then((res) => resolve(res)).catch((e) => reject(e));
      } else {
        reject(error)
      }
    })
})

export const QBLogout = () => {
  QBChatDisconnect();
  QB.auth.logout().then((res) => res).catch((e) => e)
}
export const QBcreateUser = (
  uniqueID,
  customData,
) => new Promise((resolve, reject) => {
  const fullName = _.get(customData, ['full_name'], 'Full Name')
  QB.users.create({
    fullName,
    login: uniqueID.trim(),
    password: QB_Auth_Password,
    customData: JSON.stringify(customData),
  }).then((res) => {
    resolve(res);
  }).catch((error) => {
    reject(error)
  })
})

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
      const response = await QB.chat.getDialogs(params);
      return { ...response, append };
    } catch (e) {
      return e;
    }
  }
  return 'error'
}

export const QBgetMessages = (dialogId) => new Promise((resolve, reject) => {
  QBChatConnected().then(() => {
    const query = {
      dialogId,
      limit: MESSAGE_LIMIT,
      sort: MESSAGES_SORT,
    }
    return QB.chat.getDialogMessages(query)
      .then((response) => {
        resolve({ message: response.messages.reverse() })
      })
      .catch((e) => reject(e));
  }).catch((e) => {
    reject(e)
  })
})

export const QBsendMessage = (dialogId, body) => new Promise((resolve, reject) => {
  QBChatConnected().then(() => {
    if (body && body !== '') {
      const message = {
        dialogId,
        body,
        saveToHistory: true,
      };
      QB.chat
        .sendMessage(message)
        .then(() => {
          resolve(true)
        })
        .catch((error) => {
          reject(error)
        })
    }
  })
})

export const QBcreateDialog = (occupantsIds = [], dialogType = QB_DIALOG_TYPE.SINGLE, groupName = 'Group') => {
  const type = dialogType === QB_DIALOG_TYPE.SINGLE ? QB.chat.DIALOG_TYPE.CHAT : QB.chat.DIALOG_TYPE.GROUP_CHAT
  return new Promise((resolve, reject) => {
    QBChatConnected()
      .then(() => {
        const dialogParams = {
          occupantsIds,
        };
        if (dialogType === QB_DIALOG_TYPE.GROUP) {
          dialogParams.name = groupName
          dialogParams.type = type
        }

        QB.chat
          .createDialog(dialogParams)
          .then((dialog) => {
            resolve(dialog);
          })
          .catch((e) => {
            reject(e);
          });
      })
  })
}

export const updateDialog = (
  dialogId,
  addUsers = [],
  removeUsers = [],
  name = '',
) => new Promise((resolve, reject) => {
  const update = {
    dialogId,
    addUsers,
    removeUsers,
    name,
  };

  QB.chat
    .updateDialog(update)
    .then((updatedDialog) => {
      resolve(updatedDialog);
    })
    .catch((e) => {
      reject(e)
    });
})

export const QBgetAllUsers = () => new Promise((resolve, reject) => {
  QBChatConnected().then(() => {
    const filter = {
      field: QB.users.USERS_FILTER.FIELD.LOGIN,
      operator: QB.users.USERS_FILTER.OPERATOR.IN,
      type: QB.users.USERS_FILTER.TYPE.NUMBER,
      value: '',
    };
    QB.users
      .getUsers({ filter })
      .then((result) => {
        resolve(result);
      })
      .catch((e) => {
        reject(e);
      });
  });
})

export const QBgetUserDetail = (field, fieldType, value) => new Promise((resolve, reject) => {
  QBChatConnected().then(() => {
    const filter = {
      field,
      operator: QB.users.USERS_FILTER.OPERATOR.IN,
      type: fieldType,
      value,
    };
    QB.users
      .getUsers({ filter })
      .then((result) => {
        resolve(result);
      })
      .catch((e) => {
        reject(e)
      });
  });
})

export const QBgetFileURL = (fileID) => new Promise((resolve, reject) => {
  QB.content
    .getPrivateURL({ uid: fileID })
    .then((url) => {
      resolve(url)
    })
    .catch((e) => {
      reject(e)
    })
})

export const QBleaveDialog = (dialogId) => new Promise((resolve, reject) => {
  QB.chat
    .leaveDialog({ dialogId })
    .then((res) => {
      resolve(res)
    })
    .catch((e) => {
      reject(e)
    })
})
