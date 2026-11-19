// Tracker & Grand Vitara Hub - Controlador Clean & Simulador Visual (Estilo TopoAK)

document.addEventListener("DOMContentLoaded", () => {
  // Estado Global da Aplicação
  const state = {
    currentView: "home", // 'home', 'parts', 'lift', 'stores', 'specs', 'community'
    searchQuery: "",
    selectedSystem: "all",
    showOnlyFavorites: false,
    favorites: JSON.parse(localStorage.getItem("tracker_gv_favorites") || "[]"),
    userContributedParts: JSON.parse(localStorage.getItem("tracker_gv_user_parts") || "[]"),
    activePartModal: null,

    // Estado do Simulador Visual de Pneus & Lift
    simulator: {
      selectedCar: "tracker", // 'tracker' ou 'gv'
      selectedLift: 1, // 0, 1, 2, 2.5 (polegadas)
      selectedTireSize: "225/70 R16", // Default para o exemplo solicitado pelo usuário
      selectedTread: "at", // 'ht', 'at', 'mt'
      selectedAngle: "side" // 'side', 'front', 'rear'
    }
  };

  // Referências DOM - Vistas e Navegação
  const viewPanels = document.querySelectorAll(".view-panel");
  const navLinks = document.querySelectorAll(".nav-link");
  const mobileMenuBtn = document.getElementById("mobile-menu-btn");
  const mobileMenuPanel = document.getElementById("mobile-menu-panel");
  const navFavBadge = document.getElementById("nav-fav-badge");

  // Referências DOM - Catálogo Clean
  const cleanSearchInput = document.getElementById("clean-search-input");
  const cleanPartsGrid = document.getElementById("clean-parts-grid");
  const cleanPartsCounter = document.getElementById("clean-parts-counter");
  const pillFilters = document.querySelectorAll(".pill-filter");
  const cleanFavToggle = document.getElementById("clean-fav-toggle");
  const homeFeaturedParts = document.getElementById("home-featured-parts");

  // Referências DOM - Modais
  const cleanPartModal = document.getElementById("clean-part-modal");
  const cleanPartModalContent = document.getElementById("clean-part-modal-content");
  const cleanSuggestModal = document.getElementById("clean-suggest-modal");
  const topbarSuggestBtn = document.getElementById("topbar-suggest-btn");
  const closeCleanSuggestModal = document.getElementById("close-clean-suggest-modal");
  const cleanSuggestForm = document.getElementById("clean-suggest-form");

  // Atalhos
  const quickSearchNavBtn = document.getElementById("quick-search-nav-btn");
  const quickFavoritesNavBtn = document.getElementById("quick-favorites-nav-btn");
  const printSheetNavBtn = document.getElementById("print-sheet-nav-btn");

  // Hero Switcher
  const heroBgContainer = document.getElementById("hero-bg-container");
  const heroSwitchTracker = document.getElementById("hero-switch-tracker");
  const heroSwitchGv = document.getElementById("hero-switch-gv");

  // ==================== REFERÊNCIAS DO SIMULADOR VISUAL ====================
  const simBtnCarTracker = document.getElementById("sim-btn-car-tracker");
  const simBtnCarGv = document.getElementById("sim-btn-car-gv");
  const simLiftBtns = document.querySelectorAll(".sim-lift-btn");
  const simTreadBtns = document.querySelectorAll(".sim-tread-btn");
  const simTiresPillsContainer = document.getElementById("sim-tires-pills-container");
  const simSvgStage = document.getElementById("sim-svg-stage");
  const simDynWheelFront = document.getElementById("sim-dyn-wheel-front");
  const simDynWheelRear = document.getElementById("sim-dyn-wheel-rear");
  const simLayer3Body = document.getElementById("sim-layer-3-body");
  const simCarBaseImg = document.getElementById("sim-car-base-img");
  const simRubHotspot = document.getElementById("sim-rub-hotspot");

  // Badges e Telemetria do Stage
  const stageCarBadge = document.getElementById("stage-car-badge");
  const stageLiftBadge = document.getElementById("stage-lift-badge");
  const stageTireBadge = document.getElementById("stage-tire-badge");
  const stageRubAlertPill = document.getElementById("stage-rub-alert-pill");
  const stageClearanceCm = document.getElementById("stage-clearance-cm");
  const stageClearanceDiff = document.getElementById("stage-clearance-diff");

  // Telemetria Técnica
  const telemetryDiffHeight = document.getElementById("telemetry-diff-height");
  const telemetryDiffGain = document.getElementById("telemetry-diff-gain");
  const telemetryChassisHeight = document.getElementById("telemetry-chassis-height");
  const telemetryChassisGain = document.getElementById("telemetry-chassis-gain");
  const telemetrySpeedoErr = document.getElementById("telemetry-speedo-err");
  const telemetrySpeedoDetail = document.getElementById("telemetry-speedo-detail");
  const telemetryRubStatus = document.getElementById("telemetry-rub-status");
  const telemetryRubDetail = document.getElementById("telemetry-rub-detail");
  const telemetryPartsRecipe = document.getElementById("telemetry-parts-recipe");
  const simRecipeJumpBtn = document.getElementById("sim-recipe-jump-btn");

  // Todas as peças
  function getAllParts() {
    return [...(window.PARTS_DATA || []), ...state.userContributedParts];
  }

  // Inicialização
  function init() {
    setupNavigation();
    setupHeroSwitcher();
    setupCatalogSearchAndFilters();
    setupModals();
    setupVisualSimulator();
    updateFavoritesBadge();

    // Renderizações
    renderHomeFeatured();
    renderCleanParts();
    renderGuides();
    renderStores();
    renderSpecs();
    renderCommunity();

    // Executar simulação visual inicial
    renderTirePills();
    updateVisualSimulatorStage();

    // Suporte a hash da URL (#specs, #parts, etc.)
    const hash = window.location.hash.replace("#", "");
    if (hash && ["home", "parts", "lift", "stores", "specs", "community"].includes(hash)) {
      navigateTo(hash);
    } else {
      navigateTo("home");
    }

    lucide.createIcons();
  }

  // 1. Navegação Multi-View Limpa (Separação por Assunto)
  function setupNavigation() {
    window.appNavigate = (targetView) => {
      navigateTo(targetView);
    };

    navLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        const view = link.dataset.view;
        if (view) {
          e.preventDefault();
          navigateTo(view);
          if (mobileMenuPanel) mobileMenuPanel.classList.add("hidden");
        }
      });
    });

    mobileMenuBtn?.addEventListener("click", () => {
      mobileMenuPanel?.classList.toggle("hidden");
    });

    quickSearchNavBtn?.addEventListener("click", () => {
      navigateTo("parts");
      setTimeout(() => cleanSearchInput?.focus(), 200);
    });

    quickFavoritesNavBtn?.addEventListener("click", () => {
      navigateTo("parts");
      state.showOnlyFavorites = true;
      updateFavToggleBtnStyle();
      renderCleanParts();
    });

    printSheetNavBtn?.addEventListener("click", () => {
      window.print();
    });
  }

  function navigateTo(viewId) {
    state.currentView = viewId;
    window.location.hash = viewId;

    viewPanels.forEach((panel) => {
      if (panel.id === `view-${viewId}`) {
        panel.classList.remove("hidden");
        panel.classList.add("tab-pane");
      } else {
        panel.classList.add("hidden");
      }
    });

    navLinks.forEach((link) => {
      if (link.dataset.view === viewId) {
        link.classList.add("text-slate-950", "font-black");
        link.classList.remove("text-slate-600", "font-medium");
      } else {
        link.classList.remove("text-slate-950", "font-black");
        link.classList.add("text-slate-600", "font-medium");
      }
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
    lucide.createIcons();
  }

  // 2. Alternador de Viatura no Hero
  function setupHeroSwitcher() {
    heroSwitchTracker?.addEventListener("click", () => {
      if (heroBgContainer) {
        heroBgContainer.style.backgroundImage = "url('assets/tracker-action.jpg')";
        heroBgContainer.style.backgroundPosition = "center center";
      }
      heroSwitchTracker.classList.add("bg-white/30", "text-white", "font-bold");
      heroSwitchGv.classList.remove("bg-white/30", "text-white", "font-bold");
      heroSwitchGv.classList.add("text-slate-300");
    });

    heroSwitchGv?.addEventListener("click", () => {
      if (heroBgContainer) {
        heroBgContainer.style.backgroundImage = "url('assets/grand-vitara-studio.jpg')";
        heroBgContainer.style.backgroundPosition = "center right";
      }
      heroSwitchGv.classList.add("bg-white/30", "text-white", "font-bold");
      heroSwitchTracker.classList.remove("bg-white/30", "text-white", "font-bold");
      heroSwitchTracker.classList.add("text-slate-300");
    });
  }

  // ==================== 3. SIMULADOR VISUAL DE PNEUS & LIFT ====================
  function setupVisualSimulator() {
    // Escolha do Veículo
    simBtnCarTracker?.addEventListener("click", () => {
      state.simulator.selectedCar = "tracker";
      simBtnCarTracker.classList.add("border-slate-900", "bg-slate-900", "text-white");
      simBtnCarTracker.classList.remove("border-slate-200", "bg-slate-50", "text-slate-700");
      simBtnCarGv?.classList.remove("border-slate-900", "bg-slate-900", "text-white");
      simBtnCarGv?.classList.add("border-slate-200", "bg-slate-50", "text-slate-700");
      updateVisualSimulatorStage();
    });

    simBtnCarGv?.addEventListener("click", () => {
      state.simulator.selectedCar = "gv";
      simBtnCarGv.classList.add("border-slate-900", "bg-slate-900", "text-white");
      simBtnCarGv.classList.remove("border-slate-200", "bg-slate-50", "text-slate-700");
      simBtnCarTracker?.classList.remove("border-slate-900", "bg-slate-900", "text-white");
      simBtnCarTracker?.classList.add("border-slate-200", "bg-slate-50", "text-slate-700");
      updateVisualSimulatorStage();
    });

    // Escolha do Lift
    simLiftBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        simLiftBtns.forEach((b) => {
          b.classList.remove("border-2", "border-amber-600", "bg-amber-50", "text-amber-900");
          b.classList.add("border-slate-200", "text-slate-700");
        });
        btn.classList.add("border-2", "border-amber-600", "bg-amber-50", "text-amber-900");
        btn.classList.remove("border-slate-200", "text-slate-700");

        state.simulator.selectedLift = parseFloat(btn.dataset.lift);
        updateVisualSimulatorStage();
      });
    });

    // Escolha do Tread
    simTreadBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        simTreadBtns.forEach((b) => {
          b.classList.remove("border-2", "border-slate-900", "bg-slate-900", "text-white");
          b.classList.add("border-slate-200", "text-slate-700");
        });
        btn.classList.add("border-2", "border-slate-900", "bg-slate-900", "text-white");
        btn.classList.remove("border-slate-200", "text-slate-700");

        state.simulator.selectedTread = btn.dataset.tread;
        updateVisualSimulatorStage();
      });
    });

    // Botão de atalho para comprar peças do setup
    // Ângulo de visão: Lateral / Frente / Traseira
    const simAngleBtns = document.querySelectorAll(".sim-angle-btn");
    simAngleBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        simAngleBtns.forEach((b) => {
          b.classList.remove("bg-slate-900", "text-white");
          b.classList.add("text-slate-700", "hover:bg-slate-100");
        });
        btn.classList.add("bg-slate-900", "text-white");
        btn.classList.remove("text-slate-700", "hover:bg-slate-100");
        state.simulator.selectedAngle = btn.dataset.angle;
        updateVisualSimulatorStage();
      });
    });

    simRecipeJumpBtn?.addEventListener("click", () => {
      navigateTo("parts");
      pillFilters.forEach((p) => {
        if (p.dataset.filterSystem === "suspensao") p.click();
      });
    });
  }

  function renderTirePills() {
    if (!simTiresPillsContainer || !window.SPECS_DATA?.tires) return;

    simTiresPillsContainer.innerHTML = window.SPECS_DATA.tires
      .map((tire) => {
        const isSelected = tire.size === state.simulator.selectedTireSize;
        return `
          <button class="sim-tire-pill px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
            isSelected
              ? "bg-slate-900 text-white shadow-sm ring-2 ring-slate-900"
              : "bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200"
          }" data-tire-size="${tire.size}">
            <span>${tire.size}</span>
            <span class="text-[10px] font-semibold opacity-70">(${tire.diameterInches}")</span>
          </button>
        `;
      })
      .join("");

    document.querySelectorAll(".sim-tire-pill").forEach((btn) => {
      btn.addEventListener("click", () => {
        state.simulator.selectedTireSize = btn.dataset.tireSize;
        renderTirePills();
        updateVisualSimulatorStage();
      });
    });
  }

  // ==================== GERADOR DE RODA VETORIAL SVG (CAMADA 2) ====================
  // Desenha em SVG vetorial o pneu com cravos AT/MT e roda de 5 raios original Suzuki/Tracker
  function generateWheelSvg(R, tread, car) {
    const rimR = 42; // Diâmetro de aro 16" proporcional ao veículo

    // 1. Cravos de Tração nos Ombros da Banda de Rodagem (A/T ou M/T)
    const numLugs = tread === "mt" ? 22 : 28;
    const lugDepth = tread === "mt" ? 5.5 : 3.5;
    const lugWidth = tread === "mt" ? 3.5 : 2.4;
    let lugsSvg = "";
    for (let i = 0; i < numLugs; i++) {
      const angle = (i * 2 * Math.PI) / numLugs;
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      const x1 = (R - lugDepth) * cos;
      const y1 = (R - lugDepth) * sin;
      const x2 = (R - 0.5) * cos;
      const y2 = (R - 0.5) * sin;
      lugsSvg += `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="#090b0e" stroke-width="${lugWidth}" stroke-linecap="round" />`;
    }

    // 2. Cinco Raios de Liga Leve (Roda clássica Tracker / Grand Vitara)
    let spokesSvg = "";
    for (let k = 0; k < 5; k++) {
      const deg = k * 72 - 90;
      spokesSvg += `
        <g transform="rotate(${deg})">
          <!-- Braço do Raio em Alumínio Usinado -->
          <path d="M -5 13 L -8.5 ${rimR - 3.5} Q 0 ${rimR - 1.5} 8.5 ${rimR - 3.5} L 5 13 Z" fill="url(#sim-spoke-grad)" stroke="#64748b" stroke-width="0.8" />
          <!-- Rebaixo central chanfrado esportivo do raio -->
          <path d="M -2.2 16 L -3.8 ${rimR - 6.5} L 3.8 ${rimR - 6.5} L 2.2 16 Z" fill="#475569" opacity="0.65" />
          <!-- Friso de brilho usinado -->
          <line x1="-3.5" y1="18" x2="-5" y2="${rimR - 5.5}" stroke="#ffffff" stroke-width="0.7" opacity="0.6" />
        </g>
      `;
    }

    // 3. Furação 5x139.7 (5 Parafusos cromados)
    let nutsSvg = "";
    for (let k = 0; k < 5; k++) {
      const nutAngle = ((k * 72 + 36) * Math.PI) / 180;
      const nx = (8.5 * Math.cos(nutAngle)).toFixed(1);
      const ny = (8.5 * Math.sin(nutAngle)).toFixed(1);
      nutsSvg += `<circle cx="${nx}" cy="${ny}" r="1.8" fill="#e2e8f0" stroke="#0f172a" stroke-width="0.6" />`;
    }

    // 4. Emblema da Calotinha Central
    const badgeSvg = (car === "gv")
      ? `<text x="0" y="3.2" fill="#ffffff" font-size="8.5" font-family="sans-serif" font-weight="900" text-anchor="middle">S</text>`
      : `<path d="M -4 -1.4 L 4 -1.4 L 4 1.4 L -4 1.4 Z" fill="#f59e0b" stroke="#92400e" stroke-width="0.4" /><path d="M -2 -2.8 L 2 -2.8 L 2 2.8 L -2 2.8 Z" fill="#f59e0b" stroke="#92400e" stroke-width="0.4" />`;

    return `
      <!-- Banda de Rodagem e Flanco do Pneu -->
      <circle cx="0" cy="0" r="${R.toFixed(1)}" fill="url(#sim-tire-rubber)" stroke="#090b0e" stroke-width="2.5" />
      <circle cx="0" cy="0" r="${(R * 0.88).toFixed(1)}" fill="#1e222a" opacity="0.9" />
      <circle cx="0" cy="0" r="${((R + rimR) / 2).toFixed(1)}" fill="none" stroke="#2c333e" stroke-width="1.5" stroke-dasharray="6 4" opacity="0.75" />
      <circle cx="0" cy="0" r="${(rimR + 2).toFixed(1)}" fill="#12151a" />
      
      <!-- Cravos nos Ombros (A/T) -->
      ${lugsSvg}

      <!-- Disco de Freio e Fundo Interno do Aro -->
      <circle cx="0" cy="0" r="${(rimR - 1).toFixed(1)}" fill="#090d14" />
      <circle cx="0" cy="0" r="${(rimR * 0.72).toFixed(1)}" fill="#334155" stroke="#1e293b" stroke-width="1" />
      <circle cx="0" cy="0" r="${(rimR * 0.58).toFixed(1)}" fill="none" stroke="#475569" stroke-width="1" stroke-dasharray="2 3" />
      
      <!-- Pinça de Freio Dianteira Vermelha -->
      <path d="M ${(-rimR * 0.65).toFixed(1)} ${(-rimR * 0.28).toFixed(1)} A ${(rimR * 0.7).toFixed(1)} ${(rimR * 0.7).toFixed(1)} 0 0 1 ${(-rimR * 0.28).toFixed(1)} ${(-rimR * 0.65).toFixed(1)} L ${(-rimR * 0.18).toFixed(1)} ${(-rimR * 0.50).toFixed(1)} A ${(rimR * 0.53).toFixed(1)} ${(rimR * 0.53).toFixed(1)} 0 0 0 ${(-rimR * 0.50).toFixed(1)} ${(-rimR * 0.18).toFixed(1)} Z" fill="#dc2626" />

      <!-- Borda de Alumínio Usinado do Aro -->
      <circle cx="0" cy="0" r="${rimR.toFixed(1)}" fill="none" stroke="#cbd5e1" stroke-width="3" />
      <circle cx="0" cy="0" r="${(rimR - 2.5).toFixed(1)}" fill="none" stroke="#64748b" stroke-width="1" />

      <!-- 5 Raios de Liga Leve -->
      ${spokesSvg}

      <!-- Cubo e Calota Central -->
      <circle cx="0" cy="0" r="14" fill="#94a3b8" stroke="#475569" stroke-width="1.5" />
      <circle cx="0" cy="0" r="11" fill="#1e293b" />
      ${nutsSvg}
      ${badgeSvg}
    `;
  }

  // ==================== VISTAS FRONTAL / TRASEIRA (SVG VETORIAL EM ESCALA) ====================
  // Escala: 0.24 px por mm. Eixo de simetria x=500, solo em y=450.
  // Todas as cotas da carroceria são da posição de fábrica (pneu 235/60 R16, sem lift) e a
  // carroceria inteira é transladada para cima por (lift + ganho de raio do pneu).
  const FR = {
    S: 0.24,
    CX: 500,
    G: 450,
    HALF_TRACK_MM: 735, // bitola ~1470 mm
    STOCK_DIAMETER_MM: 688,
    STOCK_WIDTH_MM: 235,
    ARCH_Y: 276 // topo da caixa de roda (vista frontal/traseira) na posição de fábrica
  };

  const CAR_PALETTES = {
    tracker: { light: "#2f8a50", base: "#1f6b3a", dark: "#123f22", name: "TRACKER" },
    gv: { light: "#3563a8", base: "#1e3a6b", dark: "#111f3d", name: "GRAND VITARA" }
  };

  // Pneu visto de frente: retângulo arredondado com blocos da banda em perspectiva cilíndrica
  function frontTireSvg(cx, D, W, tread) {
    const { G } = FR;
    const R = D / 2;
    const cy = G - R;
    const x = cx - W / 2;
    const y = G - D;
    const rx = Math.min(W * 0.3, 16);
    const inset = W * 0.1;
    const tx = x + inset;
    const tw = W - inset * 2;

    const cfg = {
      ht: { rows: 30, fill: 0.32, cols: 4 },
      at: { rows: 22, fill: 0.5, cols: 3 },
      mt: { rows: 15, fill: 0.62, cols: 2 }
    }[tread] || { rows: 22, fill: 0.5, cols: 3 };

    let blocks = "";
    for (let i = 0; i < cfg.rows; i++) {
      const theta = ((-82 + (164 * (i + 0.5)) / cfg.rows) * Math.PI) / 180;
      const yc = cy + R * Math.sin(theta);
      const h = Math.max(0.6, ((Math.PI * R) / cfg.rows) * Math.cos(theta) * cfg.fill);
      const shift = i % 2 === 0 ? 0 : 0.5;
      const colW = tw / cfg.cols;
      for (let c = -1; c <= cfg.cols; c++) {
        const bx = tx + (c + shift) * colW + colW * 0.12;
        const bw = colW * (tread === "ht" ? 0.86 : 0.72);
        const left = Math.max(bx, tx - (tread === "mt" ? 3 : 1));
        const right = Math.min(bx + bw, tx + tw + (tread === "mt" ? 3 : 1));
        if (right - left < 1) continue;
        blocks += `<rect x="${left.toFixed(1)}" y="${(yc - h / 2).toFixed(1)}" width="${(right - left).toFixed(1)}" height="${h.toFixed(1)}" rx="0.8" fill="#2c3139" />`;
      }
    }

    return `
      <ellipse cx="${cx}" cy="${G + 2}" rx="${(W * 0.75).toFixed(1)}" ry="4" fill="#000" opacity="0.22" />
      <g clip-path="url(#fr-tire-clip-l)">
        <rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${W.toFixed(1)}" height="${D.toFixed(1)}" rx="${rx.toFixed(1)}" fill="#14171c" />
        <rect x="${tx.toFixed(1)}" y="${(y + 2).toFixed(1)}" width="${tw.toFixed(1)}" height="${(D - 4).toFixed(1)}" fill="#0c0e11" />
        ${blocks}
        <rect x="${(x + 1).toFixed(1)}" y="${y.toFixed(1)}" width="${(inset * 0.6).toFixed(1)}" height="${D.toFixed(1)}" fill="#ffffff" opacity="0.05" />
      </g>
      <rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${W.toFixed(1)}" height="${D.toFixed(1)}" rx="${rx.toFixed(1)}" fill="none" stroke="#06070a" stroke-width="1.5" />
      <rect x="${(x - 1.5).toFixed(1)}" y="${(G - 4).toFixed(1)}" width="${(W + 3).toFixed(1)}" height="4" rx="2" fill="#0a0b0d" />
    `;
  }

  // Mola helicoidal em zigue-zague entre dois pontos verticais
  function coilSpringSvg(x, yBottom, yTop, width) {
    const coils = 7;
    const step = (yBottom - yTop) / (coils * 2);
    let d = `M ${x} ${yBottom.toFixed(1)}`;
    for (let i = 1; i <= coils * 2; i++) {
      const px = x + (i % 2 === 0 ? -width / 2 : width / 2);
      d += ` L ${px.toFixed(1)} ${(yBottom - step * i + step / 2).toFixed(1)}`;
    }
    d += ` L ${x} ${yTop.toFixed(1)}`;
    return `<path d="${d}" fill="none" stroke="#b45309" stroke-width="4" stroke-linejoin="round" />`;
  }

  // Cota vertical com seta e rótulo
  function dimensionSvg(x, yBottom, yTop, label) {
    const mid = (yBottom + yTop) / 2;
    return `
      <g>
        <line x1="${x}" y1="${yBottom}" x2="${x}" y2="${yTop.toFixed(1)}" stroke="#d97706" stroke-width="1.5" />
        <path d="M ${x - 4} ${(yTop + 6).toFixed(1)} L ${x} ${yTop.toFixed(1)} L ${x + 4} ${(yTop + 6).toFixed(1)}" fill="none" stroke="#d97706" stroke-width="1.5" />
        <path d="M ${x - 4} ${yBottom - 6} L ${x} ${yBottom} L ${x + 4} ${yBottom - 6}" fill="none" stroke="#d97706" stroke-width="1.5" />
        <rect x="${x + 8}" y="${(mid - 10).toFixed(1)}" width="${label.length * 6.6 + 12}" height="20" rx="6" fill="#fffbeb" stroke="#f59e0b" />
        <text x="${x + 14}" y="${(mid + 4).toFixed(1)}" font-size="12" font-weight="800" font-family="Inter, sans-serif" fill="#92400e">${label}</text>
      </g>
    `;
  }

  function generateFrontRearSvg({ angle, car, tread, lift, tireInfo, rubState, chassisCm, diffCm }) {
    const { S, CX, G, ARCH_Y } = FR;
    const pal = CAR_PALETTES[car] || CAR_PALETTES.tracker;
    const isFront = angle === "front";

    const diameterMm = tireInfo.diameterMm || FR.STOCK_DIAMETER_MM;
    const widthMm = parseInt(tireInfo.size, 10) || FR.STOCK_WIDTH_MM;
    const D = diameterMm * S;
    const W = widthMm * S;
    const R = D / 2;
    const stockD = FR.STOCK_DIAMETER_MM * S;
    const stockW = FR.STOCK_WIDTH_MM * S;
    const radiusGain = (D - stockD) / 2;
    const liftPx = lift * 25.4 * S * 2; // lift ~2x exagerado, igual à vista lateral
    const rise = radiusGain + liftPx;
    const by = (yStock) => yStock - rise; // y de um ponto da carroceria
    const hubX = CX - FR.HALF_TRACK_MM * S; // roda esquerda (a direita é espelhada)
    const hubY = G - R;
    const isStockTire = tireInfo.size === "235/60 R16";

    // ---------- Partes da metade esquerda (espelhadas para a direita) ----------
    // Fundo: caixa de roda escura (sobe com a carroceria)
    const wellBack = `
      <g transform="translate(0, ${(-rise).toFixed(2)})">
        <path d="M 288 ${ARCH_Y} Q 324 ${ARCH_Y - 10} 362 ${ARCH_Y} L 362 330 Q 324 338 288 330 Z" fill="#0b0d10" />
      </g>`;

    // Suspensão
    let suspension;
    if (isFront) {
      // Independente: bandejas e semieixo (homocinética) mudam de ângulo com o lift
      suspension = `
        <line x1="${hubX + 10}" y1="${(hubY + 18).toFixed(1)}" x2="418" y2="${by(392).toFixed(1)}" stroke="#334155" stroke-width="7" stroke-linecap="round" />
        <line x1="${hubX + 10}" y1="${(hubY - 24).toFixed(1)}" x2="428" y2="${by(318).toFixed(1)}" stroke="#475569" stroke-width="6" stroke-linecap="round" />
        <line x1="${hubX + 6}" y1="${hubY.toFixed(1)}" x2="466" y2="${by(386).toFixed(1)}" stroke="#64748b" stroke-width="5" stroke-linecap="round" />
        <circle cx="466" cy="${by(386).toFixed(1)}" r="6" fill="#475569" />
      `;
    } else {
      // Eixo rígido: molas esticam com o lift, amortecedor ao lado
      suspension = `
        ${coilSpringSvg(392, hubY - 8, by(312), 24)}
        <line x1="420" y1="${(hubY + 6).toFixed(1)}" x2="424" y2="${by(312).toFixed(1)}" stroke="#94a3b8" stroke-width="5" stroke-linecap="round" />
        <rect x="372" y="${by(300).toFixed(1)}" width="40" height="14" rx="3" fill="#1f2937" />
      `;
    }

    const tire = frontTireSvg(hubX, D, W, tread);
    const ghost = isStockTire
      ? ""
      : `<rect x="${(hubX - stockW / 2).toFixed(1)}" y="${(G - stockD).toFixed(1)}" width="${stockW.toFixed(1)}" height="${stockD.toFixed(1)}" rx="12" fill="none" stroke="#f59e0b" stroke-width="1.5" stroke-dasharray="5 4" opacity="0.9" />`;

    // Painéis da carroceria (por cima dos pneus)
    const cabin = isFront
      ? `<path d="M 500 62 L 356 62 Q 344 64 340 76 L 318 198 L 500 198 Z" fill="url(#fr-body)" />
         <path d="M 500 74 L 362 74 L 344 190 L 500 190 Z" fill="url(#fr-glass)" />`
      : `<path d="M 500 62 L 352 62 Q 340 64 338 76 L 322 198 L 500 198 Z" fill="url(#fr-body)" />
         <path d="M 500 82 L 362 82 L 352 182 L 500 182 Z" fill="url(#fr-glass-dark)" />`;

    const lights = isFront
      ? `<rect x="318" y="234" width="100" height="34" rx="10" fill="url(#fr-headlight)" stroke="#475569" stroke-width="1.5" />
         <circle cx="352" cy="251" r="10" fill="#ffffff" stroke="#94a3b8" />
         <rect x="296" y="238" width="18" height="24" rx="4" fill="#f59e0b" opacity="0.9" />
         <rect x="430" y="236" width="70" height="56" rx="6" fill="#111827" />
         <line x1="436" y1="250" x2="500" y2="250" stroke="#9ca3af" stroke-width="2" />
         <line x1="436" y1="264" x2="500" y2="264" stroke="#9ca3af" stroke-width="2" />
         <line x1="436" y1="278" x2="500" y2="278" stroke="#9ca3af" stroke-width="2" />`
      : `<rect x="292" y="206" width="26" height="74" rx="6" fill="url(#fr-taillight)" stroke="#7f1d1d" stroke-width="1.2" />
         <rect x="296" y="248" width="18" height="10" rx="2" fill="#f8fafc" opacity="0.85" />
         <line x1="352" y1="200" x2="352" y2="300" stroke="${pal.dark}" stroke-width="1.5" />`;

    const bumper = isFront
      ? `<path d="M 500 300 L 380 300 Q 356 302 354 322 L 358 360 Q 362 374 382 374 L 500 374 Z" fill="#8a9097" stroke="#5b6168" stroke-width="1.2" />
         <circle cx="392" cy="346" r="9" fill="#e5e7eb" stroke="#475569" stroke-width="1.5" />
         <rect x="440" y="352" width="60" height="12" rx="3" fill="#1f2937" />`
      : `<path d="M 500 302 L 304 302 Q 292 304 292 316 L 294 352 Q 298 368 318 368 L 500 368 Z" fill="#8a9097" stroke="#5b6168" stroke-width="1.2" />
         <rect x="302" y="338" width="20" height="6" rx="2" fill="#dc2626" />`;

    const bodyFront = `
      <g transform="translate(0, ${(-rise).toFixed(2)})">
        ${cabin}
        <rect x="360" y="52" width="36" height="10" rx="3" fill="#1f2937" />
        <rect x="360" y="54" width="140" height="4" fill="#1f2937" />
        <path d="M 500 200 L 316 200 Q 287 206 286 232 L 286 ${ARCH_Y} Q 326 ${ARCH_Y - 10} 366 ${ARCH_Y} L 366 300 L 500 300 Z" fill="url(#fr-body)" stroke="${pal.dark}" stroke-width="1.2" />
        <path d="M 278 ${ARCH_Y + 2} Q 326 ${ARCH_Y - 14} 374 ${ARCH_Y + 2} L 374 ${ARCH_Y - 7} Q 326 ${ARCH_Y - 23} 278 ${ARCH_Y - 7} Z" fill="#8a9097" stroke="#5b6168" stroke-width="1" />
        <rect x="278" y="236" width="10" height="${ARCH_Y - 240}" rx="3" fill="#8a9097" stroke="#5b6168" stroke-width="1" />
        <path d="M 318 174 L 288 170 Q 278 172 278 184 L 281 194 Q 284 200 296 199 L 322 196 Z" fill="url(#fr-body)" stroke="${pal.dark}" stroke-width="1" />
        ${lights}
        ${bumper}
      </g>`;

    const mirror = (markup) => `${markup}<g transform="translate(${CX * 2}, 0) scale(-1, 1)">${markup}</g>`;

    // ---------- Peças centrais (não espelhadas) ----------
    let centerBack = "";
    let centerFront = "";
    let dimension = "";
    if (isFront) {
      centerBack = `
        <g transform="translate(0, ${(-rise).toFixed(2)})">
          <rect x="384" y="374" width="232" height="29" rx="5" fill="#1f2937" />
          <ellipse cx="500" cy="386" rx="36" ry="15" fill="#374151" stroke="#111827" />
        </g>`;
      const badge =
        car === "gv"
          ? `<circle cx="500" cy="264" r="11" fill="#e5e7eb" stroke="#6b7280" /><text x="500" y="269" font-size="14" font-weight="900" font-family="sans-serif" text-anchor="middle" fill="#dc2626">S</text>`
          : `<g transform="translate(500, 264) scale(2.4)"><path d="M -4 -1.4 L 4 -1.4 L 4 1.4 L -4 1.4 Z" fill="#f59e0b" stroke="#92400e" stroke-width="0.4" /><path d="M -2 -2.8 L 2 -2.8 L 2 2.8 L -2 2.8 Z" fill="#f59e0b" stroke="#92400e" stroke-width="0.4" /></g>`;
      centerFront = `
        <g transform="translate(0, ${(-rise).toFixed(2)})">
          <rect x="430" y="236" width="140" height="56" rx="6" fill="none" stroke="#d1d5db" stroke-width="2.5" />
          ${badge}
          <rect x="468" y="308" width="64" height="22" rx="3" fill="#f8fafc" stroke="#64748b" />
          <rect x="468" y="308" width="64" height="5" rx="2" fill="#1d4ed8" />
        </g>`;
      dimension = dimensionSvg(CX, G, by(403), `Chassi ${chassisCm} cm`);
    } else {
      const diffR = 36;
      centerBack = `
        <rect x="${(hubX + W / 2 - 2).toFixed(1)}" y="${(hubY - 7).toFixed(1)}" width="${(2 * (CX - hubX) - W + 4).toFixed(1)}" height="14" rx="5" fill="#374151" stroke="#111827" />
        <circle cx="${CX}" cy="${hubY.toFixed(1)}" r="${diffR}" fill="#4b5563" stroke="#111827" stroke-width="2" />
        <circle cx="${CX}" cy="${hubY.toFixed(1)}" r="24" fill="#6b7280" stroke="#374151" />
        <circle cx="${CX}" cy="${hubY.toFixed(1)}" r="6" fill="#374151" />`;
      // Estepe na tampa traseira: mesma medida de pneu escolhida
      const sideScale = S / 0.215; // generateWheelSvg foi desenhado na escala da vista lateral
      centerFront = `
        <g transform="translate(0, ${(-rise).toFixed(2)})">
          <rect x="470" y="66" width="60" height="6" rx="2" fill="#dc2626" />
          <rect x="468" y="314" width="64" height="22" rx="3" fill="#f8fafc" stroke="#64748b" />
          <circle cx="628" cy="372" r="7" fill="#6b7280" stroke="#374151" stroke-width="2" />
          <circle cx="628" cy="372" r="3.5" fill="#111827" />
          <g transform="translate(${CX}, 222) scale(${sideScale.toFixed(3)})">
            ${generateWheelSvg(R / sideScale, tread, car)}
          </g>
        </g>`;
      dimension = dimensionSvg(CX, G, hubY + diffR, `Diferencial ${diffCm} cm`);
    }

    // ---------- Ponto de raspagem (topo da caixa de roda, nos dois lados) ----------
    let rubMarks = "";
    if (rubState !== "free") {
      const color = rubState === "severe" ? "#dc2626" : "#d97706";
      const yRub = by(ARCH_Y) - 3;
      [hubX, CX * 2 - hubX].forEach((x) => {
        rubMarks += `
          <circle cx="${x}" cy="${yRub.toFixed(1)}" r="9" fill="${color}" opacity="0.35">
            <animate attributeName="r" values="8;18;8" dur="1.4s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.45;0;0.45" dur="1.4s" repeatCount="indefinite" />
          </circle>
          <circle cx="${x}" cy="${yRub.toFixed(1)}" r="6" fill="${color}" stroke="#fff" stroke-width="2" />`;
      });
    }

    const tireLabels = [hubX, CX * 2 - hubX]
      .map((x) => `<text x="${x}" y="472" font-size="12" font-weight="800" font-family="Inter, sans-serif" text-anchor="middle" fill="#334155">${widthMm} mm</text>`)
      .join("");

    const legend = isStockTire
      ? ""
      : `<g><line x1="140" y1="492" x2="164" y2="492" stroke="#f59e0b" stroke-width="1.5" stroke-dasharray="5 4" />
         <text x="170" y="496" font-size="11" font-family="Inter, sans-serif" fill="#64748b">Pneu original 235/60 R16</text></g>`;

    return `
      <defs>
        <linearGradient id="fr-body" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="${pal.light}" />
          <stop offset="55%" stop-color="${pal.base}" />
          <stop offset="100%" stop-color="${pal.dark}" />
        </linearGradient>
        <linearGradient id="fr-glass" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#e2e8f0" />
          <stop offset="100%" stop-color="#64748b" />
        </linearGradient>
        <linearGradient id="fr-glass-dark" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#94a3b8" />
          <stop offset="100%" stop-color="#334155" />
        </linearGradient>
        <linearGradient id="fr-headlight" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#ffffff" />
          <stop offset="100%" stop-color="#cbd5e1" />
        </linearGradient>
        <linearGradient id="fr-taillight" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#ef4444" />
          <stop offset="100%" stop-color="#991b1b" />
        </linearGradient>
        <clipPath id="fr-tire-clip-l" clipPathUnits="userSpaceOnUse">
          <rect x="${(hubX - W / 2).toFixed(1)}" y="${(G - D).toFixed(1)}" width="${W.toFixed(1)}" height="${D.toFixed(1)}" rx="${Math.min(W * 0.3, 16).toFixed(1)}" />
        </clipPath>
      </defs>

      <ellipse cx="${CX}" cy="${G + 3}" rx="300" ry="10" fill="url(#sim-ground-shadow)" />
      <line x1="120" y1="${G}" x2="880" y2="${G}" stroke="#94a3b8" stroke-width="1.5" />

      ${mirror(wellBack)}
      ${centerBack}
      ${mirror(suspension)}
      ${mirror(tire + ghost)}
      ${mirror(bodyFront)}
      ${centerFront}
      ${dimension}
      ${rubMarks}
      ${tireLabels}
      ${legend}
    `;
  }

  function renderAngleView(params) {
    const sideGroup = document.getElementById("sim-view-side");
    const frGroup = document.getElementById("sim-view-frontrear");
    const caption = document.getElementById("stage-view-caption");
    if (!sideGroup || !frGroup) return;

    if (params.angle === "side") {
      sideGroup.style.display = "";
      frGroup.style.display = "none";
      if (caption) caption.textContent = "Fotografia real com aro original Suzuki/GM e elevação proporcional precisa";
      return;
    }

    sideGroup.style.display = "none";
    frGroup.style.display = "";
    frGroup.innerHTML = generateFrontRearSvg(params);
    if (caption) {
      caption.textContent =
        params.angle === "front"
          ? "Vista frontal em escala: largura/diâmetro reais do pneu, bandejas e semieixos acompanham o lift"
          : "Vista traseira em escala: eixo rígido com diferencial, molas esticando com o lift e estepe da medida escolhida";
    }
  }

  function updateVisualSimulatorStage() {
    const { selectedCar, selectedLift, selectedTireSize, selectedTread } = state.simulator;

    // Encontrar dados do pneu nas specs
    const tireList = window.SPECS_DATA?.tires || [];
    const tireInfo = tireList.find((t) => t.size === selectedTireSize) || tireList[0];

    // Cálculos de Física e Geometria da Viatura
    const baseDiffClearanceCm = 19.5; // Vão livre padrão de fábrica
    const tireRadiusGainCm = tireInfo.diffClearanceMm / 10;
    const liftGainCm = selectedLift * 2.54;

    // Diferencial traseiro só sobe com o raio do pneu (Eixo Rígido)
    const finalDiffClearanceCm = (baseDiffClearanceCm + tireRadiusGainCm).toFixed(1);

    // Chassi e Carroceria sobem com o raio do pneu + lift de suspensão
    const finalChassisClearanceCm = (baseDiffClearanceCm + tireRadiusGainCm + liftGainCm).toFixed(1);
    const totalChassisGainCm = (tireRadiusGainCm + liftGainCm).toFixed(1);

    // 1. Diagnóstico de Raspagem (Lógica Real de Caixa de Roda da Tracker/GV)
    let rubState = "free"; // 'free', 'warning', 'severe'
    let rubStatusText = "🟢 Totalmente Livre";
    let rubDetailText = "Sem raspagem: roda esterça livremente em fim de curso.";
    let partsRecipeText = "Suspensão standard atende perfeitamente.";

    if (tireInfo.size === "235/60 R16") {
      rubState = "free";
      rubStatusText = "🟢 Original de Fábrica";
      rubDetailText = "Medida padrão. Sem risco de raspar em batentes ou parabarros.";
      partsRecipeText =
        selectedLift > 0
          ? `Calços de ${selectedLift}" para aumentar o vão livre da carroceria.`
          : "Configuração 100% original de fábrica.";
    } else if (tireInfo.size === "215/70 R16") {
      rubState = "free";
      rubStatusText = "🟢 Totalmente Livre";
      rubDetailText = "Excelente equilíbrio para estrada e terra sem necessidade obrigatória de lift.";
      partsRecipeText =
        selectedLift > 0
          ? `Com lift de ${selectedLift}", ganho excelente de vão livre para trilhas médias.`
          : "Cabe perfeitamente com a suspensão original.";
    } else if (tireInfo.size === "225/70 R16") {
      // O EXEMPLO DO USUÁRIO
      if (selectedLift >= 1) {
        rubState = "free";
        rubStatusText = "🟢 Configuração Ideal (Excelente!)";
        rubDetailText = `Com Lift de ${selectedLift}", a caixa de roda fica harmoniosa, sem raspar na lata ou parabarro mesmo em torção máxima.`;
        partsRecipeText =
          selectedLift === 1
            ? "Calço dianteiro de 19mm em PU/Nylon + Calço traseiro de 25mm. Amortecedores originais atendem bem."
            : "Calço dianteiro de 38mm + Calço traseiro 50mm + Amortecedores traseiros de Omega Suprema.";
      } else {
        rubState = "warning";
        rubStatusText = "🟡 Leve Raspagem sem Lift";
        rubDetailText = "Em esterçamento total ou compressão forte da mola, pode encostar levemente no plástico do parabarro.";
        partsRecipeText = "Recomendado instalar pelo menos 1 polegada (25mm) de calço para liberar a caixa de roda.";
      }
    } else if (tireInfo.size === "225/75 R16") {
      if (selectedLift >= 2) {
        rubState = "free";
        rubStatusText = "🟢 Perfeito com Lift 2\"";
        rubDetailText = "A combinação mais consagrada no Brasil! Enche a caixa perfeitamente e não raspa.";
        partsRecipeText =
          "Calços dianteiros 38mm + Calços traseiros 50mm + Amortecedores de Omega Suprema + Parafusos excêntricos 12mm de cambagem.";
      } else {
        rubState = "severe";
        rubStatusText = "🔴 Raspa sem Lift 2\"";
        rubDetailText = "Pneu de 29.3\" raspa no para-choque de plástico e no parabarro ao manobrar se não tiver Lift de 2\".";
        partsRecipeText = "Obrigatório Lift de 2\" (50mm) completo com amortecedores de Omega Suprema.";
      }
    } else if (tireInfo.size === "235/70 R16") {
      if (selectedLift >= 2) {
        rubState = "warning";
        rubStatusText = "🟡 Ajuste Leve com Lift 2\"";
        rubDetailText = "Largura de 235mm pode pedir aquecer a pontinha do parabarro plástico com soprador térmico.";
        partsRecipeText = "Lift 2\" completo + Amortecedores de Suprema + Alinhamento detalhado.";
      } else {
        rubState = "severe";
        rubStatusText = "🔴 Raspa Fortemente sem Lift";
        rubDetailText = "Pneu muito encorpado. Raspará na lata e na moldura do para-choque.";
        partsRecipeText = "Exige lift mínimo de 2 polegadas.";
      }
    } else if (tireInfo.size === "245/75 R16") {
      rubState = "severe";
      rubStatusText = "🔴 Trilha Extrema (Exige Corte)";
      rubDetailText = "Diâmetro de 30.5\" exige corte no para-choque plástico dianteiro ou uso de para-choque de ferro.";
      partsRecipeText =
        "Lift 2.5\" a 3\", amortecedores especiais, Drop de diferencial dianteiro e para-choque off-road cortado.";
    }

    // 2. Renderização SVG
    // Geometria de Referência SVG (viewBox 0 0 1000 500), medida na foto tracker-carroceria.jpg:
    //  - centro da caixa de roda dianteira x=250, traseira x=818
    //  - solo (base do pneu) em y=424
    // Diâmetro original de fábrica 235/60 R16 = 688 mm -> Raio base = 74 px (proporcional ao entre-eixos da foto)
    const FRONT_X = 250;
    const REAR_X = 818;
    const GROUND_Y = 424;
    const baseRadius = 74;
    const baseDiameterMm = 688;
    const tireScale = (tireInfo.diameterMm || baseDiameterMm) / baseDiameterMm;
    const currentRadius = baseRadius * tireScale;
    const radiusGainPx = currentRadius - baseRadius;

    // O pneu sempre assenta no chão: o cubo fica a 1 raio acima do solo
    const hubY = GROUND_Y - currentRadius;

    // A carroceria (foto + recorte das caixas de roda) sobe com o Lift + ganho de raio do pneu.
    // Lift levemente exagerado (11 px/pol, ~2x a escala real) para ficar visível na tela.
    const liftPx = selectedLift * 11;
    const totalBodyRise = liftPx + radiusGainPx;
    const bodyTranslateY = -totalBodyRise;

    // Camada 1: Foto da carroceria subindo com o Lift
    if (simLayer3Body) {
      simLayer3Body.setAttribute("transform", `translate(0, ${bodyTranslateY.toFixed(2)})`);
    }

    // Recorte das caixas de roda acompanha a carroceria
    document.querySelectorAll(".sim-arch-shape").forEach((shape) => {
      shape.setAttribute("transform", `translate(0, ${bodyTranslateY.toFixed(2)})`);
    });

    // Camada 2: As duas rodas vetoriais por cima da foto
    const wheelSvgContent = generateWheelSvg(currentRadius, selectedTread, selectedCar);
    if (simDynWheelFront) {
      simDynWheelFront.setAttribute("transform", `translate(${FRONT_X}, ${hubY.toFixed(2)})`);
      simDynWheelFront.innerHTML = wheelSvgContent;
    }
    if (simDynWheelRear) {
      simDynWheelRear.setAttribute("transform", `translate(${REAR_X}, ${hubY.toFixed(2)})`);
      simDynWheelRear.innerHTML = wheelSvgContent;
    }

    // Indicador dinâmico de ponto de raspagem: no topo-frontal do pneu, onde encosta no para-lama/para-choque
    if (simRubHotspot) {
      if (rubState !== "free") {
        simRubHotspot.classList.remove("hidden");
        const rubX = FRONT_X - currentRadius * 0.6;
        const rubY = hubY - currentRadius * 0.8;
        simRubHotspot.setAttribute("transform", `translate(${rubX.toFixed(1)}, ${rubY.toFixed(1)})`);
        const pulseCircle = simRubHotspot.querySelector(".animate-ping");
        const dotCircle = simRubHotspot.querySelectorAll("circle")[1];
        if (rubState === "severe") {
          if (pulseCircle) pulseCircle.setAttribute("fill", "#ef4444");
          if (dotCircle) dotCircle.setAttribute("fill", "#dc2626");
        } else {
          if (pulseCircle) pulseCircle.setAttribute("fill", "#f59e0b");
          if (dotCircle) dotCircle.setAttribute("fill", "#d97706");
        }
      } else {
        simRubHotspot.classList.add("hidden");
      }
    }

    // Vistas Frontal / Traseira (ilustração vetorial em escala)
    renderAngleView({
      angle: state.simulator.selectedAngle,
      car: selectedCar,
      tread: selectedTread,
      lift: selectedLift,
      tireInfo,
      rubState,
      chassisCm: finalChassisClearanceCm,
      diffCm: finalDiffClearanceCm
    });

    // 3. Atualizar Badges do Stage
    if (stageCarBadge) {
      stageCarBadge.textContent =
        selectedCar === "tracker" ? "Chevrolet Tracker 2.0 16V" : "Suzuki Grand Vitara SQ420";
    }
    if (stageLiftBadge) stageLiftBadge.textContent = `Lift ${selectedLift}" (${(selectedLift * 25.4).toFixed(0)}mm)`;
    if (stageTireBadge) {
      stageTireBadge.textContent = `Pneu: ${selectedTireSize} (${tireInfo.diameterInches}") ${selectedTread.toUpperCase()}`;
    }
    if (stageClearanceCm) stageClearanceCm.textContent = `${finalChassisClearanceCm} cm`;
    if (stageClearanceDiff) stageClearanceDiff.textContent = `(+${totalChassisGainCm} cm vs fábrica)`;

    if (stageRubAlertPill) {
      if (rubState === "free") {
        stageRubAlertPill.className =
          "bg-emerald-50 text-emerald-800 border border-emerald-300 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm";
        stageRubAlertPill.innerHTML = `<span class="w-2 h-2 rounded-full bg-emerald-500"></span><span>Configuração Livre: Sem Raspagem</span>`;
      } else if (rubState === "warning") {
        stageRubAlertPill.className =
          "bg-amber-50 text-amber-800 border border-amber-300 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm";
        stageRubAlertPill.innerHTML = `<span class="w-2 h-2 rounded-full bg-amber-500"></span><span>Atenção: Raspagem Leve ao Esterçar</span>`;
      } else {
        stageRubAlertPill.className =
          "bg-red-50 text-red-800 border border-red-300 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm";
        stageRubAlertPill.innerHTML = `<span class="w-2 h-2 rounded-full bg-red-500 animate-ping"></span><span>Alerta: Raspa no Para-choque / Exige Lift</span>`;
      }
    }

    // 4. Atualizar Painel de Telemetria Geral
    if (telemetryDiffHeight) telemetryDiffHeight.textContent = `${finalDiffClearanceCm} cm`;
    if (telemetryDiffGain) telemetryDiffGain.textContent = `+${tireRadiusGainCm.toFixed(1)} cm`;
    if (telemetryChassisHeight) telemetryChassisHeight.textContent = `${finalChassisClearanceCm} cm`;
    if (telemetryChassisGain) telemetryChassisGain.textContent = `+${totalChassisGainCm} cm`;

    if (telemetrySpeedoErr) telemetrySpeedoErr.textContent = `+${tireInfo.speedoDiffPercent}%`;
    if (telemetrySpeedoDetail) {
      const realSpeedAt100 = (100 * (1 + tireInfo.speedoDiffPercent / 100)).toFixed(1);
      telemetrySpeedoDetail.textContent = `A 100 km/h no velocímetro, sua velocidade real será ${realSpeedAt100} km/h.`;
    }

    if (telemetryRubStatus) telemetryRubStatus.textContent = rubStatusText;
    if (telemetryRubDetail) telemetryRubDetail.textContent = rubDetailText;
    if (telemetryPartsRecipe) telemetryPartsRecipe.textContent = partsRecipeText;

    // 5. Atualizar Painel Avançado de Engenharia de Suspensão (Fórmulas Reais)
    const suspensionData = window.SPECS_DATA?.suspension?.lifts?.find((l) => l.liftInches === selectedLift) || {
      frontSpacerMm: selectedLift === 1 ? 19 : selectedLift === 2 ? 38 : selectedLift === 2.5 ? 47 : 0,
      rearSpacerMm: selectedLift === 1 ? 25 : selectedLift === 2 ? 50 : selectedLift === 2.5 ? 63 : 0,
      camberDeg: selectedLift === 0 ? "0.0°" : selectedLift === 1 ? "+0.8°" : selectedLift === 2 ? "+2.0°" : "+2.8°",
      camberSolution:
        selectedLift <= 1
          ? "Ajustável na folga dos parafusos originais da manga de eixo (sem custo de excêntrico)."
          : "Obrigatório: Parafuso Excêntrico 12mm no furo superior da torre.",
      rearShockReq:
        selectedLift <= 1
          ? "Amortecedores originais atendem bem. Eixo centrado sem deslocamento lateral."
          : "Obrigatório: Amortecedores da Omega Suprema (Cofap TurboGás 535mm aberto).",
      panhardStatus: selectedLift < 2 ? "Alinhado" : "Puxa ~12mm",
      badge: `Lift ${selectedLift}" (${(selectedLift * 25.4).toFixed(0)}mm)`
    };

    const engBadgeLift = document.getElementById("eng-badge-lift");
    const engSpacerFront = document.getElementById("eng-spacer-front");
    const engSpacerRear = document.getElementById("eng-spacer-rear");
    const engCamberDeg = document.getElementById("eng-camber-deg");
    const engCamberSol = document.getElementById("eng-camber-sol");
    const engPanhardStatus = document.getElementById("eng-panhard-status");
    const engShockReq = document.getElementById("eng-shock-req");
    const telemetryRpmAt100 = document.getElementById("telemetry-rpm-at100");

    if (engBadgeLift) engBadgeLift.textContent = `Lift ${selectedLift}" (${(selectedLift * 25.4).toFixed(0)}mm)`;
    if (engSpacerFront) {
      engSpacerFront.textContent = `${suspensionData.frontSpacerMm} mm (${
        suspensionData.frontSpacerMm === 19 ? '3/4"' : suspensionData.frontSpacerMm === 38 ? '1.5"' : suspensionData.frontSpacerMm === 47 ? '1.85"' : 'Orig.'
      })`;
    }
    if (engSpacerRear) {
      engSpacerRear.textContent = `${suspensionData.rearSpacerMm} mm (${
        suspensionData.rearSpacerMm === 25 ? '1"' : suspensionData.rearSpacerMm === 50 ? '2"' : suspensionData.rearSpacerMm === 63 ? '2.5"' : 'Orig.'
      })`;
    }
    if (engCamberDeg) {
      engCamberDeg.textContent = suspensionData.camberDeg;
      engCamberDeg.className =
        selectedLift <= 1 ? "text-emerald-700 font-extrabold text-[10px]" : "text-amber-700 font-extrabold text-[10px]";
    }
    if (engCamberSol) engCamberSol.textContent = suspensionData.camberSolution;
    if (engPanhardStatus) engPanhardStatus.textContent = selectedLift < 2 ? "Alinhado" : "Puxa ~12mm";
    if (engShockReq) engShockReq.textContent = suspensionData.rearShockReq;

    // Rotação real do motor J20A em 5ª marcha a 100 km/h:
    // Padrão original (pneu 688mm) = ~2950 RPM
    if (telemetryRpmAt100) {
      const estimatedRpm = Math.round(2950 / (tireInfo.diameterMm / 688.4));
      telemetryRpmAt100.textContent = `~${estimatedRpm} RPM em 5ª`;
    }

    lucide.createIcons();
  }

  // 4. Catálogo Clean: Busca e Filtros
  function setupCatalogSearchAndFilters() {
    cleanSearchInput?.addEventListener("input", (e) => {
      state.searchQuery = e.target.value.toLowerCase().trim();
      renderCleanParts();
    });

    pillFilters.forEach((btn) => {
      btn.addEventListener("click", () => {
        pillFilters.forEach((b) => {
          b.classList.remove("bg-slate-950", "text-white", "font-bold");
          b.classList.add("bg-slate-100", "text-slate-700");
        });
        btn.classList.remove("bg-slate-100", "text-slate-700");
        btn.classList.add("bg-slate-950", "text-white", "font-bold");

        state.selectedSystem = btn.dataset.filterSystem || "all";
        renderCleanParts();
      });
    });

    cleanFavToggle?.addEventListener("click", () => {
      state.showOnlyFavorites = !state.showOnlyFavorites;
      updateFavToggleBtnStyle();
      renderCleanParts();
    });
  }

  function updateFavToggleBtnStyle() {
    if (!cleanFavToggle) return;
    if (state.showOnlyFavorites) {
      cleanFavToggle.classList.add("bg-red-50", "border-red-400", "text-red-600");
      cleanFavToggle.classList.remove("border-slate-200", "text-slate-700");
    } else {
      cleanFavToggle.classList.remove("bg-red-50", "border-red-400", "text-red-600");
      cleanFavToggle.classList.add("border-slate-200", "text-slate-700");
    }
  }

  function renderCleanParts() {
    if (!cleanPartsGrid) return;

    const allParts = getAllParts();
    const query = state.searchQuery;

    const filtered = allParts.filter((part) => {
      if (state.selectedSystem !== "all" && part.system !== state.selectedSystem) {
        return false;
      }
      if (state.showOnlyFavorites && !state.favorites.includes(part.id)) {
        return false;
      }
      if (query) {
        const pool = [
          part.name,
          part.originalCode,
          part.category,
          part.description,
          ...part.compatibles.map((c) => `${c.name} ${c.code} ${c.notes}`)
        ].join(" ").toLowerCase();
        return pool.includes(query);
      }
      return true;
    });

    if (cleanPartsCounter) {
      cleanPartsCounter.textContent = `${filtered.length} peça${filtered.length === 1 ? "" : "s"} encontrada${filtered.length === 1 ? "" : "s"}`;
    }

    if (filtered.length === 0) {
      cleanPartsGrid.innerHTML = `
        <div class="col-span-full py-16 text-center clean-card p-8">
          <i data-lucide="search-x" class="w-12 h-12 text-slate-300 mx-auto mb-3"></i>
          <h3 class="text-base font-bold text-slate-800">Nenhuma peça encontrada para esta busca</h3>
          <p class="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Tente buscar com termos genéricos como "bomba", "corrente", "freio" ou limpe os filtros.
          </p>
          <button id="clean-reset-btn" class="mt-4 px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-slate-800 transition">
            Limpar Busca
          </button>
        </div>
      `;
      document.getElementById("clean-reset-btn")?.addEventListener("click", () => {
        if (cleanSearchInput) cleanSearchInput.value = "";
        state.searchQuery = "";
        state.selectedSystem = "all";
        state.showOnlyFavorites = false;
        pillFilters[0]?.click();
        updateFavToggleBtnStyle();
        renderCleanParts();
      });
      lucide.createIcons();
      return;
    }

    cleanPartsGrid.innerHTML = filtered
      .map((part) => {
        const isFav = state.favorites.includes(part.id);
        const bestAlt = part.compatibles[0] || {};

        let badgeClass = "bg-emerald-50 text-emerald-700 border-emerald-200";
        if (bestAlt.level === "adaptacao-leve") badgeClass = "bg-amber-50 text-amber-700 border-amber-200";
        if (bestAlt.level === "adaptacao-media") badgeClass = "bg-orange-50 text-orange-700 border-orange-200";

        return `
          <div class="clean-card p-6 flex flex-col justify-between group">
            <div>
              <div class="flex items-center justify-between gap-2 mb-3">
                <span class="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  ${part.category}
                </span>

                <button class="clean-fav-btn p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-red-500 transition ${isFav ? "text-red-500" : ""}"
                        data-part-id="${part.id}" title="${isFav ? "Remover dos favoritos" : "Salvar peça"}">
                  <i data-lucide="heart" class="w-4 h-4 ${isFav ? "fill-red-500 text-red-500" : ""}"></i>
                </button>
              </div>

              <h3 class="text-base font-bold text-slate-900 group-hover:text-amber-600 transition leading-snug mb-2">
                ${part.name}
              </h3>

              <div class="text-[11px] text-slate-400 mb-4">
                <span>Cód. Original: </span>
                <span class="code-tag font-semibold text-slate-700 select-all">${part.originalCode}</span>
              </div>

              <div class="bg-slate-50 border border-slate-200 rounded-xl p-3.5 mb-4">
                <div class="flex items-center justify-between gap-2 mb-1">
                  <span class="text-[11px] font-bold text-slate-500">Alternativa Nacional:</span>
                  <span class="text-[10px] font-bold px-2 py-0.5 rounded-full border ${badgeClass}">
                    ${bestAlt.levelLabel || "Compatível"}
                  </span>
                </div>

                <p class="text-xs font-bold text-slate-900 leading-snug">
                  ${bestAlt.name}
                </p>
                <p class="code-tag text-[11px] text-slate-500 mt-0.5">
                  Cód: ${bestAlt.code}
                </p>
                <div class="mt-2 pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs font-semibold">
                  <span class="text-slate-500">Preço Estimado:</span>
                  <span class="text-emerald-600 font-bold">${bestAlt.priceRange}</span>
                </div>
              </div>
            </div>

            <div class="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 text-xs">
              <span class="text-emerald-700 font-semibold flex items-center gap-1 text-[11px]">
                <i data-lucide="check" class="w-3.5 h-3.5"></i>
                ${part.savings || "Alta economia"}
              </span>

              <button class="clean-detail-btn px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg transition"
                      data-part-id="${part.id}">
                Ver Detalhes
              </button>
            </div>
          </div>
        `;
      })
      .join("");

    document.querySelectorAll(".clean-fav-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        toggleFavorite(btn.dataset.partId);
      });
    });

    document.querySelectorAll(".clean-detail-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        openPartDetailModal(btn.dataset.partId);
      });
    });

    lucide.createIcons();
  }

  // 5. Peças em Destaque na Home
  function renderHomeFeatured() {
    if (!homeFeaturedParts) return;

    const featuredIds = ["eng-001", "susp-001", "eng-002", "susp-003"];
    const allParts = getAllParts();
    const featuredList = allParts.filter((p) => featuredIds.includes(p.id));

    homeFeaturedParts.innerHTML = featuredList
      .map((part) => {
        const alt = part.compatibles[0] || {};
        return `
          <div class="clean-card p-5 flex flex-col justify-between group cursor-pointer hover:border-slate-400" onclick="window.openCleanPart('${part.id}')">
            <div>
              <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                ${part.category}
              </span>
              <h4 class="text-sm font-bold text-slate-900 group-hover:text-amber-600 transition mb-2">
                ${part.name}
              </h4>
              <p class="text-xs text-amber-700 font-bold mb-1">
                ${alt.name}
              </p>
              <p class="text-[11px] text-slate-400 line-clamp-2">
                ${part.description}
              </p>
            </div>

            <div class="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span class="text-emerald-600 font-bold">${alt.priceRange}</span>
              <span class="text-slate-400 group-hover:text-slate-900 font-bold flex items-center gap-1">
                Ver <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i>
              </span>
            </div>
          </div>
        `;
      })
      .join("");

    window.openCleanPart = (id) => openPartDetailModal(id);
    lucide.createIcons();
  }

  // 6. Favoritos
  function toggleFavorite(partId) {
    const idx = state.favorites.indexOf(partId);
    if (idx > -1) {
      state.favorites.splice(idx, 1);
    } else {
      state.favorites.push(partId);
    }
    localStorage.setItem("tracker_gv_favorites", JSON.stringify(state.favorites));
    updateFavoritesBadge();
    renderCleanParts();
  }

  function updateFavoritesBadge() {
    if (navFavBadge) {
      navFavBadge.textContent = state.favorites.length;
      navFavBadge.style.display = state.favorites.length > 0 ? "flex" : "none";
    }
  }

  // 7. Modal de Detalhes da Peça
  function openPartDetailModal(partId) {
    const allParts = getAllParts();
    const part = allParts.find((p) => p.id === partId);
    if (!part || !cleanPartModalContent) return;

    state.activePartModal = part;

    cleanPartModalContent.innerHTML = `
      <div>
        <div class="flex items-start justify-between gap-4 mb-4 pb-4 border-b border-slate-100">
          <div>
            <span class="text-xs font-bold text-amber-600 uppercase tracking-wider block mb-1">
              ${part.category} • Mecânica J20A
            </span>
            <h2 class="text-2xl font-black text-slate-900">${part.name}</h2>
          </div>
          <button id="close-modal-x" class="p-2 text-slate-400 hover:text-slate-900 rounded-full hover:bg-slate-100 transition">
            <i data-lucide="x" class="w-5 h-5"></i>
          </button>
        </div>

        <p class="text-xs text-slate-600 leading-relaxed mb-6">
          ${part.description}
        </p>

        <div class="grid grid-cols-2 gap-3 mb-6 bg-slate-50 p-4 rounded-xl border border-slate-200">
          <div>
            <span class="text-[11px] font-semibold text-slate-500 block">Código Original Suzuki/GM:</span>
            <strong class="code-tag text-xs text-slate-900 select-all block mt-0.5">${part.originalCode}</strong>
          </div>
          <div>
            <span class="text-[11px] font-semibold text-slate-500 block">Economia Estimada:</span>
            <strong class="text-xs text-emerald-600 font-bold block mt-0.5">${part.savings}</strong>
          </div>
        </div>

        <h4 class="text-xs font-black uppercase tracking-wider text-slate-900 mb-3">
          Alternativas Compatíveis Recomendadas (${part.compatibles.length})
        </h4>

        <div class="space-y-3 mb-6">
          ${part.compatibles
            .map(
              (c, i) => `
              <div class="p-4 rounded-xl border border-slate-200 bg-white">
                <div class="flex items-center justify-between gap-2 mb-1.5">
                  <h5 class="text-sm font-bold text-slate-900">${i + 1}. ${c.name}</h5>
                  <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                    ${c.levelLabel}
                  </span>
                </div>
                <div class="flex items-center justify-between text-xs text-slate-500 mb-2">
                  <span>Código: <strong class="code-tag text-slate-800">${c.code}</strong></span>
                  <span class="text-emerald-600 font-bold">${c.priceRange}</span>
                </div>
                <p class="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  <strong class="text-slate-900">Observação:</strong> ${c.notes}
                </p>
              </div>
            `
            )
            .join("")}
        </div>

        <div class="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
          <span class="text-[11px] text-slate-400">Compatível com Tracker e Grand Vitara</span>
          <a href="https://lista.mercadolivre.com.br/${encodeURIComponent(part.compatibles[0]?.name || part.name)}" target="_blank" rel="noopener noreferrer"
             class="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg text-xs transition flex items-center gap-1.5 shadow-sm">
            <span>Buscar no Mercado Livre</span>
            <i data-lucide="external-link" class="w-3.5 h-3.5"></i>
          </a>
        </div>
      </div>
    `;

    document.getElementById("close-modal-x")?.addEventListener("click", closePartDetailModal);

    cleanPartModal?.classList.remove("hidden");
    cleanPartModal?.classList.add("flex");
    lucide.createIcons();
  }

  function closePartDetailModal() {
    cleanPartModal?.classList.add("hidden");
    cleanPartModal?.classList.remove("flex");
    state.activePartModal = null;
  }

  // 8. Modal de Sugerir Peça
  function setupModals() {
    topbarSuggestBtn?.addEventListener("click", () => {
      cleanSuggestModal?.classList.remove("hidden");
      cleanSuggestModal?.classList.add("flex");
    });

    closeCleanSuggestModal?.addEventListener("click", () => {
      cleanSuggestModal?.classList.add("hidden");
      cleanSuggestModal?.classList.remove("flex");
    });

    cleanSuggestModal?.addEventListener("click", (e) => {
      if (e.target === cleanSuggestModal) {
        cleanSuggestModal.classList.add("hidden");
        cleanSuggestModal.classList.remove("flex");
      }
    });

    cleanPartModal?.addEventListener("click", (e) => {
      if (e.target === cleanPartModal) closePartDetailModal();
    });

    cleanSuggestForm?.addEventListener("submit", (e) => {
      e.preventDefault();
      handlePartSuggestion();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        closePartDetailModal();
        cleanSuggestModal?.classList.add("hidden");
        cleanSuggestModal?.classList.remove("flex");
      }
    });
  }

  function handlePartSuggestion() {
    const name = document.getElementById("cs-name")?.value.trim();
    const system = document.getElementById("cs-system")?.value;
    const originalCode = document.getElementById("cs-original-code")?.value.trim();
    const compName = document.getElementById("cs-comp-name")?.value.trim();
    const compCode = document.getElementById("cs-comp-code")?.value.trim();
    const compLevel = document.getElementById("cs-comp-level")?.value;
    const price = document.getElementById("cs-price")?.value.trim();
    const notes = document.getElementById("cs-notes")?.value.trim();

    if (!name || !compName || !compCode) {
      alert("Preencha o nome da peça, doador e código!");
      return;
    }

    const levelLabels = {
      "plug-and-play": "Plug & Play",
      "adaptacao-leve": "Adaptação Leve",
      "adaptacao-media": "Adaptação Média"
    };

    const newPart = {
      id: `usr-${Date.now()}`,
      name,
      system: system || "motor",
      category: "Colaboração",
      originalCode: originalCode || "Não informado",
      compatibles: [
        {
          name: compName,
          code: compCode,
          level: compLevel || "plug-and-play",
          levelLabel: levelLabels[compLevel] || "Compatível",
          priceRange: price || "Consulte",
          notes: notes || "Contribuição de membro da comunidade."
        }
      ],
      description: `Peça indicada pela comunidade: ${notes}`,
      savings: "Alternativa Testada"
    };

    state.userContributedParts.push(newPart);
    localStorage.setItem("tracker_gv_user_parts", JSON.stringify(state.userContributedParts));

    cleanSuggestForm.reset();
    cleanSuggestModal?.classList.add("hidden");
    cleanSuggestModal?.classList.remove("flex");

    renderCleanParts();
    navigateTo("parts");
    alert("Obrigado pela contribuição! A peça foi salva no seu catálogo local.");
  }

  // 9. Guias de Modificações
  function renderGuides() {
    const list = document.getElementById("clean-guides-list");
    if (!list) return;

    list.innerHTML = (window.GUIDES_DATA || [])
      .map((g) => `
        <div class="clean-card p-6 sm:p-8 bg-white">
          <div class="flex flex-wrap items-center justify-between gap-3 mb-4">
            <span class="text-xs font-black uppercase text-amber-600 bg-amber-50 px-3 py-1 rounded-full">
              ${g.tag}
            </span>
            <div class="flex items-center gap-4 text-xs text-slate-500 font-medium">
              <span>Leitura: ${g.readTime}</span>
              <span>Dificuldade: <strong class="text-slate-800">${g.difficulty}</strong></span>
              <span>Custo: <strong class="text-emerald-700">${g.costEstimate}</strong></span>
            </div>
          </div>

          <h3 class="text-xl sm:text-2xl font-black text-slate-900 mb-2">${g.title}</h3>
          <p class="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">${g.summary}</p>

          <div class="space-y-4 mb-6">
            ${g.steps
              .map(
                (step) => `
                <div class="bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <h4 class="text-sm font-bold text-slate-900 mb-1 flex items-center gap-2">
                    <i data-lucide="check-circle" class="w-4 h-4 text-emerald-600"></i>
                    ${step.title}
                  </h4>
                  <p class="text-xs text-slate-600 mb-2">${step.description}</p>
                  <ul class="list-disc list-inside text-xs text-slate-500 space-y-1 pl-2">
                    ${step.details.map((d) => `<li>${d}</li>`).join("")}
                  </ul>
                </div>
              `
              )
              .join("")}
          </div>

          <div class="bg-amber-50/60 border border-amber-200 rounded-xl p-4">
            <h5 class="text-xs font-black uppercase tracking-wider text-amber-900 mb-2">
              Checklist de Peças & Ferramentas:
            </h5>
            <ul class="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-slate-700">
              ${g.checklist.map((item) => `<li class="flex items-center gap-2"><span class="w-1.5 h-1.5 rounded-full bg-amber-600"></span>${item}</li>`).join("")}
            </ul>
          </div>
        </div>
      `)
      .join("");
  }

  // 10. Lojas
  function renderStores() {
    const grid = document.getElementById("clean-stores-grid");
    if (!grid) return;

    grid.innerHTML = (window.STORES_DATA || [])
      .map((s) => `
        <div class="clean-card p-6 flex flex-col justify-between bg-white">
          <div>
            <div class="flex items-center justify-between gap-2 mb-2">
              <span class="text-xs font-bold text-slate-400 uppercase">${s.category}</span>
              <span class="text-xs text-amber-600 font-bold">${s.reputation}</span>
            </div>
            <h3 class="text-lg font-bold text-slate-900 mb-2">${s.name}</h3>
            <p class="text-xs text-slate-600 leading-relaxed mb-4">${s.specialty}</p>

            <div class="bg-slate-50 p-3 rounded-lg border border-slate-100 text-xs text-slate-500 mb-4">
              <strong class="text-slate-800">Dica:</strong> ${s.tips}
            </div>
          </div>

          <div class="pt-4 border-t border-slate-100 flex items-center justify-between gap-3 text-xs">
            <span class="text-slate-400">${s.coverage}</span>
            <a href="${s.website}" target="_blank" rel="noopener noreferrer"
               class="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg transition flex items-center gap-1.5">
              <span>Acessar</span>
              <i data-lucide="external-link" class="w-3.5 h-3.5"></i>
            </a>
          </div>
        </div>
      `)
      .join("");
  }

  // 11. Especificações Técnicas e Fluidos
  function renderSpecs() {
    const tbody = document.getElementById("clean-fluids-tbody");
    const torquesGrid = document.getElementById("clean-torques-grid");

    if (tbody && window.SPECS_DATA) {
      tbody.innerHTML = window.SPECS_DATA.fluids
        .map(
          (f) => `
          <tr class="hover:bg-slate-50 transition">
            <td class="p-4 font-bold text-slate-900">${f.component}</td>
            <td class="p-4 font-semibold text-slate-800">${f.spec}</td>
            <td class="p-4 text-slate-600">${f.capacity}</td>
            <td class="p-4 text-slate-500">${f.interval}</td>
            <td class="p-4 text-red-600 font-medium">${f.warning}</td>
          </tr>
        `
        )
        .join("");
    }

    if (torquesGrid && window.SPECS_DATA) {
      torquesGrid.innerHTML = window.SPECS_DATA.torques
        .map(
          (t) => `
          <div class="bg-slate-50 p-3.5 rounded-xl border border-slate-200 flex items-center justify-between gap-2 text-xs">
            <span class="font-medium text-slate-700">${t.item}</span>
            <span class="code-tag font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200">${t.spec}</span>
          </div>
        `
        )
        .join("");
    }
  }

  // 12. Garagem e FAQ
  function renderCommunity() {
    const vehiclesContainer = document.getElementById("clean-community-vehicles");
    const faqContainer = document.getElementById("clean-faq-list");

    if (vehiclesContainer && window.COMMUNITY_DATA) {
      vehiclesContainer.innerHTML = window.COMMUNITY_DATA.vehicles
        .map(
          (v) => `
          <div class="clean-card overflow-hidden bg-white flex flex-col justify-between">
            <div>
              ${
                v.image
                  ? `<div class="h-48 overflow-hidden relative bg-slate-900">
                       <img src="${v.image}" alt="${v.model}" class="w-full h-full object-cover hover:scale-105 transition duration-500" />
                       <span class="absolute bottom-3 left-3 text-xs font-bold px-2.5 py-1 rounded bg-slate-950/80 text-white backdrop-blur-sm">
                         ${v.year || "4x4"}
                       </span>
                     </div>`
                  : `<div class="h-32 bg-slate-100 flex items-center justify-center text-slate-400 text-xs font-semibold">
                       <i data-lucide="camera" class="w-5 h-5 mr-1.5 opacity-50"></i> Foto do Proprietário
                     </div>`
              }

              <div class="p-6">
                <div class="flex items-start justify-between gap-2 mb-2">
                  <h4 class="text-base font-bold text-slate-900">${v.owner}</h4>
                  <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                    ${v.badge}
                  </span>
                </div>
                <p class="text-xs text-amber-700 font-semibold mb-3">${v.model}</p>
                <div class="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs text-slate-600 mb-3">
                  <strong class="text-slate-800 block mb-0.5">Setup:</strong>
                  ${v.setup}
                </div>
                <p class="text-xs text-slate-500 italic">
                  "${v.advice}"
                </p>
              </div>
            </div>

            <div class="px-6 pb-6 pt-2 border-t border-slate-100 text-xs text-slate-400">
              Uso: ${v.usage}
            </div>
          </div>
        `
        )
        .join("");
    }

    if (faqContainer && window.COMMUNITY_DATA) {
      faqContainer.innerHTML = window.COMMUNITY_DATA.faq
        .map(
          (item) => `
          <div class="border-b border-slate-100 pb-4 last:border-b-0">
            <h4 class="text-sm font-bold text-slate-900 mb-1 flex items-start gap-2">
              <span class="text-amber-600">Q:</span> ${item.q}
            </h4>
            <p class="text-xs text-slate-600 leading-relaxed pl-5">
              ${item.a}
            </p>
          </div>
        `
        )
        .join("");
    }
  }

  // Executar tudo
  init();
});
