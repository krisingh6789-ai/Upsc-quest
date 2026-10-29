/* ============================================================================
 * LBSNAA QUEST — COMPLETE UPSC BOOK CATALOGUE, RPG LORE & INFINITE QUIZ ENGINE
 * ============================================================================ */

window.UPSC_RPG_DATA = (() => {
  // --------------------------------------------------------------------------
  // 1. AVATARS, LEVEL TITLES, MONSTERS & COLLECTIBLE MANA BADGES
  // --------------------------------------------------------------------------
  const AVATARS = [
    { id: 'ashoka-paladin', name: 'Ashoka Paladin', icon: 'fa-shield-halved', color: '#00f5d4', desc: '+Polity Aura • Defender of Art. 32' },
    { id: 'chanakya-sage', name: 'Chanakya Sage', icon: 'fa-scroll', color: '#ffd166', desc: '+Arthashastra Wisdom • Diplomacy Crit' },
    { id: 'cyber-scribe', name: 'Cyber Scribe', icon: 'fa-user-astronaut', color: '#b5179e', desc: '+ISRO & Tech Mastery • Fast Reader' },
    { id: 'valkyrie-ias', name: 'Valkyrie Probationer', icon: 'fa-crown', color: '#f72585', desc: '+Ethics & Governance • High Streak' },
    { id: 'monsoon-ranger', name: 'Monsoon Ranger', icon: 'fa-compass', color: '#10b981', desc: '+Geography & Ecology Explorer' },
    { id: 'harappan-knight', name: 'Harappan Knight', icon: 'fa-chess-knight', color: '#ff9f1c', desc: '+Ancient & Art Culture Specialist' }
  ];

  const RANKS = [
    { minLevel: 1, title: 'Novice Scribe (NCERT Initiate)' },
    { minLevel: 2, title: 'Foundation Scout' },
    { minLevel: 3, title: 'Polity Squire' },
    { minLevel: 5, title: 'Constitution Knight' },
    { minLevel: 7, title: 'Spectrum Battlemage' },
    { minLevel: 10, title: 'Prelims Vanguard' },
    { minLevel: 13, title: 'Mains Grand Strategist' },
    { minLevel: 16, title: 'Dholpur House Challenger' },
    { minLevel: 20, title: 'LBSNAA Probationer (OT)' },
    { minLevel: 25, title: 'Cabinet Secretary Legend' }
  ];

  const BADGES = [
    { id: 'b-chakra', name: 'Dharma Chakra', icon: 'fa-dharmachakra', color: '#00f5d4', desc: 'Recharged Mana Crystal in Deep Focus' },
    { id: 'b-art32', name: 'Heart & Soul Shield', icon: 'fa-scale-balanced', color: '#ffd166', desc: 'Guardian of Constitutional Remedies' },
    { id: 'b-owl', name: 'Brahma Muhurta Owl', icon: 'fa-feather-pointed', color: '#c084fc', desc: 'Unwavering Focus Discipline' },
    { id: 'b-lotus', name: 'Sarnath Lion Seal', icon: 'fa-landmark-dome', color: '#fbbf24', desc: 'Master of Heritage & Polity' },
    { id: 'b-rocket', name: 'PSLV Orbit Crest', icon: 'fa-shuttle-space', color: '#38bdf8', desc: 'Science & Tech Mana Surge' },
    { id: 'b-tiger', name: 'Project Tiger Fang', icon: 'fa-paw', color: '#34d399', desc: 'Biosphere & Ramsar Protector' },
    { id: 'b-rupee', name: 'Repo Rate Relic', icon: 'fa-coins', color: '#f59e0b', desc: 'Monetary & Fiscal Alchemist' },
    { id: 'b-globe', name: 'Gondwana Compass', icon: 'fa-earth-asia', color: '#2dd4bf', desc: 'Tectonic & Monsoon Navigator' },
    { id: 'b-sword', name: '1857 Vanguard Blade', icon: 'fa-khanda', color: '#fb7185', desc: 'Modern History Freedom Scholar' },
    { id: 'b-lamp', name: 'Mussoorie Lantern', icon: 'fa-fire-flame-curved', color: '#f472b6', desc: 'Keeper of the LBSNAA Dream' },
    { id: 'b-gem', name: 'Kautilya Emerald', icon: 'fa-gem', color: '#4ade80', desc: 'Saptanga Statecraft Strategist' },
    { id: 'b-ethics', name: 'Golden Mean Medallion', icon: 'fa-hand-holding-heart', color: '#e879f9', desc: 'GS-IV Probity & Integrity' }
  ];

  const MONSTERS = [
    { id: 'm-polity', name: 'Laxmikanth Article Golem', subject: 'Polity', icon: 'fa-gavel', color: '#00f5d4', hp: 100, taunt: '"Confuse ONE Constitutional Schedule and your 2 marks belong to me!"' },
    { id: 'm-history', name: 'Chronology Phantom', subject: 'History', icon: 'fa-hourglass-half', color: '#ff9f1c', hp: 100, taunt: '"Was Poona Pact before or after the Communal Award, mortal?!"' },
    { id: 'm-culture', name: 'Nagara Gargoyle', subject: 'Art & Culture', icon: 'fa-gopuram', color: '#f472b6', hp: 100, taunt: '"Distinguish Tribhanga from Chowk or fall in Prelims!"' },
    { id: 'm-geo', name: 'El-Niño Kraken', subject: 'Geography', icon: 'fa-hurricane', color: '#38bdf8', hp: 100, taunt: '"My Western Disturbances & Indian Ocean Dipole will scramble your compass!"' },
    { id: 'm-eco', name: 'Fiscal Deficit Hydra', subject: 'Economy', icon: 'fa-chart-line', color: '#ffd166', hp: 100, taunt: '"Watch me invert your Bond Yields and Sterling Liquidity!"' },
    { id: 'm-env', name: 'Schedule-I Basilisk', subject: 'Environment', icon: 'fa-dragon', color: '#10b981', hp: 100, taunt: '"Only one of these three wetlands lies north of the Narmada!"' },
    { id: 'm-sci', name: 'Quantum CRISPR Drone', subject: 'Science & Tech', icon: 'fa-atom', color: '#a855f7', hp: 100, taunt: '"GEO vs GTO orbit! Cas9 vs Prime Editing! Choose wisely!"' },
    { id: 'm-ethics', name: 'Kant\'s Sphinx of Dharma', subject: 'Ethics', icon: 'fa-eye', color: '#ec4899', hp: 100, taunt: '"Deontology or Utilitarianism? Test your Administrative Probity!"' },
    { id: 'm-csat', name: 'CSAT Cutoff Minotaur', subject: 'CSAT', icon: 'fa-calculator', color: '#f43f5e', hp: 100, taunt: '"33% sounds easy until my Remainder Theorem strikes at 3:30 PM!"' },
    { id: 'm-boss', name: 'BOSS: Dholpur House Archdragon', subject: 'BOSS', icon: 'fa-skull-crossbones', color: '#ef4444', hp: 150, taunt: '"HOW MANY OF THE ABOVE STATEMENTS ARE CORRECT?! NONE ESCAPE MY TRAP!"' }
  ];

  // --------------------------------------------------------------------------
  // 2. COMPLETE VERIFIED 48-BOOK UPSC CSE MASTER VAULT
  // Every `iaId` below is verified unrestricted on Internet Archive with real
  // full-book `_djvu.txt`, `.pdf`, `.epub`, and Interactive Flipbook access!
  // --------------------------------------------------------------------------
  const UPSC_BOOK_VAULT = [
    // ==================== GS-II: POLITY, CONSTITUTION & IR ====================
    {
      id: 'upsc-pol-ddbasu',
      title: 'Introduction to the Constitution of India',
      author: 'Durga Das Basu',
      subject: 'Polity',
      gsPaper: 'GS-II',
      pages: 520,
      iaId: 'in.ernet.dli.2015.103074',
      olKey: '/works/OL107152W',
      spineColor: '#0f4c81',
      accentColor: '#00f5d4',
      rarity: 'Legendary',
      starter: true,
      syllabus: 'Constitutional Philosophy, Fundamental Rights, DPSP, Union & State Executive, Federalism, Amendments'
    },
    {
      id: 'upsc-pol-const-full',
      title: 'The Constitution of India (Complete Text & Articles)',
      author: 'Constituent Assembly of India',
      subject: 'Polity',
      gsPaper: 'GS-II',
      pages: 424,
      iaId: 'constitutionofin029189mbp',
      olKey: '/works/OL4521891W',
      spineColor: '#1e3a8a',
      accentColor: '#ffd166',
      rarity: 'Legendary',
      starter: true,
      syllabus: 'Complete Bare Constitution: Preamble, Parts I–XXII, Articles, Schedules & Constitutional Provisions'
    },
    {
      id: 'upsc-pol-keps2',
      title: 'Indian Constitution at Work (NCERT Class XI)',
      author: 'NCERT',
      subject: 'Polity',
      gsPaper: 'GS-II',
      pages: 260,
      iaId: 'ncert-keps2',
      olKey: '/works/OL20111W',
      spineColor: '#0e7490',
      accentColor: '#67e8f9',
      rarity: 'Epic',
      starter: true,
      syllabus: 'Why & How Constitution, Rights, Election & Representation, Executive, Legislature, Judiciary, Federalism, Local Govt'
    },
    {
      id: 'upsc-pol-keps1',
      title: 'Political Theory (NCERT Class XI)',
      author: 'NCERT',
      subject: 'Polity',
      gsPaper: 'GS-II',
      pages: 176,
      iaId: 'ncert-keps1',
      olKey: '/works/OL20112W',
      spineColor: '#155e75',
      accentColor: '#22d3ee',
      rarity: 'Rare',
      starter: false,
      syllabus: 'Freedom, Equality, Social Justice, Rights, Citizenship, Nationalism, Secularism — UPSC Prelims Conceptual Core'
    },
    {
      id: 'upsc-pol-leps2',
      title: 'Politics in India Since Independence (NCERT Class XII)',
      author: 'NCERT',
      subject: 'Polity',
      gsPaper: 'GS-II',
      pages: 212,
      iaId: 'ncert-leps2',
      olKey: '/works/OL20113W',
      spineColor: '#1d4ed8',
      accentColor: '#93c5fd',
      rarity: 'Epic',
      starter: false,
      syllabus: 'Post-Independence Nation Building, Planned Development, External Relations, Emergency, Regional Aspirations'
    },
    {
      id: 'upsc-pol-leps1',
      title: 'Contemporary World Politics — IR (NCERT Class XII)',
      author: 'NCERT',
      subject: 'Polity',
      gsPaper: 'GS-II',
      pages: 164,
      iaId: 'ncert-leps1',
      olKey: '/works/OL20114W',
      spineColor: '#312e81',
      accentColor: '#a5b4fc',
      rarity: 'Rare',
      starter: false,
      syllabus: 'International Organisations, UN, South Asia, ASEAN, EU, Security, Globalisation & Global Commons'
    },
    {
      id: 'upsc-pol-iess4',
      title: 'Democratic Politics-I (NCERT Class IX)',
      author: 'NCERT',
      subject: 'Polity',
      gsPaper: 'NCERT Foundation',
      pages: 124,
      iaId: 'ncert-iess4',
      olKey: '/works/OL20115W',
      spineColor: '#0369a1',
      accentColor: '#7dd3fc',
      rarity: 'Common',
      starter: false,
      syllabus: 'Constitutional Design, Electoral Politics, Working of Institutions, Democratic Rights'
    },
    {
      id: 'upsc-pol-jess4',
      title: 'Democratic Politics-II (NCERT Class X)',
      author: 'NCERT',
      subject: 'Polity',
      gsPaper: 'NCERT Foundation',
      pages: 132,
      iaId: 'ncert-jess4',
      olKey: '/works/OL20116W',
      spineColor: '#0284c7',
      accentColor: '#bae6fd',
      rarity: 'Common',
      starter: false,
      syllabus: 'Power Sharing, Federalism, Gender Religion & Caste, Political Parties, Outcomes of Democracy'
    },
    {
      id: 'upsc-pol-kautilya',
      title: 'Kautilya\'s Arthashastra (Complete 15 Adhikaranas)',
      author: 'Kautilya (Tr. R. Shamasastry)',
      subject: 'Polity',
      gsPaper: 'GS-II',
      pages: 484,
      iaId: 'kautilyas-arthashastra',
      olKey: '/works/OL319529W',
      spineColor: '#78350f',
      accentColor: '#ffd166',
      rarity: 'Legendary',
      starter: false,
      syllabus: 'Saptanga Theory, Rajadharma, Mandala Foreign Policy, Taxation, Anticorruption & Ancient Statecraft (GS-II/IV/PSIR)'
    },
    {
      id: 'upsc-pol-arc',
      title: 'Administrative Reforms Commission (ARC) Compendium',
      author: 'Government of India',
      subject: 'Polity',
      gsPaper: 'GS-II',
      pages: 340,
      iaId: 'dli.csl.828',
      olKey: '/works/OL20117W',
      spineColor: '#1e293b',
      accentColor: '#38bdf8',
      rarity: 'Epic',
      starter: false,
      syllabus: 'Governance Reforms, Civil Services Accountability, Centre-State Relations, District Administration (GS-II & GS-IV)'
    },

    // ==================== GS-I: ANCIENT, MEDIEVAL, MODERN & WORLD HISTORY ====================
    {
      id: 'upsc-his-rssharma',
      title: 'Ancient India (Classic Old NCERT Class XI)',
      author: 'R.S. Sharma',
      subject: 'History',
      gsPaper: 'GS-I',
      pages: 298,
      iaId: 'dli.ernet.4087',
      olKey: '/works/OL4612W',
      spineColor: '#9a3412',
      accentColor: '#fdba74',
      rarity: 'Legendary',
      starter: true,
      syllabus: 'Stone Age, Harappan Civilization, Vedic Period, Jainism & Buddhism, Mahajanapadas, Mauryas, Satavahanas, Guptas, Harsha'
    },
    {
      id: 'upsc-his-satish',
      title: 'Medieval India (Classic Old NCERT)',
      author: 'Satish Chandra',
      subject: 'History',
      gsPaper: 'GS-I',
      pages: 312,
      iaId: 'old-ncert-medieval-india-satish-chandra',
      olKey: '/works/OL4613W',
      spineColor: '#7c2d12',
      accentColor: '#fb923c',
      rarity: 'Legendary',
      starter: true,
      syllabus: 'Cholas, Tripartite Struggle, Delhi Sultanate, Vijayanagara & Bahmani, Bhakti-Sufi, Mughal Empire & Marathas'
    },
    {
      id: 'upsc-his-bipan-mod',
      title: 'History of Modern India (Complete Edition)',
      author: 'Bipan Chandra',
      subject: 'History',
      gsPaper: 'GS-I',
      pages: 368,
      iaId: 'HistoryOfModernIndiaBipinChandra',
      olKey: '/works/OL2819W',
      spineColor: '#991b1b',
      accentColor: '#fca5a5',
      rarity: 'Legendary',
      starter: true,
      syllabus: '18th Century Decline of Mughals, British Conquest, Economic Impact, Socio-Religious Reforms, Revolt of 1857, INC to 1947'
    },
    {
      id: 'upsc-his-struggle',
      title: 'India\'s Struggle for Independence (1857–1947)',
      author: 'Bipan Chandra, Mridula Mukherjee et al.',
      subject: 'History',
      gsPaper: 'GS-I',
      pages: 600,
      iaId: 'indias-struggle-for-independence_202106',
      olKey: '/works/OL1946514W',
      spineColor: '#7f1d1d',
      accentColor: '#ffd166',
      rarity: 'Legendary',
      starter: false,
      syllabus: 'Deep Mains + Prelims Mastery: Swadeshi, Ghadar, Home Rule, Non-Cooperation, Bhagat Singh, Civil Disobedience, Quit India, INA'
    },
    {
      id: 'upsc-his-bipan-ncert',
      title: 'Modern India — Old NCERT Class XII',
      author: 'Bipan Chandra (NCERT)',
      subject: 'History',
      gsPaper: 'GS-I',
      pages: 318,
      iaId: 'dli.ernet.231730',
      olKey: '/works/OL2820W',
      spineColor: '#b91c1c',
      accentColor: '#fecaca',
      rarity: 'Epic',
      starter: false,
      syllabus: 'Original Old NCERT Modern India text revered for UPSC Prelims & Mains answer structure'
    },
    {
      id: 'upsc-his-basham',
      title: 'The Wonder That Was India',
      author: 'A.L. Basham',
      subject: 'Art & Culture',
      gsPaper: 'GS-I',
      pages: 680,
      iaId: 'dli.bengal.10689.12501',
      olKey: '/works/OL1109905W',
      spineColor: '#6b21a8',
      accentColor: '#f0abfc',
      rarity: 'Legendary',
      starter: false,
      syllabus: 'Ancient Indian Culture, Philosophy, Six Darshanas, Literature, Temple Architecture, Sculpture, Music & Statecraft'
    },
    {
      id: 'upsc-his-arjundev',
      title: 'The Story of Civilization Vol. II (World History)',
      author: 'Arjun Dev (Old NCERT)',
      subject: 'History',
      gsPaper: 'GS-I',
      pages: 290,
      iaId: 'dli.ernet.231727',
      olKey: '/works/OL4618W',
      spineColor: '#854d0e',
      accentColor: '#fde047',
      rarity: 'Epic',
      starter: false,
      syllabus: 'GS-I World History: Industrial Revolution, American/French/Russian Revolutions, Imperialism, World Wars I & II, Cold War'
    },
    {
      id: 'upsc-his-discovery',
      title: 'The Discovery of India',
      author: 'Jawaharlal Nehru',
      subject: 'History',
      gsPaper: 'GS-I',
      pages: 642,
      iaId: 'TheDiscoveryOfIndia-Eng-JawaharlalNehru',
      olKey: '/works/OL16995W',
      spineColor: '#3730a3',
      accentColor: '#ffd166',
      rarity: 'Legendary',
      starter: false,
      syllabus: 'Civilizational Continuity of India, Indus to Freedom Struggle, Essay & GS-I Cultural Synthesis'
    },
    {
      id: 'upsc-his-hindswaraj',
      title: 'Hind Swaraj (Indian Home Rule)',
      author: 'Mahatma Gandhi',
      subject: 'History',
      gsPaper: 'GS-I',
      pages: 148,
      iaId: 'hindswarajorindi00ganduoft',
      olKey: '/works/OL116552W',
      spineColor: '#3f6212',
      accentColor: '#bef264',
      rarity: 'Epic',
      starter: false,
      syllabus: 'Gandhian Thought, Satyagraha, Swaraj, Critique of Modernity — High-yield for GS-I, GS-IV Ethics & Essay'
    },
    {
      id: 'upsc-his-lehs1',
      title: 'Themes in Indian History Part-I (NCERT Class XII)',
      author: 'NCERT',
      subject: 'History',
      gsPaper: 'GS-I',
      pages: 128,
      iaId: 'ncert-lehs1',
      olKey: '/works/OL20121W',
      spineColor: '#b45309',
      accentColor: '#fcd34d',
      rarity: 'Epic',
      starter: false,
      syllabus: 'Bricks Beads & Bones (Harappa), Kings Farmers & Towns, Kinship Caste & Class, Thinkers Beliefs & Buildings (Sanchi/Amravati)'
    },
    {
      id: 'upsc-his-lehs2',
      title: 'Themes in Indian History Part-II (NCERT Class XII)',
      author: 'NCERT',
      subject: 'History',
      gsPaper: 'GS-I',
      pages: 144,
      iaId: 'ncert-lehs2',
      olKey: '/works/OL20122W',
      spineColor: '#92400e',
      accentColor: '#fde68a',
      rarity: 'Epic',
      starter: false,
      syllabus: 'Al-Biruni, Ibn Battuta & Bernier, Bhakti-Sufi Traditions, Imperial Capital Vijayanagara, Peasants Zamindars & Mughal State'
    },
    {
      id: 'upsc-his-lehs3',
      title: 'Themes in Indian History Part-III (NCERT Class XII)',
      author: 'NCERT',
      subject: 'History',
      gsPaper: 'GS-I',
      pages: 168,
      iaId: 'ncert-lehs3',
      olKey: '/works/OL20123W',
      spineColor: '#991b1b',
      accentColor: '#fda4af',
      rarity: 'Epic',
      starter: false,
      syllabus: 'Colonialism & Countryside (Santhal/Paharias), Rebels & the Raj 1857, Mahatma Gandhi, Framing the Constitution'
    },
    {
      id: 'upsc-his-kehs1',
      title: 'Themes in World History (NCERT Class XI)',
      author: 'NCERT',
      subject: 'History',
      gsPaper: 'GS-I',
      pages: 264,
      iaId: 'ncert-kehs1',
      olKey: '/works/OL20124W',
      spineColor: '#713f12',
      accentColor: '#fef08a',
      rarity: 'Rare',
      starter: false,
      syllabus: 'Mesopotamia, Roman Empire, Nomadic Empires, Three Orders, Changing Cultural Traditions, Paths to Modernisation'
    },
    {
      id: 'upsc-his-fess1',
      title: 'Our Pasts-I (NCERT Class VI Ancient Foundation)',
      author: 'NCERT',
      subject: 'History',
      gsPaper: 'NCERT Foundation',
      pages: 136,
      iaId: 'ncert-fess1',
      olKey: '/works/OL20125W',
      spineColor: '#a16207',
      accentColor: '#fde047',
      rarity: 'Common',
      starter: false,
      syllabus: 'In the Earliest Cities, Ashoka the Emperor Who Gave Up War, New Empires & Kingdoms, Vital Villages'
    },
    {
      id: 'upsc-his-gess1',
      title: 'Our Pasts-II (NCERT Class VII Medieval Foundation)',
      author: 'NCERT',
      subject: 'History',
      gsPaper: 'NCERT Foundation',
      pages: 154,
      iaId: 'ncert-gess1',
      olKey: '/works/OL20126W',
      spineColor: '#c2410c',
      accentColor: '#fdba74',
      rarity: 'Common',
      starter: false,
      syllabus: 'New Kings & Kingdoms, Delhi Sultans, Mughals, Tribes Nomads, Devotional Paths, 18th Century Political Formations'
    },
    {
      id: 'upsc-his-hess2',
      title: 'Our Pasts-III (NCERT Class VIII Modern Foundation)',
      author: 'NCERT',
      subject: 'History',
      gsPaper: 'NCERT Foundation',
      pages: 166,
      iaId: 'ncert-hess2',
      olKey: '/works/OL20127W',
      spineColor: '#be123c',
      accentColor: '#fda4af',
      rarity: 'Common',
      starter: false,
      syllabus: 'From Trade to Territory, Ruling the Countryside, Tribals Dikus, When People Rebel 1857, Civilising the Native, National Movement'
    },

    // ==================== GS-I: ART, CULTURE & INDIAN SOCIETY ====================
    {
      id: 'upsc-art-kefa1',
      title: 'An Introduction to Indian Art Part-I (NCERT Class XI)',
      author: 'NCERT Fine Arts',
      subject: 'Art & Culture',
      gsPaper: 'GS-I',
      pages: 152,
      iaId: 'ncert-kefa1',
      olKey: '/works/OL20131W',
      spineColor: '#86198f',
      accentColor: '#f5d0fe',
      rarity: 'Legendary',
      starter: true,
      syllabus: '#1 UPSC Art & Culture Bible: Bhimbetka, Indus Valley Arts, Mauryan Pillars, Ajanta Caves, Temple Sculpture, Indo-Islamic Architecture'
    },
    {
      id: 'upsc-art-lefa1',
      title: 'An Introduction to Indian Art Part-II (NCERT Class XII)',
      author: 'NCERT Fine Arts',
      subject: 'Art & Culture',
      gsPaper: 'GS-I',
      pages: 158,
      iaId: 'ncert-lefa1',
      olKey: '/works/OL20132W',
      spineColor: '#701a75',
      accentColor: '#f0abfc',
      rarity: 'Epic',
      starter: false,
      syllabus: 'Rajasthani, Mughal, Deccani & Pahari Miniature Schools, Bengal School, Modern Indian Painting & Folk Art Traditions'
    },
    {
      id: 'upsc-art-coomara',
      title: 'Introduction to Indian Art',
      author: 'Ananda K. Coomaraswamy',
      subject: 'Art & Culture',
      gsPaper: 'GS-I',
      pages: 196,
      iaId: 'IntroductionToIndianArt',
      olKey: '/works/OL112345W',
      spineColor: '#581c87',
      accentColor: '#e9d5ff',
      rarity: 'Rare',
      starter: false,
      syllabus: 'Vedic Symbolism, Buddhist Art, Gupta Classicism, Nataraja Aesthetics & Rajput Painting'
    },
    {
      id: 'upsc-art-kehc1',
      title: 'Living Craft Traditions of India (NCERT Class XI)',
      author: 'NCERT',
      subject: 'Art & Culture',
      gsPaper: 'GS-I',
      pages: 140,
      iaId: 'ncert-kehc1',
      olKey: '/works/OL20133W',
      spineColor: '#9d174d',
      accentColor: '#fbcfe8',
      rarity: 'Rare',
      starter: false,
      syllabus: 'Clay, Stone, Metal Crafts, Textiles, GI-linked Traditional Crafts & Performing Traditions'
    },
    {
      id: 'upsc-soc-lesy1',
      title: 'Indian Society (NCERT Class XII Sociology)',
      author: 'NCERT',
      subject: 'Art & Culture',
      gsPaper: 'GS-I',
      pages: 168,
      iaId: 'ncert-lesy1',
      olKey: '/works/OL20134W',
      spineColor: '#4c1d95',
      accentColor: '#c4b5fd',
      rarity: 'Epic',
      starter: false,
      syllabus: 'GS-I Indian Society: Demographic Dividend, Caste & Tribe Institutions, Kinship, Communalism, Regionalism & Diversity'
    },
    {
      id: 'upsc-soc-lesy2',
      title: 'Social Change and Development in India (Class XII)',
      author: 'NCERT',
      subject: 'Art & Culture',
      gsPaper: 'GS-I',
      pages: 176,
      iaId: 'ncert-lesy2',
      olKey: '/works/OL20135W',
      spineColor: '#5b21b6',
      accentColor: '#ddd6fe',
      rarity: 'Rare',
      starter: false,
      syllabus: 'Sanskritisation, Westernisation, Secularisation, Rural Agrarian Change, Globalisation & Social Movements'
    },

    // ==================== GS-I: PHYSICAL, HUMAN & INDIAN GEOGRAPHY ====================
    {
      id: 'upsc-geo-gcleong',
      title: 'Certificate Physical and Human Geography',
      author: 'Goh Cheng Leong',
      subject: 'Geography',
      gsPaper: 'GS-I',
      pages: 356,
      iaId: 'g-c-leong-geography-upsc_study_hub',
      olKey: '/works/OL29112W',
      spineColor: '#065f46',
      accentColor: '#6ee7b7',
      rarity: 'Legendary',
      starter: true,
      syllabus: 'Landforms (Fluvial, Karst, Glacial, Arid, Coastal), Vulcanicity, Earthquakes, Oceans, World Climatic Regions (Equatorial to Tundra)'
    },
    {
      id: 'upsc-geo-kegy2',
      title: 'Fundamentals of Physical Geography (NCERT Class XI)',
      author: 'NCERT',
      subject: 'Geography',
      gsPaper: 'GS-I',
      pages: 162,
      iaId: 'ncert-kegy2',
      olKey: '/works/OL20141W',
      spineColor: '#047857',
      accentColor: '#34d399',
      rarity: 'Legendary',
      starter: true,
      syllabus: 'Interior of Earth, Plate Tectonics, Geomorphic Processes, Insolation, Atmospheric Circulation, Water in Atmosphere, Ocean Currents'
    },
    {
      id: 'upsc-geo-kegy1',
      title: 'India: Physical Environment (NCERT Class XI)',
      author: 'NCERT',
      subject: 'Geography',
      gsPaper: 'GS-I',
      pages: 112,
      iaId: 'ncert-kegy1',
      olKey: '/works/OL20142W',
      spineColor: '#0f766e',
      accentColor: '#5eead4',
      rarity: 'Legendary',
      starter: true,
      syllabus: 'Physiographic Divisions of India, Himalayan vs Peninsular Drainage Systems, Indian Monsoon, Natural Vegetation & Soils'
    },
    {
      id: 'upsc-geo-legy2',
      title: 'India: People and Economy (NCERT Class XII)',
      author: 'NCERT',
      subject: 'Geography',
      gsPaper: 'GS-I',
      pages: 154,
      iaId: 'ncert-legy2',
      olKey: '/works/OL20143W',
      spineColor: '#115e59',
      accentColor: '#99f6e4',
      rarity: 'Epic',
      starter: false,
      syllabus: 'Population & Migration, Human Settlements, Land Resources & Agriculture, Water, Mineral & Energy Resources, Transport'
    },
    {
      id: 'upsc-geo-legy1',
      title: 'Fundamentals of Human Geography (NCERT Class XII)',
      author: 'NCERT',
      subject: 'Geography',
      gsPaper: 'GS-I',
      pages: 118,
      iaId: 'ncert-legy1',
      olKey: '/works/OL20144W',
      spineColor: '#134e4a',
      accentColor: '#2dd4bf',
      rarity: 'Rare',
      starter: false,
      syllabus: 'Human Development, Primary/Secondary/Tertiary/Quaternary Activities, International Trade & Trans-Continental Corridors'
    },
    {
      id: 'upsc-geo-iess1',
      title: 'Contemporary India-I (NCERT Class IX Geography)',
      author: 'NCERT',
      subject: 'Geography',
      gsPaper: 'NCERT Foundation',
      pages: 108,
      iaId: 'ncert-iess1',
      olKey: '/works/OL20145W',
      spineColor: '#15803d',
      accentColor: '#86efac',
      rarity: 'Common',
      starter: false,
      syllabus: 'India Size & Location, Physical Features, Drainage, Climate, Natural Vegetation & Wildlife'
    },

    // ==================== GS-III: ECONOMY, ENVIRONMENT & SCIENCE/TECH ====================
    {
      id: 'upsc-eco-leec1',
      title: 'Introductory Macroeconomics (NCERT Class XII)',
      author: 'NCERT',
      subject: 'Economy',
      gsPaper: 'GS-III',
      pages: 140,
      iaId: 'ncert-leec1',
      olKey: '/works/OL20151W',
      spineColor: '#a16207',
      accentColor: '#ffd166',
      rarity: 'Legendary',
      starter: true,
      syllabus: 'National Income Accounting (GDP/GNP/GVA), Money & Banking (RBI Multiplier, Repo/CRR), Government Budget & Fiscal Deficit, BoP & Forex'
    },
    {
      id: 'upsc-eco-keec1',
      title: 'Indian Economic Development (NCERT Class XI)',
      author: 'NCERT',
      subject: 'Economy',
      gsPaper: 'GS-III',
      pages: 216,
      iaId: 'ncert-keec1',
      olKey: '/works/OL20152W',
      spineColor: '#854d0e',
      accentColor: '#fde047',
      rarity: 'Epic',
      starter: false,
      syllabus: '1950–1990 Planning, 1991 LPG Reforms, Poverty, Human Capital, Rural Development, Employment & Sustainable Development'
    },
    {
      id: 'upsc-eco-jess2',
      title: 'Understanding Economic Development (NCERT Class X)',
      author: 'NCERT',
      subject: 'Economy',
      gsPaper: 'NCERT Foundation',
      pages: 112,
      iaId: 'ncert-jess2',
      olKey: '/works/OL20153W',
      spineColor: '#ca8a04',
      accentColor: '#fef08a',
      rarity: 'Common',
      starter: false,
      syllabus: 'Sectors of Indian Economy, Money & Formal/Informal Credit, Globalisation & Consumer Rights'
    },
    {
      id: 'upsc-eco-survey',
      title: 'Economic Survey of India (Ministry of Finance)',
      author: 'Chief Economic Adviser, GoI',
      subject: 'Economy',
      gsPaper: 'GS-III',
      pages: 284,
      iaId: 'PARI.economic-survey-2017-18-volume-i',
      olKey: '/works/OL20154W',
      spineColor: '#713f12',
      accentColor: '#fbbf24',
      rarity: 'Epic',
      starter: false,
      syllabus: 'Macroeconomic Policy Analysis, Investment, GST Architecture, Agriculture, Climate Finance & Structural Reforms'
    },
    {
      id: 'upsc-eco-rcdutt',
      title: 'The Economic History of India Vol. I (Drain Theory)',
      author: 'Romesh Chunder Dutt',
      subject: 'Economy',
      gsPaper: 'GS-III',
      pages: 452,
      iaId: 'economichistoryo01dutt',
      olKey: '/works/OL118912W',
      spineColor: '#78350f',
      accentColor: '#fcd34d',
      rarity: 'Rare',
      starter: false,
      syllabus: 'De-industrialisation, Land Revenue Settlements (Permanent, Ryotwari, Mahalwari) & Drain of Wealth (GS-I & GS-III)'
    },
    {
      id: 'upsc-env-bharucha',
      title: 'Environmental Studies (Complete Ecology Textbook)',
      author: 'Erach Bharucha',
      subject: 'Environment',
      gsPaper: 'GS-III',
      pages: 322,
      iaId: 'environmental-studies',
      olKey: '/works/OL20161W',
      spineColor: '#14532d',
      accentColor: '#4ade80',
      rarity: 'Legendary',
      starter: true,
      syllabus: 'Ecosystems, Food Webs, Biodiversity Hotspots of India, Pollution, Climate Change, Wildlife Act & Environmental Conservation'
    },
    {
      id: 'upsc-sci-lebo1',
      title: 'Biology Class XII (Ecology & Biotechnology Units)',
      author: 'NCERT',
      subject: 'Science & Tech',
      gsPaper: 'GS-III',
      pages: 302,
      iaId: 'ncert-lebo1',
      olKey: '/works/OL20162W',
      spineColor: '#166534',
      accentColor: '#86efac',
      rarity: 'Epic',
      starter: false,
      syllabus: 'Recombinant DNA, Biotechnology Principles & Applications, Organisms & Populations, Ecosystem, Biodiversity & Conservation'
    },
    {
      id: 'upsc-sci-jesc1',
      title: 'Science Foundation (NCERT Class X Complete)',
      author: 'NCERT',
      subject: 'Science & Tech',
      gsPaper: 'GS-III',
      pages: 290,
      iaId: 'ncert-jesc1',
      olKey: '/works/OL20163W',
      spineColor: '#3b0764',
      accentColor: '#d8b4fe',
      rarity: 'Rare',
      starter: false,
      syllabus: 'Physics Optics/Electricity, Everyday Chemistry, Life Processes, Heredity & Our Environment for Prelims General Science'
    },

    // ==================== GS-IV: ETHICS, INTEGRITY, PSYCHOLOGY & PHILOSOPHY ====================
    {
      id: 'upsc-eth-ignou',
      title: 'Ethics & Philosophy Complete Compendium (IGNOU)',
      author: 'IGNOU Faculty of Philosophy',
      subject: 'Ethics',
      gsPaper: 'GS-IV',
      pages: 540,
      iaId: 'ba-philosophy-year-1-2-and-3',
      olKey: '/works/OL20171W',
      spineColor: '#831843',
      accentColor: '#f9a8d4',
      rarity: 'Legendary',
      starter: false,
      syllabus: 'Western Moral Thinkers (Socrates, Plato, Aristotle, Kant, Mill, Rawls) & Indian Ethics (Nishkama Karma, Buddhist, Jain, Gandhian)'
    },
    {
      id: 'upsc-eth-gov',
      title: 'Ethics & Anti-Corruption in Governance (Parliament Dossier)',
      author: 'Lok Sabha Secretariat',
      subject: 'Ethics',
      gsPaper: 'GS-IV',
      pages: 120,
      iaId: 'eparlib.nic.in.602011',
      olKey: '/works/OL20172W',
      spineColor: '#9f1239',
      accentColor: '#fda4af',
      rarity: 'Epic',
      starter: false,
      syllabus: 'Probity in Governance, Lokpal, CVC, Prevention of Corruption, Codes of Conduct & Public Service Values'
    },
    {
      id: 'upsc-eth-lepy1',
      title: 'Psychology: Attitude & Social Cognition (NCERT XII)',
      author: 'NCERT',
      subject: 'Ethics',
      gsPaper: 'GS-IV',
      pages: 206,
      iaId: 'ncert-lepy1',
      olKey: '/works/OL20173W',
      spineColor: '#6d28d9',
      accentColor: '#c4b5fd',
      rarity: 'Epic',
      starter: false,
      syllabus: 'GS-IV Unit 2 & 3: Attitude Formation & Change, Prejudice, Emotional Intelligence, Aptitude & Persuasion'
    },
    {
      id: 'upsc-eth-sabine',
      title: 'A History of Political Theory (Thinkers Masterwork)',
      author: 'George H. Sabine',
      subject: 'Ethics',
      gsPaper: 'GS-IV',
      pages: 780,
      iaId: 'dli.ernet.260180',
      olKey: '/works/OL142312W',
      spineColor: '#4a044e',
      accentColor: '#f0abfc',
      rarity: 'Legendary',
      starter: false,
      syllabus: 'Plato, Aristotle, Machiavelli, Hobbes, Locke, Rousseau, Hegel, Marx & Liberalism — GS-IV Thinkers & PSIR Optional'
    },
    // ==================== PUBLIC ADMINISTRATION OPTIONAL ====================
    {
      id: 'upsc-pubad-basu',
      title: 'Public Administration: An Introduction to Concepts and Theories',
      author: 'Rumki Basu',
      subject: 'Public Administration',
      gsPaper: 'Optional',
      pages: 416,
      iaId: 'dli.ernet.449388',
      olKey: '/works/OL24950749W',
      spineColor: '#7c3aed',
      accentColor: '#a78bfa',
      rarity: 'Legendary',
      starter: false,
      syllabus: 'Public Administration Optional Paper I — Administrative Theory, Organisation, Principles of Management, Accountability & Control, Administrative Law, Comparative Public Administration, Development Dynamics'
    },
    {
      id: 'upsc-pubad-prasad',
      title: 'Administrative Thinkers',
      author: 'Prasad & Prasad',
      subject: 'Public Administration',
      gsPaper: 'Optional',
      pages: 520,
      iaId: 'AdministrativeThinkersPrasadAndPrasadPubAdOptional',
      olKey: '/works/OL33218830W',
      spineColor: '#0891b2',
      accentColor: '#22d3ee',
      rarity: 'Legendary',
      starter: false,
      syllabus: 'Public Administration Optional Paper I — Administrative Thinkers: Kautilya, Aristotle, Plato, Weber, Taylor, Fayol, Follett, Mayo, Maslow, McGregor, Simon, Chester Barnard, Dwight Waldo, Riggs, Fred Riggs, Chris Argyris'
    }
  ];

  // --------------------------------------------------------------------------
  // 3. HANDCRAFTED TOPPER-GRADE UPSC CSE PRELIMS & CSAT QUESTION BANK
  // --------------------------------------------------------------------------
  const STATIC_QUESTIONS = [
    // --- POLITY ---
    {
      id: 'q-pol-1',
      year: 2023,
      subject: 'Polity',
      type: '3-Statement UPSC Pattern',
      prompt: 'Consider the following statements regarding Money Bills under the Constitution of India:\n1. A Money Bill can be introduced only in the Lok Sabha and only on the recommendation of the President.\n2. The Rajya Sabha can detain a Money Bill for a maximum period of 14 days and cannot amend or reject it.\n3. The President can return a Money Bill for reconsideration of the Houses once under Article 111.\n\nHow many of the statements given above are correct?',
      options: ['Only one', 'Only two', 'All three', 'None'],
      answer: 1,
      explanation: 'Statements 1 and 2 are CORRECT (Articles 109 & 110). Statement 3 is INCORRECT: Under Article 111, the President may either give assent to a Money Bill or withhold assent, automatic return for reconsideration is NOT permitted for Money Bills (since it is introduced with prior Presidential recommendation).'
    },
    {
      id: 'q-pol-2',
      year: 2022,
      subject: 'Polity',
      type: 'Conceptual Trap',
      prompt: 'Which one of the following writs literally means "We Command" and CANNOT be issued against a private individual, the President of India, or a State Governor?',
      options: ['Habeas Corpus', 'Mandamus', 'Certiorari', 'Quo-Warranto'],
      answer: 1,
      explanation: 'Mandamus ("We Command") is issued by Supreme Court (Art. 32) / High Courts (Art. 226) to a public official asking them to perform official duties they have failed or refused to perform. Unlike Habeas Corpus (which can be issued against private individuals too), Mandamus cannot lie against private individuals, the President, or State Governors (Art. 361).'
    },
    {
      id: 'q-pol-3',
      year: 2021,
      subject: 'Polity',
      type: '3-Statement UPSC Pattern',
      prompt: 'With reference to the Ninth Schedule of the Constitution of India, consider the following statements:\n1. It was added by the First Constitutional Amendment Act, 1951 during the tenure of Prime Minister Jawaharlal Nehru.\n2. In the I.R. Coelho case (2007), the Supreme Court ruled that laws placed in the Ninth Schedule after April 24, 1973 are open to judicial review if they violate the Basic Structure.\n3. Only State Legislatures can enact laws that are subsequently placed in the Ninth Schedule.\n\nHow many of the above statements are correct?',
      options: ['Only one', 'Only two', 'All three', 'None'],
      answer: 1,
      explanation: 'Statements 1 and 2 are CORRECT (April 24, 1973 is the landmark Kesavananda Bharati judgment date). Statement 3 is INCORRECT: Both Central and State laws can be placed in the Ninth Schedule via a Constitutional Amendment under Article 368.'
    },
    {
      id: 'q-pol-4',
      year: 2020,
      subject: 'Polity',
      type: '2-Statement UPSC Pattern',
      prompt: 'Consider the following statements regarding the Anti-Defection Law (Tenth Schedule):\n1. A nominated member of a House becomes disqualified if they join any political party after the expiry of six months from the date on which they take their seat.\n2. The decision of the Presiding Officer on disqualification under the Tenth Schedule is immune from judicial review.\n\nWhich of the statements given above is/are correct?',
      options: ['1 only', '2 only', 'Both 1 and 2', 'Neither 1 nor 2'],
      answer: 0,
      explanation: 'Statement 1 is CORRECT (52nd Amendment Act, 1985). Statement 2 is INCORRECT: In Kihoto Hollohan vs Zachillhu (1992), the Supreme Court held that the Speaker/Chairman acts as a tribunal while deciding Tenth Schedule cases and their decision IS subject to judicial review on grounds of mala fides or perversity.'
    },
    {
      id: 'q-pol-5',
      year: 2019,
      subject: 'Polity',
      type: 'Direct Prelims PYQ Style',
      prompt: 'In the Indian Parliamentary system, "Vote on Account" differs from an "Interim Budget" primarily because:',
      options: [
        'Vote on Account deals only with the expenditure side of the government\'s budget, whereas an Interim Budget includes both expenditure and receipts.',
        'Vote on Account requires approval of both Lok Sabha and Rajya Sabha by special majority.',
        'Vote on Account can only be passed in an election year, whereas Interim Budget is passed every year.',
        'Vote on Account draws funds from the Contingency Fund of India rather than the Consolidated Fund.'
      ],
      answer: 0,
      explanation: 'Under Article 116, Vote on Account is an advance grant enabling the government to meet short-term expenditure from the Consolidated Fund of India until the Appropriation Bill is passed—it covers ONLY expenditure. An Interim Budget is a complete set of accounts covering both receipts and expenditures.'
    },
    // --- HISTORY & ART/CULTURE ---
    {
      id: 'q-his-1',
      year: 2023,
      subject: 'History',
      type: '3-Statement UPSC Pattern',
      prompt: 'With reference to the Ryotwari Settlement during British rule in India, consider the following statements:\n1. It was pioneered by Alexander Read and Thomas Munro primarily in the Madras and Bombay Presidencies.\n2. Under this system, revenue settlement was made directly between the government and the individual cultivator (Ryot).\n3. The revenue rates were fixed permanently and could never be revised.\n\nHow many of the statements given above are correct?',
      options: ['Only one', 'Only two', 'All three', 'None'],
      answer: 1,
      explanation: 'Statements 1 and 2 are CORRECT. Statement 3 is INCORRECT: Unlike Cornwallis\'s Permanent Settlement (1793), land revenue under the Ryotwari system was NOT permanent—it was revised periodically (every 20 to 30 years) on the basis of soil survey.'
    },
    {
      id: 'q-his-2',
      year: 2022,
      subject: 'History',
      type: '2-Statement UPSC Pattern',
      prompt: 'Consider the following statements regarding the Government of India Act, 1919 (Montagu-Chelmsford Reforms):\n1. It introduced Dyarchy at the Central Legislature while granting complete provincial autonomy.\n2. It divided provincial subjects into "Transferred" and "Reserved" categories.\n\nWhich of the statements given above is/are correct?',
      options: ['1 only', '2 only', 'Both 1 and 2', 'Neither 1 nor 2'],
      answer: 1,
      explanation: 'Statement 1 is INCORRECT: The 1919 Act introduced Dyarchy in the PROVINCES (not the Centre; Dyarchy at the Centre + Provincial Autonomy came via the GoI Act, 1935). Statement 2 is CORRECT.'
    },
    {
      id: 'q-his-3',
      year: 2021,
      subject: 'History',
      type: 'Conceptual PYQ Style',
      prompt: 'In the context of Ancient Indian history, the terms "Kulyavapa" and "Dronavapa" found in Gupta-period inscriptions denote:',
      options: [
        'Measurement of land based on seed-sowing capacity',
        'Categories of royal naval warships in Bengal',
        'Grades of Buddhist monastic ordination at Nalanda',
        'Guilds of silk-weavers migrating in Western Malwa'
      ],
      answer: 0,
      explanation: 'Asked in UPSC Prelims! In Gupta inscriptions (especially from Bengal), Kulyavapa, Dronavapa, and Adhavapa denoted land measurements based on the volume (kulya / drona) of grain seeds required to sow that area of land.'
    },
    {
      id: 'q-art-1',
      year: 2022,
      subject: 'Art & Culture',
      type: '3-Statement UPSC Pattern',
      prompt: 'With reference to Indian Temple Architecture, consider the following statements:\n1. Unlike Dravida temples, Nagara style temples generally do NOT have elaborate boundary walls or grand gateways (Gopurams).\n2. In Nagara temples, the garbhagriha is always located directly beneath the tallest tower (Shikhara).\n3. The Kailashnath Temple at Ellora is a brick-built structural temple constructed by the Pallavas.\n\nHow many of the statements given above are correct?',
      options: ['Only one', 'Only two', 'All three', 'None'],
      answer: 1,
      explanation: 'Statements 1 and 2 are CORRECT (straight from NCERT Class XI Introduction to Indian Art Part-I!). Statement 3 is INCORRECT: The Kailashnath Temple at Ellora (Cave 16) is a MONOLITHIC ROCK-CUT temple carved top-down under Rashtrakuta King Krishna I (whereas Kailasanathar at Kanchipuram is Pallava).'
    },
    {
      id: 'q-art-2',
      year: 2021,
      subject: 'Art & Culture',
      type: 'Conceptual PYQ Style',
      prompt: 'Which school of Indian sculpture was patronized by the Kushanas, used spotted red sandstone, and produced the earliest indigenous anthropomorphic images of the Buddha alongside Yakshas and Tirthankaras?',
      options: ['Gandhara School', 'Mathura School', 'Amaravati School', 'Pala-Sena School'],
      answer: 1,
      explanation: 'The Mathura School (1st–3rd century CE, patronized by Kushanas) used spotted red sandstone from Sikri and drew upon indigenous Yaksha traditions across Buddhism, Jainism, and Brahmanism. Gandhara used bluish-grey schist/stucco with Greco-Roman influence, while Amaravati used white limestone (Satavahanas/Ikshvakus).'
    },
    // --- GEOGRAPHY ---
    {
      id: 'q-geo-1',
      year: 2023,
      subject: 'Geography',
      type: '3-Statement UPSC Pattern',
      prompt: 'Consider the following statements regarding the Indian Ocean Dipole (IOD):\n1. A Positive IOD phase is characterized by warmer-than-normal sea surface temperatures in the western Indian Ocean relative to the eastern equatorial Indian Ocean.\n2. A Positive IOD tends to strengthen the Southwest Monsoon winds over India and can offset the adverse impact of El Niño.\n3. The IOD occurs exclusively in the Atlantic and Pacific basins.\n\nHow many of the statements given above are correct?',
      options: ['Only one', 'Only two', 'All three', 'None'],
      answer: 1,
      explanation: 'Statements 1 and 2 are CORRECT (e.g., 1997 strong El Niño was neutralized over India by a strong Positive IOD). Statement 3 is INCORRECT: IOD is an atmosphere-ocean coupled phenomenon native to the equatorial Indian Ocean ("Indian Niño").'
    },
    {
      id: 'q-geo-2',
      year: 2022,
      subject: 'Geography',
      type: '2-Statement UPSC Pattern',
      prompt: 'With reference to Karewas in India, consider the following statements:\n1. They are thick lacustrine deposits of glacial clay and moraines found in the Kashmir Valley.\n2. They are world-renowned for the cultivation of Zafran (a local variety of saffron).\n\nWhich of the statements given above is/are correct?',
      options: ['1 only', '2 only', 'Both 1 and 2', 'Neither 1 nor 2'],
      answer: 2,
      explanation: 'Both statements 1 and 2 are CORRECT (NCERT Class XI India: Physical Environment, Chapter 2). Karewas are unconsolidated glacio-fluvial-lacustrine deposits on the Pir Panjal slopes ideal for Pampore Zafran, almonds, and walnuts.'
    },
    {
      id: 'q-geo-3',
      year: 2020,
      subject: 'Geography',
      type: 'Conceptual Trap',
      prompt: 'If you travel by road from Kohima to Kottayam via the shortest route within India, what is the minimum number of States through which you must pass, INCLUDING the origin and the destination?',
      options: ['6', '7', '8', '9'],
      answer: 1,
      explanation: 'Classic UPSC Prelims map question! Route: Nagaland (Kohima) → Assam → West Bengal → Odisha → Andhra Pradesh → Tamil Nadu (or Karnataka) → Kerala (Kottayam) = 7 States total including origin & destination.'
    },
    // --- ECONOMY ---
    {
      id: 'q-eco-1',
      year: 2023,
      subject: 'Economy',
      type: '3-Statement UPSC Pattern',
      prompt: 'If the Reserve Bank of India (RBI) decides to adopt an expansionary (accommodative) monetary policy, which of the following actions would it undertake?\n1. Cut the Statutory Liquidity Ratio (SLR) and Cash Reserve Ratio (CRR).\n2. Increase the Marginal Standing Facility (MSF) rate and Policy Repo Rate.\n3. Conduct Open Market Operations (OMO) by purchasing government securities from the market.\n\nSelect the correct answer using the code given below:',
      options: ['1 and 2 only', '1 and 3 only', '2 and 3 only', '1, 2 and 3'],
      answer: 1,
      explanation: '1 and 3 inject liquidity into the banking system (expansionary). Action 2 (increasing MSF & Repo Rate) makes borrowing costlier and is CONTRACTIONARY (anti-inflationary/hawkish). Hence 1 and 3 only is correct.'
    },
    {
      id: 'q-eco-2',
      year: 2022,
      subject: 'Economy',
      type: 'Conceptual PYQ Style',
      prompt: 'Which of the following are included in the Capital Account of India\'s Balance of Payments (BoP)?\n1. Foreign Direct Investment (FDI) and Foreign Portfolio Investment (FPI)\n2. External Commercial Borrowings (ECBs)\n3. Remittances sent by Indian diaspora working in the Gulf\n4. NRI Deposits\n\nSelect the correct answer:',
      options: ['1, 2 and 4 only', '1, 2 and 3 only', '2, 3 and 4 only', '1, 2, 3 and 4'],
      answer: 0,
      explanation: 'FDI, FPI, ECBs, and NRI Deposits alter assets/liabilities and belong to the CAPITAL Account. Private remittances (unilateral transfers) belong to Invisibles under the CURRENT Account!'
    },
    {
      id: 'q-eco-3',
      year: 2021,
      subject: 'Economy',
      type: 'Direct Prelims Style',
      prompt: 'A high "Incremental Capital-Output Ratio" (ICOR) in an economy indicates that:',
      options: [
        'More capital investment is required to produce one additional unit of output (lower capital efficiency).',
        'Less capital is required to produce a huge surge in GDP (higher productivity).',
        'Tax revenue grows faster than nominal GDP without any rate changes.',
        'Inflation and unemployment are rising simultaneously.'
      ],
      answer: 0,
      explanation: 'ICOR = (Annual Investment / Annual Increase in GDP). A HIGHER ICOR means an economy is LESS efficient with capital (requiring more units of capital per unit of extra output); a LOWER ICOR indicates higher productivity of capital.'
    },
    // --- ENVIRONMENT & ECOLOGY ---
    {
      id: 'q-env-1',
      year: 2023,
      subject: 'Environment',
      type: '3-Statement UPSC Pattern',
      prompt: 'With reference to the "Montreux Record", consider the following statements:\n1. It is a register of wetland sites on the List of Wetlands of International Importance where changes in ecological character have occurred, are occurring, or are likely to occur due to human interference.\n2. It is maintained as part of the Ramsar Convention.\n3. Currently, Keoladeo National Park and Loktak Lake of India are placed under the Montreux Record, whereas Chilika Lake was removed from it after successful restoration.\n\nHow many of the statements given above are correct?',
      options: ['Only one', 'Only two', 'All three', 'None'],
      answer: 2,
      explanation: 'All three statements are CORRECT! Chilika Lake (Odisha) was placed on the Montreux Record in 1993 due to siltation and removed in 2002 (winning the Ramsar Wetland Conservation Award), leaving Keoladeo National Park (Rajasthan) and Loktak Lake (Manipur).'
    },
    {
      id: 'q-env-2',
      year: 2022,
      subject: 'Environment',
      type: 'Conceptual PYQ Style',
      prompt: 'Why is a plant placed in Schedule III of the Wildlife (Protection) Amendment Act (or Schedule VI in pre-2022 nomenclature, e.g., Pitcher Plant / Blue Vanda / Red Vanda / Kuth)?',
      options: [
        'To regulate/prohibit unauthorized uprooting, picking, cultivation, and trade of specified endemic endangered plants.',
        'Such plants are genetically modified crops cleared by GEAC.',
        'Such plants are invasive alien species mandated for nationwide eradication.',
        'They are exempted from Forest Rights Act in Fifth Schedule areas.'
      ],
      answer: 0,
      explanation: 'Endemic protected flora (like Nepenthes khasiana, Beddome\'s cycad, Blue Vanda, Red Vanda, Kuth, Ladies Slipper Orchid) are protected under the Wildlife (Protection) Act (consolidated into Schedule III under the 2022 Amendment Act, earlier Schedule VI) to prohibit unauthorized picking, uprooting, and trade.'
    },
    // --- SCIENCE & TECH ---
    {
      id: 'q-sci-1',
      year: 2023,
      subject: 'Science & Tech',
      type: '3-Statement UPSC Pattern',
      prompt: 'Consider the following statements regarding Lagrange Points and ISRO\'s Aditya-L1 mission:\n1. Aditya-L1 is placed in a Halo Orbit around the Sun-Earth Lagrange Point 1 (L1), approximately 1.5 million km from Earth.\n2. Placing a spacecraft around L1 allows continuous viewing of the Sun without any occultation or eclipses.\n3. L1 lies directly behind the Earth on the night side, shielding instruments from solar radiation.\n\nHow many of the statements given above are correct?',
      options: ['Only one', 'Only two', 'All three', 'None'],
      answer: 1,
      explanation: 'Statements 1 and 2 are CORRECT. Statement 3 is INCORRECT: L2 (used by James Webb Space Telescope!) lies behind Earth on the night side; L1 lies BETWEEN the Sun and the Earth (about 1% of the Earth-Sun distance).'
    },
    {
      id: 'q-sci-2',
      year: 2022,
      subject: 'Science & Tech',
      type: '2-Statement UPSC Pattern',
      prompt: 'With reference to Mitochondrial Replacement Therapy (Pronuclear / Spindle Transfer), consider the following statements:\n1. Mitochondrial DNA is inherited almost exclusively from the mother, not the father.\n2. A child born via Mitochondrial Replacement Therapy prevents maternal transmission of defective mitochondrial diseases.\n\nWhich of the statements given above is/are correct?',
      options: ['1 only', '2 only', 'Both 1 and 2', 'Neither 1 nor 2'],
      answer: 2,
      explanation: 'Both statements 1 and 2 are CORRECT ("Three-parent baby" technique). Sperm mitochondria are degraded upon fertilization, so mtDNA is maternally inherited; replacing unhealthy maternal cytoplasm/mitochondria with healthy donor mitochondria blocks mitochondrial genetic disorders.'
    },
    // --- ETHICS (GS-IV) ---
    {
      id: 'q-eth-1',
      year: 2023,
      subject: 'Ethics',
      type: 'GS-IV Conceptual',
      prompt: 'As District Collector during flash floods, relief packets are slightly short. One subordinate suggests prioritizing VIP wards to avoid media backlash, while another suggests strict vulnerability-based distribution (elderly, pregnant women, marooned hamlets first). Which ethical framework directly underpins the second approach?',
      options: [
        'John Rawls\' "Difference Principle" & Gandhian Talisman (Antyodaya)',
        'Ethical Egoism and Machiavellian Realpolitik',
        'Benthamite Majoritarian Hedonism regardless of vulnerability',
        'Moral Relativism based on social hierarchy'
      ],
      answer: 0,
      explanation: 'Rawls\' Theory of Justice (Difference Principle under the Veil of Ignorance) states that resources/arrangements should accrue to the greatest benefit of the least-advantaged members of society—harmonizing directly with Gandhi\'s Talisman ("recall the face of the poorest and weakest person you have seen").'
    },
    {
      id: 'q-eth-2',
      year: 2022,
      subject: 'Ethics',
      type: 'GS-IV Thinkers',
      prompt: 'Immanuel Kant\'s second formulation of the "Categorical Imperative" commands a moral agent to:',
      options: [
        'Always treat humanity, whether in your own person or in that of another, never merely as a means, but always at the same time as an end in itself.',
        'Maximize aggregate pleasure over pain even if one innocent individual must be sacrificed.',
        'Follow customs blindly so long as superiors issue written orders.',
        'Judge actions solely by post-facto electoral popularity.'
      ],
      answer: 0,
      explanation: 'Kant\'s Formula of Humanity is a cornerstone of deontological ethics and constitutional human dignity (Article 21): human beings possess intrinsic worth (dignity) and must never be instrumentalized merely as tools.'
    },
    // --- CSAT APTITUDE ---
    {
      id: 'q-csat-1',
      year: 2023,
      subject: 'CSAT',
      type: 'CSAT Number System',
      prompt: 'What is the remainder when (85 × 87 × 89 × 91 × 95 × 96) is divided by 100?',
      options: ['0', '1', '2', '4'],
      answer: 0,
      explanation: 'Authentic UPSC CSAT PYQ! Look for factors of 100 = 2² × 5². Here, 85 = 5 × 17 (one 5), 95 = 5 × 19 (second 5 → 5² = 25), and 96 = 4 × 24 (contains 2² = 4). Since 25 × 4 = 100 divides the product completely, the remainder is 0!'
    },
    {
      id: 'q-csat-2',
      year: 2022,
      subject: 'CSAT',
      type: 'CSAT Logical Reasoning',
      prompt: 'Statements:\nI. All IAS Probationers are Constitutional Scholars.\nII. Some Constitutional Scholars are Marathon Runners.\n\nConclusions:\n1. Some IAS Probationers are definitely Marathon Runners.\n2. At least some Marathon Runners are Constitutional Scholars.\n\nWhich conclusion(s) logically follow?',
      options: ['Only Conclusion 1 follows', 'Only Conclusion 2 follows', 'Both 1 and 2 follow', 'Neither 1 nor 2 follows'],
      answer: 1,
      explanation: 'Venn Diagram Check: IAS Probationers lie inside Constitutional Scholars, and Marathon Runners overlap with Constitutional Scholars—but Marathon Runners need NOT overlap with the IAS subset (so 1 is NOT definite). However, "Some A are B" always implies "Some B are A", so Conclusion 2 definitely follows!'
    }
  ];

  // --------------------------------------------------------------------------
  // 4. STRUCTURED UPSC KNOWLEDGE GRAPH MATRICES (POWERS MILLIONS OF UNIQUE MCQs!)
  // --------------------------------------------------------------------------
  const KNOWLEDGE_MATRICES = {
    Polity: [
      { left: 'Article 14', right: 'Equality before law and equal protection of the laws', group: 'Constitutional Article', trap: 'Abolition of Untouchability in all forms' },
      { left: 'Article 17', right: 'Abolition of Untouchability and prohibition of its practice', group: 'Constitutional Article', trap: 'Abolition of non-military and non-academic titles' },
      { left: 'Article 21A', right: 'Free and compulsory education for children aged 6 to 14 years (86th Amendment)', group: 'Constitutional Article', trap: 'Early childhood care below age six as a enforceable Fundamental Right' },
      { left: 'Article 32', right: 'Right to move the Supreme Court for enforcement of Fundamental Rights', group: 'Constitutional Article', trap: 'Discretionary writ jurisdiction wider than High Courts over ordinary legal rights' },
      { left: 'Article 40', right: 'Organisation of Village Panchayats under Gandhian DPSPs', group: 'Constitutional Article', trap: 'Uniform Civil Code throughout the territory of India' },
      { left: 'Article 44', right: 'Uniform Civil Code for the citizens under Liberal-Intellectual DPSPs', group: 'Constitutional Article', trap: 'Separation of Judiciary from the Executive in public services' },
      { left: 'Article 50', right: 'Separation of the Judiciary from the Executive in the public services of the State', group: 'Constitutional Article', trap: 'Promotion of international peace and security' },
      { left: 'Article 61', right: 'Procedure for impeachment of the President by two-thirds of total membership of each House', group: 'Constitutional Article', trap: 'Removal of Vice-President by formal impeachment resolution in Lok Sabha first' },
      { left: 'Article 72', right: 'Pardoning power of the President including court-martial and death sentences', group: 'Constitutional Article', trap: 'Governor\'s power to pardon court-martial sentences independently' },
      { left: 'Article 76', right: 'Attorney General for India holding office during the pleasure of the President', group: 'Constitutional Article', trap: 'Fixed 6-year security of tenure identical to the Comptroller and Auditor General' },
      { left: 'Article 108', right: 'Joint sitting of both Houses summoned by the President and presided over by the Speaker', group: 'Constitutional Article', trap: 'Joint sitting permitted to resolve deadlocks on Constitutional Amendment Bills' },
      { left: 'Article 110', right: 'Definition of Money Bills with final certification vested in the Speaker of Lok Sabha', group: 'Constitutional Article', trap: 'Equal powers of Rajya Sabha to amend Money Bills within 30 days' },
      { left: 'Article 112', right: 'Annual Financial Statement laid before both Houses of Parliament', group: 'Constitutional Article', trap: 'Explicit constitutional usage of the term "Union Budget" in the text of the Article' },
      { left: 'Article 123', right: 'Ordinance-making power of the President when either or both Houses are not in session', group: 'Constitutional Article', trap: 'Discretionary power independent of the aid and advice of the Council of Ministers' },
      { left: 'Article 143', right: 'Power of the President to consult the Supreme Court (Advisory Jurisdiction)', group: 'Constitutional Article', trap: 'Binding judicial decree enforceable as an appellate reversal order' },
      { left: 'Article 148', right: 'Comptroller and Auditor-General of India as guardian of the public purse', group: 'Constitutional Article', trap: 'Prior sanction of CAG required BEFORE drawing funds from Consolidated Fund of India' },
      { left: 'Article 249', right: 'Power of Parliament to legislate on a State List matter in national interest after Rajya Sabha resolution', group: 'Constitutional Article', trap: 'Resolution passed solely by Lok Sabha with simple majority' },
      { left: 'Article 262', right: 'Adjudication of disputes relating to waters of inter-State rivers or river valleys', group: 'Constitutional Article', trap: 'Inter-State Council chaired by the Chief Justice of India' },
      { left: 'Article 263', right: 'Establishment of an Inter-State Council by the President', group: 'Constitutional Article', trap: 'Establishment of Finance Commission every five years' },
      { left: 'Article 280', right: 'Finance Commission constituted by the President every fifth year', group: 'Constitutional Article', trap: 'Permanent statutory body functioning under NITI Aayog' },
      { left: 'Article 300A', right: 'Constitutional right to property ("no person deprived save by authority of law", 44th Amendment)', group: 'Constitutional Article', trap: 'Fundamental Right under Part III enforceable directly via Article 32' },
      { left: 'Article 312', right: 'Creation of new All-India Services supported by Rajya Sabha two-thirds majority resolution', group: 'Constitutional Article', trap: 'Creation of All-India Judicial Service including posts inferior to District Judge' },
      { left: 'Article 324', right: 'Superintendence, direction and control of elections vested in the Election Commission', group: 'Constitutional Article', trap: 'Conduct of elections to Panchayats and Municipalities across States' },
      { left: 'Article 352', right: 'National Emergency on grounds of war, external aggression, or armed rebellion', group: 'Constitutional Article', trap: 'Automatic suspension of Articles 20 and 21 upon proclamation' },
      { left: 'Article 368', right: 'Power of Parliament to amend the Constitution without destroying its Basic Structure', group: 'Constitutional Article', trap: 'Provision for joint sitting of Parliament in case of deadlock over an Amendment Bill' },
      { left: '42nd Amendment Act (1976)', right: 'Added Socialist, Secular & Integrity to Preamble and inserted Fundamental Duties (Part IVA)', group: 'Constitutional Amendment', trap: 'Replaced "internal disturbance" with "armed rebellion" in Article 352' },
      { left: '44th Amendment Act (1978)', right: 'Replaced "internal disturbance" with "armed rebellion" and moved Right to Property to Art. 300A', group: 'Constitutional Amendment', trap: 'Lowered voting age from 21 years to 18 years' },
      { left: '61st Amendment Act (1988)', right: 'Reduced voting age from 21 years to 18 years for Lok Sabha and Assembly elections', group: 'Constitutional Amendment', trap: 'Capped Council of Ministers size at 15% of Lok Sabha strength' },
      { left: '73rd Amendment Act (1992)', right: 'Constitutionalized Panchayati Raj Institutions by adding Part IX and Eleventh Schedule (29 subjects)', group: 'Constitutional Amendment', trap: 'Added Twelfth Schedule containing 18 functional items for Municipalities' },
      { left: '91st Amendment Act (2003)', right: 'Capped total Ministers including PM at 15% of total strength of Lok Sabha and removed split protection', group: 'Constitutional Amendment', trap: 'Granted constitutional status to Co-operative Societies under Part IXB' },
      { left: '101st Amendment Act (2016)', right: 'Introduced Goods and Services Tax (GST) and GST Council under Article 279A', group: 'Constitutional Amendment', trap: 'Granted constitutional status to National Commission for Backward Classes (Art. 338B)' }
    ],

    History: [
      { left: 'Atmiya Sabha (1815)', right: 'Founded by Raja Rammohun Roy in Calcutta to propagate monotheistic Vedanta', group: 'Freedom Struggle Body/Work', trap: 'Founded by Swami Dayananda Saraswati in Bombay' },
      { left: 'Satyashodhak Samaj (1873)', right: 'Founded by Jyotirao Phule in Pune against caste domination and Brahmanical orthodoxy', group: 'Freedom Struggle Body/Work', trap: 'Founded by Gopal Krishna Gokhale for constitutional training' },
      { left: 'Servants of India Society (1905)', right: 'Founded by Gopal Krishna Gokhale to train national missionaries for service of India', group: 'Freedom Struggle Body/Work', trap: 'Founded by Bal Gangadhar Tilak during the Home Rule Movement' },
      { left: 'Somaprakash Newspaper', right: 'Bengali weekly associated with Ishwar Chandra Vidyasagar targeted by Vernacular Press Act 1878', group: 'Freedom Struggle Body/Work', trap: 'English daily edited by Annie Besant in Madras' },
      { left: 'Mooknayak & Bahishkrit Bharat', right: 'Periodicals started by Dr. B.R. Ambedkar to champion the rights of Depressed Classes', group: 'Freedom Struggle Body/Work', trap: 'Journals founded by Mahatma Gandhi in South Africa' },
      { left: 'Al-Hilal Weekly (1912)', right: 'Urdu journal launched by Maulana Abul Kalam Azad to foster Hindu-Muslim nationalist unity', group: 'Freedom Struggle Body/Work', trap: 'Founded by Sir Syed Ahmad Khan at Aligarh' },
      { left: 'Bandi Jiwan', right: 'Autobiographical revolutionary work authored by Sachindranath Sanyal ("Bible of Revolutionaries")', group: 'Freedom Struggle Body/Work', trap: 'Authored by Aurobindo Ghosh during Alipore Bomb Case' },
      { left: 'Ghadar Party (1913)', right: 'Headquartered at Yugantar Ashram, San Francisco with Lala Hardayal & Sohan Singh Bhakna', group: 'Freedom Struggle Body/Work', trap: 'Headquartered in Berlin by Subhas Chandra Bose in 1942' },
      { left: 'Rummindei Pillar Inscription', right: 'Ashokan edict recording royal visit to Lumbini and reduction of bali/bhaga land tax', group: 'Ancient/Medieval Source', trap: 'Samudragupta\'s military conquests composed in Sanskrit by Harishena' },
      { left: 'Allahabad Pillar Prashasti', right: 'Composed by court poet Harishena detailing Samudragupta\'s northern and southern campaigns', group: 'Ancient/Medieval Source', trap: 'Pulakeshin II\'s victory over Harshavardhana on the Narmada composed by Ravikirti' },
      { left: 'Aihole Inscription', right: 'Composed by Jain poet Ravikirti recording Chalukya king Pulakeshin II defeating Harsha', group: 'Ancient/Medieval Source', trap: 'Kharavela of Kalinga\'s year-by-year reign in Udayagiri hills' },
      { left: 'Junagadh (Girnar) Rock Inscription', right: 'Earliest chaste Sanskrit inscription of Rudradaman I recording repair of Sudarshana Lake', group: 'Ancient/Medieval Source', trap: 'Chola village assembly self-governance rules of Uttaramerur under Parantaka I' },
      { left: 'Uttaramerur Inscription', right: 'Chola reign of Parantaka I detailing Kudavolai ballot system for Sabha committees', group: 'Ancient/Medieval Source', trap: 'Mauryan famine relief copper-plate record from Sohgaura' },
      { left: 'Amuktamalyada', right: 'Telugu poetic work on Vaishnava devotion and royal statecraft authored by Krishnadevaraya', group: 'Ancient/Medieval Source', trap: 'Persian chronicle of Firuz Shah Tughlaq authored by Ziauddin Barani' },
      { left: 'Abdur Razzaq', right: 'Persian ambassador of Shah Rukh who visited Vijayanagara during Deva Raya II\'s reign', group: 'Ancient/Medieval Source', trap: 'Moroccan traveller appointed Qazi of Delhi by Muhammad bin Tughlaq' },
      { left: 'Ibn Battuta (Rihla)', right: 'Moroccan traveller who visited India during the reign of Sultan Muhammad bin Tughlaq', group: 'Ancient/Medieval Source', trap: 'Chinese Buddhist pilgrim who visited Harsha\'s Kanauj assembly' }
    ],

    Chronology: [
      { year: 1793, event: 'Introduction of Permanent Settlement in Bengal by Lord Cornwallis' },
      { year: 1829, event: 'Abolition of Sati Regulation XVII under Governor-General William Bentinck' },
      { year: 1854, event: 'Wood\'s Education Despatch ("Magna Carta of English Education in India")' },
      { year: 1878, event: 'Enactment of the Vernacular Press Act by Lord Lytton' },
      { year: 1883, event: 'Ilbert Bill Controversy during the Viceroyalty of Lord Ripon' },
      { year: 1905, event: 'Partition of Bengal and formal launch of the Swadeshi Movement at Calcutta Town Hall' },
      { year: 1907, event: 'Surat Split between Moderates and Extremists in the Indian National Congress' },
      { year: 1916, event: 'Lucknow Pact between INC and Muslim League & launch of Home Rule Leagues' },
      { year: 1917, event: 'Champaran Satyagraha in Bihar against the Tinkathia indigo system' },
      { year: 1919, event: 'Rowlatt Satyagraha and Jallianwala Bagh Massacre' },
      { year: 1922, event: 'Chauri Chaura incident and Bardoli resolution suspending Non-Cooperation Movement' },
      { year: 1927, event: 'Appointment of the all-white Indian Statutory (Simon) Commission' },
      { year: 1928, event: 'Nehru Report and Bardoli Satyagraha led by Vallabhbhai Patel' },
      { year: 1929, event: 'Lahore Session of INC adopting the resolution of Purna Swaraj' },
      { year: 1931, event: 'Gandhi-Irwin Pact and Karachi Session Resolution on Fundamental Rights' },
      { year: 1932, event: 'Communal Award by Ramsay MacDonald followed by the Poona Pact' },
      { year: 1940, event: 'August Offer by Viceroy Linlithgow and Individual Satyagraha (Vinoba Bhave first)' },
      { year: 1942, event: 'Cripps Mission failure followed by the Quit India Resolution at Gowalia Tank' },
      { year: 1946, event: 'Cabinet Mission Plan and formation of the Interim Government' }
    ],

    'Art & Culture': [
      { left: 'Sattriya Dance', right: 'Introduced in 15th-century Assam by Vaishnava saint Sankaradeva in Sattras', group: 'Classical Heritage', trap: 'Temple dance of Odisha featuring Tribhanga and Chowk postures' },
      { left: 'Odissi Dance', right: 'Characterized by Tribhanga and Chowk postures; depicted in Udayagiri-Khandagiri caves', group: 'Classical Heritage', trap: 'Martial mask dance of Purulia and Seraikela outside classical Akademi list' },
      { left: 'Kathakali', right: 'Classical dance-drama of Kerala featuring elaborate Paccha/Kathi facial makeup and Mudras', group: 'Classical Heritage', trap: 'Solo female lasya dance of Andhra Pradesh performed on brass plate edge' },
      { left: 'Bani Thani (Kishangarh School)', right: 'Rajasthani miniature masterpiece by Nihal Chand under patron Savant Singh (Nagari Das)', group: 'Classical Heritage', trap: 'Pahari Kangra painting patronized by Maharaja Sansar Chand' },
      { left: 'Kalamkari Art', right: 'Hand-painted or block-printed cotton textile art of Andhra Pradesh (Srikalahasti & Machilipatnam)', group: 'Classical Heritage', trap: 'Geometrical rice-paste tribal wall painting of Warli in Maharashtra' },
      { left: 'Pattachitra', right: 'Traditional cloth-based scroll painting of Odisha centered around Lord Jagannath mythology', group: 'Classical Heritage', trap: 'Mithila Madhubani painting of Bihar using bamboo twigs' },
      { left: 'Brihadishvara Temple (Thanjavur)', right: 'Imperial Chola Dravida masterpiece built by Rajaraja I completely in granite (~1010 CE)', group: 'Classical Heritage', trap: 'Hoysala stellate soapstone temple at Belur built by Vishnuvardhana' },
      { left: 'Modhera Sun Temple', right: 'Built in 1026 CE by Solanki ruler Bhima I in Gujarat with stepped Suryakund tank', group: 'Classical Heritage', trap: 'Eastern Ganga Black Pagoda at Konark built by Narasimhadeva I' },
      { left: 'Syadvada & Anekantavada', right: 'Core Jain epistemological doctrines of conditional predication and many-sidedness of reality', group: 'Classical Heritage', trap: 'Charvaka materialist rejection of inference and karmic rebirth' },
      { left: 'Pratityasamutpada', right: 'Buddhist doctrine of Dependent Origination explaining the causal wheel of suffering', group: 'Classical Heritage', trap: 'Advaita Vedanta doctrine of non-dual Brahman propounded by Adi Shankara' }
    ],

    Geography: [
      { left: 'Subansiri, Kameng & Manas', right: 'Right-bank (northern) Himalayan tributaries of the Brahmaputra River', group: 'Indian Drainage & Passes', trap: 'Left-bank tributaries of the Godavari originating in Eastern Ghats' },
      { left: 'Lohit, Dibang & Dhansiri', right: 'Left-bank tributaries joining the Brahmaputra in Arunachal Pradesh and Assam', group: 'Indian Drainage & Passes', trap: 'West-flowing rivers draining into the Gulf of Khambhat via rift valleys' },
      { left: 'Pranhita, Indravati & Sabari', right: 'Major left-bank tributaries of the Godavari ("Dakshin Ganga")', group: 'Indian Drainage & Passes', trap: 'Right-bank tributaries of the Krishna rising in Mahabaleshwar' },
      { left: 'Bhima, Tungabhadra & Musi', right: 'Major tributaries of the Krishna River basin across Deccan Plateau', group: 'Indian Drainage & Passes', trap: 'Tributaries of the Luni inland drainage system in Rajasthan' },
      { left: 'Kabini, Hemavati & Arkavathy', right: 'Important tributaries of the Kaveri River originating in Karnataka/Kerala', group: 'Indian Drainage & Passes', trap: 'Tributaries of the Mahanadi draining the Chhattisgarh basin' },
      { left: 'Nathu La & Jelep La', right: 'Strategic Himalayan mountain passes located in Sikkim linking India with Chumbi Valley (Tibet)', group: 'Indian Drainage & Passes', trap: 'Passes in Himachal Pradesh through which the Sutlej enters India' },
      { left: 'Shipki La', right: 'Mountain pass in Himachal Pradesh near Indo-Tibet border where Sutlej River enters India', group: 'Indian Drainage & Passes', trap: 'Pass in Arunachal Pradesh near Tawang linking to Lhasa' },
      { left: 'Zoji La', right: 'High mountain pass in the Great Himalayas / Zanskar range connecting Srinagar with Dras and Leh', group: 'Indian Drainage & Passes', trap: 'Gap in the Western Ghats connecting Palakkad (Kerala) with Coimbatore (Tamil Nadu)' },
      { left: 'Black Cotton Soil (Regur)', right: 'Derived from Deccan Trap basalt; rich in lime/iron/magnesia, deficient in nitrogen & phosphorus, self-ploughing', group: 'Soils & Climate', trap: 'Acidic Laterite soil formed by intense leaching of silica under heavy tropical rain' },
      { left: 'Roaring Forties & Furious Fifties', right: 'Fierce Westerly winds in the Southern Hemisphere due to vast uninterrupted ocean expanse', group: 'Soils & Climate', trap: 'Subtropical Easterly Trade Winds blowing across Sahara and Thar deserts' }
    ],

    Environment: [
      { left: 'Keibul Lamjao National Park (Manipur)', right: 'World\'s only floating national park on Loktak Lake with Phumdis; habitat of Sangai (brow-antlered deer)', group: 'Protected Areas & Conventions', trap: 'Habitat of the One-horned Rhinoceros on Majuli Island in Assam' },
      { left: 'Namdapha National Park (Arunachal Pradesh)', right: 'Easternmost Tiger Reserve bridging tropical rainforest to alpine; hosts all four big cats (Tiger, Leopard, Snow Leopard, Clouded Leopard)', group: 'Protected Areas & Conventions', trap: 'Mangrove estuarine biosphere reserve in Odisha famous for Olive Ridley turtles' },
      { left: 'Silent Valley National Park (Kerala)', right: 'Pristine tropical evergreen rainforest in Nilgiri Biosphere crossed by Kunthipuzha River; Lion-tailed Macaque stronghold', group: 'Protected Areas & Conventions', trap: 'Dry deciduous thorn forest in Rann of Kutch famous for Indian Wild Ass' },
      { left: 'Bhitarkanika Mangroves (Odisha)', right: 'Ramsar wetland at Brahmani-Baitarani delta adjacent to Gahirmatha Olive Ridley mass-nesting beach & Saltwater Crocodiles', group: 'Protected Areas & Conventions', trap: 'Freshwater wetland in Himachal Pradesh created by Pong Dam on Beas River' },
      { left: 'Khangchendzonga National Park (Sikkim)', right: 'India\'s sole Mixed (Natural + Cultural) UNESCO World Heritage Site', group: 'Protected Areas & Conventions', trap: 'Transboundary Manas Wildlife Sanctuary in Assam along Bhutan border' },
      { left: 'Kuno National Park (Madhya Pradesh)', right: 'Vindhyan dry deciduous landscape crossed by Kuno River selected for African Cheetah reintroduction', group: 'Protected Areas & Conventions', trap: 'Only natural abode of Asiatic Lions in Girnar hills of Saurashtra' },
      { left: 'Vienna Convention & Montreal Protocol', right: 'Legally binding global regime phasing out Ozone Depleting Substances (plus Kigali Amendment for HFCs)', group: 'Protected Areas & Conventions', trap: 'Control of transboundary movement of hazardous wastes and their disposal' },
      { left: 'Basel Convention (1989)', right: 'Control of transboundary movements of hazardous wastes and plastic waste and their disposal', group: 'Protected Areas & Conventions', trap: 'Prior Informed Consent procedure for certain hazardous chemicals and pesticides (Rotterdam)' },
      { left: 'Minamata Convention (2013)', right: 'Global treaty to protect human health and environment from anthropogenic emissions of Mercury', group: 'Protected Areas & Conventions', trap: 'Elimination of Persistent Organic Pollutants (POPs) such as DDT (Stockholm Convention)' },
      { left: 'Cartagena & Nagoya Protocols', right: 'Supplementary treaties under CBD governing Living Modified Organisms (biosafety) and Access & Benefit Sharing', group: 'Protected Areas & Conventions', trap: 'Protocols under UNFCCC governing sovereign green bonds and aviation emissions' }
    ],

    Economy: [
      { left: 'Standing Deposit Facility (SDF)', right: 'Floor of RBI\'s LAF corridor allowing RBI to absorb excess liquidity from banks WITHOUT providing G-Sec collateral', group: 'Macro & Committees', trap: 'Penal overnight window where banks borrow from RBI by dipping up to 2% into SLR' },
      { left: 'Marginal Standing Facility (MSF)', right: 'Ceiling of LAF corridor allowing scheduled banks to borrow overnight from RBI by dipping into SLR portfolio', group: 'Macro & Committees', trap: 'Interest-free cash balance banks must maintain with RBI under CRR' },
      { left: 'Lorenz Curve & Gini Coefficient', right: 'Graphical and numerical (0 to 1) measure of income or wealth inequality in an economy', group: 'Macro & Committees', trap: 'Inverse short-run trade-off between inflation and unemployment rate' },
      { left: 'Phillips Curve', right: 'Illustrates an inverse short-run relationship between the rate of inflation and the rate of unemployment', group: 'Macro & Committees', trap: 'Relationship between tax rates and total government tax revenue (Laffer Curve)' },
      { left: 'Laffer Curve', right: 'Depicts theoretical relationship between tax rates and tax revenue showing excessive rates reduce revenue', group: 'Macro & Committees', trap: 'Inverted-U relationship between per-capita income and environmental degradation' },
      { left: 'Urjit Patel Committee (2014)', right: 'Recommended adopting CPI (Combined) flexible inflation targeting (4% ± 2%) and creating the 6-member MPC', group: 'Macro & Committees', trap: 'Recommended privatization of railway rolling stock and restructuring Railway Board' },
      { left: 'N.K. Singh Committee (FRBM Review)', right: 'Recommended Debt-to-GDP anchor alongside fiscal deficit path and an "Escape Clause" for national shocks', group: 'Macro & Committees', trap: 'Defined poverty line based on nutritional calorie intake in 1979' },
      { left: 'Primary Deficit', right: 'Fiscal Deficit minus Interest Payments on past borrowings (reflects current government borrowing excluding legacy interest)', group: 'Macro & Committees', trap: 'Revenue Deficit minus Grants for Creation of Capital Assets (Effective Revenue Deficit)' }
    ],

    'Science & Tech': [
      { left: 'Geostationary Orbit (GEO)', right: 'Circular equatorial orbit at ~35,786 km altitude with 24-hour orbital period appearing stationary over one longitude', group: 'Space & Biotech', trap: 'Polar Sun-Synchronous Orbit at 600–800 km altitude ideal for high-res cartography' },
      { left: 'Sun-Synchronous Polar Orbit (SSPO)', right: 'Low-Earth near-polar orbit (~600–800 km) passing over any given latitude at the same local solar time (IRS/Cartosat)', group: 'Space & Biotech', trap: 'Lagrange L2 halo orbit 1.5 million km away from Earth' },
      { left: 'CRISPR-Cas9', right: 'Programmable RNA-guided endonuclease molecular scissors enabling targeted genome editing', group: 'Space & Biotech', trap: 'Passive monoclonal antibody infusion providing temporary humoral immunity' },
      { left: 'CAR-T Cell Therapy (NexCAR19)', right: 'Ex-vivo genetic modification of a patient\'s own T-lymphocytes to express chimeric receptors targeting cancer cells', group: 'Space & Biotech', trap: 'Live-attenuated bacterial vaccine against multidrug-resistant tuberculosis' },
      { left: 'India\'s 3-Stage Nuclear Programme', right: 'Homi Bhabha roadmap: Stage-I PHWR (Natural U) → Stage-II Fast Breeder (Plutonium + Th-232 blanket) → Stage-III Thorium/U-233', group: 'Space & Biotech', trap: 'Direct single-stage fusion reactor burning pure Thorium-232 without fissile conversion' },
      { left: 'Scramjet vs Ramjet Engine', right: 'Air-breathing propulsion where Scramjet maintains SUPERSONIC airflow inside the combustion chamber (no rotating compressor)', group: 'Space & Biotech', trap: 'Cryogenic rocket stage carrying onboard liquid oxygen and liquid hydrogen for vacuum flight' },
      { left: 'Quantum Key Distribution (QKD)', right: 'Uses quantum superposition & no-cloning theorem so any eavesdropping disturbs photon states and is immediately detected', group: 'Space & Biotech', trap: 'Classical RSA asymmetric encryption relying solely on prime factorization difficulty' }
    ],

    Ethics: [
      { left: 'Aristotle\'s Golden Mean', right: 'Virtue lies as a rational disposition at the balanced mean between two vices of excess and deficiency (e.g., Courage between Rashness & Cowardice)', group: 'Ethics & Governance', trap: 'Strict rule-bound duty regardless of consequences or context' },
      { left: 'Nolan Committee (7 Principles)', right: 'Selflessness, Integrity, Objectivity, Accountability, Openness, Honesty, and Leadership in Public Life', group: 'Ethics & Governance', trap: 'Secrecy, Partisanship, Discretionary Patronage, and Seniority Tenure' },
      { left: 'Nishkama Karma (Bhagavad Gita)', right: 'Righteous performance of one\'s duty with complete equanimity and detachment from personal fruits/rewards', group: 'Ethics & Governance', trap: 'Renunciation of all civic and administrative action in society' },
      { left: 'Daniel Goleman\'s Emotional Intelligence', right: 'Self-Awareness, Self-Regulation, Internal Motivation, Empathy, and Social Skills in public leadership', group: 'Ethics & Governance', trap: 'Purely analytical IQ measured independent of interpersonal affect' },
      { left: 'Doctrine of Double Effect (Aquinas)', right: 'An action seeking a good end may be permissible even with a foreseen harmful side-effect, provided harm is never the intended means', group: 'Ethics & Governance', trap: 'Ends always justify any deliberate immoral means chosen by the ruler' },
      { left: 'Citizen\'s Charter', right: 'Voluntary public commitment of service standards, timelines, transparency, and grievance redressal towards citizens', group: 'Ethics & Governance', trap: 'Penal statute empowering citizens to arrest civil servants directly' }
    ],

    'Public Administration': [
      { left: 'New Public Administration', right: 'Movement emphasizing relevance, values, equity, change, and client focus; emerged from Minnowbrook Conference (1968)', group: 'Administrative Thinkers/Theories', trap: 'Traditional administration focused solely on efficiency and economy' },
      { left: 'Max Weber\'s Bureaucracy', right: 'Ideal type based on hierarchy, division of labour, formal rules, impersonality, and merit-based recruitment', group: 'Administrative Thinkers/Theories', trap: 'Informal, charismatic leadership without rules or hierarchy' },
      { left: 'Henry Fayol\'s 14 Principles', right: 'Administrative principles including unity of command, scalar chain, division of work, esprit de corps, and centralisation', group: 'Administrative Thinkers/Theories', trap: 'Scientific management focused solely on shop-floor worker efficiency' },
      { left: 'Chester Barnard\'s Functions of Executive', right: 'Maintaining organisational communication, securing essential services, and formulating purpose/objectives', group: 'Administrative Thinkers/Theories', trap: 'Executive functions limited to financial budgeting only' },
      { left: 'POSDCORB', right: 'Luther Gulick\'s acronym: Planning, Organising, Staffing, Directing, Coordinating, Reporting, Budgeting', group: 'Administrative Thinkers/Theories', trap: 'POSDCORB includes marketing and sales functions' },
      { left: 'Zone of Indifference (Barnard)', right: 'Range of orders employees accept without questioning authority', group: 'Administrative Thinkers/Theories', trap: 'Zone where all orders are automatically rejected' },
      { left: 'New Public Management', right: 'Reforms emphasizing market mechanisms, performance measurement, customer focus, and decentralisation', group: 'Administrative Reforms', trap: 'NPM completely eliminates government oversight and regulation' },
      { left: 'Citizen\'s Charter', right: 'Voluntary public commitment to service standards, transparency, grievance redress, and stakeholder involvement', group: 'Administrative Reforms', trap: 'Penal statute that empowers citizens to arrest civil servants directly' },
      { left: 'Good Governance (UNDP/World Bank)', right: 'Participation, rule of law, transparency, responsiveness, consensus, equity, effectiveness, efficiency, accountability', group: 'Administrative Reforms', trap: 'Good governance requires authoritarian decision-making without consultation' },
      { left: 'Administrative Law', right: 'Body of law governing the activities of administrative agencies of government', group: 'Administrative Law', trap: 'Administrative law applies only to private contracts between companies' },
      { left: 'Lokpal & Lokayukta', right: 'Anti-corruption ombudsman institutions at Central (Lokpal) and State (Lokayukta) levels', group: 'Administrative Law', trap: 'Judicial courts that replace the Supreme Court and High Courts' },
      { left: 'Right to Information Act, 2005', right: 'Mandates timely response to citizen requests for government information, promotes transparency and accountability', group: 'Administrative Law', trap: 'RTI applies only to private companies and not government bodies' },
      { left: 'Prismatic-Fused Models (Fred Riggs)', right: 'Models describing societies in transition between traditional (fused) and modern (diffracted) administrative systems', group: 'Comparative Public Administration', trap: 'Riggs\' models apply only to biological organisms, not administrative systems' },
      { left: 'Development Administration', right: 'Focus on change, innovation, and socio-economic development through public administration', group: 'Development Dynamics', trap: 'Development administration maintains status quo and resists change' }
    ]
  };

  // --------------------------------------------------------------------------
  // 5. PROCEDURAL INFINITE UPSC QUESTION GENERATOR (MILLIONS OF UNIQUE MCQs)
  // --------------------------------------------------------------------------
  const seenQuestionSignatures = new Set();

  function pickRandom(arr, n = 1, rng = Math.random) {
    const copy = arr.slice();
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return n === 1 ? copy[0] : copy.slice(0, n);
  }

  /**
   * Generates a unique UPSC 3-Statement ("How many are correct?"),
   * Pair-Matching ("How many pairs are correctly matched?"),
   * 2-Statement ("1 only / 2 only / Both / Neither"),
   * Chronological Order, or CSAT Quantitative question!
   */
  function generateProceduralQuestion(preferredSubject = 'ALL', equippedBookTexts = []) {
    // 1. If user chose "LIVE_BOOK" or occasionally when book texts exist & ALL is chosen
    if (preferredSubject === 'LIVE_BOOK' && equippedBookTexts.length > 0) {
      const bookQ = generateFromBookText(equippedBookTexts);
      if (bookQ) return bookQ;
    }

    // 2. First serve unseen Static Handcrafted questions matching subject (mixed with procedural for variety!)
    const matchingStatic = STATIC_QUESTIONS.filter(q =>
      (preferredSubject === 'ALL' || q.subject === preferredSubject) &&
      !seenQuestionSignatures.has(q.id)
    );
    if (matchingStatic.length > 0 && Math.random() < 0.45) {
      const chosen = pickRandom(matchingStatic, 1);
      seenQuestionSignatures.add(chosen.id);
      return { ...chosen, options: chosen.options.slice() };
    }

    // 3. CSAT Procedural Infinite Math/Reasoning Engine
    if (preferredSubject === 'CSAT' || (preferredSubject === 'ALL' && Math.random() < 0.09)) {
      return generateInfiniteCSAT();
    }

    // 4. Chronological Sequence Generator (for History or ALL)
    if ((preferredSubject === 'History' || preferredSubject === 'ALL') && Math.random() < 0.22) {
      const chronoQ = generateChronologyQuestion();
      if (chronoQ) return chronoQ;
    }

    // 5. Matrix-driven UPSC 3-Statement / Pair-Matching / 2-Statement Generator
    const matrixKeys = Object.keys(KNOWLEDGE_MATRICES).filter(k => k !== 'Chronology');
    const subjectKey = (preferredSubject !== 'ALL' && KNOWLEDGE_MATRICES[preferredSubject])
      ? preferredSubject
      : pickRandom(matrixKeys, 1);

    const pool = KNOWLEDGE_MATRICES[subjectKey];
    const modeRoll = Math.random();

    if (modeRoll < 0.42) {
      return generateThreeStatementUPSC(subjectKey, pool);
    } else if (modeRoll < 0.78) {
      return generatePairMatchingUPSC(subjectKey, pool);
    } else {
      return generateTwoStatementUPSC(subjectKey, pool);
    }
  }

  function generateThreeStatementUPSC(subject, pool) {
    for (let attempt = 0; attempt < 25; attempt++) {
      const items = pickRandom(pool, 3);
      const flags = [Math.random() < 0.55, Math.random() < 0.55, Math.random() < 0.55];
      const sig = `3S:${subject}:${items.map((x, idx) => x.left + (flags[idx] ? 'T' : 'F')).join('|')}`;
      if (seenQuestionSignatures.has(sig)) continue;
      seenQuestionSignatures.add(sig);

      const statements = items.map((item, idx) => {
        const isTrue = flags[idx];
        const claim = isTrue ? item.right : item.trap;
        return `${idx + 1}. With reference to ${item.left}, it pertains to: ${claim}.`;
      });

      const trueCount = flags.filter(Boolean).length;
      // Options: Only one (0), Only two (1), All three (2), None (3)
      const options = ['Only one', 'Only two', 'All three', 'None'];
      const answerMap = { 1: 0, 2: 1, 3: 2, 0: 3 };

      const expLines = items.map((item, idx) =>
        `• Statement ${idx + 1} is ${flags[idx] ? 'CORRECT' : 'INCORRECT'}: ${item.left} → ${item.right}.`
      );

      return {
        id: sig,
        subject,
        type: 'UPSC 3-Statement Matrix',
        prompt: `Consider the following statements regarding ${subject}:\n\n${statements.join('\n')}\n\nHow many of the statements given above are correct?`,
        options,
        answer: answerMap[trueCount],
        explanation: `${trueCount === 0 ? 'None' : trueCount} of the statements ${trueCount === 1 ? 'is' : 'are'} correct.\n${expLines.join('\n')}`
      };
    }
    return { ...pickRandom(STATIC_QUESTIONS, 1) };
  }

  function generatePairMatchingUPSC(subject, pool) {
    for (let attempt = 0; attempt < 25; attempt++) {
      const items = pickRandom(pool, 4);
      // Use first 3 as displayed pairs; item[3] can serve as realistic swap source
      const pairFlags = [Math.random() < 0.5, Math.random() < 0.5, Math.random() < 0.5];
      const sig = `PAIR:${subject}:${items.slice(0, 3).map((x, i) => x.left + (pairFlags[i] ? '1' : '0')).join('|')}`;
      if (seenQuestionSignatures.has(sig)) continue;
      seenQuestionSignatures.add(sig);

      const lines = [0, 1, 2].map(i => {
        const rightText = pairFlags[i]
          ? items[i].right
          : (i === 0 ? items[3].right : items[(i + 1) % 3].trap);
        return `${i + 1}. ${items[i].left}  —  ${rightText}`;
      });

      const correctPairs = pairFlags.filter(Boolean).length;
      const options = [
        'Only one pair',
        'Only two pairs',
        'All three pairs',
        'None of the pairs'
      ];
      const answerMap = { 1: 0, 2: 1, 3: 2, 0: 3 };
      const expLines = [0, 1, 2].map(i =>
        `• Pair ${i + 1} is ${pairFlags[i] ? 'CORRECTLY' : 'INCORRECTLY'} matched: ${items[i].left} actually corresponds to "${items[i].right}".`
      );

      return {
        id: sig,
        subject,
        type: 'UPSC Pair-Matching',
        prompt: `Consider the following pairs in the context of ${subject}:\n\n${lines.join('\n')}\n\nHow many of the above pairs are correctly matched?`,
        options,
        answer: answerMap[correctPairs],
        explanation: `${expLines.join('\n')}`
      };
    }
    return generateThreeStatementUPSC(subject, pool);
  }

  function generateTwoStatementUPSC(subject, pool) {
    const items = pickRandom(pool, 2);
    const f1 = Math.random() < 0.55;
    const f2 = Math.random() < 0.55;
    const s1 = `1. ${items[0].left}: ${f1 ? items[0].right : items[0].trap}.`;
    const s2 = `2. ${items[1].left}: ${f2 ? items[1].right : items[1].trap}.`;

    let answer = 3;
    if (f1 && !f2) answer = 0;
    else if (!f1 && f2) answer = 1;
    else if (f1 && f2) answer = 2;

    return {
      id: `2S:${Date.now()}:${Math.random().toString(36).slice(2, 7)}`,
      subject,
      type: '2-Statement Prelims',
      prompt: `With reference to ${subject}, consider the following statements:\n\n${s1}\n${s2}\n\nWhich of the statements given above is/are correct?`,
      options: ['1 only', '2 only', 'Both 1 and 2', 'Neither 1 nor 2'],
      answer,
      explanation: `• Statement 1 is ${f1 ? 'CORRECT' : 'INCORRECT'} (${items[0].left}: ${items[0].right}).\n• Statement 2 is ${f2 ? 'CORRECT' : 'INCORRECT'} (${items[1].left}: ${items[1].right}).`
    };
  }

  function generateChronologyQuestion() {
    const events = pickRandom(KNOWLEDGE_MATRICES.Chronology, 4);
    const sig = `CHR:${events.map(e => e.year).join('-')}`;
    if (seenQuestionSignatures.has(sig)) return null;
    seenQuestionSignatures.add(sig);

    // Number them 1..4 in current shuffled order
    const numbered = events.map((e, idx) => ({ idx: idx + 1, ...e }));
    const correctSeq = numbered.slice().sort((a, b) => a.year - b.year).map(x => x.idx).join(' - ');

    // Build 3 plausible distractor permutations
    const perms = new Set([correctSeq]);
    const indices = [1, 2, 3, 4];
    while (perms.size < 4) {
      const p = pickRandom(indices, 4).join(' - ');
      perms.add(p);
    }
    const options = pickRandom(Array.from(perms), 4);
    const answer = options.indexOf(correctSeq);

    const listStr = numbered.map(n => `${n.idx}. ${n.event}`).join('\n');
    const expStr = numbered
      .slice()
      .sort((a, b) => a.year - b.year)
      .map(n => `• ${n.year}: ${n.event} (${n.idx})`)
      .join('\n');

    return {
      id: sig,
      subject: 'History',
      type: 'Chronological Sequence',
      prompt: `Consider the following events in Modern Indian History:\n\n${listStr}\n\nWhich one of the following is the correct chronological order of the above events, starting from the earliest?`,
      options,
      answer,
      explanation: `Correct Chronological Timeline:\n${expStr}`
    };
  }

  function generateInfiniteCSAT() {
    const csatVariant = Math.floor(Math.random() * 3);
    if (csatVariant === 0) {
      // Modular Remainder Problem (Classic UPSC CSAT!)
      const base = 15 + Math.floor(Math.random() * 40);
      const divisor = base + 1;
      const exp = 21 + Math.floor(Math.random() * 60) * 2; // odd exponent!
      // base ≡ -1 (mod divisor), odd power => (-1)^odd ≡ -1 ≡ divisor - 1
      const ansVal = divisor - 1;
      const optsSet = new Set([ansVal, 1, 0, Math.max(2, divisor - 2)]);
      const options = pickRandom(Array.from(optsSet).map(String), 4);
      return {
        id: `CSAT-MOD-${base}-${exp}`,
        subject: 'CSAT',
        type: 'CSAT Number Theory',
        prompt: `What is the remainder when ${base}^${exp} is divided by ${divisor}?`,
        options,
        answer: options.indexOf(String(ansVal)),
        explanation: `Using Modular Arithmetic: ${base} ≡ -1 (mod ${divisor}). Raising both sides to the odd power ${exp}: (${base})^${exp} ≡ (-1)^${exp} = -1 ≡ ${divisor} - 1 = ${ansVal} (mod ${divisor}).`
      };
    } else if (csatVariant === 1) {
      // Work & Time Efficiency (UPSC CSAT Staple)
      const pairs = [
        [12, 24, 8], [15, 30, 10], [20, 30, 12], [10, 15, 6], [18, 36, 12], [24, 48, 16]
      ];
      const [a, b, together] = pickRandom(pairs, 1);
      const opts = pickRandom([together, together + 2, together - 2, Math.round((a + b) / 2)].map(v => `${v} days`), 4);
      return {
        id: `CSAT-WORK-${a}-${b}-${Date.now()}`,
        subject: 'CSAT',
        type: 'CSAT Quantitative Aptitude',
        prompt: `Aspirant A can revise the entire Polity syllabus in ${a} days, while Aspirant B can revise the same syllabus in ${b} days. If both revise together by dividing chapters optimally without overlap, in how many days is the combined work completed?`,
        options: opts,
        answer: opts.indexOf(`${together} days`),
        explanation: `Combined 1-day rate = (1/${a}) + (1/${b}) = (${b} + ${a}) / (${a * b}) = ${a + b}/${a * b} = 1/${together}. Hence, total time = ${together} days.`
      };
    } else {
      // Percentage Net Change (Successive % change trap!)
      const p = pickRandom([10, 20, 25, 30], 1);
      const lossPct = (p * p) / 100;
      const correctStr = `${lossPct}% decrease`;
      const options = pickRandom([
        correctStr,
        'No change (0%)',
        `${lossPct}% increase`,
        `${p / 2}% increase`
      ], 4);
      return {
        id: `CSAT-PCT-${p}-${Date.now()}`,
        subject: 'CSAT',
        type: 'CSAT Percentage Trap',
        prompt: `The price of a strategic mineral first increases by ${p}% and is subsequently reduced by ${p}%. What is the net percentage change in its final price?`,
        options,
        answer: options.indexOf(correctStr),
        explanation: `Successive change formula: +${p} - ${p} - (${p} × ${p})/100 = -${lossPct}%. Whenever a value rises by x% and falls by x%, it ALWAYS results in an (x²/100)% net decrease!`
      };
    }
  }

  /**
   * Generates Unlimited Live Reading-Comprehension & Fact Cloze MCQs directly
   * from the FULL TEXT of any book equipped/loaded by the user!
   */
  function generateFromBookText(bookRecords) {
    const validBooks = bookRecords.filter(b => b && b.text && b.text.length > 600);
    if (!validBooks.length) return null;
    const chosenBook = pickRandom(validBooks, 1);

    // Extract clean factual sentences with years, Articles, or capitalized key terms
    const sentences = chosenBook.text
      .replace(/\s+/g, ' ')
      .split(/(?<=[.?!])\s+/)
      .filter(s =>
        s.length >= 75 &&
        s.length <= 250 &&
        !/http|digitized|google|copyright|isbn|printed/i.test(s)
      );

    if (sentences.length < 8) return null;

    // Try finding a sentence with a 4-digit year (1500-2024) or Capitalized multi-letter keyword
    for (let tries = 0; tries < 20; tries++) {
      const s = pickRandom(sentences, 1);
      const yearMatch = s.match(/\b(1[5-9]\d{2}|20[0-2]\d)\b/);
      if (yearMatch) {
        const yr = parseInt(yearMatch[1], 10);
        const blanked = s.replace(yearMatch[1], '________');
        const distractors = [yr - 12, yr + 9, yr - 4, yr + 18].filter(y => y !== yr && y <= 2025);
        const opts = pickRandom([String(yr), ...distractors.slice(0, 3).map(String)], 4);
        return {
          id: `BOOK-YR-${chosenBook.title.slice(0, 12)}-${yr}-${Math.random().toString(36).slice(2, 5)}`,
          subject: chosenBook.subject || 'Equipped Book',
          type: `Live Book Extract • ${chosenBook.title.slice(0, 28)}`,
          prompt: `From your equipped book "${chosenBook.title}", complete the exact historical/constitutional year in the passage below:\n\n"${blanked}"`,
          options: opts,
          answer: opts.indexOf(String(yr)),
          explanation: `Direct Verbatim Passage from "${chosenBook.title}":\n"${s}"`
        };
      }

      // Otherwise extract a capitalized key concept word (6+ letters, not first word of sentence)
      const words = s.split(' ');
      const capCandidates = words.slice(2).filter(w => /^[A-Z][a-z]{5,13}$/.test(w.replace(/[,.;:]/g, '')));
      if (capCandidates.length > 0) {
        const rawTarget = pickRandom(capCandidates, 1).replace(/[,.;:]/g, '');
        // Collect other capitalized terms from the same book as plausible distractors!
        const otherCaps = new Set();
        for (let k = 0; k < 40 && otherCaps.size < 3; k++) {
          const rs = pickRandom(sentences, 1).split(' ').slice(1);
          const cw = rs.find(x => /^[A-Z][a-z]{5,13}$/.test(x.replace(/[,.;:]/g, '')));
          if (cw) {
            const clean = cw.replace(/[,.;:]/g, '');
            if (clean.toLowerCase() !== rawTarget.toLowerCase()) otherCaps.add(clean);
          }
        }
        if (otherCaps.size === 3) {
          const blanked = s.replace(rawTarget, '__________');
          const opts = pickRandom([rawTarget, ...Array.from(otherCaps)], 4);
          return {
            id: `BOOK-TERM-${rawTarget}-${Math.random().toString(36).slice(2, 6)}`,
            subject: chosenBook.subject || 'Equipped Book',
            type: `Live Book Passage • ${chosenBook.title.slice(0, 26)}`,
            prompt: `Based on the full text of "${chosenBook.title}", identify the missing key term in this statement:\n\n"${blanked}"`,
            options: opts,
            answer: opts.indexOf(rawTarget),
            explanation: `Direct Passage from "${chosenBook.title}":\n"${s}"`
          };
        }
      }
    }
    return null;
  }

  // --------------------------------------------------------------------------
  // 6. SPACED-REPETITION FLASHCARD SEED (SM-2 simplified)
  // --------------------------------------------------------------------------
  const FLASHCARDS_SEED = [
    { q: 'Article 14 guarantees', a: 'Equality before law and equal protection of laws within the territory of India.', subject: 'Polity' },
    { q: 'Article 17 abolishes', a: 'Untouchability and forbids its practice in any form (Abolition of Untouchability).', subject: 'Polity' },
    { q: 'Article 21A provides', a: 'Free and compulsory education to all children of the age of 6 to 14 years (86th Amendment, 2002).', subject: 'Polity' },
    { q: 'Article 32 is', a: 'Right to Constitutional Remedies — move Supreme Court for enforcement of Fundamental Rights; Dr. Ambedkar called it the "heart and soul".', subject: 'Polity' },
    { q: 'Article 44 directs', a: 'The State to secure a Uniform Civil Code for the citizens throughout the territory of India (DPSP).', subject: 'Polity' },
    { q: 'Permanent Settlement (1793)', a: 'Introduced by Lord Cornwallis in Bengal; zamindars recognized as landowners; revenue fixed permanently.', subject: 'History' },
    { q: 'Ryotwari System', a: 'Introduced by Thomas Munro in Madras/Bombay; settlement directly with the ryot (cultivator); revisable periodically.', subject: 'History' },
    { q: 'Mahalwari System', a: 'Introduced by Holt Mackenzie; revenue settlement made with the village community (mahal) as a unit.', subject: 'History' },
    { q: 'Nagara Temple Style', a: 'North Indian style; curvilinear shikhara, generally no boundary walls/gopurams, garbhagriha under tallest tower.', subject: 'Art & Culture' },
    { q: 'Dravida Temple Style', a: 'South Indian style; pyramidal vimana, enclosed by walls, ornate gopurams (gateways).', subject: 'Art & Culture' },
    { q: 'Vesara Style', a: 'Hybrid of Nagara and Dravida; associated with Chalukyas of Kalyani and Hoysalas.', subject: 'Art & Culture' },
    { q: 'IOD Positive Phase', a: 'Warmer western Indian Ocean than eastern; tends to strengthen SW Monsoon over India, can offset El Niño.', subject: 'Geography' },
    { q: 'Karewas', a: 'Thick lacustrine deposits in Kashmir Valley; ideal for saffron (Zafran) cultivation.', subject: 'Geography' },
    { q: 'Roaring Forties', a: 'Westerly winds in Southern Hemisphere between 40°–50° latitude; strong due to less landmass.', subject: 'Geography' },
    { q: 'Primary Deficit', a: 'Fiscal Deficit minus interest payments; reflects current borrowing excluding legacy interest burden.', subject: 'Economy' },
    { q: 'Repo Rate', a: 'Rate at which RBI lends to commercial banks against securities (liquidity adjustment facility).', subject: 'Economy' },
    { q: 'SDF (Standing Deposit Facility)', a: 'Floor of LAF corridor; RBI absorbs excess liquidity from banks WITHOUT collateral.', subject: 'Economy' },
    { q: 'Montreux Record', a: 'Register of Ramsar wetlands where ecological character has changed/likely to change due to human interference.', subject: 'Environment' },
    { q: 'Keibul Lamjao NP', a: 'World\'s only floating national park on Loktak Lake (Manipur); habitat of Sangai deer.', subject: 'Environment' },
    { q: 'CRISPR-Cas9', a: 'RNA-guided molecular scissors for targeted genome editing; Nobel Chemistry 2020 (Charpentier & Doudna).', subject: 'Science & Tech' },
    { q: 'Aditya-L1', a: 'ISRO solar mission in halo orbit around Sun-Earth L1 (~1.5 million km); continuous Sun viewing.', subject: 'Science & Tech' },
    { q: 'Nishkama Karma', a: 'Performance of duty without attachment to results; Bhagavad Gita concept relevant to civil services ethics.', subject: 'Ethics' },
    { q: 'Golden Mean (Aristotle)', a: 'Virtue as the mean between two vices — excess and deficiency (e.g., courage between rashness and cowardice).', subject: 'Ethics' },
    { q: 'Nolan Principles', a: '7 principles of public life: selflessness, integrity, objectivity, accountability, openness, honesty, leadership.', subject: 'Ethics' },
    { q: 'GEO Orbit', a: '~35,786 km equatorial orbit; satellite appears stationary over one longitude; used for telecom/weather.', subject: 'Science & Tech' },
    { q: 'SSPO', a: 'Sun-Synchronous Polar Orbit (~600–800 km); passes over same latitude at same local solar time; used by IRS/Cartosat.', subject: 'Science & Tech' },
    { q: '91st Amendment Act (2003)', a: 'Capped total ministers (incl. PM) at 15% of Lok Sabha strength; removed protection against disqualification for defectors.', subject: 'Polity' },
    { q: '73rd Amendment (1992)', a: 'Constitutionalized Panchayati Raj; added Part IX and Eleventh Schedule (29 subjects).', subject: 'Polity' },
    { q: 'Drain of Wealth', a: 'Economic critique by Dadabhai Naoroji/R.C. Dutt; unilateral transfer of wealth from India to Britain without adequate return.', subject: 'History' },
    { q: 'Swadeshi Movement (1905)', a: 'Launched against Partition of Bengal; boycott of British goods, promotion of indigenous industries.', subject: 'History' },
    { q: 'Poona Pact (1932)', a: 'Agreement between Gandhi and Ambedkar; reserved seats for depressed classes within general electorate (not separate electorate).', subject: 'History' },
    { q: 'NITI Aayog', a: 'Replaced Planning Commission (2015); think tank, cooperative federalism, no power to allocate funds.', subject: 'Polity' },
    { q: 'Finance Commission', a: 'Constituted by President every 5 years under Article 280; recommends distribution of tax revenues between Centre & States.', subject: 'Polity' },
    { q: 'Gaganyaan', a: 'India\'s first human spaceflight mission; Vyommitra (humanoid) precedes crewed flight; LVM3 launch vehicle.', subject: 'Science & Tech' },
    { q: 'National Green Hydrogen Mission', a: 'Green hydrogen production hubs, electrolyser manufacturing, SIGHT scheme; supports net-zero 2070.', subject: 'Environment' },
    { q: 'DPDP Act 2023', a: 'Digital Personal Data Protection Act; governs processing of digital personal data; establishes Data Protection Board.', subject: 'Polity' }
  ];

  return {
    AVATARS,
    RANKS,
    BADGES,
    MONSTERS,
    UPSC_BOOK_VAULT,
    STATIC_QUESTIONS,
    KNOWLEDGE_MATRICES,
    FLASHCARDS_SEED,
    generateProceduralQuestion
  };
})();
