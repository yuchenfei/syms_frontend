import * as fileService from '../services/file';

export default {
  namespace: 'file',

  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(fileService.fetch, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *create({ payload: values }, { call, put }) {
      yield call(fileService.create, values);
      yield put({ type: 'reload' });
    },
    *patch(
      {
        payload: { id, formData },
      },
      { call, put }
    ) {
      yield call(fileService.patch, id, formData);
      yield put({ type: 'reload' });
    },
    *remove({ payload: id }, { call, put }) {
      yield call(fileService.remove, id);
      yield put({ type: 'reload' });
    },
    *reload(action, { put }) {
      yield put({ type: 'file/fetch' });
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
