// import 'react-devtools'
import React from 'react'
import ReactDOM from 'react-dom'
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles'
import indigo from 'material-ui/colors/indigo'
import teal from 'material-ui/colors/teal'
import {
  HashRouter as Router,
  Route,
  hashHistory,
  Switch
} from 'react-router-dom'
import { Provider } from 'react-redux'
import idbKeyval from 'idb-keyval'
import thunk from 'redux-thunk'
import { createStore, applyMiddleware } from 'redux'
import appReducer from './reducers'
import { loadMessages } from './pages/feedback/actions'
import FeedbackPage from './pages/feedback/feedback'
import LogsPage from './pages/logs/logs'
import globalSf from './global-sf'
import './app.css'

class App extends React.Component {
  componentWillMount() {
    this.props.store.dispatch(loadMessages())
    navigator.storage.estimate().then(usageData => {
      if (usageData.usage / usageData.quota > 0.1) {
        idbKeyval.clear()
      }
    })
  }

  render() {
    return (
      <Router history={hashHistory}>
        <Switch>
          <Route path="/logs" render={ownProps => <LogsPage {...ownProps} />} />
          <Route
            exact
            path="/feedback"
            render={ownProps => <FeedbackPage {...ownProps} />}
          />
          <Route render={ownProps => <LogsPage {...ownProps} />} />
        </Switch>
      </Router>
    )
  }
}

const theme = createMuiTheme({
  palette: {
    primary: teal,
    secondary: indigo
    // type: 'dark'
  }
})

const store = createStore(
  appReducer,
  applyMiddleware(thunk.withExtraArgument(globalSf))
)

// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// window._store = store
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!1

const ProvidedApp = () => (
  <MuiThemeProvider theme={theme}>
    <Provider store={store}>
      <App store={store} />
    </Provider>
  </MuiThemeProvider>
)

ReactDOM.render(<ProvidedApp />, document.getElementById('container'))
