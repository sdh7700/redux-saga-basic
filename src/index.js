import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { applyMiddleware, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import logger from 'redux-logger';
import App from './App';
import rootReducer, { rootSaga } from './modules';
import ReduxThunk from 'redux-thunk';
import { Router } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import createSagaMiddleware from 'redux-saga';

const customHistory = createBrowserHistory();
const sagaMiddleware = createSagaMiddleware({
  context: {
    history: customHistory
  }
}); // saga 미들웨어 생성

const store = createStore(
  rootReducer,
  // logger 사용 시, logger 가 마지막에 와야 한다.
  composeWithDevTools(
    applyMiddleware(
      ReduxThunk.withExtraArgument({ history: customHistory }),
      sagaMiddleware, // 사가 미들웨어 적용하고
      logger
    )
  )
); // 여러개의 미들웨어 적용 가능

sagaMiddleware.run(rootSaga);// 루트사가 실행
// 주의 : 스토어 생성이 된 다음에 위 코드를 실행해야 함

ReactDOM.render(
  <Router history={customHistory}>
    <Provider store={store}>
      <App />
    </Provider>
  </Router>,
  document.getElementById('root')
);