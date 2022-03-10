/* eslint-disable react/jsx-props-no-spreading */
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import userEvent from "@testing-library/user-event";
// eslint-disable-next-line jest/no-mocks-import
import "../../../../__mocks__/matchMediaMock"; // needed to avoid error due to JSDOM not implementing method yet: https://jestjs.io/docs/manual-mocks#mocking-methods-which-are-not-implemented-in-jsdom
import GatewayDetails from "../../../../src/components/elements/GatewayDetails";
import Gateway from "../../../../src/components/models/Gateway";
import Node from "../../../../src/components/models/Node";
import { GATEWAY_MESSAGE, ERROR_MESSAGE } from "../../../../src/constants/ui";
import { getGatewayDetailsPresentation } from "../../../../src/components/presentation/gatewayDetails";

function getMockGateway(): Gateway {
  return {
    uid: "dev:123",
    serialNumber: "my-gateway",
    lastActivity: "2022-01-13T15:02:46Z",
    location: "someplace",
    voltage: 1.2,
    nodeList: [],
  };
}

const mockNodes: Node[] = [
  {
    gatewayUID: "dev:123",
    nodeId: "20323746323650050028000a",
    lastActivity: "2022-01-13T15:02:46Z",
    humidity: 11,
    name: "my-node",
    pressure: 22,
    temperature: 33,
    voltage: 4.4,
  },
  {
    gatewayUID: "dev:123",
    nodeId: "20323746323650050028000b",
    lastActivity: "2022-01-13T15:02:46Z",
    humidity: 11,
    name: "another-node",
    pressure: 22,
    temperature: 33,
    voltage: 4.4,
  },
];

// eslint-disable-next-line @typescript-eslint/require-await
const mockChange = async () => true;

describe("Gateway details page", () => {
  it("should render the gateway and node information when a gateway is present", () => {
    const gateway = getMockGateway();
    const viewModel = getGatewayDetailsPresentation(gateway, mockNodes);
    render(<GatewayDetails viewModel={viewModel} onChangeName={mockChange} />);

    expect(
      screen.getByText(gateway.serialNumber, { exact: false })
    ).toBeInTheDocument();

    expect(
      screen.getByText(mockNodes[0].name || "", { exact: false })
    ).toBeInTheDocument();
    expect(
      screen.getByText(mockNodes[1].name || "", { exact: false })
    ).toBeInTheDocument();
  });

  it("should render a gateway location if one is present", () => {
    const gateway = getMockGateway();
    gateway.location = "Michigan";
    const viewModel = getGatewayDetailsPresentation(gateway, mockNodes);

    render(<GatewayDetails viewModel={viewModel} onChangeName={mockChange} />);
    expect(screen.getByTestId("gateway-location")).toBeInTheDocument();
  });

  it("should not render a gateway location if one is not present", () => {
    const gateway = getMockGateway();
    delete gateway.location;
    const viewModel = getGatewayDetailsPresentation(gateway, mockNodes);
    render(<GatewayDetails viewModel={viewModel} onChangeName={mockChange} />);
    expect(
      screen.queryAllByText(GATEWAY_MESSAGE.NO_LOCATION)[0]
    ).toBeInTheDocument();
  });

  it("should render an error when present", () => {
    const errorMessage = "FAILURE!";
    const viewModel = getGatewayDetailsPresentation(undefined, undefined);
    render(
      <GatewayDetails
        viewModel={viewModel}
        onChangeName={mockChange}
        err={errorMessage}
      />
    );

    expect(
      screen.getByText(errorMessage, { exact: false })
    ).toBeInTheDocument();
    expect(
      screen.queryByText("Gateway", { exact: false })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText("Node", { exact: false })
    ).not.toBeInTheDocument();
  });

  it("should show an error if a name change failed", async () => {
    const gateway = getMockGateway();
    const viewModel = getGatewayDetailsPresentation(gateway, mockNodes);

    const promise = Promise.resolve(false);
    const onChangeName = () => promise;

    render(
      <GatewayDetails
        viewModel={viewModel}
        onChangeName={onChangeName}
        err=""
      />
    );

    userEvent.click(screen.getByRole("button", { name: /edit/i }));
    userEvent.click(screen.getByRole("button", { name: /check/i }));

    await waitFor(() =>
      screen.getByText(ERROR_MESSAGE.GATEWAY_NAME_CHANGE_FAILED)
    );
    expect(
      screen.getByText(ERROR_MESSAGE.GATEWAY_NAME_CHANGE_FAILED)
    ).toBeInTheDocument();
  });

  it("should NOT show an error if a name change succeeds", async () => {
    const gateway = getMockGateway();
    const viewModel = getGatewayDetailsPresentation(gateway, mockNodes);

    const promise = Promise.resolve(true);
    const onChangeName = () => promise;

    render(
      <GatewayDetails
        viewModel={viewModel}
        onChangeName={onChangeName}
        err=""
      />
    );

    userEvent.click(screen.getByRole("button", { name: /edit/i }));
    userEvent.click(screen.getByRole("button", { name: /check/i }));

    await waitFor(() => screen.getByRole("button", { name: /edit/i }));
    expect(
      screen.queryByText(ERROR_MESSAGE.GATEWAY_NAME_CHANGE_FAILED, {
        exact: false,
      })
    ).not.toBeInTheDocument();
  });
});
