export default (theme: any) => ({
    rootStyle: {
        marginLeft: theme.spacing.unit * 3,
        marginRight: theme.spacing.unit * 3,
        [theme.breakpoints.up(1100 + theme.spacing.unit * 3 * 2)]: {
            width: 1100,
            marginLeft: 'auto',
            marginRight: 'auto',
        },
    },
    paperStyle: {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
        marginBottom: theme.spacing.unit * 4,
    },
    mainContentStyle: {
        padding: `${theme.spacing.unit * 6}px`,
        [theme.breakpoints.up('md')]: {
            paddingRight: 0,
        },
    },
    toolbar: theme.mixins.toolbar,
    logoStyle: {
        maxHeight: '200px',
        margin: '30px',
    },
    linkStyle: {
        color: theme.palette.primary.contrastText,
    },
    cardStyle: {
        display: 'flex',
    },
    cardDetailsStyle: {
        flex: 1,
    },
    headerStyle: {
        width: '100%',
        padding: `${theme.spacing.unit * 2}px`,
        [theme.breakpoints.up('md')]: {
            paddingRight: 0,
        },
    },
    addButton: {
        marginRight: theme.spacing.unit,
    },
});
