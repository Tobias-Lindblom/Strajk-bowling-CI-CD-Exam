import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import { setup, completeBooking } from "./Booking.test.helpers";

/*
ACCEPTANSKRITERIER SOM TESTAS:

User Story 1 - Bokningsfunktionalitet:
2. Användaren ska kunna ange antal spelare (minst 1 spelare)
3. Användaren ska kunna reservera ett eller flera banor beroende på antal spelare
5. Om det inte finns tillräckligt med lediga banor för det angivna antalet spelare,
   ska användaren få ett felmeddelande
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

describe("Booking - Spelare och banor", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    sessionStorage.clear();
  });

  // User Story 1 - Acceptanskriterium 5:
  // Om det inte finns tillräckligt med lediga banor för det angivna antalet spelare,
  // ska användaren få ett felmeddelande
  describe("User Story 1 - Acceptanskriterium 5: Felmeddelande om inte tillräckligt med banor", () => {
    const tooManyPlayersCases = [
      { name: "5 spelare bokar 1 bana (max 4 per bana)", people: 5, lanes: 1 },
      { name: "9 spelare bokar 2 banor (max 8 spelare)", people: 9, lanes: 2 },
    ];

    it.each(tooManyPlayersCases)(
      "ska visa felmeddelande om $name",
      async ({ people, lanes }) => {
        const user = await setup({
          date: "2023-12-25",
          time: "18:00",
          people,
          lanes,
          shoes: people,
          fillShoes: true,
        });
        await user.click(screen.getByText("strIIIIIike!"));

        await waitFor(() => {
          expect(
            screen.getByText("Det får max vara 4 spelare per bana")
          ).toBeInTheDocument();
        });
      }
    );

    it("ska INTE visa felmeddelande om 4 spelare bokar 1 bana (exakt max)", async () => {
      const mockResponse = {
        when: "2023-12-25T18:00",
        lanes: 1,
        people: 4,
        shoes: ["42", "42", "42", "42"],
        bookingId: "STR1234",
        price: 580,
      };

      await completeBooking(
        {
          date: "2023-12-25",
          time: "18:00",
          people: 4,
          lanes: 1,
          shoes: 4,
          fillShoes: true,
        },
        mockResponse
      );

      await waitFor(() => {
        expect(
          screen.queryByText("Det får max vara 4 spelare per bana")
        ).not.toBeInTheDocument();
        expect(mockNavigate).toHaveBeenCalledWith(
          "/confirmation",
          expect.any(Object)
        );
      });
    });

    it("ska INTE visa felmeddelande om 8 spelare bokar 2 banor (exakt max)", async () => {
      const mockResponse = {
        when: "2023-12-25T18:00",
        lanes: 2,
        people: 8,
        shoes: ["42", "42", "42", "42", "42", "42", "42", "42"],
        bookingId: "STR1234",
        price: 1060,
      };

      await completeBooking(
        {
          date: "2023-12-25",
          time: "18:00",
          people: 8,
          lanes: 2,
          shoes: 8,
          fillShoes: true,
        },
        mockResponse
      );

      await waitFor(() => {
        expect(
          screen.queryByText("Det får max vara 4 spelare per bana")
        ).not.toBeInTheDocument();
        expect(mockNavigate).toHaveBeenCalledWith(
          "/confirmation",
          expect.any(Object)
        );
      });
    });
  });

  // User Story 1 - Acceptanskriterium 2 & 3:
  // Användaren ska kunna ange antal spelare (minst 1 spelare)
  // Användaren ska kunna reservera ett eller flera banor beroende på antal spelare
  describe("User Story 1 - Acceptanskriterium 2 & 3: Reservera 1 eller flera banor", () => {
    it("ska kunna boka 1 bana med 1 spelare (minst 1 spelare)", async () => {
      const mockResponse = {
        when: "2023-12-25T18:00",
        lanes: 1,
        people: 1,
        shoes: ["42"],
        bookingId: "STR1234",
        price: 220,
      };

      await completeBooking(
        {
          date: "2023-12-25",
          time: "18:00",
          people: 1,
          lanes: 1,
          shoes: 1,
          fillShoes: true,
        },
        mockResponse
      );

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith(
          "/confirmation",
          expect.any(Object)
        );
      });
    });

    it("ska kunna boka 3 banor med 10 spelare", async () => {
      const mockResponse = {
        when: "2023-12-25T18:00",
        lanes: 3,
        people: 10,
        shoes: ["42", "42", "42", "42", "42", "42", "42", "42", "42", "42"],
        bookingId: "STR5678",
        price: 1300,
      };

      await completeBooking(
        {
          date: "2023-12-25",
          time: "18:00",
          people: 10,
          lanes: 3,
          shoes: 10,
          fillShoes: true,
        },
        mockResponse
      );

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith(
          "/confirmation",
          expect.any(Object)
        );
      });
    });
  });
});
