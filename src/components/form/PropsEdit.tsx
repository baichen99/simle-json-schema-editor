import { forwardRef } from "react";
import StringPropsForm from "./StringPropsForm";
import BasicPropsForm from "./BasicPropsForm";

type Props = {
  nodeType: string;
  onSubmit: (data: object) => void;
};
const PropsEdit = forwardRef(({ nodeType, onSubmit }: Props, ref) => {
  if (nodeType === "string") {
    return <StringPropsForm ref={ref} onSubmit={onSubmit} />;
  } else {
    return <BasicPropsForm ref={ref} onSubmit={onSubmit} />;
  }
});

export default PropsEdit;
