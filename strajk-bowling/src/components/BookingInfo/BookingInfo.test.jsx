import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import BookingInfo from "./BookingInfo";

/*
ACCEPTANSKRITERIER SOM TESTAS:

User Story 1 - Bokningsfunktionalitet:
1. Användaren ska kunna välja ett datum och en tid från ett kalender- och tidvalssystem
2. Användaren ska kunna ange antal spelare (minst 1 spelare)
3. Användaren ska kunna reservera ett eller flera banor beroende på antal spelare
*/

describe("BookingInfo - User Story 1: Bokningsfunktionalitet", () => {
  // Acceptanskriterium 1: Användaren ska kunna välja ett datum och en tid
  it("ska rendera datumväljare", () => {
    // Testar att datumväljaren finns och är av rätt typ (kalenderväljare)
    const mockUpdate = vi.fn();
    render(<BookingInfo updateBookingDetails={mockUpdate} />);

    const dateInput = screen.getByLabelText("Date");
    expect(dateInput).toBeInTheDocument();
    expect(dateInput).toHaveAttribute("type", "date");
  });

  // Acceptanskriterium 1: Användaren ska kunna välja ett datum och en tid
  it("ska rendera tidväljare", () => {
    // Testar att tidväljaren finns och är av rätt typ
    const mockUpdate = vi.fn();
    render(<BookingInfo updateBookingDetails={mockUpdate} />);

    const timeInput = screen.getByLabelText("Time");
    expect(timeInput).toBeInTheDocument();
    expect(timeInput).toHaveAttribute("type", "time");
  });

  // Acceptanskriterium 2: Användaren ska kunna ange antal spelare
  it("ska rendera fält för antal spelare", () => {
    // Testar att fältet för antal spelare finns och är av rätt typ
    const mockUpdate = vi.fn();
    render(<BookingInfo updateBookingDetails={mockUpdate} />);

    const peopleInput = screen.getByLabelText("Number of awesome bowlers");
    expect(peopleInput).toBeInTheDocument();
    expect(peopleInput).toHaveAttribute("type", "number");
  });

  // Acceptanskriterium 3: Användaren ska kunna reservera ett eller flera banor
  it("ska rendera fält för antal banor", () => {
    // Testar att fältet för antal banor finns och är av rätt typ
    const mockUpdate = vi.fn();
    render(<BookingInfo updateBookingDetails={mockUpdate} />);

    const lanesInput = screen.getByLabelText("Number of lanes");
    expect(lanesInput).toBeInTheDocument();
    expect(lanesInput).toHaveAttribute("type", "number");
  });

  // Acceptanskriterium 1: Användaren ska kunna välja ett datum och en tid
  it("ska anropa updateBookingDetails när användaren väljer datum", async () => {
    // Testar att användaren faktiskt kan interagera med datumväljaren
    const mockUpdate = vi.fn();
    const user = userEvent.setup();

    render(<BookingInfo updateBookingDetails={mockUpdate} />);

    const dateInput = screen.getByLabelText("Date");
    await user.type(dateInput, "2023-12-25");

    expect(mockUpdate).toHaveBeenCalled();
  });

  // Acceptanskriterium 1: Användaren ska kunna välja ett datum och en tid
  it("ska anropa updateBookingDetails när användaren väljer tid", async () => {
    // Testar att användaren faktiskt kan interagera med tidväljaren
    const mockUpdate = vi.fn();
    const user = userEvent.setup();

    render(<BookingInfo updateBookingDetails={mockUpdate} />);

    const timeInput = screen.getByLabelText("Time");
    await user.type(timeInput, "18:00");

    expect(mockUpdate).toHaveBeenCalled();
  });

  // Acceptanskriterium 2: Användaren ska kunna ange antal spelare
  it("ska anropa updateBookingDetails när användaren anger antal spelare", async () => {
    // Testar att användaren faktiskt kan ange antal spelare
    const mockUpdate = vi.fn();
    const user = userEvent.setup();

    render(<BookingInfo updateBookingDetails={mockUpdate} />);

    const peopleInput = screen.getByLabelText("Number of awesome bowlers");
    await user.type(peopleInput, "4");

    expect(mockUpdate).toHaveBeenCalled();
  });

  // Acceptanskriterium 3: Användaren ska kunna reservera ett eller flera banor
  it("ska anropa updateBookingDetails när användaren anger antal banor", async () => {
    // Testar att användaren faktiskt kan ange antal banor
    const mockUpdate = vi.fn();
    const user = userEvent.setup();

    render(<BookingInfo updateBookingDetails={mockUpdate} />);

    const lanesInput = screen.getByLabelText("Number of lanes");
    await user.type(lanesInput, "2");

    expect(mockUpdate).toHaveBeenCalled();
  });

  // Acceptanskriterium 2: Användaren ska kunna ange antal spelare (minst 1 spelare)
  it("ska tillåta minst 1 spelare", async () => {
    // Testar att systemet accepterar minst 1 spelare
    const mockUpdate = vi.fn();
    const user = userEvent.setup();

    render(<BookingInfo updateBookingDetails={mockUpdate} />);

    const peopleInput = screen.getByLabelText("Number of awesome bowlers");
    await user.type(peopleInput, "1");

    expect(mockUpdate).toHaveBeenCalled();
    expect(peopleInput).toHaveValue(1);
  });

  // Acceptanskriterium 3: Användaren ska kunna reservera ett eller flera banor
  it("ska tillåta flera banor", async () => {
    // Testar att systemet accepterar flera banor
    const mockUpdate = vi.fn();
    const user = userEvent.setup();

    render(<BookingInfo updateBookingDetails={mockUpdate} />);

    const lanesInput = screen.getByLabelText("Number of lanes");
    await user.type(lanesInput, "3");

    expect(mockUpdate).toHaveBeenCalled();
    expect(lanesInput).toHaveValue(3);
  });
});
