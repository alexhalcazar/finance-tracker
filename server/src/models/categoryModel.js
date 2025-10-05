import db from "#db";

class Category {
  constructor(tableName) {
    if (!tableName) {
      throw new Error("The table name must be defined for this model.");
    }
    this.tableName = tableName;
  }

  // find all categories in the databse by optional budget id
  async findAll(budget_id) {
    if (budget_id) {
      return await db(this.tableName).where({ budget_id }).select("*");
    }

    return await db(this.tableName).select("*");
  }

  // find category by passed in budget id and category type
  async findByType(budget_id, type) {
    return await db(this.tableName).where({ budget_id, type }).first();
  }

  // find one category by the passed in ID
  async findById(category_id) {
    return await db(this.tableName).where({ category_id }).first();
  }

  // insert new category by passed in category data
  async insert(categoryData) {
    const [newCategory] = await db(this.tableName)
      .insert(categoryData)
      .returning("*");

    return newCategory;
  }

  // update a category by passed in category id and the associated updates
  async update(category_id, updates) {
    const [updatedCategory] = await db(this.tableName)
      .where({ category_id })
      .update(updates)
      .returning("*");

    return updatedCategory;
  }

  // delete a category row by passed in category id
  async delete(category_id) {
    const [deleteCategory] = await db(this.tableName)
      .where({ category_id })
      .del()
      .returning("*");
    return deleteCategory;
  }
}

// export the instance of the category model class to be used in other places
const tableName = "categories";
const category = new Category(tableName);
export default category;
