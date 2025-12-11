import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Confirmation from "../Confirmation";

/*
Acceptanskriterier som testas:

User Story 5 - Navigering mellan vyer:
3. Om användaren navigerar till bekräftelsevyn och det finns en bokning sparad i session storage ska denna visas
*/

describe("Confirmation - Session Storage", () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  // User Story 5 - Acceptanskriterium 3:
  // Om användaren navigerar till bekräftelsevyn och det finns en bokning sparad i session storage ska denna visas
  describe("User Story 5 - Acceptanskriterium 3: Visa bokning från sessionStorage", () => {
    it("ska visa alla bokningsdetaljer från sessionStorage när state saknas", () => {
      const mockConfirmation = {
        when: "2023-12-25T18:00",
        lanes: 2,
        people: 4,
        shoes: ["38", "40", "42", "44"],
        bookingId: "STR1234ABCD",
        price: 680,
      };

      sessionStorage.setItem("confirmation", JSON.stringify(mockConfirmation));

      render(
        <MemoryRouter>
          <Confirmation />
        </MemoryRouter>
      );

      // Verifiera alla bokningsdetaljer visas korrekt
      expect(screen.getByDisplayValue("2023-12-25 18:00")).toBeInTheDocument();
      expect(screen.getByDisplayValue("4")).toBeInTheDocument();
      expect(screen.getByDisplayValue("2")).toBeInTheDocument();
      expect(screen.getByDisplayValue("STR1234ABCD")).toBeInTheDocument();
      expect(screen.getByText("Booking number")).toBeInTheDocument();
      expect(screen.getByText("Total:")).toBeInTheDocument();
      expect(screen.getByText("680 sek")).toBeInTheDocument();
      // Verifiera att felmeddelande INTE visas när data finns
      expect(screen.queryByText("Inga bokning gjord!")).not.toBeInTheDocument();
    });

    it("ska prioritera state över sessionStorage om båda finns", () => {
      // Lägg data i sessionStorage
      const sessionStorageData = {
        when: "2023-12-01T10:00",
        lanes: 1,
        people: 1,
        shoes: ["42"],
        bookingId: "OLD_BOOKING",
        price: 220,
      };

      sessionStorage.setItem(
        "confirmation",
        JSON.stringify(sessionStorageData)
      );

      // Rendera med state (nyare data)
      const stateData = {
        when: "2023-12-25T18:00",
        lanes: 2,
        people: 4,
        shoes: ["38", "40", "42", "44"],
        bookingId: "NEW_BOOKING",
        price: 680,
      };

      render(
        <MemoryRouter
          initialEntries={[
            {
              pathname: "/confirmation",
              state: { confirmationDetails: stateData },
            },
          ]}
        >
          <Confirmation />
        </MemoryRouter>
      );

      // State ska prioriteras - visa NEW_BOOKING, inte OLD_BOOKING
      expect(screen.getByDisplayValue("NEW_BOOKING")).toBeInTheDocument();
      expect(screen.queryByDisplayValue("OLD_BOOKING")).not.toBeInTheDocument();
      expect(screen.getByText("680 sek")).toBeInTheDocument();
      expect(screen.queryByText("220 sek")).not.toBeInTheDocument();
    });
  });
});
