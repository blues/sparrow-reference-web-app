import Sensor from "../models/Sensor";
import Gateway from "../models/Gateway";

// eslint-disable-next-line import/prefer-default-export
export function getCombinedGatewaySensorInfo(
  latestSensorDataList: Sensor[],
  gateways: Gateway[]
): Gateway[] {
  const gatewaySensorInfo = gateways.map((gateway) => {
    const filterSensorsByGateway = latestSensorDataList.filter(
      (sensor) => sensor.gatewayUID === gateway.uid
    );
    const updatedSensorList = {
      sensorList: filterSensorsByGateway,
    };
    const updatedGatewayObject = { ...gateway, ...updatedSensorList };
    return updatedGatewayObject;
  });
  return gatewaySensorInfo;
}
