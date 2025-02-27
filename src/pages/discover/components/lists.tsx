import { DescriptiveSkeletonCard } from "@/components/cards/descriptive-card";
import { useShowDescriptiveGrid } from "@/hooks/use-show-descriptive-grid";
import { cn } from "@/lib/utils";
import SkeletonCard from "@/components/cards/skeleton-card";

export function List<T extends { id: number }>({
  items,
  render,
}: {
  items: T[];
  render: (item: T) => React.ReactNode;
}) {
  const { showDescriptiveGrid } = useShowDescriptiveGrid();
  console.log("List", showDescriptiveGrid);
  return (
    <ul
      className={cn("grid gap-x-4 p-1 gap-y-12 w-full", {
        "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-y-8":
          !showDescriptiveGrid,
      })}
    >
      {items.map((item, index) => (
        <li key={item.id + index}>{render(item)}</li>
      ))}
    </ul>
  );
}

export function SkeletonList() {
  const { showDescriptiveGrid } = useShowDescriptiveGrid();

  return (
    <ul
      className={cn("grid gap-x-4 p-1 gap-y-8 w-full", {
        "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4": !showDescriptiveGrid,
      })}
    >
      {[...Array(20)].map((_, index) =>
        showDescriptiveGrid ? (
          <DescriptiveSkeletonCard key={index} />
        ) : (
          <SkeletonCard key={index} />
        )
      )}
    </ul>
  );
}
