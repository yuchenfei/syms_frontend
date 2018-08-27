import { stringify } from 'qs';
import request from '../utils/request';
import config from '../config';

export async function fetch(params) {
  return request(`${config.domain}/api/file/?${stringify(params)}`);
}

export async function create(values) {
  return request(`${config.domain}/api/file/`, {
    method: 'POST',
    body: values,
  });
}

export async function patch(id, values) {
  return request(`${config.domain}/api/file/${id}/`, {
    method: 'PATCH',
    body: values,
  });
}

export async function remove(id) {
  return request(`${config.domain}/api/file/${id}/`, {
    method: 'DELETE',
  });
}
