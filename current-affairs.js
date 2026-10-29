/* ============================================================================
 * LBSNAA QUEST — DAILY CURRENT AFFAIRS (UPSC-RELEVANT)
 * Curated + live-fetch fallback. Each item: date, title, summary, subject,
 * source, prelimsRelevance, mainsRelevance, link.
 * ============================================================================ */
window.CURRENT_AFFAIRS_DATA = (() => {
  const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const today = new Date();
  const fmt = (d) => d.getDate() + ' ' + MONTHS[d.getMonth()] + ' ' + d.getFullYear();

  const seed = [
    {
      id: 'ca-1',
      date: fmt(new Date(today.getFullYear(), today.getMonth(), 1)),
      title: 'Interim Budget 2025-26: Key Allocations',
      summary: 'Focus on capital expenditure, infrastructure, agritech, and fiscal consolidation. Capital outlay raised to support roads, railways, and urban development.',
      subject: 'Economy',
      gsPaper: 'GS-III',
      source: 'PIB / Union Budget',
      prelims: 'Capital expenditure, fiscal deficit, revenue deficit, priority sectors',
      mains: 'Inclusive growth, budget as an instrument of fiscal policy',
      link: 'https://pib.gov.in'
    },
    {
      id: 'ca-2',
      date: fmt(new Date(today.getFullYear(), today.getMonth(), 3)),
      title: 'RBI Monetary Policy Committee (MPC) Review',
      summary: 'Repo rate decision, inflation targeting (4% ± 2%), liquidity management, and implications for banking and growth.',
      subject: 'Economy',
      gsPaper: 'GS-III',
      source: 'RBI',
      prelims: 'Repo rate, CRR, SLR, MSF, LAF, inflation targeting',
      mains: 'Monetary transmission, financial stability',
      link: 'https://rbi.org.in'
    },
    {
      id: 'ca-3',
      date: fmt(new Date(today.getFullYear(), today.getMonth(), 5)),
      title: 'Wetlands Conservation & Ramsar Sites in India',
      summary: 'New Ramsar designations, ecological character, threats from encroachment, and the Wetlands (Conservation and Management) Rules.',
      subject: 'Environment',
      gsPaper: 'GS-III',
      source: 'MoEFCC',
      prelims: 'Ramsar Convention, Montreux Record, Chilika, Keoladeo',
      mains: 'Wetland governance, climate change adaptation',
      link: 'https://moef.gov.in'
    },
    {
      id: 'ca-4',
      date: fmt(new Date(today.getFullYear(), today.getMonth(), 7)),
      title: 'ISRO Gaganyaan & Space Reforms',
      summary: 'Progress on human spaceflight mission, IN-SPACe, NSIL, private sector participation, and space policy.',
      subject: 'Science & Tech',
      gsPaper: 'GS-III',
      source: 'ISRO',
      prelims: 'Gaganyaan, LVM3, Vyommitra, IN-SPACe',
      mains: 'Space economy, strategic sectors, private participation',
      link: 'https://isro.gov.in'
    },
    {
      id: 'ca-5',
      date: fmt(new Date(today.getFullYear(), today.getMonth(), 9)),
      title: 'Women\'s Reservation Bill (106th Constitutional Amendment)',
      summary: '33% reservation for women in Lok Sabha and State Assemblies, delimitation linkage, implementation timeline.',
      subject: 'Polity',
      gsPaper: 'GS-II',
      source: 'Parliament / PIB',
      prelims: '106th CAA, Article 330A, 332A, delimitation',
      mains: 'Women\'s political participation, gender justice',
      link: 'https://pib.gov.in'
    },
    {
      id: 'ca-6',
      date: fmt(new Date(today.getFullYear(), today.getMonth(), 11)),
      title: 'India\'s G20 Presidency Outcomes (2023)',
      summary: 'New Delhi Leaders\' Declaration, African Union inclusion, climate finance, digital public infrastructure (DPI).',
      subject: 'IR',
      gsPaper: 'GS-II',
      source: 'MEA',
      prelims: 'G20, African Union, DPI, LiFE movement',
      mains: 'Multilateralism, Global South, reformed multilateralism',
      link: 'https://g20.org'
    },
    {
      id: 'ca-7',
      date: fmt(new Date(today.getFullYear(), today.getMonth(), 13)),
      title: 'National Education Policy (NEP) 2020 Implementation',
      summary: '5+3+3+4 structure, NCF, CUET, multidisciplinary education, vocational integration.',
      subject: 'Social Issues',
      gsPaper: 'GS-II',
      source: 'Ministry of Education',
      prelims: 'NEP 2020, NCF, Samagra Shiksha',
      mains: 'Foundational literacy, teacher training, higher education reforms',
      link: 'https://education.gov.in'
    },
    {
      id: 'ca-8',
      date: fmt(new Date(today.getFullYear(), today.getMonth(), 15)),
      title: 'National Green Hydrogen Mission',
      summary: 'Production targets, electrolyser manufacturing, green hydrogen hubs, carbon reduction goals.',
      subject: 'Environment / Economy',
      gsPaper: 'GS-III',
      source: 'MNRE',
      prelims: 'Green hydrogen, electrolyser, SIGHT scheme',
      mains: 'Energy transition, net-zero by 2070, climate finance',
      link: 'https://mnre.gov.in'
    },
    {
      id: 'ca-9',
      date: fmt(new Date(today.getFullYear(), today.getMonth(), 17)),
      title: 'Digital India Act & Data Protection',
      summary: 'Digital Personal Data Protection Act, 2023 provisions, Data Protection Board, consumer rights online.',
      subject: 'Polity / Governance',
      gsPaper: 'GS-II',
      source: 'MeitY',
      prelims: 'DPDP Act, data fiduciary, data principal',
      mains: 'Right to privacy, digital governance, cybersecurity',
      link: 'https://meity.gov.in'
    },
    {
      id: 'ca-10',
      date: fmt(new Date(today.getFullYear(), today.getMonth(), 19)),
      title: 'Project Cheetah & Wildlife Reintroduction',
      summary: 'Cheetah reintroduction in Kuno National Park, monitoring, challenges, and Project Tiger linkages.',
      subject: 'Environment',
      gsPaper: 'GS-III',
      source: 'NTCA / MoEFCC',
      prelims: 'Kuno NP, cheetah subspecies, IUCN status',
      mains: 'Wildlife conservation, human-wildlife conflict',
      link: 'https://moef.gov.in'
    },
    {
      id: 'ca-11',
      date: fmt(new Date(today.getFullYear(), today.getMonth(), 21)),
      title: 'Judicial Pendency & e-Courts Project',
      summary: 'Case backlog in Supreme Court/High Courts, e-Courts Phase III, virtual hearings, NJDG data.',
      subject: 'Polity',
      gsPaper: 'GS-II',
      source: 'Supreme Court / DoJ',
      prelims: 'e-Courts, NJDG, pendency, collegium',
      mains: 'Judicial reforms, access to justice, fast-track courts',
      link: 'https://doj.gov.in'
    },
    {
      id: 'ca-12',
      date: fmt(new Date(today.getFullYear(), today.getMonth(), 23)),
      title: 'National Logistics Policy & PM Gati Shakti',
      summary: 'Multi-modal connectivity, logistics cost reduction, National Logistics Portal, integration of infrastructure.',
      subject: 'Economy / Infra',
      gsPaper: 'GS-III',
      source: 'DPIIT',
      prelims: 'Gati Shakti, NLP, multimodal logistics',
      mains: 'Infrastructure development, ease of doing business',
      link: 'https://pib.gov.in'
    },
    {
      id: 'ca-13',
      date: fmt(new Date(today.getFullYear(), today.getMonth(), 25)),
      title: 'Antimicrobial Resistance (AMR) & One Health',
      summary: 'AMR surveillance, misuse of antibiotics, One Health approach, zoonotic disease linkage.',
      subject: 'Health / Environment',
      gsPaper: 'GS-II',
      source: 'MoHFW / ICMR',
      prelims: 'AMR, One Health, ICMR, zoonoses',
      mains: 'Public health, healthcare delivery, pandemic preparedness',
      link: 'https://icmr.gov.in'
    },
    {
      id: 'ca-14',
      date: fmt(new Date(today.getFullYear(), today.getMonth(), 27)),
      title: 'India-Middle East-Europe Economic Corridor (IMEC)',
      summary: 'Rail and shipping corridor, strategic implications, alternatives to BRI, connectivity with Gulf and Europe.',
      subject: 'IR',
      gsPaper: 'GS-II',
      source: 'MEA',
      prelims: 'IMEC, BRI, strategic partnerships',
      mains: 'Geoeconomics, India\'s global role, connectivity diplomacy',
      link: 'https://mea.gov.in'
    },
    {
      id: 'ca-15',
      date: fmt(new Date(today.getFullYear(), today.getMonth(), 28)),
      title: 'Unified Pension Scheme (UPS) 2025',
      summary: 'Assured pension for government employees, comparison with OPS and NPS, fiscal implications.',
      subject: 'Polity / Economy',
      gsPaper: 'GS-II',
      source: 'Ministry of Finance',
      prelims: 'UPS, NPS, OPS, assured pension',
      mains: 'Fiscal federalism, welfare schemes, pension reforms',
      link: 'https://finmin.nic.in'
    }
  ];

  // Try to fetch live current affairs from a public source (PIB RSS-like JSON)
  async function fetchLiveCA() {
    const sources = [
      'https://www.pib.gov.in/RssFeeds.aspx'
    ];
    // RSS endpoints often don't have CORS; we attempt and fall back silently
    try {
      const res = await fetch('https://api.rss2json.com/v1/api.json?rss_url='+encodeURIComponent('https://www.pib.gov.in/RssMain.aspx?ModId=6&Lang=1&Regid=3')+'', { signal: AbortSignal.timeout(6000) });
      if (res.ok) {
        const data = await res.json();
        if (data.items && data.items.length) {
          return data.items.slice(0, 8).map((item, i) => ({
            id: 'live-' + i,
            date: item.pubDate ? item.pubDate.slice(0, 16) : 'Today',
            title: item.title,
            summary: item.description ? item.description.slice(0, 220) : '',
            subject: 'Misc',
            gsPaper: 'Misc',
            source: 'PIB Live',
            prelims: 'Current Affairs',
            mains: 'Contemporary issues',
            link: item.link
          }));
        }
      }
    } catch (e) {
      // ignore
    }
    return null;
  }

  return { seed, fetchLiveCA };
})();
