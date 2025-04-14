import axios from "axios";
import Cookies from "js-cookie";

const instance = axios.create({
    baseURL: process.env.NEXT_LOCAL_BASEURL,
});

let token = Cookies.get("token");
if (token) {
    instance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

instance.interceptors.request.use((config) => {
    const sessionId = Cookies.get("cart_session");
    if (sessionId) {
        config.headers["X-Session-Id"] = sessionId;
    }

    if (
        typeof window !== "undefined" &&
        config.data instanceof FormData
    ) {
        config.headers["Content-Type"] = "multipart/form-data";
    }

    return config;
});

export default instance;
