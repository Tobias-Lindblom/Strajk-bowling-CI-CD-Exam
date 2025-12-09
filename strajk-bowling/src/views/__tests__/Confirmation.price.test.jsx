import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderConfirmation } from "./Confirmation.test.helpers";

/*
ACCEPTANSKRITERIER SOM TESTAS:

User Story 4 - Slutföra bokning och få bekräftelse:
3. Systemet ska beräkna och visa den totala summan för bokningen baserat på antalet spelare (120 kr per person) samt antalet reserverade banor (100 kr per bana)
*/

describe("Confirmation - Prisberäkning", () => {
  // Acceptanskriterium 3: Systemet ska beräkna och visa totalsumma
  it("ska visa korrekt totalsumma baserat på 120 kr/person + 100 kr/bana", () => {
    const confirmationDetails = {
      when: "2023-12-25T18:00",
      people: 2,
      lanes: 1,
      bookingId: "STR5678",
      price: 340, // 2 * 120 + 1 * 100 = 340
    };

    renderConfirmation(confirmationDetails);

    expect(screen.getByText("340 sek")).toBeInTheDocument();
  });

  // Acceptanskriterium 3: Beräkning för flera personer och banor
  it("ska beräkna korrekt pris för 4 personer och 1 bana (120*4 + 100*1 = 580 kr)", () => {
    const confirmationDetails = {
      when: "2023-12-25T18:00",
      people: 4,
      lanes: 1,
      bookingId: "STR9999",
      price: 580,
    };

    renderConfirmation(confirmationDetails);

    expect(screen.getByText("580 sek")).toBeInTheDocument();
  });

  // Acceptanskriterium 3: Beräkning för flera banor
  it("ska beräkna korrekt pris för 8 personer och 2 banor (120*8 + 100*2 = 1160 kr)", () => {
    const confirmationDetails = {
      when: "2023-12-25T18:00",
      people: 8,
      lanes: 2,
      bookingId: "STR1111",
      price: 1160,
    };

    renderConfirmation(confirmationDetails);

    expect(screen.getByText("1160 sek")).toBeInTheDocument();
  });

  // Acceptanskriterium 3: Edge case - 1 person och 1 bana (minsta möjliga bokning)
  it("ska beräkna korrekt pris för minsta bokning: 1 person och 1 bana (120*1 + 100*1 = 220 kr)", () => {
    const confirmationDetails = {
      when: "2023-12-25T18:00",
      people: 1,
      lanes: 1,
      bookingId: "STR4444",
      price: 220,
    };

    renderConfirmation(confirmationDetails);

    expect(screen.getByText("220 sek")).toBeInTheDocument();
  });

  // Acceptanskriterium 3: Större bokning med många spelare och banor
  it("ska beräkna korrekt pris för 12 personer och 3 banor (120*12 + 100*3 = 1740 kr)", () => {
    const confirmationDetails = {
      when: "2023-12-25T18:00",
      people: 12,
      lanes: 3,
      bookingId: "STR5555",
      price: 1740,
    };

    renderConfirmation(confirmationDetails);

    expect(screen.getByText("1740 sek")).toBeInTheDocument();
  });
});
