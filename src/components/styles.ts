export const flexContainerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
};

export const flexFillStyle: React.CSSProperties = {
    flex: '1',
    overflowY: 'auto',
    overflowX: 'hidden',
};

export const headingRow: React.CSSProperties = {
    backgroundColor: 'rgb(233, 236, 239)',
    paddingTop: '4px',
};

export const singleHeadingRow: React.CSSProperties = {
    ...headingRow,
    paddingLeft: '15px',
};

export const spinnerStyle = {
    fontSize: '24px',
};

export const sectionContainer: React.CSSProperties = {
    width: '100%',
    padding: '20px',
    marginBottom: '10px',
};

export const primaryColour: React.CSSProperties = {
    color: '#007bff',
};

export const themedStyles = (theme: any) => ({
    header: {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
        paddingLeft: '5px',
        paddingRight: '5px',
        borderRadius: '4px',
    },
    toolbar: {
        padding: '0 8px',
        ...theme.mixins.toolbar,
    },
});
