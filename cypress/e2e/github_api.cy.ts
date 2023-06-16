describe('GitHub API Tests', () => {
  it('should retrieve user repos', () => {
    cy.request({
      method: 'GET',
      url: 'https://api.github.com/user/repos',
      headers: {
        Accept: 'application/vnd.github.v3+json',
        Authorization: `token ${Cypress.env('GITHUB_TOKEN')}`,
      },
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.length(30);
    });
  });

  // get specific repo
  it('should retrieve a specific repo', () => {
    cy.request({
      method: 'GET',
      url: 'https://api.github.com/repos/cypress-io/cypress',
      headers: {
        Accept: 'application/vnd.github.v3+json',
        Authorization: `token ${Cypress.env('GITHUB_TOKEN')}`,
      },
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.name).to.eq('cypress');
    });
  });

  // issues

  it('should retrieve issues', () => {
    cy.request({
      method: 'GET',
      url: 'https://api.github.com/repos/cypress-io/cypress/issues',
      headers: {
        Accept: 'application/vnd.github.v3+json',
        Authorization: `token ${Cypress.env('GITHUB_TOKEN')}`,
      },
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.length(30);
    });
  });
});



