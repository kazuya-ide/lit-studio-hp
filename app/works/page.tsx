import WorkCard from "../components/WorkCard";
import { works } from "../lib/data";

export default function WorksPage() {
  return (
    <section className="max-w-6xl mx-auto px-4 py-32">
      <h1 className="text-4xl font-bold mb-10 text-center">Works</h1>
      <div className="grid md:grid-cols-2 gap-10">
        {works.map((work) => (
          <WorkCard key={work.slug} work={work} />
        ))}
      </div>
    </section>
  );
}
