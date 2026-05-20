import Link from 'next/link';

export default function Footer() {
  return (
    <footer style={{ background: '#141821', color: '#ffffff' }}>
      <div className="max-w-7xl mx-auto px-8 lg:px-16 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#5b25c1,#40208e)' }}>
                <span style={{ color: 'white', fontWeight: 900, fontSize: '1.1rem' }}>X</span>
              </div>
              <span style={{ fontWeight: 700, fontSize: '1.4rem', color: 'white' }}>Xa&apos;an</span>
            </div>
            <p className="mb-6" style={{ color: '#756791', fontSize: '0.875rem', lineHeight: 1.75 }}>
              Mexico&apos;s premier rental platform. Short-term stays and long-term homes — unified in one reliably refreshed search.
            </p>
            <div className="flex gap-3">
              {[
                <svg key="ig" width="18" height="18" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="white" stroke="none" /></svg>,
                <svg key="fb" width="18" height="18" fill="white" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>,
                <svg key="tw" width="16" height="16" fill="white" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>,
                <svg key="li" width="18" height="18" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" /></svg>,
              ].map((icon, i) => (
                <a key={i} href="#" className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-[#5b25c1] transition-colors" style={{ background: 'rgba(255,255,255,0.05)' }}>{icon}</a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-base text-white mb-5">Quick Links</h4>
            <ul className="space-y-3">
              {[
                { href: '/rentals/short-term', label: 'Short-Term Rentals' },
                { href: '/rentals/long-term',  label: 'Long-Term Rentals' },
                { href: '/find-agent',          label: 'Find an Agent' },
                { href: '#',                   label: 'List Your Property' },
                { href: '#',                   label: 'Become a Host' },
              ].map(({ href, label }) => (
                <li key={label}><Link href={href} className="hover:text-white transition-colors" style={{ color: '#756791', fontSize: '0.875rem' }}>{label}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-base text-white mb-5">Resources</h4>
            <ul className="space-y-3">
              {["Renter's Guide", "Neighborhood Guide", "Market Insights", "Blog", "Help Center"].map((label) => (
                <li key={label}><a href="#" className="hover:text-white transition-colors" style={{ color: '#756791', fontSize: '0.875rem' }}>{label}</a></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-base text-white mb-5">Contact Us</h4>
            <ul className="space-y-4" style={{ color: '#756791', fontSize: '0.875rem' }}>
              <li className="flex items-center gap-3">
                <svg width="16" height="16" fill="none" stroke="#5b25c1" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
                hola@xaan.mx
              </li>
              <li className="flex items-center gap-3">
                <svg width="16" height="16" fill="none" stroke="#5b25c1" strokeWidth="2" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2.18h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.18 6.18l.95-.94a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
                +52 55 1234 5678
              </li>
              <li className="flex items-start gap-3">
                <svg width="16" height="16" fill="none" stroke="#5b25c1" strokeWidth="2" viewBox="0 0 24 24" className="mt-0.5 flex-shrink-0"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
                <span>Av. Paseo de la Reforma 250,<br />Col. Juárez, CDMX 06600</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <p style={{ color: '#756791', fontSize: '0.875rem' }}>© 2025 Xa&apos;an. All rights reserved.</p>
          <div className="flex gap-6">
            {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((label) => (
              <a key={label} href="#" className="hover:text-white transition-colors" style={{ color: '#756791', fontSize: '0.875rem' }}>{label}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
