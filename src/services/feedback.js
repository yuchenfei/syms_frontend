import { stringify } from 'qs';
import request from '../utils/request';

export async function fetch(params) {
  return request(`/api/feedback/?${stringify(params)}`);
}

export async function remove(id) {
  return request(`/api/feedback/${id}/`, {
    method: 'DELETE',
  });
}
