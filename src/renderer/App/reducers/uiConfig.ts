import { createSlice } from '@reduxjs/toolkit';

type Config = { [key: string]: any };

const initialConfig: Config = {
    toolWindowTabPosition: 'bottom',
};

export const uiConfigSlice = createSlice({
    name: 'uiConfig',
    initialState: {
        config: initialConfig,
    },
    reducers: {
        setUIConfigItem: (state, action) => {
            const [key, value]: [string, any] = action.payload;

            const newConfig: Config = { ...state.config };
            newConfig[key] = value;
            state.config = newConfig;
        },
    },
});

export const { setUIConfigItem } = uiConfigSlice.actions;

export default uiConfigSlice.reducer;
