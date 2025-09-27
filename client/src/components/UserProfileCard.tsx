import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ExternalLink } from "lucide-react";
import { useMemo } from "react";

interface UserProfileCardProps {
  score?: number;
}

const UserProfileCard = ({ score }: UserProfileCardProps) => {
  // Attempt to load user from localStorage (set after login/register)
  let stored: any = null;
  try { stored = JSON.parse(localStorage.getItem('authUser') || 'null'); } catch {}
  const firstName = stored?.firstName || stored?.fullName?.split(' ')[0];
  const lastName = stored?.lastName || (stored?.fullName?.split(' ').slice(1).join(' ') || '');
  const fullName = stored ? [firstName, lastName].filter(Boolean).join(' ') : 'Guest User';
  const initials = (firstName?.[0] || '') + (lastName?.[0] || '');
  const userProfile = {
    fullName,
    title: 'job seeker',
    profileImage: '/api/placeholder/120/120',
    initials: initials.toUpperCase() || 'GU'
  };

  // Stable seed for cartoon avatar (funny bot style) – always show regardless of real photo availability
  const avatarSeed = useMemo(() => encodeURIComponent(userProfile.fullName || 'Career Booster'), [userProfile.fullName]);

  return (
    <Card className="w-full">
      <CardContent className="p-6">
  <div className="flex flex-col sm:flex-row items-center sm:items-center sm:justify-between gap-4">
          {/* Left section: Avatar and info */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
            <Avatar className="h-16 w-16 sm:h-12 sm:w-12 border shadow-sm bg-muted/40">
              {/* Always-visible funny cartoon avatar */}
              <AvatarImage
                src={`https://api.dicebear.com/8.x/bottts/svg?seed=${avatarSeed}&backgroundColor=b6e3f4,c0aede,d1d4f9&backgroundType=gradientLinear&radius=50`}
                alt={`${userProfile.fullName} cartoon avatar`}
                className="object-cover"
                loading="lazy"
              />
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

          {/* Right side: Score badge */}
          {typeof score === 'number' && (
            <div className="flex items-center">
              <div className="rounded-xl bg-white text-blue-600 font-extrabold text-base sm:text-lg px-5 py-2 shadow-sm border border-blue-300 tracking-wide">
                Score: <span className="ml-1">{score}</span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default UserProfileCard;