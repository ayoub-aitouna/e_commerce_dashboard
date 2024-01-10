import React from 'react';
import ReactDOM from 'react-dom';
import './assets/css/App.css';
import { HashRouter, Route, Switch, Redirect } from 'react-router-dom';
import AuthLayout from './layouts/auth';
import AdminLayout from './layouts/admin';
import { ChakraProvider } from '@chakra-ui/react';
import theme from './theme/theme';
import Cookies from 'universal-cookie';
import { jwt_cockies_name } from 'variables/Api';
const App = () => {
	const cookies = new Cookies(null, { path: '/' });
	const AccessToken = cookies.get(jwt_cockies_name);

	return (<ChakraProvider theme={theme}>
		<React.StrictMode>
			<HashRouter>
				<Switch>
					<Route path={`/auth`} component={AuthLayout} />
					<Route path={`/admin`} component={AdminLayout} />

					<Redirect from='/' to={AccessToken ? 'admin' : '/auth'} />

				</Switch>
			</HashRouter>
		</React.StrictMode>
	</ChakraProvider>);
}

ReactDOM.render(
	<App />,
	document.getElementById('root')
);
