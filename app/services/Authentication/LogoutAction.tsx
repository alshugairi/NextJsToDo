 export const LogoutAction = (states: any) => {
  states.token = null;
  typeof localStorage  !== "undefined"  && localStorage.removeItem("token")

  };
