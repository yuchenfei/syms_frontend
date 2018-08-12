import { stringify } from 'qs';
import request from '../utils/request';
import config from '../config';

export async function fetch(params) {
  return request(`${config.domain}/api/exam/?${stringify(params)}`);
}

export async function create(values) {
  return request(`${config.domain}/api/exam/`, {
    method: 'POST',
    body: values,
  });
}
