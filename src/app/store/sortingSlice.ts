import { createSlice } from '@reduxjs/toolkit';
import { RootState } from './store';

export const sortingSlice = createSlice({
  name: 'sorting',
  initialState: {
    value: []
  },
  reducers: {
    setSorting: (state, action) => {
      state.value = action.payload;
    }
  },
});

export const { setSorting } = sortingSlice.actions;

export const selectSorting = (state:RootState) => state.sorting.value;

export default sortingSlice.reducer;