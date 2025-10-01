import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

interface Review {
  id: string;
  college_name: string;
  rating: number;
  comment: string;
  created_at: string;
}

const reviewSchema = z.object({
  college_name: z.string().trim().min(1, { message: "College name is required" }).max(100),
  rating: z.number().min(1).max(5),
  comment: z.string().trim().min(10, { message: "Comment must be at least 10 characters" }).max(500),
});

const Reviews = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [collegeName, setCollegeName] = useState("");
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setReviews(data || []);
    } catch (error) {
      toast({
        title: "Error loading reviews",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to be logged in to submit reviews",
        variant: "destructive",
      });
      return;
    }

    try {
      reviewSchema.parse({ college_name: collegeName, rating, comment });

      setLoading(true);

      const { error } = await supabase
        .from("reviews")
        .insert({
          college_name: collegeName.trim(),
          rating,
          comment: comment.trim(),
          user_id: user.id,
        });

      if (error) throw error;

      toast({
        title: "Review submitted!",
        description: "Thank you for your feedback",
      });

      setCollegeName("");
      setRating(0);
      setComment("");
      fetchReviews();
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: "Validation error",
          description: error.errors[0].message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error submitting review",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (count: number, interactive: boolean = false, onClick?: (i: number) => void) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star
            key={i}
            className={`h-5 w-5 ${
              i <= count ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
            } ${interactive ? "cursor-pointer hover:scale-110 transition-transform" : ""}`}
            onClick={() => onClick?.(i)}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          College Reviews
        </h1>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Submit Review Form */}
          <Card>
            <CardHeader>
              <CardTitle>Submit a Review</CardTitle>
              <CardDescription>Share your experience with a college</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="collegeName">College Name</Label>
                  <Input
                    id="collegeName"
                    placeholder="Enter college name"
                    value={collegeName}
                    onChange={(e) => setCollegeName(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Rating</Label>
                  {renderStars(rating, true, setRating)}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="comment">Your Review</Label>
                  <Textarea
                    id="comment"
                    placeholder="Share your thoughts..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={4}
                    required
                  />
                </div>

                <Button type="submit" disabled={loading || !user}>
                  {loading ? "Submitting..." : "Submit Review"}
                </Button>
                
                {!user && (
                  <p className="text-sm text-muted-foreground">
                    Please sign in to submit reviews
                  </p>
                )}
              </form>
            </CardContent>
          </Card>

          {/* Reviews List */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Recent Reviews</h2>
            
            {reviews.length === 0 ? (
              <Card>
                <CardContent className="text-center py-8">
                  <p className="text-muted-foreground">No reviews yet. Be the first to review!</p>
                </CardContent>
              </Card>
            ) : (
              reviews.map((review) => (
                <Card key={review.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{review.college_name}</CardTitle>
                      {renderStars(review.rating)}
                    </div>
                    <CardDescription>
                      {new Date(review.created_at).toLocaleDateString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{review.comment}</p>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reviews;
