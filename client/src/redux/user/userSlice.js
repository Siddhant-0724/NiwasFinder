import { createSlice, } from "@reduxjs/toolkit";

const initialState={
    currentUser:null,
    error:null,
    loading:false
}

const userSlice = createSlice({
    name:'user',
    initialState,
    reducers:{
        signInStart:(state)=>{
            state.loading = true;
        },
        signInSuccess:(state,action)=>{
            state.currentUser=action.payload;
            state.loading=false;
            state.error=null;
        },
        signInFailure:(state,action) => {
            state.error=action.payload;
            state.loading=false;
        },
        updateUserStart:(state)=>{
            state.loading = true;
        },
        updateUserSucess:(state,action)=>{
            state.currentUser=action.payload;
            state.loading=false;
            state.error=null;
        },
        updateUserFaliure:(state,action)=>{
            state.error=action.payload;
            state.loading=false;
        },deleteUserStart:(state)=>{
            state.loading = true;
        },
        deleteUserSucess:(state)=>{
            state.currentUser=null;
            state.loading=false;
            state.error=null;
        },
        deleteUserFaliure:(state,action)=>{
            state.error=action.payload;
            state.loading=false;
        },signoutUserStart:(state)=>{
            state.loading = true;
        },
        signoutUserSucess:(state)=>{
            state.currentUser=null;
            state.loading=false;
            state.error=null;
        },
        signoutUserFaliure:(state,action)=>{
            state.error=action.payload;
            state.loading=false;
        }

    }
})

export const {signInStart,signInSuccess,signInFailure ,updateUserFaliure,updateUserStart,updateUserSucess,deleteUserFaliure,deleteUserStart,deleteUserSucess,signoutUserFaliure,signoutUserStart,signoutUserSucess} = userSlice.actions;

export default userSlice.reducer;