import { Sidebar } from "@/components/ui/SideBar";
import { AddCategoryForm } from "@/features/budgets/AddCategoryForm";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { addExpenseSchema } from "@/formSchemas/allFormSchemas";
import {
  budgetsLogo,
  sidebarItems,
  sideBarClass,
} from "@/components/config/sidebarConfig";
import { Card } from "@/components/ui/Card";
import { useState } from "react";

export const Budgets = () => {
  const form = useForm({
    resolver: zodResolver(addExpenseSchema),
    defaultValues: {
      type: "",
      name: "",
      limit: "",
    },
  });

  // Local state to store categories (example)
  const [categories, setCategories] = useState([]);

  // Handle form submission
  const onSubmit = (data) => {
    console.log("Form submitted:", data);
    // to be replaced with API call
    setCategories((prev) => [...prev, data]);

    form.reset();
  };

  return (
    <main className="flex flex-row min-h-screen">
      <Sidebar
        logo={budgetsLogo}
        items={sidebarItems}
        className={sideBarClass}
      />
      <Card className="m-4 p-4 flex-1 bg-gray-300 rounded-lg">
        <h2 className="text-2xl font-bold mb-6">Budget Categories</h2>

        {/* Container for form + category list */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Left side: Add Category Form */}
          <div className="flex-1 bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Add New Category</h3>
            <AddCategoryForm
              formType="add"
              form={form}
              onSubmit={onSubmit}
              isLoading={false}
              className="space-y-4"
            />
          </div>

          {/* Right side: Existing Categories */}
          <div className="flex-1 bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Existing Categories</h3>
            {categories.length === 0 ? (
              <p className="text-gray-500">No categories yet.</p>
            ) : (
              <ul className="space-y-2">
                {categories.map((cat, index) => (
                  <li
                    key={index}
                    className="border p-2 rounded-md flex justify-between"
                  >
                    <span>
                      <strong>{cat.type}:</strong> {cat.name}
                    </span>
                    <span>${parseFloat(cat.limit).toFixed(2)}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </Card>
    </main>
  );
};
