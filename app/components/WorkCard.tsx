import Link from "next/link";

export default function WorkCard({ work }: any) {
  return (
    <Link href={`/works/${work.slug}`} className="block group">
      <div className="overflow-hidden rounded-lg border border-gray-700">
        <img
          src={work.image}
          alt={work.title}
          className="w-full h-64 object-cover transition-transform duration-700 group-hover:scale-110"
        />
      </div>
      <h3 className="mt-4 text-xl font-semibold group-hover:text-blue-400 transition-colors">
        {work.title}
      </h3>
      <p className="text-gray-400 text-sm">{work.description}</p>
    </Link>
  );
}
