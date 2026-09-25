import React from "react";

const MyComponent = (props) => {
  const { children } = props;
  return (
    <div>
      <div>My component's upper div</div>
      <div>{children}</div>
    </div>
  );
};

export default MyComponent;
