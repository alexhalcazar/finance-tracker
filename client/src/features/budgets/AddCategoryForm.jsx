import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/utils/cn";

/**
 *
 * @prop {formType} identifies the type of form
 * @prop {form} passes the react hook form object to handle submission and validation
 * @prop {onSubmit} passes the function on what the form will submit to the submit button
 * @prop {isLoading} checks if the form is currently in a loading state
 * @prop {className} optional className to style parent auth form component
 */
export function AddCategoryForm({
  formType,
  form,
  onSubmit,
  isLoading,
  className = "",
  budgets,
}) {
  //  Make text be register when passed in register, otherwise it is sign in
  // const buttonCta = formType === "register" ? "Register" : "Sign In";

  const buttonCta = "Add";

  //  Grab the parent form object passed from parent component, destructure their properties
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = form;

  const selectedType = watch("type");
  const selectedBudget = watch("budget_id");

  const nameOptions = {
    Income: ["Income1", "Income2", "Income3"],
    Expense: [
      "Rent",
      "Bills",
      "Food",
      "Transportation",
      "Tuition",
      "Spending",
      "Savings",
    ],
  };

  const currentNameList = nameOptions[selectedType] || [];

  return (
    <form className={className} onSubmit={handleSubmit(onSubmit)}>
      <div className="pt-4 space-y-2">
        <Label htmlFor="Budget">Budget</Label>
        <select
          id="budget_id"
          className="w-full border rounded-md p-2"
          {...register("budget_id")}
        >
          <option value="">Select a Budget</option>
          {budgets.map((item) => (
            <option key={item.budget_id} value={item.budget_id}>
              {item.name}
            </option>
          ))}
        </select>
        <p className={cn([errors.budget_id?.message && "text-error"])}>
          {errors.budget_id?.message}
        </p>
      </div>

      <div className="pt-4 space-y-2">
        <Label htmlFor="type">Type</Label>
        <select
          id="type"
          className="w-full border rounded-md p-2"
          {...register("type")}
          disabled={!selectedBudget}
        >
          <option value="">Select a type</option>
          <option value="Income">Income</option>
          <option value="Expense">Expense</option>
        </select>
        <p className={cn([errors.type?.message && "text-error"])}>
          {errors.type?.message}
        </p>
      </div>

      <div className="pt-4 space-y-2">
        <Label htmlFor="name">Name</Label>
        <select
          id="name"
          className="w-full border rounded-md p-2"
          {...register("name")}
          disabled={!selectedType} // disable until type selected
        >
          <option value="">
            {selectedType ? "Select a name" : "Select a type first"}
          </option>
          {currentNameList.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
        <p className={cn([errors.type?.message && "text-error"])}>
          {errors.type?.message}
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="limit">Limit</Label>
        <Input
          type="number"
          placeholder="0.00"
          step="0.01"
          min="0"
          id="limit"
          {...register("limit")}
        />
        <p className={cn([errors.limit?.message && "text-error"])}>
          {errors.limit?.message}
        </p>
      </div>

      <div className="pt-4 space-y-2">
        <Label htmlFor="color">Color</Label>
        <select
          id="color"
          className="w-full border rounded-md p-2"
          {...register("color")}
          disabled={!selectedBudget}
        >
          <option value="">Select a Color</option>
          <option value="Green">Green</option>
          <option value="Red">Red</option>
        </select>
        <p className={cn([errors.color?.message && "text-error"])}>
          {errors.color?.message}
        </p>
      </div>

      <div className="mt-6">
        <Button variant="primary" type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : buttonCta}
        </Button>
      </div>
    </form>
  );
}
