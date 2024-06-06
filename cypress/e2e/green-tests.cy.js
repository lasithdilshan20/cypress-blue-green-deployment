describe('Green Environment Tests', () => {
  beforeEach(() => {
    // Before each test, visit the homepage
    cy.visit('/');
  });

  it('should load the homepage', () => {
    cy.get('h1').should('contain', 'Welcome to Green Environment');
  });

  it('should navigate to the About page', () => {
    cy.get('nav').contains('About').click();
    cy.url().should('include', '/about');
    cy.get('h1').should('contain', 'About Us');
  });

  it('should submit the contact form', () => {
    cy.get('nav').contains('Contact').click();
    cy.url().should('include', '/contact');

    cy.get('form').within(() => {
      cy.get('input[name="name"]').type('John Doe');
      cy.get('input[name="email"]').type('john.doe@example.com');
      cy.get('textarea[name="message"]').type('This is a test message.');
      cy.get('button[type="submit"]').click();
    });

    cy.get('.success-message').should('contain', 'Thank you for your message, John Doe!');
  });
});
