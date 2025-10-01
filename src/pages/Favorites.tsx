import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, MapPin, BookOpen, IndianRupee } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface FavoriteCollege {
  id: string;
  college_id: string;
  colleges: {
    id: string;
    name: string;
    location: string;
    course: string;
    fee: number;
  };
}

const Favorites = () => {
  const [favorites, setFavorites] = useState<FavoriteCollege[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchFavorites();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchFavorites = async () => {
    try {
      const { data, error } = await supabase
        .from("favorites")
        .select(`
          id,
          college_id,
          colleges (
            id,
            name,
            location,
            course,
            fee
          )
        `)
        .eq("user_id", user!.id);

      if (error) throw error;
      setFavorites(data || []);
    } catch (error) {
      toast({
        title: "Error loading favorites",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = async (favoriteId: string) => {
    try {
      const { error } = await supabase
        .from("favorites")
        .delete()
        .eq("id", favoriteId);

      if (error) throw error;

      toast({
        title: "Removed from favorites",
      });

      fetchFavorites();
    } catch (error) {
      toast({
        title: "Error removing favorite",
        variant: "destructive",
      });
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-16">
          <Card className="text-center py-12">
            <CardContent>
              <p className="text-lg text-muted-foreground">
                Please sign in to view your favorites
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          My Favorites
        </h1>

        {loading ? (
          <div className="text-center py-12">Loading favorites...</div>
        ) : favorites.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Heart className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <p className="text-lg text-muted-foreground">
                You haven't added any favorites yet. Start exploring colleges to add them here!
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((favorite) => (
              <Card key={favorite.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl">{favorite.colleges.name}</CardTitle>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeFavorite(favorite.id)}
                      className="text-red-500"
                    >
                      <Heart className="fill-current" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{favorite.colleges.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <BookOpen className="h-4 w-4" />
                    <span>{favorite.colleges.course}</span>
                  </div>
                  <div className="flex items-center gap-2 text-primary font-semibold text-lg">
                    <IndianRupee className="h-5 w-5" />
                    <span>{favorite.colleges.fee.toLocaleString()}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites;
