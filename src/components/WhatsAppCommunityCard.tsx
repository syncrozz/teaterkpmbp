import React from 'react';
import { MessageCircle, Sparkles } from 'lucide-react';

interface WhatsAppCommunityCardProps {
  onJoinClick?: () => void;
}

export const WhatsAppCommunityCard: React.FC<WhatsAppCommunityCardProps> = ({ onJoinClick }) => {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-neutral-900 border border-white/10 p-6 md:p-8 text-white shadow-2xl space-y-6">
      
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        <div className="lg:col-span-8 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-[10px] font-mono font-bold uppercase tracking-widest">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            KOMUNITI WHATSAPP: ACTIVE
          </div>

          <div className="flex items-center gap-3">
            <div className="p-3.5 bg-green-500/15 rounded-2xl border border-green-500/30 text-green-400">
              <MessageCircle className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-xl md:text-2xl font-black uppercase tracking-tight text-white flex items-center gap-2">
                Komuniti Teater KPMBP di WhatsApp
              </h3>
              <p className="text-neutral-400 text-xs sm:text-sm">
                Saluran rasmi interaksi bakat, koordinasi kumpulan & bimbingan rehearsal
              </p>
            </div>
          </div>

          <p className="text-neutral-300 text-xs sm:text-sm leading-relaxed">
            Semua individu yang berminat dengan acara Teater (seni kreatif) digalakan untuk menyertai Komuniti kami melalui Group Whatsapp yang diwujudkan. Sekiranya anda minat, sila join group, komitmen tidak diperlukan, tidak keperluan untuk wajib hadir dalam apa-apa program, hanya maklumat dan galakan untuk mengembangkan bakat melalui Group Komuniti.
          </p>
        </div>

        <div className="lg:col-span-4 flex flex-col items-center lg:items-end justify-center gap-3">
          <div className="w-full bg-neutral-950 border border-white/5 rounded-3xl p-5 text-center space-y-3">
            <p className="text-[10px] text-neutral-400 uppercase tracking-widest font-mono">Pendaftaran Terbuka:</p>
            <p className="text-sm font-black text-amber-400 flex items-center justify-center gap-1.5 uppercase">
              <Sparkles className="w-4 h-4" /> Semua Pelajar KPMBP
            </p>
            <a
              href="https://chat.whatsapp.com/KTMPzBpwMn5L09vNSrxfdJ"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-4 rounded-2xl bg-green-600 hover:bg-green-500 text-white font-bold text-xs uppercase tracking-widest transition-all transform active:scale-95 shadow-lg shadow-green-950/40 flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              <span>JOIN KOMUNITI JOM!</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
