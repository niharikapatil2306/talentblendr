const initialState = {
    user: null,
};

const userReducer = (state = initialState, action) => {
    switch(action.type){
        case 'SET_USER':
            return { 
                ...state, 
                user: action.payload 
            };
        case 'RESET_STATE':
            return initialState;
        default:
            return state;
    }
}

export default userReducer;

