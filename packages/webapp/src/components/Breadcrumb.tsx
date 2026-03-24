import Link from "next/link";
import { BreadcrumbSchema } from "@/components/JsonLd";

export default function Breadcrumb({
  items,
  dark,
}: {
  items: { name: string; href: string }[];
  dark?: boolean;
}) {
  const baseUrl = "https://slideshot.chavan.in";
  const schemaItems = items.map((item) => ({
    name: item.name,
    url: item.href.startsWith("http") ? item.href : `${baseUrl}${item.href}`,
  }));

  return (
    <>
      <BreadcrumbSchema items={schemaItems} />
      <nav aria-label="Breadcrumb" className={`text-xs font-medium ${dark ? "text-white/50" : "text-[#666]"}`}>
        <ol className="flex items-center gap-1.5">
          {items.map((item, i) => (
            <li key={item.href} className="flex items-center gap-1.5">
              {i > 0 && <span className={dark ? "text-white/30" : "text-[#E5E3DE]"}>/</span>}
              {i === items.length - 1 ? (
                <span className={`font-bold ${dark ? "text-white" : "text-[#0A0A0A]"}`}>{item.name}</span>
              ) : (
                <Link
                  href={item.href}
                  className={`transition-colors duration-150 ${dark ? "hover:text-white" : "hover:text-[#0A0A0A]"}`}
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
