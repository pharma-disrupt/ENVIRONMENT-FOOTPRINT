export default function Footer() {
  return (
    <footer className="border-t bg-white py-4 dark:border-gray-700 dark:bg-gray-800">
      <div className="px-6">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            © {new Date().getFullYear()} CarbonTrack. All rights reserved.
          </p>
          
          <div className="flex items-center gap-6">
            <a
              href="#"
              className="text-sm text-gray-600 hover:text-green-600 dark:text-gray-400 dark:hover:text-green-400"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="text-sm text-gray-600 hover:text-green-600 dark:text-gray-400 dark:hover:text-green-400"
            >
              Terms of Service
            </a>
            <a
              href="#"
              className="text-sm text-gray-600 hover:text-green-600 dark:text-gray-400 dark:hover:text-green-400"
            >
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
