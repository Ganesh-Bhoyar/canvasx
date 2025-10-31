
'use client'

import { motion } from 'framer-motion'
import { Palette, Github, Twitter, Linkedin, Mail, Heart } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="relative bg-gray-900 text-white">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 via-purple-900/20 to-teal-900/20" />

      <div className="relative">
        {/* Main footer content */}
        <div className="container mx-auto px-6 pt-16 pb-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">

            {/* Brand section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-1"
            >
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                  <Palette className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold">CanvasX</span>
              </div>

              <p className="text-gray-400 leading-relaxed mb-6">
                The future of collaborative design. Create, collaborate, and bring your ideas to life with your team in real-time.
              </p>

              {/* Social links */}
              <div className="flex space-x-4">
                {[
                  { icon: Github, href: '#', label: 'GitHub' },
                  { icon: Twitter, href: '#', label: 'Twitter' },
                  { icon: Linkedin, href: '#', label: 'LinkedIn' },
                  { icon: Mail, href: '#', label: 'Email' }
                ].map((social, index) => {
                  const Icon = social.icon
                  return (
                    <motion.a
                      key={social.label}
                      href={social.href}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: 0.1 * index }}
                      whileHover={{ scale: 1.1, y: -2 }}
                      className="w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-lg flex items-center justify-center transition-colors duration-300 group"
                      aria-label={social.label}
                    >
                      <Icon className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
                    </motion.a>
                  )
                })}
              </div>
            </motion.div>

            {/* Product links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <h3 className="text-lg font-semibold mb-6">Product</h3>
              <ul className="space-y-4">
                {[
                  'Features',
                  'Pricing',
                  'Templates',
                  'Integrations',
                  'API',
                  'Changelog'
                ].map((link, index) => (
                  <motion.li
                    key={link}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.1 * index }}
                  >
                    <a
                      href="#"
                      className="text-gray-400 hover:text-white transition-colors duration-300 hover:underline"
                    >
                      {link}
                    </a>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Company links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h3 className="text-lg font-semibold mb-6">Company</h3>
              <ul className="space-y-4">
                {[
                  'About',
                  'Blog',
                  'Careers',
                  'Press',
                  'Partners',
                  'Contact'
                ].map((link, index) => (
                  <motion.li
                    key={link}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.1 * index }}
                  >
                    <a
                      href="#"
                      className="text-gray-400 hover:text-white transition-colors duration-300 hover:underline"
                    >
                      {link}
                    </a>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Support links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <h3 className="text-lg font-semibold mb-6">Support</h3>
              <ul className="space-y-4">
                {[
                  'Docs',
                  'Help Center',
                  'Community',
                  'Status',
                  'Privacy',
                  'Terms'
                ].map((link, index) => (
                  <motion.li
                    key={link}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.1 * index }}
                  >
                    <a
                      href="#"
                      className="text-gray-400 hover:text-white transition-colors duration-300 hover:underline"
                    >
                      {link}
                    </a>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </div>

          {/* Newsletter signup */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-16 pt-8 border-t border-gray-800"
          >
            <div className="max-w-md mx-auto lg:mx-0 text-center lg:text-left">
              <h3 className="text-lg font-semibold mb-4">Stay updated</h3>
              <p className="text-gray-400 mb-6">
                Get the latest updates, features, and tips delivered to your inbox.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-300"
                >
                  Subscribe
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="border-t border-gray-800"
        >
          <div className="container mx-auto px-6 py-6">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="text-gray-400 text-sm">
                © 2024 CanvasX. All rights reserved.
              </div>

              <div className="flex items-center space-x-2 text-gray-400 text-sm">
                <span>Made with</span>
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Heart className="w-4 h-4 text-red-500 fill-current" />
                </motion.div>
                <span>for creative teams worldwide</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}

export default Footer
