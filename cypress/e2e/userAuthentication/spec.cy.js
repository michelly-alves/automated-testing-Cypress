describe('template spec', () => {
  it('passes', () => {
    cy.visit('http://localhost:3001/')
  })
})

describe('Autenticação de Usuários', () => {
  let user;
  before(() => {
    cy.fixture('example').then((users) => {
      user = users.find(u => u.role === 'user');
    });
  });

  it('deve permitir login com credenciais válidas', () => {
    cy.visit('http://localhost:3001/login');
    cy.login(user.email, user.password);
    cy.contains('Sair').should('be.visible');
  });

  it('deve bloquear login com credenciais inválidas', () => {
    cy.visit('http://localhost:3001/login');
    cy.get('#email').type(user.email);
    cy.get('#password').type('senhaerrada');
    cy.get('#login-btn').click();
    
    cy.on('window:alert', (str) => {
    expect(str).to.equal('Invalid credentials');
  });

    cy.url().should('include', '/login');
  });

  it('deve permitir logout', () => {
    cy.login(user.email, user.password);
    cy.contains('Sair').click();
    cy.url().should('include', '/login');
    cy.contains('Entrar').should('be.visible');
  });

   it('deve bloquear login com tentativa de login com dados nulos', () => {
    cy.visit('http://localhost:3001/login');
    cy.get('#login-btn').click();
    
    cy.on('window:alert', (str) => {
    expect(str).to.equal('Email and password are required');
  });

  });


});

describe('Sessões persistentes com localStorage', () => {
  let user;
  before(() => {
    cy.fixture('example').then((users) => {
      user = users.find(u => u.role === 'user');
    });
  });

  it('deve salvar sessão no localStorage após login', () => {
    cy.visit('http://localhost:3001/login');
    cy.login(user.email, user.password);
    cy.window().then((win) => {
      expect(win.localStorage.getItem('token')).to.exist;
    });
  });

  it('deve manter usuário logado após reload', () => {
    cy.login(user.email, user.password);
    cy.reload();
    cy.contains('Sair').should('be.visible');
  });
});

