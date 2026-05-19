import { useEffect, useState } from "react";
import { useGetClients } from "../api/useClients";

const useClientPagination = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [clients, setClients] = useState<any[]>([]);

  const { data, isLoading } = useGetClients({
    page,
    limit: 20,
    search,
  });

  useEffect(() => {
    if (!data?.data) return;

    if (page === 1) {
      setClients(data.data);
    } else {
      setClients((prev) => [...prev, ...data.data]);
    }
  }, [data]);

  useEffect(() => {
    setPage(1);
  }, [search]);

  return {
    clients,
    page,
    setPage,
    search,
    setSearch,
    isLoading,
  };
};


export default useClientPagination;