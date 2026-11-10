// Especificações Técnicas Oficiais: Motor J20A, Câmbio, T-Case, Diferenciais e Manuais
window.SPECS_DATA = {
  fluids: [
    {
      component: "Motor Suzuki J20A 2.0 16v",
      spec: "SAE 10W-40 Semissintético ou 5W-30 Sintético (API SN/SP)",
      capacity: "5,2 Litros (com filtro) / 4,8 Litros (sem filtro)",
      interval: "Trocar a cada 7.500 km ou 6 meses (em trilha: 5.000 km)",
      warning: "⚠️ NUNCA use óleo grosso 20W-50! Isso danifica os tensores hidráulicos da corrente de comando."
    },
    {
      component: "Câmbio Manual (5 Marchas)",
      spec: "SAE 75W-90 API GL-4 (Semissintético ou Sintético)",
      capacity: "1,9 Litros",
      interval: "Trocar a cada 40.000 km ou após travessias profundas",
      warning: "⚠️ EXTREMAMENTE CRÍTICO: Use estritamente API GL-4. NÃO use GL-5, pois destrói os sincronizadores de bronze!"
    },
    {
      component: "Câmbio Automático (Aisin 4 Marchas)",
      spec: "Fluido ATF Dexron III / Suzuki ATF 3317",
      capacity: "Troca parcial: ~2,5 a 3,0 L / Troca total: ~7,5 L",
      interval: "Trocar a cada 40.000 km com inspeção periódica na vareta",
      warning: "Verifique se o fluido está vermelho límpido. Se estiver marrom ou com cheiro de queimado, troque com urgência."
    },
    {
      component: "Caixa de Transferência (T-Case 4x4 / Reduzida)",
      spec: "SAE 75W-90 API GL-4",
      capacity: "1,7 Litros",
      interval: "Trocar a cada 40.000 km",
      warning: "Revisar respiro superior para não sugar água em travessia de alagados."
    },
    {
      component: "Diferencial Dianteiro",
      spec: "SAE 80W-90 API GL-5 Hipoide",
      capacity: "1,0 Litro",
      interval: "Trocar a cada 30.000 km",
      warning: "Carcaça de alumínio: aperte o bujão com cuidado para não espanar."
    },
    {
      component: "Diferencial Traseiro",
      spec: "SAE 80W-90 API GL-5 (Se tiver LSD, adicionar aditivo Limited Slip)",
      capacity: "2,2 Litros",
      interval: "Trocar a cada 30.000 km",
      warning: "Carcaça de ferro fundido. Limpar o ímã do bujão de dreno a cada troca."
    },
    {
      component: "Sistema de Arrefecimento (Radiador)",
      spec: "Aditivo Orgânico (Etilenoglicol 50% + Água Desmineralizada 50%)",
      capacity: "7,0 Litros total",
      interval: "Trocar a cada 2 anos ou 40.000 km",
      warning: "Nunca use água de torneira mineral para evitar corrosão no bloco de alumínio."
    }
  ],
  torques: [
    { item: "Velas de Ignição", spec: "25 a 30 Nm (Não forçar no cabeçote de alumínio)" },
    { item: "Bujão de Dreno do Óleo do Motor", spec: "35 Nm (M14x1.5)" },
    { item: "Porcas de Roda", spec: "90 a 100 Nm (Padrão 5x139,7mm)" },
    { item: "Parafusos do Cabeçote (J20A)", spec: "Etapas: 40 Nm -> 80 Nm -> 105 Nm" },
    { item: "Tampa de Válvulas", spec: "9 a 12 Nm" },
    { item: "Bujões de Diferenciais", spec: "45 a 50 Nm" }
  ],
  tires: [
    {
      size: "235/60 R16",
      diameterMm: 688,
      diameterInches: 27.1,
      sidewallMm: 141,
      speedoDiffPercent: 0.0,
      recommendedLift: "0\" (Original)",
      diffClearanceMm: 0,
      chassisClearanceMm: 0,
      rubRisk: "none",
      rubDescription: "🟢 100% Livre: Altura e medidas originais de fábrica.",
      notes: "Configuração padrão de fábrica. Rodagem macia no asfalto, porém vão livre do solo reduzido para trilha (19,5 cm)."
    },
    {
      size: "215/70 R16",
      diameterMm: 707,
      diameterInches: 27.9,
      sidewallMm: 150.5,
      speedoDiffPercent: 2.8,
      recommendedLift: "0\" ou 1\" (25mm)",
      diffClearanceMm: 9.5,
      chassisClearanceMm: 9.5,
      rubRisk: "none",
      rubDescription: "🟢 100% Livre: Cabe na suspensão original sem raspar nada.",
      notes: "Ganho de quase 1 cm no ponto mais baixo do diferencial traseiro. Excelente opção para quem usa no dia a dia e faz terra nos fins de semana."
    },
    {
      size: "225/70 R16",
      diameterMm: 721,
      diameterInches: 28.4,
      sidewallMm: 157.5,
      speedoDiffPercent: 4.8,
      recommendedLift: "1\" (25mm) ou 1.5\"",
      diffClearanceMm: 16.5,
      chassisClearanceMm: 16.5,
      rubRisk: "very_low",
      rubDescription: "🟢 Excelente com Lift 1\": Enche as caixas com harmonia, sem raspar na lata ou para-choque.",
      notes: "Medida muito equilibrada! Com lift de 1 polegada (25mm), ganha-se 4,1 cm no vão livre do chassi e 1,6 cm no diferencial, mantendo o carro super estável e ágil."
    },
    {
      size: "225/75 R16",
      diameterMm: 744,
      diameterInches: 29.3,
      sidewallMm: 168.8,
      speedoDiffPercent: 8.1,
      recommendedLift: "2\" (50mm)",
      diffClearanceMm: 27.8,
      chassisClearanceMm: 27.8,
      rubRisk: "needs_lift",
      rubDescription: "🟡 Exige Lift 2\": Com o lift de 50mm não raspa nada. Sem lift raspa na moldura dianteira ao esterçar.",
      notes: "A medida mais famosa e consagrada no Brasil! Pneus A/T ou M/T nesta medida transformam o carro em um trator nas trilhas sem sacrificar tanto o consumo."
    },
    {
      size: "235/70 R16",
      diameterMm: 735,
      diameterInches: 29.0,
      sidewallMm: 164.5,
      speedoDiffPercent: 6.8,
      recommendedLift: "2\" (50mm)",
      diffClearanceMm: 23.5,
      chassisClearanceMm: 23.5,
      rubRisk: "low_mod",
      rubDescription: "🟡 Leve ajuste: Com lift 2\" pode exigir aquecer a ponta plástica do parabarro com soprador.",
      notes: "Medida muito comum em picapes médias (Ranger, S10). Dá um visual encorpado e largo para a Tracker/GV."
    },
    {
      size: "245/75 R16",
      diameterMm: 774,
      diameterInches: 30.5,
      sidewallMm: 183.8,
      speedoDiffPercent: 12.5,
      recommendedLift: "2.5\" a 3\" + Corte de Para-choque",
      diffClearanceMm: 42.8,
      chassisClearanceMm: 42.8,
      rubRisk: "high_trim",
      rubDescription: "🔴 Exige Modificação: Raspará na lata e no para-choque sem lift alto e para-choque de ferro cortado.",
      notes: "Configuração extrema para trilha pesada. Ganho absurdo de vão livre, mas alonga bastante a relação das marchas e exige cuidado com as homocinéticas."
    }
  ],
  suspension: {
    baseDiffClearanceCm: 19.5,
    baseChassisClearanceCm: 19.5,
    motionRatioFront: 1.33, // McPherson dianteiro: calço no coxim tem relação ~1:1.33 na roda
    motionRatioRear: 1.00,  // Eixo rígido traseiro: calço sobre a mola tem relação 1:1
    lifts: [
      {
        liftInches: 0,
        liftMm: 0,
        frontSpacerMm: 0,
        rearSpacerMm: 0,
        camberDeg: "0.0°",
        camberSolution: "Parafusos originais 12mm (Alinhamento de fábrica)",
        rearShockReq: "Amortecedores originais (480mm aberto)",
        panhardStatus: "Eixo traseiro 100% centrado",
        cvAngleDeg: "0° a 3° (Alinhado)",
        drivetrainStress: "Mínimo / Fábrica",
        badge: "100% Original de Fábrica"
      },
      {
        liftInches: 1,
        liftMm: 25.4,
        frontSpacerMm: 19, // 3/4" (19mm) na torre -> 25.4mm na roda
        rearSpacerMm: 25,  // 1" (25mm) sobre a mola traseira
        camberDeg: "+0.8° a +1.0°",
        camberSolution: "Ajustável na folga dos parafusos originais da manga de eixo (sem custo de excêntrico)",
        rearShockReq: "Amortecedores originais atendem bem (perda de apenas 25mm de curso)",
        panhardStatus: "Deslocamento imperceptível (< 4mm)",
        cvAngleDeg: "5° a 7° (Homocinéticas seguras e silenciosas)",
        drivetrainStress: "Muito Baixo - Altura ideal para dia a dia + expedição leve",
        badge: "Recomendado Leve (Sem Adaptações Complexas)"
      },
      {
        liftInches: 2,
        liftMm: 50.8,
        frontSpacerMm: 38, // 1.5" (38mm) na torre -> 50.8mm na roda
        rearSpacerMm: 50,  // 2" (50mm) sobre a mola (ou molas de Santana traseiras)
        camberDeg: "+1.8° a +2.2°",
        camberSolution: "Obrigatório: Parafuso Excêntrico 12mm no furo superior da torre",
        rearShockReq: "Obrigatório: Amortecedores da Omega Suprema (Cofap TurboGás 535mm aberto)",
        panhardStatus: "Eixo puxa ~12mm para a esquerda. Recomendado suporte rebaixador de Panhard",
        cvAngleDeg: "11° a 13° (Limite seguro sem rebaixar o diferencial dianteiro)",
        drivetrainStress: "Médio - A receita mais consagrada no Brasil",
        badge: "O Padrão Ouro Off-Road (Consagrado)"
      },
      {
        liftInches: 2.5,
        liftMm: 63.5,
        frontSpacerMm: 47, // 47mm na torre -> 63.5mm na roda
        rearSpacerMm: 63,  // 63mm sobre a mola traseira
        camberDeg: "+2.5° a +3.0°",
        camberSolution: "Obrigatório: Parafusos excêntricos 12mm + Drop de Diferencial Dianteiro",
        rearShockReq: "Obrigatório: Amortecedores de Omega Suprema + Alongador ou amortecedor 560mm",
        panhardStatus: "Eixo puxa ~18mm para a esquerda. Obrigatório barra regulável ou suporte rebaixador",
        cvAngleDeg: "16°+ (Crítico sem Drop do diferencial dianteiro de 25mm)",
        drivetrainStress: "Alto - Exige Drop de diferencial dianteiro e atenção às coifas",
        badge: "Trilha Extrema / Rock Crawling"
      }
    ]
  }
};
