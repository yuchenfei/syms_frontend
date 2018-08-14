import { stringify } from 'qs';
import request from '../utils/request';
import config from '../config';

export async function fetch(params) {
  return request(`${config.domain}/api/users/?${stringify(params)}`);
}

export async function fetchCurrent() {
  return request(`${config.domain}/api/currentUser`);
}

export async function setting(values) {
  return request(`${config.domain}/api/setting`, {
    method: 'POST',
    body: values,
  });
}

export async function create(values) {
  return request(`${config.domain}/api/users/`, {
    method: 'POST',
    body: values,
  });
}

export async function patch(id, values) {
  return request(`${config.domain}/api/users/${id}/`, {
    method: 'PATCH',
    body: values,
  });
}

export async function remove(id) {
  return request(`${config.domain}/api/users/${id}/`, {
    method: 'DELETE',
  });
}
