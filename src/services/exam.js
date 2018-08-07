import { stringify } from 'qs';
import request from '../utils/request';

export async function fetch(params) {
  return request(`/api/exam/?${stringify(params)}`);
}

export async function create(values) {
  return request('/api/exam/', {
    method: 'POST',
    body: JSON.stringify(values),
  });
}
