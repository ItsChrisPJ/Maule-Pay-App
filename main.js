// App State
let state = {
  user: {
    name: 'Carlos Miranda',
    email: 'carlos.m@example.com',
    rut: '18.234.567-8'
  },
  balance: 1250000,
  escrow: 450000,
  transactions: [
    { id: 'TX-9923', merchant: 'TechStore Talca', icon: 'bx-laptop', date: 'Hoy, 14:30', amount: 350000, status: 'escrow' },
    { id: 'TX-9922', merchant: 'Serv. Automotriz Curicó', icon: 'bx-wrench', date: 'Ayer, 09:15', amount: 100000, status: 'escrow' },
    { id: 'TX-9921', merchant: 'Boutique Linares', icon: 'bx-closet', date: '25 May, 16:45', amount: 450000, status: 'done' },
  ],
  cards: [
    { id: 1, type: 'Visa', last4: '4512', bank: 'Banco de Chile' }
  ]
};

const formatMoney = (amount) => '$' + amount.toLocaleString('es-CL');

// HTML Shell
document.querySelector('#app').innerHTML = `
  <div class="mobile-wrapper">
    <!-- Header -->
    <header class="top-header">
      <div class="brand-title" id="page-title">Inicio</div>
      <div class="user-avatar" id="header-avatar">CM</div>
    </header>
    
    <!-- Main Scrollable Area -->
    <main class="main-content" id="view-container">
      <!-- Injected Views -->
    </main>
    
    <!-- Bottom Navigation -->
    <nav class="bottom-nav" id="bottom-nav">
      <button class="nav-item active" data-view="dashboard">
        <i class='bx bx-home-alt'></i>
        <span>Inicio</span>
      </button>
      <button class="nav-item" data-view="transactions">
        <i class='bx bx-list-ul'></i>
        <span>Actividad</span>
      </button>
      
      <!-- FAB (Nueva TX) -->
      <button class="nav-item fab-item" id="btn-fab-new">
        <div class="nav-fab"><i class='bx bx-plus'></i></div>
      </button>
      
      <button class="nav-item" data-view="wallet">
        <i class='bx bx-wallet'></i>
        <span>Billetera</span>
      </button>
      <button class="nav-item" data-view="profile">
        <i class='bx bx-user'></i>
        <span>Perfil</span>
      </button>
    </nav>
  </div>

  <!-- Modal: Nueva TX -->
  <div class="modal" id="modal-new-tx">
    <div class="modal-content">
      <div class="drag-handle"></div>
      <div class="modal-header">
        <h3>Pago Seguro (Escrow)</h3>
        <button class="close-modal"><i class='bx bx-x'></i></button>
      </div>
      <div class="form-group">
        <label>Comercio (RUT o Alias)</label>
        <input type="text" id="tx-merchant" placeholder="Ej: TechStore Talca">
      </div>
      <div class="form-group">
        <label>Monto a Pagar ($)</label>
        <input type="number" id="tx-amount" placeholder="0">
      </div>
      <button class="btn btn-primary" id="btn-submit-tx" style="margin-top:24px;">Confirmar Pago Protegido</button>
    </div>
  </div>

  <!-- Toast -->
  <div class="toast" id="toast-msg">Mensaje</div>
`;

const viewContainer = document.getElementById('view-container');
const pageTitle = document.getElementById('page-title');
const toastEl = document.getElementById('toast-msg');

const showToast = (msg) => {
  toastEl.innerHTML = `<i class='bx bxs-check-circle'></i> ${msg}`;
  toastEl.classList.add('show');
  setTimeout(() => toastEl.classList.remove('show'), 3000);
};

// --- Views Renderers ---
const views = {
  auth: () => {
    return `
      <div class="fade-in auth-container" style="width: 100%;">
        <div style="text-align:center; margin-bottom: 40px;">
          <div class="brand-title" style="font-size: 36px; justify-content: center; display: flex; align-items: center; gap: 8px; line-height: 1;">
            <i class='bx bx-shield-quarter' style="color: var(--accent); -webkit-text-fill-color: initial;"></i> Maule-Pay
          </div>
          <p style="color:var(--text-muted); margin-top:8px; font-weight: 500;">Tu dinero en custodia segura</p>
        </div>

        <div class="card" style="padding: 32px 24px; box-shadow: var(--shadow-md);">
          <h2 style="font-size:20px; font-weight:700; margin-bottom:24px; text-align:center;">Ingresar a tu cuenta</h2>
          
          <div class="form-group">
            <label>Nombre Completo</label>
            <input type="text" id="auth-name" placeholder="Ej: Carlos Miranda">
          </div>
          <div class="form-group">
            <label>Correo Electrónico</label>
            <input type="email" id="auth-email" placeholder="correo@ejemplo.com">
          </div>
          <div class="form-group">
            <label>RUT</label>
            <input type="text" id="auth-rut" placeholder="12.345.678-9">
          </div>
          
          <button class="btn btn-primary" onclick="login()" style="margin-top:24px; width: 100%;">
            Entrar a la app <i class='bx bx-right-arrow-alt' style="font-size: 20px;"></i>
          </button>
        </div>
      </div>
    `;
  },
  
  dashboard: () => {
    pageTitle.textContent = 'Maule-Pay';
    
    // Render only first 3 transactions
    let txHtml = state.transactions.slice(0, 3).map(tx => {
      const isEscrow = tx.status === 'escrow';
      return `
        <div class="list-item">
          <div class="item-icon"><i class='bx ${tx.icon}'></i></div>
          <div class="item-details">
            <div class="item-title">${tx.merchant}</div>
            <div class="item-subtitle">${tx.date}</div>
          </div>
          <div class="item-right">
            <div class="item-amount">${formatMoney(tx.amount)}</div>
            <div class="status-text ${isEscrow ? 'escrow' : 'done'}">
              ${isEscrow ? 'En Custodia' : 'Completado'}
            </div>
          </div>
        </div>
      `;
    }).join('');

    if(!txHtml) txHtml = '<div style="text-align:center; padding: 20px; color:var(--text-muted);">Sin actividad</div>';

    return `
      <div class="fade-in">
        <div class="card balance-card">
          <div class="balance-label">Balance Total</div>
          <div class="balance-amount">${formatMoney(state.balance)}</div>
          <div class="balance-footer">
            <span>En Custodia: ${formatMoney(state.escrow)}</span>
            <i class='bx bx-shield-quarter'></i>
          </div>
        </div>

        <div class="list-header">
          <span>Actividad Reciente</span>
          <span style="font-size:13px; color:var(--primary); font-weight:500; cursor:pointer;" onclick="renderView('transactions')">Ver todo</span>
        </div>
        <div class="card" style="padding: 0 16px;">
          ${txHtml}
        </div>
      </div>
    `;
  },
  
  transactions: () => {
    pageTitle.textContent = 'Actividad';
    
    let txHtml = state.transactions.map(tx => {
      const isEscrow = tx.status === 'escrow';
      
      let actionBtn = '';
      if(isEscrow) {
        actionBtn = `<button class="btn-action" onclick="liberarPago('${tx.id}')">Liberar Pago</button>`;
      } else {
        actionBtn = `<span class="status-text done"><i class='bx bx-check'></i> Listo</span>`;
      }

      return `
        <div class="list-item">
          <div class="item-icon"><i class='bx ${tx.icon}'></i></div>
          <div class="item-details">
            <div class="item-title">${tx.merchant}</div>
            <div class="item-subtitle">${tx.date}</div>
            <div style="margin-top: 6px;">${actionBtn}</div>
          </div>
          <div class="item-right">
            <div class="item-amount">${formatMoney(tx.amount)}</div>
            <div class="status-text ${isEscrow ? 'escrow' : 'done'}">
              ${isEscrow ? 'En Custodia' : 'Pagado'}
            </div>
          </div>
        </div>
      `;
    }).join('');

    return `
      <div class="fade-in">
        <div class="card" style="padding: 0 16px;">
          ${txHtml}
        </div>
      </div>
    `;
  },
  
  wallet: () => {
    pageTitle.textContent = 'Billetera';
    
    let cardsHtml = state.cards.map(c => `
      <div class="list-item">
        <div class="item-icon" style="background: #1a1f71; color: white;"><i class='bx bxl-visa'></i></div>
        <div class="item-details">
          <div class="item-title">${c.type} •••• ${c.last4}</div>
          <div class="item-subtitle">${c.bank}</div>
        </div>
      </div>
    `).join('');

    return `
      <div class="fade-in">
        <div class="card">
          <div style="font-size: 13px; color: var(--text-muted); margin-bottom: 8px;">Fondos Disponibles para Retiro</div>
          <div style="font-size: 28px; font-weight: 700; margin-bottom: 16px;">${formatMoney(state.balance - state.escrow)}</div>
          <div style="display:flex; gap:12px;">
            <button class="btn btn-outline" style="flex:1;" onclick="retirarFondos()"><i class='bx bx-export'></i> Retirar</button>
            <button class="btn btn-primary" style="flex:1;" onclick="showToast('Cámara de QR iniciada')"><i class='bx bx-qr-scan'></i> QR</button>
          </div>
        </div>

        <div class="list-header">Métodos de Pago</div>
        <div class="card" style="padding: 0 16px;">
          ${cardsHtml}
          <div class="list-item" style="cursor:pointer;" onclick="agregarTarjeta()">
            <div class="item-icon" style="background: transparent; border: 1px dashed var(--text-muted);"><i class='bx bx-plus'></i></div>
            <div class="item-details">
              <div class="item-title" style="color: var(--primary);">Vincular Tarjeta</div>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  profile: () => {
    pageTitle.textContent = 'Mi Perfil';
    return `
      <div class="fade-in">
        <div class="card" style="text-align:center; padding: 32px 16px;">
          <div class="user-avatar" style="width:72px; height:72px; font-size:24px; margin: 0 auto 16px;">
            ${state.user.name.split(' ').map(n=>n[0]).join('')}
          </div>
          <h2 style="font-size: 20px;">${state.user.name}</h2>
          <p style="color: var(--text-muted); font-size: 14px;">Cuenta Personal</p>
        </div>
        
        <div class="card">
          <div class="form-group">
            <label>Nombre Completo</label>
            <input type="text" id="prof-name" value="${state.user.name}">
          </div>
          <div class="form-group">
            <label>Correo Electrónico</label>
            <input type="email" id="prof-email" value="${state.user.email}">
          </div>
          <div class="form-group">
            <label>RUT</label>
            <input type="text" id="prof-rut" value="${state.user.rut}">
          </div>
          <button class="btn btn-primary" onclick="guardarPerfil()" style="margin-top:8px;">Guardar Cambios</button>
        </div>

        <div class="card" style="margin-top: 16px;">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <div style="font-weight:600; display:flex; align-items:center; gap:8px;">
              <i class='bx bx-moon' style="font-size:20px; color: var(--primary);"></i> Modo Oscuro
            </div>
            <button class="btn-outline" style="padding: 8px 16px; font-size:13px; border-radius:10px;" onclick="toggleTheme()">Cambiar</button>
          </div>
        </div>
      </div>
    `;
  }
};

// --- App Logic & State Mutations ---

let currentView = 'dashboard';

window.renderView = (viewName) => {
  if (views[viewName]) {
    viewContainer.innerHTML = views[viewName]();
    currentView = viewName;
    
    const isAuth = viewName === 'auth';
    document.querySelector('.top-header').style.display = isAuth ? 'none' : 'flex';
    document.querySelector('.bottom-nav').style.display = isAuth ? 'none' : 'flex';
    document.getElementById('btn-fab-new').style.display = isAuth ? 'none' : 'flex';
    
    if (isAuth) {
      document.querySelector('.main-content').style.paddingBottom = '20px';
      document.querySelector('.main-content').style.display = 'flex';
      document.querySelector('.main-content').style.alignItems = 'center';
    } else {
      document.querySelector('.main-content').style.paddingBottom = '';
      document.querySelector('.main-content').style.display = 'block';
      document.querySelector('.main-content').style.alignItems = '';
    }
    
    if (!isAuth) {
      // Update bottom nav
      document.querySelectorAll('#bottom-nav .nav-item').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.view === viewName) btn.classList.add('active');
      });
      
      // Update header avatar
      const parts = state.user.name.trim().split(' ');
      const initials = parts.length > 1 
        ? parts[0][0] + parts[parts.length-1][0] 
        : (parts[0][0] || 'U');
      document.getElementById('header-avatar').textContent = initials.toUpperCase();
    }
  }
};

window.login = () => {
  const name = document.getElementById('auth-name').value.trim();
  const email = document.getElementById('auth-email').value.trim();
  const rut = document.getElementById('auth-rut').value.trim();
  
  if (name) state.user.name = name;
  if (email) state.user.email = email;
  if (rut) state.user.rut = rut;
  
  // Premium button loading effect
  const btn = document.querySelector('.auth-container .btn-primary');
  btn.innerHTML = `<i class='bx bx-loader-alt bx-spin' style="font-size: 20px;"></i> Iniciando sesión...`;
  btn.style.opacity = '0.9';
  btn.style.transform = 'scale(0.97)';
  
  setTimeout(() => {
    // Trigger auth leave animation
    const authContainer = document.querySelector('.auth-container');
    if (authContainer) {
      authContainer.classList.add('auth-leave');
    }
    
    setTimeout(() => {
      renderView('dashboard');
      
      // Add premium enter animations to the new view elements
      document.querySelector('.top-header').classList.add('header-enter');
      document.querySelector('.bottom-nav').classList.add('nav-enter');
      
      const viewCont = document.querySelector('#view-container > div');
      if (viewCont) {
        viewCont.classList.remove('fade-in');
        viewCont.classList.add('dashboard-enter');
      }
      
      showToast('Bienvenido a Maule-Pay');
      
      // Clean up classes after animation so they don't break future renders
      setTimeout(() => {
        document.querySelector('.top-header').classList.remove('header-enter');
        document.querySelector('.bottom-nav').classList.remove('nav-enter');
      }, 600);
      
    }, 350); // Wait for the "leave" animation to almost complete
  }, 500); // Simulated network delay for premium feel
};

window.liberarPago = (txId) => {
  const tx = state.transactions.find(t => t.id === txId);
  if(tx && tx.status === 'escrow') {
    tx.status = 'done';
    state.escrow -= tx.amount;
    state.balance -= tx.amount; // The money leaves the user's total balance and goes to merchant
    showToast('Fondos liberados al comercio');
    renderView(currentView); // Refresh
  }
};

window.guardarPerfil = () => {
  state.user.name = document.getElementById('prof-name').value;
  state.user.email = document.getElementById('prof-email').value;
  state.user.rut = document.getElementById('prof-rut').value;
  showToast('Perfil actualizado');
  renderView('profile');
};

window.retirarFondos = () => {
  const disp = state.balance - state.escrow;
  if(disp > 0) {
    state.balance -= disp;
    showToast(`Se han transferido ${formatMoney(disp)} a tu banco`);
    renderView('wallet');
  } else {
    showToast('No hay fondos disponibles');
  }
};

window.agregarTarjeta = () => {
  state.cards.push({ id: Date.now(), type: 'Mastercard', last4: '9988', bank: 'Banco Santander' });
  showToast('Tarjeta vinculada con éxito');
  renderView('wallet');
};

window.toggleTheme = () => {
  document.body.classList.toggle('dark');
  const isDark = document.body.classList.contains('dark');
  // actualiza el color meta si es posible
  const metaTheme = document.querySelector('meta[name="theme-color"]');
  if (metaTheme) metaTheme.setAttribute('content', isDark ? '#000000' : '#ffffff');
  showToast(isDark ? 'Modo Oscuro activado' : 'Modo Claro activado');
};

// --- Modals & Events ---
const modalNewTx = document.getElementById('modal-new-tx');

document.getElementById('btn-fab-new').addEventListener('click', () => {
  modalNewTx.classList.add('active');
});

document.querySelectorAll('.close-modal').forEach(btn => {
  btn.addEventListener('click', () => {
    btn.closest('.modal').classList.remove('active');
  });
});

document.querySelectorAll('.modal').forEach(mod => {
  mod.addEventListener('click', (e) => {
    if (e.target === mod) mod.classList.remove('active');
  });
});

document.getElementById('bottom-nav').addEventListener('click', (e) => {
  const btn = e.target.closest('.nav-item[data-view]');
  if (btn) renderView(btn.dataset.view);
});

// Create Escrow Transaction
document.getElementById('btn-submit-tx').addEventListener('click', () => {
  const merchantInput = document.getElementById('tx-merchant').value;
  const amountInput = parseInt(document.getElementById('tx-amount').value);
  
  if (!merchantInput || !amountInput || isNaN(amountInput)) {
    showToast('Ingresa datos válidos');
    return;
  }
  
  const btn = document.getElementById('btn-submit-tx');
  const original = btn.innerHTML;
  btn.innerHTML = 'Procesando...';
  
  setTimeout(() => {
    // Deduct from external bank (add to balance, then add to escrow)
    // Actually, when we pay via Escrow, we add it to the platform's escrow balance for this user
    state.balance += amountInput;
    state.escrow += amountInput;
    
    state.transactions.unshift({
      id: 'TX-' + Math.floor(Math.random() * 10000),
      merchant: merchantInput,
      icon: 'bx-store',
      date: 'Justo ahora',
      amount: amountInput,
      status: 'escrow'
    });
    
    modalNewTx.classList.remove('active');
    btn.innerHTML = original;
    document.getElementById('tx-merchant').value = '';
    document.getElementById('tx-amount').value = '';
    
    showToast('Pago retenido en Escrow');
    renderView(currentView);
  }, 800);
});

// Initialize
renderView('auth');
