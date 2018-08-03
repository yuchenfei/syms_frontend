import { stringify } from 'qs';
import request from '../utils/request';

export async function fetch(params) {
  return request(`/api/users/?${stringify(params)}`);
}

export async function fetchCurrent() {
  return request('/api/currentUser');
}

export async function create(values) {
  return request('/api/users/', {
    method: 'POST',
    body: JSON.stringify(values),
  });
}

export async function patch(id, values) {
  return request(`/api/users/${id}/`, {
    method: 'PATCH',
    body: JSON.stringify(values),
  });
}

export async function remove(id) {
  return request(`/api/users/${id}/`, {
    method: 'DELETE',
  });
}
