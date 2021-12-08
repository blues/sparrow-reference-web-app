import { Form } from "antd";
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
  onFinish: (values: any) => void;
  onFinishFailed: (values: any) => void;
}) => {
  const [form] = Form.useForm();
  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={(values) => onFinish(values)}
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
