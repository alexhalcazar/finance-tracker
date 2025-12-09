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
export function AddBudgetForm({
  formType,
  form,
  onSubmit,
  isLoading,
  className = "",
}) {
  const buttonCta = "Add";

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = form;

  return (
    <form className={className} onSubmit={handleSubmit(onSubmit)}>
      <div className="pt-4 space-y-2">
        <Label htmlFor="name">Name</Label>
        <input
          type="text"
          id="name"
          className="w-full border rounded-md p-2"
          {...register("name")}
        />
        <p className={cn([errors.name?.message && "text-error"])}>
          {errors.name?.message}
        </p>
      </div>

      <div className="pt-4 space-y-2">
        <Label htmlFor="start_date">Start Date</Label>
        <input
          type="date"
          id="start_date"
          className="w-full border rounded-md p-2"
          {...register("start_date")}
        />
        <p className={cn([errors.start?.message && "text-error"])}>
          {errors.start?.message}
        </p>
      </div>

      <div className="pt-4 space-y-2">
        <Label htmlFor="end_date">End Date</Label>
        <input
          type="date"
          id="end_date"
          className="w-full border rounded-md p-2"
          {...register("end_date")}
          min={watch("start_date") || ""}
        />
        <p className={cn([errors.end_date?.message && "text-error"])}>
          {errors.end_date?.message}
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="currency">Currency</Label>
        <Input
          type="number"
          placeholder="0.00"
          step="0.01"
          min="0"
          id="currency"
          {...register("currency")}
        />
        <p className={cn([errors.currency?.message && "text-error"])}>
          {errors.currency?.message}
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
