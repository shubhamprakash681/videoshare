import { useEffect, useState } from "react";
import useSWR, { SWRConfiguration } from "swr";
import { useToast } from "./use-toast";
import { AggregatedResponse, APIResponse } from "@/types/APIResponse";
import { AxiosAPIInstance } from "@/lib/AxiosInstance";
import { AxiosError } from "axios";

interface UseManualFetchResult<T> {
  data: AggregatedResponse<T>;
  isLoading: boolean;
  error: Error | undefined;
  refreshData: () => Promise<void>;
  onLoadMoreClick: () => void;
}

const useManualFetch = <T>(
  url: string,
  page: number = 1,
  limit: number = 10,
  options: SWRConfiguration = {}
): UseManualFetchResult<T> => {
  const [curentPage, setCurrentPage] = useState<number>(page);

  const { toast } = useToast();

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
          title:
            error.response?.data.message || "Failed to change subscription",
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

  const refreshData = async () => {
    setCurrentPage(1);
    curentPage === 1 && (await mutate());
  };

  const onLoadMoreClick = () => {
    setCurrentPage(curentPage + 1);
  };

  return {
    data: result,
    isLoading: isLoading || isValidating,
    error: error,
    refreshData,
    onLoadMoreClick,
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

export default useManualFetch;
