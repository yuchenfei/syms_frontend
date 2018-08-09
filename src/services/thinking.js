import { stringify } from 'qs';
import request from '../utils/request';

export async function fetch(params) {
  return request(`/api/thinking/?${stringify(params)}`);
}

export async function remove(id) {
  return request(`/api/thinking/${id}/`, {
    method: 'DELETE',
  });
}
