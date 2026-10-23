import React from "react";
import { Link } from "react-router-dom";
import { FaGithub, FaLinkedin, FaTwitter, FaGlobe } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 text-gray-600 text-xs sm:text-sm mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {/* Column 1 */}
          <div>
            <h3 className="font-bold text-gray-900 mb-3 text-xs uppercase tracking-wider">
              Support
            </h3>
            <ul className="space-y-2.5">
              <li>
                <Link to="/" className="hover:underline text-gray-600">
                  Help Centre
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:underline text-gray-600">
                  PlaceCover Protection
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:underline text-gray-600">
                  Anti-discrimination
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:underline text-gray-600">
                  Disability support
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:underline text-gray-600">
                  Cancellation options
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2 */}
          <div>
            <h3 className="font-bold text-gray-900 mb-3 text-xs uppercase tracking-wider">
              Hosting
            </h3>
            <ul className="space-y-2.5">
              <li>
                <Link to="/account/places/new" className="hover:underline text-gray-600">
                  Place your home
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:underline text-gray-600">
                  PlaceCover for Hosts
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:underline text-gray-600">
                  Hosting resources
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:underline text-gray-600">
                  Community forum
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:underline text-gray-600">
                  Hosting responsibly
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3 */}
          <div>
            <h3 className="font-bold text-gray-900 mb-3 text-xs uppercase tracking-wider">
              PlaceBooking
            </h3>
            <ul className="space-y-2.5">
              <li>
                <Link to="/" className="hover:underline text-gray-600">
                  Newsroom
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:underline text-gray-600">
                  New features
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:underline text-gray-600">
                  Careers
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:underline text-gray-600">
                  Investors
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:underline text-gray-600">
                  Emergency stays
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4 */}
          <div>
            <h3 className="font-bold text-gray-900 mb-3 text-xs uppercase tracking-wider">
              Discover Stays
            </h3>
            <ul className="space-y-2.5">
              <li>
                <Link to="/" className="hover:underline text-gray-600">
                  Amazing views
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:underline text-gray-600">
                  Beachfront villas
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:underline text-gray-600">
                  Alpine cabins
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:underline text-gray-600">
                  Pool estates
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:underline text-gray-600">
                  City apartments
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-200 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <div className="flex items-center gap-4 flex-wrap justify-center md:justify-start">
            <span>© 2026 PlaceBooking, Inc.</span>
            <span>·</span>
            <Link to="/" className="hover:underline">
              Privacy
            </Link>
            <span>·</span>
            <Link to="/" className="hover:underline">
              Terms
            </Link>
            <span>·</span>
            <Link to="/" className="hover:underline">
              Sitemap
            </Link>
            <span>·</span>
            <Link to="/" className="hover:underline">
              Company details
            </Link>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-1.5 font-semibold text-gray-800">
              <FaGlobe />
              <span>English (IN)</span>
            </div>
            <div className="font-semibold text-gray-800">
              <span>₹ INR</span>
            </div>
            <div className="flex items-center gap-3 text-base text-gray-700">
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub"
                className="hover:text-primary transition-colors"
              >
                <FaGithub />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                className="hover:text-primary transition-colors"
              >
                <FaLinkedin />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Twitter"
                className="hover:text-primary transition-colors"
              >
                <FaTwitter />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
