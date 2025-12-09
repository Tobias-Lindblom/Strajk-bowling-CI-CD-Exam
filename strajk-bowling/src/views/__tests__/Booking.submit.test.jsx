import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import { renderBooking, completeBooking } from "./Booking.test.helpers";

/*
ACCEPTANSKRITERIER SOM TESTAS:

User Story 4 - Slutföra bokning och få bekräftelse:
1. Användaren ska kunna slutföra bokningen genom att klicka på en "slutför bokning"-knapp
   (+ API-anrop, navigation till bekräftelsesida)
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
  describe("User Story 4 - Acceptanskriterium 1: Slutföra bokning med knapp", () => {
    it("ska finnas en knapp för att slutföra bokning", () => {
      renderBooking();

      const bookButton = screen.getByText("strIIIIIike!");
      expect(bookButton).toBeInTheDocument();
      expect(bookButton.tagName).toBe("BUTTON");
    });

    it("ska kunna slutföra bokning genom att klicka på 'strIIIIIike!'-knappen", async () => {
      const mockResponse = {
        when: "2023-12-25T18:00",
        lanes: 1,
        people: 2,
        shoes: ["42", "39"],
        bookingId: "STR1234",
        price: 340,
      };

      await completeBooking(
        {
          date: "2023-12-25",
          time: "18:00",
          people: 2,
          lanes: 1,
          shoes: 2,
          fillShoes: true,
        },
        mockResponse
      );

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith("/confirmation", {
          state: { confirmationDetails: mockResponse },
        });
      });
    });

    it("ska anropa API:et när bokning slutförs", async () => {
      await completeBooking(
        {
          date: "2023-12-25",
          time: "18:00",
          people: 4,
          lanes: 2,
          shoes: 4,
          fillShoes: true,
        },
        {
          when: "2023-12-25T18:00",
          lanes: 2,
          people: 4,
          shoes: ["38", "40", "42", "44"],
          bookingId: "STR5678",
          price: 680,
        }
      );

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalled();
        expect(mockNavigate).toHaveBeenCalledWith(
          "/confirmation",
          expect.any(Object)
        );
      });
    });

    it("ska navigera till bekräftelsesidan med bokningsdetaljer efter slutförd bokning", async () => {
      await completeBooking(
        {
          date: "2023-12-25",
          time: "18:00",
          people: 3,
          lanes: 1,
          shoes: 3,
          fillShoes: true,
        },
        {
          when: "2023-12-25T18:00",
          lanes: 1,
          people: 3,
          shoes: ["38", "40", "42"],
          bookingId: "STR9999",
          price: 460,
        }
      );

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith("/confirmation", {
          state: {
            confirmationDetails: expect.objectContaining({
              bookingId: "STR9999",
              price: 460,
              people: 3,
              lanes: 1,
            }),
          },
        });
      });
    });
  });
});
