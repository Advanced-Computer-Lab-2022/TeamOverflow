import { notification } from "antd";
import { connect } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

export const ProtectedRoute = ({ auth, allowed }) => {
  var role = auth?.token?.split(' ')[0];
  
  if(role === "Corporate" && !auth?.user?.acceptedTerms) {
    notification.info({message: "Please Accept Terms and Conditions before proceeding"})
    return (<Navigate to={"/Terms"} replace />)
  }

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
