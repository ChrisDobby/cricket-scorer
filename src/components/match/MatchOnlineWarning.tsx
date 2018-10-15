import * as React from 'react';
import WithModal from '../WithModal';

interface MatchOnlineWarningProps {
    login: () => void;
    doNotLogin: () => void;
}

const buttonStyle: React.CSSProperties = {
    marginLeft: '10px',
    marginRight: '10px',
};

export default WithModal(({ login, doNotLogin }: MatchOnlineWarningProps) => (
    <div className="alert alert-dark" style={{ width: '100%' }}>
        <h4 className="alert-heading">Back online</h4>
        <p>You are now connected to the internet and are able to login.</p>
        <p>
            {'If you do not login you can continue to score the match however the score will not appear ' +
                'on the live site and it is possible the match will get deleted if you create a new one.'}
        </p>
        <hr />
        <button
            className="btn btn-dark"
            style={buttonStyle}
            onClick={login}
        >Login
        </button>
        <button
            className="btn btn-dark"
            style={buttonStyle}
            onClick={doNotLogin}
        >Do not login
        </button>
    </div>
));
