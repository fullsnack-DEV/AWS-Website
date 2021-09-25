// import Config from 'react-native-config';
import makeAPIRequest from '../utils/Global';

import envs from '../../src/config/env';

const { BASE_URL } = envs;

export const GALLERY_TYPE = {
    ALL: 'All',
    FROMME: 'From Me',
    TAGGED: 'Tagged',
}
export const getWholeGallery = (gallery_type, entity_type, entity_id, authContext, last_id) => {
    // Gallery type
    let gal_type = 'gallery';
    if (gallery_type === GALLERY_TYPE.FROMME) gal_type = 'mygallery'
    if (gallery_type === GALLERY_TYPE.TAGGED) gal_type = 'taggedgallery'

    // Entity Type
    let eType = 'players';
    if (entity_type === 'club') eType = 'clubs'
    if (entity_type === 'team') eType = 'teams'
    if (entity_type === 'game') eType = 'games'
    let url = `${BASE_URL}/${eType}/${entity_id}/${gal_type}`;
    if (last_id) url += `?id_lt=${last_id}`

    return makeAPIRequest({
        method: 'get',
        url,
        authContext,
    });
}
