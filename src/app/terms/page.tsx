export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
        <div className="prose prose-invert max-w-none">
          <p className="text-white/80 mb-4">
            Last updated: {new Date().toLocaleDateString()}
          </p>
          <p className="text-white/80 mb-6">
            Please read these Terms of Service carefully before using our service.
          </p>
          <h2 className="text-2xl font-semibold mt-8 mb-4">Acceptance of Terms</h2>
          <p className="text-white/80 mb-4">
            By accessing and using this service, you accept and agree to be bound by the terms and provision of this agreement.
          </p>
          <h2 className="text-2xl font-semibold mt-8 mb-4">Use License</h2>
          <p className="text-white/80 mb-4">
            Permission is granted to temporarily use this service for personal, non-commercial use only. This is the grant of a license, not a transfer of title.
          </p>
          <h2 className="text-2xl font-semibold mt-8 mb-4">User Accounts</h2>
          <p className="text-white/80 mb-4">
            You are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities that occur under your account.
          </p>
          <h2 className="text-2xl font-semibold mt-8 mb-4">Prohibited Uses</h2>
          <p className="text-white/80 mb-4">
            You may not use our service for any unlawful purpose or to solicit others to perform unlawful acts.
          </p>
          <h2 className="text-2xl font-semibold mt-8 mb-4">Contact Us</h2>
          <p className="text-white/80 mb-4">
            If you have any questions about these Terms of Service, please contact us.
          </p>
        </div>
      </div>
    </div>
  );
}
