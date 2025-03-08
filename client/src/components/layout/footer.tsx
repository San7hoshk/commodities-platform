import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 py-4">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-sm text-gray-600">© 2023 Trinity Trading and Consulting Limited. All rights reserved.</p>
          </div>
          <div className="flex space-x-4">
            <Link href="#">
              <a className="text-sm text-gray-600 hover:text-primary-600">Terms of Service</a>
            </Link>
            <Link href="#">
              <a className="text-sm text-gray-600 hover:text-primary-600">Privacy Policy</a>
            </Link>
            <Link href="#">
              <a className="text-sm text-gray-600 hover:text-primary-600">Contact Us</a>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
