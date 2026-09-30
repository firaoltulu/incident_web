import { useMemo } from 'react';

import { useGetButtons } from 'src/actions/workflow';

import { ButtonContext } from './button-context';

// ----------------------------------------------------------------------

export function ButtonProvider({ children }) {
    const { buttons, buttonsLoading, buttonsError, buttonsValidating, buttonsEmpty } = useGetButtons();

    const memoizedValue = useMemo(
        () => ({
            buttons, buttonsLoading, buttonsError, buttonsValidating, buttonsEmpty
        }),
        [buttons, buttonsLoading, buttonsError, buttonsValidating, buttonsEmpty]
    );

    return <ButtonContext.Provider value={memoizedValue}>{children}</ButtonContext.Provider>;
}

// export default WorkflowProvider;
