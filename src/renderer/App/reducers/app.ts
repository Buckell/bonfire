import { createSlice } from '@reduxjs/toolkit';

export const appSlice = createSlice({
    name: 'app',
    initialState: {
        selectedChannels: [],
    },
    reducers: {
        setSelectedChannels: (state, action) => {
            state.selectedChannels = action.payload;
        },
    },
});

export const { setSelectedChannels } = appSlice.actions;

export default appSlice.reducer;
