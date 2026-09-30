import { useContext } from 'react';

import { ButtonContext } from '../context/button-context';

// ----------------------------------------------------------------------

export function useButtonContext() {
  const context = useContext(ButtonContext);

  if (!context) {
    throw new Error('useButtonContext: Context must be used inside ButtonProvider');
  }

  return context;
}

export default useButtonContext;
