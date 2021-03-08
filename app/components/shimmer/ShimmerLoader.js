import React from 'react';
import BackgroundProfileShimmer from './commonComponents/BackgroundProfileShimmer';

const ShimmerLoader = ({ shimmerComponents = [] }) => (
  <>
    {shimmerComponents.includes('BackgroundProfileShimmer') && <BackgroundProfileShimmer/>}
  </>
    )
export default ShimmerLoader;
