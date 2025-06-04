import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;

async function login(username, password) {
  try {
    const response = await axios.post(
      `${BASE_URL}/login`,
      {
        username,
        password,
      },
      {
        withCredentials: true,
      }
    );
    if (response.status === 200 && response.data && response.data.accessToken) {
      return true;
    }
    return false;
  } catch (error) {
    console.error("Error logging in:", error);
    throw error;
  }
}

async function register(username, password) {
  try {
    const response = await axios.post(
      `${BASE_URL}/user`,
      {
        username,
        password,
      },
      {
        withCredentials: true,
      }
    );
    return response.status === 201;
  } catch (error) {
    console.error("Error registering:", error);
    throw error;
  }
}

export { login, register };
