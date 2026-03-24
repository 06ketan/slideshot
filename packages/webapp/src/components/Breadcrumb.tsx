import Link from "next/link";
import { BreadcrumbSchema } from "@/components/JsonLd";

export default function Breadcrumb({
  items,
}: {
  items: { name: string; href: string }[];
}) {
  const baseUrl = "https://slideshot.chavan.in";
  const schemaItems = items.map((item) => ({
    name: item.name,
    url: item.href.startsWith("http") ? item.href : `${baseUrl}${item.href}`,
  }));

  return (
    <>
      <BreadcrumbSchema items={schemaItems} />
      <nav aria-label="Breadcrumb" className="text-xs font-medium text-[#666]">
        <ol className="flex items-center gap-1.5">
          {items.map((item, i) => (
            <li key={item.href} className="flex items-center gap-1.5">
              {i > 0 && <span className="text-[#ccc]">/</span>}
              {i === items.length - 1 ? (
                <span className="text-[#0A0A0A] font-bold">{item.name}</span>
              ) : (
                <Link
                  href={item.href}
                  className="hover:text-[#0A0A0A] transition-colors"
                >
                  {item.name}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}
