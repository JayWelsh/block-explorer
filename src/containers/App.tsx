import React from 'react';
import { Router } from 'react-router-dom';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/lib/integration/react';
import { store, persistor } from '../state';
import { configureHistory } from '../utils';
import Navigation from '../components/Navigation';
import OurRouter from "./OurRouter";
import '../App.css';

const history = configureHistory();

const theme = createMuiTheme({
  palette: {
    type: 'light',
    primary: {
      main: '#486DE8'
    },
    text: {
      primary: '#4f5a68',
    },
  }
});

export default function App() {
  return (
    <Router history={history}>
      <Provider store={store}>
          <PersistGate persistor={persistor}>
            <MuiThemeProvider theme={theme}>
              <Navigation>
                <OurRouter />
              </Navigation>
            </MuiThemeProvider>
          </PersistGate>
        </Provider>
    </Router>
  );
}