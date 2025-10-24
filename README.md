# UpPass Form Builder

A powerful, modern form builder and renderer built with Vue 3, TypeScript, and Tailwind CSS. This application allows you to visually build dynamic forms with a drag-and-drop interface and render them with full validation support.

---

## 🎨 Design Approach

### Architecture Overview

The application follows a **component-based architecture** with clear separation of concerns:

```
┌─────────────────────────────────────────────────────┐
│                   Application Layer                  │
│            (Views: BuilderView, FormView)            │
└─────────────────┬───────────────────────────────────┘
                  │
    ┌─────────────┴──────────────┐
    │                            │
┌───▼────────────────┐   ┌──────▼─────────────────┐
│   FormBuilder      │   │    FormRenderer        │
│   Component        │   │    Component           │
└────────────────────┘   └────────────────────────┘
    │                            │
    │                            │
┌───▼────────────────────────────▼────────────────┐
│          Pinia State Management Store            │
│         (form-builder.ts)                        │
└──────────────────────────────────────────────────┘
```

### Core Design Principles

1. **Single Source of Truth**: All form schema and state is managed centrally in a Pinia store, ensuring consistency across builder and renderer views.

2. **Composable Architecture**: Reusable logic is extracted into composables:
   - `useDragAndDrop` - Handles drag-and-drop field reordering
   - `useFormValidation` - Manages conditional visibility and custom validation
   - `useZodValidation` - Provides type-safe schema validation

3. **Reactive Design**: Built on Vue 3's Composition API for optimal reactivity and performance. All changes to the form schema immediately reflect in the preview and renderer.

4. **Schema-Driven**: Forms are represented as JSON schemas that can be:
   - Created visually in the builder
   - Exported for storage/sharing
   - Imported for editing
   - Rendered dynamically

### User Experience Design

**Builder Interface** (Three-Panel Layout):
- **Left Panel**: Field type palette for adding new fields
- **Center Panel**: Form preview with drag-and-drop reordering
- **Right Panel**: Field configuration with contextual properties

**Form Renderer**:
- Clean, accessible form layout
- Real-time validation feedback
- Conditional field visibility based on user input
- Mobile-responsive design

### Component Structure

Components are organized by responsibility:

```
components/
├── builder/                 # Builder-specific components
│   ├── FieldConfigPanel.vue  # Field property editor
│   └── FieldListItem.vue      # Draggable field list item
├── form-fields/             # Reusable field components
│   ├── TextField.vue          # Text/Email input fields
│   ├── NumberField.vue        # Numeric input with constraints
│   ├── RadioField.vue         # Radio button groups
│   ├── CheckboxField.vue      # Checkbox groups
│   └── SelectField.vue        # Multi Select
├── FormBuilder.vue          # Main builder orchestrator
└── FormRenderer.vue         # Dynamic form renderer
```

---

## 🔧 Key Technical Decisions

### 1. Framework Choice: Vue 3 with Composition API

**Why Vue 3?**
- Excellent reactivity system for building dynamic UIs
- Composition API provides better code organization and reusability
- `<script setup>` syntax reduces boilerplate
- Strong TypeScript support

**Alternative Considered**: React with hooks - Vue 3's Composition API provides similar benefits with less ecosystem fragmentation.

### 2. State Management: Pinia

**Why Pinia?**
- Official Vue state management solution
- Excellent TypeScript inference out of the box
- Simpler API than Vuex (no mutations, just actions)
- DevTools integration for debugging
- Modular and composable store design

The store manages:
```typescript
{
  schema: FormSchema          // The form structure
  formValues: FormValues      // Current form data
  selectedFieldName: string   // Currently editing field
  fieldOrder: string[]        // Field display order
}
```

### 3. Validation Strategy: Dual-Layer Approach

**Layer 1: Custom Validation (`useFormValidation`)**
- Handles business logic like conditional field visibility
- Implements custom validation rules (required, min/max length)
- Lightweight and tailored to our schema format

**Layer 2: Zod (`useZodValidation`)**
- Provides runtime type safety
- Generates validation schemas from form schema
- Catches type mismatches and constraint violations
- Produces detailed, user-friendly error messages

**Why both?** Custom validation gives us flexibility for domain-specific rules, while Zod ensures type safety and handles complex validation scenarios.

### 4. Styling: Tailwind CSS v4

**Why Tailwind?**
- Utility-first approach speeds up development
- Consistent design system without custom CSS
- Tree-shaking eliminates unused styles
- Excellent responsive design utilities
- v4 Vite plugin for optimal performance

**Design System**:
- Primary color: Blue for actions and selections
- Semantic colors: Green (success), Red (errors), Gray (neutral)
- Spacing: Consistent 4px base unit
- Typography: Clear hierarchy with size and weight

### 5. Build Tooling: Rolldown (Vite fork)

**Why Rolldown?**
```json
"vite": "npm:rolldown-vite@7.1.14"
```
- **10-20x faster** than traditional Vite builds
- Rust-powered bundler for superior performance
- Compatible with Vite ecosystem and plugins
- Better for development iteration speed

**Alternative Considered**: Standard Vite - Rolldown provides the same API with significant performance improvements.

### 6. Linting: Oxlint

**Why Oxlint?**
- Written in Rust, **50-100x faster** than ESLint
- Vue plugin for single-file component support
- Import sorting and organization
- Runs in CI without slowing down builds

```bash
oxlint --vue-plugin --import-plugin
```

### 7. Drag and Drop: Native HTML5 API

**Why Native?**
- No external dependencies (reduces bundle size)
- Browser-native performance
- Accessible by default
- Simple implementation for our use case

**Alternative Considered**: VueDraggable - Would add unnecessary complexity for basic reordering.

### 8. Routing: @kitbag/router

**Why @kitbag/router?**
- Modern, type-safe Vue router alternative
- Smaller bundle size than Vue Router
- Better TypeScript support
- Simpler API for straightforward routing needs

**Routes**:
- `/` - Form builder interface
- `/form` - Standalone form view/testing

### 9. TypeScript: Strict Mode

**Configuration**:
```json
{
  "strict": true,
  "noImplicitAny": true,
  "strictNullChecks": true
}
```

**Benefits**:
- Catches errors at compile time
- Better IDE autocomplete
- Self-documenting code
- Safer refactoring

All types are centralized in `types/form-schema.ts` for consistency.

### 10. Package Manager: Bun

**Why Bun?**
- **3-5x faster** than npm/yarn/pnpm
- Built-in TypeScript execution
- Compatible with Node.js ecosystem
- All-in-one runtime, bundler, and package manager

---

## 🚀 How to Run Your Project

### Prerequisites

Before you begin, ensure you have one of the following installed:

- **Bun** (recommended): Version 1.0+ - [Install Bun](https://bun.sh)
- **Node.js**: Version 18+ with npm/yarn/pnpm

### Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd uppass-form-builder
   ```

2. **Install dependencies**:
   
   Using Bun (recommended):
   ```bash
   bun install
   ```
   
   Or using npm:
   ```bash
   npm install
   ```

### Development

Start the development server:

```bash
bun run dev
```

Or with npm:
```bash
npm run dev
```

The application will be available at **http://localhost:5173**

**Features in development mode**:
- Hot Module Replacement (HMR) for instant updates
- Source maps for debugging
- Vue DevTools support
- Fast refresh on file changes

### Building for Production

1. **Run the build**:
   ```bash
   bun run build
   ```
   
   This command will:
   - Run linter checks (`oxlint`)
   - Run TypeScript type checking (`vue-tsc`)
   - Build optimized production bundle
   - Output to `dist/` directory

2. **Preview the production build**:
   ```bash
   bun run preview
   ```
   
   Opens production build at **http://localhost:4173**

### Available Scripts

| Command | Description |
|---------|-------------|
| `bun run dev` | Start development server with HMR |
| `bun run build` | Build optimized production bundle |
| `bun run preview` | Preview production build locally |
| `bun run lint` | Run linter (oxlint) on codebase |
| `bun run lint:fix` | Auto-fix linting issues |
| `bun run lint:check` | Check for linting errors (CI mode) |
| `bun run type-check` | Run TypeScript compiler without emitting files |

### Project Structure

```
uppass-form-builder/
├── src/
│   ├── components/           # Vue components
│   │   ├── builder/         # Form builder UI components
│   │   ├── form-fields/     # Reusable field components
│   │   ├── FormBuilder.vue  # Main builder interface
│   │   └── FormRenderer.vue # Dynamic form renderer
│   ├── composables/         # Reusable composition functions
│   │   ├── useDragAndDrop.ts
│   │   ├── useFormValidation.ts
│   │   └── useZodValidation.ts
│   ├── stores/              # Pinia state management
│   │   └── form-builder.ts
│   ├── types/               # TypeScript type definitions
│   │   └── form-schema.ts
│   ├── views/               # Route-level components
│   │   ├── BuilderView.vue
│   │   └── FormView.vue
│   ├── router/              # Application routing
│   │   └── index.ts
│   ├── App.vue             # Root component
│   ├── main.ts             # Application entry point
│   └── style.css           # Global styles & Tailwind imports
├── public/                  # Static assets
├── dist/                    # Production build output
├── package.json            # Dependencies and scripts
├── tsconfig.json           # TypeScript configuration
├── vite.config.ts          # Vite/Rolldown build config
└── .oxlintrc.json          # Linter configuration
```

### Environment Variables

Currently, the application doesn't require environment variables. If you need to add any:

1. Create `.env` file in the project root
2. Add variables with `VITE_` prefix:
   ```
   VITE_API_URL=https://api.example.com
   ```
3. Access in code:
   ```typescript
   const apiUrl = import.meta.env.VITE_API_URL
   ```

### Troubleshooting

**Port already in use**:
```bash
# Kill process on port 5173
lsof -ti:5173 | xargs kill -9
```

**Dependencies issues**:
```bash
# Clear cache and reinstall
rm -rf node_modules bun.lockb
bun install
```

**TypeScript errors**:
```bash
# Run type checker to see detailed errors
bun run type-check
```

**Build failures**:
```bash
# Check linting first
bun run lint

# Then check types
bun run type-check
```

---

## 📖 Features

### Form Builder

- **Visual Form Designer**: Intuitive drag-and-drop interface to create forms
- **Multiple Field Types**: Text, Email, Number, Radio, Checkbox, Select
- **Field Configuration**:
  - Custom labels and placeholders
  - Required/optional fields
  - Min/max length for text fields
  - Min/max values for number fields
  - Decimal control for numbers
  - Dynamic options for choice fields
- **Drag and Drop Reordering**: Easily reorder fields by dragging
- **Real-time Preview**: See your form as you build it
- **Import/Export**: Save and load form schemas as JSON

### Form Renderer

- **Dynamic Rendering**: Automatically renders forms from JSON schema
- **Conditional Visibility**: Show/hide fields based on other field values
- **Smart Validation**: 
  - Built-in validation with Zod
  - Real-time field validation
  - Required field checking
  - Type-specific validation (email, number constraints, etc.)
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Accessible**: Semantic HTML with proper ARIA labels

### Form Schema Format

The form schema follows this structure:

```typescript
{
  "name": "step",
  "label": "Form Title",
  "items": {
    "field_name": {
      "name": "field_name",
      "display": {
        "label": "Field Label",
        "placeholder": "Placeholder text",
        "description": "Help text"
      },
      "type": "Text" | "Number" | "Email" | "Radio" | "Checkbox",
      "rule": "required",
      "builder": {
        "type": "simple_input" | "simple_choice"
      },
      "layout": "Normal",
      "enum": [                    // For choice fields
        { "label": "Option 1", "value": "opt1" }
      ],
      "value_constraints": {       // For number fields
        "minimum": 0,
        "maximum": 100,
        "allow_decimal": 0
      },
      "visible": {                 // Conditional visibility
        "other_field": "required|is:value"
      },
      "prefill": {                 // Default value
        "value": "default"
      }
    }
  }
}
```

### Conditional Visibility

Fields can be shown/hidden based on other field values using the `visible` property:

```typescript
{
  "visible": {
    "duration": "required|is:full"
  }
}
```

Supported conditions:
- `required`: Field must have a value
- `is:value`: Field must equal the specified value
- `not:value`: Field must not equal the specified value

Multiple conditions can be combined with `|` (all must be true).

---

## 🛠️ Tech Stack

| Category | Technology | Version |
|----------|-----------|---------|
| **Framework** | Vue | 3.5.22 |
| **Language** | TypeScript | 5.9.3 |
| **Build Tool** | Rolldown (Vite) | 7.1.14 |
| **State Management** | Pinia | 3.0.3 |
| **Styling** | Tailwind CSS | 4.1.15 |
| **Validation** | Zod | 4.1.12 |
| **Router** | @kitbag/router | 0.20.6 |
| **Utilities** | VueUse | 14.0.0 |
| **Linter** | Oxlint | 1.23.0 |
| **Package Manager** | Bun | Latest |

---

## 📝 Usage Guide

### Building a Form

1. **Add Fields**: Click on field type buttons in the left sidebar
2. **Configure Fields**: Click on a field to select it, then edit properties in the right panel
3. **Reorder Fields**: Drag and drop fields to reorder them
4. **Preview**: Toggle preview to see how your form looks
5. **Export**: Click "Export JSON" to save your form schema
6. **Import**: Load existing schemas via "Import JSON"

---