export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white mt-12">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-semibold mb-4">ABOUT</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>Contact Us</li>
              <li>About Us</li>
              <li>Careers</li>
              <li>Flipkart Stories</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">HELP</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>Payments</li>
              <li>Shipping</li>
              <li>Cancellation & Returns</li>
              <li>FAQ</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">POLICY</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>Return Policy</li>
              <li>Terms Of Use</li>
              <li>Security</li>
              <li>Privacy</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">SOCIAL</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>Facebook</li>
              <li>Twitter</li>
              <li>YouTube</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>© 2024 Flipkart Clone. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
