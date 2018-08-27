import * as thinkingService from '../services/thinking';

export default {
  namespace: 'thinking',

  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(thinkingService.fetch, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *create({ payload: values }, { call, put }) {
      yield call(thinkingService.create, values);
      yield put({ type: 'reload' });
    },
    *patch(
      {
        payload: { id, formData },
      },
      { call, put }
    ) {
      yield call(thinkingService.patch, id, formData);
      yield put({ type: 'reload' });
    },
    *remove({ payload: id }, { call, put }) {
      yield call(thinkingService.remove, id);
      yield put({ type: 'reload' });
    },
    *reload(action, { put }) {
      yield put({ type: 'thinking/fetch' });
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
