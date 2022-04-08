import * as React from "react";

// From https://github.com/vercel/next.js/issues/26749#issuecomment-941952546
const mock = (props: { children: React.ReactElement }): React.ReactElement => {
  return <>{props.children}</>;
};

export default mock;
