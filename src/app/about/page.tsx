import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="flex-1">
      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 py-16 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
          Why we built
          <span className="block text-indigo-600">QR Forever.</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          A story about frustration, simplicity, and making things right.
        </p>
      </section>

      {/* Our Story */}
      <section className="max-w-3xl mx-auto px-6 pb-20">
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">The Problem</h2>
          <p className="text-gray-600 mb-6 text-lg leading-relaxed">
            It started with a simple need: we needed QR codes for a event. 
            Business cards, posters, flyers — you name it. So we went to the first 
            QR code generator we found.
          </p>
          <p className="text-gray-600 mb-6 text-lg leading-relaxed">
            What happened next was frustrating. The QR codes worked for a few months, 
            then stopped. Why? <strong>They had expiration dates.</strong> The service we 
            used was redirecting our URLs through their own branded short links, and when 
            we stopped paying, everything broke.
          </p>
          <p className="text-gray-600 mb-6 text-lg leading-relaxed">
            We searched for a better option. What we found was worse:
          </p>
          <ul className="space-y-4 mb-8">
            {[
              "Subscription fees that never ended",
              "Branded links we didn't want",
              "QR codes that expired or required accounts",
              "Ugly, generic designs with no customization",
              "Mystery pricing with hidden fees",
            ].map((problem, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <svg className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-700">{problem}</span>
              </li>
            ))}
          </ul>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-6">The Solution</h2>
          <p className="text-gray-600 mb-6 text-lg leading-relaxed">
            So we built QR Forever. We asked ourselves: <strong>what would a QR code 
            generator look like if it actually cared about users?</strong>
          </p>
          <p className="text-gray-600 mb-6 text-lg leading-relaxed">
            Static QR codes that encode your data directly — no redirects, no middleman, 
            no expiration. Unlimited generation for free. Premium features that are 
            actually useful, with a one-time price that feels fair.
          </p>
          <p className="text-gray-600 text-lg leading-relaxed">
            No subscriptions. No tricks. Just QR codes that work, forever.
          </p>
        </div>
      </section>

      {/* The Problem with Others */}
      <section className="max-w-4xl mx-auto px-6 pb-20">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
          The problem with other QR generators
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              icon: (
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ),
              title: "Subscription Trap",
              description: "Pay monthly forever for basic features. Cancel and lose everything.",
            },
            {
              icon: (
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
              ),
              title: "Branded Links",
              description: "Your QR codes point to their links. You're advertising for them.",
            },
            {
              icon: (
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ),
              title: "Expiration Dates",
                  description: "QR codes that stop working after months. Your printed materials become useless.",
            },
            {
              icon: (
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              ),
              title: "Account Required",
              description: "Sign up just to generate a simple QR code. Share your email for what?",
            },
            {
              icon: (
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                </svg>
              ),
              title: "Limited Export",
              description: "Only PNG at tiny sizes. No vector for print. No batch options.",
            },
            {
              icon: (
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              ),
              title: "No Customization",
              description: "Stuck with ugly black-and-white codes. No colors, logos, or design.",
            },
          ].map((item, idx) => (
            <div 
              key={idx}
              className="bg-white rounded-xl shadow-md p-6 border border-gray-100"
            >
              <div className="w-16 h-16 bg-red-100 rounded-xl flex items-center justify-center text-red-600 mb-4">
                {item.icon}
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
              <p className="text-gray-600">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Our Promise */}
      <section className="max-w-3xl mx-auto px-6 pb-20">
        <div className="bg-indigo-600 rounded-2xl shadow-xl p-8 md:p-12 text-center">
          <h2 className="text-2xl font-bold text-white mb-6">Our Promise</h2>
          <div className="space-y-6">
            {[
              {
                title: "No Subscriptions. Ever.",
                description: "Pay once, own it forever. No recurring charges, no matter how much you use.",
              },
              {
                title: "Your Data, Your QR Codes",
                description: "We never brand your links. Your QR codes point exactly where you want.",
              },
              {
                title: "They Last Forever",
                description: "Static QR codes don't expire. Printed materials work as long as the paper holds.",
              },
              {
                title: "No Account Required",
                description: "Generate QR codes anonymously. We don't need your email to help you.",
              },
              {
                title: "Fair Pricing",
                description: "Premium is a one-time $9 fee. No hidden costs, no surprise charges.",
              },
            ].map((promise, idx) => (
              <div key={idx} className="flex items-start gap-4 text-left">
                <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-yellow-900" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-white">{promise.title}</h3>
                  <p className="text-indigo-200">{promise.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="max-w-4xl mx-auto px-6 pb-20">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
          What we believe
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl shadow-md p-8 border-t-4 border-indigo-600">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Simplicity First</h3>
            <p className="text-gray-600">
              The best features are the ones you don't notice. We design for 
              simplicity so you can focus on what matters — your work, not our tool.
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-8 border-t-4 border-indigo-600">
            <h3 className="text-xl font-bold text-gray-900 mb-4">User-First Pricing</h3>
            <p className="text-gray-600">
              We believe in fair, transparent pricing. No dark patterns, no 
              gotchas. You pay for value, and you keep what you pay for.
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-8 border-t-4 border-indigo-600">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Privacy Matters</h3>
            <p className="text-gray-600">
              We don't track more than we need. No accounts required means 
              less data collected. Your privacy isn't a feature — it's baseline.
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-8 border-t-4 border-indigo-600">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Built to Last</h3>
            <p className="text-gray-600">
              We design for permanence. When you print a QR code, it should 
              work when someone scans it next year. Or in ten years.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-3xl mx-auto px-6 pb-20 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Try it yourself
        </h2>
        <p className="text-gray-600 mb-8">
          Join thousands of users who've switched to QR Forever.
        </p>
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Link href="/" className="px-8 py-4 bg-indigo-600 text-white text-lg rounded-xl font-bold hover:bg-indigo-700 transition shadow-lg hover:shadow-xl">
            Generate Free QR Codes
          </Link>
          <Link href="/pricing" className="px-8 py-4 bg-yellow-400 text-yellow-900 text-lg rounded-xl font-bold hover:bg-yellow-300 transition shadow-lg hover:shadow-xl">
            Get Premium for $9
          </Link>
        </div>
      </section>
    </div>
  );
}
