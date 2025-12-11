import { describe, it, expect, vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderBookingInfo } from "./BookingInfo.test.helpers";

/*
Acceptanskriterier som testas:

User Story 1 - Bokningsfunktionalitet:
1. Användaren ska kunna välja ett datum och en tid från ett kalender- och tidvalssystem
2. Användaren ska kunna ange antal spelare (minst 1 spelare)
3. Användaren ska kunna reservera ett eller flera banor beroende på antal spelare
*/

// Helper för att sätta upp test med user och mock
const setupTest = () => {
  const user = userEvent.setup();
  const mockUpdate = vi.fn();
  renderBookingInfo(mockUpdate);
  return { user, mockUpdate };
};

describe("BookingInfo - Användarinteraktion", () => {
  // Acceptanskriterium 1: Användaren ska kunna välja ett datum och en tid
  it("ska anropa updateBookingDetails när användaren väljer datum", async () => {
    const { user, mockUpdate } = setupTest();

    await user.type(screen.getByLabelText("Date"), "2023-12-25");
    expect(mockUpdate).toHaveBeenCalled();
  });

  // Acceptanskriterium 1: Användaren ska kunna välja ett datum och en tid
  it("ska anropa updateBookingDetails när användaren väljer tid", async () => {
    const { user, mockUpdate } = setupTest();

    await user.type(screen.getByLabelText("Time"), "18:00");
    expect(mockUpdate).toHaveBeenCalled();
  });

  // Acceptanskriterium 2: Användaren ska kunna ange antal spelare
  it("ska anropa updateBookingDetails när användaren anger antal spelare", async () => {
    const { user, mockUpdate } = setupTest();

    await user.type(screen.getByLabelText("Number of awesome bowlers"), "4");
    expect(mockUpdate).toHaveBeenCalled();
  });

  // Acceptanskriterium 3: Användaren ska kunna reservera ett eller flera banor
  it("ska anropa updateBookingDetails när användaren anger antal banor", async () => {
    const { user, mockUpdate } = setupTest();

    await user.type(screen.getByLabelText("Number of lanes"), "2");
    expect(mockUpdate).toHaveBeenCalled();
  });

  // Acceptanskriterium 2: Användaren ska kunna ange antal spelare (minst 1 spelare)
  it("ska tillåta minst 1 spelare", async () => {
    const { user, mockUpdate } = setupTest();

    const peopleInput = screen.getByLabelText("Number of awesome bowlers");
    await user.type(peopleInput, "1");

    expect(mockUpdate).toHaveBeenCalled();
    expect(peopleInput).toHaveValue(1);
  });

  // Acceptanskriterium 3: Användaren ska kunna reservera ett eller flera banor
  it("ska tillåta flera banor", async () => {
    const { user, mockUpdate } = setupTest();

    const lanesInput = screen.getByLabelText("Number of lanes");
    await user.type(lanesInput, "3");

    expect(mockUpdate).toHaveBeenCalled();
    expect(lanesInput).toHaveValue(3);
  });
});
