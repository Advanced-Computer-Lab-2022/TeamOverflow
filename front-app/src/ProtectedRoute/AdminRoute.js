import { connect } from "react-redux";
import { Route, Navigate } from "react-router-dom";

export const AdminRoute = ({ auth, component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(props) =>
        auth && auth?.role === "Admin" ? (
          <Component {...props}></Component>
        ) : (
          <Navigate replace to="/"></Navigate>
        )
      }
    ></Route>
  );
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(AdminRoute);
