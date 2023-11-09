# TypeORM Eager and Lazy Loading Setup Instructions

## Eager Loading

To enable eager loading in your TypeORM entities:

1. Define your relations with `eager: true`. Here's an example:
   ```typescript
   @ManyToMany(type => Category, category => category.questions, {
     eager: true,
   })
   @JoinTable()
   categories: Category[]
   ```
2. When using `find*` methods, eager relations are loaded automatically.
3. Note that eager relations are not supported when using the `QueryBuilder`. You must use `leftJoinAndSelect` instead.
4. Eager loading cannot be used on both sides of a bi-directional relationship.

## Lazy Loading

For lazy loading relations:

1. Define your relations with a `Promise` return type, indicating a lazy relation:
   ```typescript
   @ManyToMany(type => Question, question => question.categories)
   questions: Promise<Question[]>
   ```
2. To save a lazy relation, you should assign a Promise to the relation:
   ```typescript
   question.categories = Promise.resolve([category1, category2]);
   ```
3. To load lazy relations, await the property:
   ```typescript
   const categories = await question.categories;
   ```
