describe('Sistema de Cupons de Desconto', () => {
  beforeEach(() => {
    cy.login('user@test.com', 'user123');
    cy.visit('http://localhost:3001/checkout');
  });

  it('deve aplicar cupom percentual', () => {
    cy.get('#coupon-code').type('WELCOME10');
    cy.get('#apply-coupon-btn').click();
    cy.contains('Cupom aplicado: WELCOME10').should('be.visible');
  });

  it('deve aplicar cupom de valor fixo', () => {
    cy.get('#coupon-code').type('FIXED50');
    cy.get('#apply-coupon-btn').click();
    cy.contains('Cupom aplicado').should('be.visible');
  });

  it('deve alertar acerca necessidade de inserir codigo de cupom', () => {
    cy.get('#apply-coupon-btn').click();
    cy.contains('Digite um código de cupom').should('be.visible');
  });

  it('deve rejeitar código de cupom inválido', () => {
    cy.get('#coupon-code').type('inválido');
    cy.get('#apply-coupon-btn').click();
    cy.contains('Invalid coupon code').should('be.visible');
  });

  it('deve aceitar código de cupom com letras minusculas', () => {
    cy.get('#coupon-code').type('fixed50');
    cy.get('#apply-coupon-btn').click();
    cy.contains('Cupom aplicado').should('be.visible');
  });

  it('deve rejeitar cupom expirado', () => {
    cy.get('#coupon-code').type('EXPIRED');
    cy.get('#apply-coupon-btn').click();
    cy.contains('Coupon is expired').should('be.visible');
  });
});