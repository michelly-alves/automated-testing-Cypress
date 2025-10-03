describe('Gestão de Estoque', () => {
  it('deve exibir quantidade disponível de cada produto', () => {
    cy.visit('http://localhost:3001');
    cy.get('#product-list > li').each(($li) => {
      cy.wrap($li).find('.product-info .stock').should('exist').and(($span) => {
        expect($span.text()).to.match(/Estoque: \d+/);
      });
    });
  });

  it('deve desabilitar botão de compra quando sem estoque', () => {
    cy.visit('http://localhost:3001');
    cy.get('#product-list > li').each(($li) => {
      cy.wrap($li).find('.product-info .stock').invoke('text').then((estoqueText) => {
        const estoqueMatch = estoqueText.match(/Estoque: (\d+)/);
        const estoque = estoqueMatch ? Number(estoqueMatch[1]) : null;
        if (estoque === 0) {
          cy.wrap($li).find('button').should('be.disabled');
        } else {
          cy.wrap($li).find('button').should('not.be.disabled');
        }
      });
    });
  });

  it('deve atualizar estoque após compra', () => {
    cy.login('user@test.com', 'user123');
    cy.visit('http://localhost:3001');
    cy.get('#product-list > li').each(($li) => {
      cy.wrap($li).find('.product-info .stock').invoke('text').then((estoqueText) => {
        const estoqueMatch = estoqueText.match(/Estoque: (\d+)/);
        const estoqueAntes = estoqueMatch ? Number(estoqueMatch[1]) : null;
        if (estoqueAntes > 0) {
          cy.wrap($li).find('input[type="number"]').clear().type('1');
          cy.wrap($li).find('button').click();
          // Após a compra, estoque deve diminuir 1
          cy.wrap($li).find('.product-info .stock').should(($spanDepois) => {
            const estoqueMatchDepois = $spanDepois.text().match(/Estoque: (\d+)/);
            const estoqueDepois = estoqueMatchDepois ? Number(estoqueMatchDepois[1]) : null;
            expect(estoqueDepois).to.equal(estoqueAntes - 1);
          });
        }
      });
    });
  });
});