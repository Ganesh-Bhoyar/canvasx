
'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Play } from 'lucide-react'
import { useRouter } from 'next/navigation';
import Image from 'next/image'

const Hero = () => {
  const Router = useRouter();
  return (
    <section className="relative overflow-hidden">
      {/* Background gradients and blur effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-teal-600/10" />
      <div className="absolute top-0 left-1/4 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl" />
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />

      <div className="relative container mx-auto px-6 pt-20 pb-16 lg:pt-32 lg:pb-24">
        <div className="text-center max-w-4xl mx-auto">
          {/* Animated badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/20 text-sm font-medium text-gray-700 mb-8"
          >
            ✨ Now supporting real-time collaboration
            <ArrowRight className="ml-2 w-4 h-4" />
          </motion.div>

          {/* Main headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl lg:text-7xl font-bold text-gray-900 mb-6"
          >
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 bg-clip-text text-transparent">
              Draw. Collaborate.
            </span>
            <br />
            Create. Instantly.
          </motion.h1>

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl lg:text-2xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed"
          >
            CanvasX lets you and your team draw, brainstorm, and create together in real-time. 
            Experience the future of collaborative design with infinite possibilities.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
          >
            <button className="group relative inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300" onClick={(()=>{Router.push('/signup')})}>
              <span>Get Started</span>
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>

            <button className="group inline-flex items-center px-8 py-4 bg-white/20 backdrop-blur-sm border-2 border-white/30 text-gray-700 font-semibold rounded-xl hover:bg-white/30 transition-all duration-300">
              <Play className="mr-2 w-5 h-5" />
              <span>View Demo</span>
            </button>
          </motion.div>

          {/* Hero mockup */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="relative max-w-5xl mx-auto"
          >
            <div className="relative bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-2 shadow-2xl">
              {/* Browser chrome */}
              <div className="flex items-center space-x-2 p-4 border-b border-white/10">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
                <div className="flex-1 bg-white/5 rounded-lg px-4 py-1 ml-4">
                  <div className="text-xs text-gray-500">canvasx.app</div>
                </div>
              </div>

              {/* App interface mockup */}
              <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 rounded-b-xl h-96 overflow-hidden">
                {/* Toolbar */}
                <div className="absolute top-4 left-4 right-4 bg-white/80 backdrop-blur-sm rounded-lg p-2 flex items-center space-x-2 shadow-sm">
                  <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                    <div className="w-4 h-4 border-2 border-white rounded"></div>
                  </div>
                  <div className="w-8 h-8 bg-purple-500 rounded-md"></div>
                  <div className="w-8 h-8 bg-teal-500 rounded-md"></div>
                  <div className="w-px h-6 bg-gray-300"></div>
                  <div className="flex-1 h-2 bg-gray-200 rounded"></div>
                </div>

                {/* Canvas elements */}
                <div className="absolute inset-0 p-16">
                  <div className="relative w-full h-full">
                    {/* Collaborative cursors */}
                    <motion.div
                      animate={{ x: [0, 50, 100, 50, 0], y: [0, 30, 10, 40, 0] }}
                      transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                      className="absolute top-8 left-8 w-4 h-4 bg-blue-500 rounded-full shadow-lg"
                    />
                    <motion.div
                      animate={{ x: [100, 150, 200, 150, 100], y: [50, 20, 60, 80, 50] }}
                      transition={{ duration: 6, repeat: Infinity, ease: "linear", delay: 1 }}
                      className="absolute top-16 left-32 w-4 h-4 bg-purple-500 rounded-full shadow-lg"
                    />

                    {/* Drawing elements */}
                    <div className="absolute top-12 left-20 w-32 h-20 border-2 border-blue-400 rounded-lg bg-blue-50"></div>
                    <div className="absolute top-40 left-40 w-24 h-24 border-2 border-purple-400 rounded-full bg-purple-50"></div>
                    <div className="absolute top-28 left-60 w-40 h-2 bg-teal-400 rounded"></div>

                    {/* Text elements */}
                    <div className="absolute bottom-20 left-8 space-y-1">
                      <div className="w-24 h-2 bg-gray-400 rounded"></div>
                      <div className="w-32 h-2 bg-gray-300 rounded"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating collaboration indicators */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-4 -right-4 bg-white rounded-full p-3 shadow-lg border border-gray-200"
            >
              <div className="flex -space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full border-2 border-white"></div>
                <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full border-2 border-white"></div>
                <div className="w-8 h-8 bg-gradient-to-r from-teal-400 to-teal-600 rounded-full border-2 border-white flex items-center justify-center">
                  <span className="text-xs font-bold text-white">+3</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default Hero
