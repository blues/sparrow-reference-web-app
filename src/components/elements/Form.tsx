import { Form } from "antd";
import { Store } from "antd/lib/form/interface";
import { ValidateErrorEntity } from "rc-field-form/lib/interface";
import styles from "../../../styles/Form.module.scss";

export interface FormProps {
  label?: string;
  tooltip?: string;
  name?: string;
  contents: JSX.Element;
}

const FormComponent = ({
  formItems,
  onFinish,
  onFinishFailed,
}: {
  formItems: FormProps[];
  onFinish: (values: Store) => void;
  onFinishFailed: (values: ValidateErrorEntity) => void;
}) => {
  const [form] = Form.useForm();
  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={(values: Store) => onFinish(values)}
      onFinishFailed={(values) => onFinishFailed(values)}
    >
      {formItems.map((formItem) => (
        <Form.Item
          key={formItem.label}
          label={formItem.label}
          name={formItem.name}
          tooltip={formItem.tooltip}
          className={styles.formLabel}
        >
          {formItem.contents}
        </Form.Item>
      ))}
    </Form>
  );
};

export default FormComponent;
