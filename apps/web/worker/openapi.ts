export const openApiSpec = {
  openapi: "3.1.0",
  info: {
    title: "Recurse Party Button API",
    version: "1.0.0",
    description: "Toggle and check party mode.",
  },
  paths: {
    "/api/v1/party": {
      get: {
        summary: "Get party mode",
        description: "Returns whether party mode is currently on or off. Public.",
        responses: {
          "200": {
            description: "Current party state",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/PartyState" },
              },
            },
          },
        },
      },
      post: {
        summary: "Toggle party mode",
        description:
          "Toggles party mode on/off. Requires the party key as a bearer token.",
        security: [{ bearerAuth: [] }],
        responses: {
          "200": {
            description: "New party state after toggling",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/PartyState" },
              },
            },
          },
          "401": {
            description: "Missing or invalid party key",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: { error: { type: "string" } },
                  required: ["error"],
                },
              },
            },
          },
        },
      },
    },
  },
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        description: "The party key (PARTY_KEY environment variable)",
      },
    },
    schemas: {
      PartyState: {
        type: "object",
        properties: {
          party: { type: "boolean", description: "Whether party mode is on" },
          updatedAt: {
            type: ["string", "null"],
            format: "date-time",
            description: "When party mode was last toggled",
          },
        },
        required: ["party", "updatedAt"],
      },
    },
  },
} as const;
