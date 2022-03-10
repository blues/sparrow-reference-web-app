import { Button, Col, Card, Form, Input, Row } from "antd";
import { CheckOutlined, CloseOutlined, EditOutlined } from "@ant-design/icons";
import React, { useState } from "react";
import NodeCard from "./NodeCard";
import { ERROR_MESSAGE } from "../../constants/ui";
import GatewayDetailViewModel from "../../models/GatewayDetailViewModel";
import styles from "../../styles/Home.module.scss";
import detailsStyles from "../../styles/Details.module.scss";

type GatewayDetailsData = {
  // eslint-disable-next-line react/require-default-props
  err?: string;
  onChangeName: (name: string) => Promise<boolean>;
  viewModel: GatewayDetailViewModel;
};

const GatewayDetails = ({
  err,
  onChangeName,
  viewModel,
}: GatewayDetailsData) => {
  const [isEditingName, setIsEditingName] = useState(false);
  const [isNameErred, setIsNameErred] = useState(false);

  const toggleEditingName = () => {
    setIsEditingName(!isEditingName);
  };
  type NameFormData = { name: string };
  const onNameFinish = async (values: NameFormData) => {
    const { name } = values;
    const result = await onChangeName(name);
    setIsNameErred(!result);
    if (result) {
      setIsEditingName(false);
    }
  };

  return (
    <>
      {err && <h2 className={styles.errorMessage}>{err}</h2>}

      {viewModel.gateway && (
        <div>
          <h2
            data-testid="gateway-details-header"
            className={`${styles.sectionTitle} ${detailsStyles.editable}`}
          >
            <span>Gateway:</span>
            {!isEditingName && (
              <>
                {viewModel.gateway.serialNumber}
                <Button
                  data-testid="gateway-name-edit-button"
                  type="link"
                  onClick={toggleEditingName}
                  icon={<EditOutlined />}
                />
              </>
            )}
            {isEditingName && (
              <Form
                onFinish={onNameFinish}
                initialValues={{
                  name: viewModel.gateway.serialNumber,
                }}
                layout="inline"
              >
                <Form.Item
                  validateStatus={isNameErred ? "error" : ""}
                  name="name"
                  help={
                    isNameErred
                      ? ERROR_MESSAGE.GATEWAY_NAME_CHANGE_FAILED
                      : null
                  }
                >
                  <Input maxLength={49} required />
                </Form.Item>
                <Button
                  data-testid="gateway-name-submit-button"
                  type="link"
                  htmlType="submit"
                  icon={<CheckOutlined />}
                />
                <Button
                  type="link"
                  onClick={toggleEditingName}
                  icon={<CloseOutlined />}
                />
              </Form>
            )}
          </h2>

          <div className={styles.container}>
            <div
              data-testid="gateway-last-seen"
              className={detailsStyles.timestamp}
            >
              Last seen {viewModel.gateway.lastActivity}
            </div>

            <Row gutter={[16, 16]}>
              <Col xs={12} sm={12} lg={8}>
                <Card className={detailsStyles.card}>
                  <div className={detailsStyles.cardTitle}>Location</div>
                  <span
                    data-testid="gateway-location"
                    className={detailsStyles.dataNumber}
                  >
                    {viewModel.gateway.location}
                  </span>
                </Card>
              </Col>
              <Col xs={12} sm={12} lg={8}>
                <Card className={detailsStyles.card}>
                  <div className={detailsStyles.cardTitle}>Voltage</div>
                  <span className={detailsStyles.dataNumber}>
                    {viewModel.gateway.voltage}
                  </span>
                </Card>
              </Col>
            </Row>

            {viewModel.nodes && viewModel.nodes.length > 0 ? (
              <>
                <h3
                  data-testid="gateway-node-header"
                  className={styles.sectionSubTitle}
                >
                  Nodes
                </h3>
                <Row gutter={[16, 16]}>
                  {viewModel.nodes.map((node, index) => (
                    <Col xs={24} sm={24} lg={12} key={node.nodeId}>
                      <NodeCard index={index} nodeDetails={node} />
                    </Col>
                  ))}
                </Row>
              </>
            ) : (
              <h4 className={styles.errorMessage}>
                {ERROR_MESSAGE.NODES_NOT_FOUND}
              </h4>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default GatewayDetails;
