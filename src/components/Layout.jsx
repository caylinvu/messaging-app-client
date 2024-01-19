import { Outlet } from 'react-router-dom';

function Layout() {
  return (
    <div className="main-app">
      <div className="sidebar">SIDEBAR</div>
      <Outlet />
    </div>
  );
}

export default Layout;
