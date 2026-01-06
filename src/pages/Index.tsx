import { Header } from "@/components/layout/Header";
import { CreateInterviewCard } from "@/components/interview/CreateInterviewCard";
import { StatsCards } from "@/components/interview/StatsCards";
import { RecentInterviews } from "@/components/interview/RecentInterviews";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-8 space-y-8">
        <CreateInterviewCard />
        <StatsCards />
        <RecentInterviews />
      </main>
    </div>
  );
};

export default Index;
