import { Trans, useLingui } from '@lingui/react/macro';
import { Upload } from 'lucide-react';
import { Profiler, useCallback, useState } from 'react';

import { RegisterForm, SEO } from '@/components/shared';
import { usePerformance } from '@/contexts/performanceContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useFileDrop } from '@/hooks';
import { toast } from '@/lib/toast';
import { cn } from '@/lib/utils';

export function HomePage() {
  const { t } = useLingui();
  const { onProfilerRender } = usePerformance();
  const [droppedFiles, setDroppedFiles] = useState<{ title: string; content: string }[]>([]);

  const handleFiles = useCallback((files: { title: string; content: string }[]) => {
    setDroppedFiles((prev) => [...prev, ...files]);
  }, []);

  const handleRejected = useCallback(
    (fileNames: string[]) => {
      toast.error(t`Only text files are supported`, {
        description: fileNames.join(', '),
      });
    },
    [t],
  );

  const handleSizeError = useCallback(
    (fileName: string) => {
      toast.error(t`File "${fileName}" exceeds 1MB limit`);
    },
    [t],
  );

  const handleReadError = useCallback(() => {
    toast.error(t`Failed to read files`);
  }, [t]);

  const { isDragging, dragHandlers, inputProps } = useFileDrop({
    onFiles: handleFiles,
    onRejected: handleRejected,
    onSizeError: handleSizeError,
    onReadError: handleReadError,
  });

  return (
    <Profiler id="home-page" onRender={onProfilerRender}>
      <div className="container mx-auto max-w-lg px-4 py-8">
        <SEO
          title={t({ message: 'Home', comment: 'Home page title for SEO' })}
          description={t({
            message: 'Welcome to our modern React application',
            comment: 'Home page meta description for SEO',
          })}
        />

        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold">
            <Trans comment="Main heading on the home page">Welcome to My App</Trans>
          </h1>
          <p className="text-muted-foreground mt-2">
            <Trans comment="Instructions for developers on how to start customizing the app">
              Get started by editing <code className="bg-muted rounded px-1">src/App.tsx</code>
            </Trans>
          </p>
        </div>

        {/* File drop zone demo */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>
              <Trans comment="File drop zone card title">File Drop</Trans>
            </CardTitle>
            <CardDescription>
              <Trans comment="File drop zone card description">Drag and drop text files here or click to browse</Trans>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div
              {...dragHandlers}
              className={cn(
                'border-border flex min-h-[120px] cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition-colors',
                isDragging && 'border-primary bg-primary/5',
              )}
            >
              <Upload className="text-muted-foreground mb-2 size-8" />
              <p className="text-muted-foreground text-sm">
                <Trans comment="File drop zone instructions">Drop .txt, .md, .json, or .csv files</Trans>
              </p>
              <input {...inputProps} />
            </div>
            {droppedFiles.length > 0 && (
              <div className="mt-4 space-y-2">
                {droppedFiles.map((file, i) => (
                  <div key={i} className="bg-muted rounded-md p-3">
                    <p className="text-sm font-medium">{file.title}</p>
                    <p className="text-muted-foreground mt-1 line-clamp-2 text-xs">{file.content}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Form validation demo */}
        <Card>
          <CardHeader>
            <CardTitle>
              <Trans comment="Register form card title">Registration Form</Trans>
            </CardTitle>
            <CardDescription>
              <Trans comment="Register form card description">React Hook Form + Zod validation demo</Trans>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RegisterForm />
          </CardContent>
        </Card>
      </div>
    </Profiler>
  );
}
