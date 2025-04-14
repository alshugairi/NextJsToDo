import axios, { AxiosInstance } from "axios";
import Cookies from "js-cookie";

console.log(process.env.NEXT_PUBLIC_BASEURL);

const instance: AxiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BASEURL,
});

instance.defaults.headers.common["Accept"] = "application/json";
instance.defaults.headers.post["Content-Type"] = "application/json";
instance.defaults.headers.common["country"] = 1;

instance.defaults.headers.post["Access-Control-Allow-Origin"] = "*";
instance.defaults.headers.post["Access-Control-Allow-Methods"] = "POST, GET, DELETE";
instance.defaults.headers.post["Access-Control-Allow-Headers"] = "x-requested-with, content-type";

instance.interceptors.request.use((config) => {
    const sessionId = Cookies.get("cart_session");
    if (sessionId) {
        config.headers["X-Session-Id"] = sessionId;
    }
    return config;
});

export default instance;
