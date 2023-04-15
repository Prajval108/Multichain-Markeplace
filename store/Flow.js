import { HYDRATE } from "next-redux-wrapper";

export const UpdateFlow = (acc)=>{
    return{
      type:'updateflow',
      acc,
    }
  }
  
  const defaultAcc = '';
  
  const flow = (state = defaultAcc, action) => {
    if (action.type === HYDRATE) {
      const nextState = {
        ...state, // use previous state
        ...action.payload, // apply delta from hydration
      };
      return nextState;}
      else{
        switch (action.type) {
          case 'updateflow':
            return action.acc;
          default:
            return state;
      }
    
    }
    
  };

  export default flow;