import { render } from "@testing-library/react";
import { vi } from "vitest";
import Shoes from "../Shoes";

/*
Helper function för att rendera Shoes-komponenten med default props
*/
export const renderShoes = (props = {}) => {
  const defaultProps = {
    updateSize: vi.fn(),
    addShoe: vi.fn(),
    removeShoe: vi.fn(),
    shoes: [],
  };
  return render(<Shoes {...defaultProps} {...props} />);
};
