import * as React from 'react';
import { ToastContainer } from 'react-toastify';
import CssBaseline from '@material-ui/core/CssBaseline';

const App = () => (
    <React.Fragment>
        <CssBaseline />
        <ToastContainer hideProgressBar pauseOnHover={false} />
    </React.Fragment>
);

export default App;
