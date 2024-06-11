import { configureStore, createSlice } from "@reduxjs/toolkit";

const initialState = {
  lifeInsuranceEditId: null,
  lifeInsuranceDeleteId: "",
};

const counterSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {
    setlifeInsuranceEditId(state, action) {
      state.lifeInsuranceEditId = action.payload;
    },
    setlifeInsuranceDeleteId(state, action) {
      state.lifeInsuranceDeleteId = action.payload;
    },
  },
});

export const { setMessage, setlifeInsuranceEditId, setlifeInsuranceDeleteId } =
  counterSlice.actions;

const store = configureStore({
  reducer: { counterSlice: counterSlice.reducer },
});

export default store;
