import { HYDRATE } from "next-redux-wrapper";

export const updateAccount = (acc)=>{
    return{
      type:'update_account',
      acc,
    }
  }
  
  const defaultAcc = '';
  
  const account = (state = defaultAcc, action) => {
    if (action.type === HYDRATE) {
      const nextState = {
        ...state, // use previous state
        ...action.payload, // apply delta from hydration
      };
      return nextState;}
      else{
        switch (action.type) {
          case 'update_account':
            return action.acc;
          default:
            return state;
      }
    
    }
    
  };

  export default account;