import { useRef } from 'react';

const useRenderCount = (title = '') => {
    const render = useRef(1);
    // eslint-disable-next-line no-plusplus
    return console.log(`${title} Render Count : `, (render.current++))
}

export default useRenderCount;
