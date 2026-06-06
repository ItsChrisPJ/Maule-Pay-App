(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin===`use-credentials`?t.credentials=`include`:e.crossOrigin===`anonymous`?t.credentials=`omit`:t.credentials=`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e={user:{name:`Carlos Miranda`,email:`carlos.m@example.com`,rut:`18.234.567-8`},balance:125e4,escrow:45e4,transactions:[{id:`TX-9923`,merchant:`TechStore Talca`,icon:`bx-laptop`,date:`Hoy, 14:30`,amount:35e4,status:`escrow`},{id:`TX-9922`,merchant:`Serv. Automotriz Curicó`,icon:`bx-wrench`,date:`Ayer, 09:15`,amount:1e5,status:`escrow`},{id:`TX-9921`,merchant:`Boutique Linares`,icon:`bx-closet`,date:`25 May, 16:45`,amount:45e4,status:`done`}],cards:[{id:1,type:`Visa`,last4:`4512`,bank:`Banco de Chile`}]},t=e=>`$`+e.toLocaleString(`es-CL`);document.querySelector(`#app`).innerHTML=`
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
`;var n=document.getElementById(`view-container`),r=document.getElementById(`page-title`),i=document.getElementById(`toast-msg`),a=e=>{i.innerHTML=`<i class='bx bxs-check-circle'></i> ${e}`,i.classList.add(`show`),setTimeout(()=>i.classList.remove(`show`),3e3)},o={auth:()=>`
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
    `,dashboard:()=>{r.textContent=`Maule-Pay`;let n=e.transactions.slice(0,3).map(e=>{let n=e.status===`escrow`;return`
        <div class="list-item">
          <div class="item-icon"><i class='bx ${e.icon}'></i></div>
          <div class="item-details">
            <div class="item-title">${e.merchant}</div>
            <div class="item-subtitle">${e.date}</div>
          </div>
          <div class="item-right">
            <div class="item-amount">${t(e.amount)}</div>
            <div class="status-text ${n?`escrow`:`done`}">
              ${n?`En Custodia`:`Completado`}
            </div>
          </div>
        </div>
      `}).join(``);return n||=`<div style="text-align:center; padding: 20px; color:var(--text-muted);">Sin actividad</div>`,`
      <div class="fade-in">
        <div class="card balance-card">
          <div class="balance-label">Balance Total</div>
          <div class="balance-amount">${t(e.balance)}</div>
          <div class="balance-footer">
            <span>En Custodia: ${t(e.escrow)}</span>
            <i class='bx bx-shield-quarter'></i>
          </div>
        </div>

        <div class="list-header">
          <span>Actividad Reciente</span>
          <span style="font-size:13px; color:var(--primary); font-weight:500; cursor:pointer;" onclick="renderView('transactions')">Ver todo</span>
        </div>
        <div class="card" style="padding: 0 16px;">
          ${n}
        </div>
      </div>
    `},transactions:()=>(r.textContent=`Actividad`,`
      <div class="fade-in">
        <div class="card" style="padding: 0 16px;">
          ${e.transactions.map(e=>{let n=e.status===`escrow`,r=``;return r=n?`<button class="btn-action" onclick="liberarPago('${e.id}')">Liberar Pago</button>`:`<span class="status-text done"><i class='bx bx-check'></i> Listo</span>`,`
        <div class="list-item">
          <div class="item-icon"><i class='bx ${e.icon}'></i></div>
          <div class="item-details">
            <div class="item-title">${e.merchant}</div>
            <div class="item-subtitle">${e.date}</div>
            <div style="margin-top: 6px;">${r}</div>
          </div>
          <div class="item-right">
            <div class="item-amount">${t(e.amount)}</div>
            <div class="status-text ${n?`escrow`:`done`}">
              ${n?`En Custodia`:`Pagado`}
            </div>
          </div>
        </div>
      `}).join(``)}
        </div>
      </div>
    `),wallet:()=>{r.textContent=`Billetera`;let n=e.cards.map(e=>`
      <div class="list-item">
        <div class="item-icon" style="background: #1a1f71; color: white;"><i class='bx bxl-visa'></i></div>
        <div class="item-details">
          <div class="item-title">${e.type} •••• ${e.last4}</div>
          <div class="item-subtitle">${e.bank}</div>
        </div>
      </div>
    `).join(``);return`
      <div class="fade-in">
        <div class="card">
          <div style="font-size: 13px; color: var(--text-muted); margin-bottom: 8px;">Fondos Disponibles para Retiro</div>
          <div style="font-size: 28px; font-weight: 700; margin-bottom: 16px;">${t(e.balance-e.escrow)}</div>
          <button class="btn btn-outline" onclick="retirarFondos()">Retirar al Banco</button>
        </div>

        <div class="list-header">Métodos de Pago</div>
        <div class="card" style="padding: 0 16px;">
          ${n}
          <div class="list-item" style="cursor:pointer;" onclick="agregarTarjeta()">
            <div class="item-icon" style="background: transparent; border: 1px dashed var(--text-muted);"><i class='bx bx-plus'></i></div>
            <div class="item-details">
              <div class="item-title" style="color: var(--primary);">Vincular Tarjeta</div>
            </div>
          </div>
        </div>
      </div>
    `},profile:()=>(r.textContent=`Mi Perfil`,`
      <div class="fade-in">
        <div class="card" style="text-align:center; padding: 32px 16px;">
          <div class="user-avatar" style="width:72px; height:72px; font-size:24px; margin: 0 auto 16px;">
            ${e.user.name.split(` `).map(e=>e[0]).join(``)}
          </div>
          <h2 style="font-size: 20px;">${e.user.name}</h2>
          <p style="color: var(--text-muted); font-size: 14px;">Cuenta Personal</p>
        </div>
        
        <div class="card">
          <div class="form-group">
            <label>Nombre Completo</label>
            <input type="text" id="prof-name" value="${e.user.name}">
          </div>
          <div class="form-group">
            <label>Correo Electrónico</label>
            <input type="email" id="prof-email" value="${e.user.email}">
          </div>
          <div class="form-group">
            <label>RUT</label>
            <input type="text" id="prof-rut" value="${e.user.rut}">
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
    `)},s=`dashboard`;window.renderView=t=>{if(o[t]){n.innerHTML=o[t](),s=t;let r=t===`auth`;if(document.querySelector(`.top-header`).style.display=r?`none`:`flex`,document.querySelector(`.bottom-nav`).style.display=r?`none`:`flex`,document.getElementById(`btn-fab-new`).style.display=r?`none`:`flex`,r?(document.querySelector(`.main-content`).style.paddingBottom=`20px`,document.querySelector(`.main-content`).style.display=`flex`,document.querySelector(`.main-content`).style.alignItems=`center`):(document.querySelector(`.main-content`).style.paddingBottom=``,document.querySelector(`.main-content`).style.display=`block`,document.querySelector(`.main-content`).style.alignItems=``),!r){document.querySelectorAll(`#bottom-nav .nav-item`).forEach(e=>{e.classList.remove(`active`),e.dataset.view===t&&e.classList.add(`active`)});let n=e.user.name.trim().split(` `),r=n.length>1?n[0][0]+n[n.length-1][0]:n[0][0]||`U`;document.getElementById(`header-avatar`).textContent=r.toUpperCase()}}},window.login=()=>{let t=document.getElementById(`auth-name`).value.trim(),n=document.getElementById(`auth-email`).value.trim(),r=document.getElementById(`auth-rut`).value.trim();t&&(e.user.name=t),n&&(e.user.email=n),r&&(e.user.rut=r);let i=document.querySelector(`.auth-container .btn-primary`);i.innerHTML=`<i class='bx bx-loader-alt bx-spin' style="font-size: 20px;"></i> Iniciando sesión...`,i.style.opacity=`0.9`,i.style.transform=`scale(0.97)`,setTimeout(()=>{let e=document.querySelector(`.auth-container`);e&&e.classList.add(`auth-leave`),setTimeout(()=>{renderView(`dashboard`),document.querySelector(`.top-header`).classList.add(`header-enter`),document.querySelector(`.bottom-nav`).classList.add(`nav-enter`);let e=document.querySelector(`#view-container > div`);e&&(e.classList.remove(`fade-in`),e.classList.add(`dashboard-enter`)),a(`Bienvenido a Maule-Pay`),setTimeout(()=>{document.querySelector(`.top-header`).classList.remove(`header-enter`),document.querySelector(`.bottom-nav`).classList.remove(`nav-enter`)},600)},350)},500)},window.liberarPago=t=>{let n=e.transactions.find(e=>e.id===t);n&&n.status===`escrow`&&(n.status=`done`,e.escrow-=n.amount,e.balance-=n.amount,a(`Fondos liberados al comercio`),renderView(s))},window.guardarPerfil=()=>{e.user.name=document.getElementById(`prof-name`).value,e.user.email=document.getElementById(`prof-email`).value,e.user.rut=document.getElementById(`prof-rut`).value,a(`Perfil actualizado`),renderView(`profile`)},window.retirarFondos=()=>{let n=e.balance-e.escrow;n>0?(e.balance-=n,a(`Se han transferido ${t(n)} a tu banco`),renderView(`wallet`)):a(`No hay fondos disponibles`)},window.agregarTarjeta=()=>{e.cards.push({id:Date.now(),type:`Mastercard`,last4:`9988`,bank:`Banco Santander`}),a(`Tarjeta vinculada con éxito`),renderView(`wallet`)},window.toggleTheme=()=>{document.body.classList.toggle(`dark`);let e=document.body.classList.contains(`dark`),t=document.querySelector(`meta[name="theme-color"]`);t&&t.setAttribute(`content`,e?`#000000`:`#ffffff`),a(e?`Modo Oscuro activado`:`Modo Claro activado`)};var c=document.getElementById(`modal-new-tx`);document.getElementById(`btn-fab-new`).addEventListener(`click`,()=>{c.classList.add(`active`)}),document.querySelectorAll(`.close-modal`).forEach(e=>{e.addEventListener(`click`,()=>{e.closest(`.modal`).classList.remove(`active`)})}),document.querySelectorAll(`.modal`).forEach(e=>{e.addEventListener(`click`,t=>{t.target===e&&e.classList.remove(`active`)})}),document.getElementById(`bottom-nav`).addEventListener(`click`,e=>{let t=e.target.closest(`.nav-item[data-view]`);t&&renderView(t.dataset.view)}),document.getElementById(`btn-submit-tx`).addEventListener(`click`,()=>{let t=document.getElementById(`tx-merchant`).value,n=parseInt(document.getElementById(`tx-amount`).value);if(!t||!n||isNaN(n)){a(`Ingresa datos válidos`);return}let r=document.getElementById(`btn-submit-tx`),i=r.innerHTML;r.innerHTML=`Procesando...`,setTimeout(()=>{e.balance+=n,e.escrow+=n,e.transactions.unshift({id:`TX-`+Math.floor(Math.random()*1e4),merchant:t,icon:`bx-store`,date:`Justo ahora`,amount:n,status:`escrow`}),c.classList.remove(`active`),r.innerHTML=i,document.getElementById(`tx-merchant`).value=``,document.getElementById(`tx-amount`).value=``,a(`Pago retenido en Escrow`),renderView(s)},800)}),renderView(`auth`);