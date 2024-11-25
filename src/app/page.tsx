import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center">
      <div className="max-w-3xl space-y-6">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
            Transform Your Ideas into
            <span className="text-primary"> Stunning Images</span>
          </h1>
          <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
            Create unique, AI-generated images from your text descriptions.
            Unleash your creativity with our powerful image generation platform.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link href="/generate">
            <Button size="lg" className="w-full sm:w-auto">
              Start Creating
              <Sparkles className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Link href="/gallery">
            <Button size="lg" variant="outline" className="w-full sm:w-auto">
              View Gallery
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}