
'use client'

import { motion } from 'framer-motion'
import { Users, Infinity, Palette, Shield, Zap, GitBranch } from 'lucide-react'

const features = [
  {
    icon: Users,
    title: 'Real-time Collaboration',
    description: 'Work together seamlessly with your team. See cursors, changes, and edits in real-time as they happen.',
    gradient: 'from-blue-500 to-cyan-500'
  },
  {
    icon: Infinity,
    title: 'Infinite Canvas',
    description: 'Never run out of space. Our infinite canvas grows with your ideas, no matter how big they get.',
    gradient: 'from-purple-500 to-pink-500'
  },
  {
    icon: Palette,
    title: 'Smart Tools',
    description: 'Intelligent drawing tools that adapt to your workflow. From freehand to precise shapes and diagrams.',
    gradient: 'from-teal-500 to-green-500'
  },
  {
    icon: Shield,
    title: 'Secure Cloud Sync',
    description: 'Your work is automatically saved and synchronized across all devices with enterprise-grade security.',
    gradient: 'from-orange-500 to-red-500'
  },
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Optimized for speed and performance. Experience smooth drawing with zero lag, even with complex projects.',
    gradient: 'from-indigo-500 to-purple-500'
  },
  {
    icon: GitBranch,
    title: 'Version History',
    description: 'Never lose your work. Access complete version history and restore any previous state of your canvas.',
    gradient: 'from-emerald-500 to-teal-500'
  }
]

const Features = () => {
  return (
    <section className="relative py-24 bg-white/50 backdrop-blur-sm">
      <div className="container mx-auto px-6">
        {/* Section header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 text-sm font-medium text-gray-700 mb-6"
          >
            ⚡ Powerful Features
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6"
          >
            Everything you need to
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {' '}create together
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-xl text-gray-600 leading-relaxed"
          >
            From brainstorming sessions to detailed technical diagrams, CanvasX provides 
            all the tools your team needs to bring ideas to life.
          </motion.p>
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="group"
              >
                <div className="relative bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300">
                  {/* Icon container */}
                  <div className="relative mb-6">
                    <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-r ${feature.gradient} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-gray-800 transition-colors">
                    {feature.title}
                  </h3>

                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>

                  {/* Hover gradient overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-r ${feature.gradient} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300`} />
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-16"
        >
          <button className="group inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
            <span>Explore All Features</span>
            <motion.div
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: 1000000000000, ease: "easeInOut" }}
              className="ml-2"
            >
              →
            </motion.div>
          </button>
        </motion.div>
      </div>
    </section>
  )
}

export default Features
