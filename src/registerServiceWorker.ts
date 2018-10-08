const Register = () => {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker
            .register('/service-worker.js')
            .then(() => console.info('service worker registered'))
            .catch(error => console.log('error registering service worker ', error));
    }
};

export default Register;
