import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="mt-auto border-t border-gray-200 bg-gray-50">
      <div className="container mx-auto px-12 py-8">
        <div className="flex flex-col gap-8 md:flex-row md:justify-between">
          {/* Company Section */}
          <div>
            <h3 className="mb-4 text-sm font-semibold tracking-wider text-gray-900 uppercase">
              Company
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/dashboard/files"
                  className="text-sm text-gray-600 transition-colors hover:text-gray-900"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/files"
                  className="text-sm text-gray-600 transition-colors hover:text-gray-900"
                >
                  Careers
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/files"
                  className="text-sm text-gray-600 transition-colors hover:text-gray-900"
                >
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Section */}
          <div>
            <h3 className="mb-4 text-sm font-semibold tracking-wider text-gray-900 uppercase">
              Legal
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/dashboard/files"
                  className="text-sm text-gray-600 transition-colors hover:text-gray-900"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/files"
                  className="text-sm text-gray-600 transition-colors hover:text-gray-900"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/files"
                  className="text-sm text-gray-600 transition-colors hover:text-gray-900"
                >
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Support Section */}
          <div>
            <h3 className="mb-4 text-sm font-semibold tracking-wider text-gray-900 uppercase">
              Support
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/dashboard/files"
                  className="text-sm text-gray-600 transition-colors hover:text-gray-900"
                >
                  Help Center
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/files"
                  className="text-sm text-gray-600 transition-colors hover:text-gray-900"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/files"
                  className="text-sm text-gray-600 transition-colors hover:text-gray-900"
                >
                  Documentation
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources Section */}
          <div>
            <h3 className="mb-4 text-sm font-semibold tracking-wider text-gray-900 uppercase">
              Resources
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/dashboard/files"
                  className="text-sm text-gray-600 transition-colors hover:text-gray-900"
                >
                  API
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/files"
                  className="text-sm text-gray-600 transition-colors hover:text-gray-900"
                >
                  Status
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/files"
                  className="text-sm text-gray-600 transition-colors hover:text-gray-900"
                >
                  Community
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-8 border-t border-gray-200 pt-8">
          <div className="flex flex-col items-center justify-between md:flex-row">
            <p className="text-sm text-gray-600">
              © {new Date().getFullYear()} nDrive. All rights reserved.
            </p>
            <div className="mt-4 flex gap-6 md:mt-0">
              <Link
                href="/dashboard/files"
                className="text-sm text-gray-600 transition-colors hover:text-gray-900"
              >
                Security
              </Link>
              <Link
                href="/dashboard/files"
                className="text-sm text-gray-600 transition-colors hover:text-gray-900"
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
