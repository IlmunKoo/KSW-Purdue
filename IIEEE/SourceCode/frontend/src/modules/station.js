import { createAction, handleActions } from 'redux-actions';

//액션 타입 정의
const SETID = 'station/SETID';

//액션 생성 함수
export const setId = createAction(SETID);

//리듀서
const initialState = {
  id: null,
};

const station = handleActions(
  {
    [SETID]: (state, action) => ({ ...state, id: action.payload }),
  },
  initialState
);

export default station;
