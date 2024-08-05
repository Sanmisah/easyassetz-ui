import { configureStore, createSlice } from "@reduxjs/toolkit";

const initialState = {
  lifeInsuranceEditId: null,
  lifeInsuranceDeleteId: "",
  SelectedAsset: [],
  BenificiaryAllocation: [],
  level: "",
};

const counterSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {
    setlifeInsuranceEditId(state, action) {
      state.lifeInsuranceEditId = action.payload;
      console.log("lifeInsuranceEditId:", state.lifeInsuranceEditId);
    },
    setlifeInsuranceDeleteId(state, action) {
      state.lifeInsuranceDeleteId = action.payload;
    },
    setSelectedAsset(state, action) {
      state.SelectedAsset = action.payload;
      console.log("SelectedAsset:", state.SelectedAsset);
    },
    setBenificiaryAllocation(state, action) {
      state.BenificiaryAllocation = action.payload;
      console.log("BenificiaryAllocation:", state.BenificiaryAllocation);
    },
    setLevel(state, action) {
      state.level = action.payload;
      console.log("level:", state.level);
    },
  },
});

export const {
  setMessage,
  setlifeInsuranceEditId,
  setlifeInsuranceDeleteId,
  setSelectedAsset,
  setBenificiaryAllocation,
  setLevel,
} = counterSlice.actions;

const store = configureStore({
  reducer: { counterSlice: counterSlice.reducer },
});

export default store;
