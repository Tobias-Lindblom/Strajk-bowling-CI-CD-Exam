import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderConfirmation } from "./Confirmation.test.helpers";

/*
Acceptanskriterier som testas:

User Story 4 - Slutföra bokning och få bekräftelse:
3. Systemet ska beräkna och visa den totala summan för bokningen baserat på antalet spelare (120 kr per person) samt antalet reserverade banor (100 kr per bana)
*/

describe("Confirmation - Prisberäkning", () => {
  // Acceptanskriterium 3: Systemet ska beräkna och visa totalsumma (120 kr/person + 100 kr/bana)
  it.each([
    {
      people: 2,
      lanes: 1,
      expectedPrice: 340,
      description: "2 personer, 1 bana",
    },
    {
      people: 4,
      lanes: 1,
      expectedPrice: 580,
      description: "4 personer, 1 bana",
    },
    {
      people: 8,
      lanes: 2,
      expectedPrice: 1160,
      description: "8 personer, 2 banor",
    },
    {
      people: 1,
      lanes: 1,
      expectedPrice: 220,
      description: "1 person, 1 bana (minsta bokning)",
    },
    {
      people: 12,
      lanes: 3,
      expectedPrice: 1740,
      description: "12 personer, 3 banor",
    },
  ])(
    "ska beräkna korrekt pris för $description: $expectedPrice kr",
    ({ people, lanes, expectedPrice }) => {
      const confirmationDetails = {
        when: "2023-12-25T18:00",
        people,
        lanes,
        bookingId: "STR1234",
        price: expectedPrice,
      };

      renderConfirmation(confirmationDetails);

      expect(screen.getByText(`${expectedPrice} sek`)).toBeInTheDocument();
    }
  );
});
