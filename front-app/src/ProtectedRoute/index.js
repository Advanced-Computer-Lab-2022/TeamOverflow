import { connect } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

export const ProtectedRoute = ({ auth, allowed }) => {
  var role = auth?.token?.split(' ')[0];
  
  return (
    allowed.includes(role) ? (
      <Outlet/>
    ) : (
      <Navigate to="/"/>
    )
  );
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(ProtectedRoute);
