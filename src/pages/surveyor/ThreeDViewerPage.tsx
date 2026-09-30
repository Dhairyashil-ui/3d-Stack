import React from 'react';
import { Ppcrc3DView } from '../../ppcrc-3d-view';

export const ThreeDViewerPage: React.FC = () => {
  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <Ppcrc3DView />
    </div>
  );
};

export default ThreeDViewerPage;
