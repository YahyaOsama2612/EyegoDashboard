import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store";

interface SortingState {
  id: string;
  desc: boolean;
}

interface SortingSliceState {
  value: SortingState[];
}

const initialState: SortingSliceState = {
  value: [],
};

export const sortingSlice = createSlice({
  name: "sorting",
  initialState,
  reducers: {
    setSorting: (state, action: PayloadAction<SortingState[]>) => {
      state.value = action.payload;
    },
    clearSorting: (state) => {
      state.value = [];
    },
  },
});

export const { setSorting, clearSorting } = sortingSlice.actions;

export const selectSorting = (state: RootState) => state.sorting.value;

export default sortingSlice.reducer;
