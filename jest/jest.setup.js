jest.mock("next/image", () => ({
  __esModule: true,
  default: () => "Next image stub", // whatever
}));
