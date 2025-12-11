import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import { renderBooking, completeBooking } from "./Booking.test.helpers";

/*
Acceptanskriterier som testas:

User Story 4 - Slutföra bokning och få bekräftelse:
1. Användaren ska kunna slutföra bokningen genom att klicka på en "slutför bokning"-knapp
(+ API-anrop, navigation till bekräftelsesida)

User Story 5 - Navigering mellan vyer:
1. Användaren ska kunna navigera från bokningsvyn till bekräftelsevyn när bokningen är klar
*/

// Mock fetch
global.fetch = vi.fn();

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("Booking - Slutföra bokning", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    sessionStorage.clear();
  });

  // User Story 4 - Acceptanskriterium 1:
  // Användaren ska kunna slutföra bokningen genom att klicka på en "slutför bokning"-knapp
  //
  // User Story 5 - Acceptanskriterium 1:
  // Användaren ska kunna navigera från bokningsvyn till bekräftelsevyn när bokningen är klar
  describe("User Story 4 & 5 - Slutföra bokning och navigera till bekräftelse", () => {
    it.each([
      {
        description: "2 personer, 1 bana",
        booking: {
          date: "2023-12-25",
          time: "18:00",
          people: 2,
          lanes: 1,
          shoes: 2,
          fillShoes: true,
        },
        response: {
          when: "2023-12-25T18:00",
          lanes: 1,
          people: 2,
          shoes: ["42", "39"],
          bookingId: "STR1234",
          price: 340,
        },
      },
      {
        description: "4 personer, 2 banor",
        booking: {
          date: "2023-12-25",
          time: "18:00",
          people: 4,
          lanes: 2,
          shoes: 4,
          fillShoes: true,
        },
        response: {
          when: "2023-12-25T18:00",
          lanes: 2,
          people: 4,
          shoes: ["38", "40", "42", "44"],
          bookingId: "STR5678",
          price: 680,
        },
      },
      {
        description: "3 personer, 1 bana",
        booking: {
          date: "2023-12-25",
          time: "18:00",
          people: 3,
          lanes: 1,
          shoes: 3,
          fillShoes: true,
        },
        response: {
          when: "2023-12-25T18:00",
          lanes: 1,
          people: 3,
          shoes: ["38", "40", "42"],
          bookingId: "STR9999",
          price: 460,
        },
      },
    ])(
      "ska slutföra bokning via 'strIIIIIike!'-knappen, anropa API och navigera med $description",
      async ({ booking, response }) => {
        await completeBooking(booking, response);

        // Verifiera att API anropas
        await waitFor(() => {
          expect(global.fetch).toHaveBeenCalled();
        });

        // Verifiera att navigering sker med rätt bokningsdetaljer
        await waitFor(() => {
          expect(mockNavigate).toHaveBeenCalledWith("/confirmation", {
            state: { confirmationDetails: response },
          });
        });
      }
    );
  });
});
