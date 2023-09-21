// axiosConfig.ts
import axios from "axios";
import Cookies from "js-cookie";

const csrfToken: string | undefined = Cookies.get("csrftoken");
axios.defaults.withCredentials = true;
if (csrfToken) {
    axios.defaults.headers.post["X-CSRFToken"] = csrfToken;
}
