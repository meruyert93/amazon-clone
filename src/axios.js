import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:5001/e-clone-with-react/us-central1/api", // the API (cloud function) url
});

export default instance;
