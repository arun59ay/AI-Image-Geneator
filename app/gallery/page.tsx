'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/components/auth-provider';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, ExternalLink, Download } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';
import axios from 'axios';

interface GeneratedImage {
  _id: string;
  prompt: string;
  imageUrl: string;
  createdAt: string;
}

export default function GalleryPage() {
  const { user } = useAuth();
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchImages();
    }
  }, [user]);

  const fetchImages = async () => {
    try {
      const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/images/user`);
      setImages(data);
    } catch (error) {
      toast.error('Failed to load images');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center">
        <Card className="p-6 text-center">
          <h2 className="text-xl font-semibold mb-2">Please Log In</h2>
          <p className="text-muted-foreground">
            You need to be logged in to view your gallery
          </p>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center">
        <Card className="p-6 text-center max-w-md">
          <h2 className="text-xl font-semibold mb-2">No Images Yet</h2>
          <p className="text-muted-foreground mb-4">
            Start generating images to build your collection
          </p>
          <Link href="/generate" className="inline-block">
            <Button>Generate Your First Image</Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Your Gallery</h1>
          <p className="text-muted-foreground">
            View and manage your generated images
          </p>
        </div>
        <Link href="/generate">
          <Button>Generate New Image</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {images.map((image) => (
          <Card key={image._id} className="overflow-hidden">
            <div className="aspect-square relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={image.imageUrl}
                alt={image.prompt}
                className="object-cover w-full h-full"
              />
            </div>
            <div className="p-4 space-y-2">
              <p className="text-sm text-muted-foreground line-clamp-2">
                {image.prompt}
              </p>
              <p className="text-xs text-muted-foreground">
                {new Date(image.createdAt).toLocaleDateString()}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => window.open(image.imageUrl, '_blank')}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Open
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => {
                    const link = document.createElement('a');
                    link.href = image.imageUrl;
                    link.download = `image-${image._id}.png`;
                    link.click();
                  }}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}