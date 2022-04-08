import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import HeaderComponent from "../../../../src/components/layout/Header";

describe("Header component", () => {
  it("should render the header successfully", () => {
    render(<HeaderComponent />);

    expect(screen.getByText("powered by blues")).toBeInTheDocument();
  });
});
