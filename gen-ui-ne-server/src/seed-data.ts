// TEMPORARY: seeding only — remove before prod.
//
// Generates ~100 narrative log records per user. Each user has an implicit
// behavioural arc you can read top-to-bottom in the log stream:
//   - jack    : successful convert (happy-path growth funnel)
//   - rose    : cautious researcher (slow-burn conversion)
//   - robert  : frustrated churn-risk user (escalating errors -> dormant)
//   - kennedy : active day-trader (high-frequency bursts in one session)

import type { LogInsertDto } from './models/dto';

const INFO = 9;
const WARN = 13;
const ERROR = 17;

const MINUTE = 60_000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

type Event = {
  body: string;
  component: string;
  action: string;
  severity?: number;
  attrs?: Record<string, string>;
  // events sharing a trace key belong to one multi-step flow
  trace?: string;
};

// Deterministic hex id (no Math.random, stable across re-seeds).
function hexId(len: number, seed: number): string {
  let out = '';
  let x = (seed ^ 0x9e3779b9) >>> 0;
  while (out.length < len) {
    x = (Math.imul(x, 1103515245) + 12345) >>> 0;
    out += x.toString(16).padStart(8, '0');
  }
  return out.slice(0, len);
}

// Turn an ordered event list into LogInsertDto rows spread across `windowMs`,
// oldest first. Events sharing a `trace` get one shared trace id.
function materialise(user: string, events: Event[], windowMs: number): LogInsertDto[] {
  const now = Date.now();
  const start = now - windowMs;
  const n = events.length;
  const traceIds = new Map<string, string>();
  let traceSeed = 0;

  return events.map((e, i) => {
    const frac = n === 1 ? 1 : i / (n - 1);
    // deterministic sub-slot jitter so timestamps aren't perfectly uniform
    const jitter = (hexId(4, i + user.length).charCodeAt(0) % 37) * 1_000;
    const ts = Math.floor(start + frac * windowMs + jitter);

    let traceId: string | null = null;
    if (e.trace) {
      const key = `${user}:${e.trace}`;
      if (!traceIds.has(key)) traceIds.set(key, hexId(32, ++traceSeed * 7 + user.length));
      traceId = traceIds.get(key)!;
    }

    return {
      ts,
      severity: e.severity ?? INFO,
      body: e.body,
      trace_id: traceId,
      span_id: hexId(16, i * 31 + user.length),
      attributes: JSON.stringify({
        'user.name': user,
        'user.action': e.action,
        component: e.component,
        ...(e.attrs ?? {}),
      }),
    };
  });
}

// ---- jack: successful convert ------------------------------------------------
function jackEvents(): Event[] {
  const e: Event[] = [];
  const inst = (symbol: string, action: string, extra: Record<string, string> = {}) =>
    e.push({
      body: `Viewed ${symbol}`,
      action,
      component: 'InstrumentPage',
      attrs: { 'instrument.symbol': symbol, ...extra },
    });

  // Onboarding (one trace)
  e.push({ body: 'App opened', action: 'app_open', component: 'AppShell', trace: 'onboard' });
  e.push({
    body: 'Started sign up',
    action: 'signup_start',
    component: 'AuthScreen',
    trace: 'onboard',
  });
  e.push({
    body: 'Submitted email',
    action: 'signup_email',
    component: 'AuthScreen',
    trace: 'onboard',
    attrs: { 'auth.method': 'email' },
  });
  e.push({
    body: 'Email verified',
    action: 'email_verified',
    component: 'AuthScreen',
    trace: 'onboard',
  });
  e.push({
    body: 'Set password',
    action: 'password_set',
    component: 'AuthScreen',
    trace: 'onboard',
  });
  e.push({
    body: 'Accepted terms',
    action: 'terms_accepted',
    component: 'OnboardingStepper',
    trace: 'onboard',
  });
  e.push({
    body: 'Started identity check',
    action: 'kyc_submitted',
    component: 'OnboardingStepper',
    trace: 'onboard',
  });
  e.push({
    body: 'Uploaded document',
    action: 'kyc_document_upload',
    component: 'OnboardingStepper',
    trace: 'onboard',
    attrs: { 'doc.type': 'passport' },
  });
  e.push({
    body: 'Identity verified',
    action: 'kyc_approved',
    component: 'OnboardingStepper',
    trace: 'onboard',
  });
  e.push({
    body: 'Onboarding complete',
    action: 'onboarding_complete',
    component: 'OnboardingStepper',
    trace: 'onboard',
  });

  // Funding (one trace)
  e.push({
    body: 'Opened funding screen',
    action: 'funding_open',
    component: 'WalletScreen',
    trace: 'deposit1',
  });
  e.push({
    body: 'Linked bank account',
    action: 'bank_linked',
    component: 'WalletScreen',
    trace: 'deposit1',
    attrs: { 'bank.name': 'ANZ' },
  });
  e.push({
    body: 'Initiated deposit',
    action: 'deposit_initiated',
    component: 'DepositSheet',
    trace: 'deposit1',
    attrs: { amount: '1000.00', currency: 'NZD' },
  });
  e.push({
    body: 'Deposit pending',
    action: 'deposit_pending',
    component: 'DepositSheet',
    trace: 'deposit1',
    severity: WARN,
  });
  e.push({
    body: 'Deposit settled',
    action: 'deposit_settled',
    component: 'DepositSheet',
    trace: 'deposit1',
    attrs: { amount: '1000.00' },
  });

  // Exploration
  const symbols = [
    'AAPL',
    'MSFT',
    'NVDA',
    'TSLA',
    'VOO',
    'GOOGL',
    'AMZN',
    'META',
    'BRK.B',
    'AIR.NZ',
  ];
  e.push({
    body: 'Searched "US tech"',
    action: 'search',
    component: 'SearchBar',
    attrs: { 'search.query': 'US tech' },
  });
  for (const s of symbols) {
    inst(s, 'view_instrument');
    e.push({
      body: `Viewed price chart for ${s}`,
      action: 'view_chart',
      component: 'PriceChart',
      attrs: { 'instrument.symbol': s, timeframe: '1M' },
    });
    e.push({
      body: `Added ${s} to watchlist`,
      action: 'add_watchlist',
      component: 'WatchlistButton',
      attrs: { 'instrument.symbol': s },
    });
  }
  e.push({
    body: 'Viewed Explore recommendations',
    action: 'view_explore',
    component: 'ExploreFeed',
  });
  e.push({
    body: 'Clicked Browse investments',
    action: 'browse_investments',
    component: 'PromptCard',
  });

  // Orders (each its own trace) — building a diversified portfolio
  const buys = [
    ['VOO', '500.00'],
    ['AAPL', '250.00'],
    ['MSFT', '150.00'],
    ['NVDA', '100.00'],
    ['AIR.NZ', '75.00'],
  ];
  buys.forEach(([sym, amt], idx) => {
    const t = `order${idx}`;
    e.push({
      body: `Previewed buy order for ${sym}`,
      action: 'order_preview',
      component: 'OrderTicket',
      trace: t,
      attrs: { 'instrument.symbol': sym, 'order.side': 'buy', 'order.amount': amt },
    });
    e.push({
      body: `Confirmed buy order for ${sym}`,
      action: 'order_confirm',
      component: 'OrderTicket',
      trace: t,
      attrs: { 'instrument.symbol': sym, 'order.side': 'buy', 'order.amount': amt },
    });
    e.push({
      body: `Order placed for ${sym}`,
      action: 'order_placed',
      component: 'OrderTicket',
      trace: t,
      attrs: { 'instrument.symbol': sym, 'order.amount': amt },
    });
    e.push({
      body: `Order filled for ${sym}`,
      action: 'order_filled',
      component: 'OrderStatus',
      trace: t,
      attrs: { 'instrument.symbol': sym, 'order.amount': amt },
    });
    e.push({ body: 'Viewed portfolio', action: 'view_portfolio', component: 'AllocationBar' });
  });

  // Engaged repeat behaviour
  for (let i = 0; i < 12; i++) {
    e.push({
      body: 'Viewed portfolio',
      action: 'view_portfolio',
      component: 'AllocationBar',
      attrs: { 'portfolio.return': `${(i % 5) - 2}.${i}%` },
    });
    e.push({ body: 'Checked returns', action: 'view_returns', component: 'ReturnsCard' });
    e.push({
      body: 'Read market update',
      action: 'read_article',
      component: 'NewsFeed',
      attrs: { 'article.id': `mkt-${100 + i}` },
    });
  }

  // Auto-invest + advocacy
  e.push({
    body: 'Enabled auto-invest',
    action: 'enable_auto_invest',
    component: 'AutoInvestSetup',
    trace: 'auto',
    attrs: { frequency: 'weekly', amount: '100.00' },
  });
  e.push({
    body: 'Selected auto-invest order',
    action: 'auto_invest_order_set',
    component: 'AutoInvestSetup',
    trace: 'auto',
  });
  e.push({
    body: 'Enabled notifications',
    action: 'notifications_enabled',
    component: 'SettingsScreen',
  });
  e.push({
    body: 'Referred a friend',
    action: 'refer_friend',
    component: 'ReferralCard',
    attrs: { 'referral.code': 'JACK-2026' },
  });

  return e;
}

// ---- rose: cautious researcher ----------------------------------------------
function roseEvents(): Event[] {
  const e: Event[] = [];
  e.push({ body: 'App opened', action: 'app_open', component: 'AppShell' });
  e.push({
    body: 'Completed onboarding',
    action: 'onboarding_complete',
    component: 'OnboardingStepper',
  });
  e.push({
    body: 'Deposited funds',
    action: 'deposit_settled',
    component: 'DepositSheet',
    attrs: { amount: '200.00' },
  });

  const categories = [
    'ETFs',
    'Dividend stocks',
    'Responsible investing',
    'KiwiSaver',
    'Bonds',
    'Global markets',
  ];
  const articles = [
    'what-is-an-etf',
    'diversification-101',
    'fees-explained',
    'dollar-cost-averaging',
    'risk-vs-return',
    'esg-investing',
    'compound-growth',
    'reading-a-prospectus',
  ];

  // Lots of reading and comparing
  for (const c of categories) {
    e.push({
      body: `Browsed ${c}`,
      action: 'browse_category',
      component: 'CategoryList',
      attrs: { category: c },
    });
  }
  for (let i = 0; i < 18; i++) {
    const a = articles[i % articles.length];
    e.push({
      body: `Read article: ${a}`,
      action: 'read_article',
      component: 'ArticleReader',
      attrs: { 'article.slug': a, 'read.seconds': `${60 + i * 15}` },
    });
  }

  const funds = ['USF', 'NZG', 'GLB', 'ESG', 'DIV', 'TWF', 'EMG', 'PROP'];
  for (const f of funds) {
    e.push({
      body: `Viewed ${f}`,
      action: 'view_instrument',
      component: 'InstrumentPage',
      attrs: { 'instrument.symbol': f },
    });
    e.push({
      body: `Read ${f} disclosure`,
      action: 'view_disclosure',
      component: 'DisclosureModal',
      attrs: { 'instrument.symbol': f },
    });
    e.push({
      body: `Viewed ${f} fees`,
      action: 'view_fees',
      component: 'FeeBreakdown',
      attrs: { 'instrument.symbol': f },
    });
    e.push({
      body: `Added ${f} to watchlist`,
      action: 'add_watchlist',
      component: 'WatchlistButton',
      attrs: { 'instrument.symbol': f },
    });
  }
  e.push({
    body: 'Compared USF vs NZG',
    action: 'compare_instruments',
    component: 'CompareTool',
    attrs: { symbols: 'USF,NZG' },
  });
  e.push({
    body: 'Compared ESG vs DIV',
    action: 'compare_instruments',
    component: 'CompareTool',
    attrs: { symbols: 'ESG,DIV' },
  });

  // Watchlist churn — indecision
  for (let i = 0; i < 6; i++) {
    const f = funds[i % funds.length];
    e.push({
      body: `Removed ${f} from watchlist`,
      action: 'remove_watchlist',
      component: 'WatchlistButton',
      attrs: { 'instrument.symbol': f },
    });
    e.push({
      body: `Re-added ${f} to watchlist`,
      action: 'add_watchlist',
      component: 'WatchlistButton',
      attrs: { 'instrument.symbol': f },
    });
  }

  // Hesitation: preview then cancel, three times
  for (let i = 0; i < 3; i++) {
    const t = `hesitate${i}`;
    e.push({
      body: 'Previewed buy order for USF',
      action: 'order_preview',
      component: 'OrderTicket',
      trace: t,
      attrs: { 'instrument.symbol': 'USF', 'order.amount': '150.00' },
    });
    e.push({
      body: 'Opened fee breakdown from order',
      action: 'view_fees',
      component: 'FeeBreakdown',
      trace: t,
    });
    e.push({
      body: 'Cancelled buy order',
      action: 'order_cancelled',
      component: 'OrderTicket',
      trace: t,
      severity: WARN,
      attrs: { reason: 'user_cancelled' },
    });
  }
  // Extra deliberation
  for (let i = 0; i < 12; i++) {
    e.push({
      body: 'Used returns calculator',
      action: 'use_calculator',
      component: 'ReturnsCalculator',
      attrs: { 'input.amount': `${50 + i * 25}` },
    });
  }
  for (let i = 0; i < 6; i++) {
    e.push({
      body: 'Adjusted risk profile slider',
      action: 'adjust_risk_profile',
      component: 'RiskProfiler',
      attrs: { 'risk.level': `${i + 1}` },
    });
    e.push({
      body: 'Viewed projected balance',
      action: 'view_projection',
      component: 'ProjectionChart',
      attrs: { 'horizon.years': `${(i + 1) * 5}` },
    });
  }

  // Conviction: small diversified first buy
  const t = 'firstbuy';
  e.push({
    body: 'Previewed buy order for USF',
    action: 'order_preview',
    component: 'OrderTicket',
    trace: t,
    attrs: { 'instrument.symbol': 'USF', 'order.amount': '50.00' },
  });
  e.push({
    body: 'Confirmed buy order for USF',
    action: 'order_confirm',
    component: 'OrderTicket',
    trace: t,
    attrs: { 'instrument.symbol': 'USF', 'order.amount': '50.00' },
  });
  e.push({
    body: 'Order placed for USF',
    action: 'order_placed',
    component: 'OrderTicket',
    trace: t,
    attrs: { 'instrument.symbol': 'USF' },
  });
  e.push({
    body: 'Order filled for USF',
    action: 'order_filled',
    component: 'OrderStatus',
    trace: t,
  });
  e.push({ body: 'Viewed portfolio', action: 'view_portfolio', component: 'AllocationBar' });
  e.push({
    body: 'Set up small weekly auto-invest',
    action: 'enable_auto_invest',
    component: 'AutoInvestSetup',
    attrs: { amount: '25.00', frequency: 'weekly' },
  });

  return e;
}

// ---- robert: frustrated churn-risk ------------------------------------------
function robertEvents(): Event[] {
  const e: Event[] = [];
  // Session 1 — payment friction
  e.push({ body: 'App opened', action: 'app_open', component: 'AppShell' });
  e.push({ body: 'Viewed dashboard', action: 'view_dashboard', component: 'Dashboard' });
  e.push({ body: 'Clicked Top up', action: 'top_up', component: 'PromptCard' });

  for (let i = 0; i < 4; i++) {
    const t = `pay${i}`;
    e.push({
      body: 'Opened deposit sheet',
      action: 'deposit_open',
      component: 'DepositSheet',
      trace: t,
    });
    e.push({
      body: 'Entered card details',
      action: 'card_entered',
      component: 'PaymentSheet',
      trace: t,
      attrs: { 'payment.method': 'visa' },
    });
    e.push({
      body: 'Submitted payment',
      action: 'payment_submit',
      component: 'PaymentSheet',
      trace: t,
      attrs: { amount: '500.00' },
    });
    if (i % 2 === 0) {
      e.push({
        body: 'Card declined',
        action: 'card_declined',
        component: 'PaymentSheet',
        trace: t,
        severity: ERROR,
        attrs: { 'error.code': 'card_declined', 'payment.method': 'visa' },
      });
    } else {
      e.push({
        body: '3-D Secure timed out',
        action: '3ds_timeout',
        component: 'PaymentSheet',
        trace: t,
        severity: WARN,
        attrs: { 'error.code': 'threeds_timeout' },
      });
    }
    e.push({
      body: 'Deposit failed',
      action: 'deposit_failed',
      component: 'DepositSheet',
      trace: t,
      severity: ERROR,
      attrs: { 'error.code': 'deposit_failed' },
    });
    e.push({
      body: 'Retried payment',
      action: 'payment_retry',
      component: 'PaymentSheet',
      trace: t,
    });
  }

  // Tries a different method
  e.push({
    body: 'Switched to bank transfer',
    action: 'payment_method_change',
    component: 'PaymentSheet',
    attrs: { 'payment.method': 'bank_transfer' },
  });
  e.push({
    body: 'Bank transfer instructions shown',
    action: 'bank_transfer_shown',
    component: 'PaymentSheet',
  });
  e.push({ body: 'Copied reference code', action: 'copy_reference', component: 'PaymentSheet' });

  // Attempts an order anyway — server error
  for (let i = 0; i < 3; i++) {
    const t = `order${i}`;
    e.push({
      body: 'Previewed buy order for VOO',
      action: 'order_preview',
      component: 'OrderTicket',
      trace: t,
      attrs: { 'instrument.symbol': 'VOO' },
    });
    e.push({ body: 'Submitted order', action: 'order_submit', component: 'OrderTicket', trace: t });
    e.push({
      body: 'Order submit failed (HTTP 500)',
      action: 'order_error',
      component: 'OrderTicket',
      trace: t,
      severity: ERROR,
      attrs: { 'error.code': 'http_500', 'http.status': '500' },
    });
  }

  // Escalation
  e.push({ body: 'Opened help centre', action: 'open_help', component: 'HelpCentre' });
  for (let i = 0; i < 5; i++) {
    e.push({
      body: `Searched help: "${['deposit failed', 'card declined', 'why cant i buy', 'refund', 'contact'][i]}"`,
      action: 'help_search',
      component: 'HelpCentre',
      attrs: {
        'search.query': ['deposit failed', 'card declined', 'why cant i buy', 'refund', 'contact'][
          i
        ],
      },
    });
  }
  e.push({
    body: 'Started live chat',
    action: 'support_chat_start',
    component: 'SupportChat',
    trace: 'ticket',
  });
  e.push({
    body: 'Described payment issue',
    action: 'support_message',
    component: 'SupportChat',
    trace: 'ticket',
  });
  e.push({
    body: 'Support ticket created',
    action: 'ticket_created',
    component: 'SupportChat',
    trace: 'ticket',
    severity: WARN,
    attrs: { 'ticket.id': 'SUP-4471' },
  });
  e.push({
    body: 'Session abandoned',
    action: 'session_abandoned',
    component: 'AppShell',
    severity: WARN,
  });

  // Session 2 — days later, still failing, churns
  e.push({ body: 'App reopened', action: 'app_open', component: 'AppShell' });
  e.push({
    body: 'Checked ticket status',
    action: 'ticket_view',
    component: 'SupportChat',
    attrs: { 'ticket.id': 'SUP-4471', 'ticket.status': 'open' },
  });
  for (let i = 0; i < 2; i++) {
    const t = `pay2-${i}`;
    e.push({
      body: 'Submitted payment',
      action: 'payment_submit',
      component: 'PaymentSheet',
      trace: t,
      attrs: { amount: '500.00' },
    });
    e.push({
      body: 'Card declined again',
      action: 'card_declined',
      component: 'PaymentSheet',
      trace: t,
      severity: ERROR,
      attrs: { 'error.code': 'card_declined' },
    });
  }
  e.push({
    body: 'Viewed close account page',
    action: 'view_close_account',
    component: 'SettingsScreen',
    severity: WARN,
  });
  e.push({
    body: 'Left negative feedback',
    action: 'feedback_submit',
    component: 'FeedbackModal',
    severity: WARN,
    attrs: { rating: '1', sentiment: 'negative' },
  });
  e.push({
    body: 'Marked dormant (no activity)',
    action: 'user_churned',
    component: 'System',
    severity: WARN,
  });

  // Pad early browsing so the arc reaches ~100
  const symbols = ['VOO', 'AAPL', 'TSLA', 'MSFT', 'NVDA'];
  const filler: Event[] = [];
  for (let i = 0; i < 30; i++) {
    const s = symbols[i % symbols.length];
    filler.push({
      body: `Viewed ${s}`,
      action: 'view_instrument',
      component: 'InstrumentPage',
      attrs: { 'instrument.symbol': s },
    });
    if (i % 3 === 0)
      filler.push({
        body: `Viewed price chart for ${s}`,
        action: 'view_chart',
        component: 'PriceChart',
        attrs: { 'instrument.symbol': s, timeframe: '1D' },
      });
  }
  // interleave filler near the front (before the payment saga)
  return [e[0], e[1], e[2], ...filler, ...e.slice(3)];
}

// ---- kennedy: active day-trader ---------------------------------------------
function kennedyEvents(): Event[] {
  const e: Event[] = [];
  const symbols = ['NVDA', 'TSLA', 'AAPL', 'GME', 'AMD', 'COIN', 'PLTR', 'SOFI'];
  const timeframes = ['1D', '1W', '1M', '1Y'];

  e.push({ body: 'App opened (pre-market)', action: 'app_open', component: 'AppShell' });
  e.push({ body: 'Viewed watchlist', action: 'view_watchlist', component: 'WatchlistScreen' });
  e.push({
    body: 'Read pre-market movers',
    action: 'read_news',
    component: 'NewsFeed',
    attrs: { 'news.topic': 'premarket' },
  });

  let orderIdx = 0;
  for (let round = 0; round < 12; round++) {
    const s = symbols[round % symbols.length];
    e.push({
      body: `Price alert triggered for ${s}`,
      action: 'price_alert_triggered',
      component: 'AlertToast',
      severity: WARN,
      attrs: { 'instrument.symbol': s, 'market.event': 'price_move' },
    });
    e.push({
      body: `Opened ${s}`,
      action: 'view_instrument',
      component: 'InstrumentPage',
      attrs: { 'instrument.symbol': s },
    });
    const tf = timeframes[round % timeframes.length];
    e.push({
      body: `Toggled chart to ${tf}`,
      action: 'chart_timeframe',
      component: 'PriceChart',
      attrs: { 'instrument.symbol': s, timeframe: tf },
    });
    e.push({
      body: `Read news on ${s}`,
      action: 'read_news',
      component: 'NewsFeed',
      attrs: { 'instrument.symbol': s },
    });

    const side = round % 3 === 0 ? 'sell' : 'buy';
    const t = `trade${orderIdx++}`;
    e.push({
      body: `Previewed ${side} order for ${s}`,
      action: 'order_preview',
      component: 'OrderTicket',
      trace: t,
      attrs: {
        'instrument.symbol': s,
        'order.side': side,
        'order.amount': `${100 + round * 20}.00`,
      },
    });
    e.push({
      body: `Placed ${side} order for ${s}`,
      action: 'order_placed',
      component: 'OrderTicket',
      trace: t,
      attrs: { 'instrument.symbol': s, 'order.side': side },
    });
    e.push({
      body: `Order filled for ${s}`,
      action: 'order_filled',
      component: 'OrderStatus',
      trace: t,
      attrs: { 'instrument.symbol': s, 'order.side': side },
    });
    e.push({
      body: 'Checked gains',
      action: 'view_returns',
      component: 'ReturnsCard',
      attrs: { 'portfolio.day_change': `${(round % 7) - 3}.${round}%` },
    });
    e.push({
      body: `Set new price alert on ${s}`,
      action: 'set_alert',
      component: 'AlertSetup',
      attrs: { 'instrument.symbol': s, 'alert.threshold': `${round + 1}%` },
    });
  }

  e.push({
    body: 'Read market close summary',
    action: 'read_news',
    component: 'NewsFeed',
    attrs: { 'news.topic': 'close' },
  });
  e.push({
    body: 'Reviewed day P&L',
    action: 'view_returns',
    component: 'ReturnsCard',
    attrs: { 'portfolio.day_change': '+2.4%' },
  });
  e.push({ body: 'App closed (post-market)', action: 'app_close', component: 'AppShell' });

  return e;
}

const GENERATORS: Record<string, () => Event[]> = {
  jack: jackEvents,
  rose: roseEvents,
  robert: robertEvents,
  kennedy: kennedyEvents,
};

const WINDOWS: Record<string, number> = {
  jack: 14 * DAY,
  rose: 10 * DAY,
  robert: 5 * DAY,
  kennedy: 7 * HOUR,
};

export const SEED_USERS = Object.keys(GENERATORS);

export function generateSeedLogs(user: string): LogInsertDto[] {
  const gen = GENERATORS[user];
  if (!gen) return [];
  return materialise(user, gen(), WINDOWS[user] ?? 7 * DAY);
}
