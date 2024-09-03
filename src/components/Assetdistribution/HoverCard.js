import React from "react";
import { CalendarDays, Users } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@com/ui/avatar";
import { Button } from "@com/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@com/ui/hover-card";

const HoverCardComponent = ({ asset }) => {
  return (
    <div>
      <HoverCard openDelay={0} side="top">
        <HoverCardTrigger asChild>
          <div className="flex items-center gap-2 bg-[#E8F7EB] p-2 rounded-[50px] ml-2 relative">
            <Users className="h-4 w-4 text-[#00a287] font-semibold" />
            <span className=" text-xs text-[#00a287] font-meidum">
              {asset?.length}
            </span>
          </div>
        </HoverCardTrigger>
        <HoverCardContent className="w-80 bg-[#1ea5ba]" side="top">
          <div className="flex justify-between space-x-4 gap-4">
            <div className="w-full gap-4">
              <p className="text-white font-medium mb-2">
                {" "}
                Distributed Beneficiary
              </p>
              <div className="flex flex-col gap-1">
                {asset?.map((data) => (
                  <div className="flex items-center gap-2 p-2 rounded-[2px] justify-between text-white bg-[#1ea5ba] w-full">
                    <p>{data.fullLegalName}</p>
                    <p>{data.Allocation}%</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </HoverCardContent>
      </HoverCard>
    </div>
  );
};

export default HoverCardComponent;
