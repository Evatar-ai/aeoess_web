// Standalone page launcher.
// Reads window.__page and renders a single page wrapped in PageShell.
// Navigation goes to sibling .html files in the same folder.

function KYAStandalone() {
  const onNavigate = (route) => {
    const file = route === 'home' ? '/kya/'
      : route === 'pricing' ? '/model-citizen/'
      : route === 'threatmodel' ? '/threat-model.html'
      : '/' + route + '.html';
    window.location.href = file;
  };
  const pageId = window.__page || 'home';
  let page;
  switch (pageId) {
    case 'protocol':     page = <ProtocolPage onNavigate={onNavigate} />; break;
    case 'payments':     page = <PaymentsPage onNavigate={onNavigate} />; break;
    case 'content':      page = <ContentPage onNavigate={onNavigate} />; break;
    case 'compliance':   page = <CompliancePage onNavigate={onNavigate} />; break;
    case 'enterprise':   page = <EnterprisePage onNavigate={onNavigate} />; break;
    case 'opensource':   page = <OpenSourcePage onNavigate={onNavigate} />; break;
    case 'pricing':      page = <PricingPage onNavigate={onNavigate} />; break;
    case 'blog':         page = <BlogPage onNavigate={onNavigate} />; break;
    case 'faq':          page = <FAQPage onNavigate={onNavigate} />; break;
    case 'compare':      page = <ComparePage onNavigate={onNavigate} />; break;
    case 'contact':      page = <ContactPage onNavigate={onNavigate} />; break;
    case 'roadmap':      page = <RoadmapPage onNavigate={onNavigate} />; break;
    case 'threatmodel':  page = <ThreatModelPage onNavigate={onNavigate} />; break;
    case 'docs':         page = <DocsPage onNavigate={onNavigate} />; break;
    case 'portal':       page = <PortalPage onNavigate={onNavigate} />; break;
    case 'terms':        page = <LegalPage kind="terms" onNavigate={onNavigate} />; break;
    case 'privacy':      page = <LegalPage kind="privacy" onNavigate={onNavigate} />; break;
    case 'sitemap':      page = <SitemapPage onNavigate={onNavigate} />; break;
    default:             page = <HomePage onNavigate={onNavigate} />;
  }
  // Pass empty string when on home so nav has no active highlight; otherwise pass route id.
  return (
    <PageShell route={pageId === 'home' ? '' : pageId} onNavigate={onNavigate}>
      {page}
    </PageShell>
  );
}

if (typeof window !== 'undefined' && document.getElementById('kya-root')) {
  ReactDOM.createRoot(document.getElementById('kya-root')).render(<KYAStandalone />);
}
