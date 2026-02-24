export const isTokenExpired = () => {
  const token = localStorage.getItem("token");

  if (!token) return true;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const currentTime = Date.now() / 1000;

    return payload.exp < currentTime;
  } catch (error) {
    return true;
  }
};