import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ExternalLink } from "lucide-react";
<<<<<<< HEAD
import { useEffect, useState } from "react";
import axios from "axios";
const serverUrl = import.meta.env.VITE_SERVER_URL;


const UserProfileCard = () => {
  // Mock data - in real app this would come from LinkedIn API or local storage
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get(`${serverUrl}/users/me`, {
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

=======

const UserProfileCard = () => {
  // Mock data - in real app this would come from LinkedIn API or local storage
  const userProfile = {
    fullName: "Alex Johnson",
    title: "job seeker",
    profileImage: "/api/placeholder/120/120", // placeholder image
    initials: "AJ"
  };
>>>>>>> parent of 9025c42 (changes)

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start sm:justify-between gap-4">
          {/* Left section: Avatar and info */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
            <Avatar className="h-16 w-16 sm:h-12 sm:w-12">
         
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
        
        </div>
      </CardContent>
    </Card>
  );
};

export default UserProfileCard;