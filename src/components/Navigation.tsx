import React, { FunctionComponent } from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import HomeIcon from '@material-ui/icons/Home';
import BlockIcon from '@material-ui/icons/CropSquare';
import BlockIcon2 from '@material-ui/icons/CenterFocusStrong';
import { Link as RouterLink } from 'react-router-dom';
import logo from '../assets/logo.svg';

const navigationMenu = [
	{
		text: 'Home',
		path: '/',
		icon: <HomeIcon />
	},
	{
		text: 'Block',
		path: '/block',
		icon: <BlockIcon />
	},
	{
		text: 'Block Hash',
		path: '/block/00000000000000000005ca55a40c80213c61e5dfc6a5c2d6d38263303ead1468',
		icon: <BlockIcon2 />
	}
];

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		root: {
			display: 'flex',
		},
		logo: {
			height: '32px'
		},
		drawer: {
			width: 250,
		},
		menuButton: {
			marginRight: theme.spacing(2),
		},
		drawerHeader: {
			display: 'flex',
			alignItems: 'center',
			padding: theme.spacing(0, 1),
			...theme.mixins.toolbar,
			justifyContent: 'flex-end',
		},
		content: {
			flexGrow: 1,
			padding: theme.spacing(3),
			transition: theme.transitions.create('margin', {
				easing: theme.transitions.easing.sharp,
				duration: theme.transitions.duration.leavingScreen,
			}),
		},
	}),
);

const App: FunctionComponent = ({children}) => {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => {
	setOpen(true);
  };

  const handleDrawerClose = () => {
	setOpen(false);
  };

  	return (
		<div className={classes.root}>
		<CssBaseline />
		<AppBar
			position="fixed"
		>
			<Toolbar>
			<IconButton
				color="inherit"
				aria-label="open drawer"
				onClick={handleDrawerOpen}
				edge="start"
				className={classes.menuButton}
			>
				<MenuIcon />
			</IconButton>
			<RouterLink to="/">
				<img className={classes.logo} src={logo} alt="VALR logo"></img>
			</RouterLink>
			</Toolbar>
		</AppBar>
			<Drawer open={open} onClose={handleDrawerClose}>
				<div className={classes.drawer}>
					<List>
						{navigationMenu.map((item, index) => (
							<RouterLink className="no-decorate link-text-subtle" onClick={handleDrawerClose} to={item.path} key={item.path}>
								<ListItem button>
									<ListItemIcon>{item.icon}</ListItemIcon>
									<ListItemText primary={item.text} />
								</ListItem>
							</RouterLink>
						))}
					</List>
				</div>
			</Drawer>
			<main className={classes.content}>
				<div className={classes.drawerHeader} />
				{children}
			</main>
		</div>
  	);
}

export default App;