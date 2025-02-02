import { AxiosAPIInstance } from "@/lib/AxiosInstance";
import { AggregatedResponse, APIResponse } from "@/types/APIResponse";
import { AxiosError } from "axios";
import React, { useEffect, useRef, useState } from "react";
import useSWR, { SWRConfiguration } from "swr";
import { useToast } from "./use-toast";

interface UseInfiniteScrollResult<T> {
  data: AggregatedResponse<T>;
  isLoading: boolean;
  error: any;
  loaderRef: React.RefObject<HTMLDivElement>;
}

const useInfiniteFetch = <T>(
  url: string,
  page: number = 1,
  limit: number = 10,
  options: SWRConfiguration = {}
): UseInfiniteScrollResult<T> => {
  const [curentPage, setCurrentPage] = useState<number>(page);
  const loaderRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // State to track the debounce timeout
  const [debounceTimeout, setDebounceTimeout] = useState<NodeJS.Timeout | null>(
    null
  );

  const [result, setReult] = useState<AggregatedResponse<T>>(initialResult);

  const queryUrl = url.includes("?")
    ? `${url}&page=${curentPage}&limit=${limit}`
    : `${url}?page=${curentPage}&limit=${limit}`;

  const fetchData = async (): Promise<AggregatedResponse<T>> => {
    try {
      const { data } = await AxiosAPIInstance.get<
        APIResponse<AggregatedResponse<T>>
      >(queryUrl);

      if (data.success && data.data) {
        return data.data;
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        toast({
          title:
            error.response?.data.message || "Failed to change subscription",
          variant: "destructive",
        });
      }

      console.error(error);
    }

    return initialResult;
  };

  const { data, error, isLoading, isValidating } = useSWR<
    AggregatedResponse<T>,
    Error
  >(queryUrl, fetchData, options);

  useEffect(() => {
    if (data) {
      setReult((prevState) => {
        return {
          ...data,
          docs: data.page == 1 ? data.docs : [...prevState.docs, ...data.docs],
        };
      });
    } else {
      setReult(initialResult);
      setCurrentPage(1);
    }
  }, [data]);

  // Handle intersection observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isValidating) {
          // Clear the previous timeout (if any)
          if (debounceTimeout) {
            clearTimeout(debounceTimeout);
          }

          // Set a new timeout to delay the API call
          const timeout = setTimeout(() => {
            setCurrentPage(curentPage + 1); // Load the next page
          }, 300); // Adjust the delay as needed (e.g., 300ms)

          // Save the timeout ID to state
          setDebounceTimeout(timeout);
        }
      },
      { threshold: 1.0 } // Trigger when the loader is fully visible
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => {
      if (loaderRef.current) {
        observer.unobserve(loaderRef.current);
      }

      // Clear the timeout when the component unmounts
      if (debounceTimeout) {
        clearTimeout(debounceTimeout);
      }
    };
  }, [curentPage, isValidating, debounceTimeout]);

  return {
    data: result,
    isLoading: isLoading || isValidating,
    error: error,
    loaderRef,
  };
};

const initialResult = {
  docs: [],
  hasNextPage: false,
  hasPrevPage: false,
  limit: 0,
  nextPage: null,
  page: 1,
  pagingCounter: 0,
  prevPage: null,
  totalDocs: 0,
  totalPages: 0,
};

export default useInfiniteFetch;
