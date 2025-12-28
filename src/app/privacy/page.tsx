export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
        <div className="prose prose-invert max-w-none">
          <p className="text-white/80 mb-4">
            Last updated: {new Date().toLocaleDateString()}
          </p>
          <p className="text-white/80 mb-6">
            Your privacy is important to us. This privacy policy explains how we collect, use, and protect your information.
          </p>
          <h2 className="text-2xl font-semibold mt-8 mb-4">Information We Collect</h2>
          <p className="text-white/80 mb-4">
            We collect information that you provide directly to us, including your name, email address, and any content you create using our service.
          </p>
          <h2 className="text-2xl font-semibold mt-8 mb-4">How We Use Your Information</h2>
          <p className="text-white/80 mb-4">
            We use the information we collect to provide, maintain, and improve our services, process your requests, and communicate with you.
          </p>
          <h2 className="text-2xl font-semibold mt-8 mb-4">Data Security</h2>
          <p className="text-white/80 mb-4">
            We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
          </p>
          <h2 className="text-2xl font-semibold mt-8 mb-4">Contact Us</h2>
          <p className="text-white/80 mb-4">
            If you have any questions about this Privacy Policy, please contact us.
          </p>
        </div>
      </div>
    </div>
  );
}
