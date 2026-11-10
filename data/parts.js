// Banco de Dados de Peças Compatíveis: Chevrolet Tracker 2.0 16V & Suzuki Grand Vitara 2.0 16V (Motor J20A)
window.PARTS_DATA = [
  // ==================== MOTOR & ARREFECIMENTO ====================
  {
    id: "eng-001",
    name: "Bomba de Combustível Elétrica",
    system: "motor",
    category: "Alimentação",
    originalCode: "Suzuki 15100-65D02 / GM 93277519",
    compatibles: [
      {
        name: "Bosch Universal 3.0 Bar (Linha Gol MI / Astra / Vectra)",
        code: "Bosch 0580453471 / 0580453477",
        level: "plug-and-play",
        levelLabel: "Plug & Play",
        priceRange: "R$ 130 - R$ 220",
        notes: "Encaixa perfeitamente no copo original do tanque. Mesma vazão (85 a 100 L/h) e pressão operacional (3.0 bar). Recomenda-se trocar o pré-filtro (peneira) na mesma intervenção."
      },
      {
        name: "Magneti Marelli MAM00010 (3.0 Bar Universal)",
        code: "MAM00010",
        level: "plug-and-play",
        levelLabel: "Plug & Play",
        priceRange: "R$ 110 - R$ 180",
        notes: "Alternativa nacional de excelente durabilidade com chicote padrão."
      }
    ],
    description: "Bomba interna de combustível do tanque. O acesso é feito baixando o tanque de combustível (ou abrindo janela de inspeção sob o assoalho traseiro).",
    verifiedByCommunity: true,
    upvotes: 42,
    difficulty: "Média",
    estimatedOriginalPrice: "R$ 950 - R$ 1.400 (Concessionária)",
    savings: "Economia de até 80%"
  },
  {
    id: "eng-002",
    name: "Válvula Termostática (82°C)",
    system: "motor",
    category: "Arrefecimento",
    originalCode: "Suzuki 17670-65D00 / GM 93284042",
    compatibles: [
      {
        name: "MTE-Thomson VT 248.82",
        code: "VT 248.82",
        level: "plug-and-play",
        levelLabel: "Plug & Play",
        priceRange: "R$ 45 - R$ 85",
        notes: "Abre a exatamente 82°C como a original Suzuki. Acompanha o anel o'ring de borracha com chanfro correto."
      },
      {
        name: "Wahler 410424.82D / Valclei 2248.82",
        code: "Wahler 82°C",
        level: "plug-and-play",
        levelLabel: "Plug & Play",
        priceRange: "R$ 60 - R$ 110",
        notes: "Excelente precisão térmica. Evitar válvulas que abram a 88°C ou 92°C para não superaquecer em trilhas pesadas."
      }
    ],
    description: "Componente vital para o motor J20A. Abertura correta a 82°C. Nunca remova a válvula, pois a injeção ficará rica em malha aberta.",
    verifiedByCommunity: true,
    upvotes: 38,
    difficulty: "Fácil",
    estimatedOriginalPrice: "R$ 280 - R$ 420",
    savings: "Economia de até 75%"
  },
  {
    id: "eng-003",
    name: "Velas de Ignição",
    system: "motor",
    category: "Ignição",
    originalCode: "Suzuki 09482-00494 (Denso K20PR-U11)",
    compatibles: [
      {
        name: "NGK BKR6E-11 (Green Plug Convencional)",
        code: "NGK BKR6E-11 / 2756",
        level: "plug-and-play",
        levelLabel: "Plug & Play",
        priceRange: "R$ 80 - R$ 120 (Jogo com 4)",
        notes: "Padrão de fábrica absoluto. Gap de 1,1mm. Troca a cada 20.000 a 30.000 km."
      },
      {
        name: "NGK Iridium IX BKR6EIX-11",
        code: "BKR6EIX-11 / 3764",
        level: "plug-and-play",
        levelLabel: "Plug & Play (Upgrade)",
        priceRange: "R$ 260 - R$ 360 (Jogo com 4)",
        notes: "Eletrodo de irídio de 0,6mm. Faísca mais precisa, queima mais estável em baixa e durabilidade de até 80.000 km."
      }
    ],
    description: "Velas de ignição para motor J20A 2.0 16v a gasolina. Rosca M14x1.25, alcance 19mm, sextavado 16mm.",
    verifiedByCommunity: true,
    upvotes: 56,
    difficulty: "Fácil",
    estimatedOriginalPrice: "R$ 380 (Jogo OEM)",
    savings: "Economia de até 70%"
  },
  {
    id: "eng-004",
    name: "Sonda Lambda Pré-Catalisador (Sensor de O2)",
    system: "motor",
    category: "Injeção Eletrônica",
    originalCode: "Suzuki 18213-65D30 / GM 93310052",
    compatibles: [
      {
        name: "Bosch Universal 4 Fios",
        code: "Bosch 0258986507 / 0258986602",
        level: "adaptacao-leve",
        levelLabel: "Adaptação Leve",
        priceRange: "R$ 180 - R$ 260",
        notes: "Requer usar o kit conector 'SmartLink' que acompanha a sonda Bosch ou estanhar os 4 fios respeitando o padrão: 2 brancos (aquecedor), 1 preto (sinal) e 1 cinza (massa)."
      },
      {
        name: "MTE-Thomson 7834.40.040",
        code: "MTE 7834",
        level: "plug-and-play",
        levelLabel: "Plug & Play",
        priceRange: "R$ 220 - R$ 310",
        notes: "Modelo de reposição direta com chicote no comprimento exato para Tracker/GV."
      }
    ],
    description: "Sonda de banda estreita que controla a mistura ar/combustível. Reduz falhas na aceleração e consumo excessivo.",
    verifiedByCommunity: true,
    upvotes: 29,
    difficulty: "Fácil",
    estimatedOriginalPrice: "R$ 800 - R$ 1.200",
    savings: "Economia de até 75%"
  },
  {
    id: "eng-005",
    name: "Filtro de Óleo do Motor",
    system: "motor",
    category: "Manutenção Periódica",
    originalCode: "Suzuki 16510-61A01 / GM 93156310",
    compatibles: [
      {
        name: "Wega WO-131 / Fram PH4967 / Tecfil PSL131",
        code: "Wega WO-131 / Tecfil PSL-131",
        level: "plug-and-play",
        levelLabel: "Plug & Play",
        priceRange: "R$ 25 - R$ 45",
        notes: "Filtro com rosca 3/4x16 UNF, válvula anti-retorno e de alívio calibrada para o motor J20A."
      },
      {
        name: "Linha Toyota Corolla 1.6 / 1.8 (Mann W68/3)",
        code: "Mann W68/3",
        level: "plug-and-play",
        levelLabel: "Plug & Play",
        priceRange: "R$ 35 - R$ 55",
        notes: "Mesmíssima rosca e dimensões de vedação. Muito fácil de encontrar em qualquer posto de combustível."
      }
    ],
    description: "Filtro blindado de fácil acesso na lateral direita do bloco (lado do passageiro). Trocar a cada troca de óleo (10W40 semi ou 5W30 sintético).",
    verifiedByCommunity: true,
    upvotes: 49,
    difficulty: "Fácil",
    estimatedOriginalPrice: "R$ 90 - R$ 130",
    savings: "Economia de até 60%"
  },
  {
    id: "eng-006",
    name: "Kit de Corrente de Comando (Distribuição J20A)",
    system: "motor",
    category: "Distribuição",
    originalCode: "Suzuki 12761-77E11 / 12762-77E00 / 12831-77E02",
    compatibles: [
      {
        name: "Kit TK (T.K. Japan Car Engine Parts)",
        code: "TK-SZ002 / TK-SZ005",
        level: "plug-and-play",
        levelLabel: "Plug & Play (Recomendado)",
        priceRange: "R$ 850 - R$ 1.300",
        notes: "Fabricação japonesa genuína com correntes de alta resistência e tensores hidráulicos com catraca de retenção anti-recuo. A marca mais indicada pelos mecânicos especializados."
      },
      {
        name: "Kit Osawa / BAP / RUVILLE",
        code: "Kit Completo 2 Correntes + 2 Tensores + 3 Guias + Engrenagens",
        level: "plug-and-play",
        levelLabel: "Plug & Play",
        priceRange: "R$ 700 - R$ 950",
        notes: "Boa durabilidade. ATENÇÃO: Evite kits 'white label' sem procedência, pois o tensor superior sem retenção metálica costuma estourar e saltar dente do comando."
      }
    ],
    description: "O motor J20A possui 2 correntes de comando (superior e inferior). Se fizer barulho de chocalho metálico na partida fria que demora a sumir, o conjunto precisa ser revisado.",
    verifiedByCommunity: true,
    upvotes: 63,
    difficulty: "Avançada",
    estimatedOriginalPrice: "R$ 2.800 - R$ 4.200 (Orig. Suzuki)",
    savings: "Economia de mais de 65%"
  },
  {
    id: "eng-007",
    name: "Válvula PCV (Ventilação Positiva do Cárter)",
    system: "motor",
    category: "Alimentação",
    originalCode: "Suzuki 18118-77E00 / GM 93284055",
    compatibles: [
      {
        name: "Válvula PCV GM Corsa / Astra / Vectra",
        code: "GM 90467025 / DPL 808025",
        level: "adaptacao-leve",
        levelLabel: "Adaptação Leve",
        priceRange: "R$ 25 - R$ 50",
        notes: "Válvula plástica unidirecional. Pode precisar de uma mangueira de 8mm com abraçadeira nova. Evita acúmulo de óleo no coletor de admissão e fumaça azulada na partida."
      }
    ],
    description: "Se entupida, gera sobrepressão no cárter estufando retentores de válvulas e vazamento na tampa de válvulas.",
    verifiedByCommunity: true,
    upvotes: 31,
    difficulty: "Fácil",
    estimatedOriginalPrice: "R$ 180 - R$ 260",
    savings: "Economia de até 80%"
  },

  // ==================== SUSPENSÃO & DIREÇÃO ====================
  {
    id: "susp-001",
    name: "Amortecedor Traseiro para LIFT DE 2 POLEGADAS",
    system: "suspensao",
    category: "Amortecedores Off-Road",
    originalCode: "Original Standard: Suzuki 41700-65D00",
    compatibles: [
      {
        name: "Amortecedor Traseiro Chevrolet Omega Suprema",
        code: "Cofap Turbogás B.47814 / Monroe 27076",
        level: "adaptacao-leve",
        levelLabel: "Adaptação Leve (Receita Consagrada)",
        priceRange: "R$ 180 - R$ 280 (Cada)",
        notes: "O amortecedor da Suprema tem 5 a 6 cm a mais de curso aberto. Encaixe perfeito no olhal superior e inferior; apenas precisa de arruelas de calço no olhal inferior para centralizar."
      },
      {
        name: "Amortecedor Traseiro Kombi / Besta GS (Traseiro)",
        code: "Cofap B.47144 / Nakata AC25244",
        level: "adaptacao-leve",
        levelLabel: "Adaptação Leve",
        priceRange: "R$ 150 - R$ 220",
        notes: "Curso longo e carga mais firme, ideal para viaturas que carregam bagageiro pesado e barraca de teto."
      }
    ],
    description: "Ao colocar calços de mola de 2 polegadas (50mm), os amortecedores originais batem no fim de curso de extensão (dão tranco seco). O da Suprema resolve perfeitamente.",
    verifiedByCommunity: true,
    upvotes: 78,
    difficulty: "Fácil",
    estimatedOriginalPrice: "R$ 600 - R$ 900 (Kits Importados)",
    savings: "Economia de mais de 70%"
  },
  {
    id: "susp-002",
    name: "Molas Dianteiras para LIFT 2 POLEGADAS",
    system: "suspensao",
    category: "Molas",
    originalCode: "Suzuki 41111-65D00",
    compatibles: [
      {
        name: "Molas Dianteiras VW Santana 2.0 sem Ar-Condicionado",
        code: "Cofap E-VW02 / Fabrini I-VW0148",
        level: "adaptacao-media",
        levelLabel: "Adaptação Média (Corte de Elo)",
        priceRange: "R$ 160 - R$ 240 (Par)",
        notes: "Molas de Santana cortadas com 1 a 1,2 elos dão exatamente 2 polegadas na dianteira, mantendo boa flexibilidade sem endurecer demais a suspensão."
      },
      {
        name: "Calço de Mola em Nylon/Tecnil 38mm",
        code: "Calço 1.5\" (38mm) Dianteiro",
        level: "plug-and-play",
        levelLabel: "Plug & Play",
        priceRange: "R$ 120 - R$ 190 (Par)",
        notes: "Como a bandeja dianteira tem relação de alavanca de ~1.4:1, um calço de 38mm no topo do amortecedor eleva a roda dianteira em ~50mm (2 polegadas)."
      }
    ],
    description: "Métodos consagrados na comunidade para erguer a frente e acomodar pneus 225/75 R16 ou 235/70 R16 sem raspar na caixa de roda.",
    verifiedByCommunity: true,
    upvotes: 67,
    difficulty: "Média",
    estimatedOriginalPrice: "R$ 800 - R$ 1.500 (Kits Gringos)",
    savings: "Economia de mais de 75%"
  },
  {
    id: "susp-003",
    name: "Bieletas Dianteiras da Barra Estabilizadora",
    system: "suspensao",
    category: "Suspensão Dianteira",
    originalCode: "Suzuki 42420-65D00 / GM 93284048",
    compatibles: [
      {
        name: "Bieleta Dianteira Toyota Corolla (2003 a 2008)",
        code: "Cofap BTC10108 / Nakata N-99026",
        level: "adaptacao-leve",
        levelLabel: "Adaptação Leve (Upgrade Reforçado)",
        priceRange: "R$ 45 - R$ 75 (Cada)",
        notes: "Haste mais espessa e resistente que a original. Ao fazer lift 2\", o ângulo da bieleta fica mais suave com a do Corolla."
      },
      {
        name: "Bieleta Dianteira Tracker/GV Original Reposição",
        code: "Cofap BTC20101 / Axios 044.1852",
        level: "plug-and-play",
        levelLabel: "Plug & Play",
        priceRange: "R$ 55 - R$ 90",
        notes: "Substituição direta com porcas autofrenantes."
      }
    ],
    description: "Elimina estalos e rangidos secos em curvas e desníveis no asfalto e trilhas.",
    verifiedByCommunity: true,
    upvotes: 44,
    difficulty: "Fácil",
    estimatedOriginalPrice: "R$ 220 - R$ 340 (Cada na concessionária)",
    savings: "Economia de até 75%"
  },
  {
    id: "susp-004",
    name: "Pivô da Bandeja Dianteira Inferior",
    system: "suspensao",
    category: "Direção & Articulação",
    originalCode: "Originalmente GM/Suzuki vende apenas a bandeja completa 45201-65D01",
    compatibles: [
      {
        name: "Pivô para Prensagem Nakata / Viemar",
        code: "Nakata N-99033 / Viemar 503144",
        level: "adaptacao-media",
        levelLabel: "Adaptação Média (Prensa/Solda Ponto)",
        priceRange: "R$ 90 - R$ 150",
        notes: "A fábrica GM/Suzuki prensava o pivô e não vendia avulso (obrigava a comprar bandeja nova). O pivô Nakata/Viemar é prensado na bandeja original e fixado com anel elástico trava ou 3 pequenos pontos de solda mig de segurança."
      },
      {
        name: "Bandeja Completa Suzuki Grand Vitara (com pivô e buchas)",
        code: "Importada Cofap BJC20003M / Perfect",
        level: "plug-and-play",
        levelLabel: "Plug & Play",
        priceRange: "R$ 380 - R$ 580",
        notes: "Opção para quem não quer trabalho de torno ou quando o alojamento da bandeja velha estiver frouxo."
      }
    ],
    description: "Pivô inferior de sustentação da roda. Folga neste pivô gera instabilidade em alta velocidade e risco de soltura da roda.",
    verifiedByCommunity: true,
    upvotes: 53,
    difficulty: "Média",
    estimatedOriginalPrice: "R$ 1.600 - R$ 2.400 (Bandeja GM)",
    savings: "Economia de até 85%"
  },
  {
    id: "susp-005",
    name: "Terminais de Direção (Externos e Internos)",
    system: "suspensao",
    category: "Direção Hidráulica",
    originalCode: "Suzuki 48810-60A00 / 48830-65D00",
    compatibles: [
      {
        name: "Terminal de Direção Nakata / Viemar Tracker & GV",
        code: "Nakata N-99031 / Viemar 335261",
        level: "plug-and-play",
        levelLabel: "Plug & Play",
        priceRange: "R$ 65 - R$ 110 (Cada)",
        notes: "Excelente durabilidade, encaixe no cone da manga de eixo perfeitamente calibrado."
      }
    ],
    description: "Peça essencial para alinhamento e cambagem. Sempre alinhar a viatura após a troca.",
    verifiedByCommunity: true,
    upvotes: 35,
    difficulty: "Média",
    estimatedOriginalPrice: "R$ 290 (Concessionária)",
    savings: "Economia de até 65%"
  },

  // ==================== FREIOS ====================
  {
    id: "brk-001",
    name: "Pastilhas de Freio Dianteiras",
    system: "freios",
    category: "Freio Dianteiro",
    originalCode: "Suzuki 55200-65D11 / GM 93284058",
    compatibles: [
      {
        name: "Cobreq N-1234 / Fras-le PD/583",
        code: "Cobreq N-1234 / SYL 1284",
        level: "plug-and-play",
        levelLabel: "Plug & Play",
        priceRange: "R$ 75 - R$ 130 (Jogo)",
        notes: "Mesma pastilha usada no Grand Vitara 1998 a 2005 e Suzuki XL-7. Encaixe perfeito com chapinhas anti-ruído."
      },
      {
        name: "Pastilha Bosch Dianteira Linha Tracker/GV",
        code: "Bosch BB847 / 0986AB1051",
        level: "plug-and-play",
        levelLabel: "Plug & Play",
        priceRange: "R$ 110 - R$ 170",
        notes: "Excelente poder de frenagem e baixa emissão de fuligem preta nas rodas de liga."
      }
    ],
    description: "Pastilhas do freio a disco ventilado dianteiro. Facilmente encontradas em qualquer autopeça nacional.",
    verifiedByCommunity: true,
    upvotes: 41,
    difficulty: "Fácil",
    estimatedOriginalPrice: "R$ 320 - R$ 480",
    savings: "Economia de até 65%"
  },
  {
    id: "brk-002",
    name: "Flexíveis de Freio Dianteiros para LIFT 2 POLEGADAS",
    system: "freios",
    category: "Freios Hidráulicos",
    originalCode: "Original Curto: 51540-65D00",
    compatibles: [
      {
        name: "Flexíveis Dianteiros VW Kombi (Mais Longos)",
        code: "Varga / Norflex Linha Kombi Clip M10",
        level: "adaptacao-leve",
        levelLabel: "Adaptação Leve (Lift Seguro)",
        priceRange: "R$ 35 - R$ 60 (Cada)",
        notes: "Têm cerca de 6 a 8 cm a mais de comprimento. Evita que o flexível original estique feito corda de violão quando a suspensão dianteira abre o curso máximo (drop)."
      },
      {
        name: "Deslocador de Suporte do Flexível Original",
        code: "Chapa de Extensão 40mm",
        level: "plug-and-play",
        levelLabel: "Plug & Play",
        priceRange: "R$ 20 - R$ 40",
        notes: "Pequena chapa de aço aparafusada no suporte da torre para abaixar o ponto de fixação sem mexer no flexível."
      }
    ],
    description: "Modificação essencial de segurança ao elevar a suspensão em 2 polegadas ou mais.",
    verifiedByCommunity: true,
    upvotes: 52,
    difficulty: "Média",
    estimatedOriginalPrice: "R$ 250 (Flexíveis importados estendidos)",
    savings: "Economia de até 75%"
  },

  // ==================== CÂMBIO & 4X4 (TRANSMISSÃO) ====================
  {
    id: "trans-001",
    name: "Bomba do Atuador Pneumático 4x4 (Dianteira)",
    system: "transmissao",
    category: "Sistema 4x4",
    originalCode: "Suzuki 27940-65D02 / GM 93284065",
    compatibles: [
      {
        name: "Micro Compressor 12V / Bombinha de Pressão Positiva 0.4 bar",
        code: "Bombinha 12V 4x4 Universal (China / MercadoLivre)",
        level: "adaptacao-leve",
        levelLabel: "Adaptação Leve",
        priceRange: "R$ 120 - R$ 220",
        notes: "A bomba original trabalha com ~0,4 bar de pressão contínua no diafragma do diferencial dianteiro. Se ela queimar (fica atrás do para-choque direito e pega barro/água), a bombinha genérica ou realocada para o cofre do motor resolve definitivamente."
      },
      {
        name: "Eliminação com Roda Livre Manual AVM + Trava",
        code: "AVM 438 / 438HP",
        level: "adaptacao-media",
        levelLabel: "Adaptação Mecânica Definitiva",
        priceRange: "R$ 680 - R$ 980 (Par AVM)",
        notes: "Ao instalar roda livre manual nos cubos e travar o acoplamento do diferencial com abraçadeira ou arruela interna, elimina-se 100% o problema crônico de não engate do 4x4."
      }
    ],
    description: "O calcanhar de Aquiles da Tracker/Grand Vitara: quando a luz 4WD pisca no painel e o 4x4 não traciona a frente, quase sempre é a bombinha ou mangueira furada.",
    verifiedByCommunity: true,
    upvotes: 89,
    difficulty: "Média",
    estimatedOriginalPrice: "R$ 1.800 - R$ 2.600 (Concessionária)",
    savings: "Economia de até 90%"
  },
  {
    id: "trans-002",
    name: "Retentor de Saída da Caixa de Transferência (T-Case)",
    system: "transmissao",
    category: "Vedação & Cardã",
    originalCode: "Suzuki 29283-66H00 / GM 93284061",
    compatibles: [
      {
        name: "Retentor Sabó Medida 40 x 54 x 10 / 12",
        code: "Sabó 02847 / Corteco 19027878B",
        level: "plug-and-play",
        levelLabel: "Plug & Play",
        priceRange: "R$ 35 - R$ 65",
        notes: "Mesma medida do retentor da flange de saída para o cardã traseiro. Borracha de nitrílica ou poliacrílico de alta durabilidade."
      }
    ],
    description: "Veda a saída traseira da t-case. Vazamentos ali molham a cruzeta e esvaziam o óleo da tração.",
    verifiedByCommunity: true,
    upvotes: 37,
    difficulty: "Média",
    estimatedOriginalPrice: "R$ 190 (Concessionária)",
    savings: "Economia de até 75%"
  },
  {
    id: "trans-003",
    name: "Cruzetas do Cardã Traseiro e Dianteiro",
    system: "transmissao",
    category: "Cardã & Cruzetas",
    originalCode: "Suzuki 27200-60810 / GM 93284069",
    compatibles: [
      {
        name: "Cruzeta Spicer / Mecpar / Stahl",
        code: "Spicer 5-153X / Mecpar CR-1011 (Medida 25 x 64mm)",
        level: "plug-and-play",
        levelLabel: "Plug & Play",
        priceRange: "R$ 65 - R$ 120 (Cada)",
        notes: "Com bico graxeiro para lubrificação periódica a cada troca de óleo ou pós-trilha pesada com água."
      }
    ],
    description: "Cruzetas padrão universal 25x64mm com travas externas/internas dependendo do eixo cardã.",
    verifiedByCommunity: true,
    upvotes: 46,
    difficulty: "Média",
    estimatedOriginalPrice: "R$ 280 (Original)",
    savings: "Economia de até 60%"
  },

  // ==================== ELÉTRICA & ACESSÓRIOS ====================
  {
    id: "elec-001",
    name: "Regulador de Voltagem do Alternador",
    system: "eletrica",
    category: "Carga & Bateria",
    originalCode: "Mitsubishi A866X44870 (Alternador Mitsubishi 85A/90A)",
    compatibles: [
      {
        name: "Gauss GA085 / Ikro IK5085",
        code: "Gauss GA085",
        level: "plug-and-play",
        levelLabel: "Plug & Play",
        priceRange: "R$ 90 - R$ 145",
        notes: "Regulador de 14.4V padrão para alternadores Mitsubishi que equipam o motor J20A 2.0 16v."
      }
    ],
    description: "Quando a luz da bateria acende ou pisca em alta rotação, a troca do regulador resolve sem precisar de um alternador novo completo.",
    verifiedByCommunity: true,
    upvotes: 32,
    difficulty: "Média",
    estimatedOriginalPrice: "R$ 1.500 (Alternador Novo GM)",
    savings: "Economia de mais de 85%"
  },
  {
    id: "elec-002",
    name: "Atuador da Trava Elétrica da Porta Traseira (Porta-Malas)",
    system: "eletrica",
    category: "Travas & Conforto",
    originalCode: "Suzuki 82510-65D00",
    compatibles: [
      {
        name: "Motor de Trava Universal Tipo Escravo (2 Fios)",
        code: "Trava Elétrica Universal 2 Fios (Tipo Pistola/Universal)",
        level: "adaptacao-leve",
        levelLabel: "Adaptação Leve",
        priceRange: "R$ 20 - R$ 35",
        notes: "A trava original da tampa traseira cansa devido ao peso do estepe e poeira. A trava universal de R$ 25 encaixa no varão metálico com a presilha fornecida no kit."
      }
    ],
    description: "Problema clássico em que a tampa traseira para de abrir ou travar pelo controle remoto.",
    verifiedByCommunity: true,
    upvotes: 59,
    difficulty: "Fácil",
    estimatedOriginalPrice: "R$ 450 (Mecanismo Original GM)",
    savings: "Economia de mais de 90%"
  }
];
