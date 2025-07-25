import {
  createServer,
  Model,
} from "https://cdn.jsdelivr.net/npm/miragejs@0.1.48/+esm";

export default function pantryAPIs() {
  // Create a Mirage server

  createServer({
    models: {
      item: Model,
    },

    seeds(server) {
      server.create("item", {
        id: 1,
        name: "Rice",
        category: "Grains",
        quantity: 5, // in kg
        unit: "kg", // could be "packs", "ltr", etc.
        expiration: "2025-09-30", // YYYY-MM-DD
      });
      server.create("item", {
        id: 2,
        name: "Coffee Beans",
        category: "Beverages",
        quantity: 1,
        unit: "kg",
        expiration: "2026-01-15",
      });

      server.create("item", {
        id: 3,
        name: "Olive Oil",
        category: "Oils",
        quantity: 4,
        unit: "ltr",
        expiration: "2025-12-01",
      });

      server.create("item", {
        id: 4,
        name: "Pasta",
        category: "Grains",
        quantity: 3,
        unit: "packs",
        expiration: "2025-08-20",
      });

      server.create("item", {
        id: 5,
        name: "Biscuit",
        category: "Snacks",
        quantity: 0,
        unit: "packs",
        expiration: "2026-06-10",
      });

      server.create("item", {
        id: 6,
        name: "Chickpeas",
        category: "Legumes",
        quantity: 2,
        unit: "kg",
        expiration: "2025-11-10",
      });
      server.create("item", {
        id: 7,
        name: "Coconut Oil",
        category: "Oils",
        quantity: 8,
        unit: "ltr",
        expiration: "2026-11-09",
      });
    },

    routes() {
      this.namespace = "/api";

      // List items with optional filtering & sorting
      this.get("/items", (schema, request) => {
        let items = schema.items.all().models;

        // Filtering
        const { filter } = request.queryParams;
        console.log("server", filter);
        if (filter === "out") {
          items = items.filter((i) => i.quantity === 0);
        } else if (filter === "low") {
          items = items.filter((i) => i.quantity > 0 && i.quantity < 5);
        }

        const { filterByCategory } = request.queryParams;
        if (filterByCategory) {
          items = items.filter((i) => i.category === filterByCategory);
        }

        // Sorting
        const { sortBy, sortDir } = request.queryParams;
        if (sortBy === "quantity") {
          items = items.sort((a, b) =>
            sortDir === "desc"
              ? b.quantity - a.quantity
              : a.quantity - b.quantity
          );
        } else if (sortBy === "name") {
          items = items.sort((a, b) =>
            sortDir === "desc"
              ? b.name.localeCompare(a.name)
              : a.name.localeCompare(b.name)
          );
        }

        return { items };
      });

      // Get a single item
      this.get("/items/:id", (schema, request) => {
        return schema.items.find(request.params.id);
      });

      // Create a new item
      this.post("/items", (schema, request) => {
        const attrs = JSON.parse(request.requestBody);
        return schema.items.create(attrs);
      });

      // Update an existing item
      this.put("/items/:id", (schema, request) => {
        const id = request.params.id;
        const attrs = JSON.parse(request.requestBody);
        return schema.items.find(id).update(attrs);
      });

      // Delete an item
      this.delete("/items/:id", (schema, request) => {
        return schema.items.find(request.params.id).destroy();
      });
    },
  });
}
