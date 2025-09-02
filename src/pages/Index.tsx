import React from 'react';

const Index = () => {
  return (
    <div className="space-y-6">
      <div className="text-center py-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4">
          Resume Variants Manager
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Create and manage targeted resume versions for different opportunities. 
          Build your master resume, create variants with custom rules and overrides, 
          and export professional documents.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="bg-gradient-to-br from-primary/10 to-primary/5 p-6 rounded-lg border">
          <h3 className="text-lg font-semibold mb-2">Master Resume</h3>
          <p className="text-muted-foreground mb-4">
            Your canonical resume with all your experience, skills, and achievements.
          </p>
        </div>

        <div className="bg-gradient-to-br from-accent/10 to-accent/5 p-6 rounded-lg border">
          <h3 className="text-lg font-semibold mb-2">Variants</h3>
          <p className="text-muted-foreground mb-4">
            Targeted versions created through rules and field overrides.
          </p>
        </div>

        <div className="bg-gradient-to-br from-muted/50 to-muted/20 p-6 rounded-lg border">
          <h3 className="text-lg font-semibold mb-2">Export & Share</h3>
          <p className="text-muted-foreground mb-4">
            Download as Word documents with professional formatting.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
