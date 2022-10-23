import { connect } from "react-redux";
import { Route, Navigate } from "react-router-dom";

export const ProtectedRoute = ({ auth, component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(props) =>
        auth && auth?.user ? (
          <Component {...props}></Component>
        ) : (
          <Navigate replace to="/login"></Navigate>
        )
      }
    ></Route>
  );
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(ProtectedRoute);
