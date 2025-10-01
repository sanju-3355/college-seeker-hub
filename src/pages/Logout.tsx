import { useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleLogout = async () => {
      await supabase.auth.signOut();
    };
    handleLogout();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-16">
        <Card className="max-w-md mx-auto text-center py-12">
          <CardContent className="space-y-6">
            <div className="inline-block p-4 bg-primary/10 rounded-full">
              <LogOut className="h-12 w-12 text-primary" />
            </div>
            <h1 className="text-2xl font-bold">You have been logged out</h1>
            <p className="text-muted-foreground">
              Thank you for using EduFinder. Come back soon!
            </p>
            <Button onClick={() => navigate("/")}>
              Return to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Logout;
