// src/redux/slices/permissionsSlice.js
import { createSlice } from '@reduxjs/toolkit';

const permissionsSlice = createSlice({
  name: 'permissions',
  initialState: {},
  reducers: {
    setPermissions: (state, action) => action.payload,
    clearPermissions: () => ({}),
  },
});

export const { setPermissions, clearPermissions } = permissionsSlice.actions;
export default permissionsSlice.reducer;
