import { services } from "../../../src/services/ServiceLocator";

describe("Service locator", () => {
  const mockedDataProvider = {
    dataProvider: {
      notehubApiService: { appBaseUrl: "http://localhost:4000" },
    },
  };

  it("should return any service contained in the service locator when getAppService is called", () => {
    const res = services().getAppService();
    expect(res).toEqual(mockedDataProvider);
  });
});
