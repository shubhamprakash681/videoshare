import { AxiosAPIInstance } from "@/lib/AxiosInstance";
import { AggregatedResponse, APIResponse } from "@/types/APIResponse";
import { AxiosError } from "axios";
import React, { useEffect, useRef, useState } from "react";
import useSWR, { SWRConfiguration } from "swr";
import { useToast } from "./use-toast";

interface UseInfiniteScrollResult<T> {
  data: AggregatedResponse<T>;
  isLoading: boolean;
  error: Error | undefined;
  loaderRef: React.RefObject<HTMLDivElement>;
  refreshData: () => Promise<void>;
}

const useInfiniteFetch = <T>(
  url: string,
  limit: number = 10,
  options: SWRConfiguration = {}
): UseInfiniteScrollResult<T> => {
  const [curentPage, setCurrentPage] = useState<number>(1);
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
    if (queryUrl.includes("undefined") || queryUrl.includes("null"))
      return initialResult;

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
          title: error.response?.data.message || "Something went wrong!",
          variant: "destructive",
        });
      }

      console.error(error);
    }

    return initialResult;
  };

  const { data, error, isLoading, isValidating, mutate } = useSWR<
    AggregatedResponse<T>,
    Error
  >(queryUrl, fetchData, options);

  useEffect(() => {
    refreshData();
  }, [url]);

  useEffect(() => {
    // console.log("data changed, data: ", data);

    if (data) {
      setReult((prevState) => {
        return {
          ...data,
          docs: data.page == 1 ? data.docs : [...prevState.docs, ...data.docs],
        };
      });
    }
    // else {
    //   setReult(initialResult);
    //   console.log("setpage from 83, val: ", 1);
    //   setCurrentPage(1);
    // }
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
            if (result.hasNextPage) {
              // console.log("setpage from 102, val: ", curentPage + 1);
              setCurrentPage(curentPage + 1); // Load the next page
            }
          }, 50); // Adjust the delay as needed (e.g., 50ms)

          // Save the timeout ID to state
          setDebounceTimeout(timeout);
        }
      },
      { threshold: 0.5 }
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

  const refreshData = async () => {
    // console.log("refresh called, curentPage: ", curentPage);
    // console.log("setpage from refresh, val: ", 1);
    setCurrentPage(1);
    curentPage === 1 && (await mutate());
  };

  return {
    data: result,
    isLoading: isLoading || isValidating,
    error: error,
    loaderRef,
    refreshData,
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
