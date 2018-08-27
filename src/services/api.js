import request from '../utils/request';
import config from '../config';

// My Services
export async function login(params) {
  return request(`${config.domain}/api/login`, {
    method: 'POST',
    body: params,
  });
}

export async function logout() {
  return request(`${config.domain}/api/logout`);
}
