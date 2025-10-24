export type FieldType = 'Text' | 'Number' | 'Radio' | 'Checkbox' | 'Select' | 'Date' | 'Email'

export type BuilderType = 'simple_input' | 'simple_choice' | 'date_picker'

export type LayoutType = 'Normal' | 'Inline' | 'Full'

export type EnumOption = {
  label: string
  value: string | number
}

export type VisibilityCondition = {
  [fieldName: string]: string // e.g., "required|is:full"
}

export type DisplayConfig = {
  label?: string
  placeholder?: string
  description?: string
}

export type ValueConstraints = {
  maximum?: number
  minimum?: number
  allow_decimal?: 0 | 1
}

export type PrefillConfig = {
  value?: string | number | boolean
}

export type FormField = {
  name: string
  display: DisplayConfig
  rule?: string
  props?: Record<string, unknown>
  builder: {
    type: BuilderType
  }
  layout: LayoutType
  type: FieldType
  enum?: EnumOption[]
  visible?: VisibilityCondition
  value_constraints?: ValueConstraints
  prefill?: PrefillConfig
}

export type FormSchema = {
  name: string
  label: string
  items: Record<string, FormField>
}

export type FormValues = Record<string, unknown>

// Renderer types - minimal schema for rendering without sensitive metadata
export type RendererField = {
  name: string
  type: FieldType
  display: DisplayConfig
  layout: LayoutType
  enum?: EnumOption[]
  value_constraints?: ValueConstraints
  prefill?: PrefillConfig
  props?: Record<string, unknown>
  // Note: builder, visible, and rule are intentionally excluded
}

export type RendererSchema = {
  name: string
  label: string
  items: Record<string, RendererField>
}

