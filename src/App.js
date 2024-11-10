import './App.css';
import { Routes, Route, Navigate, BrowserRouter } from 'react-router-dom';
import LoginPage from './view/login/Login'
import UserPage from './view/user/list/UserPage';
import UserDetailPage from './view/user/detail/UserDetailPage';
import CreateMemberForm from './view/user/create/CreateUser';
import EditMemberForm from './view/user/edit/EditUser';
import { CommonLayout, FooterLayout, MenuLayout } from './component/Layout';
import './App.css'; // Import the CSS file

function App() {
  const userData = JSON.parse(localStorage.getItem('userData'));

  const memberType = userData?.memberType;
  const isUserStorageItem = memberType === 'userStorageItem';
  const isUserWo = memberType === 'userWo';

  const isUserAuthenticated = userData !== null && userData !== 'undefined' && userData !== undefined;
  const isAdmin = memberType === 'admin';


  const AuthenticatedRoutes = () => (
    <Routes>
      <Route
        path="/"
        element={
              <>
             {isAdmin ? <MenuLayout><UserPage /></MenuLayout> : <CommonLayout>
              <UserDetailPage />
            </CommonLayout>}
             </>
          
        }
      />
      {isAdmin && (
      <>
        <Route
          path="/user/:idUser"
          element={
            <CommonLayout>
              <UserDetailPage />
            </CommonLayout>
          }
        />
        <Route
          path="/create/user"
          element={
            <CommonLayout>
              <CreateMemberForm />
            </CommonLayout>
          }
        />
        <Route
          path="/edit/user/:idUser"
          element={
            <CommonLayout>
              <EditMemberForm />
            </CommonLayout>
          }
        />
      </>
    )}
      <Route path="*" element={<Navigate replace to="/" />} />
    </Routes>
  );

  const UnauthenticatedRoutes = () => (
    <FooterLayout>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<Navigate replace to="/login" />} />
      </Routes>
    </FooterLayout>
  );

  return (
    <BrowserRouter>
      {isUserAuthenticated ? <AuthenticatedRoutes /> : <UnauthenticatedRoutes />}
    </BrowserRouter>
  );
};

export default App;
