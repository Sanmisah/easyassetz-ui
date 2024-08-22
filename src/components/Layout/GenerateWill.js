import React, { useState } from "react";
import { Button } from "@com/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@com/ui/card";
import { Input } from "@com/ui/input";
import { Label } from "@com/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@com/ui/select";
import axios from "axios";
import Datepicker from "../Beneficiarydetails/Datepicker";
import { useDispatch, useSelector } from "react-redux";
import { setWilldata } from "@/Redux/sessionSlice";
const GenerateWill = () => {
  const User = JSON.parse(localStorage.getItem("user"));
  const { willdata } = useSelector((state) => state.counterSlice);
  const handleDownload = async () => {
    try {
      const response = await axios(
        {
          url: "/api/download-will", // Update this URL with your backend endpoint
          method: "GET",
          headers: {
            Authorization: `Bearer ${User?.data?.token}`,
            Accept: "application/json",
          },
          responseType: "blob", // Important for handling binary data
        },
        {
          headers: {
            Authorization: `Bearer ${User?.data?.token}`,
            Accept: "application/json",
          },
        }
      );

      // Create a URL for the downloaded file
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "filename.pdf"); // Specify the file name here
      document.body.appendChild(link);
      link.click();

      // Clean up and revoke the object URL
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading the file:", error);
    }
  };

  const [date, setDate] = useState(null);
  const generateWill = () => {
    console.log("date:", date);
    console.log("user:", User?.data?.token);
    axios.get("/api/download-will", {
      headers: {
        Authorization: `Bearer ${User?.data?.token}`,
        Accept: "application/json",
      },
    });
  };
  return (
    <div className="flex justify-center  w-full ">
      <Card className="w-[450px] h-[350px] border border-input mt-[100px] flex justify-center flex-col items-center gap-4">
        <CardHeader>
          <CardTitle>Will Generation </CardTitle>
          <CardDescription>Generate your will in one click.</CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="grid w-full items-center gap-4">
              <div className="flex items-center gap-4  space-y-1.5 ">
                <Label htmlFor="name" className="font-bold mt-1">
                  First Call Date:
                </Label>
                <Label htmlFor="name">{willdata?.firstCallDate}</Label>
              </div>
              <div className="flex items-center gap-4  space-y-1.5 ">
                <Label htmlFor="name" className="mt-1">
                  Latest Call Date:
                </Label>
                <Label htmlFor="name">{willdata?.latestCallDate}</Label>
              </div>
              <div className="flex items-center space-y-1.5">
                <Label htmlFor="framework">Count: {willdata?.callCount}</Label>
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button onClick={handleDownload}>Download Or view Pdf</Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default GenerateWill;
