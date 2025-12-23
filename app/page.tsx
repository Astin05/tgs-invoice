'use client';

import { useState } from 'react';

export default function Home() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-md z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-emerald-600 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <span className="text-xl font-bold gradient-text">InvoiceFlow</span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">Features</a>
              <a href="#how-it-works" className="text-gray-600 hover:text-gray-900 transition-colors">How it Works</a>
              <a href="#pricing" className="text-gray-600 hover:text-gray-900 transition-colors">Pricing</a>
              <a href="#testimonials" className="text-gray-600 hover:text-gray-900 transition-colors">Testimonials</a>
              <a href="#faq" className="text-gray-600 hover:text-gray-900 transition-colors">FAQ</a>
            </div>

            <div className="flex items-center space-x-4">
              <button className="hidden sm:block text-gray-600 hover:text-gray-900 transition-colors">
                Sign In
              </button>
              <button className="btn-primary text-white px-6 py-2 rounded-lg font-semibold">
                Start Free Trial
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 via-white to-emerald-50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fadeInUp">
              <div className="inline-flex items-center space-x-2 bg-orange-100 text-orange-600 px-4 py-2 rounded-full text-sm font-semibold mb-6">
                <span className="w-2 h-2 bg-orange-600 rounded-full animate-pulse"></span>
                <span>Join 10,000+ businesses getting paid faster</span>
              </div>
              
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight mb-6">
                Get Paid <span className="gradient-text">2x Faster</span> with Intelligent Invoice Automation
              </h1>
              
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Stop chasing payments. InvoiceFlow automates reminders, accepts payments instantly, and predicts your cash flow—so you can focus on growing your business.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <button className="btn-primary text-white px-8 py-4 rounded-lg font-semibold text-lg flex items-center justify-center space-x-2">
                  <span>Start Free Trial</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </button>
                <button className="btn-secondary bg-white border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-lg font-semibold text-lg flex items-center justify-center space-x-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Watch Demo</span>
                </button>
              </div>
              
              <div className="flex items-center space-x-6 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center space-x-1">
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>14-day free trial</span>
                </div>
                <div className="flex items-center space-x-1">
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Cancel anytime</span>
                </div>
              </div>

              <div className="mt-8 flex items-center space-x-4">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 border-2 border-white"></div>
                  ))}
                </div>
                <div>
                  <div className="flex items-center space-x-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">4.9/5 from 2,000+ reviews</p>
                </div>
              </div>
            </div>
            
            <div className="animate-fadeIn relative">
              <div className="bg-gradient-to-br from-blue-500 to-emerald-500 rounded-2xl p-8 shadow-2xl animate-float">
                <div className="bg-white rounded-lg p-6 shadow-lg">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-gray-900">Invoice #1234</h3>
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">PAID</span>
                  </div>
                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Design Services</span>
                      <span className="font-semibold">$2,500</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Development</span>
                      <span className="font-semibold">$4,500</span>
                    </div>
                    <div className="border-t pt-3 flex justify-between">
                      <span className="font-bold text-gray-900">Total</span>
                      <span className="font-bold text-2xl gradient-text">$7,000</span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <div className="flex-1 bg-blue-500 h-2 rounded-full"></div>
                    <div className="flex-1 bg-blue-500 h-2 rounded-full"></div>
                    <div className="flex-1 bg-blue-500 h-2 rounded-full"></div>
                    <div className="flex-1 bg-blue-500 h-2 rounded-full"></div>
                  </div>
                </div>
              </div>
              
              {/* Floating Elements */}
              <div className="absolute -top-6 -right-6 bg-white rounded-lg shadow-lg p-4 animate-slideInRight" style={{animationDelay: '0.3s'}}>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-semibold">Payment received!</span>
                </div>
              </div>
              
              <div className="absolute -bottom-6 -left-6 bg-white rounded-lg shadow-lg p-4 animate-slideInLeft" style={{animationDelay: '0.5s'}}>
                <div className="text-sm font-semibold text-gray-700 mb-1">Cash Flow</div>
                <div className="flex items-end space-x-1">
                  {[40, 70, 50, 90, 60, 100].map((height, i) => (
                    <div key={i} className="w-2 bg-gradient-to-t from-blue-500 to-emerald-500 rounded-t" style={{height: `${height}%`}}></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Background Decoration */}
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none">
          <svg className="w-full h-full" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <path fill="#3B82F6" d="M47.5,-57.3C59.6,-45.5,66.4,-28.4,68.1,-11.1C69.8,6.2,66.4,23.7,57.4,37.6C48.4,51.5,33.8,61.8,17.6,66.5C1.4,71.2,-16.4,70.3,-31.7,64C-47,57.7,-59.8,46,-66.5,31.2C-73.2,16.4,-73.8,-1.5,-68.9,-17.4C-64,-33.3,-53.6,-47.2,-40.3,-58.6C-27,-70,-13.5,-78.9,1.9,-81.2C17.3,-83.5,34.6,-79.2,47.5,-57.3Z" transform="translate(100 100)" />
          </svg>
        </div>
      </section>

      {/* Social Proof - Marquee */}
      <section className="py-12 bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-center text-gray-600 mb-8 font-semibold">Trusted by businesses worldwide</p>
          <div className="overflow-hidden">
            <div className="flex space-x-12 animate-marquee">
              {[...Array(2)].map((_, setIndex) => (
                <div key={setIndex} className="flex space-x-12 items-center">
                  {['Stripe', 'QuickBooks', 'Xero', 'PayPal', 'Slack', 'Google', 'Salesforce', 'HubSpot'].map((brand) => (
                    <div key={brand} className="text-2xl font-bold text-gray-300 whitespace-nowrap">
                      {brand}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Problem/Solution Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 animate-fadeInUp">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Say Goodbye to <span className="gradient-text">Invoice Headaches</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We understand your pain. Let InvoiceFlow transform your invoicing experience.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                problem: "Spending hours creating and sending invoices manually",
                solution: "Create professional invoices in seconds with smart templates and one-click sending",
                icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
                color: "from-blue-500 to-blue-600"
              },
              {
                problem: "Chasing late payments and losing track of who owes what",
                solution: "Automated reminders that get you paid 2x faster with zero manual follow-up",
                icon: "M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9",
                color: "from-emerald-500 to-emerald-600"
              },
              {
                problem: "No visibility into future cash flow or payment patterns",
                solution: "Real-time dashboard shows exactly when you'll get paid with AI-powered predictions",
                icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
                color: "from-orange-500 to-orange-600"
              }
            ].map((item, index) => (
              <div key={index} className="feature-card hover-lift">
                <div className={`w-14 h-14 bg-gradient-to-br ${item.color} rounded-xl flex items-center justify-center mb-6`}>
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                  </svg>
                </div>
                <div className="mb-4">
                  <div className="flex items-start space-x-2 mb-3">
                    <span className="text-red-500 font-bold">✗</span>
                    <p className="text-gray-600 text-sm">{item.problem}</p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="text-green-500 font-bold">✓</span>
                    <p className="text-gray-900 font-semibold">{item.solution}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-blue-600 to-emerald-600">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 text-center text-white">
            {[
              { value: "2x", label: "Faster Payments", subtitle: "Average time to payment" },
              { value: "70%", label: "Time Saved", subtitle: "On invoice management" },
              { value: "95%", label: "Payment Rate", subtitle: "Within 60 days" },
              { value: "$2.4M", label: "Recovered", subtitle: "In unpaid invoices" }
            ].map((stat, index) => (
              <div key={index} className="animate-fadeInUp" style={{animationDelay: `${index * 0.1}s`}}>
                <div className="stat-number text-5xl font-bold mb-2">{stat.value}</div>
                <div className="text-xl font-semibold mb-1">{stat.label}</div>
                <div className="text-blue-100 text-sm">{stat.subtitle}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Showcase */}
      <section id="features" className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Everything You Need to <span className="gradient-text">Get Paid Faster</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Powerful features designed to automate your entire invoice-to-payment workflow
            </p>
          </div>

          <div className="space-y-24">
            {/* Feature 1 */}
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="animate-slideInLeft">
                <div className="inline-block bg-blue-100 text-blue-600 px-4 py-2 rounded-full text-sm font-semibold mb-4">
                  Smart Invoicing
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-4">
                  Create Professional Invoices in Seconds
                </h3>
                <p className="text-lg text-gray-600 mb-6">
                  Our drag-and-drop invoice builder makes it effortless to create stunning, branded invoices. Choose from customizable templates, set up recurring invoices, and support multiple currencies.
                </p>
                <ul className="space-y-3">
                  {[
                    "Drag-and-drop invoice builder",
                    "Customizable branded templates",
                    "Recurring invoice automation",
                    "Multi-currency support"
                  ].map((feature, i) => (
                    <li key={i} className="flex items-center space-x-3">
                      <svg className="w-6 h-6 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="animate-slideInRight">
                <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl p-8 shadow-xl">
                  <div className="bg-white rounded-lg p-6 shadow-lg">
                    <div className="border-b pb-4 mb-4">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h4 className="font-bold text-gray-900 mb-1">INVOICE</h4>
                          <p className="text-sm text-gray-500">#INV-2024-001</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-500">Date</p>
                          <p className="font-semibold">Dec 23, 2024</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500 mb-1">From</p>
                          <p className="font-semibold">Your Company</p>
                        </div>
                        <div>
                          <p className="text-gray-500 mb-1">Bill To</p>
                          <p className="font-semibold">Client Name</p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Service Description</span>
                        <span className="font-semibold">$1,500.00</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Additional Service</span>
                        <span className="font-semibold">$800.00</span>
                      </div>
                      <div className="border-t pt-2 flex justify-between">
                        <span className="font-bold">Total</span>
                        <span className="font-bold text-xl text-blue-600">$2,300.00</span>
                      </div>
                    </div>
                    <button className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold">
                      Pay Now
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="lg:order-2 animate-slideInRight">
                <div className="inline-block bg-emerald-100 text-emerald-600 px-4 py-2 rounded-full text-sm font-semibold mb-4">
                  Intelligent Reminders
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-4">
                  Never Chase Payments Again
                </h3>
                <p className="text-lg text-gray-600 mb-6">
                  Set up automated reminder sequences that get you paid 2x faster. Customize timing, messaging, and escalation logic across email, SMS, and in-app notifications.
                </p>
                <ul className="space-y-3">
                  {[
                    "Automated reminder sequences",
                    "Customizable timing and messaging",
                    "Multi-channel delivery (Email, SMS)",
                    "Smart escalation logic"
                  ].map((feature, i) => (
                    <li key={i} className="flex items-center space-x-3">
                      <svg className="w-6 h-6 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="lg:order-1 animate-slideInLeft">
                <div className="bg-gradient-to-br from-emerald-100 to-blue-100 rounded-2xl p-8 shadow-xl">
                  <div className="space-y-4">
                    {[
                      { day: "Day 7", message: "Friendly reminder: Invoice #1234 due in 3 days", color: "blue" },
                      { day: "Day 10", message: "Invoice #1234 is now due. Please process payment.", color: "yellow" },
                      { day: "Day 15", message: "Payment overdue. Urgent: Please settle Invoice #1234", color: "red" }
                    ].map((reminder, i) => (
                      <div key={i} className="bg-white rounded-lg p-4 shadow">
                        <div className="flex items-center justify-between mb-2">
                          <span className={`text-xs font-semibold px-2 py-1 rounded bg-${reminder.color}-100 text-${reminder.color}-700`}>
                            {reminder.day}
                          </span>
                          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <p className="text-sm text-gray-700">{reminder.message}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="animate-slideInLeft">
                <div className="inline-block bg-purple-100 text-purple-600 px-4 py-2 rounded-full text-sm font-semibold mb-4">
                  Instant Payments
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-4">
                  Accept Payments Anywhere, Anytime
                </h3>
                <p className="text-lg text-gray-600 mb-6">
                  Give your clients the flexibility to pay how they want. Accept credit cards, ACH, PayPal, and more with one-click payment links and mobile-optimized payment pages.
                </p>
                <ul className="space-y-3">
                  {[
                    "Accept credit cards, ACH, PayPal",
                    "One-click payment links",
                    "Mobile-optimized payment pages",
                    "Automatic payment reconciliation"
                  ].map((feature, i) => (
                    <li key={i} className="flex items-center space-x-3">
                      <svg className="w-6 h-6 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="animate-slideInRight">
                <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl p-8 shadow-xl">
                  <div className="bg-white rounded-lg p-6 shadow-lg">
                    <h4 className="font-bold text-gray-900 mb-4">Select Payment Method</h4>
                    <div className="space-y-3 mb-6">
                      {[
                        { name: "Credit Card", icon: "💳" },
                        { name: "Bank Transfer (ACH)", icon: "🏦" },
                        { name: "PayPal", icon: "🅿️" }
                      ].map((method, i) => (
                        <div key={i} className="flex items-center justify-between p-3 border-2 border-gray-200 rounded-lg hover:border-blue-500 cursor-pointer transition-colors">
                          <div className="flex items-center space-x-3">
                            <span className="text-2xl">{method.icon}</span>
                            <span className="font-semibold text-gray-700">{method.name}</span>
                          </div>
                          <div className="w-5 h-5 rounded-full border-2 border-gray-300"></div>
                        </div>
                      ))}
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-600">Amount Due</span>
                        <span className="font-bold text-2xl">$2,300.00</span>
                      </div>
                    </div>
                    <button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-semibold">
                      Pay Now
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="lg:order-2 animate-slideInRight">
                <div className="inline-block bg-orange-100 text-orange-600 px-4 py-2 rounded-full text-sm font-semibold mb-4">
                  Cash Flow Intelligence
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-4">
                  Predict Your Cash Flow with AI
                </h3>
                <p className="text-lg text-gray-600 mb-6">
                  Get real-time insights into your payment pipeline. Our AI-powered dashboard predicts when you&apos;ll get paid and identifies clients with payment issues before they become problems.
                </p>
                <ul className="space-y-3">
                  {[
                    "Real-time payment tracking",
                    "Predictive cash flow forecasting",
                    "Aging reports and analytics",
                    "Client payment behavior scoring"
                  ].map((feature, i) => (
                    <li key={i} className="flex items-center space-x-3">
                      <svg className="w-6 h-6 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="lg:order-1 animate-slideInLeft">
                <div className="bg-gradient-to-br from-orange-100 to-yellow-100 rounded-2xl p-8 shadow-xl">
                  <div className="bg-white rounded-lg p-6 shadow-lg">
                    <h4 className="font-bold text-gray-900 mb-4">Cash Flow Forecast</h4>
                    <div className="mb-6">
                      <div className="flex justify-between mb-2">
                        <span className="text-sm text-gray-600">Expected Revenue</span>
                        <span className="font-bold text-green-600">$45,200</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full" style={{width: '75%'}}></div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      {[
                        { month: "Jan", amount: 12000, color: "bg-blue-500" },
                        { month: "Feb", amount: 18000, color: "bg-emerald-500" },
                        { month: "Mar", amount: 15200, color: "bg-purple-500" }
                      ].map((item, i) => (
                        <div key={i}>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-semibold text-gray-700">{item.month}</span>
                            <span className="text-sm font-bold">${item.amount.toLocaleString()}</span>
                          </div>
                          <div className="h-8 bg-gray-100 rounded-lg overflow-hidden">
                            <div className={`h-full ${item.color} rounded-lg flex items-center justify-end px-2`} style={{width: `${(item.amount / 20000) * 100}%`}}>
                              <span className="text-xs text-white font-semibold">{Math.round((item.amount / 20000) * 100)}%</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-4 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Get Started in <span className="gradient-text">3 Simple Steps</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From setup to getting paid—in less than 5 minutes
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Create",
                description: "Build professional invoices in 30 seconds using our intuitive drag-and-drop builder and branded templates.",
                icon: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z",
                color: "from-blue-500 to-blue-600"
              },
              {
                step: "02",
                title: "Automate",
                description: "Set smart reminders and payment terms. Our AI handles follow-ups so you never have to chase payments again.",
                icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z",
                color: "from-emerald-500 to-emerald-600"
              },
              {
                step: "03",
                title: "Get Paid",
                description: "Watch money flow in automatically with instant payment processing and real-time cash flow tracking.",
                icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
                color: "from-orange-500 to-orange-600"
              }
            ].map((item, index) => (
              <div key={index} className="relative">
                <div className="bg-white rounded-2xl p-8 shadow-xl hover-lift h-full">
                  <div className="absolute -top-6 left-8">
                    <div className={`w-12 h-12 bg-gradient-to-br ${item.color} rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg`}>
                      {item.step}
                    </div>
                  </div>
                  <div className={`w-16 h-16 bg-gradient-to-br ${item.color} rounded-xl flex items-center justify-center mb-6 mt-4`}>
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">{item.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{item.description}</p>
                </div>
                {index < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform translate-x-1/2 -translate-y-1/2">
                    <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Simple, <span className="gradient-text">Transparent Pricing</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Choose the perfect plan for your business. All plans include a 14-day free trial.
            </p>
            
            <div className="inline-flex items-center bg-gray-100 rounded-full p-1">
              <button 
                onClick={() => setBillingCycle('monthly')}
                className={`px-6 py-2 rounded-full font-semibold transition-all ${billingCycle === 'monthly' ? 'bg-white shadow-md' : 'text-gray-600'}`}
              >
                Monthly
              </button>
              <button 
                onClick={() => setBillingCycle('annual')}
                className={`px-6 py-2 rounded-full font-semibold transition-all ${billingCycle === 'annual' ? 'bg-white shadow-md' : 'text-gray-600'}`}
              >
                Annual
                <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">Save 20%</span>
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Starter",
                monthlyPrice: 19,
                annualPrice: 15,
                description: "Perfect for freelancers and solo entrepreneurs",
                features: [
                  "50 invoices/month",
                  "Automated reminders",
                  "Basic reporting",
                  "Email support",
                  "Mobile app access",
                  "Payment processing"
                ],
                cta: "Start Free Trial",
                popular: false
              },
              {
                name: "Professional",
                monthlyPrice: 49,
                annualPrice: 39,
                description: "For growing businesses that need more power",
                features: [
                  "Unlimited invoices",
                  "Smart payment reminders",
                  "Advanced analytics",
                  "QuickBooks & Xero integration",
                  "Priority support",
                  "Custom branding",
                  "Multi-currency support",
                  "API access"
                ],
                cta: "Start Free Trial",
                popular: true
              },
              {
                name: "Business",
                monthlyPrice: 149,
                annualPrice: 119,
                description: "Enterprise-grade features for larger teams",
                features: [
                  "Everything in Professional",
                  "Multi-user accounts (up to 10)",
                  "Custom workflows",
                  "Advanced API access",
                  "Dedicated account manager",
                  "SLA guarantee",
                  "Custom integrations",
                  "White-label options"
                ],
                cta: "Contact Sales",
                popular: false
              }
            ].map((plan, index) => (
              <div key={index} className={`pricing-card bg-white rounded-2xl p-8 shadow-xl border-2 ${plan.popular ? 'popular' : 'border-gray-100'}`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-1 rounded-full text-sm font-bold">
                      MOST POPULAR
                    </span>
                  </div>
                )}
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <p className="text-gray-600 text-sm mb-4">{plan.description}</p>
                  <div className="flex items-end justify-center mb-2">
                    <span className="text-5xl font-bold gradient-text">
                      ${billingCycle === 'monthly' ? plan.monthlyPrice : plan.annualPrice}
                    </span>
                    <span className="text-gray-600 ml-2 mb-2">/month</span>
                  </div>
                  {billingCycle === 'annual' && (
                    <p className="text-sm text-green-600 font-semibold">
                      Billed annually (${(billingCycle === 'annual' ? plan.annualPrice : plan.monthlyPrice) * 12})
                    </p>
                  )}
                </div>
                
                <button className={`w-full py-3 rounded-lg font-semibold mb-6 ${plan.popular ? 'btn-primary text-white' : 'bg-gray-100 text-gray-900 hover:bg-gray-200'}`}>
                  {plan.cta}
                </button>
                
                <ul className="space-y-3">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start space-x-3">
                      <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-600 mb-4">
              All plans include 14-day free trial • No credit card required • Cancel anytime
            </p>
            <a href="#" className="text-blue-600 hover:text-blue-700 font-semibold">
              See full feature comparison →
            </a>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Loved by <span className="gradient-text">10,000+ Businesses</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              See how InvoiceFlow is helping businesses get paid faster
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                quote: "InvoiceFlow cut our payment collection time from 45 to 18 days. We've recovered $50K in previously slow-paying invoices in just 3 months.",
                author: "Jennifer Martinez",
                role: "Owner",
                company: "Martinez Marketing",
                avatar: "JM",
                color: "from-pink-400 to-purple-400"
              },
              {
                quote: "The automation is incredible. I used to spend 15 hours a week on invoicing and follow-ups. Now it takes me less than 2 hours. Game changer!",
                author: "David Chen",
                role: "Founder",
                company: "Chen Digital Agency",
                avatar: "DC",
                color: "from-blue-400 to-cyan-400"
              },
              {
                quote: "The cash flow forecasting feature alone is worth 10x the price. We can now plan our growth with confidence knowing exactly when money is coming in.",
                author: "Sarah Williams",
                role: "CFO",
                company: "Williams Consulting",
                avatar: "SW",
                color: "from-emerald-400 to-teal-400"
              },
              {
                quote: "Best invoicing software I've ever used. The interface is clean, intuitive, and the automated reminders actually work. Our payment rate is now 95%.",
                author: "Michael Brown",
                role: "CEO",
                company: "Brown Creative Studio",
                avatar: "MB",
                color: "from-orange-400 to-red-400"
              },
              {
                quote: "Integration with QuickBooks was seamless. All our invoices and payments sync automatically. Saved us countless hours of manual data entry.",
                author: "Emily Rodriguez",
                role: "Accountant",
                company: "Rodriguez & Associates",
                avatar: "ER",
                color: "from-purple-400 to-pink-400"
              },
              {
                quote: "The customer support is outstanding. They helped us migrate all our data and set up custom workflows. Highly recommend InvoiceFlow!",
                author: "James Taylor",
                role: "Operations Manager",
                company: "Taylor Construction",
                avatar: "JT",
                color: "from-cyan-400 to-blue-400"
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-lg hover-lift">
                <div className="flex mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg key={star} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-700 mb-6 leading-relaxed">&ldquo;{testimonial.quote}&rdquo;</p>
                <div className="flex items-center space-x-3">
                  <div className={`w-12 h-12 bg-gradient-to-br ${testimonial.color} rounded-full flex items-center justify-center text-white font-bold`}>
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">{testimonial.author}</div>
                    <div className="text-sm text-gray-600">{testimonial.role}, {testimonial.company}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Frequently Asked <span className="gradient-text">Questions</span>
            </h2>
            <p className="text-xl text-gray-600">
              Everything you need to know about InvoiceFlow
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                question: "How does the free trial work?",
                answer: "Start with a 14-day free trial of any plan—no credit card required. You'll have full access to all features during the trial. When it ends, you can choose to upgrade to a paid plan or continue with our limited free version."
              },
              {
                question: "Can I import my existing invoices?",
                answer: "Yes! InvoiceFlow makes it easy to import invoices from Excel, CSV, or directly from QuickBooks, Xero, FreshBooks, and other popular accounting software. Our support team is here to help with the migration."
              },
              {
                question: "What payment methods can I accept?",
                answer: "Accept credit cards (Visa, Mastercard, Amex), ACH bank transfers, PayPal, and more. We integrate with Stripe, PayPal, and Square for seamless payment processing."
              },
              {
                question: "How secure is my data?",
                answer: "We take security seriously. All data is encrypted in transit and at rest with 256-bit SSL encryption. We're SOC 2 Type II certified, GDPR compliant, and PCI-DSS certified for payment processing."
              },
              {
                question: "Can I cancel anytime?",
                answer: "Absolutely! There are no long-term contracts or cancellation fees. You can cancel your subscription at any time from your account settings. Your data will remain accessible for 90 days after cancellation."
              },
              {
                question: "Do you integrate with my accounting software?",
                answer: "Yes! We integrate seamlessly with QuickBooks Online, QuickBooks Desktop, Xero, FreshBooks, Sage, and many others. All invoices, payments, and client data sync automatically."
              },
              {
                question: "What happens to my data if I cancel?",
                answer: "Your data remains accessible for 90 days after cancellation. You can export all your invoices, payments, and reports at any time. After 90 days, data is permanently deleted from our servers."
              },
              {
                question: "Is there a setup fee?",
                answer: "No setup fees, ever! We believe in transparent pricing. What you see is what you pay—no hidden charges or surprise fees."
              }
            ].map((faq, index) => (
              <div key={index} className="border-2 border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full flex justify-between items-center p-6 text-left hover:bg-gray-50 transition-colors"
                >
                  <span className="font-semibold text-gray-900 pr-4">{faq.question}</span>
                  <svg 
                    className={`w-6 h-6 text-gray-600 flex-shrink-0 transition-transform ${openFaq === index ? 'transform rotate-180' : ''}`}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {openFaq === index && (
                  <div className="px-6 pb-6 text-gray-600 leading-relaxed">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4 bg-gradient-to-br from-blue-600 to-emerald-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Start Getting Paid Faster Today
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join 10,000+ businesses automating their invoicing and getting paid 2x faster
          </p>
          <button className="bg-white text-blue-600 px-10 py-4 rounded-lg font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all mb-6">
            Start Your Free 14-Day Trial
          </button>
          <p className="text-blue-100 text-sm">
            No credit card required • Cancel anytime • Setup in 5 minutes
          </p>
          
          <div className="grid md:grid-cols-3 gap-8 mt-16 text-left">
            {[
              { icon: "🔒", title: "Bank-level Security", text: "SOC 2 & GDPR compliant" },
              { icon: "⚡", title: "Lightning Fast", text: "Setup in under 5 minutes" },
              { icon: "💬", title: "24/7 Support", text: "We're here to help anytime" }
            ].map((item, i) => (
              <div key={i} className="flex items-start space-x-3">
                <span className="text-3xl">{item.icon}</span>
                <div>
                  <h3 className="font-bold mb-1">{item.title}</h3>
                  <p className="text-blue-100 text-sm">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-5 gap-8 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-emerald-600 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <span className="text-xl font-bold text-white">InvoiceFlow</span>
              </div>
              <p className="text-gray-400 mb-4">
                Intelligent invoicing and payment automation platform that helps businesses get paid faster.
              </p>
              <div className="flex space-x-4">
                {['twitter', 'linkedin', 'facebook', 'instagram'].map((social) => (
                  <a key={social} href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors">
                    <span className="sr-only">{social}</span>
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                    </svg>
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-bold text-white mb-4">Product</h3>
              <ul className="space-y-2">
                {['Features', 'Pricing', 'Integrations', 'Customers', 'Changelog'].map((item) => (
                  <li key={item}>
                    <a href="#" className="hover:text-white transition-colors">{item}</a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-white mb-4">Resources</h3>
              <ul className="space-y-2">
                {['Blog', 'Help Center', 'API Docs', 'Templates', 'Webinars'].map((item) => (
                  <li key={item}>
                    <a href="#" className="hover:text-white transition-colors">{item}</a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-white mb-4">Company</h3>
              <ul className="space-y-2">
                {['About', 'Careers', 'Contact', 'Press Kit', 'Partners'].map((item) => (
                  <li key={item}>
                    <a href="#" className="hover:text-white transition-colors">{item}</a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="text-sm text-gray-400">
                © 2024 InvoiceFlow. All rights reserved.
              </div>
              <div className="flex space-x-6 text-sm">
                {['Privacy Policy', 'Terms of Service', 'Security', 'GDPR'].map((item) => (
                  <a key={item} href="#" className="hover:text-white transition-colors">{item}</a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
