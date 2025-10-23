import { Link, useLocation } from "wouter";
import { COMPANY } from "@/config/company";
import { Mail, Phone, MapPin, ExternalLink, ChevronRight } from "lucide-react";

export default function Footer() {
  const [location] = useLocation();
  
  // Pages that use TradingLayout (have sidebar)
  const sidebarPages = ['/dashboard', '/trading', '/history', '/active', '/pricing', '/billing', '/help'];
  const hasSidebar = sidebarPages.some(page => location.startsWith(page));
  
  return (
    <footer className={`w-full mt-10 border-t border-border/20 transition-all duration-300 relative z-10 ${hasSidebar ? 'lg:ml-40 bg-gradient-to-b from-background to-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/95' : 'bg-gradient-to-b from-background/60 to-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60'}`}>
      <div className={`mx-auto py-8 transition-all duration-300 ${hasSidebar ? 'max-w-[1200px] px-6 lg:px-12' : 'max-w-6xl px-4'}`}>
        {/* Top section: Links + Contact + Address */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3 uppercase tracking-wide">Quick Links</h3>
            <ul className="pl-1 space-y-2 text-sm">
              {[
                { href: "/about", label: "About Us" },
                { href: "/terms", label: "Terms and Conditions" },
                { href: "/privacy", label: "Privacy Policy" },
                { href: "/refunds", label: "Refunds/Cancellations" },
                { href: "/contact", label: "Contact Us" },
                { href: "/legal", label: "Legal" },
              ].map((item) => (
                <li key={item.href} className="group flex items-center gap-2">
                  <ChevronRight className="w-3.5 h-3.5 text-primary opacity-0 -translate-x-1 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0" />
                  <Link href={item.href} className="hover:text-primary text-muted-foreground">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3 uppercase tracking-wide">Contact</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary" />
                <a href={`mailto:${COMPANY.CONTACT_EMAIL}`} className="hover:text-primary">
                  {COMPANY.CONTACT_EMAIL}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-primary" />
                <a href={`tel:${COMPANY.CONTACT_PHONE}`} className="hover:text-primary">
                  {COMPANY.CONTACT_PHONE}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <ExternalLink className="w-4 h-4 text-primary" />
                <a href={COMPANY.WEBSITE} target="_blank" rel="noreferrer" className="hover:text-primary">
                  {COMPANY.WEBSITE.replace(/^https?:\/\//, "")}
                </a>
              </li>
            </ul>
          </div>

          {/* Address */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3 uppercase tracking-wide">Operating Address</h3>
            <div className="flex items-start gap-3 text-sm text-muted-foreground">
              <MapPin className="w-4 h-4 mt-1 text-primary flex-shrink-0" />
              <address className="not-italic leading-6">
                {COMPANY.ADDRESS_LINES.map((ln, i) => (
                  <div key={i}>{ln}</div>
                ))}
              </address>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="my-6 h-px bg-border/20" />

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <div className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">YoForex</span> • © {new Date().getFullYear()}
          </div>
          <div className="text-xs text-muted-foreground">
            Crafted with care for traders. Please review our policies before using the platform.
          </div>
        </div>
      </div>
    </footer>
  );
}
