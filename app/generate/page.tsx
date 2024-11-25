'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/components/auth-provider';
import { Card } from '@/components/ui/card';
import axios from 'axios';

const generateSchema = z.object({
  prompt: z.string().min(1, 'Please enter a prompt').max(1000, 'Prompt is too long'),
});

type GenerateForm = z.infer<typeof generateSchema>;

export default function GeneratePage() {
  const { user } = useAuth();
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  
  const { register, handleSubmit, formState: { errors } } = useForm<GenerateForm>({
    resolver: zodResolver(generateSchema),
  });

  const onSubmit = async (data: GenerateForm) => {
    if (!user) {
      toast.error('Please log in to generate images');
      return;
    }

    if (user.credits < 1) {
      toast.error('Not enough credits');
      return;
    }

    try {
      setIsGenerating(true);
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/images/generate`, {
        prompt: data.prompt,
      });
      setGeneratedImage(response.data.imageUrl);
      toast.success('Image generated successfully!');
    } catch (error) {
      toast.error('Failed to generate image. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Generate Image</h1>
        <p className="text-muted-foreground">
          Transform your ideas into stunning images using AI.
          {user && <span className="ml-1">You have {user.credits} credits remaining.</span>}
        </p>
      </div>

      <Card className="p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="prompt">Describe your image</Label>
            <Textarea
              id="prompt"
              placeholder="A serene lake at sunset with mountains in the background, digital art style"
              className="h-32"
              {...register('prompt')}
            />
            {errors.prompt && (
              <p className="text-sm text-destructive">{errors.prompt.message}</p>
            )}
          </div>
          <Button 
            type="submit" 
            className="w-full"
            disabled={isGenerating || !user || user.credits < 1}
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Generate Image
              </>
            )}
          </Button>
        </form>
      </Card>

      {generatedImage && (
        <Card className="p-6 space-y-4">
          <h2 className="text-xl font-semibold">Generated Image</h2>
          <div className="relative aspect-square overflow-hidden rounded-lg border bg-muted">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={generatedImage}
              alt="Generated image"
              className="object-cover"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => window.open(generatedImage, '_blank')}
            >
              Open in New Tab
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                const link = document.createElement('a');
                link.href = generatedImage;
                link.download = 'generated-image.png';
                link.click();
              }}
            >
              Download
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}