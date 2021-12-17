/* eslint-disable consistent-return */
/* eslint-disable import/no-cycle */
import Config from 'react-native-config';
import _ from 'lodash';
import axios from 'axios';
import QB from 'quickblox-react-native-sdk';
import images from '../Constants/ImagePath';
import qbApiCall from './qbApiCall';
import * as Utility from './index';

// const QBSetting = {
//   accountKey: 'S3jzJdhgvNjrHTT8VRMi',
//   appId: '92185',
//   authKey: 'NGpyPS265yy4QBS',
//   authSecret: 'bdxqa7sDzbODJew',
// };
// QB.settings
//   .init(QBSetting)
//   .then(() => {})
//   .catch(() => {
//     // Some error occured, look at the exception message for more details
//   });

console.log('constant::=>');

let QUICKBLOX_BASE_URL;
let QB_Auth_Password;

let MESSAGE_LIMIT;
let DIALOG_LIST_LIMIT;
let USERS_LIST_LIMIT;

export const getQBSetting = async () => {
   axios({
      method: 'get',
      url: `${Config.BASE_URL}/app/settings`,
      withCredentials: true,
      headers: {
        Accept: 'application/json',
        setting_token: '3c5a5976-4831-41b3-a0cb-1aeb9d2e2c1c',
      },
    }).then(async (response) => {
      if (!response.data.status) {
        console.log('ERROR RESPONSE ::', response.data);
        throw response.data.messages || response;
      } else {
        console.log('setting response:=>', response.data.payload.app.quickblox);
        QUICKBLOX_BASE_URL = response.data.payload.app.quickblox.QUICKBLOX_BASE_URL;
        QB_Auth_Password = response.data.payload.app.quickblox.QB_Auth_Password;
        MESSAGE_LIMIT = response.data.payload.app.quickblox.MESSAGE_LIMIT;
        DIALOG_LIST_LIMIT = response.data.payload.app.quickblox.DIALOG_LIST_LIMIT;
        USERS_LIST_LIMIT = response.data.payload.app.quickblox.USERS_LIST_LIMIT;
        await Utility.setStorage('appSetting', response.data.payload.app);

        return response.data.payload.app;
      }
    });
}

// export const getQBSetting = () => Utility.getStorage('appSetting').then(async (setting) => {
//     console.log('Setting utility:=>', setting);

//     if (setting !== null && setting.quickblox !== null) {
//       console.log('setting is not null');

//       QUICKBLOX_BASE_URL = setting.quickblox.QUICKBLOX_BASE_URL;
//       QB_Auth_Password = setting.quickblox.QB_Auth_Password;
//       MESSAGE_LIMIT = setting.quickblox.MESSAGE_LIMIT;
//       DIALOG_LIST_LIMIT = setting.quickblox.DIALOG_LIST_LIMIT;
//       USERS_LIST_LIMIT = setting.quickblox.USERS_LIST_LIMIT;
//       return setting;
//     }
//     if (setting === null) {
//       console.log('setting is  null');

//       return {
//         base_url_sporticon:
//           'https://dev-townscup-gallery.s3.amazonaws.com/sporticon/',
//         setting_id: '1d5db8a3-0334-4e4d-bdc5-70172438f221',

//         publishableKey: 'pk_test_ArfgYsDvhFEnPImjf2QHH5YH00ozgvzrTO',

//         quickblox: {
//           authKey: 'NGpyPS265yy4QBS',
//           DIALOG_LIST_LIMIT: 1000,
//           authSecret: 'bdxqa7sDzbODJew',
//           USERS_LIST_LIMIT: 1000,
//           appId: '92185',
//           QUICKBLOX_BASE_URL: 'https://api.quickblox.com',
//           MESSAGE_LIMIT: 50,
//           accountKey: 'S3jzJdhgvNjrHTT8VRMi',
//           QB_Auth_Password: 'qbPassword',
//         },
//         elastic: {
//           host: 'https://townscup.es.us-east-1.aws.found.io:9243',
//           APIVersion: '7.x',
//           username: 'elastic',
//           password: 'tqRPhYFnjqGuh99bLp4F6jZZ',
//         },
//         firebaseConfig: {
//           apiKey: 'AIzaSyDgnt9jN8EbVwRPMClVf3Ac1tYQKtaLdrU',
//           authDomain: 'townscup-fee6e.firebaseapp.com',
//           databaseURL: 'https://townscup-fee6e.firebaseio.com',
//           projectId: 'townscup-fee6e',
//           storageBucket: 'townscup-fee6e.appspot.com',
//           messagingSenderId: '1003329053001',
//           appId: '1:1003329053001:web:f079b7ed53716fa8463a98',
//           measurementId: 'G-N44NC0Z1Q7',
//         },
//       };

//       // axios({
//       //   method: 'get',
//       //   url: `${Config.BASE_URL}/app/settings`,
//       //   withCredentials: true,
//       //   headers: {
//       //     Accept: 'application/json',
//       //     setting_token: '3c5a5976-4831-41b3-a0cb-1aeb9d2e2c1c',
//       //   },
//       // }).then(async (response) => {
//       //   if (!response.data.status) {
//       //     console.log('ERROR RESPONSE ::', response.data);
//       //     throw response.data.messages || response;
//       //   } else {
//       //     console.log('setting response:=>', response.data.payload.app.quickblox);
//       //     QUICKBLOX_BASE_URL = response.data.payload.app.quickblox.QUICKBLOX_BASE_URL;
//       //     QB_Auth_Password = response.data.payload.app.quickblox.QB_Auth_Password;
//       //     MESSAGE_LIMIT = response.data.payload.app.quickblox.MESSAGE_LIMIT;
//       //     DIALOG_LIST_LIMIT = response.data.payload.app.quickblox.DIALOG_LIST_LIMIT;
//       //     USERS_LIST_LIMIT = response.data.payload.app.quickblox.USERS_LIST_LIMIT;
//       //     await Utility.setStorage('appSetting', response.data.payload.app);

//       //     return response.data.payload.app;
//       //   }
//       // });
//     }
//   });

export const QB_MAX_ASSET_SIZE_UPLOAD = 104857600;

export const QB_UNREAD_MESSAGE_COUNT_API = `${QUICKBLOX_BASE_URL}/chat/Message/unread.json?token=`;
const MESSAGES_SORT = {
  ascending: false,
  field: QB.chat.MESSAGES_SORT.FIELD.DATE_SENT,
};

export const QB_ACCOUNT_TYPE = {
  USER: 'U_',
  TEAM: 'T_',
  CLUB: 'C_',
  LEAGUE: 'L_',
};

export const getQBAccountType = (entity_type) => {
  let accountType = QB_ACCOUNT_TYPE.USER;
  if (entity_type === 'team') accountType = QB_ACCOUNT_TYPE.TEAM;
  if (entity_type === 'club') accountType = QB_ACCOUNT_TYPE.CLUB;
  if (entity_type === 'league') accountType = QB_ACCOUNT_TYPE.LEAGUE;
  return accountType;
};
export const QB_DIALOG_TYPE = {
  SINGLE: 'single',
  GROUP: 'group',
};

export const QBChatConnected = async () => QB.chat.isConnected();

export const getQBProfilePic = (dialogType, entityType, originalImage) => {
  if (!originalImage) {
    if (dialogType === QB.chat.DIALOG_TYPE.CHAT) {
      if (
        [
          QB_ACCOUNT_TYPE.LEAGUE,
          QB_ACCOUNT_TYPE.TEAM,
          QB_ACCOUNT_TYPE.CLUB,
        ].includes(entityType)
      ) {
        if (entityType === QB_ACCOUNT_TYPE.TEAM) return images.teamPlaceholder;
        if (entityType === QB_ACCOUNT_TYPE.CLUB) return images.clubPlaceholder;
        if (entityType === QB_ACCOUNT_TYPE.LEAGUE) {
          return images.leaguePlaceholder;
        }
      }
      return images.profilePlaceHolder;
    }
  } else {
    return { uri: originalImage };
  }
  return images.groupUsers;
};

export const QBChatDisconnect = () => QBChatConnected()
    .then(() => QB.chat.disconnect())
    .catch((e) => e);

export const QBlogin = (
  uniqueID,
  customData = {},
  userAccountType = QB_ACCOUNT_TYPE.USER,
) => new Promise((resolve, reject) => {
    QB.auth
      .login({
        login: uniqueID,
        password: QB_Auth_Password,
      })
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        if (error.message.toLowerCase().indexOf('unauthorized') > -1) {
          QBcreateUser(uniqueID, customData, userAccountType)
            .then(() => {
              QBlogin(uniqueID).then((loginRes) => resolve(loginRes));
            })
            .catch((e) => {
              reject(e);
            });
        } else {
          reject(error);
        }
      });
  });

export const QBLogout = async () => {
  await QBChatDisconnect();
  return QB.auth.logout();
};

export const QBcreateUser = (uniqueID, customData, userAccountType) => {
  const nameType = customData?.entity_type === 'player' ? 'full_name' : 'group_name';
  const fullName = userAccountType + _.get(customData, [nameType], 'Full Name');
  const pureName = _.get(customData, [nameType], 'Full Name');
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
    country,
    city,
    entity_type,
    full_image,
    full_name,
    user_id,
    createdAt,
    createdBy,
    group_id,
    group_name,
  };
  custData.full_name = pureName;
  return QB.users.create({
    fullName,
    login: uniqueID.trim(),
    password: QB_Auth_Password,
    customData: JSON.stringify(custData),
  });
};

const getQBObject = async (authContext) => authContext?.entity?.QB;

export const QBupdateUser = async (
  uniqueID,
  customData,
  userAccountType,
  authContext,
) => {
  const nameType = customData?.entity_type === 'player' ? 'full_name' : 'group_name';
  const fullName = userAccountType + _.get(customData, [nameType], 'Full Name');
  const pureName = _.get(customData, [nameType], 'Full Name');
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
    country,
    city,
    entity_type,
    full_image,
    full_name,
    user_id,
    createdAt,
    createdBy,
    group_id,
    group_name,
  };
  custData.full_name = pureName;
  const qbObj = await getQBObject(authContext);
  const url = `${QUICKBLOX_BASE_URL}/users/${qbObj?.id}.json`;
  const userObj = {
    user: {
      full_name: fullName,
      custom_data: JSON.stringify(custData),
    },
  };
  if (qbObj?.token) {
    return fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'QB-Token': qbObj?.token,
      },
      body: JSON.stringify(userObj),
    }).then((response) => response.json());
  }
  return false;
};

export const QBsetupSettings = async () => {
  await QB.settings.initStreamManagement({
    autoReconnect: true,
    messageTimeout: 10,
  });
  await QB.settings.enableCarbons();
  await QB.settings.enableAutoReconnect({ enable: true });
};

export const QBgetDialogs = async (request = {}) => {
  const connected = await QBChatConnected();
  if (connected) {
    try {
      const { append, ...params } = request || {};
      const response = await QB.chat.getDialogs({
        limit: DIALOG_LIST_LIMIT,
        ...params,
      });
      return { ...response, append };
    } catch (e) {
      return e;
    }
  }
  return 'error';
};

export const QBgetMessages = (dialogId, skipCount = 0) => {
  QBChatConnected().then((connected) => {
    if (connected) {
      const query = {
        dialogId,
        limit: MESSAGE_LIMIT,
        sort: MESSAGES_SORT,
        skip: skipCount,
      };
      return QB.chat.getDialogMessages(query).then((response) => ({
        message: response.messages.reverse(),
      }));
    }
    throw new Error('server-not-connected');
  });
};

export const QBsendMessage = (dialogId, body, file = null) => QBChatConnected().then((connected) => {
    if (connected) {
      const message = {
        dialogId,
        body,
        saveToHistory: true,
      };
      if (file) {
        message.attachments = [
          {
            id: file.uid,
            type: file.contentType.includes('image') ? 'image' : 'file',
          },
        ];
      }
      return QB.chat.sendMessage(message);
    }
    throw new Error('server-not-connected');
  });

export const QBcreateDialog = (
  occupantsIds = [],
  dialogType = QB_DIALOG_TYPE.SINGLE,
  groupName = 'Group',
) => {
  const type = dialogType === QB_DIALOG_TYPE.SINGLE
      ? QB.chat.DIALOG_TYPE.CHAT
      : QB.chat.DIALOG_TYPE.GROUP_CHAT;
  return QBChatConnected().then((connected) => {
    if (connected) {
      const dialogParams = {
        occupantsIds,
      };
      if (dialogType === QB_DIALOG_TYPE.GROUP) {
        dialogParams.name = groupName;
        dialogParams.type = type;
      }
      return QB.chat.createDialog(dialogParams);
    }
    throw new Error('server-not-connected');
  });
};
export const QBupdateDialogNameAndPhoto = (
  dialogId,
  name = '',
  photo = '',
  authContext,
) => QBChatConnected().then(async (connected) => {
    if (connected) {
      const update = { dialogId };
      if (name) update.name = name;
      if (photo) update.photo = photo;
      if (!photo) {
        return QB.chat.updateDialog(update);
      }
      const qbObj = await getQBObject(authContext);
      const url = `${QUICKBLOX_BASE_URL}/chat/Dialog/${dialogId}.json`;
      return qbApiCall({
        url,
        method: 'PUT',
        qbToken: qbObj?.token,
        data: update,
      })
        .then((res) => ({
          // eslint-disable-next-line no-underscore-dangle
          dialogId: res?._id,
          name: res?.name,
          occupantsIds: res?.occupants_ids,
          dialogType: res?.type,
        }))
        .catch((error) => ({ status: 'error', error }));
    }
    throw new Error('server-not-connected');
  });

export const QBupdateDialogInvitees = async (
  dialogId,
  addUsers = [],
  removeUsers = [],
) => QBChatConnected().then((connected) => {
    if (connected) {
      const update = {
        dialogId,
        addUsers,
        removeUsers,
      };
      return QB.chat.updateDialog(update);
    }
    throw new Error('server-not-connected');
  });

export const QBupdateDialogInvitees2 = async (
  dialogId,
  addUsers = [],
  removeUsers = [],
  authContext,
) => {
  const qbObj = await getQBObject(authContext);
  return QBChatConnected().then((connected) => {
    if (connected) {
      const update = {};
      update.photo = 'https://picsum.photos/id/320/640/1136';
      if (addUsers?.length > 0) update.push_all = { occupants_ids: addUsers };
      if (removeUsers?.length > 0) {
        update.pull_all = { occupants_ids: removeUsers };
      }
      const url = `${QUICKBLOX_BASE_URL}/chat/Dialog/${dialogId}.json`;
      return fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'QB-Token': qbObj?.token,
        },
        body: JSON.stringify(update),
      })
        .then((response) => response.json())
        .catch((error) => error);
    }
    throw new Error('server-not-connected');
  });
};

export const QBgetAllUsers = () => QBChatConnected().then((connected) => {
    if (connected) {
      const filter = {
        field: QB.users.USERS_FILTER.FIELD.LOGIN,
        operator: QB.users.USERS_FILTER.OPERATOR.IN,
        type: QB.users.USERS_FILTER.TYPE.NUMBER,
        value: '',
      };
      return QB.users.getUsers({
        append: true,
        perPage: USERS_LIST_LIMIT,
        filter,
      });
    }
    throw new Error('server-not-connected');
  });

export const QBgetUserDetail = (field, fieldType, value) => QBChatConnected().then((connected) => {
  console.log('connected:',connected);  
  if (connected) {
      Utility.getStorage('appSetting').then(async (setting) => {
        console.log('SETTTTTTING:',setting);
        const filter = {
          field,
          type: fieldType,
          operator: QB.users.USERS_FILTER.OPERATOR.IN,
          value,
        };
        return QB.users.getUsers({
          append: true,
          perPage: setting.quickblox.USERS_LIST_LIMIT,
          filter,
        });
      });
    }
    throw new Error('server-not-connected');
  });

export const QBgetFileURL = (fileID) => QBChatConnected().then((connected) => {
    if (connected) {
      return QB.content.getPrivateURL({ uid: fileID.toString() });
    }
    throw new Error('server-not-connected');
  });

export const QBleaveDialog = (dialogId) => QBChatConnected().then((connected) => {
    if (connected) {
      return QB.chat.leaveDialog({ dialogId });
    }
    throw new Error('server-not-connected');
  });

export const QBconnectAndSubscribe = async (entity) => {
  const connected = await QBChatConnected();
  if (entity?.QB) {
    const { id } = entity.QB;
    if (!connected) {
      return QB.chat
        .connect({ userId: id, password: QB_Auth_Password })
        .then(async () => {
          console.log('QB connected successfully');
          return true;
        })
        .catch((error) => {
          console.log(error.message);
          return { error: error.message };
        });
    }
    console.log('QB already connected');
    return true;
  }
  console.log('Something went wrong');
  return { error: 'Something Went wrong' };
};
