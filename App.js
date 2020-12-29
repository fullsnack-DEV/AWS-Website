import React, {
  useState, useEffect, useMemo,
} from 'react';
import firebase from '@react-native-firebase/app';
import AuthContext from './app/auth/context';
import { QBinit } from './app/utils/QuickBlox';
import NavigationMainContainer from './NavigationMainContainer';
import { firebaseConfig } from './app/utils/constant';

export default function App() {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState('user');
  const [entity, setEntity] = useState(null);
  const updateAuth = (e) => {
    setEntity({ ...e })
  }
  const authValue = useMemo(
    () => ({
      role,
      setRole,
      user,
      setUser,
      entity,
      setEntity,
      updateAuth,
    }),
    [role, user, entity],
  );

  useEffect(() => {
    if (firebase.apps.length === 0) {
      firebase.initializeApp(firebaseConfig);
    }
  }, []);

  QBinit();
  return (
    <AuthContext.Provider value={authValue}>
      <NavigationMainContainer/>
    </AuthContext.Provider>
  );
}
