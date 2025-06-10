import { Loader2 } from 'lucide-react';

export function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-netflix-black flex flex-col items-center justify-center">
      <div className="text-netflix-red font-bold text-3xl mb-6">NetflixSocial</div>
      <Loader2 className="h-10 w-10 text-netflix-red animate-spin" />
    </div>
  );
}