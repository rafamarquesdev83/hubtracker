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
      selectedTread: "at" // 'ht', 'at', 'mt'
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
  const simCanvas = document.getElementById("sim-canvas");

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

  // Cache de imagem para renderização Canvas ultrarrápida e sem artefatos
  let studioCarImageCache = null;

  function loadStudioCarImage(callback) {
    if (studioCarImageCache && studioCarImageCache.complete && studioCarImageCache.naturalWidth > 0) {
      callback(studioCarImageCache);
      return;
    }
    if (!studioCarImageCache) {
      studioCarImageCache = new Image();
      studioCarImageCache.src = "assets/grand-vitara-studio.jpg";
      studioCarImageCache.onload = () => callback(studioCarImageCache);
    } else {
      studioCarImageCache.addEventListener("load", () => callback(studioCarImageCache));
    }
  }

  function drawVehicleOnCanvas(car, lift, tireInfo, tread, rubState) {
    if (!simCanvas) return;
    const ctx = simCanvas.getContext("2d");
    if (!ctx) return;

    loadStudioCarImage((img) => {
      // Dimensões do Canvas HD (600x400)
      const W = (simCanvas.width = 600);
      const H = (simCanvas.height = 400);

      ctx.clearRect(0, 0, W, H);

      // 1. Fundo de Estúdio Fotográfico Suave
      const bgGrad = ctx.createRadialGradient(300, 230, 40, 300, 230, 330);
      bgGrad.addColorStop(0, "#ffffff");
      bgGrad.addColorStop(0.7, "#f8fafc");
      bgGrad.addColorStop(1, "#e2e8f0");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, W, H);

      // 2. Geometria de Posicionamento Físico Real
      const groundY = 328;              // Linha do solo / asfalto
      const baseRadius = 52;            // Raio do pneu 235/60 de fábrica
      const tireScale = (tireInfo.diameterMm || 688) / 688;
      const currentRadius = baseRadius * tireScale;
      const radiusGainPx = currentRadius - baseRadius;

      // O pneu sempre assenta no chão. Logo o centro do cubo sobe com o raio do pneu
      const hubY = groundY - currentRadius;
      const hubFx = 260; // Centro do cubo dianteiro
      const hubRx = 520; // Centro do cubo traseiro

      // A carroceria sobe com o Lift de Suspensão + ganho de raio do pneu
      const liftPx = lift * 13.5; // 0" = 0px | 1" = 13.5px | 2" = 27px | 2.5" = 34px
      const bodyShiftY = -(liftPx + radiusGainPx);

      // 3. Sombra de Solo / Estúdio Fotográfico
      ctx.save();
      ctx.beginPath();
      ctx.ellipse(340, groundY + 4, 235, 12, 0, 0, Math.PI * 2);
      const shadowGrad = ctx.createRadialGradient(340, groundY + 4, 15, 340, groundY + 4, 235);
      shadowGrad.addColorStop(0, "rgba(15, 23, 42, 0.40)");
      shadowGrad.addColorStop(0.5, "rgba(15, 23, 42, 0.14)");
      shadowGrad.addColorStop(1, "transparent");
      ctx.fillStyle = shadowGrad;
      ctx.fill();
      ctx.restore();

      // 4. Interior da Caixa de Roda (Fundo escuro da carroceria, sobe junto com o Lift)
      // Sem cortes secos ou círculos flutuantes: preenche realisticamente o vão do para-lama
      ctx.save();
      ctx.fillStyle = "#15181e";

      // Caixa Dianteira
      const fCavityX = hubFx;
      const fCavityY = hubY + bodyShiftY + radiusGainPx;
      ctx.beginPath();
      ctx.arc(fCavityX, fCavityY, currentRadius + 6 + liftPx * 0.4, Math.PI, 0, false);
      ctx.lineTo(fCavityX + 58, groundY);
      ctx.lineTo(fCavityX - 58, groundY);
      ctx.closePath();
      ctx.fill();

      // Caixa Traseira
      const rCavityX = hubRx;
      const rCavityY = hubY + bodyShiftY + radiusGainPx;
      ctx.beginPath();
      ctx.arc(rCavityX, rCavityY, currentRadius + 6 + liftPx * 0.4, Math.PI, 0, false);
      ctx.lineTo(rCavityX + 58, groundY);
      ctx.lineTo(rCavityX - 58, groundY);
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      // 5. Renderização das Rodas com Aros Originais de Fábrica e Borracha Real
      function renderWheel(hx, hy, isFront) {
        ctx.save();

        // 5.1 Borracha do Pneu com Degradê Fotográfico (sem bordas circulares duras!)
        ctx.beginPath();
        ctx.arc(hx, hy, currentRadius, 0, Math.PI * 2);
        const tireGrad = ctx.createRadialGradient(hx, hy, currentRadius * 0.55, hx, hy, currentRadius);
        tireGrad.addColorStop(0, "#282d35");
        tireGrad.addColorStop(0.65, "#1b1f25");
        tireGrad.addColorStop(1, "#111418");
        ctx.fillStyle = tireGrad;
        ctx.fill();

        // 5.2 Cravos de Tração Off-Road nos Ombros (A/T ou M/T) - textura natural
        if (tread === "at" || tread === "mt") {
          const lugs = tread === "mt" ? 22 : 28;
          const lugDepth = tread === "mt" ? 4.5 : 2.5;
          ctx.strokeStyle = "rgba(45, 52, 60, 0.75)";
          ctx.lineWidth = tread === "mt" ? 2.5 : 1.5;
          for (let i = 0; i < lugs; i++) {
            const angle = (i * 2 * Math.PI) / lugs;
            const x1 = hx + Math.cos(angle) * (currentRadius - lugDepth);
            const y1 = hy + Math.sin(angle) * (currentRadius - lugDepth);
            const x2 = hx + Math.cos(angle) * (currentRadius - 0.5);
            const y2 = hy + Math.sin(angle) * (currentRadius - 0.5);
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
          }
        }

        // 5.3 Aro Original de Liga Leve Suzuki/GM da foto de estúdio
        const srcHx = isFront ? 195 : 390;
        const srcHy = isFront ? 210 : 211;
        const srcRimR = 23;
        const destRimR = baseRadius * 0.55; // preserva diâmetro do aro 16"

        ctx.save();
        ctx.beginPath();
        ctx.arc(hx, hy, destRimR, 0, Math.PI * 2);
        ctx.clip();
        ctx.drawImage(
          img,
          srcHx - srcRimR,
          srcHy - srcRimR,
          srcRimR * 2,
          srcRimR * 2,
          hx - destRimR,
          hy - destRimR,
          destRimR * 2,
          destRimR * 2
        );
        ctx.strokeStyle = "rgba(15, 23, 42, 0.35)";
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.restore();

        // 5.4 Calotinha Central: Bowtie Chevrolet se Tracker
        if (car === "tracker") {
          ctx.beginPath();
          ctx.arc(hx, hy, destRimR * 0.22, 0, Math.PI * 2);
          ctx.fillStyle = "#1e242b";
          ctx.fill();
          ctx.fillStyle = "#d97706";
          ctx.fillRect(hx - 2.5, hy - 1.2, 5, 2.4);
        }

        ctx.restore();
      }

      renderWheel(hubFx, hubY, true);
      renderWheel(hubRx, hubY, false);

      // 6. Carroceria Fotográfica Real (Eleva com o Lift de Suspensão)
      ctx.save();
      ctx.translate(0, bodyShiftY);

      // Máscara suave para abertura das caixas de roda na lataria
      ctx.save();
      ctx.beginPath();
      ctx.rect(0, 0, W, H);
      const cutFx = hubFx;
      const cutFy = hubY - bodyShiftY;
      ctx.arc(cutFx, cutFy, currentRadius + 1, 0, Math.PI * 2, true);
      const cutRx = hubRx;
      const cutRy = hubY - bodyShiftY;
      ctx.arc(cutRx, cutRy, currentRadius + 1, 0, Math.PI * 2, true);
      ctx.clip();

      // Renderiza carroceria do veículo de estúdio
      ctx.drawImage(img, 0, 0, 450, 300, 0, 0, 600, 400);

      // Limpeza impecável das marcas d'água originais
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(10, 10, 140, 40);
      ctx.fillRect(380, 360, 215, 35);

      // Personalização de Identidade Visual: Tracker vs Grand Vitara
      if (car === "tracker") {
        // Chevrolet Tracker 2.0 16V: Verde Floresta Metálico clássico nacional
        ctx.save();
        ctx.globalCompositeOperation = "color";
        ctx.fillStyle = "rgba(22, 101, 52, 0.85)";
        ctx.beginPath();
        ctx.moveTo(35, 235);
        ctx.lineTo(135, 175);
        ctx.lineTo(220, 95);
        ctx.lineTo(440, 95);
        ctx.lineTo(580, 195);
        ctx.lineTo(580, 250);
        ctx.lineTo(35, 250);
        ctx.closePath();
        ctx.fill();

        ctx.globalCompositeOperation = "source-over";
        // Gravata dourada Chevrolet na grade dianteira
        ctx.fillStyle = "#f59e0b";
        ctx.strokeStyle = "#92400e";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.rect(83, 211, 10, 4);
        ctx.fill();
        ctx.stroke();

        // Placa Dianteira TRACKER
        ctx.fillStyle = "#0f172a";
        ctx.fillRect(66, 241, 46, 16);
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 9px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("TRACKER", 89, 252);
        ctx.restore();
      } else {
        // Suzuki Grand Vitara: Placa Dianteira
        ctx.fillStyle = "#0f172a";
        ctx.fillRect(66, 241, 46, 16);
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 7px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("GRAND VITARA", 89, 252);
      }

      ctx.restore(); // fim do clip
      ctx.restore(); // fim do translate

      // 7. Alerta Visual de Raspagem (Se houver interferência na caixa de roda)
      if (rubState !== "free") {
        const warnX = 180;
        const warnY = 270 + bodyShiftY * 0.4;
        ctx.save();
        ctx.beginPath();
        ctx.arc(warnX, warnY, 11, 0, Math.PI * 2);
        ctx.fillStyle = rubState === "severe" ? "rgba(239, 68, 68, 0.25)" : "rgba(245, 158, 11, 0.25)";
        ctx.fill();

        ctx.beginPath();
        ctx.arc(warnX, warnY, 6, 0, Math.PI * 2);
        ctx.fillStyle = rubState === "severe" ? "#dc2626" : "#d97706";
        ctx.fill();
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 2;
        ctx.stroke();

        const label = rubState === "severe" ? "Raspa no Para-choque" : "Leve Raspagem ao Esterçar";
        ctx.font = "bold 10px sans-serif";
        const textW = ctx.measureText(label).width;
        ctx.fillStyle = "rgba(15, 23, 42, 0.88)";
        if (ctx.roundRect) {
          ctx.beginPath();
          ctx.roundRect(warnX - textW / 2 - 8, warnY - 28, textW + 16, 20, 6);
          ctx.fill();
        } else {
          ctx.fillRect(warnX - textW / 2 - 8, warnY - 28, textW + 16, 20);
        }
        ctx.fillStyle = "#ffffff";
        ctx.textAlign = "center";
        ctx.fillText(label, warnX, warnY - 14);
        ctx.restore();
      }
    });
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

    // 2. Renderizar Veículo no Canvas de Alta Fidelidade (sem círculos artificiais)
    drawVehicleOnCanvas(selectedCar, selectedLift, tireInfo, selectedTread, rubState);

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
