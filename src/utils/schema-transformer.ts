import type { FormSchema, RendererSchema, RendererField } from '@/types/form-schema'

/**
 * Transforms a full FormSchema into a minimal RendererSchema
 * 
 * This function strips out sensitive metadata that should not be exposed
 * in the client-side rendered form, including:
 * - builder configuration (internal use only)
 * - visible conditions (evaluated separately in protected validation)
 * - validation rules (handled by protected validation layer)
 * 
 * Only keeps data necessary for UI rendering:
 * - Field names, types, and labels
 * - Display properties (label, placeholder, description)
 * - Options for choice fields (enum)
 * - Value constraints needed for UI (min, max, decimal control)
 * - Prefill values
 * - Layout information
 * 
 * @param fullSchema - The complete form schema from the builder
 * @returns A minimal schema safe for client-side exposure
 */
export function transformSchemaForRenderer(fullSchema: FormSchema): RendererSchema {
  const transformedItems: Record<string, RendererField> = {}

  for (const [fieldName, field] of Object.entries(fullSchema.items)) {
    // Create minimal field with only rendering essentials
    const rendererField: RendererField = {
      name: field.name,
      type: field.type,
      display: field.display,
      layout: field.layout,
    }

    // Include enum options for choice fields (user sees these anyway)
    if (field.enum) {
      rendererField.enum = field.enum
    }

    // Include value constraints needed for UI rendering
    if (field.value_constraints) {
      rendererField.value_constraints = field.value_constraints
    }

    // Include prefill values for default field values
    if (field.prefill) {
      rendererField.prefill = field.prefill
    }

    // Include props if present (e.g., maxlength for input fields)
    if (field.props) {
      rendererField.props = field.props
    }

    // Explicitly NOT including:
    // - builder: Internal configuration
    // - visible: Conditional logic (handled in protected validation)
    // - rule: Validation rules (handled in protected validation)

    transformedItems[fieldName] = rendererField
  }

  return {
    name: fullSchema.name,
    label: fullSchema.label,
    items: transformedItems,
  }
}

/**
 * Creates a validation context that keeps the full schema protected
 * This is used internally by the protected validation composable
 * to access sensitive metadata without exposing it to the component layer
 */
export function createProtectedValidationContext(fullSchema: FormSchema) {
  // Return an object that encapsulates the full schema
  // but doesn't expose it directly
  const visibilityRules = new Map<string, FormSchema['items'][string]['visible']>()
  const validationRules = new Map<string, string>()

  for (const [fieldName, field] of Object.entries(fullSchema.items)) {
    if (field.visible) {
      visibilityRules.set(fieldName, field.visible)
    }
    if (field.rule) {
      validationRules.set(fieldName, field.rule)
    }
  }

  return {
    getVisibilityRule: (fieldName: string) => visibilityRules.get(fieldName),
    getValidationRule: (fieldName: string) => validationRules.get(fieldName),
    hasField: (fieldName: string) => fieldName in fullSchema.items,
    getField: (fieldName: string) => fullSchema.items[fieldName],
  }
}

