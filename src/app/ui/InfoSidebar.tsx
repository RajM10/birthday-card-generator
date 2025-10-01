import { Gift, Users, Lock } from "lucide-react";

export function InfoSidebar() {
  return (
    <div className="w-full lg:w-80 lg:flex-shrink-0 space-y-6 mb-10 lg:mb-0">
      <div className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl shadow-lg border border-white/20">
        <div className="flex items-center gap-4 mb-4">
          <div className="bg-white/20 p-3 rounded-full">
            <Gift size={24} className="text-white" />
          </div>
          <h2 className="text-xl font-semibold text-white">How to Create</h2>
        </div>
        <p className="text-white/80 leading-relaxed text-sm">
          Click the &quot;Create New Card&quot; button, fill in the details, choose a
          theme, and add a photo slideshow for a personal touch.
        </p>
      </div>
      <div className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl shadow-lg border border-white/20">
        <div className="flex items-center gap-4 mb-4">
          <div className="bg-white/20 p-3 rounded-full">
            <Users size={24} className="text-white" />
          </div>
          <h2 className="text-xl font-semibold text-white">Your Cards</h2>
        </div>
        <p className="text-white/80 leading-relaxed text-sm">
          Your created cards are saved locally in your browser for 3 days. View,
          edit, or delete them from this dashboard.
        </p>
      </div>
      <div className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl shadow-lg border border-white/20">
        <div className="flex items-center gap-4 mb-4">
          <div className="bg-white/20 p-3 rounded-full">
            <Lock size={24} className="text-white" />
          </div>
          <h2 className="text-xl font-semibold text-white">Secure & Private</h2>
        </div>
        <p className="text-white/80 leading-relaxed text-sm">
          All your card messages are encrypted. Only those with the link can
          view the card. We respect your privacy.
        </p>
      </div>
    </div>
  );
}
