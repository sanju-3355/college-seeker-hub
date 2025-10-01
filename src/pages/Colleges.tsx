import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Heart, MapPin, BookOpen, IndianRupee } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface College {
  id: string;
  name: string;
  location: string;
  course: string;
  fee: number;
  isFavorite?: boolean;
}

const Colleges = () => {
  const [colleges, setColleges] = useState<College[]>([]);
  const [filteredColleges, setFilteredColleges] = useState<College[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("all");
  const [courseFilter, setCourseFilter] = useState("all");
  const [feeRange, setFeeRange] = useState([0, 300000]);
  const [sortBy, setSortBy] = useState("none");
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchColleges();
  }, [user]);

  const fetchColleges = async () => {
    try {
      const { data: collegesData, error: collegesError } = await supabase
        .from("colleges")
        .select("*");

      if (collegesError) throw collegesError;

      let collegesWithFavorites = collegesData || [];

      if (user) {
        const { data: favoritesData } = await supabase
          .from("favorites")
          .select("college_id")
          .eq("user_id", user.id);

        const favoriteIds = new Set(favoritesData?.map((f) => f.college_id));
        collegesWithFavorites = collegesData?.map((college) => ({
          ...college,
          isFavorite: favoriteIds.has(college.id),
        })) || [];
      }

      setColleges(collegesWithFavorites);
      setFilteredColleges(collegesWithFavorites);
    } catch (error) {
      toast({
        title: "Error loading colleges",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    applyFilters();
  }, [searchTerm, locationFilter, courseFilter, feeRange, sortBy, colleges]);

  const applyFilters = () => {
    let filtered = [...colleges];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter((college) =>
        college.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Location filter
    if (locationFilter !== "all") {
      filtered = filtered.filter((college) => college.location === locationFilter);
    }

    // Course filter
    if (courseFilter !== "all") {
      filtered = filtered.filter((college) => college.course === courseFilter);
    }

    // Fee range filter
    filtered = filtered.filter(
      (college) => college.fee >= feeRange[0] && college.fee <= feeRange[1]
    );

    // Sorting
    if (sortBy === "fee-low") {
      filtered.sort((a, b) => a.fee - b.fee);
    } else if (sortBy === "fee-high") {
      filtered.sort((a, b) => b.fee - a.fee);
    }

    setFilteredColleges(filtered);
  };

  const toggleFavorite = async (collegeId: string) => {
    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to be logged in to add favorites",
        variant: "destructive",
      });
      return;
    }

    const college = colleges.find((c) => c.id === collegeId);
    
    try {
      if (college?.isFavorite) {
        const { error } = await supabase
          .from("favorites")
          .delete()
          .eq("college_id", collegeId)
          .eq("user_id", user.id);

        if (error) throw error;
        
        toast({
          title: "Removed from favorites",
        });
      } else {
        const { error } = await supabase
          .from("favorites")
          .insert({ college_id: collegeId, user_id: user.id });

        if (error) throw error;
        
        toast({
          title: "Added to favorites",
        });
      }

      await fetchColleges();
    } catch (error) {
      toast({
        title: "Error updating favorites",
        variant: "destructive",
      });
    }
  };

  const locations = ["Hyderabad", "Bangalore", "Chennai"];
  const courses = ["Computer Science", "Electronics", "MBA", "MBBS"];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Explore Colleges
        </h1>

        {/* Filters Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Search & Filter</CardTitle>
            <CardDescription>Find your perfect college match</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Input
                placeholder="Search colleges..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />

              <Select value={locationFilter} onValueChange={setLocationFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  {locations.map((loc) => (
                    <SelectItem key={loc} value={loc}>{loc}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={courseFilter} onValueChange={setCourseFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Course" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Courses</SelectItem>
                  {courses.map((course) => (
                    <SelectItem key={course} value={course}>{course}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No Sorting</SelectItem>
                  <SelectItem value="fee-low">Fee: Low to High</SelectItem>
                  <SelectItem value="fee-high">Fee: High to Low</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Fee Range: ₹{feeRange[0].toLocaleString()} - ₹{feeRange[1].toLocaleString()}
              </label>
              <Slider
                min={0}
                max={300000}
                step={10000}
                value={feeRange}
                onValueChange={setFeeRange}
                className="w-full"
              />
            </div>
          </CardContent>
        </Card>

        {/* Colleges Grid */}
        {loading ? (
          <div className="text-center py-12">Loading colleges...</div>
        ) : filteredColleges.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <p className="text-lg text-muted-foreground">
                No colleges found matching your filters. Try adjusting your search criteria.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredColleges.map((college) => (
              <Card key={college.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl">{college.name}</CardTitle>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => toggleFavorite(college.id)}
                      className={college.isFavorite ? "text-red-500" : ""}
                    >
                      <Heart className={college.isFavorite ? "fill-current" : ""} />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{college.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <BookOpen className="h-4 w-4" />
                    <span>{college.course}</span>
                  </div>
                  <div className="flex items-center gap-2 text-primary font-semibold text-lg">
                    <IndianRupee className="h-5 w-5" />
                    <span>{college.fee.toLocaleString()}</span>
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

export default Colleges;
