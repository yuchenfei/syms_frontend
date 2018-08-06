import * as courseService from '../services/course';

export default {
  namespace: 'course',

  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(courseService.fetch, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *create({ payload: values }, { call, put }) {
      yield call(courseService.create, values);
      yield put({ type: 'reload' });
    },
    *patch(
      {
        payload: { id, values },
      },
      { call, put }
    ) {
      yield call(courseService.patch, id, values);
      yield put({ type: 'reload' });
    },
    *remove({ payload: id }, { call, put }) {
      yield call(courseService.remove, id);
      yield put({ type: 'reload' });
    },
    *reload(action, { put }) {
      yield put({ type: 'course/fetch' });
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        data: { list: action.payload },
      };
    },
  },
};
