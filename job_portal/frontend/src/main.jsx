import React from 'react' // import React library for JSX
import ReactDOM from 'react-dom/client' // import ReactDOM to render app to DOM
import App from './App.jsx' // import main App component
import './index.css' // import global CSS styles
import { Toaster } from './components/ui/sonner.jsx' // import Toaster component for notifications
import { Provider } from 'react-redux' // import Redux Provider to give app access to store
import store from './redux/store.js' // import Redux store
import { persistStore } from 'redux-persist' // import persistStore to persist Redux store
import { PersistGate } from 'redux-persist/integration/react' // import PersistGate to delay rendering until rehydration

const persistor = persistStore(store); // create persistor instance from Redux store

ReactDOM.createRoot(document.getElementById('root')).render( // render React app into root DOM element
  <React.StrictMode>
    <Provider store={store}> {/* provide Redux store to entire app */}
      <PersistGate loading={null} persistor={persistor}> {/* delay rendering until persisted store has rehydrated */}
        <App /> {/* main app component */}
        <Toaster /> {/* toast notifications component */}
      </PersistGate>
    </Provider>
  </React.StrictMode>,
)
