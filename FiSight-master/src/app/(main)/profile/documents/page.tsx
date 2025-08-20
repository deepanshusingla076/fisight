'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Upload, FileText, Check, AlertCircle, X } from 'lucide-react';
import { PageHeader } from '@/components/shared/page-header';

interface UploadedFile {
  id: string;
  name: string;
  type: string;
  status: 'uploading' | 'completed' | 'error';
}

export default function DocumentsUploadPage() {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const { toast } = useToast();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      const fileId = Date.now().toString() + Math.random().toString(36);
      const newFile: UploadedFile = {
        id: fileId,
        name: file.name,
        type: file.type,
        status: 'uploading'
      };

      setUploadedFiles(prev => [...prev, newFile]);

      // Simulate upload process
      setTimeout(() => {
        setUploadedFiles(prev => 
          prev.map(f => 
            f.id === fileId 
              ? { ...f, status: Math.random() > 0.1 ? 'completed' : 'error' }
              : f
          )
        );
      }, 2000);
    });

    toast({
      title: "Files uploading",
      description: `Uploading ${files.length} file(s)...`,
    });
  };

  const removeFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const documentTypes = [
    {
      title: "Bank Statements",
      description: "Upload your recent bank statements (last 3-6 months)",
      icon: FileText,
      recommended: true
    },
    {
      title: "Tax Returns",
      description: "Previous year tax returns for income verification",
      icon: FileText,
      recommended: true
    },
    {
      title: "Investment Statements",
      description: "Portfolio statements from mutual funds, stocks, etc.",
      icon: FileText,
      recommended: false
    },
    {
      title: "Loan Documents",
      description: "Loan agreements, EMI details, outstanding balances",
      icon: FileText,
      recommended: false
    },
    {
      title: "Insurance Policies",
      description: "Life, health, vehicle insurance documents",
      icon: FileText,
      recommended: false
    },
    {
      title: "Salary Slips",
      description: "Recent salary slips for income analysis",
      icon: FileText,
      recommended: true
    }
  ];

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Upload Financial Documents" 
        description="Securely upload your financial documents for better AI analysis and recommendations. All documents are encrypted and stored safely."
      />

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Upload Documents
            </CardTitle>
            <CardDescription>
              Select and upload your financial documents. Supported formats: PDF, JPG, PNG
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="document-upload">Choose Files</Label>
              <Input
                id="document-upload"
                type="file"
                multiple
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileUpload}
                className="cursor-pointer"
              />
            </div>
            
            <div className="p-4 border-2 border-dashed border-muted-foreground/25 rounded-lg text-center">
              <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Drag and drop files here or click to browse
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Maximum file size: 10MB per file
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Document Types</CardTitle>
            <CardDescription>
              Recommended documents for better financial analysis
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {documentTypes.map((doc, index) => (
                <div key={index} className="flex items-start gap-3 p-3 rounded-lg border">
                  <doc.icon className="h-5 w-5 text-primary mt-0.5" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-sm">{doc.title}</h4>
                      {doc.recommended && (
                        <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                          Recommended
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">{doc.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {uploadedFiles.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Uploaded Files</CardTitle>
            <CardDescription>
              Track the status of your uploaded documents
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {uploadedFiles.map((file) => (
                <div key={file.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText className="h-4 w-4" />
                    <div>
                      <p className="text-sm font-medium">{file.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {file.status === 'uploading' && 'Uploading...'}
                        {file.status === 'completed' && 'Upload completed'}
                        {file.status === 'error' && 'Upload failed'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {file.status === 'uploading' && (
                      <div className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    )}
                    {file.status === 'completed' && (
                      <Check className="h-4 w-4 text-green-500" />
                    )}
                    {file.status === 'error' && (
                      <AlertCircle className="h-4 w-4 text-red-500" />
                    )}
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => removeFile(file.id)}
                      className="h-8 w-8 p-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
