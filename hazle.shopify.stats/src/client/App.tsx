import React, { useEffect, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import { Container } from 'react-bootstrap';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { msalInstance } from './authConfig';
import { AccountInfo } from "@azure/msal-common";
import routes from './routes';
import Sidebar from './components/sidebar';
import Header from './components/header';
import Login from './pages/login';
import Loading from './components/loading';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const tokenRequest = {
    scopes: ['openid', 'profile'],
  };

  const checkLoginStatus = async () => {
    const token = localStorage.getItem('sessionToken');
    const user = localStorage.getItem('userId');

    if (token && user) {
      try {
        const accounts = msalInstance.getAllAccounts();
        const matchingAccount = accounts.find(
          (account) => account.localAccountId === localStorage.getItem('userId')
        );

        if (matchingAccount) {
          await renewToken(matchingAccount, tokenRequest.scopes);
          setIsLoggedIn(true);
        } else {
          handleLogout();
        }
      } catch (error) {
        handleLogout();
      }
    } else {
      handleLogout();
    }
    setIsLoading(false);
  };

  const renewToken = async (account: AccountInfo, requestScopes: string[]): Promise<void> => {
    try {
      const response = await msalInstance.acquireTokenSilent({
        account,
        scopes: requestScopes,
      });

      const newToken = response.idToken;
      localStorage.setItem('sessionToken', newToken);
    } catch (error) {
      handleLogout();
    }
  };

  const handleLogin = (userId: string, userName: string, sessionToken: string) => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('sessionToken');
    setIsLoggedIn(false);
  };

  useEffect(() => {
    const checkDarkTheme = localStorage.getItem('darkTheme') === 'true';

    if (checkDarkTheme) {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
    
    checkLoginStatus();
  }, []);

  return (
    <Router>
      {isLoading ? (
        <Loading />
      ) : isLoggedIn ? (
        <div className="app">
          <Sidebar />
          <Container fluid>
            <Header onLogout={handleLogout} />
            <main>
              <Switch>
                {routes.map((route) => (
                  <Route key={route.name} exact path={route.path}>
                    <route.component />
                  </Route>
                ))}
              </Switch>
            </main>
          </Container>
          <ToastContainer />
        </div>
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </Router>
  );
};

export default App;
