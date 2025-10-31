
'use client'

import { motion } from 'framer-motion'
import { Check, Star, Sparkles } from 'lucide-react'

const plans = [
  {
    name: 'Free Forever',
    price: '0',
    description: 'Perfect for individuals and small teams getting started',
    featured: true,
    features: [
      'Up to 3 collaborators',
      'Unlimited personal canvases',
      'Basic drawing tools',
      'Real-time collaboration',
      'Cloud sync',
      '30-day version history',
      'Community support'
    ],
    cta: 'Start Creating Free',
    badge: 'Most Popular'
  },
  {
    name: 'Pro',
    price: '12',
    description: 'For growing teams that need advanced features',
    featured: false,
    features: [
      'Unlimited collaborators',
      'Advanced drawing tools',
      'Custom templates',
      'Priority support',
      'Team management',
      'Unlimited version history',
      'Advanced exports (PDF, SVG)',
      'Integration APIs'
    ],
    cta: 'Start Pro Trial',
    badge: null
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    description: 'For large organizations with custom needs',
    featured: false,
    features: [
      'Everything in Pro',
      'SSO authentication',
      'Advanced security',
      'Custom integrations',
      'Dedicated support',
      'SLA guarantees',
      'On-premise deployment',
      'Custom training'
    ],
    cta: 'Contact Sales',
    badge: null
  }
]

const Pricing = () => {
  return (
    <section className="relative py-24 bg-white/50 backdrop-blur-sm">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 via-transparent to-purple-50/50" />

      <div className="relative container mx-auto px-6">
        {/* Section header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-green-100 to-blue-100 text-sm font-medium text-gray-700 mb-6"
          >
            💎 Simple Pricing
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6"
          >
            Start free,
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {' '}scale as you grow
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-xl text-gray-600 leading-relaxed"
          >
            Join thousands of teams already collaborating on CanvasX. 
            No credit card required to get started.
          </motion.p>
        </div>

        {/* Pricing grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: plan.featured ? -8 : -4, scale: plan.featured ? 1.02 : 1.01 }}
              className={`group relative ${plan.featured ? 'lg:scale-105' : ''}`}
            >
              <div className={`relative h-full rounded-2xl border p-8 transition-all duration-300 ${
                plan.featured 
                  ? 'bg-gradient-to-br from-blue-50 via-white to-purple-50 border-blue-200 shadow-xl hover:shadow-2xl' 
                  : 'bg-white/70 backdrop-blur-sm border-white/20 shadow-lg hover:shadow-xl'
              }`}>

                {/* Badge */}
                {plan.badge && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="flex items-center space-x-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg">
                      <Star className="w-4 h-4" />
                      <span>{plan.badge}</span>
                    </div>
                  </div>
                )}

                {/* Plan header */}
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <p className="text-gray-600 mb-6">{plan.description}</p>

                  <div className="flex items-baseline justify-center">
                    {plan.price === 'Custom' ? (
                      <span className="text-4xl font-bold text-gray-900">Custom</span>
                    ) : (
                      <>
                        <span className="text-5xl font-bold text-gray-900">${plan.price}</span>
                        <span className="text-gray-600 ml-2">/month</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Features */}
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <motion.li
                      key={featureIndex}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: 0.1 * featureIndex }}
                      className="flex items-center space-x-3"
                    >
                      <div className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${
                        plan.featured ? 'bg-blue-500' : 'bg-gray-400'
                      }`}>
                        <Check className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-gray-600">{feature}</span>
                    </motion.li>
                  ))}
                </ul>

                {/* CTA Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`w-full py-4 px-6 rounded-xl font-semibold transition-all duration-300 ${
                    plan.featured
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg hover:shadow-xl'
                      : 'bg-gray-900 text-white hover:bg-gray-800'
                  }`}
                >
                  {plan.featured && <Sparkles className="inline w-5 h-5 mr-2" />}
                  {plan.cta}
                </motion.button>

                {/* Featured plan glow effect */}
                {plan.featured && (
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-2xl blur-xl -z-10 group-hover:blur-2xl transition-all duration-300" />
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom guarantee */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-16"
        >
          <div className="inline-flex items-center space-x-2 text-gray-600">
            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
              <Check className="w-4 h-4 text-white" />
            </div>
            <span>30-day money-back guarantee • Cancel anytime • No setup fees</span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Pricing
