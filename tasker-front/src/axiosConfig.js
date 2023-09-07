import axios from 'axios';
import Cookies from 'js-cookie';

const csrfToken = Cookies.get('csrftoken');
axios.defaults.withCredentials = true;
axios.defaults.headers.post['X-CSRFToken'] = csrfToken;
