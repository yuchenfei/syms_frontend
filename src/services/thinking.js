import { stringify } from 'qs';
import request from '../utils/request';
import config from '../config';

export async function fetch(params) {
  return request(`${config.domain}/api/thinking/?${stringify(params)}`);
}

export async function remove(id) {
  return request(`${config.domain}/api/thinking/${id}/`, {
    method: 'DELETE',
  });
}
