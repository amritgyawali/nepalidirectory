import Link from "next/link";
import { paginatedDirectoryHref } from "@/lib/directory-pagination";

type DirectoryPaginationProps = {
  baseHref: string;
  currentPage: number;
  totalPages: number;
};

export function DirectoryPagination({
  baseHref,
  currentPage,
  totalPages,
}: DirectoryPaginationProps) {
  if (totalPages <= 1) return null;

  const start = Math.max(1, currentPage - 2);
  const end = Math.min(totalPages, currentPage + 2);
  const pages = Array.from({ length: end - start + 1 }, (_, index) => start + index);

  return (
    <nav className="directory-pagination" aria-label="Directory result pages">
      {currentPage > 1 ? (
        <Link href={paginatedDirectoryHref(baseHref, currentPage - 1)} rel="prev">
          Previous
        </Link>
      ) : <span aria-disabled="true">Previous</span>}
      {pages.map((page) => (
        <Link
          aria-current={page === currentPage ? "page" : undefined}
          href={paginatedDirectoryHref(baseHref, page)}
          key={page}
        >
          {page}
        </Link>
      ))}
      {currentPage < totalPages ? (
        <Link href={paginatedDirectoryHref(baseHref, currentPage + 1)} rel="next">
          Next
        </Link>
      ) : <span aria-disabled="true">Next</span>}
    </nav>
  );
}
