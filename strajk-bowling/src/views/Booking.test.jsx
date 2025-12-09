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

User Story 3 - Ta bort skostorlek:
2. När användaren tar bort skostorleken för en spelare ska systemet uppdatera bokningen
   så att inga skor längre är bokade för den spelaren
3. Om användaren tar bort skostorleken ska systemet inte inkludera den spelaren i skorantalet
   och priset för skor i den totala bokningssumman
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

  // Hjälpfunktion för att fylla i bokningsformulär
  const fillBookingForm = async (
    user,
    { date, time, people, lanes, shoes = 0, fillShoes = false }
  ) => {
    if (date) await user.type(screen.getByLabelText("Date"), date);
    if (time) await user.type(screen.getByLabelText("Time"), time);
    if (people)
      await user.type(
        screen.getByLabelText("Number of awesome bowlers"),
        people.toString()
      );
    if (lanes)
      await user.type(
        screen.getByLabelText("Number of lanes"),
        lanes.toString()
      );

    if (shoes > 0) {
      const addShoeButton = screen.getByText("+");
      for (let i = 0; i < shoes; i++) {
        await user.click(addShoeButton);
      }

      if (fillShoes) {
        const shoeInputs = screen.getAllByLabelText(/Shoe size \/ person/);
        for (const input of shoeInputs) {
          await user.type(input, "42");
        }
      }
    }
  };

  // User Story 1 - Acceptanskriterium 4:
  // Ifall användaren inte fyller i något av ovanstående ska ett felmeddelande visas
  describe("User Story 1 - Acceptanskriterium 4: Felmeddelande om fält inte är ifyllda", () => {
    it("ska visa felmeddelande om inget fält är ifyllt", async () => {
      const user = userEvent.setup();
      renderBooking();
      await user.click(screen.getByText("strIIIIIike!"));

      await waitFor(() => {
        expect(
          screen.getByText("Alla fälten måste vara ifyllda")
        ).toBeInTheDocument();
      });
    });

    it("ska visa felmeddelande om datum saknas", async () => {
      const user = userEvent.setup();
      renderBooking();
      await fillBookingForm(user, {
        time: "18:00",
        people: 4,
        lanes: 1,
        shoes: 4,
        fillShoes: true,
      });
      await user.click(screen.getByText("strIIIIIike!"));

      await waitFor(() => {
        expect(
          screen.getByText("Alla fälten måste vara ifyllda")
        ).toBeInTheDocument();
      });
    });

    it("ska visa felmeddelande om tid saknas", async () => {
      const user = userEvent.setup();
      renderBooking();
      await fillBookingForm(user, { date: "2023-12-25", people: 4, lanes: 1 });
      await user.click(screen.getByText("strIIIIIike!"));

      await waitFor(() => {
        expect(
          screen.getByText("Alla fälten måste vara ifyllda")
        ).toBeInTheDocument();
      });
    });

    it("ska visa felmeddelande om antal spelare saknas", async () => {
      const user = userEvent.setup();
      renderBooking();
      await fillBookingForm(user, {
        date: "2023-12-25",
        time: "18:00",
        lanes: 1,
      });
      await user.click(screen.getByText("strIIIIIike!"));

      await waitFor(() => {
        expect(
          screen.getByText("Alla fälten måste vara ifyllda")
        ).toBeInTheDocument();
      });
    });

    it("ska visa felmeddelande om antal banor saknas", async () => {
      const user = userEvent.setup();
      renderBooking();
      await fillBookingForm(user, {
        date: "2023-12-25",
        time: "18:00",
        people: 4,
      });
      await user.click(screen.getByText("strIIIIIike!"));

      await waitFor(() => {
        expect(
          screen.getByText("Alla fälten måste vara ifyllda")
        ).toBeInTheDocument();
      });
    });
  });

  // User Story 1 - Acceptanskriterium 5:
  // Om det inte finns tillräckligt med lediga banor för det angivna antalet spelare,
  // ska användaren få ett felmeddelande
  describe("User Story 1 - Acceptanskriterium 5: Felmeddelande om inte tillräckligt med banor", () => {
    it("ska visa felmeddelande om 5 spelare bokar 1 bana (max 4 per bana)", async () => {
      const user = userEvent.setup();
      renderBooking();
      await fillBookingForm(user, {
        date: "2023-12-25",
        time: "18:00",
        people: 5,
        lanes: 1,
        shoes: 5,
        fillShoes: true,
      });
      await user.click(screen.getByText("strIIIIIike!"));

      await waitFor(() => {
        expect(
          screen.getByText("Det får max vara 4 spelare per bana")
        ).toBeInTheDocument();
      });
    });

    it("ska visa felmeddelande om 9 spelare bokar 2 banor (max 8 spelare)", async () => {
      const user = userEvent.setup();
      renderBooking();
      await fillBookingForm(user, {
        date: "2023-12-25",
        time: "18:00",
        people: 9,
        lanes: 2,
        shoes: 9,
        fillShoes: true,
      });
      await user.click(screen.getByText("strIIIIIike!"));

      await waitFor(() => {
        expect(
          screen.getByText("Det får max vara 4 spelare per bana")
        ).toBeInTheDocument();
      });
    });

    it("ska INTE visa felmeddelande om 4 spelare bokar 1 bana (exakt max)", async () => {
      const user = userEvent.setup();
      global.fetch.mockResolvedValueOnce({
        json: async () => ({
          bookingDetails: {
            when: "2023-12-25T18:00",
            lanes: 1,
            people: 4,
            shoes: ["42", "42", "42", "42"],
            bookingId: "STR1234",
            price: 580,
          },
        }),
      });

      renderBooking();
      await fillBookingForm(user, {
        date: "2023-12-25",
        time: "18:00",
        people: 4,
        lanes: 1,
        shoes: 4,
        fillShoes: true,
      });
      await user.click(screen.getByText("strIIIIIike!"));

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
      const user = userEvent.setup();
      global.fetch.mockResolvedValueOnce({
        json: async () => ({
          bookingDetails: {
            when: "2023-12-25T18:00",
            lanes: 2,
            people: 8,
            shoes: ["42", "42", "42", "42", "42", "42", "42", "42"],
            bookingId: "STR1234",
            price: 1060,
          },
        }),
      });

      renderBooking();
      await fillBookingForm(user, {
        date: "2023-12-25",
        time: "18:00",
        people: 8,
        lanes: 2,
        shoes: 8,
        fillShoes: true,
      });
      await user.click(screen.getByText("strIIIIIike!"));

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
      const user = userEvent.setup();
      global.fetch.mockResolvedValueOnce({
        json: async () => ({
          bookingDetails: {
            when: "2023-12-25T18:00",
            lanes: 1,
            people: 1,
            shoes: ["42"],
            bookingId: "STR1234",
            price: 220,
          },
        }),
      });

      renderBooking();
      await fillBookingForm(user, {
        date: "2023-12-25",
        time: "18:00",
        people: 1,
        lanes: 1,
        shoes: 1,
        fillShoes: true,
      });
      await user.click(screen.getByText("strIIIIIike!"));

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith(
          "/confirmation",
          expect.any(Object)
        );
      });
    });

    it("ska kunna boka 3 banor med 10 spelare", async () => {
      const user = userEvent.setup();
      global.fetch.mockResolvedValueOnce({
        json: async () => ({
          bookingDetails: {
            when: "2023-12-25T18:00",
            lanes: 3,
            people: 10,
            shoes: ["42", "42", "42", "42", "42", "42", "42", "42", "42", "42"],
            bookingId: "STR5678",
            price: 1300,
          },
        }),
      });

      renderBooking();
      await fillBookingForm(user, {
        date: "2023-12-25",
        time: "18:00",
        people: 10,
        lanes: 3,
        shoes: 10,
        fillShoes: true,
      });
      await user.click(screen.getByText("strIIIIIike!"));

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
      const user = userEvent.setup();
      renderBooking();
      await fillBookingForm(user, {
        date: "2023-12-25",
        time: "18:00",
        people: 2,
        lanes: 1,
        shoes: 2,
        fillShoes: false,
      });

      const shoeInputs = screen.getAllByLabelText(/Shoe size \/ person/);
      await user.type(shoeInputs[0], "42");

      await user.click(screen.getByText("strIIIIIike!"));

      await waitFor(() => {
        expect(
          screen.getByText("Alla skor måste vara ifyllda")
        ).toBeInTheDocument();
      });
    });

    it("ska visa felmeddelande om alla skostorlekar saknas", async () => {
      const user = userEvent.setup();
      renderBooking();
      await fillBookingForm(user, {
        date: "2023-12-25",
        time: "18:00",
        people: 3,
        lanes: 1,
        shoes: 3,
        fillShoes: false,
      });
      await user.click(screen.getByText("strIIIIIike!"));

      await waitFor(() => {
        expect(
          screen.getByText("Alla skor måste vara ifyllda")
        ).toBeInTheDocument();
      });
    });

    it("ska INTE visa felmeddelande om alla skostorlekar är ifyllda", async () => {
      const user = userEvent.setup();
      global.fetch.mockResolvedValueOnce({
        json: async () => ({
          bookingDetails: {
            when: "2023-12-25T18:00",
            lanes: 1,
            people: 2,
            shoes: ["40", "42"],
            bookingId: "STR1234",
            price: 340,
          },
        }),
      });

      renderBooking();
      await fillBookingForm(user, {
        date: "2023-12-25",
        time: "18:00",
        people: 2,
        lanes: 1,
        shoes: 2,
        fillShoes: true,
      });
      await user.click(screen.getByText("strIIIIIike!"));

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

  // User Story 2 - Acceptanskriterium 5:
  // Om antalet personer och skor inte matchas ska ett felmeddelande visas
  describe("User Story 2 - Acceptanskriterium 5: Antal skor måste matcha antal personer", () => {
    it("ska visa felmeddelande om färre skor än personer", async () => {
      const user = userEvent.setup();
      renderBooking();
      await fillBookingForm(user, {
        date: "2023-12-25",
        time: "18:00",
        people: 4,
        lanes: 1,
        shoes: 2,
        fillShoes: true,
      });
      await user.click(screen.getByText("strIIIIIike!"));

      await waitFor(() => {
        expect(
          screen.getByText(
            "Antalet skor måste stämma överens med antal spelare"
          )
        ).toBeInTheDocument();
      });
    });

    it("ska visa felmeddelande om fler skor än personer", async () => {
      const user = userEvent.setup();
      renderBooking();
      await fillBookingForm(user, {
        date: "2023-12-25",
        time: "18:00",
        people: 2,
        lanes: 1,
        shoes: 4,
        fillShoes: true,
      });
      await user.click(screen.getByText("strIIIIIike!"));

      await waitFor(() => {
        expect(
          screen.getByText(
            "Antalet skor måste stämma överens med antal spelare"
          )
        ).toBeInTheDocument();
      });
    });

    it("ska INTE visa felmeddelande om antalet skor matchar antalet personer", async () => {
      const user = userEvent.setup();
      global.fetch.mockResolvedValueOnce({
        json: async () => ({
          bookingDetails: {
            when: "2023-12-25T18:00",
            lanes: 1,
            people: 3,
            shoes: ["38", "40", "42"],
            bookingId: "STR5678",
            price: 460,
          },
        }),
      });

      renderBooking();
      await fillBookingForm(user, {
        date: "2023-12-25",
        time: "18:00",
        people: 3,
        lanes: 1,
        shoes: 3,
        fillShoes: true,
      });
      await user.click(screen.getByText("strIIIIIike!"));

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

  // User Story 3 - Acceptanskriterium 2 & 3:
  // När användaren tar bort skostorleken för en spelare ska systemet uppdatera bokningen
  // så att inga skor längre är bokade för den spelaren.
  // Borttagna skor ska inte inkluderas i skorantalet och priset.
  describe("User Story 3 - Acceptanskriterium 2 & 3: Ta bort skor och uppdatera bokning", () => {
    it("ska kunna ta bort skor efter att ha lagt till dem", async () => {
      // Testar att användaren kan ta bort skor som de tidigare lagt till
      // Acceptanskriterium 2: Systemet ska uppdatera bokningen när skor tas bort
      const user = userEvent.setup();
      renderBooking();

      // Lägg till 4 skor
      const addShoeButton = screen.getByText("+");
      await user.click(addShoeButton);
      await user.click(addShoeButton);
      await user.click(addShoeButton);
      await user.click(addShoeButton);

      // Verifiera att 4 skor finns
      let shoeInputs = screen.getAllByLabelText(/Shoe size \/ person/);
      expect(shoeInputs).toHaveLength(4);

      // Ta bort en sko
      const removeButtons = screen.getAllByText("-");
      await user.click(removeButtons[3]); // Ta bort den sista

      // Verifiera att bara 3 skor finns kvar (systemet har uppdaterat bokningen)
      shoeInputs = screen.getAllByLabelText(/Shoe size \/ person/);
      expect(shoeInputs).toHaveLength(3);
    });

    it("ska kunna korrigera antal skor genom att ta bort för många tillagda skor", async () => {
      // Testar att användaren kan korrigera om de råkat lägga till för många skor
      // Acceptanskriterium 3: Borttagna skor ska inte inkluderas i skorantalet
      const user = userEvent.setup();
      const mockResponse = {
        bookingDetails: {
          when: "2023-12-25T18:00",
          lanes: 1,
          people: 2,
          shoes: ["42", "44"],
          bookingId: "STR9999",
          price: 360,
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

      // Råka lägga till 4 skor istället för 2
      const addShoeButton = screen.getByText("+");
      await user.click(addShoeButton);
      await user.click(addShoeButton);
      await user.click(addShoeButton);
      await user.click(addShoeButton);

      let shoeInputs = screen.getAllByLabelText(/Shoe size \/ person/);
      expect(shoeInputs).toHaveLength(4);

      // Ta bort 2 skor för att matcha antal personer (2)
      let removeButtons = screen.getAllByText("-");
      await user.click(removeButtons[3]);
      await user.click(removeButtons[2]);

      // Fyll i de 2 kvarvarande skorna
      shoeInputs = screen.getAllByLabelText(/Shoe size \/ person/);
      expect(shoeInputs).toHaveLength(2);
      await user.type(shoeInputs[0], "42");
      await user.type(shoeInputs[1], "44");

      const bookButton = screen.getByText("strIIIIIike!");
      await user.click(bookButton);

      // Bokningen ska gå igenom nu när antal skor = antal personer
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

    it("ska inte inkludera borttagna skor i slutlig bokning", async () => {
      // Testar att borttagna skor inte räknas med i priset eller skorantalet
      // Acceptanskriterium 3: Borttagna skor ska inte vara inkluderade
      const user = userEvent.setup();

      const mockResponse = {
        bookingDetails: {
          when: "2023-12-25T18:00",
          lanes: 1,
          people: 3,
          shoes: ["38", "40", "42"],
          bookingId: "STR1111",
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

      // Lägg till 5 skor först
      const addShoeButton = screen.getByText("+");
      for (let i = 0; i < 5; i++) {
        await user.click(addShoeButton);
      }

      let shoeInputs = screen.getAllByLabelText(/Shoe size \/ person/);
      expect(shoeInputs).toHaveLength(5);

      // Ta bort 2 skor så att bara 3 kvarstår (lika med antal personer)
      let removeButtons = screen.getAllByText("-");
      await user.click(removeButtons[4]);
      await user.click(removeButtons[3]);

      // Fyll i de 3 kvarvarande skorna
      shoeInputs = screen.getAllByLabelText(/Shoe size \/ person/);
      await user.type(shoeInputs[0], "38");
      await user.type(shoeInputs[1], "40");
      await user.type(shoeInputs[2], "42");

      const bookButton = screen.getByText("strIIIIIike!");
      await user.click(bookButton);

      // Verifiera att bokningen går igenom med bara 3 skor (de 2 borttagna räknas inte)
      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith(
          "/confirmation",
          expect.any(Object)
        );
      });
    });
  });
});
