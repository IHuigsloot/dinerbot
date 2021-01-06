import axios from "axios";

const setAuthUser = email => {
  if (email) {
    // Apply authorization token to every request if logged in
    axios.defaults.headers.common["user"] = email;
  } else {
    // Delete auth header
    delete axios.defaults.headers.common["user"];
  }
};
export default setAuthUser;
