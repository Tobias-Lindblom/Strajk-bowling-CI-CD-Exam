import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import { setup } from "./Booking.test.helpers";

/*
ACCEPTANSKRITERIER SOM TESTAS:

User Story 1 - Bokningsfunktionalitet:
4. Ifall användaren inte fyller i något av ovanstående så ska ett felmeddelande visas
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

describe("Booking - Formvalidering", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    sessionStorage.clear();
  });

  // User Story 1 - Acceptanskriterium 4:
  // Ifall användaren inte fyller i något av ovanstående ska ett felmeddelande visas
  describe("User Story 1 - Acceptanskriterium 4: Felmeddelande om fält inte är ifyllda", () => {
    const missingFieldCases = [
      { name: "inget fält är ifyllt", data: {} },
      { name: "datum saknas", data: { time: "18:00", people: 4, lanes: 1 } },
      { name: "tid saknas", data: { date: "2023-12-25", people: 4, lanes: 1 } },
      {
        name: "antal spelare saknas",
        data: { date: "2023-12-25", time: "18:00", lanes: 1 },
      },
      {
        name: "antal banor saknas",
        data: { date: "2023-12-25", time: "18:00", people: 4 },
      },
    ];

    it.each(missingFieldCases)(
      "ska visa felmeddelande om $name",
      async ({ data }) => {
        const user = await setup(data);
        await user.click(screen.getByText("strIIIIIike!"));

        await waitFor(() => {
          expect(
            screen.getByText("Alla fälten måste vara ifyllda")
          ).toBeInTheDocument();
        });
      }
    );
  });
});
