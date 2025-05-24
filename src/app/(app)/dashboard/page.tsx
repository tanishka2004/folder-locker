import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FileSearch2, LockKeyhole, FileText, ArrowRight } from "lucide-react";
import Image from "next/image";

export default function DashboardPage() {
  return (
    <div className="container mx-auto py-8">
      <header className="mb-12 text-center">
        <h1 className="text-5xl font-bold tracking-tight text-primary">Welcome to File Fortress</h1>
        <p className="mt-4 text-xl text-muted-foreground">
          Your intelligent solution for analyzing, securing, and understanding text files.
        </p>
      </header>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        <FeatureCard
          icon={<FileSearch2 className="w-12 h-12 text-accent" />}
          title="Analyze Folder"
          description="Gain insights into your text files. Analyze word counts, line counts, and more from our sample data."
          link="/analyze"
          linkText="Start Analyzing"
        />
        <FeatureCard
          icon={<LockKeyhole className="w-12 h-12 text-accent" />}
          title="Lock/Unlock Text"
          description="Secure your text snippets with simple XOR-based encryption. Easily lock and unlock your content."
          link="/lock-unlock"
          linkText="Secure Text"
        />
        <FeatureCard
          icon={<FileText className="w-12 h-12 text-accent" />}
          title="Generate AI Report"
          description="Leverage AI to generate enhanced CSV reports, including sentiment and complexity analysis for sample files."
          link="/report"
          linkText="Create Report"
        />
      </div>

      <Card className="mt-12 overflow-hidden shadow-xl">
        <div className="md:flex">
          <div className="md:w-1/2">
            <Image 
              src="https://placehold.co/600x400.png" 
              alt="File Fortress Illustration" 
              width={600} 
              height={400} 
              className="object-cover w-full h-full"
              data-ai-hint="data security" 
            />
          </div>
          <div className="md:w-1/2 p-8 flex flex-col justify-center">
            <CardHeader>
              <CardTitle className="text-3xl text-primary">Powerful Features at Your Fingertips</CardTitle>
              <CardDescription className="text-lg">
                File Fortress combines robust text analysis with AI-powered insights and simple security tools,
                all wrapped in a professional and intuitive interface.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-center"><ArrowRight className="w-5 h-5 mr-2 text-accent" /> Comprehensive text metrics</li>
                <li className="flex items-center"><ArrowRight className="w-5 h-5 mr-2 text-accent" /> AI-enhanced sentiment & complexity analysis</li>
                <li className="flex items-center"><ArrowRight className="w-5 h-5 mr-2 text-accent" /> Reversible XOR text encryption</li>
                <li className="flex items-center"><ArrowRight className="w-5 h-5 mr-2 text-accent" /> Clean, downloadable CSV reports</li>
              </ul>
              <Button asChild className="mt-6 w-full md:w-auto" size="lg">
                <Link href="/analyze">Get Started Now</Link>
              </Button>
            </CardContent>
          </div>
        </div>
      </Card>
    </div>
  );
}

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  link: string;
  linkText: string;
}

function FeatureCard({ icon, title, description, link, linkText }: FeatureCardProps) {
  return (
    <Card className="hover:shadow-xl transition-shadow duration-300 flex flex-col">
      <CardHeader className="items-center text-center">
        <div className="p-4 bg-accent/10 rounded-full mb-4">
          {icon}
        </div>
        <CardTitle className="text-2xl text-primary">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow text-center">
        <p className="text-muted-foreground mb-6">{description}</p>
      </CardContent>
      <div className="p-6 pt-0 mt-auto text-center">
        <Button asChild variant="outline" className="w-full border-accent text-accent hover:bg-accent hover:text-accent-foreground">
          <Link href={link}>{linkText}</Link>
        </Button>
      </div>
    </Card>
  );
}
