const PrivateLayout = () => (
  <div style={{ display: 'flex', minHeight: '100vh' }}>
    <Nav />
    <div style={{ flex: 1 }}>
      <Outlet />
    </div>
  </div>
);

export default PrivateLayout;