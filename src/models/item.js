import * as itemService from '../services/item';

export default {
  namespace: 'item',

  state: {
    items: [],
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(itemService.fetch, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *create({ payload: values }, { call, put }) {
      yield call(itemService.create, values);
      yield put({ type: 'reload' });
    },
    *patch(
      {
        payload: { id, values },
      },
      { call, put }
    ) {
      yield call(itemService.patch, id, values);
      yield put({ type: 'reload' });
    },
    *remove({ payload: id }, { call, put }) {
      yield call(itemService.remove, id);
      yield put({ type: 'reload' });
    },
    *reload(action, { put }) {
      yield put({ type: 'item/fetch' });
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        items: action.payload,
      };
    },
  },
};
