import { Button } from "@/components/ui/button";
import { Navigation } from "@/components/Navigation";
import { useNavigate } from "react-router-dom";
import { GraduationCap, Search, Heart, Star } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="inline-block p-4 bg-primary/10 rounded-full mb-4">
            <GraduationCap className="h-16 w-16 text-primary" />
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            Find Your Perfect College
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
            Discover, compare, and choose from hundreds of top colleges across India. 
            Your educational journey starts here.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="text-lg px-8"
              onClick={() => navigate("/colleges")}
            >
              Get Started
              <Search className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="text-lg px-8"
              onClick={() => navigate("/auth")}
            >
              Sign In
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="text-center space-y-4 p-6 rounded-lg bg-card shadow-lg hover:shadow-xl transition-shadow">
            <div className="inline-block p-3 bg-primary/10 rounded-full">
              <Search className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">Smart Search</h3>
            <p className="text-muted-foreground">
              Filter colleges by location, course, and fees to find your perfect match
            </p>
          </div>
          
          <div className="text-center space-y-4 p-6 rounded-lg bg-card shadow-lg hover:shadow-xl transition-shadow">
            <div className="inline-block p-3 bg-accent/10 rounded-full">
              <Heart className="h-8 w-8 text-accent" />
            </div>
            <h3 className="text-xl font-semibold">Save Favorites</h3>
            <p className="text-muted-foreground">
              Bookmark colleges you're interested in and access them anytime
            </p>
          </div>
          
          <div className="text-center space-y-4 p-6 rounded-lg bg-card shadow-lg hover:shadow-xl transition-shadow">
            <div className="inline-block p-3 bg-primary/10 rounded-full">
              <Star className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">Read Reviews</h3>
            <p className="text-muted-foreground">
              Get insights from real students and make informed decisions
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
