import React from 'react' // import React to define and render the UI
import ReactDOM from 'react-dom/client' // import ReactDOM for rendering React components to the DOM
import App from './App.jsx' // import the main App component
import './index.css' // import global CSS file for styles
import { Toaster } from './components/ui/sonner.jsx' // import Toaster component to display toast notifications
import { Provider } from 'react-redux' // import Provider to make Redux store available throughout the app
import store from './redux/store.js' // import configured Redux store
import { PersistGate } from 'redux-persist/integration/react' // import PersistGate to delay rendering until persisted state is rehydrated
import { persistStore } from 'redux-persist' // import persistStore to create a persistor for Redux state persistence

let persistor = persistStore(store) // create a persistor linked to the Redux store for persisting state between sessions

ReactDOM.createRoot(document.getElementById('root')).render( // create a root and render the React app into the DOM element with id 'root'
  <React.StrictMode> {/* enables additional React checks and warnings in development mode */}
    <Provider store={store}> {/* makes Redux store accessible to all nested components */}
      <PersistGate loading={null} persistor={persistor}> {/* delays rendering until persisted state has been loaded */}
        <App /> {/* renders the main App component */}
        <Toaster /> {/* renders toast notification container */}
      </PersistGate>
    </Provider>
  </React.StrictMode>,
)
