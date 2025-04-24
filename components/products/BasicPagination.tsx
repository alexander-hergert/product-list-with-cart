"use client";
import * as React from "react";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import { useRouter, usePathname } from "next/navigation";

type SearchParams = {
  productName?: string;
  productCategory?: string;
  minPrice?: string;
  maxPrice?: string;
  page?: number;
  order?: string;
};

export default function BasicPagination({
  searchParams,
  total,
  productName,
  productCategory,
  minPrice,
  maxPrice,
}: {
  searchParams: SearchParams;
  total: number;
  productName?: string | "";
  productCategory?: string | "";
  minPrice?: string | "";
  maxPrice?: string | "";
}) {
  const pageSize = 9;
  const totalPages = Math.ceil(total / pageSize);
  const router = useRouter();
  const page = searchParams.page ? Number(searchParams.page) : 1;

  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    const query = `?productName=${
      productName ? productName : ""
    }&productCategory=${productCategory ? productCategory : ""}&minPrice=${
      minPrice ? minPrice : ""
    }&maxPrice=${maxPrice ? maxPrice : ""}&page=${value ? value : 1}`;
    router.push(query);
  };

  return (
    <div className="flex items-center justify-center my-4">
      <Stack spacing={2}>
        <Pagination
          size="large"
          count={totalPages}
          page={page}
          color="primary"
          onChange={handleChange}
        />
      </Stack>
    </div>
  );
}
