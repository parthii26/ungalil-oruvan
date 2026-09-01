import { deleteCertificationAction, saveCertificationAction, saveNutritionAction } from "@/lib/actions/admin";
import type { ProductCertification, ProductNutrition } from "@/lib/db/types";

export function ExtraPanel({
  productId,
  nutrition,
  certs,
}: {
  productId: string;
  nutrition: ProductNutrition | null;
  certs: ProductCertification[];
}) {
  return (
    <section className="mt-16 grid md:grid-cols-2 gap-10">
      <div>
        <h2 className="text-lg font-semibold">Nutrition</h2>
        <form action={saveNutritionAction.bind(null, productId)} className="mt-4 space-y-2 max-w-sm">
          <input name="serving" className="input" placeholder="Serving" defaultValue={nutrition?.serving ?? ""} />
          <input name="energy_kcal" className="input" placeholder="Calories (kcal)" defaultValue={nutrition?.energy_kcal ?? ""} />
          <input name="protein_g" className="input" placeholder="Protein g" defaultValue={nutrition?.protein_g ?? ""} />
          <input name="carbohydrates_g" className="input" placeholder="Carbs g" defaultValue={nutrition?.carbohydrates_g ?? ""} />
          <input name="fat_g" className="input" placeholder="Fat g" defaultValue={nutrition?.fat_g ?? ""} />
          <input name="fiber_g" className="input" placeholder="Fiber g" defaultValue={nutrition?.fiber_g ?? ""} />
          <input name="sugar_g" className="input" placeholder="Sugar g" defaultValue={nutrition?.sugar_g ?? ""} />
          <button className="btn btn-primary">Save nutrition</button>
        </form>
      </div>
      <div>
        <h2 className="text-lg font-semibold">Certifications</h2>
        <ul className="mt-3 text-sm space-y-2">
          {certs.map((c) => (
            <li key={c.id} className="flex justify-between gap-2 border-b border-line pb-2">
              <span>
                {c.name} {c.number}
                {c.valid_until ? ` · until ${c.valid_until}` : ""}
                {c.document_path ? " · document stored privately" : ""}
              </span>
              <form action={deleteCertificationAction.bind(null, c.id, productId)}>
                <button className="text-xs uppercase tracking-widest">Delete</button>
              </form>
            </li>
          ))}
        </ul>
        <form action={saveCertificationAction.bind(null, productId)} className="mt-4 space-y-2">
          <input name="name" className="input" placeholder="Certification name" required />
          <input name="number" className="input" placeholder="Number" />
          <input name="valid_from" type="date" className="input" />
          <input name="valid_until" type="date" className="input" />
          <input name="document" type="file" className="input" />
          <button className="btn btn-primary">Add certification</button>
        </form>
      </div>
    </section>
  );
}
