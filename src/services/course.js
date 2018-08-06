import { stringify } from 'qs';
import request from '../utils/request';

export async function fetch(params) {
  return request(`/api/course/?${stringify(params)}`);
}

export async function create(values) {
  return request('/api/course/', {
    method: 'POST',
    body: JSON.stringify(values),
  });
}

export async function patch(id, values) {
  return request(`/api/course/${id}/`, {
    method: 'PATCH',
    body: JSON.stringify(values),
  });
}

export async function remove(id) {
  return request(`/api/course/${id}/`, {
    method: 'DELETE',
  });
}
