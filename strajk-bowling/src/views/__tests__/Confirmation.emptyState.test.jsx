import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Confirmation from "../Confirmation";

/*
ACCEPTANSKRITERIER SOM TESTAS:

Edge case: Hantera när ingen bokningsdata finns tillgänglig
*/

describe("Confirmation - Tomt state", () => {
  // Visa "Inga bokning gjord!" när ingen data finns
  it("ska visa 'Inga bokning gjord!' när ingen bokningsdata finns", () => {
    render(
      <MemoryRouter>
        <Confirmation />
      </MemoryRouter>
    );

    expect(screen.getByText("Inga bokning gjord!")).toBeInTheDocument();
  });

  it("ska inte visa bokningsdetaljer när ingen data finns", () => {
    render(
      <MemoryRouter>
        <Confirmation />
      </MemoryRouter>
    );

    expect(screen.queryByText("Total:")).not.toBeInTheDocument();
    expect(screen.queryByText("Booking number")).not.toBeInTheDocument();
  });
});
