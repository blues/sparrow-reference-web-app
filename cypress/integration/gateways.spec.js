describe('/api/gateways/[gatewayUID] API Endpoint', () => {
  const gatewayUID = Cypress.env('gatewayUID');

  it('returns a successful response from Notehub', () => {
    cy.request('GET', `/api/gateways/${gatewayUID}`).then(response => {
      // Response is 200 OK
      expect(response.status).to.eq(200);
      expect(response.headers['content-type']).to.eq('application/json; charset=utf-8');
      // Smoke test to see if we got good JSON
      expect(response.body.uid).to.eq(gatewayUID);
    });
  });

  it('returns an error response from Notehub', () => {
    // Send an invalid UID to Notehub
    cy.request('GET', `/api/gateways/invalid`).then(response => {
      // Our API responds with a 200 OK since it did its job
      expect(response.status).to.eq(200);
      // Notehub response incdicates resource doesn't exist
      expect(response.body.code).to.eq(404);
    });
  });

  it('responds with 405 if HTTP method is not GET', () => {
    cy.request({ 
      method: 'POST', 
      url: `/api/gateways/${gatewayUID}`, 
      failOnStatusCode: false 
    }).then(response => {
      // Our API rejects the request method
      expect(response.status).to.eq(405);
    });
  });

  it('responds with 404 if Gateway UID is missing', () => {
    cy.request({ 
      method: 'POST', 
      url: `/api/gateways/`, 
      failOnStatusCode: false 
    }).then(response => {
      // Our API can't find that path
      expect(response.status).to.eq(404);
    });
  });
});