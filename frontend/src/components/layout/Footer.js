import { Link } from "react-router-dom";

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-surface-900 text-surface-300" id="site-footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 py-14">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl gradient-brand flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <span className="text-xl font-bold text-white">Book<span className="text-brand-400">Haven</span></span>
            </div>
            <p className="text-sm leading-relaxed text-surface-400">
              Your one-stop destination for discovering and purchasing your favorite books.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2.5">
              {[{ to: "/", label: "Home" }, { to: "/cart", label: "Cart" }, { to: "/orders", label: "Orders" }, { to: "/wishlist", label: "Wishlist" }].map((l) => (
                <li key={l.to}><Link to={l.to} className="text-sm text-surface-400 hover:text-brand-400 transition-colors">{l.label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-white font-semibold mb-4">Stay Updated</h3>
            <p className="text-sm text-surface-400 mb-4">Subscribe for new arrivals and deals.</p>
            <div className="flex gap-2">
              <input type="email" placeholder="Your email" className="flex-1 px-4 py-2.5 rounded-xl bg-surface-800 border border-surface-700 text-white placeholder-surface-500 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400" />
              <button className="px-4 py-2.5 rounded-xl gradient-brand text-white text-sm font-medium hover:shadow-glow transition-shadow">Go</button>
            </div>
          </div>
        </div>

        <div className="border-t border-surface-800 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-surface-500">© {currentYear} BookHaven. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="text-xs text-surface-500 hover:text-surface-300 cursor-pointer transition-colors">Privacy</span>
            <span className="text-xs text-surface-500 hover:text-surface-300 cursor-pointer transition-colors">Terms</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
