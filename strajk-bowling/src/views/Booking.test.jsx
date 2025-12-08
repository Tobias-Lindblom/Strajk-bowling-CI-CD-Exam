import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import Booking from "./Booking";

/*
ACCEPTANSKRITERIER SOM TESTAS:

User Story 1 - Bokningsfunktionalitet:
1. Användaren ska kunna välja ett datum och en tid från ett kalender- och tidvalssystem
2. Användaren ska kunna ange antal spelare (minst 1 spelare)
3. Användaren ska kunna reservera ett eller flera banor beroende på antal spelare
4. Ifall användaren inte fyller i något av ovanstående så ska ett felmeddelande visas
5. Om det inte finns tillräckligt med lediga banor för det angivna antalet spelare,
ska användaren få ett felmeddelande

User Story 2 - Skostorlekar:
4. Om användaren försöker slutföra bokningen utan att ange skostorlek för en spelare
som har valt att boka skor, ska systemet visa ett felmeddelande
5. Om antalet personer och skor inte matchas ska ett felmeddelande visas
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

describe("Booking - Validering och felmeddelanden", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    sessionStorage.clear();
  });

  const renderBooking = () => {
    return render(
      <BrowserRouter>
        <Booking />
      </BrowserRouter>
    );
  };

  // User Story 1 - Acceptanskriterium 4:
  // Ifall användaren inte fyller i något av ovanstående ska ett felmeddelande visas
  describe("Acceptanskriterium 4: Felmeddelande om fält inte är ifyllda", () => {
    it("ska visa felmeddelande om inget fält är ifyllt", async () => {
      // Testar att alla fält måste vara ifyllda
      const user = userEvent.setup();
      renderBooking();

      const bookButton = screen.getByText("strIIIIIike!");
      await user.click(bookButton);

      await waitFor(() => {
        expect(
          screen.getByText("Alla fälten måste vara ifyllda")
        ).toBeInTheDocument();
      });
    });

    it("ska visa felmeddelande om datum saknas", async () => {
      // Testar att datum måste vara ifyllt (acceptanskriterium 1)
      const user = userEvent.setup();
      renderBooking();

      // Fyll i allt utom datum
      const timeInput = screen.getByLabelText("Time");
      const peopleInput = screen.getByLabelText("Number of awesome bowlers");
      const lanesInput = screen.getByLabelText("Number of lanes");

      await user.type(timeInput, "18:00");
      await user.type(peopleInput, "4");
      await user.type(lanesInput, "1");

      // Lägg till skor
      const addShoeButton = screen.getByText("+");
      for (let i = 0; i < 4; i++) {
        await user.click(addShoeButton);
      }

      const bookButton = screen.getByText("strIIIIIike!");
      await user.click(bookButton);

      await waitFor(() => {
        expect(
          screen.getByText("Alla fälten måste vara ifyllda")
        ).toBeInTheDocument();
      });
    });

    it("ska visa felmeddelande om tid saknas", async () => {
      // Testar att tid måste vara ifylld (acceptanskriterium 1)
      const user = userEvent.setup();
      renderBooking();

      // Fyll i allt utom tid
      const dateInput = screen.getByLabelText("Date");
      const peopleInput = screen.getByLabelText("Number of awesome bowlers");
      const lanesInput = screen.getByLabelText("Number of lanes");

      await user.type(dateInput, "2023-12-25");
      await user.type(peopleInput, "4");
      await user.type(lanesInput, "1");

      const bookButton = screen.getByText("strIIIIIike!");
      await user.click(bookButton);

      await waitFor(() => {
        expect(
          screen.getByText("Alla fälten måste vara ifyllda")
        ).toBeInTheDocument();
      });
    });

    it("ska visa felmeddelande om antal spelare saknas", async () => {
      // Testar att antal spelare måste vara angivet (acceptanskriterium 2)
      const user = userEvent.setup();
      renderBooking();

      // Fyll i allt utom antal spelare
      const dateInput = screen.getByLabelText("Date");
      const timeInput = screen.getByLabelText("Time");
      const lanesInput = screen.getByLabelText("Number of lanes");

      await user.type(dateInput, "2023-12-25");
      await user.type(timeInput, "18:00");
      await user.type(lanesInput, "1");

      const bookButton = screen.getByText("strIIIIIike!");
      await user.click(bookButton);

      await waitFor(() => {
        expect(
          screen.getByText("Alla fälten måste vara ifyllda")
        ).toBeInTheDocument();
      });
    });

    it("ska visa felmeddelande om antal banor saknas", async () => {
      // Testar att antal banor måste vara angivet (acceptanskriterium 3)
      const user = userEvent.setup();
      renderBooking();

      // Fyll i allt utom antal banor
      const dateInput = screen.getByLabelText("Date");
      const timeInput = screen.getByLabelText("Time");
      const peopleInput = screen.getByLabelText("Number of awesome bowlers");

      await user.type(dateInput, "2023-12-25");
      await user.type(timeInput, "18:00");
      await user.type(peopleInput, "4");

      const bookButton = screen.getByText("strIIIIIike!");
      await user.click(bookButton);

      await waitFor(() => {
        expect(
          screen.getByText("Alla fälten måste vara ifyllda")
        ).toBeInTheDocument();
      });
    });
  });

  // User story 1 - Acceptanskriterium 5:
  // Om det inte finns tillräckligt med lediga banor för antalet spelare,
  // ska användaren få ett felmeddelande
  describe("Acceptanskriterium 5: Felmeddelande om inte tillräckligt med lediga banor", () => {
    it("ska visa felmeddelande om 5 spelare bokar 1 bana (max 4 per bana)", async () => {
      // Testar att användaren får felmeddelande om för många spelare per bana
      const user = userEvent.setup();
      renderBooking();

      // Fyll i bokningsdetaljer - 5 spelare på 1 bana
      const dateInput = screen.getByLabelText("Date");
      const timeInput = screen.getByLabelText("Time");
      const peopleInput = screen.getByLabelText("Number of awesome bowlers");
      const lanesInput = screen.getByLabelText("Number of lanes");

      await user.type(dateInput, "2023-12-25");
      await user.type(timeInput, "18:00");
      await user.type(peopleInput, "5");
      await user.type(lanesInput, "1");

      // Lägg till 5 skor med storlekar
      const addShoeButton = screen.getByText("+");
      for (let i = 0; i < 5; i++) {
        await user.click(addShoeButton);
      }

      const shoeInputs = screen.getAllByLabelText(/Shoe size \/ person/);
      for (const input of shoeInputs) {
        await user.type(input, "42");
      }

      const bookButton = screen.getByText("strIIIIIike!");
      await user.click(bookButton);

      await waitFor(() => {
        expect(
          screen.getByText("Det får max vara 4 spelare per bana")
        ).toBeInTheDocument();
      });
    });

    it("ska visa felmeddelande om 9 spelare bokar 2 banor (max 8 spelare)", async () => {
      // Testar att användaren får felmeddelande om för många spelare för antalet banor
      const user = userEvent.setup();
      renderBooking();

      // Fyll i bokningsdetaljer - 9 spelare på 2 banor
      const dateInput = screen.getByLabelText("Date");
      const timeInput = screen.getByLabelText("Time");
      const peopleInput = screen.getByLabelText("Number of awesome bowlers");
      const lanesInput = screen.getByLabelText("Number of lanes");

      await user.type(dateInput, "2023-12-25");
      await user.type(timeInput, "18:00");
      await user.type(peopleInput, "9");
      await user.type(lanesInput, "2");

      // Lägg till 9 skor med storlekar
      const addShoeButton = screen.getByText("+");
      for (let i = 0; i < 9; i++) {
        await user.click(addShoeButton);
      }

      const shoeInputs = screen.getAllByLabelText(/Shoe size \/ person/);
      for (const input of shoeInputs) {
        await user.type(input, "42");
      }

      const bookButton = screen.getByText("strIIIIIike!");
      await user.click(bookButton);

      await waitFor(() => {
        expect(
          screen.getByText("Det får max vara 4 spelare per bana")
        ).toBeInTheDocument();
      });
    });

    it("ska INTE visa felmeddelande om 4 spelare bokar 1 bana (exakt max)", async () => {
      // Testar att gränsvärdet (4 spelare per bana) accepteras
      const user = userEvent.setup();

      const mockResponse = {
        bookingDetails: {
          when: "2023-12-25T18:00",
          lanes: 1,
          people: 4,
          shoes: ["42", "42", "42", "42"],
          bookingId: "STR1234",
          price: 580,
        },
      };

      global.fetch.mockResolvedValueOnce({
        json: async () => mockResponse,
      });

      renderBooking();

      // Fyll i bokningsdetaljer - 4 spelare på 1 bana
      const dateInput = screen.getByLabelText("Date");
      const timeInput = screen.getByLabelText("Time");
      const peopleInput = screen.getByLabelText("Number of awesome bowlers");
      const lanesInput = screen.getByLabelText("Number of lanes");

      await user.type(dateInput, "2023-12-25");
      await user.type(timeInput, "18:00");
      await user.type(peopleInput, "4");
      await user.type(lanesInput, "1");

      // Lägg till 4 skor med storlekar
      const addShoeButton = screen.getByText("+");
      for (let i = 0; i < 4; i++) {
        await user.click(addShoeButton);
      }

      const shoeInputs = screen.getAllByLabelText(/Shoe size \/ person/);
      for (const input of shoeInputs) {
        await user.type(input, "42");
      }

      const bookButton = screen.getByText("strIIIIIike!");
      await user.click(bookButton);

      // Borde inte visa felmeddelande, utan navigera till confirmation
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
      // Testar att gränsvärdet (8 spelare på 2 banor) accepteras
      const user = userEvent.setup();

      const mockResponse = {
        bookingDetails: {
          when: "2023-12-25T18:00",
          lanes: 2,
          people: 8,
          shoes: ["42", "42", "42", "42", "42", "42", "42", "42"],
          bookingId: "STR1234",
          price: 1060,
        },
      };

      global.fetch.mockResolvedValueOnce({
        json: async () => mockResponse,
      });

      renderBooking();

      // Fyll i bokningsdetaljer - 8 spelare på 2 banor
      const dateInput = screen.getByLabelText("Date");
      const timeInput = screen.getByLabelText("Time");
      const peopleInput = screen.getByLabelText("Number of awesome bowlers");
      const lanesInput = screen.getByLabelText("Number of lanes");

      await user.type(dateInput, "2023-12-25");
      await user.type(timeInput, "18:00");
      await user.type(peopleInput, "8");
      await user.type(lanesInput, "2");

      // Lägg till 8 skor med storlekar
      const addShoeButton = screen.getByText("+");
      for (let i = 0; i < 8; i++) {
        await user.click(addShoeButton);
      }

      const shoeInputs = screen.getAllByLabelText(/Shoe size \/ person/);
      for (const input of shoeInputs) {
        await user.type(input, "42");
      }

      const bookButton = screen.getByText("strIIIIIike!");
      await user.click(bookButton);

      // Borde inte visa felmeddelande, utan navigera till confirmation
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

  // User story 1 - Acceptanskriterium 2 & 3:
  // Användaren ska kunna ange minst 1 spelare och reservera 1 eller flera banor
  describe("Acceptanskriterium 2 & 3: Användaren kan reservera 1 eller flera banor", () => {
    it("ska kunna boka 1 bana med 1 spelare (minst 1 spelare)", async () => {
      // Testar att systemet accepterar minst 1 spelare och 1 bana (acceptanskriterium 2 & 3)
      const user = userEvent.setup();

      const mockResponse = {
        bookingDetails: {
          when: "2023-12-25T18:00",
          lanes: 1,
          people: 1,
          shoes: ["42"],
          bookingId: "STR1234",
          price: 220,
        },
      };

      global.fetch.mockResolvedValueOnce({
        json: async () => mockResponse,
      });

      renderBooking();

      const dateInput = screen.getByLabelText("Date");
      const timeInput = screen.getByLabelText("Time");
      const peopleInput = screen.getByLabelText("Number of awesome bowlers");
      const lanesInput = screen.getByLabelText("Number of lanes");

      await user.type(dateInput, "2023-12-25");
      await user.type(timeInput, "18:00");
      await user.type(peopleInput, "1");
      await user.type(lanesInput, "1");

      const addShoeButton = screen.getByText("+");
      await user.click(addShoeButton);

      const shoeInput = screen.getByLabelText("Shoe size / person 1");
      await user.type(shoeInput, "42");

      const bookButton = screen.getByText("strIIIIIike!");
      await user.click(bookButton);

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith(
          "/confirmation",
          expect.any(Object)
        );
      });
    });

    it("ska kunna boka 3 banor med 10 spelare", async () => {
      // Testar att användaren kan reservera flera banor (acceptanskriterium 3)
      const user = userEvent.setup();

      const mockResponse = {
        bookingDetails: {
          when: "2023-12-25T18:00",
          lanes: 3,
          people: 10,
          shoes: ["42", "42", "42", "42", "42", "42", "42", "42", "42", "42"],
          bookingId: "STR5678",
          price: 1300,
        },
      };

      global.fetch.mockResolvedValueOnce({
        json: async () => mockResponse,
      });

      renderBooking();

      const dateInput = screen.getByLabelText("Date");
      const timeInput = screen.getByLabelText("Time");
      const peopleInput = screen.getByLabelText("Number of awesome bowlers");
      const lanesInput = screen.getByLabelText("Number of lanes");

      await user.type(dateInput, "2023-12-25");
      await user.type(timeInput, "18:00");
      await user.type(peopleInput, "10");
      await user.type(lanesInput, "3");

      const addShoeButton = screen.getByText("+");
      for (let i = 0; i < 10; i++) {
        await user.click(addShoeButton);
      }

      const shoeInputs = screen.getAllByLabelText(/Shoe size \/ person/);
      for (const input of shoeInputs) {
        await user.type(input, "42");
      }

      const bookButton = screen.getByText("strIIIIIike!");
      await user.click(bookButton);

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith(
          "/confirmation",
          expect.any(Object)
        );
      });
    });
  });

  // User story 2 - Acceptanskriterium 4:
  // Om användaren försöker slutföra bokningen utan att ange skostorlek för en spelare, ska systemet visa ett felmeddelande
  describe("Acceptanskriterium (Skostorlekar) 4: Felmeddelande om skostorlek saknas", () => {
    it("ska visa felmeddelande om skostorlek saknas för en spelare", async () => {
      // Testar att systemet kräver att alla skor har storlekar angivna
      const user = userEvent.setup();
      renderBooking();

      // Fyll i bokningsdetaljer
      const dateInput = screen.getByLabelText("Date");
      const timeInput = screen.getByLabelText("Time");
      const peopleInput = screen.getByLabelText("Number of awesome bowlers");
      const lanesInput = screen.getByLabelText("Number of lanes");

      await user.type(dateInput, "2023-12-25");
      await user.type(timeInput, "18:00");
      await user.type(peopleInput, "2");
      await user.type(lanesInput, "1");

      // Lägg till 2 skor men fyll bara i en storlek
      const addShoeButton = screen.getByText("+");
      await user.click(addShoeButton);
      await user.click(addShoeButton);

      const shoeInputs = screen.getAllByLabelText(/Shoe size \/ person/);
      await user.type(shoeInputs[0], "42"); // Fyll bara i första skon

      const bookButton = screen.getByText("strIIIIIike!");
      await user.click(bookButton);

      await waitFor(() => {
        expect(
          screen.getByText("Alla skor måste vara ifyllda")
        ).toBeInTheDocument();
      });
    });

    it("ska visa felmeddelande om alla skostorlekar saknas", async () => {
      // Testar att systemet kräver skostorlekar om skor har lagts till
      const user = userEvent.setup();
      renderBooking();

      // Fyll i bokningsdetaljer
      const dateInput = screen.getByLabelText("Date");
      const timeInput = screen.getByLabelText("Time");
      const peopleInput = screen.getByLabelText("Number of awesome bowlers");
      const lanesInput = screen.getByLabelText("Number of lanes");

      await user.type(dateInput, "2023-12-25");
      await user.type(timeInput, "18:00");
      await user.type(peopleInput, "3");
      await user.type(lanesInput, "1");

      // Lägg till 3 skor men fyll inte i några storlekar
      const addShoeButton = screen.getByText("+");
      await user.click(addShoeButton);
      await user.click(addShoeButton);
      await user.click(addShoeButton);

      const bookButton = screen.getByText("strIIIIIike!");
      await user.click(bookButton);

      await waitFor(() => {
        expect(
          screen.getByText("Alla skor måste vara ifyllda")
        ).toBeInTheDocument();
      });
    });

    it("ska INTE visa felmeddelande om alla skostorlekar är ifyllda", async () => {
      // Testar att bokning går igenom när alla skostorlekar är angivna
      const user = userEvent.setup();

      const mockResponse = {
        bookingDetails: {
          when: "2023-12-25T18:00",
          lanes: 1,
          people: 2,
          shoes: ["40", "42"],
          bookingId: "STR1234",
          price: 340,
        },
      };

      global.fetch.mockResolvedValueOnce({
        json: async () => mockResponse,
      });

      renderBooking();

      const dateInput = screen.getByLabelText("Date");
      const timeInput = screen.getByLabelText("Time");
      const peopleInput = screen.getByLabelText("Number of awesome bowlers");
      const lanesInput = screen.getByLabelText("Number of lanes");

      await user.type(dateInput, "2023-12-25");
      await user.type(timeInput, "18:00");
      await user.type(peopleInput, "2");
      await user.type(lanesInput, "1");

      // Lägg till 2 skor och fyll i båda storlekarna
      const addShoeButton = screen.getByText("+");
      await user.click(addShoeButton);
      await user.click(addShoeButton);

      const shoeInputs = screen.getAllByLabelText(/Shoe size \/ person/);
      await user.type(shoeInputs[0], "40");
      await user.type(shoeInputs[1], "42");

      const bookButton = screen.getByText("strIIIIIike!");
      await user.click(bookButton);

      await waitFor(() => {
        expect(
          screen.queryByText("Alla skor måste vara ifyllda")
        ).not.toBeInTheDocument();
        expect(mockNavigate).toHaveBeenCalledWith(
          "/confirmation",
          expect.any(Object)
        );
      });
    });
  });

  // User story 2 - Acceptanskriterium 5:
  // Om antalet personer och skor inte matchas ska ett felmeddelande visas
  describe("Acceptanskriterium (Skostorlekar) 5: Felmeddelande om antal skor inte matchar antal personer", () => {
    it("ska visa felmeddelande om färre skor än personer", async () => {
      // Testar att antalet skor måste matcha antalet personer
      const user = userEvent.setup();
      renderBooking();

      // Fyll i bokningsdetaljer för 4 personer
      const dateInput = screen.getByLabelText("Date");
      const timeInput = screen.getByLabelText("Time");
      const peopleInput = screen.getByLabelText("Number of awesome bowlers");
      const lanesInput = screen.getByLabelText("Number of lanes");

      await user.type(dateInput, "2023-12-25");
      await user.type(timeInput, "18:00");
      await user.type(peopleInput, "4");
      await user.type(lanesInput, "1");

      // Lägg bara till 2 skor istället för 4
      const addShoeButton = screen.getByText("+");
      await user.click(addShoeButton);
      await user.click(addShoeButton);

      const shoeInputs = screen.getAllByLabelText(/Shoe size \/ person/);
      for (const input of shoeInputs) {
        await user.type(input, "42");
      }

      const bookButton = screen.getByText("strIIIIIike!");
      await user.click(bookButton);

      await waitFor(() => {
        expect(
          screen.getByText(
            "Antalet skor måste stämma överens med antal spelare"
          )
        ).toBeInTheDocument();
      });
    });

    it("ska visa felmeddelande om fler skor än personer", async () => {
      // Testar att man inte kan lägga till fler skor än personer
      const user = userEvent.setup();
      renderBooking();

      // Fyll i bokningsdetaljer för 2 personer
      const dateInput = screen.getByLabelText("Date");
      const timeInput = screen.getByLabelText("Time");
      const peopleInput = screen.getByLabelText("Number of awesome bowlers");
      const lanesInput = screen.getByLabelText("Number of lanes");

      await user.type(dateInput, "2023-12-25");
      await user.type(timeInput, "18:00");
      await user.type(peopleInput, "2");
      await user.type(lanesInput, "1");

      // Lägg till 4 skor istället för 2
      const addShoeButton = screen.getByText("+");
      await user.click(addShoeButton);
      await user.click(addShoeButton);
      await user.click(addShoeButton);
      await user.click(addShoeButton);

      const shoeInputs = screen.getAllByLabelText(/Shoe size \/ person/);
      for (const input of shoeInputs) {
        await user.type(input, "42");
      }

      const bookButton = screen.getByText("strIIIIIike!");
      await user.click(bookButton);

      await waitFor(() => {
        expect(
          screen.getByText(
            "Antalet skor måste stämma överens med antal spelare"
          )
        ).toBeInTheDocument();
      });
    });

    it("ska INTE visa felmeddelande om antalet skor matchar antalet personer", async () => {
      // Testar att bokning går igenom när antal skor = antal personer
      const user = userEvent.setup();

      const mockResponse = {
        bookingDetails: {
          when: "2023-12-25T18:00",
          lanes: 1,
          people: 3,
          shoes: ["38", "40", "42"],
          bookingId: "STR5678",
          price: 460,
        },
      };

      global.fetch.mockResolvedValueOnce({
        json: async () => mockResponse,
      });

      renderBooking();

      const dateInput = screen.getByLabelText("Date");
      const timeInput = screen.getByLabelText("Time");
      const peopleInput = screen.getByLabelText("Number of awesome bowlers");
      const lanesInput = screen.getByLabelText("Number of lanes");

      await user.type(dateInput, "2023-12-25");
      await user.type(timeInput, "18:00");
      await user.type(peopleInput, "3");
      await user.type(lanesInput, "1");

      // Lägg till exakt 3 skor för 3 personer
      const addShoeButton = screen.getByText("+");
      await user.click(addShoeButton);
      await user.click(addShoeButton);
      await user.click(addShoeButton);

      const shoeInputs = screen.getAllByLabelText(/Shoe size \/ person/);
      await user.type(shoeInputs[0], "38");
      await user.type(shoeInputs[1], "40");
      await user.type(shoeInputs[2], "42");

      const bookButton = screen.getByText("strIIIIIike!");
      await user.click(bookButton);

      await waitFor(() => {
        expect(
          screen.queryByText(
            "Antalet skor måste stämma överens med antal spelare"
          )
        ).not.toBeInTheDocument();
        expect(mockNavigate).toHaveBeenCalledWith(
          "/confirmation",
          expect.any(Object)
        );
      });
    });
  });
});
