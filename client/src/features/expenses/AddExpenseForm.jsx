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
export function AddExpenseForm({
  formType,
  form,
  onSubmit,
  isLoading,
  className = "",
}) {
  //  Make text be register when passed in register, otherwise it is sign in
  // const buttonCta = formType === "register" ? "Register" : "Sign In";

  const buttonCta = "Add";

  //  Grab the parent form object passed from parent component, destructure their properties
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  return (
    <form className={className} onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-2">
        <Label htmlFor="amount">Amount</Label>
        <Input
          type="number"
          placeholder="0.00"
          step="0.01"
          min="0"
          id="amount"
          {...register("amount")}
        />
        <p className={cn([errors.amount?.message && "text-error"])}>
          {errors.amount?.message}
        </p>
      </div>

      <div className="pt-4 space-y-2">
        <Label htmlFor="category">Category</Label>
        <select
          id="category"
          className="w-full border rounded-md p-2"
          {...register("category")}
        >
          <option value="">Select a category</option>
          <option value="Rent">Rent</option>
          <option value="Bills">Bills</option>
          <option value="Food">Food</option>
          <option value="Transportation">Transportation</option>
          <option value="Tuition">Tuition</option>
          <option value="Spending">Spending</option>
          <option value="Savings">Savings</option>
        </select>
        <p className={cn([errors.category?.message && "text-error"])}>
          {errors.category?.message}
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Input
          type="text"
          placeholder="Enter Description"
          id="description"
          {...register("description")}
        />
        <p className={cn([errors.description?.message && "text-error"])}>
          {errors.description?.message}
        </p>
      </div>

      <div className="pt-4 space-y-2">
        <Label htmlFor="transactionDate">Transaction Date</Label>
        <Input
          type="date"
          id="transactionDate"
          {...register("transactionDate")}
        />
        <p className={cn([errors.transactionDate?.message && "text-error"])}>
          {errors.transactionDate?.message}
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
