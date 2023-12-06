import React from "react";

function PageNotFound() {
  return (
    <div className="d-flex justify-content-center align-items-center vh-100 pb-5 responsive-login-container bg-grey-0">
      <div className="p-3 mb-5 rounded-3 responsive-login bg-grey-1">
        <span
          className="d-flex justify-content-center"
          style={{ fontSize: 72 }}
        >
          😟
        </span>
        <h1
          className="d-flex justify-content-center fw-bold"
          style={{ fontSize: 64 }}
        >
          404
        </h1>
        <h1 className="d-flex justify-content-center">Page Not Found</h1>
        <p className="d-flex justify-content-center text-center">
          The page you are looking for doesn't exist or has been removed
        </p>
      </div>
    </div>
  );
}

export default PageNotFound;
