import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Confirmation from "../Confirmation";

// Helper function för att rendera Confirmation med mock-data
export const renderConfirmation = (confirmationDetails) => {
  return render(
    <MemoryRouter
      initialEntries={[
        { pathname: "/confirmation", state: { confirmationDetails } },
      ]}
    >
      <Confirmation />
    </MemoryRouter>
  );
};
