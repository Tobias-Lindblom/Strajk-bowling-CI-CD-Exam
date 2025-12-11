import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Confirmation from "../Confirmation";

/*
Acceptanskriterier som testas:

User Story 5 - Navigering mellan vyer:
2. Om användaren navigerar till bekräftelsevyn och ingen bokning är gjord eller finns i session storage ska texten "Ingen bokning gjord visas"
*/

describe("Confirmation - Tomt state", () => {
  // User Story 5 - Acceptanskriterium 2:
  // Om användaren navigerar till bekräftelsevyn och ingen bokning är gjord eller finns i session storage ska texten "Ingen bokning gjord visas"
  describe("User Story 5 - Acceptanskriterium 2: Visa meddelande när ingen bokning finns", () => {
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
});
