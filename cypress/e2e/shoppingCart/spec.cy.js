describe('Carrinho de Compras', () => {
  beforeEach(() => {
    cy.login('user@test.com', 'user123');
    cy.visit('/');
  });

  it('deve adicionar múltiplos produtos ao carrinho', () => {
    cy.get('.produto').eq(0).find('.comprar-btn').click();
    cy.get('.produto').eq(1).find('.comprar-btn').click();
    cy.visit('/carrinho');
    cy.get('.item-carrinho').should('have.length.at.least', 2);
  });

  it('deve validar quantidade vs estoque', () => {
    cy.get('.produto').first().as('produto');
    cy.get('@produto').find('.estoque').invoke('text').then((estoque) => {
      for (let i = 0; i <= Number(estoque); i++) {
        cy.get('@produto').find('.comprar-btn').click();
      }
      cy.get('@produto').find('.comprar-btn').should('be.disabled');
    });
  });

  it('deve limpar carrinho após checkout', () => {
    cy.get('.produto').first().find('.comprar-btn').click();
    cy.visit('/checkout');
    cy.get('#finalizar-compra').click();
    cy.visit('/carrinho');
    cy.get('.item-carrinho').should('have.length', 0);
  });
});