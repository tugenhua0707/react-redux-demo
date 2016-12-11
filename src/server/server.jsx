import express from 'express'
import http from 'http';
import path from 'path'
import compression from 'compression'
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
// import morgan from 'morgan';

import React from 'react'
import ReactDOMServer from 'react-dom/server'
import { Provider } from 'react-redux';
// import { createStore } from 'redux';
import { browserHistory, RouterContext, match } from 'react-router';

const configureStore = require('../client/app/store/configureStore').default;
const createRoutes = require('../client/app/routes').default;
const services = require('../client/app/services').default;
const {
  TOKEN_SET
} = require('../client/app/constants/ActionTypes').default;

const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 7012

if (process.env.NODE_ENV === 'production') {
  app.use(compression());
  // xss
  app.use(helmet.xssFilter());
  // hide powerd body
  app.use(helmet.hidePoweredBy());
  // X-Content-Type-Options 以防止攻击者以 MIME 方式嗅探浏览器发出的响应中声明的 content-type
  app.use(helmet.noSniff());
} else {
  // account log
  // server.use(morgan('combined', {stream: accessLogStream}));
}

app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'pug');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('*', (req, res, next) => {
  res.locals['env'] = process.env.NODE_ENV;
  next();
});

if (process.env.NODE_ENV === undefined || process.env.NODE_ENV !== 'production') {
  var webpack = require('webpack');
  var config = require('../../webpack.config');
  var compiler = webpack(config);
  app.use(require('webpack-dev-middleware')(compiler, {
    noInfo: true,
    publicPath: config.output.publicPath
  }));

  app.use(require('webpack-hot-middleware')(compiler));
  var reload = require('reload');
  reload(server, app);
  app.use('/static', express.static(path.join(__dirname, '../../dist/client')));
} else {
  app.use('/static', express.static(path.join(__dirname, 'static')));
}

app.get('*', (req, res, next) => {
  res.locals['env'] = process.env.NODE_ENV;
  var store = configureStore();
  var tokenKey = 'JSESSIONID';
  var tokenValue = null;
  for (var key in req.cookies) {
    if (key === tokenKey) {
      tokenValue = req.cookies[key];
    }
  }
  if (tokenValue !== null) {
    store.dispatch({
      type: TOKEN_SET,
      token: tokenValue
    })
  }
  const routes = createRoutes(browserHistory, store.getState());

  match({ routes, location: req.url }, (error, redirectLocation, renderProps) => {
    if (error) {
      //res.status(500).send(error.message)
      res.redirect(302, "/login")
    } else if (redirectLocation) {
      res.redirect(302, redirectLocation.pathname + redirectLocation.search)
    } else if (renderProps) {
      var exec = function() {
        try {
          const html = ReactDOMServer.renderToString(
            <Provider store={store}>
               { <RouterContext {...renderProps}/> }
            </Provider>
          );
          console.log('html');
          console.log(html);
          console.log(store.getState());
          res.render('home', {
            __HTML__: html,
            __REDUX_STATE__: store.getState()
          });
        } catch (e) {
          next(e);
        }
       // res.status(200).send(renderToString(<RouterContext {...renderProps} />))
      };
      var initParm = req.query;
      var module = renderProps.location.pathname.replace(/\//g, '');
      module = module ? module : 'home';
      try {
        if (services[module] === undefined || services[module].req.index === undefined) {
          exec();
        } else {

          // 测试代码
          var data = {
            "code": 0,
            "data": {
              "liked": false,  
              "joinCount": 0,  
              "joinList":["","group2/M00/00/AE/wKgBs1eXX_2AKNxWAABWVmkYaBM467.jpg"],
              "topic": {
                "content": "啊啊啊啊啊",  
                "icon": "1",
                "id": 1,          
                "postId": 1,      
                "likedCount": 0,  
                "name": "今天的天气不错啊！",   
                "publishTime": "2016-11-03 14:33:55",
                "replyCount": 0,     
                "status": 1
              },
              "topicOptionList": [
                {
                  "id": 2,
                  "option": "错",
                  "orde": 1,
                  "status": 0,
                  "topicId": 1,
                  "voteCount": 0,
                  "voted":false
                }
              ]
            }
          }
          if (data.code === 0) {
            initParm.type = module.toUpperCase() + '_INIT_SUCCESS';
            initParm.data = data.data;
          } else {
            initParm.type = module.toUpperCase() + '_INIT_FAIL';
            initParm.error = data.errorMsg;
            initParam.code = data.code;
          }
          console.log(initParm);
          store.dispatch(initParm);
          exec();
          /*
          services[module].req.index(initParm, req.headers, true, true, false).then(data => {
            if (data.code === 0) {
              initParm.type = module.toUpperCase() + '_INIT_SUCCESS';
              initParm.data = data.data;
            } else {
              initParm.type = module.toUpperCase() + '_INIT_FAIL';
              initParm.error = data.errorMsg;
              initParam.code = data.code;
            }
            store.dispatch(initParm);
            exec();
          }, error => {
            console.log(error)
            next(error);
          });
          */
        }
      } catch (e) {
        next(e);
      }
    } else {
      res.status(404).render('error/404', {});
    }
  })
});
// 404
app.use((req, res, next) => {
  res.status(404).render('error/404', {});
});

// 5xx
app.use((err, req, res, next) => {
  res.status(500).render('error/5xx', { err: err });
});

console.log(`Server is listening to port: ${port}`);
server.listen(port)