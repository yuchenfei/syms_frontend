import { stringify } from 'qs';
import request from '../utils/request';
import config from '../config';

export async function fetch(params) {
  return request(`${config.domain}/api/feedback/?${stringify(params)}`);
}

export async function remove(id) {
  return request(`${config.domain}/api/feedback/${id}/`, {
    method: 'DELETE',
  });
}
