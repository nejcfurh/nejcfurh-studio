import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-auto">
      <div className="container mx-auto px-12 py-8">
        <div className="flex flex-col md:flex-row md:justify-between gap-8">
          {/* Company Section */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
              Company
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/dashboard/files"
                  className="text-gray-600 hover:text-gray-900 transition-colors text-sm"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/files"
                  className="text-gray-600 hover:text-gray-900 transition-colors text-sm"
                >
                  Careers
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/files"
                  className="text-gray-600 hover:text-gray-900 transition-colors text-sm"
                >
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Section */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
              Legal
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/dashboard/files"
                  className="text-gray-600 hover:text-gray-900 transition-colors text-sm"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/files"
                  className="text-gray-600 hover:text-gray-900 transition-colors text-sm"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/files"
                  className="text-gray-600 hover:text-gray-900 transition-colors text-sm"
                >
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Support Section */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
              Support
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/dashboard/files"
                  className="text-gray-600 hover:text-gray-900 transition-colors text-sm"
                >
                  Help Center
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/files"
                  className="text-gray-600 hover:text-gray-900 transition-colors text-sm"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/files"
                  className="text-gray-600 hover:text-gray-900 transition-colors text-sm"
                >
                  Documentation
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources Section */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
              Resources
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/dashboard/files"
                  className="text-gray-600 hover:text-gray-900 transition-colors text-sm"
                >
                  API
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/files"
                  className="text-gray-600 hover:text-gray-900 transition-colors text-sm"
                >
                  Status
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/files"
                  className="text-gray-600 hover:text-gray-900 transition-colors text-sm"
                >
                  Community
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-600 text-sm">
              © {new Date().getFullYear()} nDrive. All rights reserved.
            </p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <Link
                href="/dashboard/files"
                className="text-gray-600 hover:text-gray-900 transition-colors text-sm"
              >
                Security
              </Link>
              <Link
                href="/dashboard/files"
                className="text-gray-600 hover:text-gray-900 transition-colors text-sm"
              >
                Accessibility
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
