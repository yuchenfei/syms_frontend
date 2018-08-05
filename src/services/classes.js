import { stringify } from 'qs';
import request from '../utils/request';

export async function fetch(params) {
  return request(`/api/classes/?${stringify(params)}`);
}

export async function create(values) {
  return request('/api/classes/', {
    method: 'POST',
    body: JSON.stringify(values),
  });
}

export async function patch(id, values) {
  return request(`/api/classes/${id}/`, {
    method: 'PATCH',
    body: JSON.stringify(values),
  });
}

export async function remove(id) {
  return request(`/api/classes/${id}/`, {
    method: 'DELETE',
  });
}
