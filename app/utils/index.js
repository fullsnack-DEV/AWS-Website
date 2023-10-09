/* eslint-disable prefer-regex-literals */
/* eslint-disable default-param-last */
/* eslint-disable no-undef */
/* eslint-disable no-bitwise */
/* eslint-disable space-before-blocks */
/* eslint-disable no-else-return */
/* eslint-disable consistent-return */
/* eslint-disable array-callback-return */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-param-reassign */
import {
  Platform,
  Alert,
  Dimensions,
  PixelRatio,
  LayoutAnimation,
} from 'react-native';
import firebase from '@react-native-firebase/app';
import _ from 'lodash';
import moment from 'moment';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {format} from 'react-string-format';
import {strings} from '../../Localization/translation';
import images from '../Constants/ImagePath';
import colors from '../Constants/Colors';
// eslint-disable-next-line import/no-cycle
import {
  getCalendarIndex,
  getGroupIndex,
  getUserIndex,
} from '../api/elasticSearch';
import Verbs from '../Constants/Verbs';
// eslint-disable-next-line import/no-cycle
import {removeFBToken} from '../api/Users';

export const deviceHeight = Dimensions.get('window').height;
export const deviceWidth = Dimensions.get('window').width;

export const getPageLimit = () => 10;

export const monthNames = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'June',
  'July',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

export const groupMemberGenderItems = [
  {label: 'Male', value: 'male'},
  {label: 'Female', value: 'female'},
  {label: 'All', value: 'all'},
];

export const languageList = [
  {language: 'English', id: 1},
  // { language: 'English(Canada)', id: 2 },
  // { language: 'English(Singapore)', id: 3 },
  // { language: 'English(UK)', id: 4 },
  // { language: 'English(US)', id: 5 },
  {language: 'Deutsch', id: 2},
  {language: 'Italiano', id: 3},
  {language: 'Korean', id: 4},
];

export const groupMembershipFeeTypes = [
  {label: 'Weekly', value: 'week'},
  {label: 'Biweekly', value: 'biweek'},
  {label: 'Monthly', value: 'month'},
  {label: 'Yearly', value: 'year'},
];

export const countryCode = [
  {
    name: 'Afghanistan',
    dial_code: '+93',
    code: 'AF',
  },
  {
    name: 'Aland Islands',
    dial_code: '+358',
    code: 'AX',
  },
  {
    name: 'Albania',
    dial_code: '+355',
    code: 'AL',
  },
  {
    name: 'Algeria',
    dial_code: '+213',
    code: 'DZ',
  },
  {
    name: 'AmericanSamoa',
    dial_code: '+1684',
    code: 'AS',
  },
  {
    name: 'Andorra',
    dial_code: '+376',
    code: 'AD',
  },
  {
    name: 'Angola',
    dial_code: '+244',
    code: 'AO',
  },
  {
    name: 'Anguilla',
    dial_code: '+1264',
    code: 'AI',
  },
  {
    name: 'Antarctica',
    dial_code: '+672',
    code: 'AQ',
  },
  {
    name: 'Antigua and Barbuda',
    dial_code: '+1268',
    code: 'AG',
  },
  {
    name: 'Argentina',
    dial_code: '+54',
    code: 'AR',
  },
  {
    name: 'Armenia',
    dial_code: '+374',
    code: 'AM',
  },
  {
    name: 'Aruba',
    dial_code: '+297',
    code: 'AW',
  },
  {
    name: 'Australia',
    dial_code: '+61',
    code: 'AU',
  },
  {
    name: 'Austria',
    dial_code: '+43',
    code: 'AT',
  },
  {
    name: 'Azerbaijan',
    dial_code: '+994',
    code: 'AZ',
  },
  {
    name: 'Bahamas',
    dial_code: '+1242',
    code: 'BS',
  },
  {
    name: 'Bahrain',
    dial_code: '+973',
    code: 'BH',
  },
  {
    name: 'Bangladesh',
    dial_code: '+880',
    code: 'BD',
  },
  {
    name: 'Barbados',
    dial_code: '+1246',
    code: 'BB',
  },
  {
    name: 'Belarus',
    dial_code: '+375',
    code: 'BY',
  },
  {
    name: 'Belgium',
    dial_code: '+32',
    code: 'BE',
  },
  {
    name: 'Belize',
    dial_code: '+501',
    code: 'BZ',
  },
  {
    name: 'Benin',
    dial_code: '+229',
    code: 'BJ',
  },
  {
    name: 'Bermuda',
    dial_code: '+1441',
    code: 'BM',
  },
  {
    name: 'Bhutan',
    dial_code: '+975',
    code: 'BT',
  },
  {
    name: 'Bolivia, Plurinational State of',
    dial_code: '+591',
    code: 'BO',
  },
  {
    name: 'Bosnia and Herzegovina',
    dial_code: '+387',
    code: 'BA',
  },
  {
    name: 'Botswana',
    dial_code: '+267',
    code: 'BW',
  },
  {
    name: 'Brazil',
    dial_code: '+55',
    code: 'BR',
  },
  {
    name: 'British Indian Ocean Territory',
    dial_code: '+246',
    code: 'IO',
  },
  {
    name: 'Brunei Darussalam',
    dial_code: '+673',
    code: 'BN',
  },
  {
    name: 'Bulgaria',
    dial_code: '+359',
    code: 'BG',
  },
  {
    name: 'Burkina Faso',
    dial_code: '+226',
    code: 'BF',
  },
  {
    name: 'Burundi',
    dial_code: '+257',
    code: 'BI',
  },
  {
    name: 'Cambodia',
    dial_code: '+855',
    code: 'KH',
  },
  {
    name: 'Cameroon',
    dial_code: '+237',
    code: 'CM',
  },
  {
    name: 'Canada',
    dial_code: '+1',
    code: 'CA',
  },
  {
    name: 'Cape Verde',
    dial_code: '+238',
    code: 'CV',
  },
  {
    name: 'Cayman Islands',
    dial_code: '+ 345',
    code: 'KY',
  },
  {
    name: 'Central African Republic',
    dial_code: '+236',
    code: 'CF',
  },
  {
    name: 'Chad',
    dial_code: '+235',
    code: 'TD',
  },
  {
    name: 'Chile',
    dial_code: '+56',
    code: 'CL',
  },
  {
    name: 'China',
    dial_code: '+86',
    code: 'CN',
  },
  {
    name: 'Christmas Island',
    dial_code: '+61',
    code: 'CX',
  },
  {
    name: 'Cocos (Keeling) Islands',
    dial_code: '+61',
    code: 'CC',
  },
  {
    name: 'Colombia',
    dial_code: '+57',
    code: 'CO',
  },
  {
    name: 'Comoros',
    dial_code: '+269',
    code: 'KM',
  },
  {
    name: 'Congo',
    dial_code: '+242',
    code: 'CG',
  },
  {
    name: 'Congo, The Democratic Republic of the Congo',
    dial_code: '+243',
    code: 'CD',
  },
  {
    name: 'Cook Islands',
    dial_code: '+682',
    code: 'CK',
  },
  {
    name: 'Costa Rica',
    dial_code: '+506',
    code: 'CR',
  },
  {
    name: "Cote d'Ivoire",
    dial_code: '+225',
    code: 'CI',
  },
  {
    name: 'Croatia',
    dial_code: '+385',
    code: 'HR',
  },
  {
    name: 'Cuba',
    dial_code: '+53',
    code: 'CU',
  },
  {
    name: 'Cyprus',
    dial_code: '+357',
    code: 'CY',
  },
  {
    name: 'Czech Republic',
    dial_code: '+420',
    code: 'CZ',
  },
  {
    name: 'Denmark',
    dial_code: '+45',
    code: 'DK',
  },
  {
    name: 'Djibouti',
    dial_code: '+253',
    code: 'DJ',
  },
  {
    name: 'Dominica',
    dial_code: '+1767',
    code: 'DM',
  },
  {
    name: 'Dominican Republic',
    dial_code: '+1849',
    code: 'DO',
  },
  {
    name: 'Ecuador',
    dial_code: '+593',
    code: 'EC',
  },
  {
    name: 'Egypt',
    dial_code: '+20',
    code: 'EG',
  },
  {
    name: 'El Salvador',
    dial_code: '+503',
    code: 'SV',
  },
  {
    name: 'Equatorial Guinea',
    dial_code: '+240',
    code: 'GQ',
  },
  {
    name: 'Eritrea',
    dial_code: '+291',
    code: 'ER',
  },
  {
    name: 'Estonia',
    dial_code: '+372',
    code: 'EE',
  },
  {
    name: 'Ethiopia',
    dial_code: '+251',
    code: 'ET',
  },
  {
    name: 'Falkland Islands (Malvinas)',
    dial_code: '+500',
    code: 'FK',
  },
  {
    name: 'Faroe Islands',
    dial_code: '+298',
    code: 'FO',
  },
  {
    name: 'Fiji',
    dial_code: '+679',
    code: 'FJ',
  },
  {
    name: 'Finland',
    dial_code: '+358',
    code: 'FI',
  },
  {
    name: 'France',
    dial_code: '+33',
    code: 'FR',
  },
  {
    name: 'French Guiana',
    dial_code: '+594',
    code: 'GF',
  },
  {
    name: 'French Polynesia',
    dial_code: '+689',
    code: 'PF',
  },
  {
    name: 'Gabon',
    dial_code: '+241',
    code: 'GA',
  },
  {
    name: 'Gambia',
    dial_code: '+220',
    code: 'GM',
  },
  {
    name: 'Georgia',
    dial_code: '+995',
    code: 'GE',
  },
  {
    name: 'Germany',
    dial_code: '+49',
    code: 'DE',
  },
  {
    name: 'Ghana',
    dial_code: '+233',
    code: 'GH',
  },
  {
    name: 'Gibraltar',
    dial_code: '+350',
    code: 'GI',
  },
  {
    name: 'Greece',
    dial_code: '+30',
    code: 'GR',
  },
  {
    name: 'Greenland',
    dial_code: '+299',
    code: 'GL',
  },
  {
    name: 'Grenada',
    dial_code: '+1473',
    code: 'GD',
  },
  {
    name: 'Guadeloupe',
    dial_code: '+590',
    code: 'GP',
  },
  {
    name: 'Guam',
    dial_code: '+1671',
    code: 'GU',
  },
  {
    name: 'Guatemala',
    dial_code: '+502',
    code: 'GT',
  },
  {
    name: 'Guernsey',
    dial_code: '+44',
    code: 'GG',
  },
  {
    name: 'Guinea',
    dial_code: '+224',
    code: 'GN',
  },
  {
    name: 'Guinea-Bissau',
    dial_code: '+245',
    code: 'GW',
  },
  {
    name: 'Guyana',
    dial_code: '+595',
    code: 'GY',
  },
  {
    name: 'Haiti',
    dial_code: '+509',
    code: 'HT',
  },
  {
    name: 'Holy See (Vatican City State)',
    dial_code: '+379',
    code: 'VA',
  },
  {
    name: 'Honduras',
    dial_code: '+504',
    code: 'HN',
  },
  {
    name: 'Hong Kong',
    dial_code: '+852',
    code: 'HK',
  },
  {
    name: 'Hungary',
    dial_code: '+36',
    code: 'HU',
  },
  {
    name: 'Iceland',
    dial_code: '+354',
    code: 'IS',
  },
  {
    name: 'India',
    dial_code: '+91',
    code: 'IN',
  },
  {
    name: 'Indonesia',
    dial_code: '+62',
    code: 'ID',
  },
  {
    name: 'Iran, Islamic Republic of Persian Gulf',
    dial_code: '+98',
    code: 'IR',
  },
  {
    name: 'Iraq',
    dial_code: '+964',
    code: 'IQ',
  },
  {
    name: 'Ireland',
    dial_code: '+353',
    code: 'IE',
  },
  {
    name: 'Isle of Man',
    dial_code: '+44',
    code: 'IM',
  },
  {
    name: 'Israel',
    dial_code: '+972',
    code: 'IL',
  },
  {
    name: 'Italy',
    dial_code: '+39',
    code: 'IT',
  },
  {
    name: 'Jamaica',
    dial_code: '+1876',
    code: 'JM',
  },
  {
    name: 'Japan',
    dial_code: '+81',
    code: 'JP',
  },
  {
    name: 'Jersey',
    dial_code: '+44',
    code: 'JE',
  },
  {
    name: 'Jordan',
    dial_code: '+962',
    code: 'JO',
  },
  {
    name: 'Kazakhstan',
    dial_code: '+77',
    code: 'KZ',
  },
  {
    name: 'Kenya',
    dial_code: '+254',
    code: 'KE',
  },
  {
    name: 'Kiribati',
    dial_code: '+686',
    code: 'KI',
  },
  {
    name: "Korea, Democratic People's Republic of Korea",
    dial_code: '+850',
    code: 'KP',
  },
  {
    name: 'Korea, Republic of South Korea',
    dial_code: '+82',
    code: 'KR',
  },
  {
    name: 'Kuwait',
    dial_code: '+965',
    code: 'KW',
  },
  {
    name: 'Kyrgyzstan',
    dial_code: '+996',
    code: 'KG',
  },
  {
    name: 'Laos',
    dial_code: '+856',
    code: 'LA',
  },
  {
    name: 'Latvia',
    dial_code: '+371',
    code: 'LV',
  },
  {
    name: 'Lebanon',
    dial_code: '+961',
    code: 'LB',
  },
  {
    name: 'Lesotho',
    dial_code: '+266',
    code: 'LS',
  },
  {
    name: 'Liberia',
    dial_code: '+231',
    code: 'LR',
  },
  {
    name: 'Libyan Arab Jamahiriya',
    dial_code: '+218',
    code: 'LY',
  },
  {
    name: 'Liechtenstein',
    dial_code: '+423',
    code: 'LI',
  },
  {
    name: 'Lithuania',
    dial_code: '+370',
    code: 'LT',
  },
  {
    name: 'Luxembourg',
    dial_code: '+352',
    code: 'LU',
  },
  {
    name: 'Macao',
    dial_code: '+853',
    code: 'MO',
  },
  {
    name: 'Macedonia',
    dial_code: '+389',
    code: 'MK',
  },
  {
    name: 'Madagascar',
    dial_code: '+261',
    code: 'MG',
  },
  {
    name: 'Malawi',
    dial_code: '+265',
    code: 'MW',
  },
  {
    name: 'Malaysia',
    dial_code: '+60',
    code: 'MY',
  },
  {
    name: 'Maldives',
    dial_code: '+960',
    code: 'MV',
  },
  {
    name: 'Mali',
    dial_code: '+223',
    code: 'ML',
  },
  {
    name: 'Malta',
    dial_code: '+356',
    code: 'MT',
  },
  {
    name: 'Marshall Islands',
    dial_code: '+692',
    code: 'MH',
  },
  {
    name: 'Martinique',
    dial_code: '+596',
    code: 'MQ',
  },
  {
    name: 'Mauritania',
    dial_code: '+222',
    code: 'MR',
  },
  {
    name: 'Mauritius',
    dial_code: '+230',
    code: 'MU',
  },
  {
    name: 'Mayotte',
    dial_code: '+262',
    code: 'YT',
  },
  {
    name: 'Mexico',
    dial_code: '+52',
    code: 'MX',
  },
  {
    name: 'Micronesia, Federated States of Micronesia',
    dial_code: '+691',
    code: 'FM',
  },
  {
    name: 'Moldova',
    dial_code: '+373',
    code: 'MD',
  },
  {
    name: 'Monaco',
    dial_code: '+377',
    code: 'MC',
  },
  {
    name: 'Mongolia',
    dial_code: '+976',
    code: 'MN',
  },
  {
    name: 'Montenegro',
    dial_code: '+382',
    code: 'ME',
  },
  {
    name: 'Montserrat',
    dial_code: '+1664',
    code: 'MS',
  },
  {
    name: 'Morocco',
    dial_code: '+212',
    code: 'MA',
  },
  {
    name: 'Mozambique',
    dial_code: '+258',
    code: 'MZ',
  },
  {
    name: 'Myanmar',
    dial_code: '+95',
    code: 'MM',
  },
  {
    name: 'Namibia',
    dial_code: '+264',
    code: 'NA',
  },
  {
    name: 'Nauru',
    dial_code: '+674',
    code: 'NR',
  },
  {
    name: 'Nepal',
    dial_code: '+977',
    code: 'NP',
  },
  {
    name: 'Netherlands',
    dial_code: '+31',
    code: 'NL',
  },
  {
    name: 'Netherlands Antilles',
    dial_code: '+599',
    code: 'AN',
  },
  {
    name: 'New Caledonia',
    dial_code: '+687',
    code: 'NC',
  },
  {
    name: 'New Zealand',
    dial_code: '+64',
    code: 'NZ',
  },
  {
    name: 'Nicaragua',
    dial_code: '+505',
    code: 'NI',
  },
  {
    name: 'Niger',
    dial_code: '+227',
    code: 'NE',
  },
  {
    name: 'Nigeria',
    dial_code: '+234',
    code: 'NG',
  },
  {
    name: 'Niue',
    dial_code: '+683',
    code: 'NU',
  },
  {
    name: 'Norfolk Island',
    dial_code: '+672',
    code: 'NF',
  },
  {
    name: 'Northern Mariana Islands',
    dial_code: '+1670',
    code: 'MP',
  },
  {
    name: 'Norway',
    dial_code: '+47',
    code: 'NO',
  },
  {
    name: 'Oman',
    dial_code: '+968',
    code: 'OM',
  },
  {
    name: 'Pakistan',
    dial_code: '+92',
    code: 'PK',
  },
  {
    name: 'Palau',
    dial_code: '+680',
    code: 'PW',
  },
  {
    name: 'Palestinian Territory, Occupied',
    dial_code: '+970',
    code: 'PS',
  },
  {
    name: 'Panama',
    dial_code: '+507',
    code: 'PA',
  },
  {
    name: 'Papua New Guinea',
    dial_code: '+675',
    code: 'PG',
  },
  {
    name: 'Paraguay',
    dial_code: '+595',
    code: 'PY',
  },
  {
    name: 'Peru',
    dial_code: '+51',
    code: 'PE',
  },
  {
    name: 'Philippines',
    dial_code: '+63',
    code: 'PH',
  },
  {
    name: 'Pitcairn',
    dial_code: '+872',
    code: 'PN',
  },
  {
    name: 'Poland',
    dial_code: '+48',
    code: 'PL',
  },
  {
    name: 'Portugal',
    dial_code: '+351',
    code: 'PT',
  },
  {
    name: 'Puerto Rico',
    dial_code: '+1939',
    code: 'PR',
  },
  {
    name: 'Qatar',
    dial_code: '+974',
    code: 'QA',
  },
  {
    name: 'Romania',
    dial_code: '+40',
    code: 'RO',
  },
  {
    name: 'Russia',
    dial_code: '+7',
    code: 'RU',
  },
  {
    name: 'Rwanda',
    dial_code: '+250',
    code: 'RW',
  },
  {
    name: 'Reunion',
    dial_code: '+262',
    code: 'RE',
  },
  {
    name: 'Saint Barthelemy',
    dial_code: '+590',
    code: 'BL',
  },
  {
    name: 'Saint Helena, Ascension and Tristan Da Cunha',
    dial_code: '+290',
    code: 'SH',
  },
  {
    name: 'Saint Kitts and Nevis',
    dial_code: '+1869',
    code: 'KN',
  },
  {
    name: 'Saint Lucia',
    dial_code: '+1758',
    code: 'LC',
  },
  {
    name: 'Saint Martin',
    dial_code: '+590',
    code: 'MF',
  },
  {
    name: 'Saint Pierre and Miquelon',
    dial_code: '+508',
    code: 'PM',
  },
  {
    name: 'Saint Vincent and the Grenadines',
    dial_code: '+1784',
    code: 'VC',
  },
  {
    name: 'Samoa',
    dial_code: '+685',
    code: 'WS',
  },
  {
    name: 'San Marino',
    dial_code: '+378',
    code: 'SM',
  },
  {
    name: 'Sao Tome and Principe',
    dial_code: '+239',
    code: 'ST',
  },
  {
    name: 'Saudi Arabia',
    dial_code: '+966',
    code: 'SA',
  },
  {
    name: 'Senegal',
    dial_code: '+221',
    code: 'SN',
  },
  {
    name: 'Serbia',
    dial_code: '+381',
    code: 'RS',
  },
  {
    name: 'Seychelles',
    dial_code: '+248',
    code: 'SC',
  },
  {
    name: 'Sierra Leone',
    dial_code: '+232',
    code: 'SL',
  },
  {
    name: 'Singapore',
    dial_code: '+65',
    code: 'SG',
  },
  {
    name: 'Slovakia',
    dial_code: '+421',
    code: 'SK',
  },
  {
    name: 'Slovenia',
    dial_code: '+386',
    code: 'SI',
  },
  {
    name: 'Solomon Islands',
    dial_code: '+677',
    code: 'SB',
  },
  {
    name: 'Somalia',
    dial_code: '+252',
    code: 'SO',
  },
  {
    name: 'South Africa',
    dial_code: '+27',
    code: 'ZA',
  },
  {
    name: 'South Sudan',
    dial_code: '+211',
    code: 'SS',
  },
  {
    name: 'South Georgia and the South Sandwich Islands',
    dial_code: '+500',
    code: 'GS',
  },
  {
    name: 'Spain',
    dial_code: '+34',
    code: 'ES',
  },
  {
    name: 'Sri Lanka',
    dial_code: '+94',
    code: 'LK',
  },
  {
    name: 'Sudan',
    dial_code: '+249',
    code: 'SD',
  },
  {
    name: 'Suriname',
    dial_code: '+597',
    code: 'SR',
  },
  {
    name: 'Svalbard and Jan Mayen',
    dial_code: '+47',
    code: 'SJ',
  },
  {
    name: 'Swaziland',
    dial_code: '+268',
    code: 'SZ',
  },
  {
    name: 'Sweden',
    dial_code: '+46',
    code: 'SE',
  },
  {
    name: 'Switzerland',
    dial_code: '+41',
    code: 'CH',
  },
  {
    name: 'Syrian Arab Republic',
    dial_code: '+963',
    code: 'SY',
  },
  {
    name: 'Taiwan',
    dial_code: '+886',
    code: 'TW',
  },
  {
    name: 'Tajikistan',
    dial_code: '+992',
    code: 'TJ',
  },
  {
    name: 'Tanzania, United Republic of Tanzania',
    dial_code: '+255',
    code: 'TZ',
  },
  {
    name: 'Thailand',
    dial_code: '+66',
    code: 'TH',
  },
  {
    name: 'Timor-Leste',
    dial_code: '+670',
    code: 'TL',
  },
  {
    name: 'Togo',
    dial_code: '+228',
    code: 'TG',
  },
  {
    name: 'Tokelau',
    dial_code: '+690',
    code: 'TK',
  },
  {
    name: 'Tonga',
    dial_code: '+676',
    code: 'TO',
  },
  {
    name: 'Trinidad and Tobago',
    dial_code: '+1868',
    code: 'TT',
  },
  {
    name: 'Tunisia',
    dial_code: '+216',
    code: 'TN',
  },
  {
    name: 'Turkey',
    dial_code: '+90',
    code: 'TR',
  },
  {
    name: 'Turkmenistan',
    dial_code: '+993',
    code: 'TM',
  },
  {
    name: 'Turks and Caicos Islands',
    dial_code: '+1649',
    code: 'TC',
  },
  {
    name: 'Tuvalu',
    dial_code: '+688',
    code: 'TV',
  },
  {
    name: 'Uganda',
    dial_code: '+256',
    code: 'UG',
  },
  {
    name: 'Ukraine',
    dial_code: '+380',
    code: 'UA',
  },
  {
    name: 'United Arab Emirates',
    dial_code: '+971',
    code: 'AE',
  },
  {
    name: 'United Kingdom',
    dial_code: '+44',
    code: 'GB',
  },
  {
    name: 'United States',
    dial_code: '+1',
    code: 'US',
  },
  {
    name: 'Uruguay',
    dial_code: '+598',
    code: 'UY',
  },
  {
    name: 'Uzbekistan',
    dial_code: '+998',
    code: 'UZ',
  },
  {
    name: 'Vanuatu',
    dial_code: '+678',
    code: 'VU',
  },
  {
    name: 'Venezuela, Bolivarian Republic of Venezuela',
    dial_code: '+58',
    code: 'VE',
  },
  {
    name: 'Vietnam',
    dial_code: '+84',
    code: 'VN',
  },
  {
    name: 'Virgin Islands, British',
    dial_code: '+1284',
    code: 'VG',
  },
  {
    name: 'Virgin Islands, U.S.',
    dial_code: '+1340',
    code: 'VI',
  },
  {
    name: 'Wallis and Futuna',
    dial_code: '+681',
    code: 'WF',
  },
  {
    name: 'Yemen',
    dial_code: '+967',
    code: 'YE',
  },
  {
    name: 'Zambia',
    dial_code: '+260',
    code: 'ZM',
  },
  {
    name: 'Zimbabwe',
    dial_code: '+263',
    code: 'ZW',
  },
];

export const isFieldEmpty = (text) => {
  console.log('text', text);
  if (text === '') {
    return true;
  }
  return false;
};
export const passwordPattern = (password) => {
  const reg = /.*[0-9]+.*/i;
  if (reg.test(password) === true) {
    return true;
  }
  return false;
};

export const capitalize = (word) =>
  word[0].toUpperCase() + word.slice(1).toLowerCase();

export const isValidEmail = (email) => {
  // var reg = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
  // eslint-disable-next-line no-useless-escape
  const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  if (reg.test(email) !== true) {
    return true;
  }
  return false;
};

export const isValidOtp = (otp) => {
  if (otp.length < 4) {
    return false;
  }
  return true;
};

export const isValidPhoneNumber = (phone) => {
  if (phone.length > 8) {
    return false;
  }
  return true;
};

export const isValidComparedPassword = (newpassword, confirmPassword) => {
  if (newpassword !== confirmPassword) {
    return true;
  }
  return false;
};
export const getOS = () => {
  if (Platform.OS === 'ios') {
    return 'ios';
  }
  return 'android';
};

export const showAlert = (
  message,
  onOkPress = () => console.log('OK Pressed'),
) => {
  Alert.alert(
    strings.titleBasic,
    message,
    [{text: strings.okTitleText, onPress: onOkPress}],
    {cancelable: false},
  );
};

export const showAlertWithoutTitle = (
  message,
  onOkPress = () => console.log('OK Pressed'),
) => {
  Alert.alert('', message, [{text: strings.okTitleText, onPress: onOkPress}], {
    cancelable: false,
  });
};

export const showAlertWithCallBack = (msg, onOkClick) => {
  Alert.alert(
    '',
    msg,
    [
      {
        text: strings.okTitleText,
        onPress: () => {
          console.log(' CLICK CALLED ');
          onOkClick();
        },
      },
    ],
    {
      cancelable: false,
    },
  );
};

export const removeAuthKey = async () => {};
// New Utility Method for set any kind of value
export const setStorage = async (key, value) => {
  try {
    const valueString =
      typeof value === 'object' ? JSON.stringify(value) : value.toString();
    await AsyncStorage.setItem(key, valueString);
  } catch (e) {
    // Do nothing. Its null or or plain string
  }
};

export const getStorage = async (key) => {
  let value = await AsyncStorage.getItem(key);
  try {
    value = JSON.parse(value);
    return value;
  } catch (e) {
    // Do nothing. Its null or or plain string
  }
  return value;
};
export const clearStorage = async () => {
  const asyncStorageKeys = await AsyncStorage.getAllKeys();
  if (asyncStorageKeys.length > 0) {
    if (Platform.OS === 'android') {
      await AsyncStorage.clear();
    }
    if (Platform.OS === 'ios') {
      await AsyncStorage.multiRemove(asyncStorageKeys);
    }
  }
};

export function logCurrentStorage() {
  AsyncStorage.getAllKeys().then((keyArray) => {
    AsyncStorage.multiGet(keyArray).then((keyValArray) => {
      const myStorage = {};
      for (const keyVal of keyValArray) {
        myStorage[keyVal[0]] = keyVal[1];
      }

      console.log('CURRENT STORAGE: ', myStorage);
    });
  });
}

export const widthPercentageToDP = (widthPercent) => {
  const screenWidth = Dimensions.get('window').width;
  const elemWidth = parseFloat(widthPercent);
  return PixelRatio.roundToNearestPixel((screenWidth * elemWidth) / 100);
};
export const heightPercentageToDP = (heightPercent) => {
  const screenHeight = Dimensions.get('window').height;
  // Convert string input to decimal number
  const elemHeight = parseFloat(heightPercent);
  return PixelRatio.roundToNearestPixel((screenHeight * elemHeight) / 100);
};
export const convertFirstCharacterAllWordsToUppercase = (stringToConvert) => {
  let stringObj = '';
  if (stringToConvert === undefined) {
    stringObj = '';
  } else {
    stringObj = stringToConvert;
  }
  const wordsArray = stringObj.split(' ');
  const convertedWordsArray = wordsArray.map((word) =>
    convertFirstCharacterToUppercase(word),
  );

  return convertedWordsArray.join(' ');
};
const convertFirstCharacterToUppercase = (stringToConvert) => {
  const firstCharacter = stringToConvert.substring(0, 1);
  const restString = stringToConvert.substring(1);

  return firstCharacter.toUpperCase() + restString;
};
const backgroundColors = [
  '#53c6a2',
  '#fdd762',
  '#9261d3',
  '#43dce7',
  '#ffcc5a',
  '#ea4398',
  '#4a5de1',
  '#e95555',
  '#7eda54',
  '#f9b647',
];

export const eventDefaultColor = [
  '#FF3B00',
  '#FF7F00',
  '#FFAE01',
  '#00C168',
  '#0093FF',
];

export const createdEventData = [
  {
    id: 0,
    color: colors.redColorCard,
    isSelected: true,
  },
  {
    id: 1,
    color: colors.orangeColorCard,
    isSelected: false,
  },
  {
    id: 2,
    color: colors.yellowColorCard,
    isSelected: false,
  },
  {
    id: 3,
    color: colors.lightYellowColorCard,
    isSelected: false,
  },
  {
    id: 4,
    color: colors.lightGreenColorCard,
    isSelected: false,
  },
  {
    id: 5,
    color: colors.greenColorCard,
    isSelected: false,
  },
  {
    id: 6,
    color: colors.skyColorCard,
    isSelected: false,
  },
  {
    id: 7,
    color: colors.lightBlueColorCard,
    isSelected: false,
  },
  {
    id: 8,
    color: colors.purpleColorCard,
    isSelected: false,
  },
  {
    id: 9,
    color: colors.googleColor,
    isSelected: false,
  },
];
export const importedEventData = [
  {
    id: 0,
    color: colors.redColorCard,
    isSelected: true,
  },
  {
    id: 1,
    color: colors.orangeColorCard,
    isSelected: false,
  },
  {
    id: 2,
    color: colors.yellowColorCard,
    isSelected: false,
  },
  {
    id: 3,
    color: colors.lightYellowColorCard,
    isSelected: false,
  },
  {
    id: 4,
    color: colors.lightGreenColorCard,
    isSelected: false,
  },
  {
    id: 5,
    color: colors.greenColorCard,
    isSelected: false,
  },
  {
    id: 6,
    color: colors.skyColorCard,
    isSelected: false,
  },
  {
    id: 7,
    color: colors.lightBlueColorCard,
    isSelected: false,
  },
  {
    id: 8,
    color: colors.purpleColorCard,
    isSelected: false,
  },
  {
    id: 9,
    color: colors.googleColor,
    isSelected: false,
  },
];
export const gamesEventData = [
  {
    id: 0,
    color: colors.redColorCard,
    isSelected: true,
  },
  {
    id: 1,
    color: colors.orangeColorCard,
    isSelected: false,
  },
  {
    id: 2,
    color: colors.yellowColorCard,
    isSelected: false,
  },
  {
    id: 3,
    color: colors.lightYellowColorCard,
    isSelected: false,
  },
  {
    id: 4,
    color: colors.lightGreenColorCard,
    isSelected: false,
  },
  {
    id: 5,
    color: colors.greenColorCard,
    isSelected: false,
  },
  {
    id: 6,
    color: colors.skyColorCard,
    isSelected: false,
  },
  {
    id: 7,
    color: colors.lightBlueColorCard,
    isSelected: false,
  },
  {
    id: 8,
    color: colors.purpleColorCard,
    isSelected: false,
  },
  {
    id: 9,
    color: colors.googleColor,
    isSelected: false,
  },
];
// eslint-disable-next-line no-bitwise
export const getRandomColor = () =>
  backgroundColors[(backgroundColors.length * Math.random()) | 0];

export const STAR_COLOR = {
  YELLOW: 'YELLOW',
  GREEN: 'GREEN',
  BLUE: 'BLUE',
  WHITE: 'WHITE',
};

export const STAR_IMAGE = {
  YELLOW: images.yellowRatingStar,
  GREEN: images.greenRatingStar,
  BLUE: images.blueRatingStar,
  WHITE: images.blankRatingStar,
};

export const toggleView = (callbackMethod, duration = 2000) => {
  const CustomLayoutLinear = {
    duration,
    create: {
      type: LayoutAnimation.Types.linear,
      property: LayoutAnimation.Properties.opacity,
    },
    update: {
      type: LayoutAnimation.Types.linear,
      property: LayoutAnimation.Properties.opacity,
    },
    delete: {
      type: LayoutAnimation.Types.linear,
      property: LayoutAnimation.Properties.opacity,
    },
  };

  LayoutAnimation.configureNext(CustomLayoutLinear);
  callbackMethod();
};

export const getRegionFromMarkers = (markers, delta = 0.025, offset = 2.5) => {
  let minLat = 0,
    maxLat = 0,
    minLng = 0,
    maxLng = 0;
  for (let i = 0; i < markers.length; i++) {
    const marker = markers[i];
    if (i === 0) {
      minLat = marker.latitude;
      maxLat = marker.latitude;
      minLng = marker.longitude;
      maxLng = marker.longitude;
    } else {
      if (marker.latitude <= minLat) minLat = marker.latitude;
      if (marker.latitude >= maxLat) maxLat = marker.latitude;
      if (marker.longitude <= minLng) minLng = marker.longitude;
      if (marker.longitude >= maxLng) maxLng = marker.longitude;
    }
  }
  const latitude = (minLat + maxLat) / 2;
  const longitude = (minLng + maxLng) / 2;
  const latDelta = (Math.abs(minLat - maxLat) || delta) * offset;
  const lngDelta = (Math.abs(minLng - maxLng) || delta) * offset;
  return {
    latitude,
    longitude,
    latitudeDelta: latDelta,
    longitudeDelta: lngDelta,
  };
};

export const escapeRegExp = (str) => {
  if (!_.isString(str)) {
    return '';
  }
  return str.replace(/[-[\]\\/{}()*+?.^$|]/g, '\\$&');
};

export const getSearchData = (data = [], field = [], searchString) => {
  const searchData = [];
  const searchStr = escapeRegExp(searchString).replace(' ', '');
  if (searchStr !== '') {
    data?.map((item) => {
      let isSearch = false;
      field?.map((key) => {
        if (
          !isSearch &&
          item?._source?.[key]
            ?.toLowerCase()
            ?.toString()
            ?.replace(' ', '')
            ?.match(searchStr?.toLowerCase()?.toString())
        ) {
          isSearch = true;
        }
        return true;
      });
      if (isSearch) searchData.push(item);
      return true;
    });
  }
  return searchData;
};

export const getSearchTags = (data = [], searchString) =>
  data.filter(
    (x) =>
      x.full_name?.toLowerCase().includes(searchString?.toLowerCase()) ||
      x.group_name?.toLowerCase().includes(searchString?.toLowerCase()),
  );

export const getSearchEntityData = (data = [], field = [], searchString) => {
  const searchData = [];
  const searchStr = escapeRegExp(searchString).replace(' ', '');
  if (searchStr !== '') {
    data?.map((item) => {
      let isSearch = false;
      field?.map((key) => {
        if (
          !isSearch &&
          item?.[key]
            ?.toLowerCase()
            ?.toString()
            ?.replace(' ', '')
            ?.match(searchStr?.toLowerCase()?.toString())
        ) {
          isSearch = true;
        }
        return true;
      });
      if (isSearch) searchData.push(item);
      return true;
    });
  }
  return searchData;
};

export const round = (value, decimals) => value.toFixed(decimals);

export const getHitSlop = (slopValue) => {
  let hitSlop = {
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
  };
  if (['string', 'number']?.includes(typeof slopValue)) {
    hitSlop = {
      top: slopValue,
      bottom: slopValue,
      right: slopValue,
      left: slopValue,
    };
  } else if (typeof slopValue === 'object') {
    hitSlop = {...hitSlop, ...slopValue};
  }
  return hitSlop;
};

export const validURL = (str) => {
  const pattern = new RegExp(
    '^(https?:\\/\\/)?' + // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
      '(\\#[-a-z\\d_]*)?$',
    'i',
  ); // fragment locator
  return !!pattern.test(str);
};

export const getTaggedEntityData = (
  entity_raw_data,
  entity_item,
  entity_type,
) => {
  let entity = {...entity_raw_data};
  if (entity_type === 'game') {
    const pickedEntity = _.pick(entity_item, [
      'sport',
      'status',
      'start_datetime',
      'end_datetime',
      'user_challenge',
      'userChallenge',
      'home_team.thumbnail',
      'home_team.group_name',
      'home_team.full_name',
      'away_team.thumbnail',
      'away_team.group_name',
      'away_team.full_name',
      'venue.address',
      'venue.description',
    ]);
    entity = {...entity, ...pickedEntity};
  } else {
    const pickedEntity = _.pick(entity_item, [
      'group_name',
      'full_name',
      'city',
      'thumbnail',
    ]);
    entity = {...entity, ...pickedEntity};
  }
  return entity;
};

export const getTaggedText = (format_tagged_data = []) => {
  const gameTagList = format_tagged_data.filter(
    (item) => item.entity_type === Verbs.entityTypeGame,
  );
  const entityTagList = format_tagged_data?.filter(
    (item) => item.entity_type !== Verbs.entityTypeGame,
  );

  let entityCountText = '';
  let matchCountText = '';

  if (entityTagList.length > 0) {
    const userList = entityTagList.filter(
      (item) =>
        item.entity_type === Verbs.entityTypeUser ||
        item.entity_type === Verbs.entityTypePlayer,
    );
    const groupList = entityTagList.filter(
      (item) =>
        item.entity_type === Verbs.entityTypeClub ||
        item.entity_type === Verbs.entityTypeTeam,
    );
    if (userList.length > 0) {
      entityCountText =
        userList.length > 1
          ? `${format(strings.peopleCount, userList.length)}`
          : `${format(strings.personCount, userList.length)}`;
    }
    if (groupList.length > 0) {
      if (userList.length) {
        entityCountText += ', ';
      }
      entityCountText +=
        groupList.length > 1
          ? `${format(strings.groupsCount, groupList.length)}`
          : `${format(strings.groupCount, groupList.length)}`;
    }
  }

  if (gameTagList.length > 0) {
    if (entityCountText) {
      matchCountText += ` ${strings.and} `;
    }
    matchCountText +=
      gameTagList.length > 1
        ? `${format(strings.matchesCount, gameTagList.length)}`
        : `${format(strings.matchCount, gameTagList.length)}`;
  }

  return `${entityCountText}${matchCountText}`;
};

export const getScreenWidth = ({
  isLandscape,
  screenInsets,
  avoidScreenInsets = null,
  portraitWidth = 100,
  landscapeWidth = portraitWidth,
}) => {
  let avoidInsets = avoidScreenInsets ?? false;
  if (avoidScreenInsets === null) {
    if (!isLandscape && portraitWidth !== 100) avoidInsets = true;
    else if (isLandscape && landscapeWidth !== 100) avoidInsets = true;
  }
  const avoidLength = !avoidInsets ? screenInsets.left + screenInsets.right : 0;
  return (isLandscape ? hp(landscapeWidth) : wp(portraitWidth)) - avoidLength;
};

export const getScreenHeight = ({
  isLandscape,
  screenInsets,
  avoidScreenInsets = null,
  portraitHeight = 100,
  landscapeHeight = portraitHeight,
}) => {
  let avoidInsets = avoidScreenInsets ?? false;
  if (avoidScreenInsets === null) {
    if (!isLandscape && portraitHeight !== 100) avoidInsets = true;
    else if (isLandscape && landscapeHeight !== 100) avoidInsets = true;
  }
  const avoidLength = !avoidInsets ? screenInsets.top + screenInsets.bottom : 0;
  return (isLandscape ? wp(landscapeHeight) : hp(portraitHeight)) - avoidLength;
};

export const stringContainValidURL = (str) =>
  new RegExp(
    '([a-zA-Z0-9]+://)?([a-zA-Z0-9_]+:[a-zA-Z0-9_]+@)?([a-zA-Z0-9.-]+\\.[A-Za-z]{2,4})(:[0-9]+)?(/.*)?',
  ).test(str);

export const getSportIcon = (sport) => {
  switch (sport) {
    case 'soccer':
      return images.soccerIcon;
    case 'tennis':
      return images.tennisIcon;
    default:
      return images.soccerIcon;
  }
};

export const getSportLogo = (sportObj, sportContext) => {
  console.log('aaaaaaa0000aaaaa', sportObj);

  const arrData = [];
  for (const outer of sportContext) {
    for (const inner of outer.format) {
      const temp = {
        ...inner,
        player_image: outer.player_image,
      };
      arrData.push(temp);
    }
  }
  let url = '';
  console.log('AAA:->', arrData);
  getStorage('appSetting').then((setting) => {
    console.log('appSetting index', setting);

    const selectedObj = arrData?.filter(
      (obj) =>
        obj.sport === sportObj.sport && obj.sport_type === sportObj.sport_type,
    );
    console.log('image aaaa ', selectedObj);
    url = setting.base_url_sporticon;
  });
  return `${url}${selectedObj[0]?.player_image}`;
};

export const roundValue = (value, decimals) =>
  value ? parseFloat(+value.toFixed(decimals)) : 0;

export const getFiltersOpetions = (opetions) => {
  const arr = [];
  Object.keys(opetions).forEach((key) => {
    const obj = {};
    obj[key] = opetions[key];
    arr.push(obj);
  });
  return arr;
};

export const getCalendar = async (
  participantId,
  fromDate,
  toDate,
  type,
  blocked,
) => {
  try {
    return getStorage('scheduleSetting').then(async (ids) => {
      const IDs = ids ?? [];
      const participants = [];
      participants.push(participantId);
      const body = {
        query: {
          bool: {
            must: [
              {
                bool: {
                  should: [
                    {
                      terms: {
                        'participants.entity_id.keyword': [
                          ...participants,
                          ...IDs,
                        ],
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
      };

      if (type) {
        body.query.bool.must.push({
          term: {
            'cal_type.keyword': type,
          },
        });
      }

      if (blocked === true || blocked === false) {
        body.query.bool.must.push({
          match: {
            blocked,
          },
        });
      }
      if (fromDate) {
        body.query.bool.must.push({
          range: {actual_enddatetime: {gt: fromDate}},
        });
      }
      if (toDate) {
        body.query.bool.must.push({
          range: {start_datetime: {lt: toDate}},
        });
      }
      // console.log('calender elastic search :=>', JSON.stringify(body));
      return getCalendarIndex(body);
    });
  } catch (error) {
    return [];
  }
};

export const getEventsSlots = async (participants) => {
  try {
    return getStorage('scheduleSetting').then(async (ids) => {
      const IDs = ids ?? [];
      const body = {
        size: 500,
        query: {
          bool: {
            must: [
              {
                bool: {
                  should: [
                    {
                      terms: {
                        'participants.entity_id.keyword': [
                          ...participants,
                          ...IDs,
                        ],
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
      };
      // if (fromDate) {
      //   body.query.bool.must.push({
      //     range: {end_datetime: {gt: fromDate}},
      //   });
      // }

      // if (toDate) {
      //   body.query.bool.must.push({
      //     range: {actual_enddatetime: {lt: toDate}},
      //   });
      // }
      // console.log('calender elastic search :=>', JSON.stringify(body));
      return getCalendarIndex(body);
    });
  } catch (error) {
    return [];
  }
};

export const uniqueArray = (array, propertyName) =>
  array.filter(
    (e, i) => array.findIndex((a) => a[propertyName] === e[propertyName]) === i,
  );

export const getSportName = (object, authContext) => {
  const tempObject = {
    ...object,
    sport_type:
      object?.sport_type ??
      object?.home_team?.sport_type ??
      object?.away_team?.sport_type,
    sport:
      object?.sport ?? object?.home_team?.sport ?? object?.away_team?.sport,
  };

  if (tempObject?.sport_type && tempObject?.sport_type !== '') {
    let sportArr = [];
    authContext?.sports?.map((item) => {
      sportArr = [...sportArr, ...item.format];
      return null;
    });
    const filterFormat = sportArr?.filter(
      (item) =>
        item?.sport_type === tempObject?.sport_type &&
        item?.sport === tempObject?.sport,
    )[0];
    return filterFormat?.sport_name?.toLowerCase() === 'Tennis'.toLowerCase()
      ? 'Tennis Singles'
      : filterFormat?.sport_name;
  }
  const filterFormat = authContext?.sports?.filter(
    (obj) => obj?.sport === tempObject?.sport,
  )[0];

  return filterFormat?.sport_name;
};

export const getSportObjectByName = (sportName, authContext) => {
  let sportArr = [];
  authContext?.sports?.map((item) => {
    sportArr = [...sportArr, ...item.format];
    return null;
  });

  const filterObject = sportArr?.filter(
    (item) => item?.sport_name === sportName,
  )[0];
  return filterObject;
};

export const getSportIconUrl = async (sport, entityType, authContext) => {
  const setting = await getStorage('appSetting');
  const baseUrl = setting?.base_url_sporticon ?? '';
  const sportObj = authContext.sports.find((item) => item.sport === sport);

  if (sportObj) {
    if (
      entityType === Verbs.entityTypeUser ||
      entityType === Verbs.entityTypePlayer
    ) {
      return `${baseUrl}${sportObj.player_image}`;
    }
    if (entityType === Verbs.entityTypeScorekeeper) {
      return `${baseUrl}${sportObj.scorekeeper_image}`;
    }
    if (entityType === Verbs.entityTypeReferee) {
      return `${baseUrl}${sportObj.referee_image}`;
    }
  }
  return '';
};

export const getSportImage = (sportName, type, authContext) => {
  console.log('TYPET', type);
  if (type === 'player') {
    const tempObj = authContext.sports.filter(
      (obj) => obj.sport === sportName,
    )[0];
    return tempObj;
  } else {
    if (type === 'referee') {
      const tempObj = authContext.sports.filter(
        (obj) => obj.sport === sportName,
      )[0];
      return tempObj;
    }
    if (type === 'scorekeeper') {
      const tempObj = authContext.sports.filter(
        (obj) => obj.sport === sportName,
      )[0];
      return tempObj;
    } // let sportArr = [];
    // authContext.sports.map((item) => {
    //   sportArr = [...sportArr, ...item.format];
    //   console.log('rerrr::=>',item);
    //   return null;
    // });
    // const filterFormat = sportArr?.filter((obj) => obj.sport === sportName)[0];
    // if (type === 'referee') {
    //   return filterFormat?.referee_image;
    // }
    // if (type === 'scorekeeper') {
    //   return filterFormat?.scorekeeper_image;
    // }
  }
};

export const getGamesList = async (eventsList) => {
  const promiseArr = [];
  let userIDs = [];
  let groupIDs = [];

  eventsList.map((game) => {
    if (game.user_challenge && !game.cal_id) {
      userIDs.push(game.home_team);
      userIDs.push(game.away_team);
    } else if (game.cal_id && game.owner_id && game.owner_type === 'users') {
      userIDs.push(game.owner_id);
    } else if (game.cal_id && game.owner_id && game.owner_type === 'groups') {
      groupIDs.push(game.owner_id);
    } else {
      groupIDs.push(game.home_team);
      groupIDs.push(game.away_team);
    }
  });

  userIDs = [...new Set(userIDs)];
  groupIDs = [...new Set(groupIDs)];

  if (userIDs.length > 0) {
    const userQuery = {
      query: {
        terms: {
          _id: userIDs,
        },
      },
    };
    promiseArr.push(getUserIndex(userQuery));
  }
  if (groupIDs.length > 0) {
    const groupQuery = {
      query: {
        terms: {
          _id: groupIDs,
        },
      },
    };
    promiseArr.push(getGroupIndex(groupQuery));
  }

  if (promiseArr.length > 0) {
    return Promise.all(promiseArr).then(([data1, data2]) => {
      let userData, groupData;
      if (userIDs.length > 0 && groupIDs.length > 0) {
        userData = data1;
        groupData = data2;
      } else if (userIDs.length > 0) {
        userData = data1;
      } else {
        groupData = data1;
      }

      if (userData) {
        const userGames = (eventsList || []).filter(
          (game) =>
            game.user_challenge ||
            (game.owner_id && game.owner_type === 'users'),
        );
        for (const game of userGames) {
          let userObj = userData.find(
            (user) =>
              user.user_id === game.home_team || user.user_id === game.owner_id,
          );
          if (userObj) {
            if (game.home_team) {
              game.home_team = userObj;
            } else {
              game.owner_obj = userObj;
            }
          }

          userObj = userData.find(
            (user) =>
              user.user_id === game.away_team || user.user_id === game.owner_id,
          );
          if (userObj) {
            if (game.away_team) {
              game.away_team = userObj;
            } else {
              game.owner_obj = userObj;
            }
          }
        }
      }
      if (groupData) {
        const groupGames = (eventsList || []).filter(
          (game) =>
            !game.user_challenge ||
            (game.owner_id && game.owner_type === 'groups'),
        );
        for (const game of groupGames) {
          let groupObj = groupData.find(
            (group) =>
              group.group_id === game.home_team ||
              group.group_id === game.owner_id,
          );
          if (groupObj) {
            if (game.home_team) {
              game.home_team = groupObj;
            } else {
              game.owner_obj = groupObj;
            }
          }

          groupObj = groupData.find(
            (group) =>
              group.group_id === game.away_team ||
              group.group_id === game.owner_id,
          );
          if (groupObj) {
            if (game.away_team) {
              game.away_team = groupObj;
            } else {
              game.owner_obj = groupObj;
            }
          }
        }
      }
      return eventsList;
    });
  }
};

export const getMaxFromRange = (max_of_array) => {
  if (max_of_array <= 10) {
    return 10;
  } else if (max_of_array <= 20) {
    return 20;
  } else if (max_of_array <= 30) {
    return 30;
  } else if (max_of_array <= 40) {
    return 40;
  } else if (max_of_array <= 50) {
    return 50;
  } else if (max_of_array <= 100) {
    return 100;
  } else if (max_of_array <= 200) {
    return 200;
  } else if (max_of_array <= 300) {
    return 300;
  } else if (max_of_array <= 400) {
    return 400;
  } else if (max_of_array <= 500) {
    return 500;
  } else if (max_of_array <= 600) {
    return 600;
  } else if (max_of_array <= 700) {
    return 700;
  } else if (max_of_array <= 800) {
    return 800;
  } else if (max_of_array <= 900) {
    return 900;
  }
};

export const validateEmail = (emailText) => {
  if (
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
      emailText,
    )
  ) {
    return true;
  }

  return false;
};
export const validatedName = (name) => {
  if (/^[a-z ,.'-]+$/i.test(name)) {
    return true;
  }
  return false;
};

// Input format 2h 30m
export const getHoursMinutesFromString = (timeString) => {
  const arr = timeString.split(' ');
  return {
    hour: arr[0].slice(0, -1),
    minute: arr[1].slice(0, -1),
  };
};

export const deleteConfirmation = (title, subTitle, okClick) => {
  Alert.alert(
    title,
    subTitle,
    [
      {
        text: strings.cancel,
        style: 'cancel',
      },
      {
        text: strings.okTitleText,
        onPress: okClick,
      },
    ],
    {cancelable: false},
  );
};

// TCDate is unixtimestamp
// unixTimeStamp - is the timestamp which come from server in seconds from 1st jan 1970 GMT
export const getTCDate = (date) =>
  Number(parseFloat(date.getTime() / 1000).toFixed(0));

// unixTimeStamp - is the timestamp which come from server in seconds from 1st jan 1970 GMT
export const getJSDate = (unixTimeStamp) => new Date(unixTimeStamp * 1000);

export const countNumberOfWeekFromDay = (date) => {
  const startDate = new Date(date.getFullYear(), date.getMonth(), 1);
  const endDate = date;
  const givenDay = date.getDay();
  let numberOfDates = 0;
  while (startDate <= endDate) {
    if (startDate.getDay() === givenDay) {
      numberOfDates += 1;
    }
    startDate.setDate(startDate.getDate() + 1);
  }
  return ordinal_suffix_of(numberOfDates);
};

export const countNumberOfWeeks = (date) => {
  const startDate = new Date(date.getFullYear(), date.getMonth(), 1);
  const endDate = date;
  const givenDay = date.getDay();
  let numberOfDates = 0;
  while (startDate <= endDate) {
    if (startDate.getDay() === givenDay) {
      numberOfDates += 1;
    }
    startDate.setDate(startDate.getDate() + 1);
  }
  return numberOfDates;
};

export const getDayFromDate = (date) => {
  const dt = moment(date, 'YYYY-MM-DD HH:mm:ss');
  return dt.format('dddd');
};

export const ordinal_suffix_of = (i) => {
  const j = i % 10,
    k = i % 100;
  if (j === 1 && k !== 11) {
    return `${i}st`;
  }
  if (j === 2 && k !== 12) {
    return `${i}nd`;
  }
  if (j === 3 && k !== 13) {
    return `${i}rd`;
  }
  return `${i}th`;
};

export const getRoundedDate = (minutes, d = new Date()) => {
  const ms = 1000 * 60 * minutes; // convert minutes to ms
  const roundedDate = new Date(Math.ceil(d.getTime() / ms) * ms);
  return roundedDate;
};

export const firstLetterCapital = (str) =>
  str.charAt(0).toUpperCase() + str.slice(1);

export const getCityStateCountry = (authContext) => {
  let str = '';
  if (authContext?.entity?.obj?.city) {
    str = `${str + authContext.entity.obj.city}, `;
  }
  if (authContext?.entity?.obj?.state || authContext?.entity?.obj?.state_abbr) {
    str = `${
      str + (authContext.entity.obj.state || authContext.entity.obj.state_abbr)
    }, `;
  }

  if (authContext?.entity?.obj?.state || authContext?.entity?.obj?.state_abbr) {
    str = `${str + authContext.entity.obj.country}, `;
  }

  return str;
};
export const getCityStateCountryText = (data) =>
  data.filter((v) => v).join(', ');

export const displayLocation = (data) => {
  const loc = [];
  loc.push(data.city);

  if (
    data.country?.toLowerCase() === 'canada' ||
    data.country?.toLowerCase() === 'usa' ||
    data.country?.toLowerCase() === 'united states'
  ) {
    loc.push(data.state_abbr ?? data.state);
  } else {
    loc.push(data.country);
  }
  return loc.filter((v) => v).join(', ');
};

export const setAuthContextData = async (data, authContext) => {
  const entity = authContext.entity;

  entity.auth.user = data;
  entity.obj = data;
  await setStorage('authContextUser', data);
  await setStorage('authContextEntity', {...entity});
  authContext.setEntity({...entity});
  authContext.setUser(data);

  const updatedManagedEntities = authContext.managedEntities.map((item) => {
    if (
      data?.entity_type === Verbs.entityTypePlayer ||
      data?.entity_type === Verbs.entityTypeUser
    ) {
      if (item?.user_id === data?.user_id) {
        return data;
      }
    } else if (
      data?.entity_type === Verbs.entityTypeClub ||
      data?.entity_type === Verbs.entityTypeTeam
    ) {
      if (item?.group_id === data?.group_id) {
        return data;
      }
    }
    return item;
  });

  await authContext.setentityList(updatedManagedEntities);
};

export const calculateReviewPeriod = (item = {}, reviews = []) => {
  let isOpponentReview = true;
  let isRefereeReview = true;
  let isScorekeeperReview = true;
  const obj = {
    isReviewPeriodEnd: false,
    isReplyToReviewPeridEnd: false,
  };
  reviews.forEach((ele) => {
    const reviewObj = JSON.parse(ele.object)?.playerReview;
    isOpponentReview = reviewObj?.member === Verbs.entityTypeOpponent;
    isRefereeReview = reviewObj?.member === Verbs.entityTypeReferee;
    isScorekeeperReview = reviewObj?.member === Verbs.entityTypeScorekeeper;
  });

  const isAllReviewCompleted =
    isOpponentReview && isRefereeReview && isScorekeeperReview;

  const matchEndTime = moment(
    getJSDate(item.game.data?.end_time).getTime(),
  ).format('l');
  const today = moment().format('l');
  const diff = moment(today).diff(matchEndTime, 'days');

  obj.isReviewPeriodEnd = diff > 5 || isAllReviewCompleted;
  obj.isReviewPeriodEnd = diff > 0 && diff <= 7;

  return obj;
};

export const getRatingsOptions = (
  authContext,
  sport,
  entityType = Verbs.entityTypePlayer,
) => {
  const obj = authContext.sports.find((item) => item.sport === sport);

  if (obj) {
    let properties = [];
    if (entityType === Verbs.entityTypePlayer) {
      properties = obj.player_review_properties ?? [];
    }
    if (entityType === Verbs.entityTypeScorekeeper) {
      properties = obj.scorekeeper_review_properties ?? [];
    }
    if (entityType === Verbs.entityTypeReferee) {
      properties = obj.referee_review_properties ?? [];
    }

    const list = properties.map((item) => {
      const option = {
        name: item.name,
        title: item.title,
        details: item.details,
      };
      return option;
    });

    return list ?? [];
  }
  return [];
};

export const groupBy = (array, key) =>
  array.reduce((result, currentValue) => {
    (result[currentValue[key]] = result[currentValue[key]] || []).push(
      currentValue,
    );
    return result;
  }, {});
export const getPrivacyValue = (option, authContext) => {
  const entity = authContext.entity.obj;
  switch (option) {
    case strings.inviteToDoubleTeamTitle:
      return entity.who_can_invite_for_doubles_team ?? 1;

    case strings.canTeamInviteYou:
      return entity.who_can_invite_for_team ?? 1;

    case strings.canClubInviteYou:
      return entity.who_can_invite_for_club ?? 1;

    case strings.whoCanInviteYouToEvent:
      return entity.invite_me_event ?? 1;

    default:
      return 0;
  }
};

export const onLogout = async (authContext) => {
  try {
    await firebase.auth().signOut();
    await authContext.clearAuthContext();
    await removeFBToken(authContext);
    await clearStorage();
  } catch (error) {
    console.log('error==>', error);
  }
};

export const getPostData = (post = {}) => {
  if (typeof post.object === 'string') {
    const obj = JSON.parse(post.object);
    return {...obj};
  }
  return {};
};

export const getClubRegisterSportsList = (authContext) => {
  const clubSports = authContext.entity.obj.sports.map((obj) => ({
    ...obj,
    sport_name: getSportName(obj, authContext),
  }));
  return clubSports;
};
export const prepareTagName = (data = {}) => {
  let tagName = '';
  if (data.group_name) {
    tagName = _.startCase(_.toLower(data.group_name))?.replace(/ /g, '');
  } else {
    const fName = _.startCase(_.toLower(data.first_name))?.replace(/ /g, '');
    const lName = _.startCase(_.toLower(data.last_name))?.replace(/ /g, '');
    tagName = `${fName}${lName}`;
  }

  return `@${tagName} `;
};
export const calculateRatio = (sportsLength) => {
  if (sportsLength === 2) {
    return 1.3;
  }
  if (sportsLength === 3) {
    return 1.5;
  }
  if (sportsLength === 4) {
    return 1.7;
  }
  return 1.8;
};

export const getNumberFromCurrency = (value) => {
  const temp = value.replace(/[^0-9.-]+/g, '');
  const fee = parseFloat(temp);
  return fee ?? 0;
};

export const formatCurrency = (value, currency) => {
  const temp = value.replace(/[^0-9.-]+/g, '');
  const fee = parseFloat(temp);
  const formattedNumber = fee.toLocaleString('en-US', {
    style: 'currency',
    currency,
  });

  return formattedNumber;
};
