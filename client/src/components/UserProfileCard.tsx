import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ExternalLink } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";


const UserProfileCard = () => {
  // Mock data - in real app this would come from LinkedIn API or local storage
<<<<<<< HEAD
  const userProfile = {
    fullName: "Alex Johnson",
    title: "Junior Frontend Developer",
    profileImage: "/api/placeholder/120/120", // placeholder image
    linkedInUrl: "https://linkedin.com/in/alexjohnson",
    initials: "AJ"
  };
=======
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get("http://localhost:3000/users/me", {
          withCredentials: true
        });
        setUserProfile(response.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (!userProfile) return <p>User not found</p>;

>>>>>>> 1b32d940e3e51586f5e349ecf1f95a40850e1774

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start sm:justify-between gap-4">
          {/* Left section: Avatar and info */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
            <Avatar className="h-16 w-16 sm:h-12 sm:w-12">
<<<<<<< HEAD
              <AvatarImage src={userProfile.profileImage} alt={userProfile.fullName} />
=======

>>>>>>> 1b32d940e3e51586f5e349ecf1f95a40850e1774
              <AvatarFallback className="text-lg sm:text-sm bg-primary text-primary-foreground">
                {userProfile.initials}
              </AvatarFallback>
            </Avatar>

            <div className="text-center sm:text-left">
              <h3 className="font-semibold text-lg sm:text-base leading-tight">
                {userProfile.fullName}
              </h3>
              <p className="text-muted-foreground text-sm">
                {userProfile.title}
              </p>
            </div>
          </div>

          {/* Right section: LinkedIn button */}
<<<<<<< HEAD
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-2 shrink-0"
            onClick={() => window.open(userProfile.linkedInUrl, '_blank')}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
            LinkedIn
            <ExternalLink className="w-3 h-3" />
          </Button>
=======

>>>>>>> 1b32d940e3e51586f5e349ecf1f95a40850e1774
        </div>
      </CardContent>
    </Card>
  );
};

export default UserProfileCard;