const characters = [
  {
    id: 1,
    name: "Rick Sanchez",
    status: "Alive",
    species: "Human",
    image: "https://rickandmortyapi.com/api/character/avatar/1.jpeg",
    episode: [
      "https://rickandmortyapi.com/api/episode/1",
      "https://rickandmortyapi.com/api/episode/2",
    ],
  },
  {
    id: 2,
    name: "Morty Smith",
    status: "Alive",
    species: "Human",
    image: "https://rickandmortyapi.com/api/character/avatar/2.jpeg",
    episode: [
      "https://rickandmortyapi.com/api/episode/2",
      "https://rickandmortyapi.com/api/episode/3",
    ],
  },
];

describe("character episode comparison", () => {
  beforeEach(() => {
    cy.intercept("GET", "**/api/character?page=1", {
      info: { count: 2, pages: 1, next: null, prev: null },
      results: characters,
    }).as("characters");

    cy.intercept("GET", "**/api/episode/1,2,3", [
      {
        id: 1,
        name: "Pilot",
        air_date: "December 2, 2013",
        episode: "S01E01",
        url: "https://rickandmortyapi.com/api/episode/1",
      },
      {
        id: 2,
        name: "Lawnmower Dog",
        air_date: "December 9, 2013",
        episode: "S01E02",
        url: "https://rickandmortyapi.com/api/episode/2",
      },
      {
        id: 3,
        name: "Anatomy Park",
        air_date: "December 16, 2013",
        episode: "S01E03",
        url: "https://rickandmortyapi.com/api/episode/3",
      },
    ]).as("episodes");

    cy.visit("/");
    cy.wait(["@characters", "@characters"]);
  });

  it("compares two different characters as an end user", () => {
    cy.get('[data-testid="character-explorer-1"]').within(() => {
      cy.get('[data-testid="pagination-current-page"]').should("have.text", "01");
      cy.get('[data-testid="pagination-total-pages"]').should("have.text", "01");
    });
    cy.get('[data-testid="character-explorer-2"]').within(() => {
      cy.get('[data-testid="pagination-current-page"]').should("have.text", "01");
      cy.get('[data-testid="pagination-total-pages"]').should("have.text", "01");
    });
    cy.get('[data-testid="character-explorer-1"]')
      .find('[data-testid="character-card-1"]')
      .should("be.visible");
    cy.get('[data-testid="character-explorer-2"]')
      .find('[data-testid="character-card-2"]')
      .should("be.visible");
    cy.contains("Two selections required").should("be.visible");

    cy.get('[data-testid="character-explorer-1"]')
      .find('[data-testid="character-card-1"]')
      .click();
    cy.get('[data-testid="character-explorer-2"]')
      .find('[data-testid="character-card-1"]')
      .should("be.disabled");
    cy.get('[data-testid="character-explorer-2"]')
      .find('[data-testid="character-card-2"]')
      .click();

    cy.wait("@episodes");
    cy.contains("Two selections required").should("not.exist");

    cy.contains("section", "Rick Sanchez only").within(() => {
      cy.contains("Pilot").should("be.visible");
      cy.contains("Lawnmower Dog").should("not.exist");
    });
    cy.contains("section", "Shared episodes").within(() => {
      cy.contains("Lawnmower Dog").should("be.visible");
    });
    cy.contains("section", "Morty Smith only").within(() => {
      cy.contains("Anatomy Park").should("be.visible");
    });
  });
});
