// useSuggestions.ts
import { useState, useEffect } from "react";
import { AxiosError } from "axios";
import { APIResponse, SearchSuggestions } from "@/types/APIResponse";
import { AxiosAPIInstance } from "@/lib/AxiosInstance";
import { useToast } from "@/hooks/use-toast";

export const useSuggestions = (searchKey: string) => {
  const [suggestions, setSuggestions] = useState<SearchSuggestions[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchSuggestions = async (searchQuery: string) => {
      if (searchQuery && searchQuery.length) {
        try {
          setIsLoading(true);
          const { data } = await AxiosAPIInstance.get<
            APIResponse<SearchSuggestions[]>
          >(`/api/v1/video/search/suggestions?query=${searchQuery}`);
          if (data.success && data.data) {
            setSuggestions(data.data);
          }
        } catch (error) {
          if (error instanceof AxiosError) {
            toast({
              title:
                error.response?.data.message ||
                "Failed to fetch Search Results",
              variant: "destructive",
            });
          }
          setSuggestions([]);
          console.error(error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setSuggestions([]);
      }
    };

    fetchSuggestions(searchKey);
  }, [searchKey]);

  return { suggestions, isLoading };
};
