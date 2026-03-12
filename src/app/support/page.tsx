import Link from "next/link";

export default function SupportPage() {
  const faqs = [
    {
      question: "Are the QR codes really free?",
      answer: "Yes! Our free tier gives you unlimited URL QR codes with no branding, no expiration, and no account required. You can generate as many as you want, forever, for free.",
    },
    {
      question: "How long do free QR codes last?",
      answer: "Forever. Our free QR codes are static — they encode your data directly into the code itself. There's no redirect, no service, no expiration. As long as the QR code is readable, it will work.",
    },
    {
      question: "What's included in Premium?",
      answer: "Premium includes all QR code types (WiFi, vCard, Email, SMS, Phone, Crypto), custom colors and logos, frame templates, batch generation, SVG export, the design studio, and priority support. One payment of $9, yours forever.",
    },
    {
      question: "Do I need an account?",
      answer: "No! You can generate unlimited free QR codes without creating an account. We don't require your email, phone number, or any personal information.",
    },
    {
      question: "Can I customize the QR code colors?",
      answer: "Custom colors are available with Premium. You can choose any color for your QR code while maintaining scannability. We automatically check that your color choices won't break the code.",
    },
    {
      question: "Can I add my logo to a QR code?",
      answer: "Yes! Premium users can upload their logo to place in the center of the QR code. We automatically adjust error correction to ensure the code remains scannable.",
    },
    {
      question: "What file formats can I download?",
      answer: "Free users can download as PNG. Premium users get PNG and SVG (vector) for print-quality results that scale to any size.",
    },
    {
      question: "What are static vs dynamic QR codes?",
      answer: "Static QR codes encode your data directly — the URL, WiFi password, or contact info is baked into the code itself. Dynamic QR codes use a redirect through our servers, allowing you to change the destination later but requiring ongoing service. We only offer static codes because they last forever.",
    },
    {
      question: "Will my QR code still work if your service shuts down?",
      answer: "Yes! Since we generate static QR codes, they work independently of our service. Even if we disappeared tomorrow, every QR code you've generated would continue to work.",
    },
    {
      question: "How do I get a refund?",
      answer: "We offer a 30-day money-back guarantee for Premium purchases. If you're not satisfied, contact us within 30 days of purchase for a full refund. No questions asked.",
    },
    {
      question: "How do I contact support?",
      answer: "You can email us at support@qrforever.com. Free users typically hear back within 24-48 hours. Premium users get priority support with faster response times.",
    },
    {
      question: "Do you offer bulk/custom solutions?",
      answer: "Yes! For enterprise needs, custom integrations, or bulk licensing, reach out to us at enterprise@qrforever.com. We're happy to help with custom solutions.",
    },
  ];

  return (
    <div className="flex-1">
      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 py-16 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
          How can we
          <span className="block text-indigo-600">help you?</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Find answers to common questions below, or reach out directly.
        </p>
      </section>

      {/* Contact Cards */}
      <section className="max-w-4xl mx-auto px-6 pb-12">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Email Support</h3>
                <p className="text-gray-600 text-sm">General questions</p>
              </div>
            </div>
            <a 
              href="mailto:support@qrforever.com" 
              className="text-indigo-600 font-medium hover:underline"
            >
              support@qrforever.com
            </a>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center text-yellow-700">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Priority Support</h3>
                <p className="text-gray-600 text-sm">Premium users only</p>
              </div>
            </div>
            <p className="text-gray-600 text-sm">
              Upgrade to Premium for priority support with faster response times.
            </p>
          </div>
        </div>
      </section>

      {/* Premium Notice */}
      <section className="max-w-4xl mx-auto px-6 pb-12">
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-yellow-900" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-yellow-900 mb-1">Premium users get priority support</h3>
              <p className="text-yellow-800 text-sm">
                Upgrade to Premium for faster response times and dedicated support. 
                Contact us at <a href="mailto:premium@qrforever.com" className="font-medium underline">premium@qrforever.com</a>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-6 pb-20">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <details 
              key={idx} 
              className="group bg-white rounded-xl shadow-md overflow-hidden"
            >
              <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
                <span className="font-semibold text-gray-900 pr-4">{faq.question}</span>
                <span className="flex-shrink-0 ml-4">
                  <svg 
                    className="w-5 h-5 text-gray-500 group-open:rotate-180 transition-transform" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </summary>
              <div className="px-6 pb-6 text-gray-600">
                {faq.answer}
              </div>
            </details>
          ))}
        </div>
      </section>

      {/* Still Need Help */}
      <section className="max-w-3xl mx-auto px-6 pb-20 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Still can't find what you're looking for?
        </h2>
        <p className="text-gray-600 mb-8">
          Send us a message and we'll get back to you as soon as possible.
        </p>
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <a 
            href="mailto:support@qrforever.com" 
            className="px-8 py-4 bg-indigo-600 text-white text-lg rounded-xl font-bold hover:bg-indigo-700 transition shadow-lg hover:shadow-xl inline-flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Contact Support
          </a>
          <Link href="/pricing" className="px-8 py-4 bg-yellow-400 text-yellow-900 text-lg rounded-xl font-bold hover:bg-yellow-300 transition shadow-lg hover:shadow-xl">
            Get Premium
          </Link>
        </div>
      </section>
    </div>
  );
}
