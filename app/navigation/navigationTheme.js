import { DefaultTheme } from '@react-navigation/native';

import constants from '../config/constants';

const { colors } = constants;

export default {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.themeColor,
    background: colors.whiteColor,
  },
};
