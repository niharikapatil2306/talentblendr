export const setUser = (userData) => {
    return {
      type: 'SET_USER',
      payload: userData,
    };
  };

  export const resetState = () => ({
    type: 'RESET_STATE',
  });