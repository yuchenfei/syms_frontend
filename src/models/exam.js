import * as examService from '../services/exam';

export default {
  namespace: 'exam',

  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(examService.fetch, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *create({ payload: values }, { call }) {
      yield call(examService.create, values);
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
