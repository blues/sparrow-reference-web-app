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

  it('responds with 404 if Gateway UID is invalid', () => {
    // Send an invalid UID to Notehub
    cy.request({ 
      method: 'GET',
      url: `/api/gateways/INVALID`, 
      failOnStatusCode: false 
    }).then(response => {
      // Notehub response incdicates resource doesn't exist
      expect(response.status).to.eq(404);
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
});